import { invariant } from "@/lib/utils/invariant";

function getOptional(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

function getRequired(name: string): string {
    const value = getOptional(name);
    invariant(value, `Missing required env var: ${name}`);
    return value;
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    appUrl:
        getOptional("NEXT_PUBLIC_APP_URL") ||
        getOptional("NEXT_PUBLIC_SITE_URL") ||
        getOptional("NEXTAUTH_URL") ||
        "http://localhost:3000",

    mpAccessToken: getRequired("MP_ACCESS_TOKEN"),
    mpWebhookSecret: getOptional("MP_WEBHOOK_SECRET"),

    cloudinaryCloudName: getOptional("CLOUDINARY_CLOUD_NAME"),
};