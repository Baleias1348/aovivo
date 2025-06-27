import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Minus, Plus } from 'lucide-react';

    const ParticipantCounter = ({ label, price, count, onIncrement, onDecrement, disabledDecrement, currencySymbol = "R$" }) => (
      <div className="flex items-center justify-between p-3 border border-blue-300 rounded-md bg-blue-700/30">
        <span className="text-sm text-white">{label} ({currencySymbol}{price || 0})</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7 bg-blue-200 text-blue-800 hover:bg-blue-300 border-blue-400" onClick={onDecrement} disabled={disabledDecrement}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center tabular-nums text-white">{count}</span>
          <Button variant="outline" size="icon" className="h-7 w-7 bg-blue-200 text-blue-800 hover:bg-blue-300 border-blue-400" onClick={onIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );

    export default ParticipantCounter;