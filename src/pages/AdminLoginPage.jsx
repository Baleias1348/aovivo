import React, { useState, useEffect } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';
    import { Loader2, Mail, KeyRound } from 'lucide-react';

    const AdminLoginPage = () => {
        const navigate = useNavigate();
        const { toast } = useToast();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
        const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
        const [resetEmail, setResetEmail] = useState('');

        useEffect(() => {
            const checkSession = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    navigate('/admin/tours');
                }
            };
            checkSession();
        }, [navigate]);

        const handleLogin = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                toast({
                    title: "Erro de Login",
                    description: error.message || "Email ou senha inválidos.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Login Bem-sucedido",
                    description: "Redirecionando para o painel de administração...",
                });
                navigate('/admin/tours');
            }
            setIsLoading(false);
        };

        const handlePasswordResetRequest = async (e) => {
            e.preventDefault();
            if (!resetEmail) {
                toast({ title: "Erro", description: "Por favor, insira seu email.", variant: "destructive" });
                return;
            }
            setIsPasswordResetLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/admin/update-password`, 
            });
            if (error) {
                toast({
                    title: "Erro ao Enviar Email",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Verifique seu Email",
                    description: `Se uma conta existir para ${resetEmail}, um email foi enviado com instruções para redefinir sua senha.`,
                    duration: 7000,
                });
                setShowPasswordResetForm(false);
                setResetEmail('');
            }
            setIsPasswordResetLoading(false);
        };
        
        const pageVariants = {
            initial: { opacity: 0, y: 20 },
            in: { opacity: 1, y: 0 },
            out: { opacity: 0, y: -20 },
        };

        const transition = { duration: 0.4 };

        return (
            <motion.div 
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={transition}
                className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4"
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img  src="/placeholder-logo.png" alt="VibeChile! Logo" className="mx-auto h-16 mb-4" src="https://images.unsplash.com/photo-1600328808706-b63a063d219d" />
                        </Link>
                        <h1 className="text-3xl font-bold text-primary">Acesso Restrito</h1>
                        <p className="text-muted-foreground">Painel de Administração</p>
                    </div>

                    {!showPasswordResetForm ? (
                        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={transition}>
                            <form onSubmit={handleLogin} className="space-y-6 bg-card p-8 rounded-xl shadow-2xl">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="password">Senha</Label>
                                    <div className="relative mt-1">
                                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="********"
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Entrar
                                </Button>
                                <Button variant="link" type="button" onClick={() => setShowPasswordResetForm(true)} className="w-full text-sm text-primary">
                                    Esqueceu sua senha?
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={transition}>
                             <form onSubmit={handlePasswordResetRequest} className="space-y-6 bg-card p-8 rounded-xl shadow-2xl">
                                <h2 className="text-xl font-semibold text-center text-foreground">Redefinir Senha</h2>
                                <p className="text-sm text-muted-foreground text-center">Insira seu email para receber o link de redefinição.</p>
                                <div>
                                    <Label htmlFor="reset-email">Email</Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            id="reset-email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isPasswordResetLoading}>
                                    {isPasswordResetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Enviar Link de Redefinição
                                </Button>
                                <Button variant="link" type="button" onClick={() => setShowPasswordResetForm(false)} className="w-full text-sm text-primary">
                                    Voltar para Login
                                </Button>
                            </form>
                        </motion.div>
                    )}
                     <p className="text-center text-xs text-muted-foreground mt-8">
                        Acesso exclusivo para administradores. <br/>
                        Se você não é um administrador, por favor, <Link to="/" className="underline hover:text-primary">volte para a página inicial</Link>.
                    </p>
                </div>
            </motion.div>
        );
    };

    export default AdminLoginPage;