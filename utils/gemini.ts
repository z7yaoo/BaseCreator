export interface ImageGenerationOptions {
    tokenName: string;
    tokenSymbol: string;
    style: 'logo' | 'banner';
    theme?: string;
}

export interface GeneratedImage {
    url: string;
    prompt: string;
}

export async function generateTokenImage(
    options: ImageGenerationOptions
): Promise<GeneratedImage> {
    const { tokenName, tokenSymbol, style, theme } = options;

    const prompt = style === 'logo'
        ? `Vibrant meme coin logo for "${tokenName}" (${tokenSymbol}).
       Fun, playful, memorable. Bold colors. Modern crypto aesthetic.
       ${theme ? `Theme: ${theme}` : ''}
       Circular, 512x512px, transparent background.`
        : `Dynamic banner for "${tokenName}" (${tokenSymbol}) meme token.
       Exciting, shareable. Gradient backgrounds, vibrant colors.
       ${theme ? `Theme: ${theme}` : ''}
       Horizontal, 1200x630px.`;

    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, tokenName, tokenSymbol, style }),
        });

        if (!response.ok) throw new Error('Generation failed');

        const data = await response.json();
        return { url: data.imageUrl, prompt };
    } catch (error) {
        console.error('Image generation error:', error);
        return {
            url: `/api/placeholder-image?name=${encodeURIComponent(tokenName)}&symbol=${encodeURIComponent(tokenSymbol)}&style=${style}`,
            prompt,
        };
    }
}

export async function generateTokenImages(
    tokenName: string,
    tokenSymbol: string,
    theme?: string
) {
    const [logo, banner] = await Promise.all([
        generateTokenImage({ tokenName, tokenSymbol, style: 'logo', theme }),
        generateTokenImage({ tokenName, tokenSymbol, style: 'banner', theme }),
    ]);
    return { logo, banner };
}
