import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { AlertCircle, BadgePercent as PercentIcon } from 'lucide-react';

    const SignalCalculator = ({ price, percentage, type }) => {
        const signalAmount = (parseFloat(price) || 0) * (parseFloat(percentage) || 0) / 100;
        return (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">Sinal {type} calculado: 
                    <span className="font-bold ml-1">R$ {signalAmount.toFixed(2)}</span>
                </p>
                <p className="text-xs text-blue-600">Este valor deve corresponder ao preço configurado no Price ID do Stripe.</p>
            </div>
        );
    };

    const TourFormPricingSection = ({ formData, handleChange, formErrors }) => {
        return (
            <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                <h3 className="text-xl font-semibold text-primary mb-4">Preços e Configuração de Sinal Stripe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="pricePerAdult" className="text-md">Preço por Adulto (BRL)</Label>
                        <Input id="pricePerAdult" name="pricePerAdult" type="number" step="0.01" value={formData.pricePerAdult} onChange={handleChange} className="text-base mt-1" />
                        {formErrors.pricePerAdult && <p className="text-red-500 text-xs mt-1">{formErrors.pricePerAdult}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pricePerChild" className="text-md">Preço por Criança (BRL)</Label>
                        <Input id="pricePerChild" name="pricePerChild" type="number" step="0.01" value={formData.pricePerChild} onChange={handleChange} className="text-base mt-1" />
                        {formErrors.pricePerChild && <p className="text-red-500 text-xs mt-1">{formErrors.pricePerChild}</p>}
                    </div>
                </div>
                <div className="mt-6">
                    <Label htmlFor="signal_percentage" className="text-md flex items-center">
                        <PercentIcon className="w-4 h-4 mr-2" /> Porcentagem do Sinal (%)
                    </Label>
                    <Input id="signal_percentage" name="signal_percentage" type="number" step="1" min="1" max="100" value={formData.signal_percentage} onChange={handleChange} className="text-base mt-1 w-32" />
                    {formErrors.signal_percentage && <p className="text-red-500 text-xs mt-1">{formErrors.signal_percentage}</p>}
                </div>

                {parseFloat(formData.pricePerAdult) > 0 && (
                    <SignalCalculator price={formData.pricePerAdult} percentage={formData.signal_percentage} type="Adulto" />
                )}
                {parseFloat(formData.pricePerChild) > 0 && (
                     <SignalCalculator price={formData.pricePerChild} percentage={formData.signal_percentage} type="Criança" />
                )}
                
                <p className="text-sm text-muted-foreground mt-6 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                    Crie produtos/preços correspondentes no seu Dashboard Stripe para os valores de sinal calculados acima. Cole os "Price IDs" aqui.
                </p>
                <div>
                    <Label htmlFor="stripe_adult_signal_price_id" className="text-md">Stripe Price ID - Sinal Adulto</Label>
                    <Input id="stripe_adult_signal_price_id" name="stripe_adult_signal_price_id" value={formData.stripe_adult_signal_price_id} onChange={handleChange} placeholder="price_xxxxxxxxxxxxxx" className="text-base mt-1" />
                    {formErrors.stripe_adult_signal_price_id && <p className="text-red-500 text-xs mt-1">{formErrors.stripe_adult_signal_price_id}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Obrigatório se Preço por Adulto > 0.</p>
                </div>
                <div>
                    <Label htmlFor="stripe_child_signal_price_id" className="text-md">Stripe Price ID - Sinal Criança</Label>
                    <Input id="stripe_child_signal_price_id" name="stripe_child_signal_price_id" value={formData.stripe_child_signal_price_id} onChange={handleChange} placeholder="price_yyyyyyyyyyyyyy" className="text-base mt-1" />
                    {formErrors.stripe_child_signal_price_id && <p className="text-red-500 text-xs mt-1">{formErrors.stripe_child_signal_price_id}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Obrigatório se Preço por Criança > 0. Deixe em branco se não aplicável.</p>
                </div>
            </div>
        );
    };
    export default TourFormPricingSection;