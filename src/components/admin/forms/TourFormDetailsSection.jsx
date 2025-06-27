import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';

    const TourFormDetailsSection = ({ formData, handleChange, formErrors }) => {
        return (
            <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                <h3 className="text-xl font-semibold text-primary mb-4">Detalhes Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="location" className="text-md">Localização</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleChange} className="text-base mt-1" />
                        {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                    </div>
                    <div>
                        <Label htmlFor="duration" className="text-md">Duração</Label>
                        <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} className="text-base mt-1" />
                        {formErrors.duration && <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="startTime" className="text-md">Horário de Início (HH:MM)</Label>
                        <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} className="text-base mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="endTime" className="text-md">Horário de Término (HH:MM)</Label>
                        <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} className="text-base mt-1" />
                    </div>
                </div>
            </div>
        );
    };

    export default TourFormDetailsSection;