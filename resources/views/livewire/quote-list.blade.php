<div>
    <!-- Top Header -->
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 class="font-heading font-extrabold text-3xl text-on-surface tracking-tight">Painel de Controle</h1>
            <p class="text-secondary text-sm mt-1">Visão geral dos seus orçamentos e clientes</p>
        </div>
        <a href="{{ route('quotes.create') }}" class="bg-primary text-on-primary font-heading font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm hover:bg-primary-container transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined text-lg">add</span>
            <span>Novo Orçamento</span>
        </a>
    </header>

    @if (session()->has('message'))
        <div class="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-base">check_circle</span>
            <span>{{ session('message') }}</span>
        </div>
    @endif

    <!-- Search & Filter Header -->
    <div class="glass-card p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="relative w-full sm:w-96">
            <span class="material-symbols-outlined text-outline absolute left-3.5 top-1/2 -translate-y-1/2 text-xl">search</span>
            <input
                type="text"
                wire:model.live="search"
                placeholder="Buscar por cliente, código do orçamento..."
                class="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all"
            />
        </div>
        <div class="text-xs text-secondary font-semibold">
            Mostrando <span class="text-on-surface font-bold">{{ count($quotes) }}</span> orçamentos
        </div>
    </div>

    <!-- Quotes Grid -->
    @if (count($quotes) === 0)
        <div class="glass-card rounded-2xl p-16 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-3xl">description</span>
            </div>
            <div>
                <h3 class="font-heading font-bold text-lg text-on-surface">Nenhum orçamento encontrado</h3>
                <p class="text-secondary text-sm mt-1">Crie seu primeiro orçamento profissional em poucos passos.</p>
            </div>
            <a href="{{ route('quotes.create') }}" class="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-heading font-bold text-sm">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Novo Orçamento</span>
            </a>
        </div>
    @else
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach ($quotes as $quote)
                <div class="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-primary/40 hover:shadow-md transition-all">
                    <div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-mono font-bold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-lg">
                                {{ $quote->code }}
                            </span>
                            @php
                                $statusStyles = [
                                    'draft' => 'bg-gray-100 text-gray-700 border-gray-200',
                                    'sent' => 'bg-blue-50 text-blue-700 border-blue-200',
                                    'approved' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                    'rejected' => 'bg-red-50 text-red-700 border-red-200',
                                ][$quote->status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
                            @endphp
                            <span class="text-[11px] font-bold px-3 py-0.5 rounded-full border {{ $statusStyles }}">
                                {{ ucfirst($quote->status) }}
                            </span>
                        </div>

                        <h3 class="font-heading font-bold text-base text-on-surface mt-4 truncate">{{ $quote->client_name }}</h3>
                        <p class="text-xs text-secondary mt-1">Total do Orçamento:</p>
                        <p class="text-xl font-heading font-extrabold text-primary mt-0.5">
                            R$ {{ number_format($quote->total_amount, 2, ',', '.') }}
                        </p>
                    </div>

                    <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                        <div class="flex gap-2">
                            <a href="{{ route('quotes.edit', $quote->id) }}" class="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-colors">
                                <span class="material-symbols-outlined text-sm">edit</span>
                                <span>Editar</span>
                            </a>
                            <a href="{{ route('quotes.public', $quote->public_token) }}" target="_blank" class="flex items-center gap-1 px-3 py-1.5 bg-tertiary/10 text-tertiary font-bold rounded-lg hover:bg-tertiary/20 transition-colors">
                                <span class="material-symbols-outlined text-sm">visibility</span>
                                <span>Ver</span>
                            </a>
                        </div>
                        <button
                            wire:click="deleteQuote('{{ $quote->id }}')"
                            wire:confirm="Tem certeza de que deseja excluir permanentemente este orçamento?"
                            class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                        >
                            <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
