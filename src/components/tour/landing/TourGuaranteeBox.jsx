import React from 'react';
    import { motion } from 'framer-motion';
    import { ShieldCheck } from 'lucide-react';

    const TourGuaranteeBox = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 p-4 md:p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md"
        >
          <div className="flex items-center mb-3">
            <ShieldCheck className="w-7 h-7 text-yellow-700 mr-3 flex-shrink-0" />
            <h4 className="text-lg md:text-xl font-bold text-yellow-800">Garantia de Compra!</h4>
          </div>
          <p className="text-yellow-700 text-sm md:text-base">
            Você pode pedir o reembolso total de sua reserva até 48 horas antes da excursão.
          </p>
        </motion.div>
      );
    };

    export default TourGuaranteeBox;