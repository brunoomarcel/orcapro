/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Quote, QuoteItem, Company } from '../types';
import { Plus, Search, FileText, Share2, MoreVertical, Edit2, Copy, Trash2, Printer, AlertCircle, RefreshCw, ChevronRight, Check } from 'lucide-react';
import ShareModal from './ShareModal';

interface DashboardPageProps {
  company: Company;
  onCreateNew: () => void;
  onEditQuote: (id: string) => void;
}

export default function DashboardPage({ company, onCreateNew, onEditQuote }: DashboardPageProps) {
  const [quotes, setQuotes] = useState<(Quote & { items: QuoteItem[] })[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<(Quote & { items: QuoteItem[] })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sharing states
  const [activeShareQuote, setActiveShareQuote] = useState<(Quote & { items: QuoteItem[] }) | null>(null);

  // Menu context popovers (per quote ID)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getQuotes();
      setQuotes(res);
      setFilteredQuotes(res);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar orçamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filter based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredQuotes(quotes);
      return;
    }
    const filtered = quotes.filter(q => 
      q.customer_name.toLowerCase().includes(query) ||
      q.title.toLowerCase().includes(query) ||
      q.quote_number.toLowerCase().includes(query) ||
      (q.customer_company && q.customer_company.toLowerCase().includes(query))
    );
    setFilteredQuotes(filtered);
  }, [searchQuery, quotes]);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    try {
      setIsLoading(true);
      const duplicated = await api.duplicateQuote(id);
      // Re-fetch all to keep sorted perfectly
      await fetchQuotes();
    } catch (err: any) {
      setError('Erro ao duplicar orçamento: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (!window.confirm('Tem certeza de que deseja excluir permanentemente este orçamento? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      setIsLoading(true);
      await api.deleteQuote(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err: any) {
      setError('Erro ao excluir orçamento: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (token: string, quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const link = `${window.location.origin}/o/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedTokenId(quoteId);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const handlePrint = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const printWindow = window.open(`/o/${token}`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Close drop-downs when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  const brandColor = company?.primary_color || '#136F63';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title + Action Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Meus orçamentos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie e envie seus orçamentos profissionais em segundos.</p>
        </div>
        
        <button
          onClick={onCreateNew}
          style={{ backgroundColor: brandColor }}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 text-white font-semibold rounded-xl text-sm shadow-sm hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Criar orçamento</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton state */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : quotes.length === 0 ? (
        
        /* SPECIFIED EMPTY STATE */
        <div className="bg-white rounded-2xl border border-slate-200 py-16 px-6 text-center max-w-xl mx-auto space-y-5 shadow-xs mt-10">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-[#136F63]">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Você ainda não criou nenhum orçamento.</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Crie seu primeiro orçamento profissional e compartilhe com seu cliente em poucos minutos.
            </p>
          </div>
          <div>
            <button
              onClick={onCreateNew}
              style={{ backgroundColor: brandColor }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl text-sm shadow-sm hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar orçamento</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="relative rounded-xl shadow-xs max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, título ou número..."
              className="block w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#136F63]/20 focus:border-[#136F63] text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              Nenhum orçamento encontrado para "{searchQuery}".
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase text-slate-500">
                      <th className="py-4.5 px-6">Número / Cliente</th>
                      <th className="py-4.5 px-6">Título do Orçamento</th>
                      <th className="py-4.5 px-6">Emissão</th>
                      <th className="py-4.5 px-6 text-right">Valor Total</th>
                      <th className="py-4.5 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="font-mono font-bold text-slate-950 text-xs">{q.quote_number}</p>
                          <p className="font-semibold text-slate-900 mt-1">{q.customer_name}</p>
                          {q.customer_company && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{q.customer_company}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-slate-700 truncate max-w-xs">{q.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">
                            {q.items?.length || 0} {q.items?.length === 1 ? 'item' : 'itens'}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(q.created_at)}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-slate-950 text-sm">
                          {formatBRL(q.total)}
                        </td>
                        <td className="py-4 px-6 text-right relative">
                          <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditQuote(q.id)}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setActiveShareQuote(q)}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              title="Compartilhar"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            
                            {/* Action Menu Trigger */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === q.id ? null : q.id);
                                }}
                                className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              {/* Popover */}
                              {openMenuId === q.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 text-left animate-fade-in font-sans">
                                  <a
                                    href={`/o/${q.public_token}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                    Ver página pública
                                  </a>
                                  <button
                                    onClick={(e) => handleCopyLink(q.public_token, q.id, e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    {copiedTokenId === q.id ? 'Link copiado!' : 'Copiar link'}
                                  </button>
                                  <button
                                    onClick={(e) => handlePrint(q.public_token, e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    Imprimir / Salvar PDF
                                  </button>
                                  <button
                                    onClick={(e) => handleDuplicate(q.id, e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    Duplicar Orçamento
                                  </button>
                                  <div className="border-t border-slate-100 my-1" />
                                  <button
                                    onClick={(e) => handleDelete(q.id, e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Excluir Orçamento
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View */}
              <div className="block md:hidden space-y-4">
                {filteredQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => onEditQuote(q.id)}
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 space-y-3.5 shadow-xs relative overflow-hidden active:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-active:bg-slate-200" />
                    
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">{q.quote_number}</span>
                        <h3 className="font-bold text-slate-950 text-sm leading-snug mt-0.5 truncate max-w-[200px]">
                          {q.customer_name}
                        </h3>
                        {q.customer_company && (
                          <p className="text-[10px] text-slate-500 truncate">{q.customer_company}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-950 font-mono block">{formatBRL(q.total)}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{formatDate(q.created_at)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100/80 pt-3">
                      <p className="text-xs text-slate-600 font-medium truncate">{q.title}</p>
                    </div>

                    {/* Action Panel for mobile */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100/60" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`/o/${q.public_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shrink-0"
                      >
                        Página Pública
                      </a>
                      <button
                        onClick={() => setActiveShareQuote(q)}
                        className="px-3 py-2 bg-[#136F63]/10 hover:bg-[#136F63]/15 text-[#136F63] text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Compartilhar</span>
                      </button>
                      
                      {/* Secondary quick menu toggle */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === q.id ? null : q.id);
                          }}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        
                        {openMenuId === q.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 text-left animate-fade-in font-sans">
                            <button
                              onClick={(e) => handleCopyLink(q.public_token, q.id, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copiedTokenId === q.id ? 'Copiado!' : 'Copiar link'}
                            </button>
                            <button
                              onClick={(e) => handlePrint(q.public_token, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Salvar PDF
                            </button>
                            <button
                              onClick={(e) => handleDuplicate(q.id, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Duplicar
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={(e) => handleDelete(q.id, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Share Modal Render hook */}
      {activeShareQuote && (
        <ShareModal
          quote={activeShareQuote}
          company={company}
          onClose={() => setActiveShareQuote(null)}
        />
      )}

    </div>
  );
}
