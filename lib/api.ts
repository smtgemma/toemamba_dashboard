import { getToken } from "./getToken";

type ApiRequestOptions = {
    url: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: HeadersInit;
    authorize?: boolean;
    client?: boolean;
};

export async function api({
    url,
    method,
    body,
    headers,
    authorize = false,
    client = false,
}: ApiRequestOptions) {
    const token = authorize ? getToken() : null;

    // const rootToken = client ? getToken() : await getServerToken();
    // const token = authorize ? rootToken : null;

    console.log(`API Request: ${method || "GET"} ${url}`);
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(authorize &&
                token && {
                    Authorization: `Bearer ${token}`,
                }),
            ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
        credentials: "include",
    });

    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    console.log(`API Response: ${res.status}`, data);

    if (!res.ok || data?.success === false) {
        throw new Error(
            data?.message ||
                data?.errorMessages?.[0]?.message ||
                "Something went wrong",
        );
    }

    return data;
}
