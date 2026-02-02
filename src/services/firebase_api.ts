const firebaseUrl = import.meta.env.VITE_FIREBASE_URL as string

export const firebaseMapRecords = <T extends { _id?: string }>(
    data: Record<string, T> | null
) =>
    data ? Object.entries(data).map(([id, item]) => ({
            ...item,
            _id: item._id ?? id,
        })) : [];

const buildFirebaseUrl = (path: string, authToken?: string) => {
    const base = firebaseUrl.endsWith("/") ? firebaseUrl : `${firebaseUrl}/`;
    const url = new URL(`${base}${path}.json`);

    if (authToken) {
        url.searchParams.set("auth", authToken);
    }

    return url.toString();
};

export async function request<T>(
    path: string,
    options: RequestInit = {},
    authToken?: string,
): Promise<T> {
    const headers = {
        "Content-Type" : "application/json",
        ...options.headers
    }

    const response = await fetch(buildFirebaseUrl(path, authToken), {
        ...options,
        headers
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok)
        throw new Error(data?.error || data?.message || `Request failed (${response.status})`)

    return data;
}

export const api = {
    get: <T>(path: string, authToken?: string) => request<T>(path, { method: "GET" }, authToken),
    post: <T>(path: string, body: any, authToken?: string) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body) }, authToken),
    put: <T>(path: string, body: any, authToken?: string) =>
        request<T>(path, { method: "PUT", body: JSON.stringify(body) }, authToken),
    delete: <T>(path: string, authToken?: string) =>
        request<T>(path, { method: "DELETE" }, authToken),
}
