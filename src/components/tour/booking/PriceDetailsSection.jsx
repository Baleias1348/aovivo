import React from 'react';
    import PriceSummaryItem from '@/components/tour/booking/PriceSummaryItem';
    import { Percent } from 'lucide-react';

    const PriceDetailsSection = ({ totalPrice, downPayment, remainingBalance, downPaymentPercentage, currencySymbol = "R$" }) => (
        <div className="text-center pt-5 border-t border-blue-400 space-y-3">
            <PriceSummaryItem label="Preço Total da Reserva" value={totalPrice} primary smallText="BRL" currencySymbol={currencySymbol} />
            <PriceSummaryItem 
              label={`Sinal a pagar (${(downPaymentPercentage * 100).toFixed(0)}% via Stripe)`} 
              value={downPayment} 
              highlight="yellow" 
              icon={Percent} 
              smallText="BRL"
              currencySymbol={currencySymbol}
            />
            <PriceSummaryItem label="Saldo a pagar no dia" value={remainingBalance} highlight="blue" smallText="BRL" currencySymbol={currencySymbol} />
        </div>
    );

    export default PriceDetailsSection;