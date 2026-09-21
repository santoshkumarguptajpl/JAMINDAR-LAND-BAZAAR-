/* =========================================================
   JAMINDAR AI SAATHI
   FULL CUSTOMER SUPPORT + SMART PROPERTY SEARCH
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     BASIC HELPERS
     ======================================================= */

  const LOCATION_ALIASES = {
    japla: ["japla", "जपला"],
    hussainabad: ["hussainabad", "husainabad", "हुसैनाबाद"],
    palamu: ["palamu", "पलामू"],
    haidernagar: ["haidernagar", "haider nagar", "हैदरनगर"],
    chhatarpur: ["chhatarpur", "छतरपुर"],
    medininagar: [
      "medininagar",
      "daltonganj",
      "मेदिनीनगर",
      "डाल्टनगंज"
    ],
    garhwa: ["garhwa", "गढ़वा", "गढ़वा"],
    ranchi: ["ranchi", "रांची"],
    dhanbad: ["dhanbad", "धनबाद"],
    bokaro: ["bokaro", "बोकारो"],
    jamshedpur: ["jamshedpur", "जमशेदपुर"],
    latehar: ["latehar", "लातेहार"],
    chatra: ["chatra", "चतरा"]
  };

  function normalizeText(value) {
    const hindiDigits = {
      "०": "0",
      "१": "1",
      "२": "2",
      "३": "3",
      "४": "4",
      "५": "5",
      "६": "6",
      "७": "7",
      "८": "8",
      "९": "9"
    };

    return String(value || "")
      .replace(/[०-९]/g, d => hindiDigits[d])
      .replace(/[₹,]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addAiMessage(text, type = "ai") {
    const container =
      document.getElementById("jamindarAiMessages");

    if (!container) return;

    const div = document.createElement("div");

    div.style.cssText = `
      margin:8px 0;
      padding:11px 13px;
      border-radius:15px;
      max-width:94%;
      line-height:1.6;
      white-space:pre-wrap;
      font-size:14px;
      ${
        type === "user"
          ? "margin-left:auto;background:#075e4f;color:#fff;"
          : "margin-right:auto;background:#f1f5f9;color:#111827;"
      }
    `;

    div.textContent = text;

    container.appendChild(div);

    container.scrollTop =
      container.scrollHeight;
  }

  window.addAiMessage = addAiMessage;

  /* =======================================================
     CUSTOMER SUPPORT KNOWLEDGE
     ======================================================= */

  const SUPPORT = {

    about: `🏡 JAMINDAR LAND BAZAAR

JAMINDAR LAND BAZAAR झारखंड में जमीन और प्रॉपर्टी की digital listing, property search और Buyer-Seller connection के लिए बनाया गया platform है।

मुख्य सुविधाएँ:
• जमीन खरीदना
• जमीन की listing करना
• General Plot
• CNT Plot
• Verified Properties
• Property Search
• Land Calculator
• Google Map Integration
• House for Rent
• Shop for Rent
• Commercial Property for Rent

Final transaction से पहले original documents और सरकारी records की स्वतंत्र जांच आवश्यक है।`,

    purpose: `🎯 JAMINDAR LAND BAZAAR का उद्देश्य

इस platform का उद्देश्य झारखंड में जमीन और प्रॉपर्टी की उपलब्ध जानकारी को एक digital platform पर व्यवस्थित करना और Buyer, Seller तथा Authorized Field Executive / Agent को जोड़ने में सहायता करना है।

ग्राहक location, budget, area और property type के अनुसार उपलब्ध approved property खोज सकता है और enquiry कर सकता है।

Platform का उद्देश्य property listing और buyer-seller connection को अधिक व्यवस्थित और आसान बनाना है।`,

    agentRegistration: `👨‍💼 AGENT REGISTRATION कैसे करें?

1. Website खोलें।
2. “एजेंट लॉगिन / रजिस्ट्रेशन” खोलें।
3. Agent Registration चुनें।
4. नाम, मोबाइल, Email और Password भरें।
5. Registration submit करें।
6. Registered Email को verify करें।
7. Email verification के बाद Admin Approval की प्रतीक्षा करें।
8. Admin approval के बाद Agent Login करके dashboard का उपयोग करें।

महत्वपूर्ण: Registration और Email Verification के बाद भी platform के workflow के अनुसार Admin Approval आवश्यक हो सकता है।`,

    agentApproval: `🛡️ AGENT APPROVAL PROCESS

Agent Registration
↓
Email Verification
↓
Admin Review
↓
Admin Approval
↓
Agent Account Active
↓
Agent Login

यदि approval pending है तो Admin review पूरा होने तक प्रतीक्षा करनी होगी।`,

    agentRole: `👨‍💼 AUTHORIZED FIELD EXECUTIVE / AGENT

Agent verification workflow में सहायता करता है।

मुख्य कार्य:
• Seller/property details collect करना
• Field visit
• Property photos
• Document checklist
• Verification remarks
• Verification report
• Admin को information submit करना

Final property approval platform के Admin workflow के अनुसार होता है।`,

    buyer: `🏡 BUYER सहायता

आप अपनी जरूरत इस तरह बता सकते हैं:

• “जपला में 5 डिसमिल जमीन 12 लाख तक चाहिए”
• “हुसैनाबाद में General plot चाहिए”
• “पलामू में 10 डिसमिल जमीन चाहिए”
• “CNT जमीन चाहिए”

AI approved properties में उपलब्ध matching listings खोज सकता है।`,

    seller: `📢 SELLER सहायता

अपनी property की listing करने के लिए website के “जमीन पोस्ट करें” विकल्प का उपयोग किया जा सकता है।

Listing में location, Khata, Plot, Area, Category, General/CNT, Price, Road और Seller details जैसी जानकारी मांगी जा सकती है।

Submit की गई listing verification और approval workflow से गुजर सकती है।`,

    verified: `✅ VERIFIED PROPERTY

Verified property वह listing है जिसे platform के निर्धारित verification workflow में verified status दिया गया है।

Authorized Field Executive / Agent field verification में सहायता कर सकता है और Admin information की समीक्षा कर सकता है।

ध्यान रखें: Platform verification को सरकारी title certificate या ownership guarantee नहीं माना जाना चाहिए। Final transaction से पहले independent document verification जरूरी है।`,

    cnt: `📜 CNT PLOT

CNT property पर Chotanagpur Tenancy Act से संबंधित restrictions लागू हो सकती हैं।

खरीद-बिक्री से पहले Khatiyan, ownership, mutation, land category, transfer restrictions और लागू सरकारी नियमों की जांच जरूरी है।`,

    general: `🏷️ GENERAL PLOT

General Plot platform की एक property classification है।

General category दिखाई देने मात्र से ownership या legal title automatically प्रमाणित नहीं होता। Final transaction से पहले original land records और applicable legal requirements की जांच करें।`,

    commission: `💰 COMMISSION

JAMINDAR LAND BAZAAR के planned business model के अनुसार:
• Seller side: 1%
• Buyer side: 1%

किसी वास्तविक transaction से पहले लागू terms और payable amount की पुष्टि करें।`,

    rent: `🏠 RENTAL PROPERTY

Rental categories में:
• House for Rent
• Shop for Rent
• Commercial Property for Rent

शामिल हैं।

आप पूछ सकते हैं:
“जपला में दुकान किराये पर चाहिए”
या
“Hussainabad में house rent चाहिए”`,

    admin: `🔐 ADMIN

Admin platform के management और approval workflow को संभालता है।

Workflow के अनुसार Admin property review, verification review, approval/rejection, Agent approval, enquiries और records management कर सकता है।`,

    calculator: `📐 LAND CALCULATOR

Land Calculator जमीन के area और संबंधित calculation में सहायता करता है।

आप Decimal, Acre, Square Feet आदि से संबंधित calculation पूछ सकते हैं।`,

    map: `🗺️ GOOGLE MAP

Google Map Integration property location को map पर समझने में सहायता करता है।

Map location को legal boundary या ownership proof नहीं माना जाना चाहिए।`,

    enquiry: `📞 PROPERTY ENQUIRY

जिस property में आपकी रुचि है, उसके card में “Enquiry करें” विकल्प का उपयोग करें।

Property ID सुरक्षित रखना उपयोगी रहेगा।`,

    legal: `⚖️ महत्वपूर्ण जानकारी

JAMINDAR LAND BAZAAR digital property listing और Buyer-Seller connecting platform है।

Final transaction से पहले:
• Ownership / Title
• Khatiyan
• Mutation
• Latest land records
• Revenue / Tax records
• Encumbrance
• Land-use
• CNT restrictions
• Registration requirements

की स्वतंत्र जांच करें। आवश्यकता होने पर योग्य local legal professional या संबंधित सरकारी कार्यालय से verification लें।`,

    privacy: `🔒 PRIVACY

Customer, Seller और अन्य users की personal information को website की Privacy Policy और लागू terms के अनुसार handle किया जाना चाहिए।

अपना OTP, Password या अन्य sensitive information किसी अनजान व्यक्ति को न दें।`,

    terms: `📜 TERMS & CONDITIONS

Website का उपयोग करते समय लागू Terms & Conditions का पालन करें।

Property listing की information को final legal title proof न मानें। खरीद-बिक्री से पहले documents और applicable legal requirements की जांच करें।`,

    support: `🤖 मैं JAMINDAR AI SAATHI हूँ।

मैं इन विषयों में सहायता कर सकता हूँ:
• JAMINDAR LAND BAZAAR
• Platform का उद्देश्य
• Agent Registration
• Agent Approval
• Buyer support
• Seller support
• Property Search
• Verified Property
• CNT / General Plot
• Rent Property
• Commission
• Property Enquiry
• Land Calculator
• Google Map
• Terms / Privacy / Legal जानकारी`
  };  /* =======================================================
     CUSTOMER SUPPORT QUESTION MATCHING
     ======================================================= */

  function getSupportAnswer(message) {
    const q = normalizeText(message);

    /* Platform / Purpose */
    if (
      q.includes("उद्देश्य") ||
      q.includes("purpose") ||
      q.includes("मकसद") ||
      q.includes("क्यों बनाया") ||
      q.includes("क्यों बनाया गया") ||
      q.includes("kyu banaya") ||
      q.includes("kyon banaya")
    ) {
      return SUPPORT.purpose;
    }

    /* About JAMINDAR LAND BAZAAR */
    if (
      q.includes("jamindar land bazaar") ||
      q.includes("जमींदार लैंड बाजार") ||
      q.includes("जमीनदार लैंड बाजार") ||
      q.includes("जमींदार लैंड बाजार क्या") ||
      q.includes("जमीनदार लैंड बाजार क्या") ||
      q.includes("land bazaar kya") ||
      q.includes("land bazaar क्या")
    ) {
      return SUPPORT.about;
    }

    /* Agent Registration */
    if (
      (q.includes("agent") ||
        q.includes("एजेंट") ||
        q.includes("field executive") ||
        q.includes("फील्ड एग्जीक्यूटिव")) &&
      (
        q.includes("registration") ||
        q.includes("register") ||
        q.includes("रजिस्ट्रेशन") ||
        q.includes("पंजीकरण") ||
        q.includes("कैसे करें") ||
        q.includes("कैसे करे") ||
        q.includes("kaise kare") ||
        q.includes("kaise karu")
      )
    ) {
      return SUPPORT.agentRegistration;
    }

    /* Agent Approval */
    if (
      (q.includes("agent") ||
        q.includes("एजेंट")) &&
      (
        q.includes("approval") ||
        q.includes("approve") ||
        q.includes("approved") ||
        q.includes("अप्रूवल") ||
        q.includes("मंजूरी") ||
        q.includes("स्वीकृति")
      )
    ) {
      return SUPPORT.agentApproval;
    }

    /* Agent Role */
    if (
      q.includes("agent kya karta") ||
      q.includes("agent ka kaam") ||
      q.includes("एजेंट क्या करता") ||
      q.includes("एजेंट का काम") ||
      q.includes("field executive") ||
      q.includes("फील्ड एग्जीक्यूटिव")
    ) {
      return SUPPORT.agentRole;
    }

    /* Buyer */
    if (
      q.includes("buyer") ||
      q.includes("बायर") ||
      q.includes("खरीदार") ||
      q.includes("जमीन कैसे खरीद") ||
      q.includes("जमीन खरीदना")
    ) {
      return SUPPORT.buyer;
    }

    /* Seller */
    if (
      q.includes("seller") ||
      q.includes("सेलर") ||
      q.includes("विक्रेता") ||
      q.includes("जमीन कैसे बेच") ||
      q.includes("जमीन बेच")
    ) {
      return SUPPORT.seller;
    }

    /* Verified Property */
    if (
      q.includes("verified property") ||
      q.includes("verified kya") ||
      q.includes("verified meaning") ||
      q.includes("वेरिफाइड प्रॉपर्टी") ||
      q.includes("सत्यापित प्रॉपर्टी") ||
      q.includes("verification") ||
      q.includes("वेरिफिकेशन")
    ) {
      return SUPPORT.verified;
    }

    /* CNT */
    if (
      q.includes("cnt") ||
      q.includes("सीएनटी") ||
      q.includes("cnt plot") ||
      q.includes("cnt जमीन")
    ) {
      return SUPPORT.cnt;
    }

    /* General */
    if (
      q.includes("general plot") ||
      q.includes("general land") ||
      q.includes("जनरल प्लॉट") ||
      q.includes("जनरल जमीन")
    ) {
      return SUPPORT.general;
    }

    /* Commission */
    if (
      q.includes("commission") ||
      q.includes("कमिशन") ||
      q.includes("1%") ||
      q.includes("दलाली") ||
      q.includes("charge कितना")
    ) {
      return SUPPORT.commission;
    }

    /* Rent */
    if (
      q.includes("rent") ||
      q.includes("रेंट") ||
      q.includes("किराया") ||
      q.includes("किराए") ||
      q.includes("किराये") ||
      q.includes("दुकान किराये")
    ) {
      return SUPPORT.rent;
    }

    /* Admin */
    if (
      q.includes("admin") ||
      q.includes("एडमिन") ||
      q.includes("administrator")
    ) {
      return SUPPORT.admin;
    }

    /* Land Calculator */
    if (
      q.includes("calculator") ||
      q.includes("कैलकुलेटर") ||
      q.includes("भूमि गणना") ||
      q.includes("जमीन की गणना") ||
      q.includes("गणना")
    ) {
      return SUPPORT.calculator;
    }

    /* Google Map */
    if (
      q.includes("google map") ||
      q.includes("google maps") ||
      q.includes("map") ||
      q.includes("मैप") ||
      q.includes("नक्शा")
    ) {
      return SUPPORT.map;
    }

    /* Enquiry */
    if (
      q.includes("enquiry") ||
      q.includes("inquiry") ||
      q.includes("पूछताछ") ||
      q.includes("संपर्क कैसे")
    ) {
      return SUPPORT.enquiry;
    }

    /* Privacy */
    if (
      q.includes("privacy") ||
      q.includes("गोपनीयता") ||
      q.includes("प्राइवेसी")
    ) {
      return SUPPORT.privacy;
    }

    /* Terms */
    if (
      q.includes("terms") ||
      q.includes("terms and conditions") ||
      q.includes("नियम") ||
      q.includes("शर्त") ||
      q.includes("नियम और शर्त")
    ) {
      return SUPPORT.terms;
    }

    /* Legal */
    if (
      q.includes("legal") ||
      q.includes("कानूनी") ||
      q.includes("license") ||
      q.includes("लाइसेंस") ||
      q.includes("कानून")
    ) {
      return SUPPORT.legal;
    }

    /* Help */
    if (
      q === "help" ||
      q === "मदद" ||
      q === "सहायता" ||
      q.includes("क्या पूछ सकता") ||
      q.includes("क्या पूछ सकते") ||
      q.includes("kya puch") ||
      q.includes("help karo")
    ) {
      return SUPPORT.support;
    }

    return null;
  }


  /* =======================================================
     PROPERTY SEARCH INTENT
     ======================================================= */

  function isPropertySearch(message) {
    const q = normalizeText(message);

    const propertyWords = [
      "जमीन",
      "भूमि",
      "प्लॉट",
      "plot",
      "land",
      "property",
      "प्रॉपर्टी",
      "डिसमिल",
      "डिसमल",
      "decimal",
      "decimals",
      "dismil",
      "disimil",
      "एकड़",
      "एकड़",
      "acre",
      "acres",
      "खरीद",
      "खरीदना",
      "buy",
      "purchase",
      "चाहिए",
      "जमीन चाहिए",
      "प्लॉट चाहिए"
    ];

    const hasPropertyWord =
      propertyWords.some(word =>
        q.includes(word)
      );

    const hasArea =
      /\d+(?:\.\d+)?\s*(decimal|decimals|dismil|disimil|डिसमिल|डिसमल|एकड़|एकड़|acre|acres)/i
        .test(q);

    const hasBudget =
      /\d+(?:\.\d+)?\s*(lakh|lac|लाख|crore|करोड़|करोड)/i
        .test(q);

    return (
      hasPropertyWord ||
      hasArea ||
      hasBudget
    );
  }


  /* =======================================================
     SEARCH QUERY PARSER
     ======================================================= */

  function parseSearch(query) {
    const q = normalizeText(query);

    let maxPrice = null;
    let requestedArea = null;
    let areaMode = "near";

    /* Location */
    const locations =
      Object.keys(LOCATION_ALIASES)
        .filter(key =>
          LOCATION_ALIASES[key].some(alias =>
            q.includes(alias)
          )
        );

    /* Budget - Crore */
    const croreMatch = q.match(
      /(\d+(?:\.\d+)?)\s*(crore|करोड़|करोड)/
    );

    /* Budget - Lakh */
    const lakhMatch = q.match(
      /(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)/
    );

    if (croreMatch) {
      maxPrice =
        parseFloat(croreMatch[1]) *
        10000000;
    } else if (lakhMatch) {
      maxPrice =
        parseFloat(lakhMatch[1]) *
        100000;
    }

    /* Budget - direct rupees */
    if (maxPrice === null) {
      const rupeeMatch = q.match(
        /(?:₹|rs|inr)\s*(\d+(?:\.\d+)?)/
      );

      if (rupeeMatch) {
        maxPrice =
          parseFloat(rupeeMatch[1]);
      }
    }

    /* Area - Decimal / Dismil */
    const decimalMatch = q.match(
      /(\d+(?:\.\d+)?)\s*(decimal|decimals|dismil|disimil|डिसमिल|डिसमल)/
    );

    if (decimalMatch) {
      requestedArea =
        parseFloat(decimalMatch[1]);

      const before =
        q.substring(
          Math.max(
            0,
            decimalMatch.index - 20
          ),
          decimalMatch.index
        );

      const after =
        q.substring(
          decimalMatch.index +
            decimalMatch[0].length,
          decimalMatch.index +
            decimalMatch[0].length +
            25
        );

      if (
        before.includes("सिर्फ") ||
        before.includes("ठीक") ||
        before.includes("exact")
      ) {
        areaMode = "exact";
      } else if (
        after.includes("तक") ||
        after.includes("upto") ||
        after.includes("up to") ||
        after.includes("maximum") ||
        after.includes("max")
      ) {
        areaMode = "max";
      }
    }

    /* Acre */
    if (requestedArea === null) {
      const acreMatch = q.match(
        /(\d+(?:\.\d+)?)\s*(acre|acres|एकड़|एकड़)/
      );

      if (acreMatch) {
        requestedArea =
          parseFloat(acreMatch[1]) *
          100;

        areaMode = "near";
      }
    }

    /* Property Type */
    let type = null;

    if (
      q.includes("cnt") ||
      q.includes("सीएनटी")
    ) {
      type = "cnt";
    } else if (
      q.includes("general") ||
      q.includes("जनरल")
    ) {
      type = "general";
    } else if (
      q.includes("rent") ||
      q.includes("रेंट") ||
      q.includes("किराया") ||
      q.includes("किराये")
    ) {
      type = "rent";
    }

    return {
      q,
      locations,
      maxPrice,
      requestedArea,
      areaMode,
      type
    };
  }


  /* =======================================================
     PROPERTY PRICE NORMALIZATION
     ======================================================= */

  function getPropertyPrice(property) {

    if (
      property.priceVal !== undefined &&
      property.priceVal !== null &&
      property.priceVal !== ""
    ) {
      const number =
        Number(property.priceVal);

      if (
        Number.isFinite(number) &&
        number > 0
      ) {
        return number;
      }
    }

    const rawPrice =
      property.price ||
      property.priceText ||
      "";

    const text =
      normalizeText(rawPrice);

    const crore =
      text.match(
        /(\d+(?:\.\d+)?)\s*(crore|करोड़|करोड)/
      );

    if (crore) {
      return (
        parseFloat(crore[1]) *
        10000000
      );
    }

    const lakh =
      text.match(
        /(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)/
      );

    if (lakh) {
      return (
        parseFloat(lakh[1]) *
        100000
      );
    }

    const number =
      text.match(
        /\d+(?:\.\d+)?/
      );

    return number
      ? parseFloat(number[0])
      : 0;
  }


  /* =======================================================
     PROPERTY AREA NORMALIZATION
     ======================================================= */

  function getPropertyArea(property) {

    if (
      property.areaVal !== undefined &&
      property.areaVal !== null &&
      property.areaVal !== ""
    ) {
      const number =
        Number(property.areaVal);

      if (
        Number.isFinite(number) &&
        number > 0
      ) {
        return number;
      }
    }

    const rawArea =
      property.area ||
      property.landArea ||
      property.areaText ||
      "";

    const text =
      normalizeText(rawArea);

    const decimal =
      text.match(
        /\d+(?:\.\d+)?/
      );

    return decimal
      ? parseFloat(decimal[0])
      : 0;
  }  /* =======================================================
     PROPERTY SEARCH TEXT
     ======================================================= */

  function getPropertySearchText(property) {
    return [
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
      property.description,
      property.road,
      property.type
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }


  /* =======================================================
     LOCATION MATCHING
     ======================================================= */

  function propertyMatchesLocation(
    property,
    requestedLocations
  ) {
    if (
      !requestedLocations ||
      requestedLocations.length === 0
    ) {
      return true;
    }

    const searchableText =
      getPropertySearchText(property);

    return requestedLocations.some(
      locationKey =>
        LOCATION_ALIASES[locationKey].some(
          alias =>
            searchableText.includes(
              normalizeText(alias)
            )
        )
    );
  }


  /* =======================================================
     PROPERTY TYPE MATCHING
     ======================================================= */

  function propertyMatchesType(
    property,
    requestedType
  ) {
    if (!requestedType) {
      return true;
    }

    const classType =
      normalizeText(
        property.classType || ""
      );

    const category =
      normalizeText(
        property.category || ""
      );

    const type =
      normalizeText(
        property.type || ""
      );

    const combined =
      `${classType} ${category} ${type}`;

    if (requestedType === "cnt") {
      return (
        combined.includes("cnt") ||
        combined.includes("सीएनटी")
      );
    }

    if (requestedType === "general") {
      return (
        combined.includes("general") ||
        combined.includes("जनरल")
      );
    }

    if (requestedType === "rent") {
      return (
        combined.includes("rent") ||
        combined.includes("रेंट") ||
        combined.includes("किराया") ||
        combined.includes("किराये")
      );
    }

    return true;
  }


  /* =======================================================
     MAIN FIRESTORE PROPERTY SEARCH
     ======================================================= */

  async function jamindarAiSearchProperties(
    query
  ) {
    if (typeof db === "undefined") {
      throw new Error(
        "Firebase Firestore database is not available."
      );
    }

    const intent =
      parseSearch(query);

    /* -----------------------------------------------
       ONLY APPROVED PROPERTIES
       ----------------------------------------------- */

    const snapshot =
      await db
        .collection("properties")
        .where(
          "status",
          "==",
          "approved"
        )
        .get();

    const properties =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));


    /* -----------------------------------------------
       STRICT FILTERING
       ----------------------------------------------- */

    const results =
      properties.filter(property => {

        /* LOCATION */
        const locationMatch =
          propertyMatchesLocation(
            property,
            intent.locations
          );


        /* PRICE / BUDGET */
        let priceMatch = true;

        if (
          intent.maxPrice !== null
        ) {
          const propertyPrice =
            getPropertyPrice(property);

          /*
             If customer gives a maximum budget,
             property price must be <= budget.
          */

          priceMatch =
            propertyPrice > 0 &&
            propertyPrice <=
              intent.maxPrice;
        }


        /* AREA */
        let areaMatch = true;

        if (
          intent.requestedArea !== null
        ) {
          const propertyArea =
            getPropertyArea(property);

          if (
            !propertyArea ||
            propertyArea <= 0
          ) {
            areaMatch = false;
          } else if (
            intent.areaMode === "exact"
          ) {

            /*
               Exact area:
               5 decimal means approximately
               5 decimal with small tolerance.
            */

            areaMatch =
              Math.abs(
                propertyArea -
                  intent.requestedArea
              ) <= 0.10;

          } else if (
            intent.areaMode === "max"
          ) {

            /*
               "5 decimal तक"
               means maximum 5 decimal.
            */

            areaMatch =
              propertyArea <=
              intent.requestedArea;

          } else {

            /*
               Normal request:
               "5 decimal जमीन चाहिए"

               We allow a reasonable range,
               but a property such as 278 decimal
 will NOT match 5 decimal.
 */

            const minimumArea =
              intent.requestedArea * 0.80;

            const maximumArea =
              intent.requestedArea * 1.20;

            areaMatch =
              propertyArea >=
                minimumArea &&
              propertyArea <=
                maximumArea;
          }
        }


        /* PROPERTY TYPE */
        const typeMatch =
          propertyMatchesType(
            property,
            intent.type
          );


        return (
          locationMatch &&
          priceMatch &&
          areaMatch &&
          typeMatch
        );
      });


    /* -----------------------------------------------
       VERIFIED FIRST
       ----------------------------------------------- */

    results.sort((a, b) => {

      if (
        a.verified === true &&
        b.verified !== true
      ) {
        return -1;
      }

      if (
        a.verified !== true &&
        b.verified === true
      ) {
        return 1;
      }

      return 0;
    });


    /* -----------------------------------------------
       MAXIMUM 10 RESULTS
       ----------------------------------------------- */

    return results.slice(0, 10);
  }


  window.jamindarAiSearchProperties =
    jamindarAiSearchProperties;
    /* =======================================================
     MAIN AI MESSAGE HANDLER
     ======================================================= */

  async function handleAiMessage() {

    const input =
      document.getElementById(
        "jamindarAiInput"
      );

    if (!input) return;

    const message =
      input.value.trim();

    if (!message) return;


    /* -----------------------------------------------
       SHOW CUSTOMER MESSAGE
       ----------------------------------------------- */

    addAiMessage(
      message,
      "user"
    );

    input.value = "";


    /* -----------------------------------------------
       1. CUSTOMER SUPPORT QUESTION
       ----------------------------------------------- */

    const supportAnswer =
      getSupportAnswer(message);

    if (supportAnswer) {

      addAiMessage(
        supportAnswer,
        "ai"
      );

      return;
    }


    /* -----------------------------------------------
       2. PROPERTY SEARCH
       ----------------------------------------------- */

    if (
      isPropertySearch(message)
    ) {

      addAiMessage(
        "🔎 आपकी जरूरत के अनुसार approved properties खोज रहा हूँ...",
        "ai"
      );

      try {

        const results =
          await jamindarAiSearchProperties(
            message
          );


        /* Remove loading message */

        const container =
          document.getElementById(
            "jamindarAiMessages"
          );

        if (
          container &&
          container.lastElementChild
        ) {
          container.lastElementChild.remove();
        }


        /* No result */

        if (
          !results ||
          results.length === 0
        ) {

          const intent =
            parseSearch(message);

          let reason =
            "अभी आपकी जरूरत के अनुसार कोई approved property नहीं मिली।";

          if (
            intent.locations.length > 0 &&
            intent.maxPrice !== null &&
            intent.requestedArea !== null
          ) {

            reason =
              "अभी आपकी बताई हुई location, budget और area—तीनों के अनुसार कोई approved property नहीं मिली।";
          }

          addAiMessage(
            `${reason}

आप इनमें से कोई जानकारी बदलकर फिर खोज सकते हैं:
• Location
• Budget
• Decimal / Area
• General / CNT
• Rent / Sale

उदाहरण:
“जपला में 5 डिसमिल जमीन 15 लाख तक चाहिए”`,
            "ai"
          );

          return;
        }


        /* Results found */

        addAiMessage(
          `✅ आपकी जरूरत के अनुसार ${results.length} approved property मिली हैं।`,
          "ai"
        );

        showJamindarAiPropertyResults(
          results
        );

        return;

      } catch (error) {

        console.error(
          "JAMINDAR AI Search Error:",
          error
        );

        const container =
          document.getElementById(
            "jamindarAiMessages"
          );

        if (
          container &&
          container.lastElementChild
        ) {
          container.lastElementChild.remove();
        }

        addAiMessage(
          "अभी property search में तकनीकी समस्या आ रही है। कृपया थोड़ी देर बाद फिर प्रयास करें।",
          "ai"
        );

        return;
      }
    }


    /* -----------------------------------------------
       3. GENERAL FALLBACK
       ----------------------------------------------- */

    addAiMessage(
      `🤖 मैं JAMINDAR AI SAATHI हूँ।

मैं आपकी इन चीजों में सहायता कर सकता हूँ:

• JAMINDAR LAND BAZAAR क्या है?
• इसका उद्देश्य क्या है?
• Agent Registration कैसे करें?
• Agent Approval कैसे होता है?
• जमीन कैसे खरीदें?
• जमीन कैसे बेचें?
• Verified Property क्या है?
• CNT / General Plot क्या है?
• Commission कितना है?
• Rent Property कैसे खोजें?
• Property Enquiry कैसे करें?
• Land Calculator
• Google Map
• Terms & Conditions
• Privacy
• Legal जानकारी
• Approved Property Search

आप अपना सवाल सामान्य भाषा में पूछ सकते हैं।`,
      "ai"
    );
  }


  window.handleAiMessage =
    handleAiMessage;
  /* =======================================================
   PROPERTY RESULT CARDS
   ======================================================= */

  function showJamindarAiPropertyResults(
    properties
  ) {

    const container =
      document.getElementById(
        "jamindarAiMessages"
      );

    if (!container) return;

    properties.forEach(property => {

      const card =
        document.createElement("div");

      card.style.cssText = `
        background:#ffffff;
        border:1px solid #d1d5db;
        border-radius:18px;
        padding:14px;
        margin:10px 0;
        box-shadow:0 3px 12px rgba(0,0,0,.08);
      `;


      const propertyId =
        property.propertyId ||
        property.id ||
        "-";


      const title =
        property.title ||
        "जमीन / Property";


      const location = [
        property.village,
        property.block,
        property.district
      ]
        .filter(Boolean)
        .join(", ") ||
        "Location उपलब्ध नहीं";


      const area =
        getPropertyArea(property);


      const areaText =
        area > 0
          ? `${area} Decimal`
          : (
              property.area ||
              "Area उपलब्ध नहीं"
            );


      const price =
        getPropertyPrice(property);


      const priceText =
        price > 0
          ? "₹ " +
            price.toLocaleString("en-IN")
          : (
              property.price ||
              "Price उपलब्ध नहीं"
            );


      const classType =
        property.classType ||
        property.category ||
        property.type ||
        "General";


      const verified =
        property.verified === true ||
        property.verified === "true";


      card.innerHTML = `
        <div style="
          font-size:17px;
          font-weight:700;
          color:#064e3b;
          margin-bottom:8px;
        ">
          ${escapeHtml(title)}
        </div>

        <div style="
          font-size:13px;
          color:#64748b;
          margin-bottom:8px;
        ">
          Property ID:
          ${escapeHtml(propertyId)}
        </div>

        <div style="
          line-height:1.8;
          color:#334155;
        ">

          📍 <b>स्थान:</b>
          ${escapeHtml(location)}
          <br>

          📐 <b>रकबा:</b>
          ${escapeHtml(areaText)}
          <br>

          💰 <b>कीमत:</b>
          <span style="
            color:#047857;
            font-weight:700;
          ">
            ${escapeHtml(priceText)}
          </span>
          <br>

          🏷️ <b>किस्म:</b>
          ${escapeHtml(classType)}

          ${
            verified
              ? `
                <div style="
                  display:inline-block;
                  margin-top:8px;
                  padding:5px 10px;
                  border-radius:10px;
                  background:#dcfce7;
                  color:#166534;
                  font-weight:700;
                ">
                  ✓ Verified
                </div>
              `
              : ""
          }

        </div>

        <button
          type="button"
          class="jamindar-ai-enquiry-btn"
          data-property-id="${escapeHtml(propertyId)}"
          style="
            width:100%;
            margin-top:12px;
            padding:12px;
            border:0;
            border-radius:13px;
            background:#075e4f;
            color:#fff;
            font-size:16px;
            font-weight:700;
            cursor:pointer;
          "
        >
          📞 Enquiry करें
        </button>
      `;


      container.appendChild(card);


      const enquiryButton =
        card.querySelector(
          ".jamindar-ai-enquiry-btn"
        );


      if (enquiryButton) {

        enquiryButton.addEventListener(
          "click",
          () => {

            jamindarAiEnquiry(
              property
            );

          }
        );

      }

    });


    container.scrollTop =
      container.scrollHeight;
  }


  /* =======================================================
     PROPERTY ENQUIRY
     ======================================================= */

  function jamindarAiEnquiry(
    property
  ) {

    const propertyId =
      property.propertyId ||
      property.id ||
      "-";


    const title =
      property.title ||
      "Property";


    const location = [
      property.village,
      property.block,
      property.district
    ]
      .filter(Boolean)
      .join(", ");


    addAiMessage(
      `📞 PROPERTY ENQUIRY

आपने इस property में enquiry की है:

Property ID: ${propertyId}
Property: ${title}
Location: ${location || "-"}

कृपया property ID सुरक्षित रखें।

आगे की जानकारी के लिए website में उपलब्ध enquiry/contact option का उपयोग करें।

⚠️ किसी भी payment या transaction से पहले property documents और ownership की स्वतंत्र जांच जरूर करें।`,
      "ai"
    );
  }


  window.showJamindarAiPropertyResults =
    showJamindarAiPropertyResults;

  window.jamindarAiEnquiry =
    jamindarAiEnquiry;
    /* =======================================================
     JAMINDAR AI SAATHI CHAT UI
     ======================================================= */

  function createJamindarAiUi() {

    if (
      document.getElementById(
        "jamindarAiButton"
      )
    ) {
      return;
    }


    /* -------------------------------------------------------
       FLOATING AI BUTTON
       ------------------------------------------------------- */

    const button =
      document.createElement("button");

    button.id =
      "jamindarAiButton";

    button.type =
      "button";

    button.innerHTML =
      "🤖";

    button.setAttribute(
      "aria-label",
      "JAMINDAR AI SAATHI"
    );

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


    /* -------------------------------------------------------
       MODAL
       ------------------------------------------------------- */

    const modal =
      document.createElement("div");

    modal.id =
      "jamindarAiModal";

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


        <!-- HEADER -->

        <div style="
          background:#075e4f;
          color:#fff;
          padding:14px 16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        ">

          <div>

            <div style="
              font-size:18px;
              font-weight:700;
            ">
              🤖 JAMINDAR AI SAATHI
            </div>

            <div style="
              font-size:12px;
              opacity:.9;
            ">
              जमीन खोजने और जानकारी में आपकी सहायता
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
              line-height:1;
            "
          >
            ×
          </button>

        </div>


        <!-- MESSAGES -->

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
            padding:13px;
            border-radius:14px;
            color:#334155;
            line-height:1.6;
          ">

            नमस्ते! 👋

            <br><br>

            मैं
            <b>JAMINDAR AI SAATHI</b>
            हूँ।

            <br><br>

            आप मुझसे
            <b>JAMINDAR LAND BAZAAR</b>
            से संबंधित कोई भी सवाल पूछ सकते हैं।

            <br><br>

            उदाहरण:

            <br>
            • जमींदार लैंड बाजार का उद्देश्य क्या है?
            <br>
            • Agent Registration कैसे करें?
            <br>
            • Verified Property क्या है?
            <br>
            • जपला में 5 डिसमिल जमीन 12 लाख तक चाहिए
            <br>
            • CNT जमीन क्या है?
            <br>
            • Commission कितना है?

          </div>

        </div>


        <!-- INPUT AREA -->

        <div style="
          padding:10px;
          border-top:1px solid #e5e7eb;
          display:flex;
          gap:8px;
          background:#fff;
        ">


          <input
            id="jamindarAiInput"
            type="text"
    placeholder="अपना सवाल लिखें..."
    autocomplete="off"
    style="
      flex:1;
      min-width:0;
      border:1px solid #cbd5e1;
      border-radius:12px;
      padding:12px;
      outline:none;
      font-size:14px;
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
      white-space:nowrap;
    "
  >
    भेजें
  </button>

</div>

</div>
`;
   /* =======================================================
     AI SAATHI EVENTS
     ======================================================= */

  document.body.appendChild(button);
  document.body.appendChild(modal);


  button.addEventListener(
    "click",
    () => {

      modal.style.display = "flex";

      setTimeout(() => {

        const input =
          document.getElementById(
            "jamindarAiInput"
          );

        if (input) {
          input.focus();
        }

      }, 100);

    }
  );


  const closeButton =
    document.getElementById(
      "jamindarAiClose"
    );

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      () => {

        modal.style.display = "none";

      }
    );

  }


  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {

        modal.style.display = "none";

      }

    }
  );


  const sendButton =
    document.getElementById(
      "jamindarAiSend"
    );

  if (sendButton) {

    sendButton.addEventListener(
      "click",
      () => {

        handleAiMessage();

      }
    );

  }   
    /* =======================================================
     ENTER KEY
     ======================================================= */

  const input =
    document.getElementById(
      "jamindarAiInput"
    );

  if (input) {

    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          event.preventDefault();

          handleAiMessage();

        }

      }
    );

  }


  /* =======================================================
     FINAL INITIALIZATION
     ======================================================= */

  function initJamindarAiSaathi() {

    try {

      createJamindarAiUi();

    } catch (error) {

      console.error(
        "JAMINDAR AI SAATHI initialization error:",
        error
      );

    }

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initJamindarAiSaathi
    );

  } else {

    initJamindarAiSaathi();

  }


  window.initJamindarAiSaathi =
    initJamindarAiSaathi;

})();
