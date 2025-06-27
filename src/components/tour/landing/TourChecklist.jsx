import React from 'react';
    import { motion } from 'framer-motion';
    import { ListChecks, CheckCircle2 } from 'lucide-react';

    const TourChecklist = ({ checklist }) => {
      if (!checklist || checklist.length === 0) {
        return null;
      }
      
      const checklistItems = Array.isArray(checklist) ? checklist : (typeof checklist === 'string' ? checklist.split('\n').filter(Boolean) : []);


      if (checklistItems.length === 0) return null;

      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center gap-3 tour-section-title">
            <ListChecks className="w-6 h-6" /> Checklist para o Passeio
          </h3>
          <div className="bg-muted/50 p-4 md:p-6 rounded-lg border">
            <ul className="space-y-2">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start text-base md:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      );
    };

    export default TourChecklist;