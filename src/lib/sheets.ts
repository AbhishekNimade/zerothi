// Google Sheets Integration Helper
// Communicates with Google Apps Script Web App securely from static deployment

export interface SheetProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  status: string; // "ACTIVE" or "INACTIVE"
  image?: string;
}

export interface SheetOrder {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  pinCode: string;
  state: string;
  products: string; // Summarized list of items
  subtotal: number;
  shipping: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  userEmail: string;
  items?: { name: string; quantity: number }[];
}

// Retrieves Google Apps Script URL from LocalStorage
export function getScriptUrl(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("zerothi_sheet_url") || "https://script.google.com/a/macros/zerothi.com/s/AKfycbwli0F_XNU-h43SPtixY_e_HPys0XOQUDvcmJHqxk99DU79Z8Nbhq39ufx5-HgsOXfYBw/exec";
  }
  return "https://script.google.com/a/macros/zerothi.com/s/AKfycbwli0F_XNU-h43SPtixY_e_HPys0XOQUDvcmJHqxk99DU79Z8Nbhq39ufx5-HgsOXfYBw/exec";
}

// Checks if Google Sheet Integration is configured
export function isSheetsConfigured(): boolean {
  const url = getScriptUrl();
  return url !== "" && url.startsWith("https://script.google.com");
}

// Helper to make fetch requests to Google Apps Script
async function requestSheetsAPI(action: string, payload: any = {}): Promise<any> {
  const url = getScriptUrl();
  if (!url) return null;

  try {
    if (action.startsWith("get")) {
      // For GET request, use URL query parameters
      const getUrl = new URL(url);
      getUrl.searchParams.set("action", action);
      for (const key in payload) {
        getUrl.searchParams.set(key, payload[key]);
      }
      
      const response = await fetch(getUrl.toString(), {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (response.ok) {
        return await response.json();
      }
    } else {
      // For POST request, send as stringified JSON
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action,
          ...payload
        })
      });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (err: any) {
    console.warn(`Google Sheet API Action "${action}" connection unavailable (using offline/local cache fallback)`);
  }
  return null;
}

// 1. Record User Login
export async function logLoginToSheet(name: string, email: string, method: string): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  const res = await requestSheetsAPI("addLogin", {
    name,
    email,
    method,
    timestamp: new Date().toISOString()
  });
  return res && res.success;
}

// 2. Submit Order Details
export async function saveOrderToSheet(order: any): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  
  const productsSummary = order.items.map((item: any) => 
    `${item.quantity}x ${item.name} (₹${item.price})`
  ).join(", ");

  const payload: SheetOrder = {
    id: order.id,
    date: order.date,
    customerName: order.shippingDetails.name,
    phone: order.shippingDetails.phone,
    address: order.shippingDetails.address + ", " + order.shippingDetails.city,
    pinCode: order.shippingDetails.postalCode,
    state: "Madhya Pradesh", // Regional default, can parse from form
    products: productsSummary,
    subtotal: order.subtotal,
    shipping: order.shipping,
    totalAmount: order.total,
    status: order.status,
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "PENDING",
    userEmail: order.userEmail,
    items: order.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity
    }))
  };

  const res = await requestSheetsAPI("addOrder", payload);
  return res && res.success;
}

// 3. Fetch Master Product Inventory
export async function fetchProductsFromSheet(): Promise<SheetProduct[] | null> {
  if (!isSheetsConfigured()) return null;
  const res = await requestSheetsAPI("getProducts");
  if (res && res.success) {
    return res.data as SheetProduct[];
  }
  return null;
}

// 4. Fetch User Orders History
export async function fetchOrdersFromSheet(email: string): Promise<any[] | null> {
  if (!isSheetsConfigured()) return null;
  const res = await requestSheetsAPI("getOrders", { email });
  if (res && res.success) {
    return res.data;
  }
  return null;
}

// 5. Update Order Status (e.g. Cancellation, payment updates)
export async function updateOrderStatusInSheet(orderId: string, status: string, paymentStatus?: string): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  const res = await requestSheetsAPI("updateOrderStatus", { orderId, status, paymentStatus });
  return res && res.success;
}

// 6. Update Product full properties
export async function updateProductInSheet(
  productId: string, 
  fields: {
    sku?: string;
    name?: string;
    category?: string;
    price?: number;
    originalPrice?: number;
    stock?: number;
    status?: string;
    image?: string;
  }
): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  const res = await requestSheetsAPI("updateProduct", { productId, ...fields });
  return res && res.success;
}

// 7. Add Product to sheet
export async function addProductToSheet(product: {
  sku: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  image?: string;
}): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  const res = await requestSheetsAPI("addProduct", product);
  return res && res.success;
}

// 8. Delete Product from sheet
export async function deleteProductFromSheet(productId: string): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  const res = await requestSheetsAPI("deleteProduct", { productId });
  return res && res.success;
}
