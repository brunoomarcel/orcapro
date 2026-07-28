import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, FileText, Share2, Trash2, Edit2, Copy, Check } from 'lucide-react';

interface DashboardProps {
  quotes: any[];
  company: any;
}

export default function Dashboard({ quotes, company }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const brandColor = company?.primary_color || '#136F63';

  const filteredQuotes = quotes.filter((q) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (q.client_name && q.client_name.toLowerCase().includes(query)) ||
      (q.code && q.code.toLowerCase().includes(query))
    );
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir permanentemente este orçamento?')) {
      router.delete(`/quotes/${id}`);
    }
  };

  const handleCopyLink = (token: string, quoteId: string) => {
    const link = `${window.location.origin}/o/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(quoteId);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Meus Orçamentos</h2>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie seus orçamentos profissionais emitidos</p>
          </div>
          <Link
            href="/quotes/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-90 shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Criar Orçamento</span>
          </Link>
        </div>
      }
    >
      <Head title="Dashboard - OrçaPro" />

      <div className="py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente ou código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#136F63]"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
            Total: <span className="text-slate-900 font-bold">{filteredQuotes.length}</span> orçamentos
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Nenhum orçamento encontrado</h3>
              <p className="text-slate-500 text-xs mt-1">Crie seu primeiro orçamento profissional agora mesmo.</p>
            </div>
            <Link
              href="/quotes/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: brandColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Novo Orçamento</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {quote.code}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {quote.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{quote.client_name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Total: <strong className="text-slate-900 text-sm">{formatBRL(quote.total_amount)}</strong></p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    <Link
                      href={`/quotes/${quote.id}/edit`}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleCopyLink(quote.public_token, quote.id)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      title="Copiar link público"
                    >
                      {copiedTokenId === quote.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                    <a
                      href={`/o/${quote.public_token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      title="Ver orçamento"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(quote.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
