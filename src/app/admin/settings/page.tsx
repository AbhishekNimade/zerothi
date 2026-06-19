"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, 
  Settings, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";
import { 
  isSheetsConfigured, 
  fetchProductsFromSheet 
} from "@/lib/sheets";

const APPS_SCRIPT_SOURCE = `/**
 * Google Apps Script for "Zerothi - Master MGMT" Spreadsheet
 * Deploys as a Web App to act as a secure database proxy.
 */

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === "getProducts") {
      var prodSheet = getOrCreateSheet(sheet, "Products");
      var data = prodSheet.getDataRange().getValues();
      var products = [];
      
      if (data.length > 1) {
        var headers = data[0];
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var product = {};
          for (var j = 0; j < headers.length; j++) {
            product[headers[j]] = row[j];
          }
          products.push(product);
        }
      }
      return jsonResponse({ success: true, data: products });
    }
    
    if (action === "getOrders") {
      var email = e.parameter.email;
      var ordSheet = getOrCreateSheet(sheet, "Orders");
      var data = ordSheet.getDataRange().getValues();
      var orders = [];
      
      if (data.length > 1) {
        var headers = data[0];
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var order = {};
          for (var j = 0; j < headers.length; j++) {
            order[headers[j]] = row[j];
          }
          if (!email || order.userEmail === email) {
            orders.push(order);
          }
        }
      }
      orders.reverse();
      return jsonResponse({ success: true, data: orders });
    }
    
    return jsonResponse({ success: false, error: "Invalid action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var postData;
  
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: "Invalid JSON body" });
  }
  
  var action = postData.action;
  
  try {
    if (action === "addLogin") {
      var loginSheet = getOrCreateSheet(sheet, "Logins");
      if (loginSheet.getLastRow() === 0) {
        loginSheet.appendRow(["Timestamp", "Name", "Email", "LoginMethod"]);
      }
      loginSheet.appendRow([
        postData.timestamp || new Date().toISOString(),
        postData.name || "",
        postData.email || "",
        postData.method || ""
      ]);
      return jsonResponse({ success: true });
    }
    
    if (action === "addOrder") {
      var ordSheet = getOrCreateSheet(sheet, "Orders");
      if (ordSheet.getLastRow() === 0) {
        ordSheet.appendRow([
          "OrderID", "Timestamp", "CustomerName", "Phone", "Address", "PINCode", 
          "State", "OrderedProducts", "Subtotal", "Shipping", "TotalAmount", 
          "Status", "PaymentMethod", "PaymentStatus", "UserEmail"
        ]);
      }
      ordSheet.appendRow([
        postData.id || "",
        postData.date || new Date().toISOString(),
        postData.customerName || "",
        postData.phone || "",
        postData.address || "",
        postData.pinCode || "",
        postData.state || "Madhya Pradesh",
        postData.products || "",
        postData.subtotal || 0,
        postData.shipping || 0,
        postData.totalAmount || 0,
        postData.status || "PENDING",
        postData.paymentMethod || "COD",
        postData.paymentStatus || "PENDING",
        postData.userEmail || ""
      ]);

      // Automatically deduct product stock from Products sheet dynamically
      if (postData.items && Array.isArray(postData.items)) {
        var prodSheet = getOrCreateSheet(sheet, "Products");
        var prodData = prodSheet.getDataRange().getValues();
        
        for (var k = 0; k < postData.items.length; k++) {
          var orderItem = postData.items[k];
          var orderItemName = orderItem.name || "";
          var orderItemQty = parseInt(orderItem.quantity) || 0;
          
          for (var i = 1; i < prodData.length; i++) {
            var sheetProdName = prodData[i][2]; // Name (col 2)
            var sheetProdSlug = prodData[i][3]; // Slug (col 3)
            
            if (orderItemName.indexOf(sheetProdName) !== -1 || sheetProdName.indexOf(orderItemName) !== -1 || orderItemName.indexOf(sheetProdSlug) !== -1) {
              var currentStock = parseInt(prodData[i][7]) || 0; // Stock (col 7)
              var newStock = Math.max(0, currentStock - orderItemQty);
              prodSheet.getRange(i + 1, 8).setValue(newStock); // Update Stock (Column H)
              break;
            }
          }
        }
      }

      return jsonResponse({ success: true });
    }
    
    if (action === "updateOrderStatus") {
      var ordSheet = getOrCreateSheet(sheet, "Orders");
      var data = ordSheet.getDataRange().getValues();
      var orderId = postData.orderId;
      var status = postData.status;
      var paymentStatus = postData.paymentStatus;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === orderId) {
          if (status) {
            ordSheet.getRange(i + 1, 12).setValue(status);
          }
          if (paymentStatus) {
            ordSheet.getRange(i + 1, 14).setValue(paymentStatus);
          }
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "Order ID not found" });
    }
    
    if (action === "addProduct") {
      var prodSheet = getOrCreateSheet(sheet, "Products");
      var data = prodSheet.getDataRange().getValues();
      
      var nextId = 1;
      for (var i = 1; i < data.length; i++) {
        var cid = parseInt(data[i][0]);
        if (!isNaN(cid) && cid >= nextId) {
          nextId = cid + 1;
        }
      }

      prodSheet.appendRow([
        nextId.toString(),
        postData.sku || ("SKU-" + nextId),
        postData.name || "New Product",
        postData.slug || ("new-product-" + nextId),
        postData.category || "BANANA_CHIPS",
        Number(postData.price || 0),
        Number(postData.originalPrice || 0),
        Number(postData.stock || 0),
        Number(postData.rating || 4.8),
        postData.status || "ACTIVE"
      ]);
      return jsonResponse({ success: true, id: nextId.toString() });
    }

    if (action === "deleteProduct") {
      var prodSheet = getOrCreateSheet(sheet, "Products");
      var data = prodSheet.getDataRange().getValues();
      var productId = postData.productId;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === productId || data[i][0] === productId.toString()) {
          prodSheet.deleteRow(i + 1);
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "Product not found" });
    }

    if (action === "updateProduct") {
      var prodSheet = getOrCreateSheet(sheet, "Products");
      var data = prodSheet.getDataRange().getValues();
      var productId = postData.productId;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === productId || data[i][0] === productId.toString() || data[i][3] === productId) {
          if (postData.sku !== undefined) prodSheet.getRange(i + 1, 2).setValue(postData.sku);
          if (postData.name !== undefined) prodSheet.getRange(i + 1, 3).setValue(postData.name);
          if (postData.slug !== undefined) prodSheet.getRange(i + 1, 4).setValue(postData.slug);
          if (postData.category !== undefined) prodSheet.getRange(i + 1, 5).setValue(postData.category);
          if (postData.price !== undefined) prodSheet.getRange(i + 1, 6).setValue(Number(postData.price));
          if (postData.originalPrice !== undefined) prodSheet.getRange(i + 1, 7).setValue(Number(postData.originalPrice));
          if (postData.stock !== undefined) prodSheet.getRange(i + 1, 8).setValue(Number(postData.stock));
          if (postData.rating !== undefined) prodSheet.getRange(i + 1, 9).setValue(Number(postData.rating));
          if (postData.status !== undefined) prodSheet.getRange(i + 1, 10).setValue(postData.status);
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "Product not found" });
    }
    
    return jsonResponse({ success: false, error: "Invalid action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function getOrCreateSheet(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    if (name === "Products") {
      sheet.appendRow(["id", "sku", "name", "slug", "category", "price", "originalPrice", "stock", "rating", "status"]);
      sheet.appendRow(["1", "CHIPS-SALT-200", "Salted Banana Chips", "salted-banana-chips", "BANANA_CHIPS", 80, 100, 250, 4.8, "ACTIVE"]);
      sheet.appendRow(["2", "CHIPS-TOM-200", "Tomato Banana Chips", "tomato-banana-chips", "BANANA_CHIPS", 90, 110, 200, 4.7, "ACTIVE"]);
      sheet.appendRow(["3", "CHIPS-PERI-200", "Peri-Peri Banana Chips", "peri-peri-banana-chips", "BANANA_CHIPS", 95, 120, 150, 4.9, "ACTIVE"]);
      sheet.appendRow(["4", "CHIPS-PUD-200", "Pudina Banana Chips", "pudina-banana-chips", "BANANA_CHIPS", 85, 105, 180, 4.6, "ACTIVE"]);
      sheet.appendRow(["5", "GHEE-COW-500", "Pure Cow Ghee", "pure-cow-ghee", "COW_GHEE", 1100, 1300, 150, 4.9, "ACTIVE"]);
      sheet.appendRow(["6", "OIL-GND-1L", "Wood-Pressed Groundnut Oil", "wood-pressed-groundnut-oil", "OIL", 450, 550, 100, 4.8, "ACTIVE"]);
      sheet.appendRow(["7", "OIL-COC-1L", "Wood-Pressed Coconut Oil", "wood-pressed-coconut-oil", "OIL", 380, 450, 80, 4.7, "ACTIVE"]);
    }
  }
  return sheet;
}`;

export default function AdminSettingsPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [copiedCode, setCopiedCode] = useState(false);
  const [sheetsActive, setSheetsActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUrl = localStorage.getItem("zerothi_sheet_url") || "";
      setSheetUrl(storedUrl);
      setSheetsActive(!!storedUrl);
    }
  }, []);

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    try {
      localStorage.setItem("zerothi_sheet_url", sheetUrl.trim());
      setSaveStatus("saved");
      setSheetsActive(!!sheetUrl.trim());
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    try {
      localStorage.setItem("zerothi_sheet_url", sheetUrl.trim());
      const test = await fetchProductsFromSheet();
      if (test && test.length > 0) {
        setTestStatus("success");
        setSheetsActive(true);
      } else {
        setTestStatus("error");
      }
    } catch (e) {
      setTestStatus("error");
    }
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div>
        <h2 className="text-white font-cinzel text-xl font-bold tracking-wide">Sheet Settings</h2>
        <p className="text-white/40 text-xs mt-1">Configure your Google Sheets database connections and update webhook credentials.</p>
      </div>

      {/* Sheet URL configuration card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 space-y-6">
        <div>
          <h3 className="text-white font-cinzel text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-gold-500" /> Google Sheets Integration
          </h3>
          <p className="text-white/40 text-xs mt-1 font-light">
            Configure the Google Apps Script Web App executable URL to record user logins, track customer orders, and sync product details.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
              Google Apps Script URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="url" 
                placeholder="https://script.google.com/macros/s/.../exec"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="flex-1 bg-black/50 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-white text-xs focus:outline-none"
              />
              
              <button
                onClick={handleSaveSettings}
                disabled={saveStatus === "saving"}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saveStatus === "saving" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saveStatus === "saved" ? "Saved!" : "Save Config"}
              </button>

              <button
                onClick={handleTestConnection}
                disabled={testStatus === "testing" || !sheetUrl}
                className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {testStatus === "testing" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {testStatus === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {testStatus === "error" && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                {testStatus === "idle" && <RefreshCw className="w-3.5 h-3.5" />}
                Test Link
              </button>
            </div>
          </div>

          {/* Integration notice */}
          {!sheetsActive && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-[11px] leading-relaxed flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Integration Pending Config</span>
                Google Sheets connection is currently not set up. The website is dynamically falling back to LocalStorage mode. Users can still login, checkout, and view orders safely!
              </div>
            </div>
          )}
          {sheetsActive && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[11px] leading-relaxed flex gap-3 items-start">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Sheets Database Active</span>
                Connection configured successfully. Logs, orders, and products are read and written to the sheet in real-time.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instruction manual card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-cinzel text-lg font-semibold">
              Apps Script Setup Instructions
            </h3>
            <p className="text-white/40 text-xs mt-1 font-light">
              Follow these simple steps to deploy your Google Apps Script proxy.
            </p>
          </div>
          
          <button
            onClick={handleCopyCode}
            className={`px-4 py-2 border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              copiedCode 
                ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400" 
                : "border-white/10 hover:border-white/20 text-white/70 hover:text-white"
            }`}
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? "Copied" : "Copy Code"}
          </button>
        </div>

        <div className="space-y-4 text-xs font-light text-white/70 leading-relaxed">
          <ol className="list-decimal list-inside space-y-2.5">
            <li>Open your spreadsheet: <a href="https://docs.google.com/spreadsheets/d/1Gm_LmWJ-i7bWL0RusE8q1xM3pYDM8D8vURxy-OcJEe4/edit?pli=1&gid=0#gid=0" target="_blank" rel="noreferrer" className="text-gold-400 hover:underline inline-flex items-center gap-0.5">Zerothi - Master MGMT <ExternalLink className="w-3.5 h-3.5" /></a></li>
            <li>In the top menu, click on <span className="text-white font-semibold">Extensions</span> &rarr; <span className="text-white font-semibold">Apps Script</span>.</li>
            <li>Delete any placeholder code in the script editor.</li>
            <li>Click the <span className="text-white font-semibold">Copy Code</span> button above, paste the code into the editor, and save (Ctrl+S or Cmd+S).</li>
            <li>Click the blue <span className="text-white font-semibold">Deploy</span> button at the top-right and select <span className="text-white font-semibold">New deployment</span>.</li>
            <li>Click the gear icon next to "Select type" and choose <span className="text-white font-semibold">Web app</span>.</li>
            <li>Set the Configuration fields:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-white/50 text-[11px]">
                <li>Description: <span className="text-white">Zerothi Database Proxy</span></li>
                <li>Execute as: <span className="text-white">Me (your-email)</span></li>
                <li>Who has access: <span className="text-white">Anyone</span></li>
              </ul>
            </li>
            <li>Click <span className="text-white font-semibold">Deploy</span>. Authorize the necessary Google permissions when prompted.</li>
            <li>Copy the generated <span className="text-white font-semibold">Web app URL</span> from the deployment screen and paste it into the input field above!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
