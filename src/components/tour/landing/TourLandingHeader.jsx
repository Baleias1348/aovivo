import React from 'react';
    import { motion } from 'framer-motion';
    import { MapPin, Clock, ShoppingCart } from 'lucide-react';
    import { Button } from '@/components/ui/button';

    const TourLandingHeader = ({ name, location, duration, pricePerAdult, signalPercentage, heroImageSrc, heroImageAlt, onReserveClick }) => {
      const signalAmount = (pricePerAdult * (signalPercentage || 20)) / 100;

      return (
        <section className="relative h-[70vh] md:h-[80vh] text-white flex flex-col justify-end items-start">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImageSrc}
              alt={heroImageAlt}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="relative z-10 container pb-12 md:pb-20 space-y-3 md:space-y-4">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
              style={{ textShadow: '2px 3px 10px rgba(0,0,0,0.8)', whiteSpace: 'pre-line' }}
            >
              {name}
            </motion.h1>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lg md:text-xl"
              style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.7)' }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                {location}
              </span>
              {duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                  {duration}
                </span>
              )}
            </motion.div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-x-6 gap-y-4 pt-2" 
            >
              {pricePerAdult > 0 && (
                  <p
                      className="text-2xl font-medium"
                      style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.7)' }}
                  >
                      Apenas <span className="font-bold">R${pricePerAdult.toFixed(2)}</span> BRL por pessoa
                  </p>
              )}
              {pricePerAdult > 0 && signalAmount > 0 && (
                <Button
                  onClick={onReserveClick}
                  className="bg-[#fffc3b] text-black border-2 border-black hover:bg-yellow-400 hover:border-black shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 text-base px-6 py-4 font-semibold rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{ textShadow: 'none' }} 
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  <span className="text-center leading-tight">Reserve com apenas<br className="sm:hidden" /> R${signalAmount.toFixed(2)} p/p</span>
                </Button>
              )}
            </motion.div>
          </div>
        </section>
      );
    };

    export default TourLandingHeader;