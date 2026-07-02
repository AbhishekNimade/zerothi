// Script to update all BANANA_CHIPS prices to ₹10 in Google Sheet
// Run: node scripts/update-chips-price.mjs

const SCRIPT_URL = "https://script.google.com/a/macros/zerothi.com/s/AKfycbwli0F_XNU-h43SPtixY_e_HPys0XOQUDvcmJHqxk99DU79Z8Nbhq39ufx5-HgsOXfYBw/exec";

// Chips product IDs from DB (price = ₹10, originalPrice = ₹12)
const chipsProducts = [
  { id: "8e54042c-758d-4367-b04a-225f285e4eb3", name: "Salted Banana Chips" },
  { id: "3d7a28a8-a847-4990-af39-32d2ee479525", name: "Tomato Banana Chips" },
  { id: "f7d83ede-d8dd-4332-8c01-60b6d0707459", name: "Peri-Peri Banana Chips" },
  { id: "f42b96f2-05e8-4beb-a5f8-fff9d3da4cc1", name: "Pudina Banana Chips" },
];

async function updatePriceInSheet(productId, name) {
  console.log(`\n📤 Updating "${name}" (ID: ${productId}) → ₹10...`);
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "updateProduct",
        productId,
        price: 10,
        originalPrice: 12,
      }),
    });

    if (!res.ok) {
      console.error(`  ❌ HTTP Error: ${res.status} ${res.statusText}`);
      return false;
    }

    const data = await res.json();
    if (data.success) {
      console.log(`  ✅ "${name}" updated to ₹10 in Google Sheet`);
      return true;
    } else {
      console.error(`  ❌ Sheet error:`, data.message || data);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ Network error for "${name}":`, err.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Zerothi — Banana Chips Price Sync to Google Sheets");
  console.log("=".repeat(55));
  console.log(`Target price: ₹10 (original: ₹12) for all BANANA_CHIPS`);
  console.log(`Sheet URL: ${SCRIPT_URL.slice(0, 60)}...`);

  let success = 0;
  let failed = 0;

  for (const product of chipsProducts) {
    const ok = await updatePriceInSheet(product.id, product.name);
    if (ok) success++;
    else failed++;
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n" + "=".repeat(55));
  console.log(`✅ Success: ${success}/${chipsProducts.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} — check Google Apps Script permissions`);
    console.log("\n💡 Tip: Open this URL in browser to authorize the script:");
    console.log(`   ${SCRIPT_URL}?action=getProducts`);
  }
}

main();
