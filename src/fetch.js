const API_BACKEND = import.meta.env.VITE_API_BASE_URL_BACKEND;

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const buildErrorMessage = async (response) => {
  try {
    const data = await response.clone().json();
    return data?.error ?? data?.message ?? response.statusText;
  } catch (error) {
    return response.statusText || "An error has occurred";
  }
};

const request = async (path, { method = "GET", body, headers } = {}) => {
  const url = `${API_BACKEND}${path}`;
  const init = {
    method,
    body,
    headers: headers ?? (body instanceof FormData ? undefined : jsonHeaders),
  };

  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await buildErrorMessage(response);
    throw new Error(message);
  }

  const data = await response.json();

  if (data?.success === false) {
    throw new Error(data?.error ?? "An error has occurred");
  }

  return data;
};

export const getAllFilm = async () => request('')

export const getAllDonghua = async () => request('/donghua')

export const getAllAnime = async () => request('/anime')

export const getDetailFilm = async (id) => request(`/${id}`)

export const addNewFilm = async (body) =>
request('', {
  method: "POST",
  body: JSON.stringify(body),
})

export const deleteFilm = async (id) =>
request(`/${id}`, {
  method: "DELETE",
})
  
export const updateFilm = async (id, body) =>
request(`/${id}`, {
  method: "PATCH",
  body: JSON.stringify(body)
})