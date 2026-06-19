"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Check, AlertTriangle, ExternalLink, Calendar, User, Phone, MapPin, CreditCard, Ship } from "lucide-react";
import { 
  isSheetsConfigured, 
  fetchOrdersFromSheet, 
  updateOrderStatusInSheet 
} from "@/lib/sheets";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  shippingName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
}

function parseProductsString(prodStr: string): OrderItem[] {
  if (!prodStr) return [];
  const PRODUCT_IMAGE_MAP: Record<string, string> = {
    "Salted Banana Chips": "/Product Image/Salted Banana Mockup-01.png",
    "Tomato Banana Chips": "/Product Image/Tomato Banana Mockup-02.png",
    "Peri-Peri Banana Chips": "/Product Image/Peri-Peri Banana Mockup-03.png",
    "Pudina Banana Chips": "/Product Image/Pudina Banana Mockup-04.png",
    "Pure Cow Ghee": "/Product Image/Cow Ghee Mockup-05.png",
    "Wood-Pressed Groundnut Oil": "/Product Image/Groundnut Oil Mockup-06.png",
    "Wood-Pressed Coconut Oil": "/Product Image/Groundnut Oil Mockup-06.png"
  };

  return prodStr.split(", ").map((part, index) => {
    const match = part.trim().match(/^(\d+)x (.*?) \(₹(\d+)\)$/);
    if (match) {
      const qty = parseInt(match[1]);
      const fullName = match[2];
      const price = parseFloat(match[3]);
      
      let img = "/Product Image/Salted Banana Mockup-01.png";
      for (const name in PRODUCT_IMAGE_MAP) {
        if (fullName.includes(name)) {
          img = PRODUCT_IMAGE_MAP[name];
          break;
        }
      }
      
      return {
        id: `item-${index}`,
        quantity: qty,
        price: price,
        product: {
          name: fullName,
          image: img
        }
      };
    }
    return {
      id: `item-${index}`,
      quantity: 1,
      price: 0,
      product: {
        name: part,
        image: "/Product Image/Salted Banana Mockup-01.png"
      }
    };
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    let ordersData: Order[] = [];

    // 1. Google Sheets Sync
    if (isSheetsConfigured()) {
      try {
        const sheetOrders = await fetchOrdersFromSheet("");
        if (sheetOrders) {
          ordersData = sheetOrders.map((o: any) => ({
            id: o.OrderID || o.id || "",
            shippingName: o.CustomerName || o.shippingName || "Customer",
            phone: o.Phone || o.phone || "",
            shippingAddress: o.Address || o.shippingAddress || "",
            totalAmount: parseFloat(o.TotalAmount || o.total || "0"),
            status: (o.Status || o.status || "PENDING") as any,
            paymentStatus: o.PaymentStatus || o.paymentStatus || "PENDING",
            paymentMethod: o.PaymentMethod || o.paymentMethod || "COD",
            createdAt: o.Timestamp || o.date || new Date().toISOString(),
            items: parseProductsString(o.OrderedProducts || o.products || ""),
            user: {
              name: o.CustomerName || "Customer",
              email: o.UserEmail || "anonymous",
            }
          }));
        }
      } catch (err) {
        console.error("Failed to load orders from Google Sheets:", err);
      }
    }

    // 2. LocalStorage Fallback
    if (ordersData.length === 0) {
      try {
        const localOrdersStr = localStorage.getItem("zerothi_orders");
        if (localOrdersStr) {
          const allLocalOrders = JSON.parse(localOrdersStr);
          ordersData = allLocalOrders.map((o: any) => ({
            id: o.id,
            shippingName: o.shippingDetails?.name || o.shippingName || "Customer",
            phone: o.shippingDetails?.phone || o.phone || "",
            shippingAddress: o.shippingDetails 
              ? `${o.shippingDetails.address}, ${o.shippingDetails.city} - ${o.shippingDetails.postalCode}`
              : o.shippingAddress || "",
            totalAmount: o.total || o.totalAmount || 0,
            status: o.status || "PENDING",
            paymentStatus: o.paymentStatus || "PENDING",
            paymentMethod: o.paymentMethod || "Cash on Delivery (COD)",
            createdAt: o.date || o.createdAt || new Date().toISOString(),
            items: (o.items || []).map((item: any, idx: number) => ({
              id: item.id || `item-${idx}`,
              quantity: item.quantity || 1,
              price: item.price || 0,
              product: {
                name: item.name || "Product",
                image: item.image || "/placeholder.png"
              }
            })),
            user: {
              name: o.shippingDetails?.name || "Customer",
              email: o.userEmail || "anonymous"
            }
          }));
        }
      } catch (err) {
        console.error("Local storage orders parse error:", err);
      }
    }

    setOrders(ordersData);
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId);

    // Sheets Update
    if (isSheetsConfigured()) {
      try {
        const success = await updateOrderStatusInSheet(orderId, status);
        if (success) {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
          );
        }
      } catch (err) {
        console.error("Sheets update failed:", err);
      }
    }

    // Local Storage Fallback
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const allLocalOrders = JSON.parse(localOrdersStr);
        const updated = allLocalOrders.map((o: any) => {
          if (o.id === orderId) {
            return { ...o, status };
          }
          return o;
        });
        localStorage.setItem("zerothi_orders", JSON.stringify(updated));
        
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    setActionLoading(orderId);

    // Sheets Update
    if (isSheetsConfigured()) {
      try {
        const success = await updateOrderStatusInSheet(orderId, "", paymentStatus);
        if (success) {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
          );
        }
      } catch (err) {
        console.error("Sheets payment update failed:", err);
      }
    }

    // Local Storage Fallback
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const allLocalOrders = JSON.parse(localOrdersStr);
        const updated = allLocalOrders.map((o: any) => {
          if (o.id === orderId) {
            return { ...o, paymentStatus };
          }
          return o;
        });
        localStorage.setItem("zerothi_orders", JSON.stringify(updated));
        
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-white font-cinzel text-xl font-bold tracking-wide">Manage Orders</h2>
          <p className="text-white/40 text-xs mt-1">Review pending checkouts, ship packages, and verify user transactions.</p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase rounded-lg tracking-wider transition-colors flex items-center gap-2"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search by ID, name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-gold-500 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/20 text-xs focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mr-2">Shipping:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer text-xs flex-1 py-2.5"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mr-2">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer text-xs flex-1 py-2.5"
          >
            <option value="ALL">All Payments</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* Main content or Spinner */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-white/40 text-sm font-light border border-white/5 rounded-2xl bg-black/40">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar border border-white/5 rounded-2xl bg-black/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase font-bold tracking-wider bg-white/[0.02]">
                <th className="py-4 px-4">Order ID & Date</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Items Ordered</th>
                <th className="py-4 px-4">Pricing</th>
                <th className="py-4 px-4">Payment Info</th>
                <th className="py-4 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  {/* Order ID & Date */}
                  <td className="py-5 px-4 space-y-1.5 align-top">
                    <span className="font-semibold text-white block text-sm">#{order.id}</span>
                    <span className="text-white/40 text-[10px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </td>

                  {/* Customer Details */}
                  <td className="py-5 px-4 space-y-1 align-top">
                    <span className="text-white block font-semibold text-sm flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold-400" />
                      {order.shippingName}
                    </span>
                    <span className="text-white/40 text-[10px] block font-mono">{order.user.email}</span>
                    <span className="text-white/40 text-[10px] block flex items-center gap-1">
                      <Phone className="w-3 h-3 text-white/30" /> {order.phone}
                    </span>
                    <span className="text-white/40 text-[10px] block max-w-xs flex items-start gap-1 leading-normal">
                      <MapPin className="w-3 h-3 text-white/30 flex-shrink-0 mt-0.5" />
                      {order.shippingAddress}
                    </span>
                  </td>

                  {/* Items Ordered */}
                  <td className="py-5 px-4 align-top">
                    <div className="space-y-1 text-white/70 max-w-xs">
                      {order.items.map((item, idx) => (
                        <div key={item.id} className="flex justify-between items-center gap-4 text-[11px] py-0.5 border-b border-white/5 last:border-b-0">
                          <span className="truncate block flex-1 font-medium">{item.product.name}</span>
                          <span className="text-gold-400 font-bold flex-shrink-0">x{item.quantity}</span>
                          <span className="text-white/40 text-[10px] flex-shrink-0">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="py-5 px-4 align-top">
                    <span className="font-bold text-gold-400 text-sm font-medium block mt-0.5">₹{order.totalAmount}</span>
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">{order.paymentMethod}</span>
                  </td>

                  {/* Payment Status Dropdown */}
                  <td className="py-5 px-4 align-top">
                    <div className="space-y-1">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                        disabled={actionLoading === order.id}
                        className="bg-black/50 border border-white/10 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer disabled:opacity-50 text-[11px]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                      </select>
                      <span className={`text-[8px] font-bold uppercase block text-center py-0.5 px-1.5 rounded tracking-wide ${
                        order.paymentStatus === "PAID" 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Delivery Status Dropdown */}
                  <td className="py-5 px-4 align-top">
                    <div className="space-y-1">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        disabled={actionLoading === order.id}
                        className="bg-black/50 border border-white/10 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer disabled:opacity-50 text-[11px]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <span className={`text-[8px] font-bold uppercase block text-center py-0.5 px-1.5 rounded tracking-wide ${
                        order.status === "DELIVERED" 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                          : order.status === "CANCELLED"
                          ? "bg-red-500/10 border border-red-500/20 text-red-400"
                          : "bg-gold-500/10 border border-gold-500/20 text-gold-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
