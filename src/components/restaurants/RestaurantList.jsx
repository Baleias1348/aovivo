import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/restaurants/Skeletons';
import { AlertTriangle, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE_FOR_SKELETON = 8; // How many skeletons to show

const RestaurantList = ({
  restaurants,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: ITEMS_PER_PAGE_FOR_SKELETON }).map((_, index) => (
          <RestaurantCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 px-6 bg-destructive/10 border border-destructive/30 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Oops! Algo deu errado.</h2>
        <p className="text-destructive/80 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive" className="bg-destructive hover:bg-destructive/90">
          Tentar Novamente
        </Button>
      </motion.div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-6 bg-card border rounded-lg shadow-lg max-w-md mx-auto"
      >
        <FilterIcon className="mx-auto h-16 w-16 text-muted-foreground/70 mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-3">Nenhum Restaurante Encontrado</h2>
        <p className="text-muted-foreground">
          Ainda não temos restaurantes que correspondam a esta seleção. Estamos sempre atualizando nosso guia!
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10"
      >
        {restaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.business_id || restaurant.place_id} // Use business_id or place_id as key
            restaurant={restaurant}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default RestaurantList;