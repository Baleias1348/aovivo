import React, { useState, useEffect, useMemo } from 'react';
    import { Button } from '@/components/ui/button';
    import { CreditCard, AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
    import { format } from "date-fns";
    import { motion } from 'framer-motion';
    import useStripeCheckout from '@/hooks/useStripeCheckout';
    import { useToast } from "@/components/ui/use-toast";
    import { getAllTours } from '@/lib/tourData'; 

    import PersonalInfoSection from '@/components/tour/booking/PersonalInfoSection';
    import DateSelectionSection from '@/components/tour/booking/DateSelectionSection';
    import ParticipantsSection from '@/components/tour/booking/ParticipantsSection';
    import OffersSection from '@/components/tour/booking/OffersSection';
    import PriceDetailsSection from '@/components/tour/booking/PriceDetailsSection';

    const TourBookingForm = ({ tour, onBookingSuccess }) => {
      const [selectedDate, setSelectedDate] = useState();
      const [adults, setAdults] = useState(1);
      const [childrenCount, setChildrenCount] = useState(0);
      
      const [clientFirstName, setClientFirstName] = useState('');
      const [clientLastName, setClientLastName] = useState('');
      const [userEmail, setUserEmail] = useState('');
      const [clientPhone, setClientPhone] = useState('');
      
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [allToursForOffers, setAllToursForOffers] = useState([]); 

      const { redirectToCheckout, isStripeLoading } = useStripeCheckout(onBookingSuccess);
      const { toast } = useToast();

      const downPaymentPercentage = useMemo(() => (tour?.signal_percentage || 20) / 100, [tour?.signal_percentage]);

      const { totalPrice, downPayment, remainingBalance } = useMemo(() => {
        if (!tour) return { totalPrice: 0, downPayment: 0, remainingBalance: 0 };
        const adultPrice = tour.pricePerAdult || 0;
        const childPrice = tour.pricePerChild || 0;
        const currentTotalPrice = (adultPrice * adults) + (childPrice * childrenCount);
        const currentDownPayment = currentTotalPrice * downPaymentPercentage;
        const currentRemainingBalance = currentTotalPrice - currentDownPayment;
        return { 
          totalPrice: currentTotalPrice, 
          downPayment: currentDownPayment, 
          remainingBalance: currentRemainingBalance 
        };
      }, [tour, adults, childrenCount, downPaymentPercentage]);


      useEffect(() => {
        const fetchAllToursForOffers = async () => {
            if (tour?.offers && tour.offers.length > 0) {
                try {
                    const fetched = await getAllTours();
                    setAllToursForOffers(fetched);
                } catch (error) {
                    console.error("Error fetching all tours for offers:", error);
                }
            }
        };
        fetchAllToursForOffers();
      }, [tour?.offers]);

      const handleBooking = async () => {
        if (!selectedDate || !clientFirstName || !clientLastName || !userEmail || !clientPhone || adults + childrenCount <= 0) {
            toast({
                title: "Campos Obrigatórios",
                description: "Por favor, preencha todos os dados pessoais, data e número de participantes.",
                variant: "destructive",
                className: "bg-red-100 border-red-500 text-red-700"
            });
            return;
        }

        if (!tour || (!tour.stripe_adult_signal_price_id && adults > 0) || (!tour.stripe_child_signal_price_id && childrenCount > 0 && tour.pricePerChild > 0) ) {
            toast({
                title: "Configuração Incompleta",
                description: "Os Price IDs de sinal da Stripe não estão configurados para este passeio no painel de administração.",
                variant: "destructive",
                 className: "bg-red-100 border-red-500 text-red-700"
            });
            return;
        }
        
        setIsSubmitting(true);

        const lineItems = [];
        if (adults > 0 && tour.stripe_adult_signal_price_id) {
            lineItems.push({ price: tour.stripe_adult_signal_price_id, quantity: adults });
        }
        if (childrenCount > 0 && tour.stripe_child_signal_price_id && tour.pricePerChild > 0) {
            lineItems.push({ price: tour.stripe_child_signal_price_id, quantity: childrenCount });
        }

        if (lineItems.length === 0 && (adults > 0 || childrenCount > 0)) {
             toast({
                title: "Erro nos Itens",
                description: "Não foi possível determinar os itens para o sinal. Verifique a configuração do passeio.",
                variant: "destructive",
                 className: "bg-red-100 border-red-500 text-red-700"
            });
            setIsSubmitting(false);
            return;
        }
         if (lineItems.length === 0 && adults === 0 && childrenCount === 0) {
             toast({
                title: "Nenhum Participante",
                description: "Selecione o número de adultos ou crianças para a reserva.",
                variant: "destructive",
                 className: "bg-red-100 border-red-500 text-red-700"
            });
            setIsSubmitting(false);
            return;
        }

        const checkoutData = {
            lineItems, userEmail, tourId: tour.id, adults, children: childrenCount,
            selectedDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
            clientFirstName, clientLastName, clientPhone,
            clientAddressStreet: '', 
            clientAddressCity: '', 
            clientAddressState: '', 
            clientAddressPostalCode: '',
            downPaymentAmount: downPayment, 
            totalPrice: totalPrice,
        };
        
        const result = await redirectToCheckout(checkoutData);
        if (!result) {
            setIsSubmitting(false);
        }
      };

      const isFormIncomplete = !selectedDate || !clientFirstName || !clientLastName || !userEmail || !clientPhone || adults + childrenCount <= 0;
      const isStripeConfigMissing = (adults > 0 && !tour?.stripe_adult_signal_price_id) || (childrenCount > 0 && tour?.pricePerChild > 0 && !tour?.stripe_child_signal_price_id);
      const isBookingButtonDisabled = isSubmitting || isStripeLoading || isFormIncomplete || isStripeConfigMissing;
      
      const inputStyles = "bg-white border-gray-300 placeholder:text-gray-400 text-gray-800 focus:border-primary focus:ring-primary";
      const labelIconStyles = "text-blue-200";

      return (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="lg:sticky lg:top-24 lg:self-start space-y-6 p-6 rounded-xl border border-blue-700 shadow-2xl"
          style={{ backgroundColor: '#1010f0' }}
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-6 flex items-center justify-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
            <ShieldCheck className="w-8 h-8 mr-3 text-yellow-300"/>
            Reserve Sua Aventura
          </h2>

          <PersonalInfoSection
            clientFirstName={clientFirstName} setClientFirstName={setClientFirstName}
            clientLastName={clientLastName} setClientLastName={setClientLastName}
            userEmail={userEmail} setUserEmail={setUserEmail}
            clientPhone={clientPhone} setClientPhone={setClientPhone}
            inputStyles={inputStyles} labelIconStyles={labelIconStyles}
          />

          <DateSelectionSection selectedDate={selectedDate} setSelectedDate={setSelectedDate} inputStyles={inputStyles} />
          
          <ParticipantsSection tour={tour} adults={adults} setAdults={setAdults} childrenCount={childrenCount} setChildrenCount={setChildrenCount} />
          
          <OffersSection tour={tour} allToursForOffers={allToursForOffers} />
          
          <PriceDetailsSection totalPrice={totalPrice} downPayment={downPayment} remainingBalance={remainingBalance} downPaymentPercentage={downPaymentPercentage} />

          <Button 
            size="xl" 
            className="w-full font-bold text-lg py-7 bg-white text-black border border-black hover:bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" 
            onClick={handleBooking} 
            disabled={isBookingButtonDisabled}
          >
            {isSubmitting || isStripeLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
            {isStripeLoading ? 'Carregando Stripe...' : (isSubmitting ? 'Redirecionando...' : 'Pagar Sinal e Reservar')}
          </Button>
          <div className="flex items-start gap-2 text-white/90 text-center mt-2 p-3 bg-blue-600/30 border border-blue-500 rounded-lg shadow-sm">
            <AlertTriangle className="h-7 w-7 md:h-5 md:w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <span className="text-sm">Você será redirecionado para o checkout seguro da Stripe para pagar o sinal. A reserva será confirmada ao retornar.</span>
          </div>
        </motion.div>
      );
    };

    export default TourBookingForm;