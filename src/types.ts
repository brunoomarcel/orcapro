/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  responsible_name: string;
  whatsapp: string;
  email: string;
  address: string;
  document?: string;
  logo_url?: string; // Stored as a base64 string or image URL
  primary_color: string; // Hex color, defaults to #136F63
}

export interface Quote {
  id: string;
  company_id: string;
  quote_number: string;
  public_token: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_company?: string;
  title: string;
  validity_days: string; // e.g. "7", "15", "30", "personalizado"
  validity_custom_date?: string; // Date string if customized
  execution_time: string;
  payment_terms: string; // e.g. "Pix", "dinheiro", "cartao", etc.
  discount: number; // Discount value in R$ or % (we'll use flat R$ or let user define)
  notes?: string;
  additional_terms?: string;
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string; // e.g. "unidade", "hora", "dia", "metro", "m²", "servico"
  unit_price: number;
  total: number;
  position: number;
}
