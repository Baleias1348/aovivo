import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { useParams, useLocation, useNavigate } from 'react-router-dom';
    import { getTourById, getSiteConfig } from '@/lib/tourData';
    import TourLandingHeader from '@/components/tour/landing/TourLandingHeader';
    import TourBookingForm from '@/components/tour/TourBookingForm';
    import TourLandingDescription from '@/components/tour/landing/TourLandingDescription';
    import TourLandingItinerary from '@/components/tour/landing/TourLandingItinerary';
    import TourLandingInclusionsExclusions from '@/components/tour/landing/TourLandingInclusionsExclusions';
    import TourChecklist from '@/components/tour/landing/TourChecklist';
    import TourSchedule from '@/components/tour/landing/TourSchedule';
    import TourTerms from '@/components/tour/landing/TourTerms';
    import TourLandingGallery from '@/components/tour/landing/TourLandingGallery';
    import TourGuaranteeBox from '@/components/tour/landing/TourGuaranteeBox';
    import TourNotFound from '@/components/tour/TourNotFound';
    import TourDetailSkeleton from '@/components/tour/TourDetailSkeleton';
    import BookingConfirmationModal from '@/components/tour/BookingConfirmationModal';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";

    const SectionWrapper = ({ children, delay = 0.2, className = "" }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
    
    const TourDetailPage = () => {
        const { tourId } = useParams();
        const [tour, setTour] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const bookingFormRef = useRef(null);
        const location = useLocation();
        const navigate = useNavigate();
        const { toast } = useToast();

        const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
        const [bookingDetailsForModal, setBookingDetailsForModal] = useState(null);

        const isLandingPage = new URLSearchParams(location.search).get('landing') === 'true';
        const siteConfig = getSiteConfig();

        const handleBookingSuccess = useCallback((bookingData) => {
            if (!bookingData) {
                console.error("handleBookingSuccess called with no bookingData");
                toast({
                    title: "Erro na Confirmação",
                    description: "Não foi possível obter os detalhes da reserva para confirmação.",
                    variant: "destructive",
                });
                return;
            }
            setBookingDetailsForModal({
                adults: bookingData.adults,
                children: bookingData.children,
                date: bookingData.booking_date,
                totalPrice: bookingData.total_price,
                downPaymentAmount: bookingData.down_payment_amount,
                name: bookingData.client_name,
                email: bookingData.client_email,
                phone: bookingData.client_phone,
            });
            setIsConfirmationModalOpen(true);
            toast({
                title: "Reserva Confirmada!",
                description: "Seu pagamento foi processado com sucesso.",
                variant: "success",
                className: "bg-green-100 border-green-500 text-green-700"
            });
        }, [toast]);
        
        useEffect(() => {
            const fetchTour = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await getTourById(tourId);
                    if (data) {
                        setTour(data);
                        const fullTourName = `${data.nameLine1}${data.nameLine2 ? ` ${data.nameLine2}` : ''}`;
                        navigate(location.pathname, { 
                            replace: true, 
                            state: { ...location.state, tourNameForWhatsApp: fullTourName } 
                        });
                    } else {
                        setError('Passeio não encontrado.');
                    }
                } catch (err) {
                    console.error("Erro ao buscar dados do passeio:", err);
                    setError('Falha ao carregar dados do passeio.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTour();
        }, [tourId, navigate, location.pathname]);

        const handleReserveClick = () => {
            bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        if (loading) return <TourDetailSkeleton isLandingPage={isLandingPage} />;
        if (error) return <TourNotFound message={error} />;
        if (!tour) return <TourNotFound />;

        const pageTitle = `${tour.nameLine1}${tour.nameLine2 ? ` ${tour.nameLine2}` : ''} | ${siteConfig.siteName || 'Vibe Chile'}`;
        const pageDescription = tour.description ? tour.description.substring(0, 160) : `Reserve o passeio ${tour.nameLine1} em ${tour.location}.`;
        const pageImage = tour.image || siteConfig.defaultShareImage;

        const fullTourName = `${tour.nameLine1}${tour.nameLine2 ? ` ${tour.nameLine2}` : ''}`;

        return (
          <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={pageImage} />
            </Helmet>
            <div className={`bg-background text-foreground ${isLandingPage ? 'pt-0' : 'pt-10'}`}>
                <TourLandingHeader 
                    name={`${tour.nameLine1}${tour.nameLine2 ? `\n${tour.nameLine2}` : ''}`}
                    location={tour.location}
                    duration={tour.duration}
                    pricePerAdult={tour.pricePerAdult}
                    signalPercentage={tour.signal_percentage}
                    heroImageSrc={tour.image || '/placeholder-hero.jpg'}
                    heroImageAlt={`Imagem de capa para ${tour.nameLine1}`}
                    onReserveClick={handleReserveClick}
                />

                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">
                            <SectionWrapper delay={0.1}>
                                <TourLandingDescription 
                                    name={fullTourName}
                                    location={tour.location}
                                    pricePerAdult={tour.pricePerAdult}
                                    description={tour.description}
                                    duration={tour.duration}
                                    signalPercentage={tour.signal_percentage}
                                />
                            </SectionWrapper>
                            
                            <SectionWrapper delay={0.2}>
                                <TourSchedule startTime={tour.startTime} endTime={tour.endTime} duration={tour.duration} />
                            </SectionWrapper>

                            {tour.itinerary && tour.itinerary.length > 0 && (
                                <SectionWrapper delay={0.3}>
                                    <TourLandingItinerary itinerary={tour.itinerary} />
                                </SectionWrapper>
                            )}
                            
                            <SectionWrapper delay={0.4}>
                               <TourLandingInclusionsExclusions includes={tour.includes} excludes={tour.excludes} />
                            </SectionWrapper>

                            {tour.checklist && tour.checklist.length > 0 && (
                                <SectionWrapper delay={0.5}>
                                    <TourChecklist checklist={tour.checklist} />
                                </SectionWrapper>
                            )}

                            <div ref={bookingFormRef}>
                              <SectionWrapper delay={0.15} className="mt-8 md:mt-12">
                                <TourBookingForm tour={tour} onBookingSuccess={handleBookingSuccess} />
                              </SectionWrapper>
                            </div>
                            
                            <SectionWrapper delay={0.45}> {/* Moved TourTerms here */}
                                <TourTerms terms={tour.termsAndConditions} />
                            </SectionWrapper>
                        </div>

                        <aside className="lg:col-span-1 space-y-8 md:space-y-12">
                            {/* Booking form is now in the main content area */}
                            {/* TourTerms was moved to the main content area */}
                            
                            {tour.gallery && tour.gallery.length > 0 && (
                                <SectionWrapper delay={0.25} className="mt-8 md:mt-12 lg:mt-0">
                                    <TourLandingGallery gallery={tour.gallery} tourName={tour.nameLine1} />
                                </SectionWrapper>
                            )}

                            <SectionWrapper delay={0.35}>
                                <TourGuaranteeBox />
                            </SectionWrapper>
                        </aside>
                    </div>
                </div>
            </div>
            <BookingConfirmationModal 
                isOpen={isConfirmationModalOpen}
                onClose={() => {
                    setIsConfirmationModalOpen(false);
                    const newUrl = window.location.pathname; 
                    navigate(newUrl, { replace: true });
                }}
                bookingDetails={bookingDetailsForModal}
                tour={tour}
            />
          </>
        );
    };

    export default TourDetailPage;