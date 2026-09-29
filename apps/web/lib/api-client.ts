export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export type ApiFetchOptions = {
  tenant?: boolean;
};

export function getOrganizationId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('sahlbiz_org') || '';
}

export function setOrganizationId(id: string): void {
  if (typeof window === 'undefined') return;
  if (id) localStorage.setItem('sahlbiz_org', id);
  else localStorage.removeItem('sahlbiz_org');
  window.dispatchEvent(new Event('sahlbiz-org-change'));
}

export function subscribeOrganization(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('sahlbiz-org-change', listener);
  return () => window.removeEventListener('sahlbiz-org-change', listener);
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { tenant = true } = options;
  const headers = new Headers(init.headers);

  if (tenant) {
    const organizationId = getOrganizationId();
    if (organizationId) headers.set('x-organization-id', organizationId);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: init.credentials ?? 'include',
    headers,
  });
}
