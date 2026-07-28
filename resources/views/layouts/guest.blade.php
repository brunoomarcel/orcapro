<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- PWA Settings -->
        <meta name="theme-color" content="#9a3f36">
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="/icons/icon.svg">

        <title>{{ config('app.name', 'OrcaPro') }}</title>

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
                            "surface": "#f4fafd",
                            "surface-container-low": "#eef5f7",
                            "on-surface": "#161d1f",
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
            .glass-card { 
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(220, 192, 189, 0.4);
                box-shadow: 0 10px 30px -5px rgba(154, 63, 54, 0.08);
            }
        </style>
    </head>
    <body class="font-sans text-on-surface antialiased bg-[#FCFAF9] min-h-screen flex flex-col justify-center items-center p-4">
        
        <!-- Header Branding -->
        <div class="mb-6 text-center space-y-1">
            <a href="/" class="inline-flex items-center gap-2">
                <div class="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-heading font-extrabold text-xl shadow-md">
                    OP
                </div>
            </a>
            <h1 class="font-heading font-extrabold text-2xl text-primary tracking-tight">OrcaPro</h1>
            <p class="text-xs text-secondary font-semibold uppercase tracking-wider">Gestor de Orçamentos Profissionais</p>
        </div>

        <!-- Form Card Container -->
        <div class="w-full sm:max-w-md glass-card p-6 sm:p-8 rounded-3xl">
            {{ $slot }}
        </div>

        <p class="text-xs text-secondary mt-8">© {{ date('Y') }} OrcaPro. Todos os direitos reservados.</p>
    </body>
</html>

