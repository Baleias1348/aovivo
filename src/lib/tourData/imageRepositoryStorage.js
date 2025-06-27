const IMAGE_REPOSITORY_STORAGE_KEY = 'vibechile-image-repository';

    export const getImageRepository = () => {
        try {
            const storedImages = localStorage.getItem(IMAGE_REPOSITORY_STORAGE_KEY);
            return storedImages ? JSON.parse(storedImages) : [];
        } catch (error) {
            console.error("Erro ao ler repositório de imagens:", error);
            return [];
        }
    };

    export const addImageToRepository = (imageUrl) => {
        if (!imageUrl || !imageUrl.startsWith('http')) {
            console.error("URL da imagem inválida");
            return false;
        }
        const images = getImageRepository();
        if (images.includes(imageUrl)) {
             console.warn("Imagem já existe no repositório");
             return false;
        }
        const updatedImages = [...images, imageUrl];
        localStorage.setItem(IMAGE_REPOSITORY_STORAGE_KEY, JSON.stringify(updatedImages));
        return true;
    };

    export const removeImageFromRepository = (imageUrl) => {
        const images = getImageRepository();
        const updatedImages = images.filter(url => url !== imageUrl);
        localStorage.setItem(IMAGE_REPOSITORY_STORAGE_KEY, JSON.stringify(updatedImages));
    };