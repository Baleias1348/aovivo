import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { MessageSquare, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useLocation } from 'react-router-dom';

    const WhatsAppButton = ({ phoneNumber, tourName }) => {
        const [isVisible, setIsVisible] = useState(true);
        const location = useLocation();

        const cleanPhoneNumber = String(phoneNumber || "").replace(/\D/g, '');
        
        let defaultMessage = "Olá! Gostaria de mais informações sobre seus passeios no Chile.";
        if (tourName) {
            defaultMessage = `Olá! Gostaria de perguntar sobre o passeio ${tourName}.`;
        } else if (location.pathname.startsWith('/tours/')) {
            defaultMessage = "Olá! Gostaria de perguntar sobre este passeio.";
        }


        const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

        if (!cleanPhoneNumber) {
            console.warn("WhatsAppButton: O número de telefone não está configurado.");
            return null;
        }

        if (!isVisible) {
            return null;
        }
        
        const containerVariants = {
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, type: "spring", stiffness: 120 } },
            exit: { opacity: 0, y: 50, transition: { duration: 0.3 } }
        };

        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed bottom-5 right-5 z-50 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-2xl flex items-center space-x-3 border border-blue-400 max-w-xs sm:max-w-sm md:max-w-md"
                    >
                        <a 
                            href={whatsappUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Contatar por WhatsApp"
                            className="flex items-center space-x-3 text-white hover:text-green-300 transition-colors duration-200"
                        >
                            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 flex-shrink-0" />
                            <div className="flex flex-col">
                                <p className="text-sm sm:text-base font-semibold leading-tight">
                                    Dúvidas sobre este passeio?
                                </p>
                                <p className="text-xs sm:text-sm text-blue-200">
                                    Fale com nossa equipe!
                                </p>
                            </div>
                        </a>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-200 hover:text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 absolute top-1 right-1"
                            onClick={() => setIsVisible(false)}
                            aria-label="Fechar caixa de contato do WhatsApp"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    export default WhatsAppButton;