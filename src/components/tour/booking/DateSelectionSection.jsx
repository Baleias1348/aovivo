import React from 'react';
    import BookingFormSection from '@/components/tour/booking/BookingFormSection';
    import { Button } from '@/components/ui/button';
    import { Calendar as CalendarIcon } from 'lucide-react';
    import { Calendar } from "@/components/ui/calendar";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { format } from "date-fns";
    import { ptBR } from 'date-fns/locale'; 
    import { cn } from "@/lib/utils";

    const DateSelectionSection = ({ selectedDate, setSelectedDate, inputStyles }) => (
         <BookingFormSection title="Data da Reserva">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:text-gray-900", !selectedDate && "text-gray-400", inputStyles)}>
                  <CalendarIcon className={cn("mr-2 h-4 w-4 text-gray-600")} />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={setSelectedDate} 
                  initialFocus 
                  locale={ptBR} 
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} 
                />
              </PopoverContent>
            </Popover>
        </BookingFormSection>
    );

    export default DateSelectionSection;