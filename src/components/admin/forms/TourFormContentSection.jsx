import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import RichTextEditor from '@/components/admin/forms/RichTextEditor';

    const TourFormContentSection = ({ formData, handleChange, handleRichTextChange }) => {
        return (
            <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                <h3 className="text-xl font-semibold text-primary mb-4">Conteúdo do Passeio</h3>
                <div>
                    <Label htmlFor="description" className="text-md">Descrição Detalhada</Label>
                    <RichTextEditor
                        value={formData.description}
                        onChange={(value) => handleRichTextChange('description', value)}
                        placeholder="Descreva o passeio em detalhes..."
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="image" className="text-md">URL da Imagem Principal</Label>
                    <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://exemplo.com/imagem-principal.jpg" className="text-base mt-1" />
                </div>
                <div>
                    <Label htmlFor="gallery" className="text-md">Galeria de Imagens (URLs separadas por vírgula)</Label>
                    <Textarea id="gallery" name="gallery" value={formData.gallery} onChange={handleChange} rows={3} placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg" className="text-base mt-1" />
                </div>
                <div>
                    <Label htmlFor="itinerary" className="text-md">Itinerário (um item por linha)</Label>
                    <Textarea id="itinerary" name="itinerary" value={formData.itinerary} onChange={handleChange} rows={5} placeholder="Dia 1: Chegada e city tour&#x0a;Dia 2: Excursão ao Vale..." className="text-base mt-1" />
                </div>
                <div>
                    <Label htmlFor="checklist" className="text-md">Checklist para o Passeio (um item por linha)</Label>
                    <Textarea id="checklist" name="checklist" value={formData.checklist} onChange={handleChange} rows={4} placeholder="Protetor solar&#x0a;Chapéu ou boné&#x0a;Água" className="text-base mt-1" />
                </div>
                <div>
                    <Label htmlFor="includes" className="text-md">O que Inclui (um item por linha)</Label>
                     <Textarea 
                        id="includes"
                        name="includes"
                        value={formData.includes} 
                        onChange={handleChange} 
                        rows={4} 
                        placeholder="Transporte ida e volta&#x0a;Guia bilíngue&#x0a;Seguro viagem" 
                        className="text-base mt-1" 
                    />
                </div>
                <div>
                    <Label htmlFor="excludes" className="text-md">O que Não Inclui (um item por linha)</Label>
                    <Textarea 
                        id="excludes"
                        name="excludes"
                        value={formData.excludes} 
                        onChange={handleChange} 
                        rows={4} 
                        placeholder="Almoço e bebidas&#x0a;Gorjetas&#x0a;Entradas para parques" 
                        className="text-base mt-1" 
                    />
                </div>
                <div>
                    <Label htmlFor="termsAndConditions" className="text-md">Termos e Condições Específicos</Label>
                    <RichTextEditor
                        value={formData.termsAndConditions}
                        onChange={(value) => handleRichTextChange('termsAndConditions', value)}
                        placeholder="Detalhe os termos e condições..."
                        className="mt-1"
                    />
                </div>
            </div>
        );
    };

    export default TourFormContentSection;