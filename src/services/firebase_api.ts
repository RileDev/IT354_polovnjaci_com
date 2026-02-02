const firebaseUrl = import.meta.env.VITE_FIREBASE_URL as string

export const firebaseMapRecords = <T extends { _id?: string }>(
    data: Record<string, T> | null
) =>
    data ? Object.entries(data).map(([id, item]) => ({
            ...item,
            _id: item._id ?? id,
        })) : [];

export async function request<T>(path: string, options: RequestInit = {}) : Promise<T>{
    const headers = {
        "Content-Type" : "application/json",
        ...options.headers
    }

    const response = await fetch(`${firebaseUrl}${path}.json`, {
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
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body: any) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(path: string, body: any) =>
        request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}