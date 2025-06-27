import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import TourList from '@/components/admin/TourList';
import TourForm from '@/components/admin/TourForm';
import BookingsList from '@/components/admin/BookingsList';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import StripeSettingsForm from '@/components/admin/StripeSettingsForm';
import ImageRepositoryManager from '@/components/admin/ImageRepositoryManager';
import SkiCenterList from '@/components/admin/SkiCenterList';
import SkiCenterForm from '@/components/admin/SkiCenterForm';
import TickerSettingsForm from '@/components/admin/TickerSettingsForm'; // Import TickerSettingsForm
import { Button } from '@/components/ui/button';
import { Home, Settings, ListChecks, LogOut, Users, Edit, Image as ImageIcon, MountainSnow, ShieldCheck, Annoyed } from 'lucide-react'; // Annoyed for Ticker

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const navItems = [
        { path: 'tours', label: 'Gerenciar Passeios', icon: ListChecks },
        { path: 'ski-centers', label: 'Gerenciar Centros de Ski', icon: MountainSnow },
        { path: 'bookings', label: 'Gerenciar Reservas', icon: Users },
        { path: 'image-repository', label: 'Banco de Imagens', icon: ImageIcon },
        { path: 'site-settings', label: 'Configurações do Site', icon: Settings },
        { path: 'ticker-settings', label: 'Configurações do Ticker', icon: Annoyed }, // Ticker Icon
        { path: 'stripe-settings', label: 'Configurações de Pagamento', icon: ShieldCheck },
    ];

    return (
        <div className="flex min-h-screen bg-muted/40">
            <aside className="w-64 bg-background p-6 border-r border-border flex flex-col">
                <div className="mb-8 text-center">
                    <Link to="/admin" className="text-2xl font-bold text-primary">Painel Admin</Link>
                    {user && <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>}
                </div>
                <nav className="flex-grow space-y-2">
                    {navItems.map(item => (
                        <Button
                            key={item.path}
                            variant={location.pathname.includes(`/admin/${item.path}`) ? 'default' : 'ghost'}
                            className="w-full justify-start text-sm"
                            asChild
                        >
                            <Link to={item.path}>
                                <item.icon className="mr-2 h-4 w-4" /> {item.label}
                            </Link>
                        </Button>
                    ))}
                </nav>
                <div className="mt-auto space-y-2">
                    <Button variant="outline" className="w-full justify-start text-sm" asChild>
                        <Link to="/"> {/* Changed to root */}
                            <Home className="mr-2 h-4 w-4" /> Voltar ao Site
                        </Link>
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} className="w-full justify-start text-sm">
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                    </Button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-auto">
                <Routes>
                    <Route index element={<Navigate to="tours" replace />} />
                    <Route path="tours" element={<TourList />} />
                    <Route path="tours/new" element={<TourForm />} />
                    <Route path="tours/edit/:tourId" element={<TourForm />} />
                    <Route path="ski-centers" element={<SkiCenterList />} />
                    <Route path="ski-centers/new" element={<SkiCenterForm />} />
                    <Route path="ski-centers/edit/:skiCenterId" element={<SkiCenterForm />} />
                    <Route path="bookings" element={<BookingsList />} />
                    <Route path="site-settings" element={<SiteSettingsForm />} />
                    <Route path="ticker-settings" element={<TickerSettingsForm />} /> {/* Ticker Route */}
                    <Route path="stripe-settings" element={<StripeSettingsForm />} />
                    <Route path="image-repository" element={<ImageRepositoryManager />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminPage;