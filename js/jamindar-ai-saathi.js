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

}
