import sharp from 'sharp';

export const processImage = async (url: string): Promise<number> => {
    try {
        // Fetch image buffer
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        // Process with Sharp
        const metadata = await sharp(Buffer.from(buffer)).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image dimensions');
        }
        return 2 * (metadata.width + metadata.height);
    } catch (error) {
        throw new Error(`Failed to process image from ${url}`);
    }
};