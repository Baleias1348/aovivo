import React, { useState, useEffect, Suspense } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getAllTours, deleteTour } from '@/lib/tourData'; 
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from '@/components/ui/badge';
    import { PlusCircle, Edit, Trash2, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import { useToast } from "@/components/ui/use-toast";
    import { cn } from "@/lib/utils";

    const TourList = () => {
        const [tours, setTours] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const navigate = useNavigate();
        const { toast } = useToast();

        const fetchTours = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedTours = await getAllTours(); 
                setTours(fetchedTours);
            } catch (err) {
                console.error("Error fetching tours:", err);
                setError("Não foi possível carregar os passeios. Tente novamente mais tarde.");
                toast({
                    title: "Erro ao Carregar Passeios",
                    description: err.message || "Ocorreu um problema ao buscar os dados.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchTours();
        }, []);

        const handleDeleteTour = async (tourId, tourName) => {
            try {
                await deleteTour(tourId); 
                toast({ title: "Passeio Excluído", description: `O passeio "${tourName}" foi excluído com sucesso.` });
                fetchTours(); 
            } catch (err) {
                console.error("Error deleting tour:", err);
                toast({
                    title: "Erro ao Excluir",
                    description: `Não foi possível excluir o passeio "${tourName}".`,
                    variant: "destructive",
                });
            }
        };

        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-lg">Carregando passeios...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-red-600">
                    <AlertTriangle className="h-12 w-12 mb-4" />
                    <p className="text-xl font-semibold">Erro ao Carregar Dados</p>
                    <p className="text-center">{error}</p>
                    <Button onClick={fetchTours} className="mt-4">Tentar Novamente</Button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Gerenciar Passeios</h2>
                    <Button onClick={() => navigate('/admin/tours/new')}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Passeio
                    </Button>
                </div>
                
                {tours.length > 0 ? (
                    <div className="border rounded-lg overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Passeio</TableHead>
                                    <TableHead>Localização</TableHead>
                                    <TableHead className="text-right">Preço Adulto (BRL)</TableHead>
                                    <TableHead>Visibilidade</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tours.map((tour) => (
                                    <TableRow key={tour.id}>
                                        <TableCell className="font-medium">{tour.nameLine1 || tour.name}</TableCell>
                                        <TableCell>{tour.location}</TableCell>
                                        <TableCell className="text-right">{tour.pricePerAdult.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={tour.isVisible ? 'default' : 'outline'} className={cn(tour.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700', "hover:bg-opacity-80")}>
                                                {tour.isVisible ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
                                                {tour.isVisible ? 'Visível' : 'Oculto'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja excluir o passeio "{tour.nameLine1 || tour.name}"? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteTour(tour.id, tour.nameLine1 || tour.name)}>
                                                            Excluir
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">Nenhum passeio cadastrado ainda. Clique em "Adicionar Novo Passeio" para começar.</p>
                )}
            </div>
        );
    };

    export default TourList;