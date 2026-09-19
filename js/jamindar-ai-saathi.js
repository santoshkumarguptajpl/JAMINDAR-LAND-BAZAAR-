/* =====================================================
   JAMINDAR AI SAATHI
   Buyer Assistant - Version 1
   ===================================================== */

(function () {
  "use strict";

  console.log("JAMINDAR AI SAATHI loaded");

  const button = document.createElement("button");

  button.id = "jamindarAiButton";

  button.innerHTML = `
    <span style="font-size:22px;">🤖</span>
    <span>JAMINDAR AI SAATHI</span>
  `;

  button.style.cssText = `
    position:fixed;
    right:18px;
    bottom:82px;
    z-index:9999;
    display:flex;
    align-items:center;
    gap:8px;
    background:#064e3b;
    color:white;
    border:2px solid #f59e0b;
    border-radius:50px;
    padding:12px 18px;
    font-weight:800;
    font-size:13px;
    box-shadow:0 8px 25px rgba(0,0,0,.25);
    cursor:pointer;
  `;

  document.body.appendChild(button);

  button.addEventListener("click", function () {
    openJamindarAi();
  });


  function openJamindarAi() {

    if (document.getElementById("jamindarAiModal")) {
      document
        .getElementById("jamindarAiModal")
        .classList.remove("hidden");

      return;
    }

    const modal = document.createElement("div");

    modal.id = "jamindarAiModal";

    modal.style.cssText = `
      position:fixed;
      inset:0;
      z-index:10000;
      background:rgba(0,0,0,.55);
      display:flex;
      align-items:flex-end;
      justify-content:center;
      padding:15px;
    `;

    modal.innerHTML = `
      <div style="
        width:100%;
        max-width:500px;
        background:white;
        border-radius:24px;
        overflow:hidden;
        box-shadow:0 20px 60px rgba(0,0,0,.35);
      ">

        <div style="
          background:#064e3b;
          color:white;
          padding:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">

          <div>
            <div style="font-size:17px;font-weight:900;">
              🤖 JAMINDAR AI SAATHI
            </div>

            <div style="
              font-size:11px;
              color:#a7f3d0;
            ">
              जमीन खोजने में आपकी सहायता
            </div>
          </div>

          <button
            id="closeJamindarAi"
            style="
              background:none;
              border:0;
              color:white;
              font-size:22px;
              cursor:pointer;
            "
          >×</button>

        </div>


        <div
          id="jamindarAiMessages"
          style="
            height:360px;
            overflow-y:auto;
            padding:15px;
            background:#f8fafc;
          "
        >

          <div style="
            background:white;
            border:1px solid #e2e8f0;
            border-radius:15px;
            padding:12px;
            margin-bottom:10px;
            font-size:13px;
          ">

            🙏 नमस्कार! मैं
            <b>JAMINDAR AI SAATHI</b> हूँ।

            <br><br>

            आपको किस स्थान पर जमीन चाहिए?

            अपना बजट, जमीन का रकबा और स्थान लिखें।

            <br><br>

            <span style="color:#64748b;">
              उदाहरण:
              “जपला में 5 डिसमिल जमीन ₹12 लाख तक चाहिए।”
            </span>

          </div>

        </div>


        <div style="
          padding:12px;
          border-top:1px solid #e2e8f0;
          background:white;
        ">

          <div style="
            display:flex;
            gap:8px;
          ">

            <input
              id="jamindarAiInput"
              type="text"
              placeholder="जैसे: जपला में 5 डिसमिल जमीन..."
              style="
                flex:1;
                border:1px solid #cbd5e1;
                border-radius:12px;
                padding:11px;
                font-size:13px;
                outline:none;
              "
            >

            <button
              id="jamindarAiSend"
              style="
                background:#064e3b;
                color:white;
                border:0;
                border-radius:12px;
                padding:0 16px;
                font-weight:800;
                cursor:pointer;
              "
            >
              भेजें
            </button>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);


    document
      .getElementById("closeJamindarAi")
      .addEventListener("click", function () {
        modal.remove();
      });


    document
      .getElementById("jamindarAiSend")
      .addEventListener("click", handleAiMessage);


    document
      .getElementById("jamindarAiInput")
      .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
          handleAiMessage();
        }

      });

  }


  function handleAiMessage() {

    const input =
      document.getElementById("jamindarAiInput");

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    addAiMessage(message, "user");

    input.value = "";

    setTimeout(function () {

      addAiMessage(
        "मैं आपकी जरूरत समझ रहा हूँ। अगले चरण में मैं आपकी बात से स्थान, रकबा और बजट निकालकर JAMINDAR LAND BAZAAR की approved properties में खोज करूँगा।",
        "ai"
      );

    }, 500);

  }


  function addAiMessage(message, type) {

    const container =
      document.getElementById("jamindarAiMessages");

    if (!container) return;

    const div = document.createElement("div");

    div.style.cssText = `
      margin-bottom:10px;
      padding:11px 13px;
      border-radius:15px;
      font-size:13px;
      line-height:1.5;
      ${
        type === "user"
          ? "background:#064e3b;color:white;margin-left:35px;"
          : "background:white;border:1px solid #e2e8f0;margin-right:20px;"
      }
    `;

    div.textContent = message;

    container.appendChild(div);

    container.scrollTop = container.scrollHeight;

  }

})();
