<x-guest-layout>
    <div class="mb-6 text-center">
        <h2 class="font-heading font-extrabold text-2xl text-on-surface">Criar Nova Conta</h2>
        <p class="text-xs text-secondary mt-1">Preencha seus dados para acessar a plataforma</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Name -->
        <div>
            <label for="name" class="block text-xs font-bold text-secondary mb-1">Nome Completo *</label>
            <div class="relative">
                <span class="material-symbols-outlined text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">person</span>
                <input 
                    id="name" 
                    type="text" 
                    name="name" 
                    value="{{ old('name') }}" 
                    required 
                    autofocus 
                    placeholder="Seu nome"
                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none" 
                />
            </div>
            @if ($errors->has('name'))
                <span class="text-xs text-red-500 mt-1 block">{{ $errors->first('name') }}</span>
            @endif
        </div>

        <!-- Email Address -->
        <div>
            <label for="email" class="block text-xs font-bold text-secondary mb-1">E-mail *</label>
            <div class="relative">
                <span class="material-symbols-outlined text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">mail</span>
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value="{{ old('email') }}" 
                    required 
                    placeholder="seu.email@exemplo.com"
                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none" 
                />
            </div>
            @if ($errors->has('email'))
                <span class="text-xs text-red-500 mt-1 block">{{ $errors->first('email') }}</span>
            @endif
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-xs font-bold text-secondary mb-1">Senha *</label>
            <div class="relative">
                <span class="material-symbols-outlined text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">lock</span>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    required 
                    placeholder="Sua senha secreta"
                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none" 
                />
            </div>
            @if ($errors->has('password'))
                <span class="text-xs text-red-500 mt-1 block">{{ $errors->first('password') }}</span>
            @endif
        </div>

        <!-- Confirm Password -->
        <div>
            <label for="password_confirmation" class="block text-xs font-bold text-secondary mb-1">Confirmar Senha *</label>
            <div class="relative">
                <span class="material-symbols-outlined text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">check_circle</span>
                <input 
                    id="password_confirmation" 
                    type="password" 
                    name="password_confirmation" 
                    required 
                    placeholder="Repita a senha"
                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none" 
                />
            </div>
            @if ($errors->has('password_confirmation'))
                <span class="text-xs text-red-500 mt-1 block">{{ $errors->first('password_confirmation') }}</span>
            @endif
        </div>

        <div class="pt-2 space-y-4">
            <button 
                type="submit" 
                class="w-full py-3 bg-primary text-on-primary font-heading font-bold rounded-xl text-sm hover:bg-primary-container shadow-md transition-all active:scale-[0.99]"
            >
                Cadastrar Usuário
            </button>

            <div class="text-center">
                <a class="text-xs text-secondary hover:text-primary font-semibold transition-colors" href="{{ route('login') }}">
                    Já tem uma conta? <span class="text-primary font-bold underline">Entrar</span>
                </a>
            </div>
        </div>
    </form>
</x-guest-layout>

