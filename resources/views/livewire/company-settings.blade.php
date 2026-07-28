<div>
    <header class="mb-6 md:mb-8">
        <h1 class="font-heading font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Configurações da Empresa
        </h1>
        <p class="text-secondary text-xs md:text-sm mt-0.5">Altere os dados exibidos nos seus orçamentos</p>
    </header>

    <div class="py-2">
        <form wire:submit="save" class="max-w-2xl mx-auto space-y-6">

            @if (session()->has('message'))
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <span class="material-symbols-outlined text-base">check_circle</span>
                    <span>{{ session('message') }}</span>
                </div>
            @endif

            <div class="glass-card p-4 md:p-6 rounded-2xl space-y-4">
                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">Nome da Empresa / Prestador *</label>
                    <input
                        type="text"
                        wire:model="name"
                        required
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-secondary mb-1">CNPJ / CPF</label>
                        <input
                            type="text"
                            wire:model="cnpj"
                            class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-secondary mb-1">WhatsApp</label>
                        <input
                            type="text"
                            wire:model="whatsapp"
                            class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-secondary mb-1">E-mail</label>
                        <input
                            type="email"
                            wire:model="email"
                            class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-secondary mb-1">Cor da Marca</label>
                        <div class="flex gap-2 items-center">
                            <input
                                type="color"
                                wire:model="primary_color"
                                class="w-10 h-10 rounded-xl border border-outline-variant/40 p-0.5 cursor-pointer bg-white"
                            />
                            <input
                                type="text"
                                wire:model="primary_color"
                                class="flex-1 px-3 py-2 text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl font-mono uppercase focus:bg-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-secondary mb-1">Endereço Comercial</label>
                    <textarea
                        wire:model="address"
                        rows="2"
                        class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    ></textarea>
                </div>
            </div>

            <div class="flex justify-end pt-2">
                <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary font-heading font-bold rounded-xl text-sm hover:bg-primary-container shadow-sm transition-all active:scale-95"
                >
                    Salvar Configurações
                </button>
            </div>

        </form>
    </div>
</div>

