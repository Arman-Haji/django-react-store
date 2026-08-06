const API_BASE_URL = 'http://127.0.0.1:8000/api';

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');

  if (!refresh) {
    logout();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  } catch {
    logout();
    return null;
  }
};

const request = async (
  endpoint,
  method = 'GET',
  body = null,
  options = {},
  retry = true
) => {
  const token = localStorage.getItem('access_token');
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // فقط وقتی FormData نیست Content-Type بذار
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    ...options,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && retry) {
    const newToken = await refreshToken();
    if (newToken) {
      return request(endpoint, method, body, options, false);
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const error = JSON.parse(errorText);

      // اگر validation error بود، پیام‌ها رو جمع کن
      if (typeof error === 'object' && !error.detail && !error.message) {
        const messages = Object.entries(error)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        throw new Error(messages || 'Request failed');
      }

      throw new Error(error.detail || error.message || 'Request failed');
    } catch (e) {
      if (e.message && e.message !== 'Request failed') throw e;
      throw new Error('Request failed');
    }
  }

  if (response.status === 204) return null;

  return response.json();
};

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, 'GET', null, options),

  post: (endpoint, data, options = {}) =>
    request(endpoint, 'POST', data, options),

  put: (endpoint, data, options = {}) =>
    request(endpoint, 'PUT', data, options),

  patch: (endpoint, data, options = {}) =>
    request(endpoint, 'PATCH', data, options),

  delete: (endpoint, options = {}) =>
    request(endpoint, 'DELETE', null, options),
};