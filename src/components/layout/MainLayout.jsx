import React from 'react';
    import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import HomePage from '@/pages/HomePage'; // Changed to HomePage
    import LandingPageChile from '@/pages/LandingPageChile'; // The old HomePage
    import ToursPage from '@/pages/ToursPage';
    import TourDetailPage from '@/pages/TourDetailPage';
    import RestaurantsPage from '@/pages/RestaurantsPage';
    import SkiCentersPage from '@/pages/SkiCentersPage';
    import SkiCenterDetailPage from '@/pages/SkiCenterDetailPage';
    import ContactPage from '@/pages/ContactPage';
    import AdminPage from '@/pages/AdminPage';
    import AdminLoginPage from '@/pages/AdminLoginPage';
    import AdminUpdatePasswordPage from '@/pages/AdminUpdatePasswordPage';
    import ProtectedRoute from '@/components/auth/ProtectedRoute';
    import WhatsAppButton from '@/components/shared/WhatsAppButton';
    import { Toaster } from '@/components/ui/toaster';

    const MainLayout = () => {
        const location = useLocation();
        const whatsappContactNumber = "+15557538771"; 
        const landingPageTourId = "c106e798-ee8b-4cb2-aa8a-aa7ff42997ce"; // Example, might not be used if HomePage is the new index

        const isTourLandingPage = location.pathname.includes(`/tours/`) && new URLSearchParams(location.search).get('landing') === 'true';
        const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;
        
        const tourNameForWhatsApp = location.state?.tourNameForWhatsApp || null;

        // Condition for hiding header
        let hideHeader = false;
        if ((isTourLandingPage) || isSkiCenterDetailPage) {
            hideHeader = true;
        }
        // The new HomePage ('/') should show the header.
        // LandingPageChile ('/home-original') might or might not show header based on its own logic or if it's considered a landing.
        // For now, explicitly show header on '/' and let other logic apply.
        if (location.pathname === '/') {
            hideHeader = false;
        }


        return (
            <div className="flex flex-col min-h-screen">
                {!hideHeader && <Header />}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* New Home Page as index */}
                        <Route path="/home-original" element={<LandingPageChile />} /> {/* Old home page */}
                        <Route path="/tours" element={<ToursPage />} />
                        <Route path="/tours/:tourId" element={<TourDetailPage />} />
                        <Route path="/restaurantes-santiago" element={<RestaurantsPage />} />
                        <Route path="/centros-de-esqui" element={<SkiCentersPage />} />
                        <Route path="/centros-de-esqui/:skiCenterSlug" element={<SkiCenterDetailPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/update-password" element={<AdminUpdatePasswordPage />} />
                        
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute>
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                        {/* Placeholder routes for quick access icons, to be implemented later */}
                        <Route path="/clima" element={<div>Página de Clima (em construção)</div>} />
                        <Route path="/cambio" element={<div>Página de Câmbio (em construção)</div>} />
                        <Route path="/voos" element={<div>Página de Voos (em construção)</div>} />
                        <Route path="/emergencias" element={<div>Página de Emergências (em construção)</div>} />
                        <Route path="/clima-detalhado" element={<div>Página de Clima Detalhado (em construção)</div>} />
                        <Route path="/conversor-moeda" element={<div>Página de Conversor de Moeda (em construção)</div>} />
                        <Route path="/investir-chile" element={<div>Página Investir no Chile (em construção)</div>} />
                        <Route path="/blog/mariscos-chilenos" element={<div>Página Blog Mariscos (em construção)</div>} />
                    </Routes>
                </main>
                <Footer />
                {location.pathname.startsWith('/tours/') && (
                    <WhatsAppButton 
                        phoneNumber={whatsappContactNumber} 
                        tourName={tourNameForWhatsApp} 
                    />
                )}
                <Toaster />
            </div>
        );
    };

    export default MainLayout;