import React from 'react';
    import { motion } from 'framer-motion';
    import { CalendarDays, MapPin, DollarSign } from 'lucide-react';

    const TourHeader = ({ name, location, duration, pricePerAdult }) => {
      return (
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-primary tracking-tight"
          >
            {name}
          </motion.h1>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-base md:text-lg"
          >
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-secondary" /> {location}</span>
            <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-secondary" /> {duration}</span>
            <span className="flex items-center gap-1.5 font-semibold"><DollarSign className="w-4 h-4 text-secondary" /> Apenas R${pricePerAdult} BRL p/p</span>
          </motion.div>
        </div>
      );
    };

    export default TourHeader;