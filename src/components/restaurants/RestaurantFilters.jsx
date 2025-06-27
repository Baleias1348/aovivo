import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// These could be dynamically generated from your data or remain predefined
// Opciones fijas y ordenadas para culinaria
const fixedCuisines = [
  "Chilena",
  "Frutos do mar",
  "Churrascaria",
  "Peruana",
  "Pizzaria",
  "Italiana"
];


const RestaurantFilters = ({
  selectedCuisine,
  setSelectedCuisine,
  allCuisines = [] // Debe ser un array de strings únicas (todas las culinarias presentes en los datos)
}) => {
  // Construir el listado de opciones para el selector
  // Primero las fijas, luego el resto en orden alfabético, sin duplicados
  const lowerFixed = fixedCuisines.map(c => c.toLowerCase());
  const dynamicCuisines = allCuisines
    .map(c => c && typeof c === 'string' ? c.trim() : null)
    .filter((c, i, arr) => c && !lowerFixed.includes(c.toLowerCase()) && arr.indexOf(c) === i)
    .sort((a, b) => a.localeCompare(b));
  const options = [
    { value: 'all', label: 'Todas as culinarias' },
    ...fixedCuisines.map(c => ({ value: c, label: c })),
    ...dynamicCuisines.map(c => ({ value: c, label: c }))
  ];

  return (
    <div className="mb-8 md:mb-10 p-5 md:p-6 bg-card rounded-xl shadow-xl border border-border/60">
      <div className="w-full max-w-xs mx-auto">
        <label htmlFor="cuisineFilter" className="block text-sm font-medium text-muted-foreground mb-1.5">Culinaria</label>
        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
          <SelectTrigger id="cuisineFilter" className="w-full rounded-lg shadow-sm border-input focus:border-primary focus:ring-primary py-2.5 text-base">
            <SelectValue placeholder="Seleccionar culinaria" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="text-base">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RestaurantFilters;