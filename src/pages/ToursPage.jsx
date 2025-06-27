import React, { useState, useEffect, Suspense, lazy } from 'react';
    import { getAllTours } from '@/lib/tourData';
    import { motion } from 'framer-motion';
    import { Input } from "@/components/ui/input";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Slider } from "@/components/ui/slider";
    import { Label } from "@/components/ui/label";
    import { Search, MapPin, DollarSign, Clock } from 'lucide-react';

    const TourCard = lazy(() => import('@/components/shared/TourCard'));
    const TourCardSkeleton = lazy(() => import('@/components/shared/TourCardSkeleton'));

    const ToursPage = () => {
        const [tours, setTours] = useState([]);
        const [filteredTours, setFilteredTours] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState('');
        const [locationFilter, setLocationFilter] = useState('all');
        const [priceRange, setPriceRange] = useState([0, 1000]); // Assuming max price 1000 BRL
        const [durationFilter, setDurationFilter] = useState('all');
        
        const [uniqueLocations, setUniqueLocations] = useState([]);
        const [maxPrice, setMaxPrice] = useState(1000);

        useEffect(() => {
            const fetchTours = async () => {
                setIsLoading(true);
                try {
                    const fetchedTours = await getAllTours(); // Now async
                    const visibleTours = fetchedTours.filter(tour => tour.isVisible);
                    setTours(visibleTours);
                    setFilteredTours(visibleTours);

                    const locations = [...new Set(visibleTours.map(tour => tour.location).filter(Boolean))];
                    setUniqueLocations(locations);

                    const prices = visibleTours.map(tour => tour.pricePerAdult).filter(price => typeof price === 'number');
                    const currentMaxPrice = prices.length > 0 ? Math.max(...prices) : 1000;
                    setMaxPrice(currentMaxPrice);
                    setPriceRange([0, currentMaxPrice]);

                } catch (error) {
                    console.error("Error fetching tours:", error);
                    // Handle error appropriately, maybe show a toast
                } finally {
                    // Short delay to prevent flash of loading if data comes too fast
                    setTimeout(() => setIsLoading(false), 300);
                }
            };
            fetchTours();
        }, []);

        useEffect(() => {
            let tempFilteredTours = tours;

            if (searchTerm) {
                tempFilteredTours = tempFilteredTours.filter(tour =>
                    (tour.nameLine1?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (tour.nameLine2?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (tour.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                );
            }

            if (locationFilter !== 'all') {
                tempFilteredTours = tempFilteredTours.filter(tour => tour.location === locationFilter);
            }
            
            tempFilteredTours = tempFilteredTours.filter(tour => 
                tour.pricePerAdult >= priceRange[0] && tour.pricePerAdult <= priceRange[1]
            );

            if (durationFilter !== 'all') {
                 tempFilteredTours = tempFilteredTours.filter(tour => {
                    if (!tour.duration) return false;
                    const durationValue = parseInt(tour.duration.match(/\d+/)?.[0] || "0");
                    if (durationFilter === 'short') return durationValue <= 4 && tour.duration.includes('hora'); // e.g., "4 horas"
                    if (durationFilter === 'medium') return (durationValue > 4 && tour.duration.includes('hora')) || (durationValue === 1 && tour.duration.includes('dia')); // e.g., "8 horas", "1 dia"
                    if (durationFilter === 'long') return durationValue > 1 && tour.duration.includes('dia'); // e.g., "2 dias"
                    return true;
                 });
            }

            setFilteredTours(tempFilteredTours);
        }, [searchTerm, locationFilter, priceRange, durationFilter, tours]);

        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        };

        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1
            }
        };
        
        const handlePriceRangeChange = (value) => {
            setPriceRange(value);
        };


        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                        Explore Nossos Passeios Incríveis
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Descubra aventuras inesquecíveis no Chile. Filtre por seus interesses e encontre o passeio perfeito!
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-10 p-6 bg-card border rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
                >
                    <div className="md:col-span-2 lg:col-span-1">
                        <Label htmlFor="searchTerm" className="flex items-center mb-2 text-sm font-medium"><Search className="w-4 h-4 mr-2"/>Buscar Passeio</Label>
                        <Input
                            id="searchTerm"
                            type="text"
                            placeholder="Nome do passeio, descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="locationFilter" className="flex items-center mb-2 text-sm font-medium"><MapPin className="w-4 h-4 mr-2"/>Localização</Label>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger id="locationFilter" className="w-full">
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {uniqueLocations.map(loc => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="durationFilter" className="flex items-center mb-2 text-sm font-medium"><Clock className="w-4 h-4 mr-2"/>Duração</Label>
                        <Select value={durationFilter} onValueChange={setDurationFilter}>
                            <SelectTrigger id="durationFilter" className="w-full">
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="short">Curta (até 4h)</SelectItem>
                                <SelectItem value="medium">Média (4h - 1 dia)</SelectItem>
                                <SelectItem value="long">Longa (+1 dia)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <Label htmlFor="priceRange" className="flex items-center mb-2 text-sm font-medium"><DollarSign className="w-4 h-4 mr-2"/>Faixa de Preço (Adulto)</Label>
                        <Slider
                            id="priceRange"
                            min={0}
                            max={maxPrice}
                            step={10}
                            value={priceRange}
                            onValueChange={handlePriceRangeChange}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>R${priceRange[0]}</span>
                            <span>R${priceRange[1]}</span>
                        </div>
                    </div>
                </motion.div>

                {isLoading ? (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                             <motion.div variants={itemVariants} key={index}>
                                <Suspense fallback={<div>Carregando esqueleto...</div>}>
                                    <TourCardSkeleton />
                                </Suspense>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : filteredTours.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredTours.map(tour => (
                            <motion.div variants={itemVariants} key={tour.id}>
                                <Suspense fallback={<TourCardSkeleton />}>
                                    <TourCard tour={tour} />
                                </Suspense>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-muted-foreground text-xl py-10"
                    >
                        Nenhum passeio encontrado com os filtros selecionados. Tente ajustar sua busca!
                    </motion.p>
                )}
            </div>
        );
    };

    export default ToursPage;