
import { supabase } from '@/lib/supabaseClient';

const mapSkiCenterFromSupabase = (skiCenter) => {
    if (!skiCenter) return null;
    return {
        id: skiCenter.id,
        name: skiCenter.name || '',
        slug: skiCenter.slug || '',
        generalDescription: skiCenter.general_description || '',
        profileAndTracks: skiCenter.profile_and_tracks || '',
        uniqueExperience: skiCenter.unique_experience || '',
        valuableTips: skiCenter.valuable_tips || '',
        practicalInfo: skiCenter.practical_info || '',
        mainImageUrl: skiCenter.main_image_url || '',
        galleryUrls: Array.isArray(skiCenter.gallery_urls) ? skiCenter.gallery_urls : [],
        isVisible: skiCenter.is_visible !== undefined ? skiCenter.is_visible : true,
        websiteUrl: skiCenter.website_url || '',
        metaTitle: skiCenter.meta_title || '',
        metaDescription: skiCenter.meta_description || '',
        createdAt: skiCenter.created_at,
        updatedAt: skiCenter.updated_at,
    };
};

const mapSkiCenterToSupabase = (skiCenterData) => {
    const slug = skiCenterData.name 
        ? skiCenterData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        : skiCenterData.slug || ''; // Keep existing slug if name is not changing or not provided

    return {
        name: skiCenterData.name || '',
        slug: slug,
        general_description: skiCenterData.generalDescription || '',
        profile_and_tracks: skiCenterData.profileAndTracks || '',
        unique_experience: skiCenterData.uniqueExperience || '',
        valuable_tips: skiCenterData.valuableTips || '',
        practical_info: skiCenterData.practicalInfo || '',
        main_image_url: skiCenterData.mainImageUrl || '',
        gallery_urls: Array.isArray(skiCenterData.galleryUrls) 
            ? skiCenterData.galleryUrls 
            : (typeof skiCenterData.galleryUrls === 'string' ? skiCenterData.galleryUrls.split(',').map(url => url.trim()).filter(Boolean) : []),
        is_visible: skiCenterData.isVisible !== undefined ? skiCenterData.isVisible : true,
        website_url: skiCenterData.websiteUrl || '',
        meta_title: skiCenterData.metaTitle || skiCenterData.name || '',
        meta_description: skiCenterData.metaDescription || (skiCenterData.generalDescription ? skiCenterData.generalDescription.substring(0,160) : ''),
    };
};

export const getAllSkiCenters = async () => {
    const { data, error } = await supabase
        .from('ski_centers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching ski centers:', error);
        throw error;
    }
    return data.map(mapSkiCenterFromSupabase);
};

export const getSkiCenterById = async (id) => {
    const { data, error } = await supabase
        .from('ski_centers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching ski center ${id}:`, error);
        return null;
    }
    return mapSkiCenterFromSupabase(data);
};

export const getSkiCenterBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('ski_centers')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching ski center by slug ${slug}:`, error);
        return null;
    }
    return mapSkiCenterFromSupabase(data);
};

export const addSkiCenter = async (skiCenterData) => {
    const supabaseFriendlyData = mapSkiCenterToSupabase(skiCenterData);
    
    const { data, error } = await supabase
        .from('ski_centers')
        .insert([supabaseFriendlyData])
        .select()
        .single();

    if (error) {
        console.error('Error adding ski center:', error);
        throw error;
    }
    return mapSkiCenterFromSupabase(data);
};

export const updateSkiCenter = async (id, skiCenterData) => {
    const supabaseFriendlyUpdateData = mapSkiCenterToSupabase(skiCenterData);

    const { data, error } = await supabase
        .from('ski_centers')
        .update(supabaseFriendlyUpdateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating ski center ${id}:`, error);
        throw error;
    }
    return mapSkiCenterFromSupabase(data);
};

export const deleteSkiCenter = async (id) => {
    const { error } = await supabase
        .from('ski_centers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(`Error deleting ski center ${id}:`, error);
        throw error;
    }
    return true;
};
  