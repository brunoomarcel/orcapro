<div>
    <header class="flex items-center gap-3 mb-6 md:mb-8">
        <a href="{{ route('dashboard') }}" class="p-2 bg-surface-container text-secondary hover:text-on-surface rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
        </a>
        <div>
            <h1 class="font-heading font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
                {{ $quoteId ? 'Editar Orçamento' : 'Novo Orçamento' }}
            </h1>
            <p class="text-secondary text-xs md:text-sm">Preencha os detalhes do cliente e insira os serviços</p>
        </div>
    </header>

    <form wire:submit="save" class="max-w-4xl space-y-6">

        <!-- Client Information Card -->
        <div class="glass-card p-4 md:p-6 rounded-2xl space-y-4">
            <h3 class="font-heading font-bold text-base text-on-surface border-b border-outline-variant/30 pb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">person</span>
                <span>Dados do Cliente</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">Nome do Cliente *</label>
                    <input
                        type="text"
                        wire:model="client_name"
                        required
                        placeholder="Ex: Maria Oliveira"
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                    @error('client_name') <span class="text-xs text-red-500 mt-1 block">{{ $message }}</span> @enderror
                </div>

                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">CPF / CNPJ</label>
                    <input
                        type="text"
                        wire:model="client_document"
                        placeholder="000.000.000-00"
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                </div>

                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">E-mail</label>
                    <input
                        type="email"
                        wire:model="client_email"
                        placeholder="cliente@email.com"
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                </div>

                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">WhatsApp / Telefone</label>
                    <input
                        type="text"
                        wire:model="client_phone"
                        placeholder="(11) 99999-9999"
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                </div>
            </div>
        </div>

        <!-- Line Items Card -->
        <div class="glass-card p-4 md:p-6 rounded-2xl space-y-4">
            <div class="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <h3 class="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-xl">format_list_bulleted</span>
                    <span>Itens & Serviços</span>
                </h3>
                <button
                    type="button"
                    wire:click="addItem"
                    class="bg-primary-fixed text-primary hover:bg-primary/20 px-3.5 py-2 rounded-xl font-heading font-bold text-xs flex items-center gap-1 transition-colors active:scale-95"
                >
                    <span class="material-symbols-outlined text-base">add</span>
                    <span>Adicionar Item</span>
                </button>
            </div>

            <div class="space-y-3">
                @foreach ($items as $index => $item)
                    <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-end bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 relative">
                        <div class="flex-1 w-full">
                            <label class="block text-[11px] font-bold text-secondary mb-1">Descrição</label>
                            <input
                                type="text"
                                wire:model="items.{{ $index }}.description"
                                required
                                placeholder="Ex: Reforma de pintura e revestimento"
                                class="w-full px-3.5 py-2 text-sm bg-white border border-outline-variant/40 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
                            />
                        </div>

                        <div class="flex gap-2 w-full md:w-auto">
                            <div class="w-1/2 md:w-28">
                                <label class="block text-[11px] font-bold text-secondary mb-1">Qtd</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    wire:model.live="items.{{ $index }}.quantity"
                                    class="w-full px-3 py-2 text-sm bg-white border border-outline-variant/40 rounded-lg text-center font-bold"
                                />
                            </div>

                            <div class="w-1/2 md:w-36">
                                <label class="block text-[11px] font-bold text-secondary mb-1">Preço Unit. (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    wire:model.live="items.{{ $index }}.unit_price"
                                    class="w-full px-3 py-2 text-sm bg-white border border-outline-variant/40 rounded-lg text-right font-bold"
                                />
                            </div>

                            <div class="flex items-end">
                                <button
                                    type="button"
                                    wire:click="removeItem({{ $index }})"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                                    title="Remover Item"
                                >
                                    <span class="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="pt-4 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="w-full md:w-48">
                    <label class="block text-xs font-bold text-secondary mb-1">Desconto (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        wire:model.live="discount"
                        class="w-full px-3.5 py-2 text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl font-bold"
                    />
                </div>

                <div class="text-left md:text-right space-y-1 w-full md:w-auto bg-surface-container-low p-3 md:p-0 rounded-xl md:bg-transparent">
                    <p class="text-xs text-secondary font-semibold">Subtotal: R$ {{ number_format($subtotal, 2, ',', '.') }}</p>
                    <p class="text-xl font-heading font-extrabold text-primary">Total: R$ {{ number_format($total, 2, ',', '.') }}</p>
                </div>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <a href="{{ route('dashboard') }}" class="w-full sm:w-auto text-center px-6 py-3 bg-surface-container text-secondary rounded-xl text-sm font-bold hover:bg-surface-container-high transition-colors">
                Cancelar
            </a>
            <button
                type="submit"
                class="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-heading font-bold hover:bg-primary-container shadow-sm transition-all active:scale-95"
            >
                Salvar Orçamento
            </button>
        </div>

    </form>
</div>

