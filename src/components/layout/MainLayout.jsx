import React from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';

import Footer from '@/components/layout/Footer';

// Header minimalista global
import { Link } from 'react-router-dom';

const MinimalHeader = () => (
  <header
    style={{
      height: 60,
      background: 'linear-gradient(90deg, #000 0%, #601889 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: 28,
      letterSpacing: 1.5,
      fontWeight: 800,
      textShadow: '0 1px 8px #000a',
      zIndex: 50,
      position: 'relative',
      boxShadow: '0 2px 12px #0002',
      userSelect: 'none',
    }}
  >
    <Link to="/" style={{display: 'flex', alignItems: 'center', color: '#fff', textDecoration: 'none', gap: 8, paddingLeft: 16, paddingRight: 16, height: '100%'}}>
      {/* Estrella SVG blanca */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" style={{marginRight: 2, marginLeft: -6, marginTop: 2}}><polygon points="12,2 14.09,8.26 20.82,8.27 15.36,12.14 17.45,18.4 12,14.53 6.55,18.4 8.64,12.14 3.18,8.27 9.91,8.26 "/></svg>
      <span style={{textTransform: 'uppercase', letterSpacing: 2}}><span style={{position:'relative'}}>C</span>hile ao Vivo</span>
    </Link>
  </header>
);
import HomePage from '@/pages/HomePage'; // Changed to HomePage
import LandingPageChile from '@/pages/LandingPageChile'; // The old HomePage
import ClimaNoChile from '@/pages/ClimaNoChile';
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
    const landingPageTourId = "c106e798-ee8b-4cb2-aa8a-aa7ff42997ce"; 

    const isTourLandingPage = location.pathname.includes(`/tours/`) && new URLSearchParams(location.search).get('landing') === 'true';
    const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;
    
    const tourNameForWhatsApp = location.state?.tourNameForWhatsApp || null;




        return (
            <div className="flex flex-col min-h-screen">
                <MinimalHeader />

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
                        <Route path="/clima" element={<ClimaNoChile />} />
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