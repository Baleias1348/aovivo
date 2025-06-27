import { supabase } from '@/lib/supabaseClient';

    export const VIBECHILE_BASE_URL = 'https://vibechile.com.br';

    export const fetchStripeConfigFromSupabase = async () => {
        const { data, error } = await supabase
            .from('stripe_config')
            .select('stripe_publishable_key_test, stripe_publishable_key_live, active_mode')
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { 
            console.error('Error fetching Stripe config from Supabase:', error);
            return null;
        }
        return data;
    };