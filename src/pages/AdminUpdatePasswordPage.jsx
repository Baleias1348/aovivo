import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';
    import { Loader2, KeyRound, ShieldCheck } from 'lucide-react';

    const AdminUpdatePasswordPage = () => {
        const navigate = useNavigate();
        const { toast } = useToast();
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        useEffect(() => {
            const handlePasswordRecovery = async () => {
                const hash = window.location.hash;
                if (hash) {
                    const params = new URLSearchParams(hash.substring(1)); 
                    const accessToken = params.get('access_token');
                    const type = params.get('type');

                    if (type === 'recovery' && accessToken) {
                        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: '', 
                        });

                        if (sessionError) {
                            toast({ title: "Erro", description: "Link de recuperação inválido ou expirado.", variant: "destructive" });
                            navigate('/admin/login');
                        } else if (session) {
                             toast({ title: "Sessão Verificada", description: "Por favor, defina sua nova senha." });
                        }
                    } else if (!accessToken) {
                       
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) {
                             toast({ title: "Erro", description: "Nenhuma sessão ativa. Link inválido.", variant: "destructive" });
                             navigate('/admin/login');
                        }
                    }
                } else {
                     const { data: { session } } = await supabase.auth.getSession();
                     if (!session) {
                         toast({ title: "Erro", description: "Link de recuperação inválido.", variant: "destructive" });
                         navigate('/admin/login');
                     }
                }
            };

            handlePasswordRecovery();
        }, [navigate, toast]);

        const handleUpdatePassword = async (e) => {
            e.preventDefault();
            setError('');
            if (password.length < 6) {
                setError("A senha deve ter pelo menos 6 caracteres.");
                return;
            }
            if (password !== confirmPassword) {
                setError("As senhas não coincidem.");
                return;
            }
            setIsLoading(true);

            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                setError(updateError.message);
                toast({
                    title: "Erro ao Atualizar Senha",
                    description: updateError.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Senha Atualizada",
                    description: "Sua senha foi alterada com sucesso. Faça login com sua nova senha.",
                });
                await supabase.auth.signOut();
                navigate('/admin/login');
            }
            setIsLoading(false);
        };
        
        const pageVariants = {
            initial: { opacity: 0, y: 20 },
            in: { opacity: 1, y: 0 },
            out: { opacity: 0, y: -20 },
        };

        return (
             <motion.div 
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}
                className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4"
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                         <img  src="/placeholder-logo.png" alt="VibeChile! Logo" className="mx-auto h-16 mb-4" src="https://images.unsplash.com/photo-1699109137169-be70291d4593" />
                        <h1 className="text-3xl font-bold text-primary">Atualizar Senha</h1>
                        <p className="text-muted-foreground">Crie uma nova senha para sua conta de administrador.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6 bg-card p-8 rounded-xl shadow-2xl">
                        <div>
                            <Label htmlFor="password">Nova Senha</Label>
                             <div className="relative mt-1">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nova senha (mín. 6 caracteres)"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <div className="relative mt-1">
                                <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme a nova senha"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-destructive text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Atualizar Senha e Fazer Login
                        </Button>
                    </form>
                </div>
            </motion.div>
        );
    };

    export default AdminUpdatePasswordPage;