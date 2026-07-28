<div>
    <x-slot name="header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Meus Orçamentos
                </h2>
                <p className="text-xs text-gray-500">Gerencie seus orçamentos emitidos com facilidade</p>
            </div>
            <a href="{{ route('quotes.create') }}" class="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700">
                + Novo Orçamento
            </a>
        </div>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            @if (session()->has('message'))
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                    {{ session('message') }}
                </div>
            @endif

            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    wire:model.live="search"
                    placeholder="Buscar por cliente ou código..."
                    class="w-full sm:w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div class="text-xs text-gray-500">
                    Total: <strong>{{ count($quotes) }}</strong> orçamentos
                </div>
            </div>

            @if (count($quotes) === 0)
                <div class="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
                    <p class="text-gray-500 text-sm">Nenhum orçamento encontrado.</p>
                    <a href="{{ route('quotes.create') }}" class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                        Criar meu primeiro orçamento
                    </a>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @foreach ($quotes as $quote)
                        <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                            <div>
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-mono font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                                        {{ $quote->code }}
                                    </span>
                                    <span class="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {{ ucfirst($quote->status) }}
                                    </span>
                                </div>
                                <h3 class="text-base font-bold text-gray-900 mt-3">{{ $quote->client_name }}</h3>
                                <p class="text-xs text-gray-500 mt-1">Total: <strong class="text-gray-900 text-sm">R$ {{ number_format($quote->total_amount, 2, ',', '.') }}</strong></p>
                            </div>

                            <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                <div class="flex gap-2">
                                    <a href="{{ route('quotes.edit', $quote->id) }}" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                        Editar
                                    </a>
                                    <a href="{{ route('quotes.public', $quote->public_token) }}" target="_blank" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold">
                                        Ver / Compartilhar
                                    </a>
                                </div>
                                <button
                                    wire:click="deleteQuote('{{ $quote->id }}')"
                                    wire:confirm="Tem certeza de que deseja excluir este orçamento?"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif

        </div>
    </div>
</div>
