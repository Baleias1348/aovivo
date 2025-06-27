import React from 'react';
    import { motion } from 'framer-motion';

    const TourDescription = ({ description }) => {
      return (
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-secondary">Descrição do Passeio</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.section>
      );
    };

    export default TourDescription;