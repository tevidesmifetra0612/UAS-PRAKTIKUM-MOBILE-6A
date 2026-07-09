// Semua akses jaringan ke DummyJSON dikumpulkan di sini supaya UI tidak
// perlu tahu detail fetch dan setiap error bisa ditangani dengan pesan yang rapi.

const BASE_URL = "https://dummyjson.com";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
};

class ApiError extends Error {}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server. Periksa koneksi internet Anda.");
  }

  if (!response.ok) {
    let message = `Permintaan gagal (status ${response.status}).`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // respons tidak berbentuk JSON, abaikan dan pakai pesan default
    }
    throw new ApiError(message);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("Respons server tidak valid.");
  }
}

export function getProducts(limit = 10, skip = 0) {
  return request<ProductListResponse>(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`
  );
}

export function searchProducts(query: string, limit = 20, skip = 0) {
  return request<ProductListResponse>(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
}

export function getCategoryList() {
  return request<string[]>(`${BASE_URL}/products/category-list`);
}

export function getProductsByCategory(slug: string, limit = 20, skip = 0) {
  return request<ProductListResponse>(
    `${BASE_URL}/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`
  );
}

export function getProductDetail(id: number | string) {
  return request<Product>(`${BASE_URL}/products/${id}`);
}

export function loginUser(username: string, password: string) {
  return request<LoginResponse>(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

export { ApiError };
