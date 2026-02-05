// Configuration for API URL
const PROD_API_URL = "https://pixelmartserver.vercel.app";
const DEV_API_URL = "http://localhost:5000";

// Robust detection of environment based on current location
const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isDevelopment ? DEV_API_URL : PROD_API_URL;

export default API_URL;
