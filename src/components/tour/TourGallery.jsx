import React from 'react';
    import { motion } from 'framer-motion';

    const TourGallery = ({ gallery, tourName }) => {
      return (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {gallery && gallery.length > 0 ? (
            gallery.map((imageKey, index) => (
              <div key={index} className={`rounded-lg overflow-hidden shadow-md ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img 
                  class={`w-full h-full object-cover ${index === 0 ? 'aspect-video md:aspect-square' : 'aspect-video'} transition-transform duration-300 hover:scale-105`}
                  alt={`${tourName} - Imagem ${index + 1}: ${imageKey.replace(/-/g, ' ')}`} src="https://images.unsplash.com/photo-1569372314472-8aea12c94019" />
              </div>
            ))
          ) : (
            <div className="col-span-full bg-muted rounded-lg h-64 flex items-center justify-center text-muted-foreground border">
              <p>Não há imagens disponíveis para este passeio.</p>
            </div>
          )}
        </motion.section>
      );
    };

    export default TourGallery;