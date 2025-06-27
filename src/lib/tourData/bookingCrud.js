import { supabase } from '@/lib/supabaseClient';
    import { getTourById } from './tourCrud';

    export const addBooking = async (bookingData) => {
        const tour = await getTourById(bookingData.tourId); 

        const adults = bookingData.adults || 0;
        const children = bookingData.children || 0;
        
        const pricePerAdult = tour?.pricePerAdult || 0;
        const pricePerChild = tour?.pricePerChild || 0;

        let calculatedTotalPrice = (pricePerAdult * adults) + (pricePerChild * children);
        let actualDownPaymentPaid = bookingData.downPaymentAmount ? Number(bookingData.downPaymentAmount) : 0;
        
        if (calculatedTotalPrice < actualDownPaymentPaid && actualDownPaymentPaid > 0) {
            if (calculatedTotalPrice === 0) actualDownPaymentPaid = 0;
            else calculatedTotalPrice = actualDownPaymentPaid;
        }

        const tourDetailsSnapshot = tour ? { 
            name: tour.nameLine1 && tour.nameLine2 ? `${tour.nameLine1} ${tour.nameLine2}` : tour.name,
            location: tour.location,
            duration: tour.duration,
            startTime: tour.startTime,
            endTime: tour.endTime,
        } : { name: "Detalhes do passeio não encontrados"};

        const bookingToInsert = {
            tour_id: bookingData.tourId,
            stripe_session_id: bookingData.sessionId || null,
            booking_date: bookingData.selectedDate ? new Date(bookingData.selectedDate).toISOString() : new Date().toISOString(),
            adults: adults,
            children: children,
            client_name: `${bookingData.clientFirstName || ''} ${bookingData.clientLastName || ''}`.trim() || 'N/A',
            client_first_name: bookingData.clientFirstName || null,
            client_last_name: bookingData.clientLastName || null,
            client_email: bookingData.userEmail || 'N/A',
            client_phone: bookingData.clientPhone || null,
            client_address_street: bookingData.clientAddressStreet || null,
            client_address_city: bookingData.clientAddressCity || null,
            client_address_state: bookingData.clientAddressState || null,
            client_address_postal_code: bookingData.clientAddressPostalCode || null,
            total_price: calculatedTotalPrice,
            down_payment_amount: actualDownPaymentPaid,
            payment_status: bookingData.paymentStatus || "Pendente",
            tour_details_snapshot: tourDetailsSnapshot,
        };

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingToInsert])
            .select()
            .single();

        if (error) {
            console.error('Error adding booking to Supabase:', error);
            return null; 
        }

        return {
            bookingId: data.booking_id,
            tourId: data.tour_id,
            sessionId: data.stripe_session_id,
            date: data.booking_date,
            adults: data.adults,
            children: data.children,
            name: data.client_name,
            firstName: data.client_first_name,
            lastName: data.client_last_name,
            email: data.client_email,
            phone: data.client_phone,
            addressStreet: data.client_address_street,
            addressCity: data.client_address_city,
            addressState: data.client_address_state,
            addressPostalCode: data.client_address_postal_code,
            totalPrice: parseFloat(data.total_price),
            downPaymentAmount: parseFloat(data.down_payment_amount),
            paymentStatus: data.payment_status,
            tourDetails: data.tour_details_snapshot,
            bookingCreatedAt: data.created_at,
            balance_paid_date: data.balance_paid_date || null,
            internal_notes: data.internal_notes || '',
            follow_up_status: data.follow_up_status || ''
        };
};

export const getAllBookings = async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings from Supabase:', error);
        return [];
    }
    
    return data.map(b => ({
        bookingId: b.booking_id,
        tourId: b.tour_id,
        sessionId: b.stripe_session_id,
        date: b.booking_date,
        adults: b.adults,
        children: b.children,
        name: b.client_name,
        firstName: b.client_first_name,
        lastName: b.client_last_name,
        email: b.client_email,
        phone: b.client_phone,
        addressStreet: b.client_address_street,
        addressCity: b.client_address_city,
        addressState: b.client_address_state,
        addressPostalCode: b.client_address_postal_code,
        totalPrice: parseFloat(b.total_price),
        downPaymentAmount: parseFloat(b.down_payment_amount),
        paymentStatus: b.payment_status,
        tourDetails: b.tour_details_snapshot,
        bookingCreatedAt: b.created_at,
        balance_paid_date: b.balance_paid_date,
        internal_notes: b.internal_notes,
        follow_up_status: b.follow_up_status
    }));
};

export const getBookingById = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

    if (error) {
        console.error(`Error fetching booking ${bookingId} from Supabase:`, error);
        return null;
    }

    if (!data) return null;

    return {
        bookingId: data.booking_id,
        tourId: data.tour_id,
        sessionId: data.stripe_session_id,
        date: data.booking_date,
        adults: data.adults,
        children: data.children,
        name: data.client_name,
        firstName: data.client_first_name,
        lastName: data.client_last_name,
        email: data.client_email,
        phone: data.client_phone,
        addressStreet: data.client_address_street,
        addressCity: data.client_address_city,
        addressState: data.client_address_state,
        addressPostalCode: data.client_address_postal_code,
        totalPrice: parseFloat(data.total_price),
        downPaymentAmount: parseFloat(data.down_payment_amount),
        paymentStatus: data.payment_status,
        tourDetails: data.tour_details_snapshot,
        bookingCreatedAt: data.created_at,
        balance_paid_date: data.balance_paid_date,
        internal_notes: data.internal_notes,
        follow_up_status: data.follow_up_status
    };
};