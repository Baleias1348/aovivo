import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const initialTickerFields = [
    { id: 'weather_santiago', label: 'Clima em Santiago (ex: 15º, nublado)', content: '' },
    { id: 'weather_vina', label: 'Clima em Viña del Mar (ex: 14º, nublado parcial)', content: '' },
    { id: 'weather_valparaiso', label: 'Clima em Valparaíso (ex: 13º, nublado parcial)', content: '' },
    { id: 'weather_concepcion', label: 'Clima em Concepción (ex: 12º, chuva intensa)', content: '' },
    { id: 'weather_chillan_city', label: 'Clima em Chillán (cidade) (ex: 8º, nublado)', content: '' },
    { id: 'weather_antofagasta', label: 'Clima em Antofagasta (ex: 20º, soleado)', content: '' },
    { id: 'ski_valle_nevado', label: 'Estado Valle Nevado (ex: Cerrado, -2º nevada intensa)', content: '' },
    { id: 'ski_farellones', label: 'Estado Farellones (ex: Cerrado, -2º nevada intensa)', content: '' },
    { id: 'ski_el_colorado', label: 'Estado El Colorado (ex: Cerrado, -1º, nublado parcial)', content: '' },
    { id: 'ski_portillo', label: 'Estado Portillo (ex: Aberto, -4º nevada)', content: '' },
    { id: 'ski_la_parva', label: 'Estado La Parva (ex: Aberto, -1º nublado)', content: '' },
    { id: 'ski_nevados_chillan', label: 'Estado Nevados de Chillán (ex: Aberto, 2º nublado parcial)', content: '' },
    { id: 'currency_brl_clp', label: 'Valor do Real em CLP (ex: $165,7)', content: '' },
    { id: 'currency_usd_brl', label: 'Valor do Dólar em Reais (ex: R$5,8)', content: '' },
    { id: 'currency_usd_clp', label: 'Valor do Dólar em CLP (ex: $965)', content: '' },
];

const TickerSettingsForm = () => {
    const { toast } = useToast();
    const [tickerItems, setTickerItems] = useState(initialTickerFields);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchTickerData = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('ticker_data').select('*');
        
        if (error) {
            console.error("Erro ao buscar dados do ticker:", error);
            toast({ title: "Erro ao Carregar", description: "Não foi possível carregar os dados do ticker.", variant: "destructive" });
            setTickerItems(initialTickerFields); // Reset to initial if fetch fails
        } else if (data) {
            const fetchedMap = new Map(data.map(item => [item.id, item.content]));
            const updatedItems = initialTickerFields.map(field => ({
                ...field,
                content: fetchedMap.get(field.id) || ''
            }));
            setTickerItems(updatedItems);
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchTickerData();
    }, [fetchTickerData]);

    const handleChange = (id, value) => {
        setTickerItems(prevItems => 
            prevItems.map(item => item.id === id ? { ...item, content: value } : item)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const upsertData = tickerItems.map(({ id, content }) => ({ id, content }));
            
            const { error } = await supabase.from('ticker_data').upsert(upsertData, { onConflict: 'id' });

            if (error) {
                throw error;
            }
            toast({ title: "Configurações Salvas", description: "Os textos do ticker foram atualizados." });
        } catch (error) {
            console.error("Erro ao salvar configurações do ticker:", error);
            toast({ title: "Erro ao Salvar", description: "Não foi possível salvar as configurações do ticker.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Carregando configurações do Ticker...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Configurações do Ticker de Notícias</h2>
            <p className="text-muted-foreground mb-6">
                Edite os textos que aparecem na faixa de notícias da página inicial. A data e hora são atualizadas automaticamente.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {tickerItems.map(item => (
                    <div key={item.id}>
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <Input
                            id={item.id}
                            name={item.id}
                            value={item.content}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                            placeholder="Digite o texto aqui..."
                            className="mt-1"
                        />
                    </div>
                ))}
                <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSaving ? 'Salvando...' : 'Salvar Configurações do Ticker'}
                </Button>
            </form>
        </div>
    );
};

export default TickerSettingsForm;