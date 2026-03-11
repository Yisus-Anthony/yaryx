export { };

declare global {
    interface Window {
        MercadoPago?: new (
            publicKey: string,
            options?: { locale?: string }
        ) => {
            bricks: () => {
                create: (
                    brickType: string,
                    containerId: string,
                    settings: Record<string, unknown>
                ) => Promise<{
                    unmount: () => void;
                }>;
            };
        };
    }
}