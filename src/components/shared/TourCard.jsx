import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { MapPin, Clock, Users, Star, DollarSign } from 'lucide-react';
    import { motion } from 'framer-motion';

    const TourCard = ({ tour }) => {
        if (!tour) {
            return null; 
        }

        const cardVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        };

        const combinedName = tour.nameLine1 && tour.nameLine2 
            ? `${tour.nameLine1}\n${tour.nameLine2}` 
            : tour.nameLine1 || tour.nameLine2 || tour.name || "Passeio Sem Nome";

        const nameParts = combinedName.split('\n');

        return (
            <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card">
                    <div className="relative">
                        <Link to={`/tours/${tour.id}`} className="block">
                            <img 
                                src={tour.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop"}
                                alt={`Imagem de ${combinedName}`}
                                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                             src="https://images.unsplash.com/photo-1696649307775-8e2adc61892e" />
                        </Link>
                        {tour.pricePerAdult > 0 && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-2 m-3 rounded-md shadow-md">
                                <span className="text-xs">A partir de</span>
                                <p className="font-bold text-2xl">R${tour.pricePerAdult.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-2 text-primary min-h-[3em]">
                            {nameParts.map((part, index) => (
                                <span key={index} className="block leading-tight">{part}</span>
                            ))}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <MapPin className="w-4 h-4 mr-1.5 text-secondary" />
                            <span>{tour.location || 'Localização não especificada'}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <Clock className="w-4 h-4 mr-1.5 text-secondary" />
                            <span>{tour.duration || 'Duração não especificada'}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                            {tour.description || 'Descrição não disponível.'}
                        </p>
                        <div className="mt-auto">
                            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-105">
                                <Link to={`/tours/${tour.id}`}>Ver Detalhes</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    export default TourCard;