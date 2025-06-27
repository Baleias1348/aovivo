import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { useToast } from "@/components/ui/use-toast";
    import { supabase } from '@/lib/supabaseClient';
    import { Eye, EyeOff, KeyRound } from 'lucide-react';

    const StripeSettingsForm = () => {
        const { toast } = useToast();
        const [config, setConfig] = useState({
            id: null,
            stripe_publishable_key_test: '',
            stripe_publishable_key_live: '',
            stripe_secret_key_test: '',
            stripe_secret_key_live: '',
            active_mode: 'test',
        });
        const [loading, setLoading] = useState(true);
        const [showSecretTest, setShowSecretTest] = useState(false);
        const [showSecretLive, setShowSecretLive] = useState(false);

        useEffect(() => {
            const fetchConfig = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from('stripe_config')
                    .select('*')
                    .limit(1)
                    .single();

                if (data) {
                    setConfig({
                        id: data.id,
                        stripe_publishable_key_test: data.stripe_publishable_key_test || '',
                        stripe_publishable_key_live: data.stripe_publishable_key_live || '',
                        stripe_secret_key_test: data.stripe_secret_key_test || '',
                        stripe_secret_key_live: data.stripe_secret_key_live || '',
                        active_mode: data.active_mode || 'test',
                    });
                } else if (error && error.code !== 'PGRST116') { 
                    console.error("Erro ao buscar configurações do Stripe:", error);
                    toast({ title: "Erro ao Carregar", description: "Não foi possível carregar as configurações do Stripe.", variant: "destructive" });
                } else {
                    console.log("Nenhuma configuração Stripe encontrada, usando valores padrão.");
                }
                setLoading(false);
            };
            fetchConfig();
        }, [toast]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setConfig(prev => ({ ...prev, [name]: value }));
        };

        const handleModeChange = (value) => {
            setConfig(prev => ({ ...prev, active_mode: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            const upsertData = {
                stripe_publishable_key_test: config.stripe_publishable_key_test,
                stripe_publishable_key_live: config.stripe_publishable_key_live,
                stripe_secret_key_test: config.stripe_secret_key_test,
                stripe_secret_key_live: config.stripe_secret_key_live,
                active_mode: config.active_mode,
            };

            let error;
            if (config.id) {
                upsertData.id = config.id; 
                const { error: updateError } = await supabase
                    .from('stripe_config')
                    .update(upsertData)
                    .eq('id', config.id);
                error = updateError;
            } else {
                const { data: existingConfig, error: fetchError } = await supabase
                    .from('stripe_config')
                    .select('id')
                    .limit(1)
                    .single();
                
                if (fetchError && fetchError.code !== 'PGRST116') {
                     error = fetchError;
                } else if (existingConfig) {
                    upsertData.id = existingConfig.id;
                     const { error: updateError } = await supabase
                        .from('stripe_config')
                        .update(upsertData)
                        .eq('id', existingConfig.id);
                    error = updateError;
                } else {
                     const { error: insertError } = await supabase
                        .from('stripe_config')
                        .insert([upsertData]);
                    error = insertError;
                }
            }


            if (error) {
                console.error("Erro ao salvar configurações do Stripe:", error);
                toast({ title: "Erro ao Salvar", description: `Não foi possível salvar as configurações do Stripe: ${error.message}`, variant: "destructive" });
            } else {
                toast({ title: "Configurações Salvas", description: "As configurações do Stripe foram atualizadas com sucesso." });
                 const { data: updatedData } = await supabase.from('stripe_config').select('*').limit(1).single();
                 if (updatedData) setConfig(prev => ({...prev, id: updatedData.id}));
            }
            setLoading(false);
        };
        
        const SecretInput = ({ id, name, value, onChange, show, onToggleShow, placeholder }) => (
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="pr-10"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={onToggleShow}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        );


        if (loading && !config.id && !config.stripe_publishable_key_test) {
             return <p>Carregando configurações do Stripe...</p>;
        }

        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <KeyRound className="w-8 h-8 mr-3 text-primary"/>
                    <h2 className="text-2xl font-semibold">Configurações do Stripe</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8 p-6 border rounded-lg shadow-sm bg-card">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-primary">Modo de Operação</h3>
                        <RadioGroup name="active_mode" value={config.active_mode} onValueChange={handleModeChange} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="test" id="mode_test" />
                                <Label htmlFor="mode_test">Modo Teste</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="live" id="mode_live" />
                                <Label htmlFor="mode_live">Modo Live (Produção)</Label>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                            O modo selecionado aqui determinará qual conjunto de chaves será usado para processar pagamentos.
                        </p>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                        <h3 className="text-lg font-medium text-accent-foreground">Chaves do Modo Teste</h3>
                        <div>
                            <Label htmlFor="stripe_publishable_key_test">Chave Publicável de Teste</Label>
                            <Input 
                                id="stripe_publishable_key_test" 
                                name="stripe_publishable_key_test" 
                                value={config.stripe_publishable_key_test} 
                                onChange={handleChange} 
                                placeholder="pk_test_..."
                            />
                            <p className="text-xs text-muted-foreground mt-1">Encontrada no seu Dashboard Stripe > Desenvolvedores > Chaves de API.</p>
                        </div>
                        <div>
                            <Label htmlFor="stripe_secret_key_test">Chave Secreta de Teste</Label>
                             <SecretInput
                                id="stripe_secret_key_test"
                                name="stripe_secret_key_test"
                                value={config.stripe_secret_key_test}
                                onChange={handleChange}
                                show={showSecretTest}
                                onToggleShow={() => setShowSecretTest(!showSecretTest)}
                                placeholder="sk_test_... ou rk_test_..."
                            />
                            <p className="text-xs text-muted-foreground mt-1">MANTENHA ESTA CHAVE SEGURA. Usada para interações do lado do servidor (via Edge Functions, se aplicável).</p>
                        </div>
                    </div>

                     <div className="space-y-6 border-t pt-6">
                        <h3 className="text-lg font-medium text-accent-foreground">Chaves do Modo Live (Produção)</h3>
                        <div>
                            <Label htmlFor="stripe_publishable_key_live">Chave Publicável de Produção</Label>
                            <Input 
                                id="stripe_publishable_key_live" 
                                name="stripe_publishable_key_live" 
                                value={config.stripe_publishable_key_live} 
                                onChange={handleChange} 
                                placeholder="pk_live_..."
                            />
                        </div>
                         <div>
                            <Label htmlFor="stripe_secret_key_live">Chave Secreta de Produção</Label>
                            <SecretInput
                                id="stripe_secret_key_live"
                                name="stripe_secret_key_live"
                                value={config.stripe_secret_key_live}
                                onChange={handleChange}
                                show={showSecretLive}
                                onToggleShow={() => setShowSecretLive(!showSecretLive)}
                                placeholder="sk_live_... ou rk_live_..."
                            />
                             <p className="text-xs text-muted-foreground mt-1">MANTENHA ESTA CHAVE SEGURA. Usada para interações do lado do servidor (via Edge Functions, se aplicável).</p>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Configurações do Stripe"}
                    </Button>
                </form>
            </div>
        );
    };

    export default StripeSettingsForm;