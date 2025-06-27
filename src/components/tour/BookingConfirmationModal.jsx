import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
    import { Button } from "@/components/ui/button";
    import { CheckCircle, CalendarDays, Users, MapPin, DollarSign, Hash } from 'lucide-react';
    import { format } from 'date-fns';
    import { ptBR } from 'date-fns/locale';

    const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails, tour }) => {
        if (!isOpen || !bookingDetails || !tour) {
            return null;
        }

        const { 
            adults = 0, 
            children = 0, 
            date, 
            totalPrice = 0, 
            downPaymentAmount = 0, // Changed from signalPaid to downPaymentAmount
            name = 'N/A', 
            email = 'N/A', 
            phone 
        } = bookingDetails;

        const formattedDate = date ? format(new Date(date), "PPP", { locale: ptBR }) : 'Data não especificada';
        
        // Ensure totalPrice and downPaymentAmount are numbers before calling toFixed
        const numericTotalPrice = Number(totalPrice) || 0;
        const numericDownPaymentAmount = Number(downPaymentAmount) || 0;
        const balanceDue = numericTotalPrice - numericDownPaymentAmount;

        const tourNameDisplay = tour.name ? tour.name.split('\n').join(' - ') : 'Nome do Passeio Indisponível';

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
                    <DialogHeader className="pt-6">
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            Reserva Confirmada!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            Seu voucher eletrônico foi gerado. Apresente-o no início da excursão.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 px-2 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="p-4 border rounded-lg bg-background/30">
                            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                                <MapPin size={20} className="mr-2" /> {tourNameDisplay}
                            </h3>
                            <p className="text-sm text-muted-foreground">{tour.location || 'Localização indisponível'}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem icon={<CalendarDays size={18} />} label="Data da Excursão" value={formattedDate} />
                            {tour.startTime && <InfoItem icon={<CalendarDays size={18} />} label="Horário" value={`${tour.startTime}${tour.endTime ? ` - ${tour.endTime}` : ''}`} />}
                            <InfoItem icon={<Users size={18} />} label="Adultos" value={adults.toString()} />
                            {children > 0 && <InfoItem icon={<Users size={18} />} label="Crianças" value={children.toString()} />}
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold mb-2 text-secondary">Detalhes do Pagamento:</h4>
                            <InfoItem icon={<DollarSign size={18} />} label="Valor Total da Reserva" value={`R$ ${numericTotalPrice.toFixed(2)}`} />
                            <InfoItem icon={<DollarSign size={18} className="text-green-500"/>} label="Sinal Pago" value={`R$ ${numericDownPaymentAmount.toFixed(2)}`} />
                            <InfoItem icon={<DollarSign size={18} />} label="Saldo a Pagar no Dia" value={`R$ ${balanceDue.toFixed(2)}`} />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold mb-2 text-secondary">Seus Dados:</h4>
                            <InfoItem icon={<Hash size={18} />} label="Nome" value={name} />
                            <InfoItem icon={<Hash size={18} />} label="E-mail" value={email} />
                            {phone && <InfoItem icon={<Hash size={18} />} label="Telefone" value={phone} />}
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center pt-4">
                            Uma cópia desta confirmação (simulada) seria enviada para seu e-mail.
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-center pt-6">
                        <Button onClick={onClose} variant="default" className="w-full sm:w-auto">
                            Fechar
                        </Button>
                        <Button onClick={() => window.print()} variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
                            Imprimir Voucher
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const InfoItem = ({ icon, label, value }) => (
        <div className="flex items-start py-1.5">
            <span className="text-primary mr-2 mt-0.5">{icon}</span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-sm">{value}</p>
            </div>
        </div>
    );

    export default BookingConfirmationModal;