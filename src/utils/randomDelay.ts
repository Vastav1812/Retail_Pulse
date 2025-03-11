export const randomDelay = (): Promise<void> => {
    const delay = Math.random() * (400 - 100) + 100;
    return new Promise(resolve => setTimeout(resolve, delay));
};