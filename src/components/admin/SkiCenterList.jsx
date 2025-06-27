
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllSkiCenters, deleteSkiCenter } from '@/lib/tourData';
import { useToast } from "@/components/ui/use-toast";
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

const SkiCenterList = () => {
    const [skiCenters, setSkiCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const fetchSkiCenters = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllSkiCenters();
            setSkiCenters(data);
        } catch (err) {
            console.error("Error fetching ski centers:", err);
            setError("Falha ao carregar centros de ski. Tente novamente.");
            toast({ title: "Erro", description: "Não foi possível carregar os centros de ski.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkiCenters();
    }, []);

    const handleDelete = async (id, name) => {
        try {
            await deleteSkiCenter(id);
            toast({ title: "Centro de Ski Excluído", description: `O centro "${name}" foi excluído com sucesso.` });
            fetchSkiCenters(); // Refresh list
        } catch (error) {
            console.error("Error deleting ski center:", error);
            toast({ title: "Erro ao Excluir", description: `Não foi possível excluir "${name}".`, variant: "destructive" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Carregando centros de ski...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 px-6 bg-destructive/10 border border-destructive/30 rounded-lg shadow-lg max-w-md mx-auto">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold text-destructive mb-2">Erro ao Carregar Dados</h2>
                <p className="text-destructive/80 mb-4">{error}</p>
                <Button onClick={fetchSkiCenters} variant="destructive">Tentar Novamente</Button>
            </div>
        );
    }
    
    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">Gerenciar Centros de Ski</h1>
                <Button asChild>
                    <Link to="/admin/ski-centers/new">
                        <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Centro
                    </Link>
                </Button>
            </div>

            {skiCenters.length === 0 ? (
                <div className="text-center py-10 bg-card border rounded-lg shadow-sm">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum Centro de Ski Encontrado</h3>
                    <p className="text-muted-foreground mb-4">Comece adicionando um novo centro de ski.</p>
                </div>
            ) : (
                <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] hidden md:table-cell">Visível</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead className="hidden lg:table-cell">Site Oficial</TableHead>
                                <TableHead className="text-right w-[150px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skiCenters.map((center) => (
                                <TableRow key={center.id}>
                                    <TableCell className="hidden md:table-cell">
                                        {center.isVisible ? <Eye className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-red-500" />}
                                    </TableCell>
                                    <TableCell className="font-medium">{center.name}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {center.websiteUrl ? (
                                            <a href={center.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs block">
                                                {center.websiteUrl}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground italic">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            <Button variant="outline" size="icon" asChild title="Editar">
                                                <Link to={`/admin/ski-centers/edit/${center.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" title="Excluir">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja excluir o centro de ski "{center.name}"? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(center.id, center.name)} className="bg-destructive hover:bg-destructive/90">
                                                            Excluir
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default SkiCenterList;
  