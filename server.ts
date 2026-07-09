/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Increase limit to allow base64 company logo uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const DB_FILE = path.join(process.cwd(), 'database.json');

// Interface for Database Structure
interface DBStructure {
  users: any[];
  companies: any[];
  quotes: any[];
  quote_items: any[];
}

// Thread-safe synchronous database read/write
function readDB(): DBStructure {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DBStructure = { users: [], companies: [], quotes: [], quote_items: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file, resetting database.', err);
    const initial: DBStructure = { users: [], companies: [], quotes: [], quote_items: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file.', err);
  }
}

// Generate random UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate readable public share token
function generatePublicToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
  let result = 'ORC-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Auth Middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Não autorizado. Faça login.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const db = readDB();
  const user = db.users.find(u => u.id === token);
  
  if (!user) {
    res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    return;
  }
  
  const company = db.companies.find(c => c.user_id === user.id);
  
  (req as any).user = user;
  (req as any).company = company;
  next();
}

// ==================== API ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Authentication: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    return;
  }

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: 'Este e-mail já está em uso.' });
    return;
  }

  const userId = generateUUID();
  const newUser = { id: userId, name, email, password };
  
  const companyId = generateUUID();
  const newCompany = {
    id: companyId,
    user_id: userId,
    name: 'Minha Empresa',
    responsible_name: name,
    whatsapp: '',
    email: email,
    address: '',
    document: '',
    logo_url: '',
    primary_color: '#136F63'
  };

  db.users.push(newUser);
  db.companies.push(newCompany);
  writeDB(db);

  res.status(201).json({
    token: userId,
    user: { id: userId, name, email },
    company: newCompany
  });
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Preencha todos os campos.' });
    return;
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    return;
  }

  const company = db.companies.find(c => c.user_id === user.id);

  res.json({
    token: user.id,
    user: { id: user.id, name: user.name, email: user.email },
    company
  });
});

// Authentication: Get Current User
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  const company = (req as any).company;
  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    company
  });
});

// Update Account/Password
app.put('/api/auth/account', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { name, email, password } = req.body;

  const db = readDB();
  const dbUser = db.users.find(u => u.id === user.id);
  
  if (!dbUser) {
    res.status(404).json({ error: 'Usuário não encontrado.' });
    return;
  }

  if (name) dbUser.name = name;
  if (email) {
    const existing = db.users.find(u => u.id !== user.id && u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ error: 'E-mail já cadastrado por outro usuário.' });
      return;
    }
    dbUser.email = email;
  }
  if (password) {
    dbUser.password = password;
  }

  writeDB(db);
  res.json({ status: 'success', user: { id: dbUser.id, name: dbUser.name, email: dbUser.email } });
});

// Update Company Settings
app.put('/api/company', requireAuth, (req, res) => {
  const company = (req as any).company;
  const { name, responsible_name, whatsapp, email, address, document, logo_url, primary_color } = req.body;

  const db = readDB();
  const dbCompany = db.companies.find(c => c.id === company.id);

  if (!dbCompany) {
    res.status(404).json({ error: 'Empresa não encontrada.' });
    return;
  }

  dbCompany.name = name || dbCompany.name;
  dbCompany.responsible_name = responsible_name !== undefined ? responsible_name : dbCompany.responsible_name;
  dbCompany.whatsapp = whatsapp !== undefined ? whatsapp : dbCompany.whatsapp;
  dbCompany.email = email !== undefined ? email : dbCompany.email;
  dbCompany.address = address !== undefined ? address : dbCompany.address;
  dbCompany.document = document !== undefined ? document : dbCompany.document;
  dbCompany.logo_url = logo_url !== undefined ? logo_url : dbCompany.logo_url;
  dbCompany.primary_color = primary_color || dbCompany.primary_color;

  writeDB(db);
  res.json(dbCompany);
});

// Get Company Settings
app.get('/api/company', requireAuth, (req, res) => {
  res.json((req as any).company);
});

// GET Quotes (List all with items embedded)
app.get('/api/quotes', requireAuth, (req, res) => {
  const company = (req as any).company;
  const db = readDB();
  
  const companyQuotes = db.quotes.filter(q => q.company_id === company.id);
  
  // Attach items to each quote
  const result = companyQuotes.map(q => {
    const items = db.quote_items
      .filter(item => item.quote_id === q.id)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    return { ...q, items };
  });

  // Sort by date created (newest first)
  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json(result);
});

// GET Single Quote with Items
app.get('/api/quotes/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const company = (req as any).company;
  const db = readDB();

  const quote = db.quotes.find(q => q.id === id && q.company_id === company.id);
  if (!quote) {
    res.status(404).json({ error: 'Orçamento não encontrado.' });
    return;
  }

  const items = db.quote_items
    .filter(item => item.quote_id === quote.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  res.json({ ...quote, items });
});

// POST Create Quote
app.post('/api/quotes', requireAuth, (req, res) => {
  const company = (req as any).company;
  const {
    customer_name,
    customer_phone,
    customer_email,
    customer_company,
    title,
    validity_days,
    validity_custom_date,
    execution_time,
    payment_terms,
    discount,
    notes,
    additional_terms,
    items
  } = req.body;

  if (!customer_name || !title) {
    res.status(400).json({ error: 'Nome do cliente e título são obrigatórios.' });
    return;
  }

  const db = readDB();

  // Sequential quote number calculation
  const companyQuotesCount = db.quotes.filter(q => q.company_id === company.id).length;
  const quoteNum = 1001 + companyQuotesCount;
  const quote_number = `ORC-${quoteNum}`;

  const quoteId = generateUUID();
  const publicToken = generatePublicToken();

  // Validate items and calculate subtotals
  const finalItems = Array.isArray(items) ? items : [];
  let subtotal = 0;
  
  const createdItems = finalItems.map((item, idx) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    const totalItem = qty * price;
    subtotal += totalItem;

    return {
      id: generateUUID(),
      quote_id: quoteId,
      name: item.name || 'Item sem nome',
      description: item.description || '',
      quantity: qty,
      unit: item.unit || 'unidade',
      unit_price: price,
      total: totalItem,
      position: idx
    };
  });

  const discVal = parseFloat(discount) || 0;
  const total = Math.max(0, subtotal - discVal);

  const now = new Date().toISOString();
  const newQuote = {
    id: quoteId,
    company_id: company.id,
    quote_number,
    public_token: publicToken,
    customer_name,
    customer_phone: customer_phone || '',
    customer_email: customer_email || '',
    customer_company: customer_company || '',
    title,
    validity_days: validity_days || '7 dias',
    validity_custom_date: validity_custom_date || '',
    execution_time: execution_time || '',
    payment_terms: payment_terms || '',
    discount: discVal,
    notes: notes || '',
    additional_terms: additional_terms || '',
    subtotal,
    total,
    created_at: now,
    updated_at: now
  };

  db.quotes.push(newQuote);
  db.quote_items.push(...createdItems);
  writeDB(db);

  res.status(201).json({ ...newQuote, items: createdItems });
});

// PUT Update Quote
app.put('/api/quotes/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const company = (req as any).company;
  const {
    customer_name,
    customer_phone,
    customer_email,
    customer_company,
    title,
    validity_days,
    validity_custom_date,
    execution_time,
    payment_terms,
    discount,
    notes,
    additional_terms,
    items
  } = req.body;

  if (!customer_name || !title) {
    res.status(400).json({ error: 'Nome do cliente e título são obrigatórios.' });
    return;
  }

  const db = readDB();
  const quoteIdx = db.quotes.findIndex(q => q.id === id && q.company_id === company.id);
  if (quoteIdx === -1) {
    res.status(404).json({ error: 'Orçamento não encontrado.' });
    return;
  }

  // Remove existing items for this quote
  db.quote_items = db.quote_items.filter(item => item.quote_id !== id);

  // Recalculate and insert new items
  const finalItems = Array.isArray(items) ? items : [];
  let subtotal = 0;
  
  const createdItems = finalItems.map((item, idx) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    const totalItem = qty * price;
    subtotal += totalItem;

    return {
      id: generateUUID(),
      quote_id: id,
      name: item.name || 'Item sem nome',
      description: item.description || '',
      quantity: qty,
      unit: item.unit || 'unidade',
      unit_price: price,
      total: totalItem,
      position: idx
    };
  });

  const discVal = parseFloat(discount) || 0;
  const total = Math.max(0, subtotal - discVal);

  const now = new Date().toISOString();
  const existingQuote = db.quotes[quoteIdx];
  
  const updatedQuote = {
    ...existingQuote,
    customer_name,
    customer_phone: customer_phone || '',
    customer_email: customer_email || '',
    customer_company: customer_company || '',
    title,
    validity_days: validity_days || '7 dias',
    validity_custom_date: validity_custom_date || '',
    execution_time: execution_time || '',
    payment_terms: payment_terms || '',
    discount: discVal,
    notes: notes || '',
    additional_terms: additional_terms || '',
    subtotal,
    total,
    updated_at: now
  };

  db.quotes[quoteIdx] = updatedQuote;
  db.quote_items.push(...createdItems);
  writeDB(db);

  res.json({ ...updatedQuote, items: createdItems });
});

// DELETE Quote
app.delete('/api/quotes/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const company = (req as any).company;
  const db = readDB();

  const quoteIdx = db.quotes.findIndex(q => q.id === id && q.company_id === company.id);
  if (quoteIdx === -1) {
    res.status(404).json({ error: 'Orçamento não encontrado.' });
    return;
  }

  // Delete quote
  db.quotes.splice(quoteIdx, 1);
  // Delete associated items
  db.quote_items = db.quote_items.filter(item => item.quote_id !== id);
  
  writeDB(db);
  res.json({ success: true, message: 'Orçamento excluído com sucesso.' });
});

// POST Duplicate Quote
app.post('/api/quotes/:id/duplicate', requireAuth, (req, res) => {
  const { id } = req.params;
  const company = (req as any).company;
  const db = readDB();

  const existingQuote = db.quotes.find(q => q.id === id && q.company_id === company.id);
  if (!existingQuote) {
    res.status(404).json({ error: 'Orçamento não encontrado.' });
    return;
  }

  const existingItems = db.quote_items.filter(item => item.quote_id === id);

  const newQuoteId = generateUUID();
  const newPublicToken = generatePublicToken();

  // Create duplicate quote with sequential number
  const companyQuotesCount = db.quotes.filter(q => q.company_id === company.id).length;
  const quoteNum = 1001 + companyQuotesCount;
  const quote_number = `ORC-${quoteNum}`;

  const now = new Date().toISOString();
  const duplicatedQuote = {
    ...existingQuote,
    id: newQuoteId,
    quote_number,
    public_token: newPublicToken,
    created_at: now,
    updated_at: now
  };

  const duplicatedItems = existingItems.map(item => ({
    ...item,
    id: generateUUID(),
    quote_id: newQuoteId
  }));

  db.quotes.push(duplicatedQuote);
  db.quote_items.push(...duplicatedItems);
  writeDB(db);

  res.status(201).json({ ...duplicatedQuote, items: duplicatedItems });
});

// ==================== PUBLIC ENDPOINTS ====================

// GET Public Shared Quote (by token, NO AUTH)
app.get('/api/public/quotes/:token', (req, res) => {
  const { token } = req.params;
  const db = readDB();

  const quote = db.quotes.find(q => q.public_token === token);
  if (!quote) {
    res.status(404).json({ error: 'Orçamento não encontrado ou token inválido.' });
    return;
  }

  const company = db.companies.find(c => c.id === quote.company_id);
  const items = db.quote_items
    .filter(item => item.quote_id === quote.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  res.json({
    quote,
    items,
    company: company ? {
      name: company.name,
      responsible_name: company.responsible_name,
      whatsapp: company.whatsapp,
      email: company.email,
      address: company.address,
      document: company.document,
      logo_url: company.logo_url,
      primary_color: company.primary_color
    } : null
  });
});

// ==================== FRONTEND SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Integrate Vite development server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
