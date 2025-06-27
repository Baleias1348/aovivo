import React from 'react';
    import { motion } from 'framer-motion';
    import { FileImage as ImageIcon } from 'lucide-react';

    const TourLandingGallery = ({ gallery, tourName }) => {
      if (!gallery || gallery.length === 0) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="flex items-center justify-center text-primary mb-6 tour-section-title">
                    <ImageIcon className="w-8 h-8" />
                </div>
                <div className="bg-muted rounded-lg h-64 flex items-center justify-center text-muted-foreground border">
                    <p>Nenhuma imagem adicional disponível para este passeio.</p>
                </div>
            </motion.section>
        );
      }
      
      const mainImage = gallery[0];
      const otherImages = gallery.slice(1, 5); 

      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-center text-primary mb-6 tour-section-title">
             <ImageIcon className="w-8 h-8" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-xl border">
              <img 
                src={mainImage.startsWith('https') ? mainImage : `https://images.unsplash.com/photo-1569372314472-8aea12c94019`}
                alt={`${tourName} - Imagem Principal da Galeria`}
                className="w-full h-full object-cover aspect-[4/3] md:aspect-auto md:min-h-[300px] lg:min-h-[400px] xl:min-h-[500px] transition-transform duration-300 hover:scale-105"
              />
            </div>
            {otherImages.map((imageKey, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-xl border aspect-square w-[300px] h-[300px] max-w-full max-h-full mx-auto">
                 <img 
                  src={imageKey.startsWith('https') ? imageKey : `https://images.unsplash.com/photo-1517423440428-a5a00ad493e8`}
                  alt={`${tourName} - Imagem ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </motion.section>
      );
    };

    export default TourLandingGallery;