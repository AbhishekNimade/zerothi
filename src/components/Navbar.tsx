"use client";

import { ShoppingBag, Menu, X, Heart, Plus, Minus, Trash2, LogOut, ShieldAlert, ShoppingCart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, logout, loading } = useAuth();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { likedIds } = useLikes();

  return (
    <>
      <nav className="fixed w-full z-40 top-0 transition-all duration-500 bg-black/20 backdrop-blur-2xl border-b border-white/[0.06] selection:bg-gold-500/30" style={{ WebkitBackdropFilter: "blur(32px)", backdropFilter: "blur(32px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center h-full">
              <Link href="/" className="flex-shrink-0 flex items-center h-full py-2">
                <Image 
                  src="/Logo%20Zerothi/Small%20Logo%20Zerothi-03.png" 
                  alt="Zerothi Logo" 
                  width={220} 
                  height={80} 
                  className="h-16 md:h-20 w-auto object-contain"
                  priority
                />
              </Link>
            </div>
            {/* Right Side: Links and Actions */}
            <div className="hidden md:flex items-center space-x-6 md:space-x-10 max-md:!hidden">
              
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8 max-md:!hidden">
                 <Link href="/" className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors uppercase text-xs tracking-[0.2em] font-semibold">Home</Link>
                 <Link href="/about" className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors uppercase text-xs tracking-[0.2em] font-semibold">Our Story</Link>
                 <Link href="/products" className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors uppercase text-xs tracking-[0.2em] font-semibold">Shop</Link>
                 <Link href="/hamper" className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors uppercase text-xs tracking-[0.2em] font-semibold">Custom Hamper</Link>
                 <Link href="/contact" className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors uppercase text-xs tracking-[0.2em] font-semibold">Contact</Link>
              </div>

              {/* Icons & Auth Section */}
              <div className="flex items-center space-x-6">
                {/* Shopping Bag Icon */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-white/80 hover:text-gold-400 transition-colors relative focus:outline-none cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Auth Dropdown / Login */}
                {loading ? (
                  null
                ) : user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 border border-gold-500/20 hover:border-gold-500/60 rounded-full transition-all bg-gold-500/5 text-gold-300 text-xs tracking-wider uppercase font-semibold focus:outline-none cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      {user.name.split(" ")[0]}
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-52 rounded-xl bg-black border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50"
                        >
                          <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-white text-xs font-semibold">{user.name}</p>
                            <p className="text-white/40 text-[10px] truncate mt-0.5">{user.email}</p>
                          </div>

                          {user.role === "ADMIN" && (
                            <Link 
                              href="/admin" 
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-400 hover:bg-white/5 transition-colors font-medium"
                            >
                              <ShieldAlert className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}

                          <Link 
                            href="/orders" 
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/80 hover:bg-white/5 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" /> My Orders
                          </Link>

                          <button 
                            onClick={() => {
                              logout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors border-t border-white/5 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" /> Log Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="px-6 py-2.5 text-xs font-semibold border border-gold-500/50 hover:bg-gold-500/10 text-gold-400 hover:text-gold-300 transition-all rounded-sm uppercase tracking-[0.15em] cursor-pointer">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Actions: Cart & Hamburger */}
            <div className="flex items-center md:hidden gap-3">
              {/* Mobile Shopping Bag */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-white/80 hover:text-gold-400 transition-colors relative focus:outline-none cursor-pointer p-2"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/80 hover:text-gold-400 focus:outline-none transition-colors cursor-pointer p-2"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                 <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold">Home</Link>
                 <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold">Our Story</Link>
                 <Link href="/products" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold">Shop</Link>
                 <Link href="/hamper" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold">Custom Hamper</Link>
                 <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold">Contact</Link>
                <Link href="/products?filter=liked" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Favorites ({likedIds.length})
                </Link>

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full text-left px-3 py-3 text-white/80 hover:text-gold-400 uppercase text-xs tracking-wider font-semibold flex items-center justify-between cursor-pointer focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gold-400" /> Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-gold-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </button>

                <div className="border-t border-white/5 mt-4 pt-4 px-3">
                  {user ? (
                    <div className="space-y-3">
                      <p className="text-white/60 text-xs">Logged in as <span className="text-gold-400 font-semibold">{user.name}</span></p>
                      {user.role === "ADMIN" && (
                        <Link 
                          href="/admin" 
                          onClick={() => setIsOpen(false)}
                          className="block text-xs text-amber-400 font-medium py-1"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link 
                        href="/orders" 
                        onClick={() => setIsOpen(false)}
                        className="block text-xs text-white/80 py-1"
                      >
                        My Orders
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="text-xs text-red-400 font-medium py-1 text-left flex items-center gap-2 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 text-xs font-semibold border border-gold-500/50 text-gold-400 rounded-sm uppercase tracking-wider text-center cursor-pointer">
                        Login
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar slide-over drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />

            {/* Sidebar container */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#070707] border-l border-white/10 z-50 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col selection:bg-gold-500/30"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gold-400" />
                  <span className="font-cinzel text-lg font-bold text-white tracking-wide">Your Cart</span>
                  <span className="text-white/40 text-xs">({cartCount} items)</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gold-500/5 border border-gold-500/25 flex items-center justify-center text-gold-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">Your cart is empty</p>
                      <p className="text-white/40 text-sm mt-1 max-w-[240px] mx-auto font-light">
                        Add some delicious Nimar flavors to start ordering.
                      </p>
                    </div>
                    <Link href="/products" onClick={() => setIsCartOpen(false)}>
                      <button className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase text-xs tracking-wider transition-colors rounded-sm cursor-pointer mt-2">
                        Shop Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-white font-medium text-sm line-clamp-1">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/40 hover:text-red-400 transition-colors cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-gold-400 text-xs font-semibold mt-1">₹{item.price}</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-white/10 rounded-sm bg-black/50 overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs text-white font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-white/60 text-xs">Total: ₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black/40 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white font-bold text-lg">₹{cartTotal}</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-light">
                    Shipping & taxes are calculated at checkout.
                  </p>
                  
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    <button className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-colors rounded-sm cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      Proceed To Checkout
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
