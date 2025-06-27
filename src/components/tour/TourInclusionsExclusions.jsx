import React from 'react';
    import { motion } from 'framer-motion';
    import { CheckCircle, XCircle } from 'lucide-react';

    const TourInclusionsExclusions = ({ includes, excludes }) => {
      return (
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Inclui</h3>
            {includes && includes.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                {includes.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (<p className="text-sm text-muted-foreground">Informação não disponível.</p>)}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2"><XCircle className="w-5 h-5" /> Não Inclui</h3>
            {excludes && excludes.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                {excludes.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (<p className="text-sm text-muted-foreground">Informação não disponível.</p>)}
          </div>
        </motion.section>
      );
    };

    export default TourInclusionsExclusions;