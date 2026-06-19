"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Archive,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  isSheetsConfigured, 
  fetchProductsFromSheet, 
  updateProductInSheet,
  addProductToSheet,
  deleteProductFromSheet
} from "@/lib/sheets";

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  status: string; // "ACTIVE" or "INACTIVE"
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", sku: "CHIPS-SALT-200", name: "Salted Banana Chips", slug: "salted-banana-chips", category: "BANANA_CHIPS", price: 80, originalPrice: 100, stock: 250, image: "/Product Image/Salted Banana Mockup-01.png", status: "ACTIVE" },
  { id: "2", sku: "CHIPS-TOM-200", name: "Tomato Banana Chips", slug: "tomato-banana-chips", category: "BANANA_CHIPS", price: 90, originalPrice: 110, stock: 200, image: "/Product Image/Tomato Banana Mockup-02.png", status: "ACTIVE" },
  { id: "3", sku: "CHIPS-PERI-200", name: "Peri-Peri Banana Chips", slug: "peri-peri-banana-chips", category: "BANANA_CHIPS", price: 95, originalPrice: 120, stock: 150, image: "/Product Image/Peri-Peri Banana Mockup-03.png", status: "ACTIVE" },
  { id: "4", sku: "CHIPS-PUD-200", name: "Pudina Banana Chips", slug: "pudina-banana-chips", category: "BANANA_CHIPS", price: 85, originalPrice: 105, stock: 180, image: "/Product Image/Pudina Banana Mockup-04.png", status: "ACTIVE" },
  { id: "5", sku: "GHEE-COW-500", name: "Pure Cow Ghee", slug: "pure-cow-ghee", category: "COW_GHEE", price: 1100, originalPrice: 1300, stock: 150, image: "/Product Image/Cow Ghee Mockup-05.png", status: "ACTIVE" },
  { id: "6", sku: "OIL-GND-1L", name: "Wood-Pressed Groundnut Oil", slug: "wood-pressed-groundnut-oil", category: "OIL", price: 450, originalPrice: 550, stock: 100, image: "/Product Image/Groundnut Oil Mockup-06.png", status: "ACTIVE" },
  { id: "7", sku: "OIL-COC-1L", name: "Wood-Pressed Coconut Oil", slug: "wood-pressed-coconut-oil", category: "OIL", price: 380, originalPrice: 450, stock: 80, image: "/Product Image/Groundnut Oil Mockup-06.png", status: "ACTIVE" }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add Product Modal & Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addSku, setAddSku] = useState("");
  const [addCategory, setAddCategory] = useState("BANANA_CHIPS");
  const [addPrice, setAddPrice] = useState("");
  const [addOriginalPrice, setAddOriginalPrice] = useState("");
  const [addStock, setAddStock] = useState("");
  const [addStatus, setAddStatus] = useState("ACTIVE");
  const [modalLoading, setModalLoading] = useState(false);

  // Form states for editing products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editOriginalPrice, setEditOriginalPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");
  const [editSku, setEditSku] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    let productsData: Product[] = [];

    // 1. Google Sheets Load
    if (isSheetsConfigured()) {
      try {
        const sheetProducts = await fetchProductsFromSheet();
        if (sheetProducts && sheetProducts.length > 0) {
          productsData = sheetProducts.map((sp: any) => {
            const matched = DEFAULT_PRODUCTS.find((p) => p.slug === sp.slug || p.id === sp.id.toString());
            return {
              id: sp.id?.toString() || matched?.id || sp.slug,
              sku: sp.sku || matched?.sku || ("SKU-" + sp.id),
              name: sp.name || matched?.name || "",
              slug: sp.slug,
              category: sp.category || matched?.category || "BANANA_CHIPS",
              price: Number(sp.price),
              originalPrice: Number(sp.originalPrice) || Math.round(Number(sp.price) * 1.2),
              stock: Number(sp.stock),
              image: matched?.image || "/placeholder.png",
              status: sp.status || "ACTIVE"
            };
          });
        }
      } catch (err) {
        console.error("Failed to load products from Google Sheets:", err);
      }
    }

    // 2. LocalStorage fallback
    if (productsData.length === 0) {
      try {
        let localProducts = localStorage.getItem("zerothi_products");
        if (!localProducts) {
          localStorage.setItem("zerothi_products", JSON.stringify(DEFAULT_PRODUCTS));
          productsData = DEFAULT_PRODUCTS;
        } else {
          productsData = JSON.parse(localProducts).map((lp: any) => {
            const matched = DEFAULT_PRODUCTS.find(p => p.slug === lp.slug);
            return {
              id: lp.id || matched?.id || lp.slug,
              sku: lp.sku || matched?.sku || "SKU-GEN",
              name: lp.name || matched?.name || "",
              slug: lp.slug,
              category: lp.category || matched?.category || "BANANA_CHIPS",
              price: Number(lp.price),
              originalPrice: Number(lp.originalPrice) || Math.round(Number(lp.price) * 1.2),
              stock: Number(lp.stock),
              image: lp.image || matched?.image || "/placeholder.png",
              status: lp.status || "ACTIVE"
            };
          });
        }
      } catch (err) {
        console.error("Local storage products error:", err);
        productsData = DEFAULT_PRODUCTS;
      }
    }

    setProducts(productsData);
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addPrice || !addStock || !addSku) return;

    setModalLoading(true);
    const slug = addName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const nextProd = {
      sku: addSku,
      name: addName,
      slug: slug,
      category: addCategory,
      price: parseFloat(addPrice),
      originalPrice: parseFloat(addOriginalPrice || addPrice),
      stock: parseInt(addStock),
      status: addStatus
    };

    // Google Sheets Sync
    if (isSheetsConfigured()) {
      try {
        await addProductToSheet(nextProd);
      } catch (e) {
        console.error("Sheets product add error:", e);
      }
    }

    // LocalStorage Sync
    try {
      const localProductsStr = localStorage.getItem("zerothi_products");
      const localList = localProductsStr ? JSON.parse(localProductsStr) : [...DEFAULT_PRODUCTS];
      const newlyAdded = {
        id: (localList.length + 1).toString(),
        ...nextProd,
        image: "/placeholder.png"
      };
      localList.push(newlyAdded);
      localStorage.setItem("zerothi_products", JSON.stringify(localList));
    } catch (e) {
      console.error(e);
    }

    setShowAddModal(false);
    setModalLoading(false);
    // Reset Form Fields
    setAddName("");
    setAddSku("");
    setAddPrice("");
    setAddOriginalPrice("");
    setAddStock("");
    setAddStatus("ACTIVE");
    loadProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setActionLoading(productId);

    // Google Sheets Delete
    if (isSheetsConfigured()) {
      try {
        await deleteProductFromSheet(productId);
      } catch (e) {
        console.error("Sheets product delete error:", e);
      }
    }

    // LocalStorage Sync
    try {
      const localProductsStr = localStorage.getItem("zerothi_products");
      if (localProductsStr) {
        const localList = JSON.parse(localProductsStr);
        const updated = localList.filter((p: any) => p.id !== productId && p.id !== productId.toString());
        localStorage.setItem("zerothi_products", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }

    setActionLoading(null);
    loadProducts();
  };

  const handleSaveProduct = async (productId: string) => {
    setActionLoading(productId);
    const priceVal = parseFloat(editPrice);
    const originalPriceVal = parseFloat(editOriginalPrice) || priceVal;
    const stockVal = parseInt(editStock);

    const updateFields = {
      sku: editSku,
      name: editName,
      category: editCategory,
      price: priceVal,
      originalPrice: originalPriceVal,
      stock: stockVal,
      status: editStatus
    };

    // Google Sheets Sync
    if (isSheetsConfigured()) {
      try {
        const success = await updateProductInSheet(productId, updateFields);
        if (success) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === productId ? { ...p, ...updateFields } : p
            )
          );
        }
      } catch (err) {
        console.error("Sheets product update failed:", err);
      }
    }

    // LocalStorage Sync
    try {
      const localProductsStr = localStorage.getItem("zerothi_products");
      if (localProductsStr) {
        const localProducts = JSON.parse(localProductsStr);
        const updated = localProducts.map((p: any) => {
          if (p.id === productId || p.id === productId.toString()) {
            return { ...p, ...updateFields };
          }
          return p;
        });
        localStorage.setItem("zerothi_products", JSON.stringify(updated));
        
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, ...updateFields } : p
          )
        );
        setEditingProductId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price.toString());
    setEditOriginalPrice(p.originalPrice ? p.originalPrice.toString() : p.price.toString());
    setEditStock(p.stock.toString());
    setEditSku(p.sku || "");
    setEditName(p.name);
    setEditCategory(p.category);
    setEditStatus(p.status || "ACTIVE");
  };

  // Filter products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-white font-cinzel text-xl font-bold tracking-wide">Product Inventory</h2>
          <p className="text-white/40 text-xs mt-1">Manage pricing details, live status switches, inventory stocks, and catalog tags.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={loadProducts}
            className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-lg tracking-wider transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search by SKU, name or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-gold-500 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/20 text-xs focus:outline-none"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-1">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-white/40" />
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mr-2">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer text-xs flex-1 py-2.5"
          >
            <option value="ALL">All Categories</option>
            <option value="BANANA_CHIPS">Banana Chips</option>
            <option value="COW_GHEE">Pure Cow Ghee</option>
            <option value="OIL">Wood-Pressed Oil</option>
          </select>
        </div>

        {/* Status Selector */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mr-2">Visibility:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer text-xs flex-1 py-2.5"
          >
            <option value="ALL">All Products</option>
            <option value="ACTIVE">ACTIVE Only</option>
            <option value="INACTIVE">INACTIVE Only</option>
          </select>
        </div>
      </div>

      {/* Main product catalog display */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-white/40 text-sm font-light border border-white/5 rounded-2xl bg-black/40">
          No catalog items found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((p) => {
            const isEditing = editingProductId === p.id;

            return (
              <div 
                key={p.id} 
                className={`glass-card p-6 rounded-2xl border transition-all ${
                  isEditing 
                    ? "border-gold-500 bg-zinc-950/80 shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                    : p.status === "INACTIVE" 
                    ? "border-white/5 bg-black/25 opacity-70"
                    : "border-white/5 bg-black/45 hover:border-white/10"
                } flex gap-4 items-center`}
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-neutral-950 rounded-xl overflow-hidden border border-white/10 relative flex-shrink-0 flex items-center justify-center">
                  <Image src={p.image || "/placeholder.png"} alt={p.name} fill className="object-contain p-2" />
                </div>

                {/* Edit Form / Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">Product Name</label>
                          <input 
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">SKU Code</label>
                          <input 
                            type="text"
                            value={editSku}
                            onChange={(e) => setEditSku(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">Category</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-1.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          >
                            <option value="BANANA_CHIPS">Banana Chips</option>
                            <option value="COW_GHEE">Cow Ghee</option>
                            <option value="OIL">Wood-Pressed Oil</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">Discount Price (₹)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">Print Price (₹)</label>
                          <input
                            type="number"
                            value={editOriginalPrice}
                            onChange={(e) => setEditOriginalPrice(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-white/40 uppercase font-bold tracking-wider">Stock Qty</label>
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Catalog Visibility</span>
                        <button
                          type="button"
                          onClick={() => setEditStatus(editStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                          className="text-white focus:outline-none cursor-pointer flex items-center gap-1.5 hover:text-gold-400 transition-colors"
                        >
                          {editStatus === "ACTIVE" ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><ToggleRight className="w-5 h-5 text-emerald-400" /> ACTIVE (Live)</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-white/40 font-medium"><ToggleLeft className="w-5 h-5 text-white/30" /> INACTIVE (Hidden)</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded">{p.category}</span>
                        <span className="text-white/30 text-[9px] font-mono">SKU: {p.sku || "N/A"}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ml-auto ${p.status === "INACTIVE" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
                          {p.status || "ACTIVE"}
                        </span>
                      </div>
                      <h4 className="text-white text-base font-semibold truncate leading-tight">{p.name}</h4>
                      
                      <div className="flex gap-8 text-[11px] border-t border-white/5 pt-1.5">
                        <div>
                          <span className="text-white/40 block text-[9px] uppercase tracking-wider">Retail Price</span>
                          <span className="text-gold-400 font-bold text-sm">₹{p.price}</span>
                          <span className="text-white/30 line-through text-[9px] ml-1.5 font-light">₹{p.originalPrice}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px] uppercase tracking-wider">Available Stock</span>
                          <span className={`font-semibold text-xs ${p.stock < 10 ? "text-red-400" : "text-white/80"}`}>
                            {p.stock} units
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex flex-col gap-2 justify-center flex-shrink-0 ml-2">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSaveProduct(p.id)}
                        disabled={actionLoading === p.id}
                        className="w-10 h-10 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                        title="Save Changes"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(p)}
                        disabled={actionLoading === p.id}
                        className="px-4 py-2 border border-gold-500/50 hover:bg-gold-500 hover:text-black text-gold-400 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        disabled={actionLoading === p.id}
                        className="p-2 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 rounded transition-all cursor-pointer disabled:opacity-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-8 rounded-2xl border border-white/10 bg-zinc-950 text-white space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Archive className="w-5 h-5 text-gold-500" /> Add Product Item
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Product Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Salted Banana Chips"
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">SKU Code</label>
                    <input 
                      type="text"
                      placeholder="e.g. CHIPS-SALT-200"
                      value={addSku}
                      onChange={(e) => setAddSku(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Category</label>
                    <select
                      value={addCategory}
                      onChange={(e) => setAddCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="BANANA_CHIPS">Banana Chips</option>
                      <option value="COW_GHEE">Pure Cow Ghee</option>
                      <option value="OIL">Wood-Pressed Oil</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Status</label>
                    <select
                      value={addStatus}
                      onChange={(e) => setAddStatus(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE (Render on site)</option>
                      <option value="INACTIVE">INACTIVE (Hide from site)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Price (₹)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 80"
                      value={addPrice}
                      onChange={(e) => setAddPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Original Price (₹)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 100"
                      value={addOriginalPrice}
                      onChange={(e) => setAddOriginalPrice(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/60 uppercase font-bold tracking-wider block">Initial Stock</label>
                    <input 
                      type="number"
                      placeholder="e.g. 150"
                      value={addStock}
                      onChange={(e) => setAddStock(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-gold-500 rounded-lg py-3 px-4 text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-white/10 hover:border-white/20 text-white rounded-lg uppercase tracking-wider font-bold text-center cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-black rounded-lg uppercase tracking-wider font-bold text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    {modalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
