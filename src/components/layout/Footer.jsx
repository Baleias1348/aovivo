import React from 'react';
    import { Link } from 'react-router-dom';
    import { Facebook, Instagram, Twitter, Plane, Mail, Phone, MapPin, Building } from 'lucide-react';

    const Footer = () => {
        const currentYear = new Date().getFullYear();
        const contactEmail = "turismo@vibechile.com.br";
        const contactPhone = "+55 48 98477 2475";
        const addressBrazil = "Rua das Baleias Franca 567, Jurerê, Florianopolis. SC.";
        const addressChile = "Av. Providencia 1208, Providencia, Región Metropolitana.";
        const facebookUrl = "https://facebook.com/vibechile";
        const instagramUrl = "https://instagram.com/vibechile";
        const twitterUrl = "https://twitter.com/vibechile";

        return (
            <footer className="bg-muted text-muted-foreground border-t mt-12">
                <div className="container py-10 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="space-y-4">
                            <Link to="/" className="flex items-center gap-2">
                                <Plane className="h-7 w-7 text-primary" />
                                <span className="font-bold text-xl text-primary">Vibe Chile</span>
                            </Link>
                            <p className="text-sm">
                                Sua aventura começa aqui. Explore as maravilhas do Chile conosco.
                            </p>
                            <div className="flex space-x-4 pt-2">
                                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div className="md:col-span-1 lg:col-span-2">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                     <h4 className="font-semibold text-foreground mb-4 text-lg">Entre em Contato</h4>
                                     <div className="space-y-2 text-sm">
                                        <p className="flex items-start gap-2">
                                            <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <a href={`mailto:${contactEmail}`} className="hover:text-primary">{contactEmail}</a>
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-primary">{contactPhone}</a>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-4 text-lg">Endereços:</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <Building className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-medium text-foreground block">Brasil:</span>
                                                <span>{addressBrazil}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Building className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-medium text-foreground block">Chile:</span>
                                                <span>{addressChile}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 md:mt-12 pt-8 border-t text-center text-sm">
                        © {currentYear} Vibe Chile. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        );
    };

    export default Footer;