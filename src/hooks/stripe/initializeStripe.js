import { loadStripe } from '@stripe/stripe-js';
    import { fetchStripeConfigFromSupabase } from '@/hooks/stripe/stripeConfigFetcher';

    let stripePromiseSingleton = null;
    let memoizedStripeKey = null;
    let memoizedStripeInstance = null;

    export const initializeStripeInstance = async (toast) => {
        if (stripePromiseSingleton && memoizedStripeKey && memoizedStripeInstance) {
            return { stripePromise: stripePromiseSingleton, stripeInstance: memoizedStripeInstance, keyUsed: memoizedStripeKey };
        }

        let stripePublishableKey = null;
        let keySource = "not_found";

        try {
            const remoteConfig = await fetchStripeConfigFromSupabase();
            if (remoteConfig) {
                if (remoteConfig.active_mode === 'live' && remoteConfig.stripe_publishable_key_live) {
                    stripePublishableKey = remoteConfig.stripe_publishable_key_live;
                    keySource = "remote_live";
                } else if (remoteConfig.active_mode === 'test' && remoteConfig.stripe_publishable_key_test) {
                    stripePublishableKey = remoteConfig.stripe_publishable_key_test;
                    keySource = "remote_test";
                } else {
                     console.warn("Stripe config found, but no valid key for active mode:", remoteConfig.active_mode);
                     keySource = "remote_config_key_missing_for_mode";
                }
            } else {
                console.warn("No Stripe config found in Supabase. Stripe payments will not work.");
                keySource = "remote_config_not_found";
            }
        } catch (e) {
            console.error("Error fetching remote Stripe config:", e);
            keySource = "remote_config_fetch_error";
        }
        
        if (!stripePublishableKey) {
            console.error(`Stripe publishable key is not available. Source: ${keySource}. Stripe payments will be disabled.`);
            if (toast) {
                toast({
                    title: "Erro Crítico de Configuração do Stripe",
                    description: "A chave publicável do Stripe não foi configurada ou não pôde ser carregada. Pagamentos estão desabilitados.",
                    variant: "destructive",
                });
            }
            return null;
        }
        
        console.log(`Using Stripe key from ${keySource}: ${stripePublishableKey.substring(0,10)}...`);
        memoizedStripeKey = stripePublishableKey;
        stripePromiseSingleton = loadStripe(stripePublishableKey);
        try {
            memoizedStripeInstance = await stripePromiseSingleton;
        } catch (error) {
            console.error("Failed to load Stripe.js with the key:", error);
            if (toast) {
                toast({
                    title: "Erro ao Carregar Stripe.js",
                    description: "Não foi possível inicializar o Stripe. Verifique a chave e a conexão.",
                    variant: "destructive",
                });
            }
            return null;
        }
        return { stripePromise: stripePromiseSingleton, stripeInstance: memoizedStripeInstance, keyUsed: memoizedStripeKey };
    };