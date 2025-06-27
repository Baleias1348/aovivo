import React from 'react';
    import { motion } from 'framer-motion';
    import { MapPin, Clock, Info } from 'lucide-react';

    const TourLandingDescription = ({ name, location, pricePerAdult, description, duration, signalPercentage }) => {
      const actualSignalPercentage = signalPercentage || 20;
      const downPayment = pricePerAdult * (actualSignalPercentage / 100);

      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <p className="text-lg font-semibold text-foreground mb-1" style={{ color: '#3b82f6' }}>Sobre este Passeio</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2" style={{ lineHeight: '1.3', whiteSpace: 'pre-line' }}>{name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mb-3">
              {location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {location}</span>}
              {duration && <span className="flex items-center gap-1.5"><Clock size={16} /> {duration}</span>}
            </div>
            {pricePerAdult > 0 && (
              <p className="text-xl md:text-2xl font-semibold text-secondary">
                Apenas R${pricePerAdult.toFixed(2)} BRL por pessoa
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              {description && (
                <div 
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-muted-foreground leading-relaxed tour-description-text"
                  dangerouslySetInnerHTML={{ __html: description }} 
                />
              )}
            </div>
            {pricePerAdult > 0 && (
              <div className="md:col-span-1 p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#fffc3b', color: '#000000' }}>
                <div className="flex items-center mb-2">
                  <Info size={20} className="mr-2 flex-shrink-0" />
                  <h4 className="font-semibold text-base md:text-lg">Reserve com Facilidade!</h4>
                </div>
                <p className="text-sm md:text-base">
                  Agora você paga apenas {actualSignalPercentage}% do preço para reservar:
                </p>
                <p className="font-bold text-lg md:text-xl mt-1">
                  R$ {downPayment.toFixed(2)} por pessoa
                </p>
              </div>
            )}
          </div>
        </motion.section>
      );
    };

    export default TourLandingDescription;