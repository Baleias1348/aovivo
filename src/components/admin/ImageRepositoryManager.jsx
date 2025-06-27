import React, { useState, useEffect } from 'react';
    import { getImageRepository, addImageToRepository, removeImageFromRepository } from '@/lib/tourData';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle, Trash2, Copy } from 'lucide-react';

    const ImageRepositoryManager = () => {
        const [images, setImages] = useState([]);
        const [newImageUrl, setNewImageUrl] = useState('');
        const { toast } = useToast();

        useEffect(() => {
            setImages(getImageRepository());
        }, []);

        const handleAddImage = (e) => {
            e.preventDefault();
            if (!newImageUrl.trim()) {
                toast({ title: "URL Inválida", description: "Por favor, insira uma URL válida.", variant: "destructive" });
                return;
            }
            const success = addImageToRepository(newImageUrl);
            if (success) {
                setImages(getImageRepository());
                setNewImageUrl('');
                toast({ title: "Imagem Adicionada", description: "A imagem foi adicionada ao repositório." });
            } else {
                toast({ title: "Erro", description: "Não foi possível adicionar a imagem. Verifique se a URL é válida e não está duplicada.", variant: "destructive" });
            }
        };

        const handleRemoveImage = (imageUrl) => {
            removeImageFromRepository(imageUrl);
            setImages(getImageRepository());
            toast({ title: "Imagem Removida", description: "A imagem foi removida do repositório." });
        };

        const handleCopyToClipboard = (imageUrl) => {
            navigator.clipboard.writeText(imageUrl)
                .then(() => {
                    toast({ title: "Copiado!", description: "URL da imagem copiada para a área de transferência." });
                })
                .catch(err => {
                    toast({ title: "Erro ao Copiar", description: "Não foi possível copiar a URL.", variant: "destructive" });
                    console.error('Erro ao copiar URL: ', err);
                });
        };

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold">Repositório de Imagens</h2>
                    <p className="text-muted-foreground">Adicione e gerencie URLs de imagens para usar em seu site.</p>
                </div>

                <form onSubmit={handleAddImage} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="flex-grow">
                        <Label htmlFor="newImageUrl">Nova URL de Imagem</Label>
                        <Input
                            id="newImageUrl"
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="mt-1"
                        />
                    </div>
                    <Button type="submit">
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imagem
                    </Button>
                </form>

                {images.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Imagens Salvas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((imageUrl, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden shadow-sm group relative">
                                    <img  class="w-full h-40 object-cover" alt={`Imagem ${index + 1} do repositório`} src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-2">
                                        <Button variant="secondary" size="sm" onClick={() => handleCopyToClipboard(imageUrl)} className="w-full text-xs">
                                            <Copy className="mr-1 h-3 w-3" /> Copiar URL
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleRemoveImage(imageUrl)} className="w-full text-xs">
                                            <Trash2 className="mr-1 h-3 w-3" /> Remover
                                        </Button>
                                    </div>
                                    <p className="text-xs p-2 truncate text-muted-foreground" title={imageUrl}>{imageUrl}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nenhuma imagem no repositório ainda.</p>
                )}
            </div>
        );
    };

    export default ImageRepositoryManager;