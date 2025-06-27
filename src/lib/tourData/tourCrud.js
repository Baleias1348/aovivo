import { supabase } from '@/lib/supabaseClient';

    const mapTourFromSupabase = (tour) => {
        if (!tour) return null;
        return {
            id: tour.id,
            nameLine1: tour.name_line1 || '',
            nameLine2: tour.name_line2 || '',
            name: `${tour.name_line1 || ''}${tour.name_line2 ? `\n${tour.name_line2}` : ''}`,
            location: tour.location || '',
            duration: tour.duration || '',
            pricePerAdult: tour.price_per_adult ? parseFloat(tour.price_per_adult) : 0,
            pricePerChild: tour.price_per_child ? parseFloat(tour.price_per_child) : 0,
            description: tour.description || '',
            image: tour.image_url || '',
            gallery: Array.isArray(tour.gallery_urls) ? tour.gallery_urls : [],
            itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
            includes: Array.isArray(tour.includes) ? tour.includes : [], 
            excludes: Array.isArray(tour.excludes) ? tour.excludes : [], 
            isVisible: tour.is_visible !== undefined ? tour.is_visible : true,
            startTime: tour.start_time || '',
            endTime: tour.end_time || '',
            checklist: Array.isArray(tour.checklist) ? tour.checklist : [],
            termsAndConditions: tour.terms_and_conditions || '',
            availableDates: tour.available_dates || [], 
            offers: tour.offers || [], 
            stripe_adult_signal_price_id: tour.stripe_adult_signal_price_id || '',
            stripe_child_signal_price_id: tour.stripe_child_signal_price_id || '',
            signal_percentage: tour.signal_percentage ? parseFloat(tour.signal_percentage) : 20,
        };
    };

    const mapTourToSupabase = (tourData) => {
        let isVisible = tourData.isVisible !== undefined ? tourData.isVisible : true;
        const pricePerAdult = tourData.pricePerAdult ? parseFloat(tourData.pricePerAdult) : 0;
        const pricePerChild = tourData.pricePerChild ? parseFloat(tourData.pricePerChild) : 0;

        if (pricePerAdult > 0 && !tourData.stripe_adult_signal_price_id) {
            isVisible = false;
        }
        if (pricePerChild > 0 && !tourData.stripe_child_signal_price_id) {
            isVisible = false;
        }
        
        const parseStringToArray = (inputString, separator = '\n') => {
            if (typeof inputString === 'string' && inputString.trim() !== '') {
                return inputString.split(separator).map(s => s.trim()).filter(Boolean);
            }
            if (Array.isArray(inputString)) { 
                return inputString.map(s => String(s).trim()).filter(Boolean);
            }
            return [];
        };

        return {
            name_line1: tourData.nameLine1 || '',
            name_line2: tourData.nameLine2 || '',
            location: tourData.location || '',
            duration: tourData.duration || '',
            price_per_adult: pricePerAdult,
            price_per_child: pricePerChild,
            description: tourData.description || '', 
            image_url: tourData.image || '',
            gallery_urls: parseStringToArray(tourData.gallery, ','),
            itinerary: parseStringToArray(tourData.itinerary, '\n'),
            includes: parseStringToArray(tourData.includes, '\n'), 
            excludes: parseStringToArray(tourData.excludes, '\n'), 
            is_visible: isVisible,
            start_time: tourData.startTime || '',
            end_time: tourData.endTime || '',
            checklist: parseStringToArray(tourData.checklist, '\n'),
            terms_and_conditions: tourData.termsAndConditions || '', 
            stripe_adult_signal_price_id: tourData.stripe_adult_signal_price_id || null,
            stripe_child_signal_price_id: tourData.stripe_child_signal_price_id || null,
            signal_percentage: tourData.signal_percentage ? parseFloat(tourData.signal_percentage) : 20,
        };
    };


    export const getAllTours = async () => {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tours:', error);
            return [];
        }
        return data.map(mapTourFromSupabase);
    };

    export const getTourById = async (id) => {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching tour ${id}:`, error);
            return null; 
        }
        return mapTourFromSupabase(data);
    };

    export const addTour = async (tourData) => {
        const supabaseFriendlyTourData = mapTourToSupabase(tourData);
        
        const { data, error } = await supabase
            .from('tours')
            .insert([supabaseFriendlyTourData])
            .select()
            .single();

        if (error) {
            console.error('Error adding tour:', error.message, error.details, error.hint);
            throw error; 
        }
        return mapTourFromSupabase(data);
    };

    export const updateTour = async (id, tourData) => {
        const supabaseFriendlyUpdateData = mapTourToSupabase(tourData);

        const { data, error } = await supabase
            .from('tours')
            .update(supabaseFriendlyUpdateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating tour ${id}:`, error.message, error.details, error.hint);
            throw error; 
        }
        return mapTourFromSupabase(data);
    };

    export const deleteTour = async (id) => {
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting tour ${id}:`, error);
            throw error; 
        }
        return true;
    };