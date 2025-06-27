import React from 'react';
    import BookingFormSection from '@/components/tour/booking/BookingFormSection';

    const OffersSection = ({ tour, allToursForOffers }) => {
        const getOfferTourName = (offerTourId) => {
            const offerTour = allToursForOffers.find(t => t.id === offerTourId);
            return offerTour ? (offerTour.nameLine1 && offerTour.nameLine2 ? `${offerTour.nameLine1} ${offerTour.nameLine2}` : offerTour.name) : 'Passeio relacionado';
        };

        if (!tour?.offers || tour.offers.length === 0) return null;

        return (
            <BookingFormSection title="Ofertas Adicionais" className="pt-4 border-t border-blue-400">
              {tour.offers.map((offer, index) => (
                <div key={index} className="text-xs p-2 bg-blue-600/30 rounded border border-blue-500">
                  <p className="font-medium text-white">{getOfferTourName(offer.relatedTourId)}</p>
                  <p className="text-blue-200">{offer.description} (-R${offer.discount} BRL)</p>
                </div>
              ))}
            </BookingFormSection>
        );
    };

    export default OffersSection;