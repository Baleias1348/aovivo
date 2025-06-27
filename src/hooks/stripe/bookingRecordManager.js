import { supabase } from '@/lib/supabaseClient';

    export const createInitialBookingRecord = async (bookingData, toast) => {
        try {
            const { error: insertError } = await supabase
                .from('bookings')
                .insert([bookingData]);

            if (insertError) {
                console.error('Supabase insert error:', insertError);
                toast({
                    title: "Erro ao Iniciar Reserva",
                    description: `Não foi possível registrar os detalhes iniciais da reserva: ${insertError.message}`,
                    variant: "destructive",
                });
                return false;
            }
            return true;
        } catch (e) {
             console.error('Error during pre-checkout Supabase operation:', e);
             toast({
                title: "Erro Inesperado",
                description: "Ocorreu um erro inesperado antes de ir para o pagamento.",
                variant: "destructive",
            });
            return false;
        }
    };

    export const updateBookingStatusInSupabase = async (bookingId, sessionId, status, toast) => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .update({ payment_status: status, stripe_session_id: sessionId })
                .eq('booking_id', bookingId)
                .select()
                .single();

            if (error) {
                console.error('Error updating booking status:', error);
                toast({ title: "Erro", description: "Falha ao atualizar o status da reserva.", variant: "destructive" });
                return null;
            }
            return data;
        } catch (e) {
            console.error('Error in updateBookingStatusInSupabase:', e);
            toast({ title: "Erro Crítico", description: "Falha crítica ao processar o retorno do pagamento.", variant: "destructive" });
            return null;
        }
    };