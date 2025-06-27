import React from 'react';
    import { motion } from 'framer-motion';
    import { ListChecks } from 'lucide-react';

    const TourLandingItinerary = ({ itinerary }) => {
      if (!itinerary || itinerary.length === 0) {
        return null;
      }

      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-muted/50 p-6 md:p-8 rounded-xl shadow-lg border"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <ListChecks className="w-7 h-7" /> Itinerário Detalhado
          </h2>
          <ul className="space-y-4">
            {itinerary.map((item, index) => (
              <li key={index} className="flex items-start gap-4 p-3 bg-background rounded-md border border-border/70 shadow-sm">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shadow">
                  {index + 1}
                </div>
                <span className="text-muted-foreground text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      );
    };

    export default TourLandingItinerary;