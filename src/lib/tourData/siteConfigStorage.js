const SITE_CONFIG_KEY = 'vibechile-site-config';

    const defaultConfig = {
        siteName: 'Vibe Chile',
        logoUrl: 'https://placehold.co/120x50?text=VibeChile', // Placeholder logo
        heroImage1: 'https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop',
        heroAlt1: 'Montanhas majestosas dos Andes no Chile',
        heroImage2: 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop',
        heroAlt2: 'Vinhedos exuberantes no vale central do Chile',
        heroImage3: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=2070&auto=format&fit=crop',
        heroAlt3: 'Costa cênica do Oceano Pacífico no Chile',
        defaultShareImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&h=630&auto=format&fit=crop',
        currencySymbol: 'R$',
        currencyCode: 'BRL',
    };

    export const getSiteConfig = () => {
        try {
            const storedConfig = localStorage.getItem(SITE_CONFIG_KEY);
            if (storedConfig) {
                return { ...defaultConfig, ...JSON.parse(storedConfig) };
            }
            return defaultConfig;
        } catch (error) {
            console.error("Erro ao ler configuração do site do localStorage:", error);
            return defaultConfig;
        }
    };

    export const saveSiteConfig = (config) => {
        try {
            const newConfig = { ...getSiteConfig(), ...config };
            localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(newConfig));
        } catch (error) {
            console.error("Erro ao salvar configuração do site no localStorage:", error);
            throw error; // Re-throw to be caught by the form
        }
    };