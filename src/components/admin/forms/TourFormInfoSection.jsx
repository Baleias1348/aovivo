import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Eye, EyeOff, BadgeInfo as InfoIcon } from 'lucide-react';

    const NamePreview = ({ nameLine1, nameLine2 }) => (
        <div className="p-3 border border-dashed border-muted-foreground/50 rounded-md mt-2 min-h-[60px] bg-muted/30 text-muted-foreground">
            <p className="text-lg font-bold leading-tight">{nameLine1 || "Linha 1 do Título"}</p>
            {nameLine2 && <p className="text-md leading-tight">{nameLine2}</p>}
            {!nameLine1 && !nameLine2 && <p className="text-sm italic">Pré-visualização do Título...</p>}
        </div>
    );

    const TourFormInfoSection = ({ formData, handleChange, setFormData, formErrors }) => {
        return (
            <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                <h3 className="text-xl font-semibold text-primary mb-4">Informações Principais</h3>
                <div>
                    <Label htmlFor="nameLine1" className="text-md">Nome do Passeio (Linha 1)</Label>
                    <Input id="nameLine1" name="nameLine1" value={formData.nameLine1} onChange={handleChange} className="text-base mt-1" />
                    {formErrors.nameLine1 && <p className="text-red-500 text-xs mt-1">{formErrors.nameLine1}</p>}
                </div>
                <div>
                    <Label htmlFor="nameLine2" className="text-md">Nome do Passeio (Linha 2 - Opcional)</Label>
                    <Input id="nameLine2" name="nameLine2" value={formData.nameLine2} onChange={handleChange} className="text-base mt-1" />
                </div>
                <NamePreview nameLine1={formData.nameLine1} nameLine2={formData.nameLine2} />
                <div className="flex items-center space-x-3 pt-4">
                    <Checkbox 
                        id="isVisible" 
                        name="isVisible" 
                        checked={formData.isVisible} 
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: Boolean(checked) }))} 
                    />
                    <Label htmlFor="isVisible" className="text-base flex items-center cursor-pointer">
                        {formData.isVisible ? <Eye className="mr-2 h-5 w-5 text-green-500" /> : <EyeOff className="mr-2 h-5 w-5 text-red-500" />}
                        {formData.isVisible ? 'Visível no site' : 'Oculto no site'}
                    </Label>
                </div>
                {((parseFloat(formData.pricePerAdult) > 0 && !formData.stripe_adult_signal_price_id) ||
                  (parseFloat(formData.pricePerChild) > 0 && !formData.stripe_child_signal_price_id)) && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-sm flex items-center">
                        <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        Este passeio será salvo como oculto até que os Price IDs da Stripe sejam fornecidos para os preços definidos.
                    </div>
                )}
            </div>
        );
    };

    export default TourFormInfoSection;