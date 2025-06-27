
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { getAllSkiCenters } from '@/lib/tourData';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MountainSnow, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const SkiCenterCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg flex flex-col bg-card animate-pulse h-full">
        <div className="w-full h-48 bg-muted"></div>
        <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
        </CardContent>
        <CardFooter>
            <div className="h-10 bg-muted rounded w-full"></div>
        </CardFooter>
    </Card>
);


const SkiCenterCard = ({ skiCenter }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
            className="h-full"
        >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card border border-border/50 hover:border-primary/50">
                <div className="relative h-56 w-full">
                    {skiCenter.mainImageUrl ? (
                        <img-replace src={skiCenter.mainImageUrl} alt={`Imagem de ${skiCenter.name}`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted via-card to-muted flex items-center justify-center text-muted-foreground">
                            <MountainSnow className="w-16 h-16 opacity-70" />
                        </div>
                    )}
                </div>
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-primary truncate" title={skiCenter.name}>
                        {skiCenter.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {skiCenter.generalDescription ? skiCenter.generalDescription.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : 'Mais informações em breve.'}
                    </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50">
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-105">
                        <Link to={`/centros-de-esqui/${skiCenter.slug || skiCenter.id}`}>
                            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const SkiCentersPage = () => {
    const [skiCenters, setSkiCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkiCenters = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllSkiCenters();
                setSkiCenters(data.filter(sc => sc.isVisible));
            } catch (err) {
                console.error("Error fetching ski centers:", err);
                setError("Não foi possível carregar os centros de ski. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkiCenters();
    }, []);

    const pageTitle = "Centros de Ski no Chile | Vibe Chile";
    const pageDescription = "Descubra os melhores centros de ski no Chile. Encontre informações sobre Portillo, Valle Nevado, La Parva, El Colorado e mais. Planeje sua aventura na neve!";

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {/* Add OG image later */}
            </Helmet>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <MountainSnow className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400">
                        Centros de Ski no Chile
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        {/* Placeholder text, will be replaced by user's content */}
                        Explore as majestosas montanhas dos Andes e descubra os melhores destinos para esquiar e praticar snowboard no Chile. De pistas para iniciantes a desafios para experts, prepare-se para uma aventura inesquecível na neve!
                    </p>
                </motion.div>

                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {Array.from({ length: 3 }).map((_, index) => <SkiCenterCardSkeleton key={index} />)}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="text-center py-10 px-6 bg-destructive/10 border border-destructive/30 rounded-lg shadow-lg max-w-md mx-auto">
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h2 className="text-xl font-semibold text-destructive mb-2">Erro ao Carregar</h2>
                        <p className="text-destructive/80">{error}</p>
                    </div>
                )}

                {!isLoading && !error && skiCenters.length === 0 && (
                     <div className="text-center py-10 bg-card border rounded-lg shadow-sm">
                        <MountainSnow className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum Centro de Ski Disponível</h3>
                        <p className="text-muted-foreground">No momento, não há centros de ski para exibir. Volte em breve!</p>
                    </div>
                )}

                {!isLoading && !error && skiCenters.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {skiCenters.map(center => (
                            <SkiCenterCard key={center.id} skiCenter={center} />
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default SkiCentersPage;
  