
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/admin/forms/RichTextEditor';
import { addSkiCenter, getSkiCenterById, updateSkiCenter } from '@/lib/tourData';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

const SkiCenterForm = () => {
    const navigate = useNavigate();
    const { skiCenterId } = useParams();
    const { toast } = useToast();
    const isEditing = Boolean(skiCenterId);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const initialFormData = {
        name: '',
        generalDescription: '',
        profileAndTracks: '',
        uniqueExperience: '',
        valuableTips: '',
        practicalInfo: '',
        mainImageUrl: '',
        galleryUrls: '',
        isVisible: true,
        websiteUrl: '',
        metaTitle: '',
        metaDescription: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const fetchSkiCenter = async () => {
            if (isEditing && skiCenterId) {
                setIsFetching(true);
                try {
                    const existingSkiCenter = await getSkiCenterById(skiCenterId);
                    if (existingSkiCenter) {
                        setFormData({
                            name: existingSkiCenter.name || '',
                            generalDescription: existingSkiCenter.generalDescription || '',
                            profileAndTracks: existingSkiCenter.profileAndTracks || '',
                            uniqueExperience: existingSkiCenter.uniqueExperience || '',
                            valuableTips: existingSkiCenter.valuableTips || '',
                            practicalInfo: existingSkiCenter.practicalInfo || '',
                            mainImageUrl: existingSkiCenter.mainImageUrl || '',
                            galleryUrls: Array.isArray(existingSkiCenter.galleryUrls) ? existingSkiCenter.galleryUrls.join(', ') : (existingSkiCenter.galleryUrls || ''),
                            isVisible: existingSkiCenter.isVisible !== undefined ? existingSkiCenter.isVisible : true,
                            websiteUrl: existingSkiCenter.websiteUrl || '',
                            metaTitle: existingSkiCenter.metaTitle || '',
                            metaDescription: existingSkiCenter.metaDescription || '',
                        });
                    } else {
                        toast({ title: "Erro", description: "Centro de Ski não encontrado para edição.", variant: "destructive" });
                        navigate('/admin/ski-centers');
                    }
                } catch (error) {
                    console.error("Error fetching ski center for edit:", error);
                    toast({ title: "Erro ao Carregar", description: `Não foi possível carregar dados: ${error.message}`, variant: "destructive" });
                } finally {
                    setIsFetching(false);
                }
            } else {
                setFormData(initialFormData);
            }
        };
        fetchSkiCenter();
    }, [isEditing, skiCenterId, navigate, toast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? Boolean(checked) : value
        }));
    };

    const handleRichTextChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                galleryUrls: formData.galleryUrls.split(',').map(url => url.trim()).filter(Boolean),
            };

            if (isEditing) {
                await updateSkiCenter(skiCenterId, dataToSubmit);
                toast({ title: "Centro de Ski Atualizado", description: `O centro "${formData.name}" foi atualizado.` });
            } else {
                await addSkiCenter(dataToSubmit);
                toast({ title: "Centro de Ski Adicionado", description: `O centro "${formData.name}" foi adicionado.` });
            }
            navigate('/admin/ski-centers');
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({ title: "Erro ao Salvar", description: error.message || "Ocorreu um erro.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching && isEditing) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Carregando dados do centro de ski...</p>
            </div>
        );
    }
    
    const RichTextSection = ({ id, label, value, onChange, placeholder }) => (
        <div>
            <Label htmlFor={id} className="text-md">{label}</Label>
            <RichTextEditor
                value={value}
                onChange={(val) => handleRichTextChange(id, val)}
                placeholder={placeholder}
                className="mt-1"
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Button variant="outline" onClick={() => navigate('/admin/ski-centers')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Centros de Ski
            </Button>
            <h1 className="text-3xl font-bold mb-8 text-center text-primary">{isEditing ? 'Editar Centro de Ski' : 'Adicionar Novo Centro de Ski'}</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-xl font-semibold text-primary mb-4">Informações Gerais</h3>
                    <div>
                        <Label htmlFor="name" className="text-md">Nome do Centro de Ski</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Portillo: A Lenda dos Andes" className="text-base mt-1" required />
                    </div>
                    <RichTextSection id="generalDescription" label="Descrição Geral" value={formData.generalDescription} onChange={handleRichTextChange} placeholder="Descreva o centro de ski em geral..." />
                    <div>
                        <Label htmlFor="mainImageUrl" className="text-md">URL da Imagem Principal</Label>
                        <Input id="mainImageUrl" name="mainImageUrl" value={formData.mainImageUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem-principal.jpg" className="text-base mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="galleryUrls" className="text-md">Galeria de Imagens (URLs separadas por vírgula)</Label>
                        <Textarea id="galleryUrls" name="galleryUrls" value={formData.galleryUrls} onChange={handleChange} rows={3} placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg" className="text-base mt-1" />
                    </div>
                     <div>
                        <Label htmlFor="websiteUrl" className="text-md">URL do Site Oficial (Opcional)</Label>
                        <Input id="websiteUrl" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://siteoficial.com" className="text-base mt-1" />
                    </div>
                </div>

                <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-xl font-semibold text-primary mb-4">Detalhes do Centro</h3>
                    <RichTextSection id="profileAndTracks" label="Perfil e Pistas" value={formData.profileAndTracks} onChange={handleRichTextChange} placeholder="Detalhes sobre o perfil dos esquiadores e as pistas..." />
                    <RichTextSection id="uniqueExperience" label="A Experiência Única" value={formData.uniqueExperience} onChange={handleRichTextChange} placeholder="O que torna este centro único..." />
                    <RichTextSection id="valuableTips" label="Dicas Valiosas" value={formData.valuableTips} onChange={handleRichTextChange} placeholder="Dicas para visitantes..." />
                    <RichTextSection id="practicalInfo" label="Informações Práticas" value={formData.practicalInfo} onChange={handleRichTextChange} placeholder="Temporada, preços, como chegar..." />
                </div>
                
                <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
                    <h3 className="text-xl font-semibold text-primary mb-4">SEO e Visibilidade</h3>
                    <div>
                        <Label htmlFor="metaTitle" className="text-md">Meta Title (SEO)</Label>
                        <Input id="metaTitle" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Título para buscadores" className="text-base mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="metaDescription" className="text-md">Meta Description (SEO)</Label>
                        <Textarea id="metaDescription" name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} placeholder="Descrição curta para buscadores (max 160 caracteres)" className="text-base mt-1" />
                    </div>
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
                </div>

                <Button type="submit" className="w-full text-lg py-3 mt-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    {isLoading ? (isEditing ? 'Salvando Alterações...' : 'Adicionando Centro...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Centro de Ski')}
                </Button>
            </form>
        </div>
    );
};

export default SkiCenterForm;
  