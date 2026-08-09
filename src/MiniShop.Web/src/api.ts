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
// Ayni kategorideki urunler bu havuzdan sirayla (id'ye gore) dagitilir.
const CATEGORY_PHOTOS: Record<string, string[]> = {
  Kahveler: ["Espresso.jpg", "Cappuccino.jpg", "Turkish_coffee.jpg"],
  "Soğuk İçecekler": ["Iced_tea.jpg", "Ayran.jpg", "Lemonade.jpg", "Orange_juice.jpg", "Milkshake.jpg", "Iced_coffee.jpg"],
  Tatlılar: ["Tiramisu.jpg"],
  Atıştırmalıklar: ["Croissant.jpg", "Mixed_nuts.jpg"],
};

export function getProductImageUrl(product: Product): string {
  if (product.imageUrl) {
    return product.imageUrl;
  }
  const pool = CATEGORY_PHOTOS[product.categoryName] ?? CATEGORY_PHOTOS.Kahveler;
  const file = pool[product.id % pool.length];
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;
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

  getOrders: () => request<Order[]>("/Orders"),
  createOrder: (data: { customerId: number; items: { productId: number; quantity: number }[] }) =>
    request<Order>("/Orders", { method: "POST", body: JSON.stringify(data) }),
};
