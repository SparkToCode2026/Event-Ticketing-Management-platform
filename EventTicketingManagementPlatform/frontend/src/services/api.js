const BASE_URL = "http://localhost:7173";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

    const text = await response.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(data?.title || data || `Request failed (${response.status})`);
  }

  return data;
}