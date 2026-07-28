<div>
    <x-slot name="header">
        <div class="flex items-center gap-3">
            <a href="{{ route('dashboard') }}" class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                ← Voltar
            </a>
            <div>
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    {{ $quoteId ? 'Editar Orçamento' : 'Novo Orçamento' }}
                </h2>
                <p class="text-xs text-gray-500">Preencha as informações do cliente e os serviços prestados</p>
            </div>
        </div>
    </x-slot>

    <div class="py-6">
        <form wire:submit="save" class="max-w-4xl mx-auto space-y-6">

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 class="font-bold text-gray-900 border-b border-gray-100 pb-2">Dados do Cliente</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Nome do Cliente *</label>
                        <input
                            type="text"
                            wire:model="client_name"
                            required
                            placeholder="Ex: Maria Santos"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        @error('client_name') <span class="text-xs text-red-500 mt-1 block">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">CPF / CNPJ</label>
                        <input
                            type="text"
                            wire:model="client_document"
                            placeholder="000.000.000-00"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            wire:model="client_email"
                            placeholder="cliente@email.com"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Telefone</label>
                        <input
                            type="text"
                            wire:model="client_phone"
                            placeholder="(11) 99999-9999"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 class="font-bold text-gray-900">Itens e Serviços</h3>
                    <button
                        type="button"
                        wire:click="addItem"
                        class="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                    >
                        + Adicionar Item
                    </button>
                </div>

                <div class="space-y-3">
                    @foreach ($items as $index => $item)
                        <div class="flex flex-col md:flex-row gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div class="flex-1 w-full">
                                <label class="block text-[11px] font-semibold text-gray-600 mb-1">Descrição</label>
                                <input
                                    type="text"
                                    wire:model="items.{{ $index }}.description"
                                    required
                                    placeholder="Ex: Reforma de pintura residencial"
                                    class="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md"
                                />
                            </div>

                            <div class="w-full md:w-28">
                                <label class="block text-[11px] font-semibold text-gray-600 mb-1">Qtd</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    wire:model.live="items.{{ $index }}.quantity"
                                    class="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md text-center"
                                />
                            </div>

                            <div class="w-full md:w-36">
                                <label class="block text-[11px] font-semibold text-gray-600 mb-1">Preço Unit. (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    wire:model.live="items.{{ $index }}.unit_price"
                                    class="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md text-right"
                                />
                            </div>

                            <button
                                type="button"
                                wire:click="removeItem({{ $index }})"
                                class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                title="Remover"
                            >
                                ✕
                            </button>
                        </div>
                    @endforeach
                </div>

                <div class="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="w-full md:w-48">
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Desconto (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            wire:model.live="discount"
                            class="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <div class="text-right space-y-1 w-full md:w-auto">
                        <p class="text-xs text-gray-500">Subtotal: R$ {{ number_format($subtotal, 2, ',', '.') }}</p>
                        <p class="text-lg font-bold text-gray-900">Total: <span class="text-emerald-600">R$ {{ number_format($total, 2, ',', '.') }}</span></p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <a href="{{ route('dashboard') }}" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    Cancelar
                </a>
                <button
                    type="submit"
                    class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm"
                >
                    Salvar Orçamento
                </button>
            </div>

        </form>
    </div>
</div>
