/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Quote, QuoteItem, Company } from '../types';
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, HelpCircle, Check, Smartphone, Mail, Building, Calculator, FileText, Percent, Info } from 'lucide-react';

interface QuoteFormPageProps {
  company: Company;
  quoteIdToEdit?: string; // If provided, we are editing
  onBack: () => void;
  onSaveSuccess: (savedQuote: Quote & { items: QuoteItem[] }) => void;
}

export default function QuoteFormPage({ company, quoteIdToEdit, onBack, onSaveSuccess }: QuoteFormPageProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- FORM STATES ---
  // Step 1: Client Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [title, setTitle] = useState('');

  // Step 2: Items
  interface TempItem {
    id: string;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
  }
  const [items, setItems] = useState<TempItem[]>([
    { id: '1', name: '', description: '', quantity: 1, unit: 'unidade', unit_price: 0 }
  ]);

  // Step 3: Conditions
  const [validityDays, setValidityDays] = useState('7 dias');
  const [executionTime, setExecutionTime] = useState('Immediate');
  const [paymentTerms, setPaymentTerms] = useState('Pix');
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [additionalTerms, setAdditionalTerms] = useState('');

  // Load quote details if in edit mode
  useEffect(() => {
    if (!quoteIdToEdit) {
      // PRE-FILL PRESETS on CREATE
      const defVal = localStorage.getItem('orcapro_def_validity');
      const defPay = localStorage.getItem('orcapro_def_payment');
      const defNotes = localStorage.getItem('orcapro_def_notes');
      
      if (defVal) setValidityDays(defVal);
      if (defPay) setPaymentTerms(defPay);
      if (defNotes) setNotes(defNotes);
      return;
    }

    const fetchQuoteToEdit = async () => {
      try {
        setIsLoading(true);
        const res = await api.getQuote(quoteIdToEdit);
        setCustomerName(res.customer_name);
        setCustomerPhone(res.customer_phone || '');
        setCustomerEmail(res.customer_email || '');
        setCustomerCompany(res.customer_company || '');
        setTitle(res.title);
        
        // Convert to temp items
        const formattedItems = res.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price
        }));
        setItems(formattedItems.length > 0 ? formattedItems : [{ id: '1', name: '', description: '', quantity: 1, unit: 'unidade', unit_price: 0 }]);
        
        setValidityDays(res.validity_days);
        setExecutionTime(res.execution_time);
        setPaymentTerms(res.payment_terms);
        setDiscount(res.discount || 0);
        setNotes(res.notes || '');
        setAdditionalTerms(res.additional_terms || '');
      } catch (err: any) {
        setError('Erro ao carregar dados do orçamento: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuoteToEdit();
  }, [quoteIdToEdit]);

  // Subtotals calculator
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return Math.max(0, sub - discount);
  };

  // Item helpers
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        description: '',
        quantity: 1,
        unit: 'unidade',
        unit_price: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof TempItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      return { ...item, [field]: value };
    }));
  };

  const handleSave = async () => {
    setError(null);

    // Validations
    if (!customerName.trim()) {
      setStep(1);
      setError('O nome do cliente é obrigatório.');
      return;
    }
    if (!title.trim()) {
      setStep(1);
      setError('O título do orçamento é obrigatório.');
      return;
    }

    // Filter empty items or trigger error
    const emptyItems = items.filter(it => !it.name.trim());
    if (emptyItems.length > 0) {
      setStep(2);
      setError('Preencha o nome de todos os itens adicionados.');
      return;
    }

    setIsLoading(true);

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_company: customerCompany,
      title,
      validity_days: validityDays,
      execution_time: executionTime,
      payment_terms: paymentTerms,
      discount: discount,
      notes,
      additional_terms: additionalTerms,
      items: items.map(it => ({
        name: it.name,
        description: it.description,
        quantity: it.quantity,
        unit: it.unit,
        unit_price: it.unit_price
      }))
    };

    try {
      let saved;
      if (quoteIdToEdit) {
        saved = await api.updateQuote(quoteIdToEdit, payload);
      } else {
        saved = await api.createQuote(payload);
      }
      onSaveSuccess(saved);
    } catch (err: any) {
      setError(err.message || 'Erro ao gravar orçamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const unitPresets = [
    'unidade',
    'hora',
    'dia',
    'metro',
    'm²',
    'serviço',
    'projeto'
  ];

  const validityPresets = [
    '7 dias',
    '15 dias',
    '30 dias',
    'Customizado'
  ];

  const paymentPresets = [
    'Pix',
    'Dinheiro',
    'Cartão de Crédito',
    'Transferência / Boleto',
    'Customizado'
  ];

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const brandColor = company?.primary_color || '#136F63';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <button
          onClick={onBack}
          className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
            {quoteIdToEdit ? 'Editar orçamento' : 'Criar novo orçamento'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Siga as 3 etapas rápidas para montar o orçamento profissional.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Stepper Wizard Indicator */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <button
                type="button"
                onClick={() => setStep(num)}
                className={`w-9 h-9 rounded-full font-semibold text-sm flex items-center justify-center transition-all ${
                  step === num
                    ? 'text-white shadow-xs scale-105 font-bold'
                    : step > num
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold'
                    : 'text-slate-400 bg-slate-100 border border-transparent'
                }`}
                style={step === num ? { backgroundColor: brandColor } : {}}
              >
                {step > num ? <Check className="w-4.5 h-4.5" /> : num}
              </button>
              {num < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > num ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-semibold text-slate-400 px-1 uppercase tracking-wider">
          <span className={step === 1 ? 'text-[#136F63] font-bold' : ''}>Cliente</span>
          <span className={step === 2 ? 'text-[#136F63] font-bold' : ''}>Itens</span>
          <span className={step === 3 ? 'text-[#136F63] font-bold' : ''}>Condições</span>
        </div>
      </div>

      {/* Split screen content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Area (Step-based) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-xs">
          
          {/* STEP 1: CLIENT AND TITLE */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight mb-4">Etapa 1: Dados do Cliente</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Título do Orçamento <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Instalação de Ar-Condicionado ou Reforma de Pintura"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Nome do Cliente <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva ou Mariana Pinheiro"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 11999999999"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Empresa / Residência (Opcional)</label>
                  <input
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="Ex: Condomínio Vista Verde"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SERVICES / ITEMS */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">Etapa 2: Itens do Orçamento</h3>
                
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-[#136F63] bg-teal-50/30 hover:bg-teal-50 hover:border-[#136F63]/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar item</span>
                </button>
              </div>

              {/* Items List Wrapper */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 relative group">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">Item #{index + 1}</span>
                      
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                          title="Remover este item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-7">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título do Serviço / Produto <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            placeholder="Ex: Mão de obra ou Disjuntor Din 20A"
                            className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#136F63] text-xs text-slate-900 bg-white"
                          />
                        </div>

                        <div className="sm:col-span-5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Unidade</label>
                          <select
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                            className="block w-full px-2 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#136F63] text-xs text-slate-900"
                          >
                            {unitPresets.map(preset => (
                              <option key={preset} value={preset}>{preset}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quantidade</label>
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            required
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#136F63] text-xs text-slate-900 bg-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Unitário (R$)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={item.unit_price}
                            onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                            className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#136F63] text-xs text-slate-900 bg-white font-mono"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <div className="bg-slate-100/70 border border-slate-200 rounded-lg px-3 py-2 text-right">
                            <span className="text-[9px] font-semibold text-slate-400 block uppercase">Subtotal</span>
                            <span className="text-xs font-bold font-mono text-slate-800">{formatBRL(item.quantity * item.unit_price)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descrição Adicional (Opcional)</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Detalhes opcionais sobre garantia, marca, material ou escopo..."
                          className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#136F63] text-xs text-slate-900 resize-none bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-200 hover:border-[#136F63]/30 rounded-xl text-slate-600 hover:text-[#136F63] hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>Adicionar outro item</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EXECUTION / CONDITIONS */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight mb-4">Etapa 3: Condições Comerciais</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Validade do Orçamento</label>
                  <div className="mt-1 flex gap-2">
                    <select
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900"
                    >
                      {validityPresets.map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Prazo de Execução / Entrega</label>
                  <input
                    type="text"
                    value={executionTime}
                    onChange={(e) => setExecutionTime(e.target.value)}
                    placeholder="Ex: 2 dias úteis ou Imediato"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Forma de Pagamento</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Ex: Pix ou 3x sem juros"
                    className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Desconto Especial (R$)</label>
                  <div className="mt-1 relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs font-semibold">R$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={discount || ''}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      className="block w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Observações Gerais</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções gerais, termos de garantia, inclusões ou exclusões..."
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Termos Adicionais / Contrato (Opcional)</label>
                <textarea
                  rows={3}
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                  placeholder="Ex: Assinatura ou disposições legais formais..."
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 resize-none"
                />
              </div>
            </div>
          )}

          {/* Stepper Buttons Panel */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (step === 1) onBack();
                else setStep(step - 1);
              }}
              className="px-4.5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? 'Cancelar' : 'Voltar'}</span>
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!customerName.trim() || !title.trim())) {
                    setError('O nome do cliente e o título são obrigatórios.');
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                className="px-5 py-2.5 bg-[#136F63] hover:bg-[#0e5047] text-white rounded-xl text-sm font-semibold shadow-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: brandColor }}
              >
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSave}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Gravar Orçamento</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Right Preview Card Area (STRICTLY SPECIFIED AS HIGHLY PREFERRED FOR DESKTOP SPLIT PREVIEW) */}
        <div className="lg:col-span-5 space-y-0">
          <div className="bg-white border border-slate-200 border-b-0 text-slate-800 px-4 py-3 rounded-t-xl flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Prévia em Tempo Real</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-semibold">Ao vivo</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-b-xl shadow-xs p-5 space-y-5 text-slate-800 text-xs scale-95 origin-top transition-all max-h-[700px] overflow-y-auto">
            
            {/* Live Header */}
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start gap-2">
              <div>
                <h4 className="font-bold text-slate-950 text-sm leading-tight">{company?.name || 'Minha Empresa'}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Responsável: {company?.responsible_name || 'Seu Nome'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{company?.whatsapp || 'Whats não configurado'}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">
                {company?.logo_url ? (
                  <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : 'OP'}
              </div>
            </div>

            {/* Live Client Block */}
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-4 text-[11px]">
              <div>
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Cliente</span>
                <p className="font-bold text-slate-900 mt-0.5">{customerName || 'Nome do Cliente'}</p>
                <p className="text-slate-500 mt-0.5">{customerCompany || 'Empresa'}</p>
                <p className="text-slate-500">{customerPhone || 'WhatsApp'}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Orçamento</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">ORC-XXXX</p>
                <p className="text-slate-500 mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Live Service title */}
            <div className="py-1">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">Serviço</span>
              <h5 className="font-bold text-slate-900 text-xs mt-0.5">{title || 'Título do Orçamento'}</h5>
            </div>

            {/* Live Items Table */}
            <div className="space-y-2">
              <div className="border-b border-slate-100 pb-1.5 flex justify-between font-semibold text-slate-400 text-[10px]">
                <span>Descrição</span>
                <span>Subtotal</span>
              </div>
              
              <div className="space-y-2 divide-y divide-slate-100 max-h-36 overflow-y-auto">
                {items.map((it, idx) => (
                  <div key={it.id} className="pt-2 flex justify-between gap-4 text-[11px]">
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-900 truncate">{it.name || `Item ${idx+1}`}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Qtd: {it.quantity || 1} {it.unit}</p>
                    </div>
                    <span className="font-mono font-semibold text-slate-950 shrink-0">{formatBRL((it.quantity || 1) * (it.unit_price || 0))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Totals */}
            <div className="border-t border-slate-100 pt-4 flex flex-col items-end space-y-1">
              <div className="w-full max-w-[180px] space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-950">{formatBRL(calculateSubtotal())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Desconto:</span>
                    <span className="font-mono">- {formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-slate-100 pt-1.5 text-slate-900">
                  <span>Total:</span>
                  <span className="font-mono text-sm" style={{ color: brandColor }}>{formatBRL(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Live Conditions */}
            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-[10px] text-slate-500">
              <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <p><strong>Validade:</strong> {validityDays}</p>
                <p><strong>Prazo:</strong> {executionTime || 'A combinar'}</p>
                <p className="truncate"><strong>Pagamento:</strong> {paymentTerms}</p>
              </div>
              <div className="p-1 leading-normal italic truncate">
                {notes ? notes.substring(0, 100) + '...' : 'Sem observações.'}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
