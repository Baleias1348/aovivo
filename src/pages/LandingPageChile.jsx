import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import TourCard from '@/components/shared/TourCard';
    import { getAllTours, getSiteConfig } from '@/lib/tourData';
    import TourCardSkeleton from '@/components/shared/TourCardSkeleton'; 

    const LandingPageChile = () => {
        const [featuredTours, setFeaturedTours] = useState([]);
        const [siteConfig, setSiteConfig] = useState(getSiteConfig());
        const [isLoadingTours, setIsLoadingTours] = useState(true);

        useEffect(() => {
            const fetchFeaturedTours = async () => {
                setIsLoadingTours(true);
                try {
                    const allTours = await getAllTours(); 
                    if (Array.isArray(allTours)) {
                        setFeaturedTours(allTours.slice(0, 3));
                    } else {
                        console.error("getAllTours did not return an array:", allTours);
                        setFeaturedTours([]); 
                    }
                } catch (error) {
                    console.error("Error fetching tours for LandingPageChile:", error);
                    setFeaturedTours([]); 
                } finally {
                    setIsLoadingTours(false);
                }
            };

            fetchFeaturedTours();
            setSiteConfig(getSiteConfig()); 
        }, []);

        return (
            <div className="space-y-16 md:space-y-24 pb-16">
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
                >
                    <div className="absolute inset-0 z-0">
                        <img-replace 
                           className="object-cover w-full h-full"
                           alt={siteConfig.homePageHeroAlt || "Paisagem impressionante do Chile"} 
                           src={siteConfig.homePageHeroImage || "https://images.unsplash.com/photo-1691727477684-3e244369d5f1"} />
                    </div>
                    
                    <div className="relative z-10 p-4">
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
                            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                        >
                            Chile ao Vivo!
                        </motion.h1>
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto"
                            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                        >
                            Descubra a beleza do Chile. Criamos sua aventura perfeita.
                        </motion.p>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105">
                                <Link to="/tours">Explore Passeios no Chile</Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.section>

                <section className="container">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
                    >
                        Destinos Populares no Chile
                    </motion.h2>
                     {isLoadingTours ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TourCardSkeleton key={index} />
                            ))}
                        </div>
                     ) : featuredTours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredTours.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <TourCard tour={tour} />
                                </motion.div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-center text-muted-foreground">Não há passeios em destaque disponíveis no momento.</p>
                     )}
                     <div className="text-center mt-12">
                        <Button variant="outline" size="lg" asChild>
                            <Link to="/tours">Ver Todos os Passeios</Link>
                        </Button>
                    </div>
                </section>

                 <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
                    <div className="container text-center">
                         <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-4xl font-bold mb-4 text-primary"
                        >
                            Procurando uma Viagem Personalizada pelo Chile?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
                        >
                            Permita-nos criar a experiência chilena perfeita para você. Solicite um orçamento personalizado.
                        </motion.p>
                        <motion.div
                             initial={{ scale: 0.9, opacity: 0 }}
                             whileInView={{ scale: 1, opacity: 1 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button size="lg" asChild>
                                <Link to="/contact">Solicitar Orçamento</Link>
                            </Button>
                         </motion.div>
                    </div>
                </section>
            </div>
        );
    };

    export default LandingPageChile;