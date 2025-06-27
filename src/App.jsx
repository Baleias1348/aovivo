import React from 'react';
    import { BrowserRouter as Router } from 'react-router-dom';
    import MainLayout from '@/components/layout/MainLayout';
    import { Toaster } from '@/components/ui/toaster';
    
    function App() {
        return (
            <Router>
                <MainLayout />
                <Toaster />
            </Router>
        );
    }

    export default App;