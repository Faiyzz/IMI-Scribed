/**
 * Utility to get the backend API URL dynamically.
 * Defaults to localhost:5000 in development.
 */
export const getApiUrl = (): string => {
    // Check if we have an environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        return "http://localhost:5000";
    }

    // Ensure it starts with http or https
    if (apiUrl.startsWith("http")) {
        return apiUrl;
    }

    // If it's just a domain (like imi-scribed-production.up.railway.app), add https
    return `https://${apiUrl}`;
};
