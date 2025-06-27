import React, { useState } from 'react';
    import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { motion, AnimatePresence } from 'framer-motion';

    const CollapsibleSection = ({ title, content, initiallyOpen = false }) => {
      const [isOpen, setIsOpen] = useState(initiallyOpen);

      if (!content || content.trim() === '' || content.trim() === '<p><br></p>') {
        return null;
      }

      return (
        <div>
          <Button 
            variant="link" 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-primary hover:text-primary-dark px-0 text-sm md:text-base mb-0.5 flex items-center w-full justify-start"
          >
            {title}
            {isOpen ? <ChevronUp className="ml-auto h-3 w-3 md:h-4 md:w-4" /> : <ChevronDown className="ml-auto h-3 w-3 md:h-4 md:w-4" />}
          </Button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div 
                  className="prose prose-xs max-w-none text-muted-foreground space-y-1 pt-0.5 pb-1"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    const TourTerms = ({ terms }) => {
      const generalTermsContent = `
        <p><strong>Política de Cancelamento Geral:</strong></p>
        <ul>
          <li>Cancelamentos feitos com mais de 7 dias de antecedência da data do passeio: Reembolso de 90% do valor pago (10% de taxa administrativa).</li>
          <li>Cancelamentos feitos entre 7 dias e 48 horas de antecedência: Reembolso de 50% do valor pago.</li>
          <li>Cancelamentos feitos com menos de 48 horas de antecedência ou não comparecimento (no-show): Sem reembolso.</li>
        </ul>
        <p><strong>Alterações de Reserva:</strong> Alterações de data ou passeio estão sujeitas à disponibilidade e podem incorrer em taxas adicionais. Devem ser solicitadas com no mínimo 72 horas de antecedência.</p>
        <p><strong>Condições Climáticas:</strong> Alguns passeios podem ser cancelados ou adiados devido a condições climáticas adversas. Nesses casos, ofereceremos a opção de reagendamento ou reembolso integral.</p>
        <p><strong>Responsabilidade:</strong> Vibe Chile atua como intermediária entre o cliente e os prestadores de serviço (transporte, guias, etc.) e não se responsabiliza por perdas, danos, acidentes ou atrasos causados por terceiros ou força maior.</p>
        <p>Ao realizar a reserva, o cliente declara estar ciente e de acordo com todos os termos e condições aqui estabelecidos e os específicos do passeio, se houver.</p>
      `;

      const hasSpecificTerms = terms && terms.trim() !== '' && terms.trim() !== '<p><br></p>';

      return (
        <section className="p-2 md:p-3 bg-card rounded-md shadow-sm border mt-6">
          <div className="flex items-center text-primary mb-1">
            <FileText size={18} className="mr-1.5" />
            <h2 className="text-base md:text-lg font-semibold">Termos e Condições</h2>
          </div>
          
          {hasSpecificTerms && (
            <div className="mb-0.5 border-b pb-0.5">
                 <CollapsibleSection 
                    title="Ler Termos Específicos do Passeio"
                    content={terms}
                />
            </div>
          )}

          <div>
            <CollapsibleSection 
                title="Ler Termos e Condições Gerais da Vibe Chile"
                content={generalTermsContent}
            />
          </div>
        </section>
      );
    };

    export default TourTerms;