<div>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Configurações da Empresa
        </h2>
        <p class="text-xs text-gray-500">Altere os dados exibidos nos seus orçamentos</p>
    </x-slot>

    <div class="py-6">
        <form wire:submit="save" class="max-w-2xl mx-auto space-y-6">

            @if (session()->has('message'))
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                    {{ session('message') }}
                </div>
            @endif

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Nome da Empresa / Prestador *</label>
                    <input
                        type="text"
                        wire:model="name"
                        required
                        class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">CNPJ / CPF</label>
                        <input
                            type="text"
                            wire:model="cnpj"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">WhatsApp</label>
                        <input
                            type="text"
                            wire:model="whatsapp"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            wire:model="email"
                            class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Cor da Marca</label>
                        <div class="flex gap-2 items-center">
                            <input
                                type="color"
                                wire:model="primary_color"
                                class="w-9 h-9 rounded-lg border border-gray-200 p-0 cursor-pointer"
                            />
                            <input
                                type="text"
                                wire:model="primary_color"
                                class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg font-mono uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Endereço Comercial</label>
                    <textarea
                        wire:model="address"
                        rows="2"
                        class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    ></textarea>
                </div>
            </div>

            <div class="flex justify-end">
                <button
                    type="submit"
                    class="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg text-sm hover:bg-emerald-700 shadow-sm"
                >
                    Salvar Configurações
                </button>
            </div>

        </form>
    </div>
</div>
