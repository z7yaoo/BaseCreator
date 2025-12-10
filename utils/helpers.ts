export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(
    amount: bigint,
    decimals: number
): string {
    const value = Number(amount) / Math.pow(10, decimals);
    return value.toLocaleString();
}

export function validateTokenInput(
    name: string,
    symbol: string,
    supply: string
): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Token name is required' };
    }
    if (!symbol || symbol.trim().length === 0) {
        return { valid: false, error: 'Token symbol is required' };
    }
    if (symbol.length > 10) {
        return { valid: false, error: 'Symbol must be 10 characters or less' };
    }
    const supplyNum = parseFloat(supply);
    if (isNaN(supplyNum) || supplyNum <= 0) {
        return { valid: false, error: 'Supply must be greater than 0' };
    }
    return { valid: true };
}
