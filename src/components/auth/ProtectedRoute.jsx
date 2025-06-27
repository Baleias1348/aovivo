import React, { useEffect, useState } from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Loader2 } from 'lucide-react';

    const ProtectedRoute = ({ children }) => {
        const [session, setSession] = useState(null);
        const [loading, setLoading] = useState(true);
        const location = useLocation();

        useEffect(() => {
            const fetchSession = async () => {
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error fetching session:", error);
                }
                setSession(currentSession);
                setLoading(false);
            };

            fetchSession();

            const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
                setSession(currentSession);
                 if (!currentSession && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login' && location.pathname !== '/admin/update-password') {
                    // No need to setLoading(true) here as it might cause flicker. 
                    // The redirect will handle unauthorized access.
                }
            });
            
            return () => {
                authListener?.subscription?.unsubscribe();
            };
        }, [location.pathname]);

        if (loading) {
            return (
                <div className="flex justify-center items-center h-screen bg-background">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-lg text-foreground">Verificando autenticação...</p>
                </div>
            );
        }

        if (!session) {
            // Allow access to login and password update pages even without session
            if (location.pathname === '/admin/login' || location.pathname === '/admin/update-password') {
                return children;
            }
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        
        // If there is a session, but user tries to access login/update-password, redirect to admin dashboard
        if (session && (location.pathname === '/admin/login' || location.pathname === '/admin/update-password')) {
            return <Navigate to="/admin/tours" replace />;
        }

        return children;
    };

    export default ProtectedRoute;