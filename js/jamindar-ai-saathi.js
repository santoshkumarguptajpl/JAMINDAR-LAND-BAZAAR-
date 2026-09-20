async function handleAiMessage() {

  const input = document.getElementById("jamindarAiInput");

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addAiMessage(message, "user");

  input.value = "";

  addAiMessage("🔎 आपकी जरूरत के अनुसार approved properties खोज रहा हूँ...", "ai");

  try {

    const result = await jamindarAiSearchProperties(message);

    // Loading message हटाएँ
    const container = document.getElementById("jamindarAiMessages");

    if (container && container.lastElementChild) {
      container.lastElementChild.remove();
    }

    if (!result.length) {

      addAiMessage(
        "माफ़ कीजिए। आपकी जरूरत के अनुसार अभी कोई approved property नहीं मिली। आप स्थान, बजट या रकबा थोड़ा बदलकर फिर से खोज सकते हैं।",
        "ai"
      );

      return;
    }

    addAiMessage(
      `✅ आपकी जरूरत के अनुसार ${result.length} approved property मिली हैं।`,
      "ai"
    );

    showJamindarAiPropertyResults(result);

  } catch (error) {

    console.error("AI Search Error:", error);

    addAiMessage(
      "अभी property search में समस्या आ रही है। कृपया थोड़ी देर बाद फिर प्रयास करें।",
      "ai"
    );

  }
}


/* =====================================================
   SMART PROPERTY SEARCH
   ===================================================== */

async function jamindarAiSearchProperties(query) {

  if (typeof db === "undefined") {
    throw new Error("Firebase Firestore database is not available.");
  }

  const q = query
    .toLowerCase()
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .trim();


  // -----------------------------------------
  // 1. BUDGET / PRICE
  // -----------------------------------------

  let maxPrice = null;

  const lakhMatch = q.match(
    /(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)/
  );

  if (lakhMatch) {

    maxPrice =
      parseFloat(lakhMatch[1]) * 100000;

  } else {

    const priceMatch = q.match(
      /(?:rs|inr|₹)?\s*(\d{5,8})/
    );

    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
    }

  }


  // -----------------------------------------
  // 2. AREA / DECIMAL
  // -----------------------------------------

  let minArea = null;

  const areaMatch = q.match(
    /(\d+(?:\.\d+)?)\s*(decimal|decimals|disimil|dismil|डिसमिल|डिसमल)/
  );

  if (areaMatch) {

    minArea = parseFloat(areaMatch[1]);

  }


  // -----------------------------------------
  // 3. FIRESTORE
  // ONLY APPROVED PROPERTIES
  // -----------------------------------------

  const snapshot = await db
    .collection("properties")
    .where("status", "==", "approved")
    .get();


  const properties = snapshot.docs.map(doc => {

    const data = doc.data();

    return {
      id: doc.id,
      ...data
    };

  });


  // -----------------------------------------
  // 4. LOCATION / KEYWORD SEARCH
  // -----------------------------------------

  const stopWords = new Set([
    "mein",
    "me",
    "में",
    "ka",
    "ki",
    "ke",
    "तक",
    "chahiye",
    "चाहिए",
    "hai",
    "है",
    "jameen",
    "zameen",
    "जमीन",
    "भूमि",
    "land",
    "property",
    "plot",
    "प्लॉट",
    "please",
    "mujhe",
    "मुझे",
    "the",
    "and",
    "or"
  ]);


  const words = q
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length >= 2)
    .filter(word => !stopWords.has(word));


  const results = properties.filter(property => {

    const searchableText = [
      property.title,
      property.district,
      property.block,
      property.panchayat,
      property.village,
      property.category,
      property.classType,
      property.propertyId,
      property.khata,
      property.plot,
      property.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();


    // Location / keyword matching
    const keywordMatch =
      words.length === 0 ||
      words.some(word =>
        searchableText.includes(word)
      );


    // Price filter
    const propertyPrice =
      Number(property.priceVal || 0);

    const priceMatch =
      maxPrice === null ||
      (
        propertyPrice > 0 &&
        propertyPrice <= maxPrice
      );


    // Area filter
    const propertyArea =
      Number(property.areaVal || 0);

    const areaMatch =
      minArea === null ||
      (
        propertyArea > 0 &&
        propertyArea >= minArea
      );


    return (
      keywordMatch &&
      priceMatch &&
      areaMatch
    );

  });


  // सबसे पहले verified properties
  results.sort((a, b) => {

    if (a.verified === true && b.verified !== true) {
      return -1;
    }

    if (a.verified !== true && b.verified === true) {
      return 1;
    }

    return 0;

  });


  return results.slice(0, 10);
}


/* =====================================================
   PROPERTY RESULT CARDS
   ===================================================== */

function showJamindarAiPropertyResults(properties) {

  const container =
    document.getElementById("jamindarAiMessages");

  if (!container) return;


  properties.forEach(property => {

    const card = document.createElement("div");

    card.style.cssText = `
      background:white;
      border:1px solid #d1d5db;
      border-radius:16px;
      padding:13px;
      margin:10px 0;
      box-shadow:0 3px 10px rgba(0,0,0,.08);
    `;


    const propertyId =
      property.propertyId || property.id || "-";

    const title =
      property.title || "भूमि उपलब्ध";

    const location = [
      property.village || "",
      property.block || "",
      property.district || ""
    ]
      .filter(Boolean)
      .join(", ");


    const area =
      property.area ||
      (
        property.areaVal
          ? property.areaVal + " Decimal"
          : "-"
      );


    const price =
      property.price ||
      (
        property.priceVal
          ? "₹ " +
            Number(property.priceVal)
              .toLocaleString("en-IN")
          : "-"
      );


    const verifiedBadge =
      property.verified === true
        ? `
          <span style="
            display:inline-block;
            background:#dcfce7;
            color:#166534;
            padding:3px 7px;
            border-radius:7px;
            font-size:10px;
            font-weight:800;
          ">
            ✓ Verified
          </span>
        `
        : `
          <span style="
            display:inline-block;
            background:#f1f5f9;
            color:#475569;
            padding:3px 7px;
            border-radius:7px;
            font-size:10px;
            font-weight:700;
          ">
            Approved
          </span>
        `;


    card.innerHTML = `

      <div style="
        font-size:15px;
        font-weight:900;
        color:#064e3b;
        margin-bottom:5px;
      ">
        ${escapeHtml(title)}
      </div>

      <div style="
        font-size:11px;
        color:#64748b;
        margin-bottom:8px;
      ">
        Property ID: ${escapeHtml(propertyId)}
      </div>

      <div style="
        font-size:12px;
        line-height:1.8;
        color:#334155;
      ">

        📍 <b>स्थान:</b>
        ${escapeHtml(location || "-")}

        <br>

        📐 <b>रकबा:</b>
        ${escapeHtml(area)}

        <br>

        💰 <b>कीमत:</b>
        <span style="
          color:#047857;
          font-weight:900;
        ">
          ${escapeHtml(price)}
        </span>

        <br>

        🏷️ <b>क़िस्म:</b>
        ${escapeHtml(property.classType || "-")}

        <br>

        ${verifiedBadge}

      </div>

      <button
        type="button"
        style="
          width:100%;
          margin-top:10px;
          background:#064e3b;
          color:white;
          border:0;
          border-radius:10px;
          padding:9px;
          font-weight:800;
          cursor:pointer;
        "
        onclick="jamindarAiEnquiry('${escapeHtml(propertyId)}')"
      >
        📞 Enquiry करें
      </button>

    `;


    container.appendChild(card);

  });


  container.scrollTop =
    container.scrollHeight;
}


/* =====================================================
   ENQUIRY
   ===================================================== */

function jamindarAiEnquiry(propertyId) {

  addAiMessage(
    `मैंने Property ID ${propertyId} को enquiry के लिए चुना है। अगले चरण में हम इसे JAMINDAR LAND BAZAAR के enquiry system से जोड़ेंगे।`,
    "ai"
  );

}/* =========================================
   JAMINDAR AI SAATHI - CHAT UI
   ========================================= */

(function initJamindarAiSaathi() {
  "use strict";

  function addAiMessage(text, type = "ai") {
    const container = document.getElementById("jamindarAiMessages");
    if (!container) return;

    const div = document.createElement("div");

    div.style.cssText = `
      margin:8px 0;
      padding:10px 12px;
      border-radius:14px;
      max-width:90%;
      line-height:1.5;
      white-space:pre-wrap;
      ${
        type === "user"
          ? "margin-left:auto;background:#075e4f;color:#fff;"
          : "margin-right:auto;background:#f1f5f9;color:#111827;"
      }
    `;

    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  window.addAiMessage = addAiMessage;

  function createAiUi() {
    if (document.getElementById("jamindarAiButton")) return;

    const button = document.createElement("button");

    button.id = "jamindarAiButton";
    button.type = "button";
    button.innerHTML = "🤖";
    button.setAttribute("aria-label", "JAMINDAR AI SAATHI");

    button.style.cssText = `
      position:fixed;
      right:18px;
      bottom:110px;
      z-index:9999;
      width:60px;
      height:60px;
      border:0;
      border-radius:50%;
      background:#f59e0b;
      color:#fff;
      font-size:28px;
      box-shadow:0 6px 18px rgba(0,0,0,.25);
      cursor:pointer;
    `;

    const modal = document.createElement("div");

    modal.id = "jamindarAiModal";

    modal.style.cssText = `
      display:none;
      position:fixed;
      inset:0;
      z-index:10000;
      background:rgba(0,0,0,.45);
      align-items:flex-end;
      justify-content:center;
    `;

    modal.innerHTML = `
      <div style="
        width:100%;
        max-width:520px;
        background:#fff;
        border-radius:20px 20px 0 0;
        overflow:hidden;
        box-shadow:0 -8px 30px rgba(0,0,0,.2);
      ">

        <div style="
          background:#075e4f;
          color:#fff;
          padding:14px 16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        ">

          <div>
            <div style="font-size:18px;font-weight:700;">
              🤖 JAMINDAR AI SAATHI
            </div>

            <div style="font-size:12px;opacity:.9;">
              जमीन खोजने में आपकी सहायता
            </div>
          </div>

          <button
            id="jamindarAiClose"
            type="button"
            style="
              background:none;
              border:0;
              color:#fff;
              font-size:28px;
              cursor:pointer;
            "
          >×</button>

        </div>

        <div
          id="jamindarAiMessages"
          style="
            height:55vh;
            max-height:520px;
            overflow-y:auto;
            padding:14px;
            background:#f8fafc;
          "
        >

          <div style="
            background:#fff;
            padding:12px;
            border-radius:14px;
            color:#334155;
          ">
            नमस्ते! 👋<br><br>
            मैं <b>JAMINDAR AI SAATHI</b> हूँ।<br>
            आप अपनी जमीन की जरूरत बताइए।
            <br><br>
            उदाहरण:<br>
            <b>जपला में 5 डिसमिल जमीन ₹12 लाख तक चाहिए</b>
          </div>

        </div>

        <div style="
          padding:10px;
          border-top:1px solid #e5e7eb;
          display:flex;
          gap:8px;
        ">

          <input
            id="jamindarAiInput"
            type="text"
            placeholder="जैसे: जपला में 5 डिसमिल जमीन 12 लाख तक"
            style="
              flex:1;
              border:1px solid #cbd5e1;
              border-radius:12px;
              padding:12px;
              outline:none;
            "
          >

          <button
            id="jamindarAiSend"
            type="button"
            style="
              background:#075e4f;
              color:#fff;
              border:0;
              border-radius:12px;
              padding:0 16px;
              font-weight:700;
              cursor:pointer;
            "
          >
            भेजें
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(modal);

    button.addEventListener("click", () => {
      modal.style.display = "flex";

      setTimeout(() => {
        document
          .getElementById("jamindarAiInput")
          ?.focus();
      }, 50);
    });

    document
      .getElementById("jamindarAiClose")
      .addEventListener("click", () => {
        modal.style.display = "none";
      });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    document
      .getElementById("jamindarAiSend")
      .addEventListener("click", () => {
        handleAiMessage();
      });

    document
      .getElementById("jamindarAiInput")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleAiMessage();
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createAiUi
    );
  } else {
    createAiUi();
  }

})();
