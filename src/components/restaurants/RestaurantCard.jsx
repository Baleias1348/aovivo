import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Utensils, Globe, ExternalLink, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RestaurantCard = ({ restaurant }) => {
  const {
    photo_url,
    name,
    rating,
    review_count,
    price_level,
    address,
    phone,
    Bairro,
    cuisine,
    description,
    place_link,
    website,
    ranking
  } = restaurant;

  // Compatibilidad máxima: usar photo_url o, si no existe, photos[0]
  let mainPhotoUrl = photo_url;
  if ((!mainPhotoUrl || mainPhotoUrl === "") && Array.isArray(restaurant.photos) && restaurant.photos.length > 0) {
    mainPhotoUrl = restaurant.photos[0];
  }
  const [imgError, setImgError] = React.useState(false);

  // Function to attempt to open a link, preferring place_link then website
  const handleOpenLink = () => {
    if (place_link) {
      window.open(place_link, '_blank');
    } else if (website) {
      window.open(website, '_blank');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="bg-white rounded-2xl shadow-lg border-2 border-[#0074FF] flex flex-col h-full overflow-hidden">
        {/* 1. Foto restaurant */}
        <div className="relative h-48 w-full">
          {mainPhotoUrl && !imgError ? (
            <img
              src={mainPhotoUrl}
              alt={`Foto de ${name || 'Restaurante'}`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center text-gray-400">
              <Utensils className="w-16 h-16 opacity-70" />
            </div>
          )}
        </div>
        <CardHeader className="pb-0 pt-4 px-6">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2" title={name || "Nombre no disponible"}>
            {name || "Nombre no disponible"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow px-6 pt-2 pb-0 text-[15px]">
          {/* Línea de rating, precio y estado */}
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-2">
              {/* Estrellas dinámicas */}
              {Array.from({length: 5}).map((_, i) => {
                if (typeof rating !== 'number') return <Star key={i} size={18} className="text-gray-300 mr-0.5" strokeWidth={1.5} />;
                if (rating >= i + 1) return <Star key={i} size={18} className="text-yellow-400 fill-yellow-400 mr-0.5" />;
                if (rating >= i + 0.5) return (
                  <span key={i} className="relative mr-0.5">
                    <Star size={18} className="text-yellow-400 fill-yellow-400 absolute left-0 top-0" style={{clipPath: 'inset(0 50% 0 0)'}} />
                    <Star size={18} className="text-gray-300" strokeWidth={1.5} />
                  </span>
                );
                return <Star key={i} size={18} className="text-gray-300 mr-0.5" strokeWidth={1.5} />;
              })}
              <span className="font-bold text-gray-900 ml-2">{typeof rating === 'number' ? rating.toFixed(1) : '--'}</span>
              <span className="text-gray-500 text-[13px] ml-1">({review_count || 0})</span>
              {price_level && <span className="text-green-600 font-bold text-[16px] ml-2">{price_level}</span>}
            </div>
            {/* Culinaria justo debajo de estrellas */}
            {cuisine && (
              <div className="flex items-center mb-1">
                <Utensils size={16} className="text-orange-500 mr-1" />
                <span className="text-orange-500 font-semibold">Culinária: {cuisine}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 my-2" />

          {/* Dirección */}
          {address && (
            <div className="flex items-start text-gray-600 mb-1 text-[15px]">
              <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
              <span className="break-words whitespace-pre-line" title={address}>{address}</span>
            </div>
          )}
          <div className="border-t border-gray-200 my-2" />

          {/* Bairro */}
          {Bairro && (
            <div className="text-gray-500 text-[14px] mb-1">{Bairro}</div>
          )}

          {/* Descripción */}
          {description && (
            <div className="flex items-start mb-1">
              <span className="text-orange-500 mr-2 mt-0.5"><Utensils size={16} /></span>
              <span><span className="font-semibold text-orange-500">Descrição:</span> <span className="text-gray-700 break-words whitespace-pre-line">{description}</span></span>
            </div>
          )}
          <div className="border-t border-gray-200 my-2" />

          {/* Horario de hoy (simulado) */}
          <div className="flex items-center mb-1">
            <Clock className="w-5 h-5 text-orange-500 mr-1" />
            <span className="font-semibold text-gray-700 mr-2">Horario:</span>
            {place_link ? (
              <a href={place_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">verificar</a>
            ) : (
              <span className="text-gray-400">verificar</span>
            )}
          </div>



          {/* Separador */}
          <div className="border-t border-gray-200 my-2" />

          {/* Botones */}
          <div className="flex gap-3 pb-3 pt-1">
            {place_link && (
              <button onClick={() => window.open(place_link, '_blank')} className="flex-1 flex items-center justify-center gap-2 bg-white border border-orange-500 text-orange-500 font-semibold rounded-full py-2 hover:bg-orange-50 transition">
                <MapPin size={18} className="text-orange-500" />
                Mapa
              </button>
            )}
            {website && (
              <button onClick={() => window.open(website, '_blank')} className="flex-1 flex items-center justify-center gap-2 bg-white border border-orange-500 text-orange-500 font-semibold rounded-full py-2 hover:bg-orange-50 transition">
                <Globe size={18} className="text-orange-500" />
                Sitio Web
              </button>
            )}
          </div>
        </CardContent>
        {/* Ranking (score) */}
        {typeof ranking === 'number' && (
          <div className="px-4 pb-2 text-xs text-right text-muted-foreground">Ranking (score): <span className="font-semibold text-foreground">{ranking.toFixed(2)}</span></div>
        )}
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;