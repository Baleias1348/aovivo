import React, { useState, useEffect, useCallback } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { addTour, getTourById, updateTour } from '@/lib/tourData'; 
    import { useToast } from "@/components/ui/use-toast";
    import { ArrowLeft, Loader2 } from 'lucide-react';
    import TourFormInfoSection from '@/components/admin/forms/TourFormInfoSection';
    import TourFormDetailsSection from '@/components/admin/forms/TourFormDetailsSection';
    import TourFormPricingSection from '@/components/admin/forms/TourFormPricingSection';
    import TourFormContentSection from '@/components/admin/forms/TourFormContentSection';

    const TourForm = () => {
        const navigate = useNavigate();
        const { tourId } = useParams();
        const { toast } = useToast();
        const isEditing = Boolean(tourId);
        const [isLoading, setIsLoading] = useState(false);
        const [isFetching, setIsFetching] = useState(false);
        const [formErrors, setFormErrors] = useState({});

        const initialFormData = {
            nameLine1: '', nameLine2: '', location: '', duration: '',
            pricePerAdult: '0', pricePerChild: '0', description: '',
            image: '', gallery: '', itinerary: '', includes: '', excludes: '',
            isVisible: true, startTime: '', endTime: '', checklist: '',
            termsAndConditions: '', stripe_adult_signal_price_id: '',
            stripe_child_signal_price_id: '', signal_percentage: '20',
        };
        const [formData, setFormData] = useState(initialFormData);

        const validateForm = useCallback(() => {
            const errors = {};
            if (!formData.nameLine1.trim()) errors.nameLine1 = "Nome (Linha 1) é obrigatório.";
            if (!formData.location.trim()) errors.location = "Localização é obrigatória.";
            if (!formData.duration.trim()) errors.duration = "Duração é obrigatória.";
            
            const adultPrice = parseFloat(formData.pricePerAdult);
            const childPrice = parseFloat(formData.pricePerChild);
            const signalPercentage = parseFloat(formData.signal_percentage);

            if (isNaN(adultPrice) || adultPrice < 0) errors.pricePerAdult = "Preço adulto inválido ou negativo.";
            if (isNaN(childPrice) || childPrice < 0) errors.pricePerChild = "Preço criança inválido ou negativo.";
            
            if (adultPrice > 0 && !formData.stripe_adult_signal_price_id.trim()) {
                errors.stripe_adult_signal_price_id = "Price ID do sinal adulto é obrigatório se o preço adulto for maior que zero.";
            }
            if (childPrice > 0 && !formData.stripe_child_signal_price_id.trim()) {
                errors.stripe_child_signal_price_id = "Price ID do sinal criança é obrigatório se o preço criança for maior que zero.";
            }
            if (isNaN(signalPercentage) || signalPercentage <= 0 || signalPercentage > 100) {
                errors.signal_percentage = "Porcentagem do sinal deve ser entre 1 e 100.";
            }
            setFormErrors(errors);
            return Object.keys(errors).length === 0;
        }, [formData]);

        useEffect(() => {
            const fetchTour = async () => {
                if (isEditing && tourId) {
                    setIsFetching(true);
                    try {
                        const existingTour = await getTourById(tourId); 
                        if (existingTour) {
                            setFormData({
                                nameLine1: existingTour.nameLine1 || '',
                                nameLine2: existingTour.nameLine2 || '',
                                location: existingTour.location || '',
                                duration: existingTour.duration || '',
                                pricePerAdult: existingTour.pricePerAdult?.toString() || '0',
                                pricePerChild: existingTour.pricePerChild?.toString() || '0',
                                description: existingTour.description === null || existingTour.description === undefined ? '' : String(existingTour.description),
                                image: existingTour.image || '',
                                gallery: Array.isArray(existingTour.gallery) ? existingTour.gallery.join(', ') : (existingTour.gallery || ''),
                                itinerary: Array.isArray(existingTour.itinerary) ? existingTour.itinerary.join('\n') : (existingTour.itinerary || ''),
                                includes: Array.isArray(existingTour.includes) ? existingTour.includes.join('\n') : (existingTour.includes || ''),
                                excludes: Array.isArray(existingTour.excludes) ? existingTour.excludes.join('\n') : (existingTour.excludes || ''),
                                isVisible: existingTour.isVisible !== undefined ? existingTour.isVisible : true,
                                startTime: existingTour.startTime || '',
                                endTime: existingTour.endTime || '',
                                checklist: Array.isArray(existingTour.checklist) ? existingTour.checklist.join('\n') : (existingTour.checklist || ''),
                                termsAndConditions: existingTour.termsAndConditions === null || existingTour.termsAndConditions === undefined ? '' : String(existingTour.termsAndConditions),
                                stripe_adult_signal_price_id: existingTour.stripe_adult_signal_price_id || '',
                                stripe_child_signal_price_id: existingTour.stripe_child_signal_price_id || '',
                                signal_percentage: existingTour.signal_percentage?.toString() || '20',
                            });
                        } else {
                             toast({ title: "Erro", description: "Passeio não encontrado para edição.", variant: "destructive" });
                             navigate('/admin/tours');
                        }
                    } catch (error) {
                        console.error("Error fetching tour for edit:", error);
                        toast({ title: "Erro ao Carregar", description: `Não foi possível carregar dados do passeio: ${error.message}`, variant: "destructive" });
                    } finally {
                        setIsFetching(false);
                    }
                } else {
                    setFormData(initialFormData); 
                }
            };
            fetchTour();
        }, [isEditing, tourId, navigate, toast]);

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? Boolean(checked) : value 
            }));
            if (formErrors[name]) {
                setFormErrors(prev => ({...prev, [name]: null}));
            }
        };

        const handleRichTextChange = (name, value) => {
            setFormData(prev => ({ ...prev, [name]: value }));
             if (formErrors[name]) {
                setFormErrors(prev => ({...prev, [name]: null}));
            }
        };
        
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) {
                toast({ title: "Erro de Validação", description: "Por favor, corrija os erros no formulário.", variant: "destructive" });
                return;
            }
            setIsLoading(true);

            let finalIsVisible = formData.isVisible;
            let missingPriceIds = false;
            if ((parseFloat(formData.pricePerAdult) > 0 && !formData.stripe_adult_signal_price_id.trim()) ||
                (parseFloat(formData.pricePerChild) > 0 && !formData.stripe_child_signal_price_id.trim())) {
                finalIsVisible = false;
                missingPriceIds = true;
            }
            
            try {
                 const dataToSubmit = {
                    ...formData,
                    pricePerAdult: parseFloat(formData.pricePerAdult) || 0,
                    pricePerChild: parseFloat(formData.pricePerChild) || 0,
                    signal_percentage: parseFloat(formData.signal_percentage) || 20,
                    isVisible: finalIsVisible,
                };

                if (isEditing) {
                    await updateTour(tourId, dataToSubmit); 
                    toast({ title: "Passeio Atualizado", description: `O passeio "${formData.nameLine1}" foi atualizado.` });
                } else {
                    await addTour(dataToSubmit); 
                    toast({ title: "Passeio Adicionado", description: `O passeio "${formData.nameLine1}" foi adicionado.` });
                }

                if (missingPriceIds) {
                    toast({
                        title: "Aviso: Price IDs Incompletos",
                        description: "O passeio foi salvo, mas está oculto no site pois faltam Price IDs de sinal da Stripe. Complete-os para tornar o passeio visível.",
                        variant: "default",
                        duration: 7000,
                        className: "bg-yellow-100 border-yellow-400 text-yellow-700",
                    });
                }
                navigate('/admin/tours');
            } catch (error) {
                console.error("Error submitting form:", error);
                toast({ title: "Erro ao Salvar", description: error.message || "Ocorreu um erro ao salvar o passeio. Verifique o console para detalhes.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        
        if (isFetching && isEditing) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-lg">Carregando dados do passeio...</p>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto p-4">
                <Button variant="outline" onClick={() => navigate('/admin/tours')} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Passeios
                </Button>
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">{isEditing ? 'Editar Passeio' : 'Adicionar Novo Passeio'}</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <TourFormInfoSection 
                        formData={formData} 
                        handleChange={handleChange} 
                        setFormData={setFormData} 
                        formErrors={formErrors} 
                    />
                    <TourFormDetailsSection 
                        formData={formData} 
                        handleChange={handleChange} 
                        formErrors={formErrors} 
                    />
                    <TourFormPricingSection 
                        formData={formData} 
                        handleChange={handleChange} 
                        formErrors={formErrors} 
                    />
                    <TourFormContentSection 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleRichTextChange={handleRichTextChange} 
                    />
                    <Button type="submit" className="w-full text-lg py-3 mt-8" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {isLoading ? (isEditing ? 'Salvando Alterações...' : 'Adicionando Passeio...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Passeio')}
                    </Button>
                </form>
            </div>
        );
    };

    export default TourForm;