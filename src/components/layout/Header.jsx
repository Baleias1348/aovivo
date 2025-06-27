import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MountainSnow, X, LogOut, UserCircle, Settings, ShoppingBag, Star, Compass } from 'lucide-react';
import { getSiteConfig } from '@/lib/tourData';
import { cn } from '@/lib/utils';

const NavItem = ({ to, children, onClick, className, exact = false, isScrolled }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors duration-300 pb-1",
        isActive
          ? 'text-primary border-b-2 border-primary'
          : isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-gray-300', 
        className
      )}
    >
      {children}
    </NavLink>
  );
};

const MobileNavItem = ({ to, children, onClick, icon: Icon }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors duration-200",
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-muted hover:text-primary'
        )
      }
    >
      {Icon && <Icon className="mr-3 h-5 w-5" />}
      {children}
    </NavLink>
  );
};

const Header = ({ isLandingMode = false }) => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteConfigData, setSiteConfigData] = useState(getSiteConfig());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setSiteConfigData(getSiteConfig()); // Re-fetch site config on auth change in case logo changed
      }
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Listener for localStorage changes to update siteConfig (e.g., logo)
    const handleStorageChange = (event) => {
      if (event.key === 'vibechile-site-config') {
        setSiteConfigData(getSiteConfig());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false); 
    navigate('/'); 
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const isTourLandingPage = location.pathname.includes('/tours/') && new URLSearchParams(location.search).get('landing') === 'true';
  const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;

  if ((isLandingMode && isTourLandingPage) || isSkiCenterDetailPage) {
    return null; 
  }

  const navLinks = [
    { to: "/", label: "Início", icon: Compass, exact: true },
    { to: "/tours", label: "Passeios", icon: ShoppingBag },
    { to: "/restaurantes-santiago", label: "Restaurantes", icon: Star },
    { to: "/centros-de-esqui", label: "Centros de Ski", icon: MountainSnow },
  ];
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      className={cn(
        `sticky top-0 z-50 w-full transition-all duration-300 ease-in-out`,
        isScrolled || isMobileMenuOpen 
          ? 'bg-background/95 shadow-lg backdrop-blur-md border-b border-border/50' 
          : 'bg-black border-b border-transparent' // Header background negro
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <img-replace 
              src={siteConfigData.logoUrl || "https://placehold.co/40x40?text=VC"} 
              alt="Vibe Chile Logo" 
              className="h-10 w-10 object-contain rounded-md" 
            />
            <span className={cn(
                "text-xl font-bold",
                isScrolled || isMobileMenuOpen ? 'text-foreground' : 'text-white' // Logo text color
            )}>
                {siteConfigData.siteName || "Vibe Chile"}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavItem key={link.to} to={link.to} exact={link.exact} isScrolled={isScrolled || isMobileMenuOpen}>
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
             {user && (
              <NavLink to="/admin" className="hidden lg:inline-flex">
                <Button variant={isScrolled || isMobileMenuOpen ? 'ghost' : 'outline'} className={cn(isScrolled || isMobileMenuOpen ? '' : 'text-white border-white hover:bg-white/10 hover:text-white')} size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Admin
                </Button>
              </NavLink>
            )}
            {user && (
              <Button variant={isScrolled || isMobileMenuOpen ? 'ghost' : 'outline'} className={cn(isScrolled || isMobileMenuOpen ? '' : 'text-white border-white hover:bg-white/10 hover:text-white')} size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu" className={cn(isScrolled || isMobileMenuOpen ? 'text-foreground' : 'text-white hover:bg-white/10')}>
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0 bg-background">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Link to="/" className="flex items-center space-x-2 mb-6" onClick={closeMobileMenu}>
                       <img-replace 
                        src={siteConfigData.logoUrl || "https://placehold.co/40x40?text=VC"} 
                        alt="Vibe Chile Logo" 
                        className="h-10 w-10 object-contain rounded-md" 
                      />
                      <span className="text-xl font-bold text-foreground">{siteConfigData.siteName || "Vibe Chile"}</span>
                    </Link>
                  </div>
                  
                  <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                    {navLinks.map(link => (
                      <MobileNavItem key={link.to} to={link.to} onClick={closeMobileMenu} icon={link.icon}>
                        {link.label}
                      </MobileNavItem>
                    ))}
                  </nav>

                  <div className="p-4 border-t mt-auto">
                    {user ? (
                      <>
                        <MobileNavItem to="/admin" onClick={closeMobileMenu} icon={Settings}>
                          Painel Admin
                        </MobileNavItem>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-base font-medium rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors duration-200 mt-2"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sair
                        </button>
                      </>
                    ) : (
                      <MobileNavItem to="/admin/login" onClick={closeMobileMenu} icon={UserCircle}>
                        Login Admin
                      </MobileNavItem>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;