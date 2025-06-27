import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ITEMS_PER_PAGE = 25; // Keep this consistent or pass as arg

const useRestaurants = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  useEffect(() => {
    const fetchRestaurantsFromDb = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from the new table 'google_imported_restaurants'
        const { data, error: dbError } = await supabase
          .from('restaurants') // Changed table name
          .select('*')
          // .eq('verified', true) // Optional: if you only want to show verified ones
          .order('ranking', { ascending: false }); // Ordenar por ranking descendente

        if (dbError) throw dbError;
        
        if (!Array.isArray(data)) {
          console.error("Data received from Supabase is not an array:", data);
          throw new Error("Formato de dados inesperado do servidor.");
        }
        setAllRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants from DB:", err);
        setError(err.message || "Falha ao buscar restaurantes. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantsFromDb();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let restaurants = [...allRestaurants];
    if (selectedCuisine !== 'all') {
      restaurants = restaurants.filter(r =>
        r.cuisine && r.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }
    // Ordenar siempre por ranking descendente
    return restaurants.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
  }, [allRestaurants, selectedCuisine]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [selectedCuisine]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRestaurants, currentPage]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);

  // Obtener todas las culinarias únicas para el filtro
  const allCuisines = Array.from(new Set(allRestaurants.map(r => r.cuisine).filter(Boolean)));

  return {
    restaurants: paginatedRestaurants,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalCount: filteredRestaurants.length,
    selectedCuisine,
    setSelectedCuisine,
    allCuisines,
    allRestaurants,
    ITEMS_PER_PAGE
  };

};

export default useRestaurants;