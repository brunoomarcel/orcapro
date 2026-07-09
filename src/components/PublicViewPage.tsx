/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Quote, QuoteItem, Company } from '../types';
import { Smartphone, Mail, MapPin, Printer, MessageSquare, AlertCircle, Calendar, CreditCard, Clock, FileText, Check } from 'lucide-react';

interface PublicViewPageProps {
  token: string;
}

export default function PublicViewPage({ token }: PublicViewPageProps) {
  const [data, setData] = useState<{ quote: Quote; items: QuoteItem[]; company: Company } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicQuote = async () => {
      try {
        setIsLoading(true);
        const res = await api.getPublicQuote(token);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Orçamento não encontrado ou link expirado.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicQuote();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#136F63]/20 border-t-[#136F63] rounded-full animate-spin" />
        <p className="text-sm text-slate-500 mt-4 font-semibold">Carregando orçamento profissional...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Ops! Orçamento não encontrado</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md">
          {error || 'O link que você acessou pode estar incorreto ou o orçamento foi removido pelo prestador.'}
        </p>
        <div className="mt-6">
          <span className="text-xs text-slate-400">Powered by OrçaPro</span>
        </div>
      </div>
    );
  }

  const { quote, items, company } = data;
  const brandColor = company?.primary_color || '#136F63';

  // Format currency
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Format Date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  // Triggers print view
  const handlePrint = () => {
    window.print();
  };

  // Preloaded WhatsApp link to the company's number
  const whatsappMsg = `Olá! Recebi o orçamento *${quote.quote_number}* para *"${quote.title}"* e gostaria de falar sobre ele.`;
  const cleanCompPhone = company?.whatsapp ? company.whatsapp.replace(/\D/g, '') : '';
  const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanCompPhone.startsWith('55') || cleanCompPhone.length === 0 ? cleanCompPhone : '55' + cleanCompPhone}&text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-12 px-4 print-m-0">
      
      {/* Container holding the invoice card */}
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Floating Actions for Client (hidden when printing) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Você está visualizando uma versão oficial segura do orçamento.</span>
          </div>
          
          <div className="flex gap-2 shrink-0">
            {company?.whatsapp && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: brandColor }}
                className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 text-white font-semibold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            )}
            
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Salvar / Imprimir PDF
            </button>
          </div>
        </div>

        {/* Invoice Page Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-10 relative overflow-hidden print-card">
          
          {/* Top Brand Color Strip */}
          <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: brandColor }} />

          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-4">
              
              {/* Logo */}
              {company?.logo_url ? (
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 overflow-hidden">
                  <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: brandColor }}>
                  {company?.name ? company.name.substring(0, 2).toUpperCase() : 'OP'}
                </div>
              )}

              <div>
                <h1 className="text-xl font-bold text-slate-950 font-sans tracking-tight leading-tight">{company?.name || 'Prestador de Serviços'}</h1>
                {company?.responsible_name && (
                  <p className="text-xs text-slate-500 mt-1">Responsável: <span className="font-semibold text-slate-700">{company.responsible_name}</span></p>
                )}
              </div>
            </div>

            {/* Provider Details */}
            <div className="text-xs text-slate-600 space-y-2 md:text-right md:max-w-xs">
              {company?.document && (
                <p className="font-mono"><strong>CNPJ/CPF:</strong> {company.document}</p>
              )}
              {company?.whatsapp && (
                <p className="flex items-center md:justify-end gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.whatsapp}</span>
                </p>
              )}
              {company?.email && (
                <p className="flex items-center md:justify-end gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.email}</span>
                </p>
              )}
              {company?.address && (
                <p className="flex items-start md:justify-end gap-1.5 leading-normal">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 md:mt-0.5" />
                  <span className="text-slate-500">{company.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quote Identifier Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente</span>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-tight">{quote.customer_name}</h2>
              {quote.customer_company && (
                <p className="text-xs text-slate-500 mt-0.5">{quote.customer_company}</p>
              )}
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                {quote.customer_phone && (
                  <p className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quote.customer_phone}</span>
                  </p>
                )}
                {quote.customer_email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quote.customer_email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="md:text-right space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Orçamento</span>
                <p className="text-lg font-mono font-bold text-slate-950 mt-0.5" style={{ color: brandColor }}>{quote.quote_number}</p>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Emissão:</strong> {formatDate(quote.created_at)}</p>
                <p><strong>Status:</strong> <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">Válido</span></p>
              </div>
            </div>
          </div>

          {/* Title block */}
          <div className="py-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Serviço Solicitado</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">{quote.title}</h3>
          </div>

          {/* Items breakdown - Responsive table */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Detalhamento dos Itens</span>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="py-3 pr-4">Item & Descrição</th>
                    <th className="py-3 px-4 text-center">Quant.</th>
                    <th className="py-3 px-4 text-center">Unidade</th>
                    <th className="py-3 px-4 text-right">Unitário</th>
                    <th className="py-3 pl-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-3.5 pr-4 max-w-sm">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-line">{item.description}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-800">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-center text-xs text-slate-500">{item.unit}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">{formatBRL(item.unit_price)}</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-slate-950">{formatBRL(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden space-y-3.5">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">{item.name}</h4>
                    <span className="text-sm font-bold text-slate-950 font-mono shrink-0">{formatBRL(item.total)}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed pb-1">{item.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-2 font-mono">
                    <span>Qtd: <strong>{item.quantity}</strong> ({item.unit})</span>
                    <span>Unit: <strong>{formatBRL(item.unit_price)}</strong></span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Pricing Summary */}
          <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col items-end space-y-2">
            <div className="w-full sm:max-w-xs space-y-2.5 text-sm text-slate-600">
              <div className="flex justify-between font-medium">
                <span>Subtotal dos itens:</span>
                <span className="font-mono text-slate-800">{formatBRL(quote.subtotal)}</span>
              </div>
              
              {quote.discount > 0 && (
                <div className="flex justify-between font-medium text-emerald-600">
                  <span>Desconto aplicado:</span>
                  <span className="font-mono">- {formatBRL(quote.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Valor Total:</span>
                <span className="font-mono text-lg" style={{ color: brandColor }}>{formatBRL(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Conditions / Metadata Block */}
          <div className="mt-10 border-t border-slate-200 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Condições</span>
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Validade:</strong> {quote.validity_days}</span>
              </p>
              {quote.payment_terms && (
                <p className="flex items-center gap-1.5 mt-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate"><strong>Pagamento:</strong> {quote.payment_terms}</span>
                </p>
              )}
              {quote.execution_time && (
                <p className="flex items-center gap-1.5 mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>Prazo:</strong> {quote.execution_time}</span>
                </p>
              )}
            </div>

            {/* Notes / Remarks */}
            <div className="sm:col-span-2 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Observações Importantes</span>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-amber-50/20 border border-amber-100/50 p-4 rounded-xl">
                {quote.notes || 'Nenhuma observação informada.'}
              </p>
            </div>
          </div>

          {/* Terms signature template */}
          {quote.additional_terms && (
            <div className="mt-6 text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Termos Adicionais</span>
              <p className="whitespace-pre-line">{quote.additional_terms}</p>
            </div>
          )}

          {/* Branding footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-[11px] text-slate-400 flex items-center justify-between no-print">
            <p>Orçamento gerado por <span className="font-bold text-slate-500">OrçaPro</span></p>
            <p className="hidden sm:block">Fácil, rápido e profissional.</p>
          </div>

        </div>

      </div>

      {/* Floating Mobile Sticky Bar for quick CTA */}
      {company?.whatsapp && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 bg-white rounded-2xl p-3 shadow-xl border border-slate-200/80 flex gap-2 z-40 no-print animate-slide-up">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: brandColor }}
            className="flex-1 inline-flex justify-center items-center gap-2 py-3 px-4 text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Responder no WhatsApp
          </a>
          <button
            onClick={handlePrint}
            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center cursor-pointer"
            title="Salvar PDF / Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
