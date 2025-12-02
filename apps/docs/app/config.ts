// export const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND || "http://localhost:3000";
// export const WS_BACKEND = process.env.NEXT_PUBLIC_WS_BACKEND || "ws://localhost:8080";
export const HTTP_BACKEND = "http://localhost:3000";
export const WS_BACKEND = "ws://localhost:8080";

// Cloudflare Turnstile Site Key
// Get your site key from: https://dash.cloudflare.com/
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACERPcVPGvOXZZd3"; // Test key for development
