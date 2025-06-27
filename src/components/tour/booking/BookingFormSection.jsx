import React from 'react';
    import { Label } from '@/components/ui/label';
    import { cn } from "@/lib/utils";

    const BookingFormSection = ({ title, children, className, titleClassName }) => (
      <div className={cn("space-y-3", className)}>
        {title && <Label className={cn("text-sm font-bold text-white", titleClassName)}>{title}</Label>}
        {children}
      </div>
    );

    export default BookingFormSection;