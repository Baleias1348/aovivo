import React from 'react';
    import { motion } from 'framer-motion';

    const TourItinerary = ({ itinerary }) => {
      return (
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-secondary">Itinerário Detalhado</h2>
          {itinerary && itinerary.length > 0 ? (
            <ul className="space-y-3">
              {itinerary.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Itinerário não disponível.</p>
          )}
        </motion.section>
      );
    };

    export default TourItinerary;