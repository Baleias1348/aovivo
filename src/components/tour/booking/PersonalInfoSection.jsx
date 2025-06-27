import React from 'react';
    import BookingFormSection from '@/components/tour/booking/BookingFormSection';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { UserCircle, Mail, Phone } from 'lucide-react';
    import { cn } from "@/lib/utils";

    const PersonalInfoSection = ({ 
      clientFirstName, setClientFirstName, 
      clientLastName, setClientLastName, 
      userEmail, setUserEmail, 
      clientPhone, setClientPhone, 
      inputStyles, labelIconStyles 
    }) => (
        <BookingFormSection title="Dados Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="clientFirstName" className="text-xs flex items-center mb-1 font-bold text-white"><UserCircle className={cn("w-3 h-3 mr-1", labelIconStyles)}/>Nome</Label>
                <Input id="clientFirstName" type="text" placeholder="Seu Nome" value={clientFirstName} onChange={(e) => setClientFirstName(e.target.value)} required className={inputStyles} />
              </div>
              <div>
                <Label htmlFor="clientLastName" className="text-xs flex items-center mb-1 font-bold text-white"><UserCircle className={cn("w-3 h-3 mr-1", labelIconStyles)}/>Sobrenome</Label>
                <Input id="clientLastName" type="text" placeholder="Seu Sobrenome" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} required className={inputStyles} />
              </div>
            </div>
            <div>
                <Label htmlFor="userEmail" className="text-xs flex items-center mb-1 font-bold text-white"><Mail className={cn("w-3 h-3 mr-1", labelIconStyles)}/>Email</Label>
                <Input id="userEmail" type="email" placeholder="email@exemplo.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <Label htmlFor="clientPhone" className="text-xs flex items-center mb-1 font-bold text-white"><Phone className={cn("w-3 h-3 mr-1", labelIconStyles)}/>Telefone</Label>
                <Input id="clientPhone" type="tel" placeholder="(XX) XXXXX-XXXX" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required className={inputStyles} />
            </div>
        </BookingFormSection>
    );

    export default PersonalInfoSection;