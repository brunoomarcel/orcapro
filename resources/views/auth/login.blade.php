<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <div class="mb-6 text-center">
        <h2 class="font-heading font-extrabold text-2xl text-on-surface">Bem-vindo de volta!</h2>
        <p class="text-xs text-secondary mt-1">Acesse sua conta para gerenciar seus orçamentos</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

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
                    autofocus 
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
            <div class="flex justify-between items-center mb-1">
                <label for="password" class="block text-xs font-bold text-secondary">Senha *</label>
                @if (Route::has('password.request'))
                    <a class="text-[11px] text-primary font-bold hover:underline" href="{{ route('password.request') }}">
                        Esqueceu a senha?
                    </a>
                @endif
            </div>
            <div class="relative">
                <span class="material-symbols-outlined text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">lock</span>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    required 
                    placeholder="Sua senha"
                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/40 focus:outline-none" 
                />
            </div>
            @if ($errors->has('password'))
                <span class="text-xs text-red-500 mt-1 block">{{ $errors->first('password') }}</span>
            @endif
        </div>

        <!-- Remember Me -->
        <div class="flex items-center">
            <label for="remember_me" class="inline-flex items-center cursor-pointer">
                <input id="remember_me" type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary/40" name="remember">
                <span class="ms-2 text-xs font-semibold text-secondary">Lembrar-me neste dispositivo</span>
            </label>
        </div>

        <div class="pt-2 space-y-4">
            <button 
                type="submit" 
                class="w-full py-3 bg-primary text-on-primary font-heading font-bold rounded-xl text-sm hover:bg-primary-container shadow-md transition-all active:scale-[0.99]"
            >
                Entrar no Sistema
            </button>

            <div class="text-center">
                <a class="text-xs text-secondary hover:text-primary font-semibold transition-colors" href="{{ route('register') }}">
                    Não tem uma conta? <span class="text-primary font-bold underline">Cadastre-se</span>
                </a>
            </div>
        </div>
    </form>
</x-guest-layout>

