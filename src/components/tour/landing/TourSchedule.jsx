import React from 'react';
    import { motion } from 'framer-motion';
    import { Clock } from 'lucide-react';

    const TourSchedule = ({ startTime, endTime }) => {
      if (!startTime && !endTime) {
        return null;
      }

      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:mt-12"
        >
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center gap-3 tour-section-title">
            <Clock className="w-6 h-6" /> Horário da Excursão
          </h3>
          <div className="bg-muted/50 p-4 md:p-6 rounded-lg border">
            {startTime && endTime ? (
              <p className="text-foreground">
                A excursão começa às <span className="font-semibold">{startTime}</span> horas e termina aproximadamente às <span className="font-semibold">{endTime}</span> horas.
              </p>
            ) : startTime ? (
              <p className="text-foreground">
                A excursão começa aproximadamente às <span className="font-semibold">{startTime}</span> horas.
              </p>
            ) : endTime ? (
              <p className="text-foreground">
                A excursão termina aproximadamente às <span className="font-semibold">{endTime}</span> horas.
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground mt-2">
              Os horários podem variar ligeiramente dependendo das condições do dia e do trânsito.
            </p>
          </div>
        </motion.section>
      );
    };

    export default TourSchedule;