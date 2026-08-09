const API_BASE = "https://localhost:7154/api";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  categoryId: number;
  categoryName: string;
}

// Wikimedia Commons'ta dogrulanmis, gercek ve serbest lisansli fotograflar.
// Yonlendirme (redirect) gecikmesini onlemek icin dogrudan upload.wikimedia.org
// adresleri kullanilir. Ayni kategorideki urunler bu havuzdan sirayla (id'ye gore) dagitilir.
const CATEGORY_PHOTOS: Record<string, string[]> = {
  Kahveler: [
    "https://upload.wikimedia.org/wikipedia/commons/b/bb/Espresso.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cappuccino.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ee/Turkish_coffee.jpg",
  ],
  "Soğuk İçecekler": [
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Iced_tea.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b7/Ayran.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b7/Lemonade.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Orange_juice.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e1/Milkshake.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Iced_coffee.jpg",
  ],
  Tatlılar: ["https://upload.wikimedia.org/wikipedia/commons/8/87/Tiramisu.jpg"],
  Atıştırmalıklar: [
    "https://upload.wikimedia.org/wikipedia/commons/3/32/Croissant.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/57/Mixed_nuts.jpg",
  ],
};

export function getProductImageUrl(product: Product): string {
  if (product.imageUrl) {
    return product.imageUrl;
  }
  const pool = CATEGORY_PHOTOS[product.categoryName] ?? CATEGORY_PHOTOS.Kahveler;
  return pool[product.id % pool.length];
}

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = 1 | 2 | 3 | 4 | 5;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  1: "Beklemede",
  2: "Hazırlanıyor",
  3: "Hazır",
  4: "Tamamlandı",
  5: "İptal",
};

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  orderDate: string;
  totalAmount: number;
  customerId: number;
  customerName: string;
  items: OrderItem[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `İstek başarısız oldu: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  getCategories: () => request<Category[]>("/Categories"),
  createCategory: (data: { name: string; description?: string | null; imageUrl?: string | null }) =>
    request<Category>("/Categories", { method: "POST", body: JSON.stringify(data) }),

  getProducts: () => request<Product[]>("/Products"),
  createProduct: (data: {
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    imageUrl?: string | null;
    categoryId: number;
  }) => request<Product>("/Products", { method: "POST", body: JSON.stringify(data) }),
  deleteProduct: (id: number) => request<void>(`/Products/${id}`, { method: "DELETE" }),

  getCustomers: () => request<Customer[]>("/Customers"),
  createCustomer: (data: { fullName: string; email: string; phone?: string | null }) =>
    request<Customer>("/Customers", { method: "POST", body: JSON.stringify(data) }),
  deleteCustomer: (id: number) => request<void>(`/Customers/${id}`, { method: "DELETE" }),

  getOrders: () => request<Order[]>("/Orders"),
  createOrder: (data: { customerId: number; items: { productId: number; quantity: number }[] }) =>
    request<Order>("/Orders", { method: "POST", body: JSON.stringify(data) }),
};
