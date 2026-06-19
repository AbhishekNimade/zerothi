/**
 * Google Apps Script for "Zerothi - Master MGMT" Spreadsheet
 * Deploys as a Web App to act as a secure backend database proxy.
 *
 * Setup:
 * 1. Open your Spreadsheet: https://docs.google.com/spreadsheets/d/1Gm_LmWJ-i7bWL0RusE8q1xM3pYDM8D8vURxy-OcJEe4
 * 2. Click Extensions -> Apps Script.
 * 3. Delete any default code, paste this script, and click Save.
 * 4. Click Deploy -> New deployment.
 * 5. Select type "Web app".
 * 6. Set "Execute as": Me.
 * 7. Set "Who has access": Anyone.
 * 8. Click Deploy, authorize permissions, and copy the "Web app URL" (e.g. https://script.google.com/macros/s/.../exec).
 * 9. Paste this URL into your Zerothi Admin settings panel!
 */

// Handles CORS response formatting
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET Requests: Fetching Data
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
          // Filter by customer email if specified
          if (!email || order.userEmail === email) {
            orders.push(order);
          }
        }
      }
      // Sort orders descending by date
      orders.reverse();
      return jsonResponse({ success: true, data: orders });
    }
    
    return jsonResponse({ success: false, error: "Invalid action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// POST Requests: Submitting Data
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
      // Headers: Timestamp, Name, Email, LoginMethod
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
      // Headers: OrderID, Timestamp, CustomerName, Phone, Address, PINCode, State, OrderedProducts, Subtotal, Shipping, TotalAmount, Status, PaymentMethod, PaymentStatus, UserEmail
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
            
            // Match name (allow partial match, e.g., "Salted Banana Chips (100g)" matches "Salted Banana Chips")
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
        if (data[i][0] === orderId) { // Column A: OrderID
          if (status) {
            ordSheet.getRange(i + 1, 12).setValue(status); // Column L: Status (12th column)
          }
          if (paymentStatus) {
            ordSheet.getRange(i + 1, 14).setValue(paymentStatus); // Column N: Payment Status (14th column)
          }
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "Order ID not found" });
    }
    
    if (action === "addProduct") {
      var prodSheet = getOrCreateSheet(sheet, "Products");
      var data = prodSheet.getDataRange().getValues();
      
      // Auto-generate numeric id
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
          if (postData.sku !== undefined) prodSheet.getRange(i + 1, 2).setValue(postData.sku); // Column B
          if (postData.name !== undefined) prodSheet.getRange(i + 1, 3).setValue(postData.name); // Column C
          if (postData.slug !== undefined) prodSheet.getRange(i + 1, 4).setValue(postData.slug); // Column D
          if (postData.category !== undefined) prodSheet.getRange(i + 1, 5).setValue(postData.category); // Column E
          if (postData.price !== undefined) prodSheet.getRange(i + 1, 6).setValue(Number(postData.price)); // Column F
          if (postData.originalPrice !== undefined) prodSheet.getRange(i + 1, 7).setValue(Number(postData.originalPrice)); // Column G
          if (postData.stock !== undefined) prodSheet.getRange(i + 1, 8).setValue(Number(postData.stock)); // Column H
          if (postData.rating !== undefined) prodSheet.getRange(i + 1, 9).setValue(Number(postData.rating)); // Column I
          if (postData.status !== undefined) prodSheet.getRange(i + 1, 10).setValue(postData.status); // Column J
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

// Utility: Returns active tab, creates it with default headers if missing
function getOrCreateSheet(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    // Auto-populate Products headers if creating Products sheet
    if (name === "Products") {
      sheet.appendRow(["id", "sku", "name", "slug", "category", "price", "originalPrice", "stock", "rating", "status"]);
      // Add default Zerothi products
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
}
