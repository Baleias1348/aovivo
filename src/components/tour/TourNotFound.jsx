import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';

    const TourNotFound = () => {
      return (
        <div className="container py-16 text-center flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
          <h1 className="text-3xl font-bold mb-4">Passeio Não Encontrado</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Desculpe, o passeio que você procura não existe ou não está mais disponível.
            Pode ter sido removido ou o link que você seguiu está incorreto.
          </p>
          <Button asChild size="lg">
            <Link to="/tours">Voltar para Todos os Passeios</Link>
          </Button>
        </div>
      );
    };

    export default TourNotFound;