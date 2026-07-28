<!DOCTYPE html>
<html lang="pt-BR" class="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- PWA Settings -->
    <meta name="theme-color" content="#9a3f36">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="OrcaPro">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icons/icon.svg">

    <title>{{ config('app.name', 'QuotePro') }} | Painel</title>

    <!-- Google Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        "primary": "#9a3f36",
                        "primary-container": "#ba564c",
                        "primary-fixed": "#ffdad5",
                        "on-primary": "#ffffff",
                        "secondary": "#545f72",
                        "tertiary": "#00694e",
                        "background": "#f4fafd",
                        "surface": "#f4fafd",
                        "surface-container": "#e8eff1",
                        "surface-container-low": "#eef5f7",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#161d1f",
                        "on-surface-variant": "#564240",
                        "outline": "#89726f",
                        "outline-variant": "#dcc0bd",
                    },
                    fontFamily: {
                        sans: ['Work Sans', 'sans-serif'],
                        heading: ['Manrope', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #FCFAF9; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card { 
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(220, 192, 189, 0.4);
            box-shadow: 0 4px 20px -2px rgba(154, 63, 54, 0.04);
        }
    </style>
    @livewireStyles
</head>
<body x-data="{ loadingPage: false, mobileMenuOpen: false }" @page-loading.window="loadingPage = true" @page-loaded.window="loadingPage = false" class="font-sans text-on-surface antialiased bg-[#FCFAF9]">

    <!-- Fullscreen Page Loader -->
    <div 
        x-show="loadingPage" 
        x-transition.opacity.duration.200ms
        style="display: none;" 
        class="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-4"
    >
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-xs font-heading font-bold text-primary tracking-wider uppercase">Carregando...</p>
    </div>

    <!-- Livewire Request Global Loading Bar -->
    <div wire:loading.delay class="fixed top-0 left-0 right-0 h-1 bg-primary-container z-[101] overflow-hidden">
        <div class="w-full h-full bg-primary animate-pulse"></div>
    </div>

    <!-- Mobile Top Navigation Header -->
    <header class="md:hidden sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <button @click="mobileMenuOpen = true" class="p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors" aria-label="Abrir menu">
                <span class="material-symbols-outlined text-2xl">menu</span>
            </button>
            <span class="font-heading font-extrabold text-xl text-primary tracking-tight">OrcaPro</span>
        </div>
        <a href="{{ route('quotes.create') }}" class="p-2 bg-primary text-on-primary rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-xl">add</span>
        </a>
    </header>

    <div class="min-h-screen flex">
        
        <!-- Backdrop Mobile -->
        <div 
            x-show="mobileMenuOpen" 
            x-transition.opacity
            @click="mobileMenuOpen = false"
            class="fixed inset-0 bg-black/50 z-50 md:hidden"
            style="display: none;"
        ></div>

        <!-- Sidebar Navigation (Responsive Drawer) -->
        <aside 
            :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
            class="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/40 bg-surface flex flex-col py-6 px-3 z-50 transition-transform duration-300 ease-in-out md:translate-x-0"
        >
            <div class="mb-8 px-4 flex justify-between items-center">
                <div>
                    <h1 class="font-heading font-extrabold text-2xl text-primary tracking-tight">OrcaPro</h1>
                    <p class="text-secondary text-xs font-semibold uppercase tracking-wider mt-0.5">Gestor de Orçamentos</p>
                </div>
                <button @click="mobileMenuOpen = false" class="md:hidden p-1.5 rounded-lg text-secondary hover:bg-surface-container">
                    <span class="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            <nav class="flex-1 space-y-1.5">
                <a 
                    href="{{ route('dashboard') }}" 
                    @click="mobileMenuOpen = false; window.dispatchEvent(new CustomEvent('page-loading'))"
                    class="flex items-center gap-3 px-4 py-3 font-heading font-bold text-sm rounded-xl transition-all {{ request()->routeIs('dashboard') ? 'text-primary bg-primary-fixed border-r-4 border-primary' : 'text-secondary hover:bg-surface-container-low' }}"
                >
                    <span class="material-symbols-outlined text-xl">dashboard</span>
                    <span>Painel</span>
                </a>
                
                <a 
                    href="{{ route('quotes.create') }}" 
                    @click="mobileMenuOpen = false; window.dispatchEvent(new CustomEvent('page-loading'))"
                    class="flex items-center gap-3 px-4 py-3 font-heading font-bold text-sm rounded-xl transition-all {{ request()->routeIs('quotes.create') ? 'text-primary bg-primary-fixed border-r-4 border-primary' : 'text-secondary hover:bg-surface-container-low' }}"
                >
                    <span class="material-symbols-outlined text-xl">add_circle</span>
                    <span>Novo Orçamento</span>
                </a>

                <a 
                    href="{{ route('company.settings') }}" 
                    @click="mobileMenuOpen = false; window.dispatchEvent(new CustomEvent('page-loading'))"
                    class="flex items-center gap-3 px-4 py-3 font-heading font-bold text-sm rounded-xl transition-all {{ request()->routeIs('company.settings') ? 'text-primary bg-primary-fixed border-r-4 border-primary' : 'text-secondary hover:bg-surface-container-low' }}"
                >
                    <span class="material-symbols-outlined text-xl">settings</span>
                    <span>Empresa</span>
                </a>
            </nav>

            <div class="mt-auto px-2 pt-4 border-t border-outline-variant/30 space-y-3">
                <div class="flex items-center gap-3 px-2">
                    <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {{ strtoupper(substr(Auth::user()->name ?? 'U', 0, 1)) }}
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-xs font-bold text-on-surface truncate">{{ Auth::user()->name ?? 'Usuário' }}</p>
                        <p class="text-[10px] text-secondary truncate">{{ Auth::user()->email ?? '' }}</p>
                    </div>
                </div>

                <form method="POST" action="{{ route('logout') }}" @submit="window.dispatchEvent(new CustomEvent('page-loading'))">
                    @csrf
                    <button type="submit" class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <span class="material-symbols-outlined text-sm">logout</span>
                        <span>Sair</span>
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Content Canvas -->
        <div class="pl-0 md:pl-64 flex-1 flex flex-col min-h-screen w-full">
            <main class="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
                {{ $slot }}
            </main>
        </div>

    </div>

    @livewireScripts
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            window.dispatchEvent(new CustomEvent('page-loaded'));
        });

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('Service Worker registrado:', reg.scope))
                    .catch((err) => console.log('Falha ao registrar Service Worker:', err));
            });
        }
    </script>
</body>
</html>

