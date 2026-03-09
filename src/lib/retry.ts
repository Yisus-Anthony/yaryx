export async function retry<T>(
    fn: () => Promise<T>,
    retries = 2,
    delay = 1500
): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        await new Promise((r) => setTimeout(r, delay));
        return retry(fn, retries - 1, delay);
    }
}