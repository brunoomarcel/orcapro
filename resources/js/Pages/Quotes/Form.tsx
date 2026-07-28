import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface QuoteFormProps {
  quote?: any;
  company?: any;
}

export default function QuoteForm({ quote, company }: QuoteFormProps) {
  const brandColor = company?.primary_color || '#136F63';

  const { data, setData, post, put, processing, errors } = useForm({
    client_name: quote?.client_name || '',
    client_document: quote?.client_document || '',
    client_email: quote?.client_email || '',
    client_phone: quote?.client_phone || '',
    client_address: quote?.client_address || '',
    discount: quote?.discount || 0,
    notes: quote?.notes || '',
    status: quote?.status || 'draft',
    valid_until: quote?.valid_until || '',
    items: quote?.items && quote.items.length > 0 ? quote.items : [
      { description: '', quantity: 1, unit_price: 0 }
    ],
  });

  const handleAddItem = () => {
    setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (data.items.length <= 1) return;
    const updated = data.items.filter((_: any, idx: number) => idx !== index);
    setData('items', updated);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...data.items];
    updated[index][field] = value;
    setData('items', updated);
  };

  const subtotal = data.items.reduce((acc: number, item: any) => {
    return acc + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
  }, 0);

  const total = Math.max(0, subtotal - (Number(data.discount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quote) {
      put(`/quotes/${quote.id}`);
    } else {
      post('/quotes');
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {quote ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            <p className="text-xs text-slate-500">Preencha os dados do cliente e os itens do serviço</p>
          </div>
        </div>
      }
    >
      <Head title={quote ? 'Editar Orçamento' : 'Novo Orçamento'} />

      <form onSubmit={handleSubmit} className="py-6 space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Dados do Cliente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente *</label>
              <input
                type="text"
                required
                value={data.client_name}
                onChange={(e) => setData('client_name', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
                placeholder="Ex: João da Silva"
              />
              {errors.client_name && <span className="text-xs text-red-500 mt-1 block">{errors.client_name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF / CNPJ</label>
              <input
                type="text"
                value={data.client_document}
                onChange={(e) => setData('client_document', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={data.client_email}
                onChange={(e) => setData('client_email', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
                placeholder="cliente@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone</label>
              <input
                type="text"
                value={data.client_phone}
                onChange={(e) => setData('client_phone', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#136F63]"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Itens e Serviços</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg"
              style={{ backgroundColor: brandColor }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.items.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 items-end bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Ex: Instalação elétrica residencial"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="w-full md:w-28">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Qtd</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-center"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Preço Unit. (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-right"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Desconto (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.discount}
                onChange={(e) => setData('discount', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="text-right space-y-1 w-full md:w-auto">
              <p className="text-xs text-slate-500">Subtotal: R$ {subtotal.toFixed(2)}</p>
              <p className="text-lg font-bold text-slate-900">Total: <span style={{ color: brandColor }}>R$ {total.toFixed(2)}</span></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <a href="/dashboard" className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200">
            Cancelar
          </a>
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            <Save className="w-4 h-4" />
            <span>{quote ? 'Salvar Alterações' : 'Salvar e Gerar Orçamento'}</span>
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
