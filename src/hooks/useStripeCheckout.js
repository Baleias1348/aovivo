import { useEffect, useState, useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import { v4 as uuidv4 } from 'uuid';
    import { initializeStripeInstance } from '@/hooks/stripe/initializeStripe';
    import { createInitialBookingRecord, updateBookingStatusInSupabase } from '@/hooks/stripe/bookingRecordManager';
    import { VIBECHILE_BASE_URL } from '@/hooks/stripe/stripeConfigFetcher';


    const useStripeCheckout = (onBookingSuccessCallback) => {
        const { toast } = useToast();
        const [isStripeReady, setIsStripeReady] = useState(false);
        const [stripe, setStripe] = useState(null);

        useEffect(() => {
            const loadAndSetStripe = async () => {
                setIsStripeReady(false);
                const stripeInitData = await initializeStripeInstance(toast);
                if (stripeInitData && stripeInitData.stripeInstance) {
                    setStripe(stripeInitData.stripeInstance);
                    setIsStripeReady(true);
                } else {
                    setIsStripeReady(false); 
                }
            };
            loadAndSetStripe();
        }, [toast]);

        const redirectToStripeCheckout = useCallback(async (checkoutData) => {
            const { 
                lineItems, userEmail, tourId, adults, children, selectedDate, 
                clientFirstName, clientLastName, clientPhone,
                downPaymentAmount, totalPrice
            } = checkoutData;

            if (!isStripeReady || !stripe) {
                 toast({
                    title: "Stripe Não Está Pronto",
                    description: "Aguarde um momento, o Stripe está sendo inicializado ou houve um erro na configuração.",
                    variant: "default",
                });
                return null;
            }

            if (!lineItems || lineItems.length === 0) {
                toast({ title: "Erro na Reserva", description: "Nenhum item selecionado para pagamento.", variant: "destructive" });
                return null;
            }
            
            const bookingId = uuidv4();
            
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : VIBECHILE_BASE_URL;
            const successUrl = `${currentOrigin}/tours/${tourId}?stripe_session_id={CHECKOUT_SESSION_ID}&booking_status=success&booking_id=${bookingId}`;
            const cancelUrl = `${currentOrigin}/tours/${tourId}?stripe_session_id={CHECKOUT_SESSION_ID}&booking_status=cancelled&booking_id=${bookingId}`;
            
            const clientFullName = `${clientFirstName || ''} ${clientLastName || ''}`.trim();

            const bookingPayload = {
                booking_id: bookingId, tour_id: tourId, stripe_session_id: null, 
                booking_date: selectedDate, adults, children, client_name: clientFullName,
                client_email: userEmail, client_phone: clientPhone, total_price: totalPrice,
                down_payment_amount: downPaymentAmount, payment_status: 'pending_stripe_checkout',
                tour_details_snapshot: {}, created_at: new Date().toISOString(),
                client_first_name: clientFirstName, client_last_name: clientLastName,
                client_address_street: checkoutData.clientAddressStreet || '', 
                client_address_city: checkoutData.clientAddressCity || '',
                client_address_state: checkoutData.clientAddressState || '',
                client_address_postal_code: checkoutData.clientAddressPostalCode || '',
            };

            const initialRecordCreated = await createInitialBookingRecord(bookingPayload, toast);
            if (!initialRecordCreated) return null;

            try {
                const { error: stripeError } = await stripe.redirectToCheckout({
                    lineItems, mode: 'payment', successUrl, cancelUrl,
                    customerEmail: userEmail, clientReferenceId: bookingId, 
                    billingAddressCollection: 'auto',
                    shippingAddressCollection: {
                        allowedCountries: ['BR', 'CL', 'AR', 'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'PT', 'AU', 'NZ'], 
                    }
                });

                if (stripeError) {
                    console.error("Stripe checkout error:", stripeError);
                    toast({ title: "Erro no Checkout", description: stripeError.message || "Ocorreu um erro ao redirecionar para o pagamento.", variant: "destructive" });
                    await updateBookingStatusInSupabase(bookingId, null, 'failed_stripe_redirect', toast);
                    return null; 
                }
                return bookingId; 
            } catch (e) {
                console.error("General error during checkout process:", e);
                toast({ title: "Erro Inesperado", description: e.message || "Ocorreu um erro inesperado durante o processo de checkout.", variant: "destructive" });
                await updateBookingStatusInSupabase(bookingId, null, 'failed_unexpected', toast);
                return null;
            }
        }, [isStripeReady, stripe, toast]);
        
        useEffect(() => {
            if (typeof window === 'undefined') return; 

            const query = new URLSearchParams(window.location.search);
            const sessionId = query.get('stripe_session_id');
            const bookingStatusParam = query.get('booking_status');
            const bookingIdFromUrl = query.get('booking_id');

            if (sessionId && bookingStatusParam && bookingIdFromUrl && typeof onBookingSuccessCallback === 'function') {
                const processBookingReturn = async () => {
                    let paymentStatusUpdate = 'unknown';
                    if (bookingStatusParam === 'success') paymentStatusUpdate = 'succeeded_stripe';
                    else if (bookingStatusParam === 'cancelled') paymentStatusUpdate = 'cancelled_stripe';
                    
                    const updatedBookingData = await updateBookingStatusInSupabase(bookingIdFromUrl, sessionId, paymentStatusUpdate, toast);

                    if (updatedBookingData && bookingStatusParam === 'success') {
                        onBookingSuccessCallback(updatedBookingData); 
                    } else if (bookingStatusParam === 'cancelled') {
                         toast({ title: "Reserva Cancelada", description: "O processo de pagamento foi cancelado.", variant: "default" });
                    }
                    
                    const currentPathname = window.location.pathname;
                    const newUrl = currentPathname;
                    window.history.replaceState({}, document.title, newUrl);
                };
                processBookingReturn();
            }
        }, [onBookingSuccessCallback, toast]);

        return { redirectToCheckout: redirectToStripeCheckout, isStripeLoading: !isStripeReady };
    };

    export default useStripeCheckout;