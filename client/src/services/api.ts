const BASE = import.meta.env.VITE_API_URL ?? '';

export interface ApiResult<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string>;
}

async function post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      message: json?.error?.message ?? 'Something went wrong. Please try again.',
      fieldErrors: json?.error?.details,
    };
  }
  return { ok: true, data: json.data as T };
}

export const postContact = (body: unknown) => post('/contact', body);
export const postLead = (body: unknown) => post('/leads', body);
