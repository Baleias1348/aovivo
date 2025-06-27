import React from 'react';
    import BookingFormSection from '@/components/tour/booking/BookingFormSection';
    import ParticipantCounter from '@/components/tour/booking/ParticipantCounter';

    const ParticipantsSection = ({ tour, adults, setAdults, childrenCount, setChildrenCount }) => (
        <BookingFormSection title="Participantes">
            <ParticipantCounter 
              label="Adultos" 
              price={tour?.pricePerAdult} 
              count={adults} 
              onIncrement={() => setAdults(p => p + 1)} 
              onDecrement={() => setAdults(p => Math.max(0, p - 1))} 
              disabledDecrement={adults <= (childrenCount > 0 ? 0 : 1) && adults <=1} 
            />
            {tour?.pricePerChild > 0 && (
              <ParticipantCounter 
                label="Crianças" 
                price={tour?.pricePerChild} 
                count={childrenCount} 
                onIncrement={() => setChildrenCount(p => p + 1)} 
                onDecrement={() => setChildrenCount(p => Math.max(0, p - 1))} 
                disabledDecrement={childrenCount <= 0} 
              />
            )}
        </BookingFormSection>
    );

    export default ParticipantsSection;