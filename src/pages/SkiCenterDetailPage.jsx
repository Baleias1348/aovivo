
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSkiCenterBySlug, getSiteConfig } from '@/lib/tourData';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, MountainSnow, Info, MapPin, ExternalLink, Image as ImageIcon, AlertTriangle, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DetailSection = ({ title, content, icon: Icon, delay = 0.2, isHtml = false }) => {
    if (!content || content.trim() === '' || (isHtml && content.trim() === '<p><br></p>')) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="mb-8 md:mb-12"
        >
            <div className="flex items-center text-primary mb-4">
                {Icon && <Icon className="w-6 h-6 md:w-7 md:h-7 mr-3" />}
                <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            </div>
            {isHtml ? (
                 <div 
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-muted-foreground bg-card p-4 sm:p-6 rounded-lg border shadow-sm"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <div className="text-muted-foreground bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
                    <p>{content}</p>
                </div>
            )}
        </motion.section>
    );
};

const GallerySection = ({ galleryUrls, skiCenterName }) => {
    if (!galleryUrls || galleryUrls.length === 0) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8 md:mb-12"
        >
            <div className="flex items-center text-primary mb-4">
                <ImageIcon className="w-6 h-6 md:w-7 md:h-7 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold">Galeria de Fotos</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {galleryUrls.map((url, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md border aspect-square">
                        <img-replace 
                            src={url} 
                            alt={`${skiCenterName} - Imagem da galeria ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        />
                    </div>
                ))}
            </div>
        </motion.section>
    );
};


const SkiCenterDetailPage = () => {
    const { skiCenterSlug } = useParams();
    const [skiCenter, setSkiCenter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const siteConfig = getSiteConfig();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSkiCenter = async () => {
            if (!skiCenterSlug) {
                setError("Identificador do centro de ski não fornecido.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const data = await getSkiCenterBySlug(skiCenterSlug);
                if (data) {
                    setSkiCenter(data);
                } else {
                    setError('Centro de Ski não encontrado.');
                }
            } catch (err) {
                console.error("Erro ao buscar dados do centro de ski:", err);
                setError('Falha ao carregar dados do centro de ski.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkiCenter();
    }, [skiCenterSlug]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] p-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <p className="text-xl text-muted-foreground">Carregando detalhes do centro de ski...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-destructive">Erro ao Carregar</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{error}</p>
                <Button onClick={() => navigate('/centros-de-esqui')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Centros de Ski</Button>
            </div>
        );
    }

    if (!skiCenter) {
        return (
             <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
                <MountainSnow className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h1 className="text-3xl font-bold mb-4">Centro de Ski Não Encontrado</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    O centro de ski que você está procurando não foi encontrado.
                </p>
                <Button onClick={() => navigate('/centros-de-esqui')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Centros de Ski</Button>
            </div>
        );
    }

    const pageTitle = `${skiCenter.metaTitle || skiCenter.name} | ${siteConfig.siteName || 'Vibe Chile'}`;
    const pageDescription = skiCenter.metaDescription || (skiCenter.generalDescription ? skiCenter.generalDescription.replace(/<[^>]+>/g, '').substring(0, 160) : `Descubra ${skiCenter.name}, um dos incríveis centros de ski do Chile.`);
    const pageImage = skiCenter.mainImageUrl || siteConfig.defaultShareImage;

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
            </Helmet>

            <div className="bg-background text-foreground">
                {/* Sticky Back Button - visible on ski detail pages as header is hidden */}
                 <div className="sticky top-0 left-0 z-40 p-4 bg-background/80 backdrop-blur-md">
                    <Button variant="outline" onClick={() => navigate('/centros-de-esqui')} className="shadow-md">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Voltar para Centros de Ski
                    </Button>
                </div>
                
                {/* Hero Section */}
                <section className="relative h-[40vh] md:h-[50vh] text-white flex flex-col justify-center items-center text-center">
                    <div className="absolute inset-0 z-0">
                        <img-replace
                            src={skiCenter.mainImageUrl || 'https://images.unsplash.com/photo-1549788018-908599281086?q=80&w=1470&auto=format&fit=crop'}
                            alt={`Vista panorâmica de ${skiCenter.name}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative z-10 container px-4"
                    >
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
                            style={{ textShadow: '2px 3px 10px rgba(0,0,0,0.8)' }}
                        >
                            {skiCenter.name}
                        </h1>
                    </motion.div>
                </section>

                {/* Main content with padding to account for potentially hidden header */}
                <div className="container mx-auto px-4 py-8 md:py-12">
                                        
                    <DetailSection title="Sobre o Centro" content={skiCenter.generalDescription} icon={Info} delay={0.1} isHtml={true} />
                    <DetailSection title="Perfil e Pistas" content={skiCenter.profileAndTracks} icon={MountainSnow} delay={0.2} isHtml={true} />
                    <DetailSection title="A Experiência Única" content={skiCenter.uniqueExperience} icon={MapPin} delay={0.3} isHtml={true} />
                    <DetailSection title="Dicas Valiosas" content={skiCenter.valuableTips} icon={Info} delay={0.4} isHtml={true} />
                    <DetailSection title="Informações Práticas" content={skiCenter.practicalInfo} icon={Info} delay={0.5} isHtml={true} />
                    
                    <GallerySection galleryUrls={skiCenter.galleryUrls} skiCenterName={skiCenter.name} />

                    {skiCenter.websiteUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="text-center mt-12"
                        >
                            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <a href={skiCenter.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    Visitar Site Oficial <ExternalLink className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SkiCenterDetailPage;