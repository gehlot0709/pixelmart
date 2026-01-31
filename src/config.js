// Configuration for API URL
const PROD_API_URL = "https://pixelmartserver.vercel.app";
const DEV_API_URL = "http://localhost:5000";

// Force production URL if the build is in production mode
// This overrides any VITE_API_URL that might incorrectly point to localhost
const API_URL = import.meta.env.PROD
    ? PROD_API_URL
    : (import.meta.env.VITE_API_URL || DEV_API_URL);

export default API_URL;
