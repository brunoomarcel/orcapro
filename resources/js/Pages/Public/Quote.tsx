import React, { useState, useEffect } from 'react';
import { Smartphone, Mail, MapPin, Printer, MessageSquare, AlertCircle, Calendar, CreditCard, Clock, FileText, Check } from 'lucide-react';

interface PublicQuotePageProps {
  quote?: any;
}

export default function PublicQuotePage({ quote: serverQuote }: PublicQuotePageProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!serverQuote);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serverQuote) {
      setData({
        quote: serverQuote,
        items: serverQuote.items || [],
        company: serverQuote.company,
      });
      setIsLoading(false);
      return;
    }

    const token = window.location.pathname.split('/o/')[1];
    if (!token) {
      setError('Token do orçamento não fornecido.');
      setIsLoading(false);
      return;
    }

    fetch(`/api/quotes/public/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Orçamento não encontrado');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Orçamento não encontrado ou link expirado.');
        setIsLoading(false);
      });
  }, [serverQuote]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#136F63]/20 border-t-[#136F63] rounded-full animate-spin" />
        <p className="text-sm text-slate-500 mt-4 font-semibold">Carregando orçamento profissional...</p>
      </div>
    );
  }

  if (error || !data || !data.quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ops! Orçamento não encontrado</h1>
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

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMsg = `Olá! Recebi o orçamento *${quote.quote_number || quote.code}* e gostaria de falar sobre ele.`;
  const cleanCompPhone = company?.whatsapp ? company.whatsapp.replace(/\D/g, '') : '';
  const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanCompPhone.startsWith('55') || cleanCompPhone.length === 0 ? cleanCompPhone : '55' + cleanCompPhone}&text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Você está visualizando uma versão oficial segura do orçamento.</span>
          </div>

          <div className="flex gap-2 shrink-0">
            {company?.whatsapp && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              {company?.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="h-14 max-w-[200px] object-contain" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandColor }}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{company?.name || 'Prestador de Serviço'}</span>
                </div>
              )}

              <div className="space-y-1 text-xs text-slate-500">
                {company?.document && <p>CNPJ/CPF: {company.document}</p>}
                {company?.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{company.email}</p>}
                {company?.whatsapp && <p className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-slate-400" />{company.whatsapp}</p>}
                {company?.address && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{company.address}</p>}
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
                {quote.quote_number || quote.code}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">Orçamento</h2>
              <p className="text-xs text-slate-400">Emitido em: {formatDate(quote.created_at)}</p>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Cliente / Destinatário</span>
                <h3 className="text-base font-bold text-slate-900">{quote.customer_name || quote.client_name}</h3>
                {quote.customer_phone && <p className="text-xs text-slate-500 mt-0.5">{quote.customer_phone}</p>}
                {quote.customer_email && <p className="text-xs text-slate-500">{quote.customer_email}</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Itens do Orçamento</span>
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Descrição</th>
                      <th className="py-3 px-4 text-center">Qtd</th>
                      <th className="py-3 px-4 text-right">Preço Unit.</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {items && items.map((item: any, idx: number) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{item.name || item.description}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium text-slate-600">{item.quantity}</td>
                        <td className="py-3.5 px-4 text-right text-slate-600">{formatBRL(item.unit_price)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatBRL(item.total || item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatBRL(quote.subtotal || quote.total_amount)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Desconto:</span>
                    <span>- {formatBRL(quote.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Geral:</span>
                  <span style={{ color: brandColor }}>{formatBRL(quote.total || quote.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
