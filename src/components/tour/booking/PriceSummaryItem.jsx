import React from 'react';
    import { cn } from "@/lib/utils";

    const PriceSummaryItem = ({ label, value, primary, highlight, icon: Icon, smallText, currencySymbol = "R$" }) => (
      <div className={cn("p-3 rounded-lg", 
        highlight === 'yellow' && "bg-[#f0f010] border border-yellow-600",
        highlight === 'blue' && "bg-blue-100 border border-blue-300",
        primary && "bg-white/10 border border-white/20"
      )}>
        <p className={cn("text-sm flex items-center justify-center", 
          primary ? "text-gray-200" : (highlight === 'yellow' ? "text-black font-medium" : "text-blue-700")
        )}>
          {Icon && <Icon className="w-4 h-4 mr-1.5"/>}
          {label}
        </p>
        <p className={cn("text-center font-bold", 
          primary ? "text-2xl text-white" : (highlight === 'yellow' ? "text-xl text-black" : "text-lg text-blue-600")
        )}>
          {currencySymbol}{value.toFixed(2)} 
          {smallText && <span className="text-xs font-normal ml-1">{smallText}</span>}
        </p>
      </div>
    );

    export default PriceSummaryItem;