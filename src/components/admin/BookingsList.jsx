import React, { useState, useEffect } from 'react';
    import { getAllBookings } from '@/lib/tourData'; // Uses bookingCrud.js which is now async
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Button } from '@/components/ui/button';
    import { Download, Eye as ViewIcon, Edit, Loader2, AlertTriangle, MessageSquare, DollarSign as BalanceIcon } from 'lucide-react';
    import { format, parseISO } from 'date-fns';
    import { ptBR } from 'date-fns/locale';
    import { exportToCsv } from '@/lib/exportToCsv';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Input } from '@/components/ui/input';
    import { supabase } from '@/lib/supabaseClient'; // For direct update
    import { useToast } from "@/components/ui/use-toast";

    const BookingDetailModal = ({ booking, isOpen, onClose, onUpdateBooking }) => {
        const [internalNotes, setInternalNotes] = useState(booking?.internal_notes || '');
        const [followUpStatus, setFollowUpStatus] = useState(booking?.follow_up_status || '');
        const [balancePaidDate, setBalancePaidDate] = useState(
            booking?.balance_paid_date ? format(parseISO(booking.balance_paid_date), 'yyyy-MM-dd') : ''
        );
        const [isSaving, setIsSaving] = useState(false);
        const { toast } = useToast();

        useEffect(() => {
            if (booking) {
                setInternalNotes(booking.internal_notes || '');
                setFollowUpStatus(booking.follow_up_status || '');
                setBalancePaidDate(booking.balance_paid_date ? format(parseISO(booking.balance_paid_date), 'yyyy-MM-dd') : '');
            }
        }, [booking]);

        if (!booking) return null;

        const handleSaveTracking = async () => {
            setIsSaving(true);
            const updateData = {
                internal_notes: internalNotes,
                follow_up_status: followUpStatus,
                balance_paid_date: balancePaidDate ? new Date(balancePaidDate).toISOString() : null,
            };

            const { error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('booking_id', booking.bookingId);

            setIsSaving(false);
            if (error) {
                toast({ title: "Erro ao Atualizar", description: "Não foi possível salvar as informações de rastreamento.", variant: "destructive" });
                console.error("Error updating booking tracking:", error);
            } else {
                toast({ title: "Sucesso", description: "Informações de rastreamento atualizadas." });
                onUpdateBooking({ ...booking, ...updateData }); // Update local state
                onClose();
            }
        };
        
        const tourDetails = booking.tourDetails || {};
        const bookingDate = booking.bookingCreatedAt ? format(parseISO(booking.bookingCreatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A';
        const tourDate = booking.date ? format(parseISO(booking.date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';


        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Detalhes da Reserva - <span className="font-mono text-primary text-xl">{booking.bookingId.substring(0,8)}...</span></DialogTitle>
                        <DialogDescription>
                            Visualizando detalhes completos da reserva para {booking.name} no passeio {tourDetails.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-4 border rounded-lg">
                            <div><strong className="block text-sm text-muted-foreground">Passeio:</strong> {tourDetails.name}</div>
                            <div><strong className="block text-sm text-muted-foreground">Local:</strong> {tourDetails.location}</div>
                            <div><strong className="block text-sm text-muted-foreground">Data da Reserva:</strong> {bookingDate}</div>
                            <div><strong className="block text-sm text-muted-foreground">Data do Passeio:</strong> {tourDate}</div>
                            <div><strong className="block text-sm text-muted-foreground">Adultos:</strong> {booking.adults}</div>
                            <div><strong className="block text-sm text-muted-foreground">Crianças:</strong> {booking.children}</div>
                            <div><strong className="block text-sm text-muted-foreground">Nome Cliente:</strong> {booking.name}</div>
                            <div><strong className="block text-sm text-muted-foreground">Email Cliente:</strong> {booking.email}</div>
                            <div><strong className="block text-sm text-muted-foreground">Telefone:</strong> {booking.phone || 'N/A'}</div>
                            <div><strong className="block text-sm text-muted-foreground">ID Sessão Stripe:</strong> {booking.sessionId || 'N/A'}</div>
                            <div><strong className="block text-sm text-muted-foreground">Preço Total:</strong> R$ {booking.totalPrice?.toFixed(2)}</div>
                            <div><strong className="block text-sm text-muted-foreground">Sinal Pago:</strong> R$ {booking.downPaymentAmount?.toFixed(2)}</div>
                            <div><strong className="block text-sm text-muted-foreground">Status Pagamento:</strong> {booking.paymentStatus}</div>
                        </div>

                        <div className="p-4 border rounded-lg space-y-4">
                            <h3 className="text-lg font-semibold">Rastreamento do Cliente</h3>
                            <div>
                                <Label htmlFor="balancePaidDate">Data Pagamento Saldo</Label>
                                <Input 
                                    type="date" 
                                    id="balancePaidDate" 
                                    value={balancePaidDate} 
                                    onChange={(e) => setBalancePaidDate(e.target.value)} 
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="followUpStatus">Status do Follow-up</Label>
                                <Input 
                                    id="followUpStatus" 
                                    value={followUpStatus} 
                                    onChange={(e) => setFollowUpStatus(e.target.value)} 
                                    placeholder="Ex: Contatado, Feedback Coletado" 
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="internalNotes">Notas Internas</Label>
                                <Textarea 
                                    id="internalNotes" 
                                    value={internalNotes} 
                                    onChange={(e) => setInternalNotes(e.target.value)} 
                                    placeholder="Adicione notas sobre este cliente ou reserva..." 
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                            <Button onClick={handleSaveTracking} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Salvar Rastreamento
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };


    const BookingsList = () => {
        const [bookings, setBookings] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const [selectedBooking, setSelectedBooking] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);

        const fetchBookings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedBookings = await getAllBookings(); // Now async
                setBookings(fetchedBookings);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("Não foi possível carregar as reservas. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchBookings();
        }, []);

        const handleExportCsv = () => {
            if (bookings.length === 0) {
                alert("Não há reservas para exportar.");
                return;
            }
            const dataToExport = bookings.map(booking => ({
                'ID Reserva': booking.bookingId,
                'Passeio': booking.tourDetails?.name || 'N/A',
                'Data Reserva Criada': booking.bookingCreatedAt ? format(parseISO(booking.bookingCreatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A',
                'Data Passeio': booking.date ? format(parseISO(booking.date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A',
                'Cliente': booking.name,
                'Email': booking.email,
                'Telefone': booking.phone,
                'Adultos': booking.adults,
                'Crianças': booking.children,
                'Preço Total (BRL)': booking.totalPrice?.toFixed(2),
                'Sinal Pago (BRL)': booking.downPaymentAmount?.toFixed(2),
                'Status Pagamento': booking.paymentStatus,
                'Status Follow-up': booking.follow_up_status || '',
                'Data Pag. Saldo': booking.balance_paid_date ? format(parseISO(booking.balance_paid_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
                'Notas Internas': booking.internal_notes || '',
            }));
            exportToCsv(dataToExport, 'reservas_vibechile.csv');
        };

        const handleViewDetails = (booking) => {
            setSelectedBooking(booking);
            setIsModalOpen(true);
        };
        
        const handleUpdateBookingInList = (updatedBooking) => {
            setBookings(prevBookings => 
                prevBookings.map(b => b.bookingId === updatedBooking.bookingId ? updatedBooking : b)
            );
        };


        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-lg">Carregando reservas...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-red-600">
                    <AlertTriangle className="h-12 w-12 mb-4" />
                    <p className="text-xl font-semibold">Erro ao Carregar Dados</p>
                    <p className="text-center">{error}</p>
                    <Button onClick={fetchBookings} className="mt-4">Tentar Novamente</Button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Lista de Reservas</h2>
                    <Button onClick={handleExportCsv} disabled={bookings.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Exportar para CSV
                    </Button>
                </div>
                
                {bookings.length > 0 ? (
                    <div className="border rounded-lg overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Passeio</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data Passeio</TableHead>
                                    <TableHead className="text-right">Sinal (BRL)</TableHead>
                                    <TableHead>Status Pag.</TableHead>
                                    <TableHead>Follow-up</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.bookingId}>
                                        <TableCell className="font-medium max-w-xs truncate" title={booking.tourDetails?.name}>{booking.tourDetails?.name || 'N/A'}</TableCell>
                                        <TableCell>{booking.name}</TableCell>
                                        <TableCell>{booking.date ? format(parseISO(booking.date), 'dd/MM/yy', { locale: ptBR }) : 'N/A'}</TableCell>
                                        <TableCell className="text-right">{booking.downPaymentAmount?.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                booking.paymentStatus === 'Sinal Pago (Stripe)' ? 'bg-green-100 text-green-700' :
                                                booking.paymentStatus === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate" title={booking.follow_up_status}>
                                            {booking.follow_up_status || <span className="text-xs text-muted-foreground">N/A</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                                                <ViewIcon className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">Nenhuma reserva encontrada.</p>
                )}
                {selectedBooking && (
                    <BookingDetailModal 
                        booking={selectedBooking} 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)}
                        onUpdateBooking={handleUpdateBookingInList}
                    />
                )}
            </div>
        );
    };

    export default BookingsList;