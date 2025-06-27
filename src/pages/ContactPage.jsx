import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Mail, Phone, MapPin, Building } from 'lucide-react';

    const ContactPage = () => {
        const { toast } = useToast();
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            phone: '',
            message: '',
        });
        const [isSubmitting, setIsSubmitting] = useState(false);

        const contactEmail = "turismo@vibechile.com.br";
        const contactPhone = "+55 48 98477 2475";
        const addressBrazil = "Rua das Baleias Franca 567, Jurerê, Florianopolis. SC.";
        const addressChile = "Av. Providencia 1208, Providencia, Región Metropolitana.";
        
        const openingHours = {
            weekdays: "9:00 - 18:30 (Horário de Brasília)",
            saturday: "10:00 - 13:00",
            sunday: "Fechado"
        };


        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            console.log("Dados do Formulário Enviados: ", formData);

            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitting(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
            toast({
                title: "Mensagem Enviada",
                description: "Obrigado por entrar em contato. Responderemos em breve.",
                variant: "default",
            });
        };

        return (
            <div className="container py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary tracking-tight">
                        Entre em Contato
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Tem perguntas sobre sua viagem ao Chile ou quer um orçamento personalizado? Estamos aqui para ajudar!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-card p-6 md:p-8 rounded-lg border shadow-sm"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-secondary">Envie-nos uma Mensagem</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Seu Nome"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Telefone (Opcional)</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder={contactPhone}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="message">Sua Mensagem / Solicitação de Orçamento</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Descreva sua consulta ou a viagem que gostaria de fazer (destinos, datas, número de pessoas, etc.)..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                            </Button>
                        </form>
                         <p className="text-xs text-muted-foreground mt-4 text-center">
                            Ficaremos felizes em ajudar a planejar sua aventura no Chile!
                         </p>
                    </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="space-y-8"
                    >
                        <h2 className="text-2xl font-semibold text-secondary">Informações de Contato</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href={`mailto:${contactEmail}`} className="hover:text-primary">{contactEmail}</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-primary">{contactPhone}</a> (WhatsApp/Telefone)
                            </p>
                            <div className="pt-2">
                                <h3 className="text-lg font-medium text-foreground mb-1 flex items-center gap-2"><Building className="w-5 h-5 text-primary"/> Endereço Brasil:</h3>
                                <p className="flex items-center gap-3 ml-1">
                                    <MapPin className="w-4 h-4 text-primary/80 flex-shrink-0" />
                                    <span>{addressBrazil}</span>
                                </p>
                            </div>
                            <div className="pt-2">
                                <h3 className="text-lg font-medium text-foreground mb-1 flex items-center gap-2"><Building className="w-5 h-5 text-primary"/> Endereço Chile:</h3>
                                <p className="flex items-center gap-3 ml-1">
                                    <MapPin className="w-4 h-4 text-primary/80 flex-shrink-0" />
                                    <span>{addressChile}</span>
                                </p>
                            </div>
                        </div>

                         <div className="mt-8">
                             <h3 className="text-xl font-semibold mb-4 text-secondary">Horário de Atendimento</h3>
                             <p className="text-muted-foreground">Segunda a Sexta: {openingHours.weekdays}</p>
                             <p className="text-muted-foreground">Sábado: {openingHours.saturday}</p>
                             <p className="text-muted-foreground">Domingo: {openingHours.sunday}</p>
                        </div>

                         <div className="mt-8 bg-muted h-64 rounded-lg flex items-center justify-center text-muted-foreground border overflow-hidden">
                             <img  class="w-full h-full object-cover rounded-lg" alt="Vinhedo chileno exuberante com fileiras de videiras sob um céu ensolarado" src="https://images.unsplash.com/photo-1698941726772-c0b0c8e50e7a" />
                        </div>

                    </motion.div>
                </div>
            </div>
        );
    };

    export default ContactPage;