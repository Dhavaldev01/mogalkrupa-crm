export const resolveAssetUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    const origin = apiBase.replace(/\/api\/v1\/?$/, "");
    return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};
