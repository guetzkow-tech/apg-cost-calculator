/* ======================================================
   APG Cost of Living Calculator — Core Logic
   ====================================================== */

let activeCountry = null;

/* ======================================================
   URL-based country preset (e.g. ?country=vietnam)
   ====================================================== */

const params = new URLSearchParams(window.location.search);
const presetCountry = params.get("country");

if (presetCountry) {
  activeCountry = presetCountry.toLowerCase().trim();
}

/* ======================================================
   Currency orientation (NOT exchange guarantees)
   ====================================================== */

const CURRENCY_RATES = {
  USD: 1,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  CAD: "$",
  GBP: "£",
  EUR: "€"
};

/* ======================================================
   DOM Ready
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Hide country buttons if preset via URL
  if (activeCountry) {
    const countriesEl = document.getElementById("countries");
    if (countriesEl) countriesEl.style.display = "none";
    updateCountryTitle();
  }

  // Manual country selection
  document.querySelectorAll("[data-country]").forEach(button => {
    button.addEventListener("click", () => {
      activeCountry = button.dataset.country;
      updateCountryTitle();
    });
  });

  // Recalculate automatically if currency changes
  const currencySelect = document.getElementById("currency");
  if (currencySelect) {
    currencySelect.addEventListener("change", () => {
      if (document.getElementById("result").innerHTML.trim() !== "") {
        calculate();
      }
    });
  }

  // Calculate button
  const calcBtn = document.getElementById("calculate");
  if (calcBtn) {
    calcBtn.addEventListener("click", calculate);
  }
});

/* ======================================================
   Core Calculation
   ====================================================== */

function calculate() {
  if (!activeCountry) {
    alert("Please select a country first.");
    return;
  }

  if (!window.APG_COST_DATA || !APG_COST_DATA.countries[activeCountry]) {
    alert("Country data not found.");
    return;
  }

  const ratios = APG_COST_DATA.countries[activeCountry].buckets;

  const inputs = {
    housing: Number(document.getElementById("housing")?.value || 0),
    groceries: Number(document.getElementById("groceries")?.value || 0),
    transportation: Number(document.getElementById("transportation")?.value || 0),
    utilities: Number(document.getElementById("utilities")?.value || 0),
    healthcare: Number(document.getElementById("healthcare")?.value || 0),
    discretionary: Number(document.getElementById("discretionary")?.value || 0)
  };

  const currency = document.getElementById("currency")?.value || "USD";
  const rate = CURRENCY_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  let currentTotal = 0;
  let targetTotal = 0;

  let currentLines = "";
  let targetLines = "";

  for (const key in inputs) {
    const current = inputs[key];
    const target = current * ratios[key];

    currentTotal += current;
    targetTotal += target;

    currentLines += `
      <div class="apg-result-line">
        <span>${prettyLabel(key)}</span>
        <span>${symbol}${(current * rate).toFixed(0)}</span>
      </div>
    `;

    targetLines += `
      <div class="apg-result-line">
        <span>${prettyLabel(key)}</span>
        <span>${symbol}${(target * rate).toFixed(0)}</span>
      </div>
    `;
  }

  const percentDiff =
    currentTotal === 0 ? 0 : ((targetTotal - currentTotal) / currentTotal) * 100;

  document.getElementById("result").innerHTML = `
    <div class="apg-results">

      <h3>Your Current Monthly Budget</h3>
      ${currentLines}
      <div class="apg-total">
        Total: ${symbol}${(currentTotal * rate).toFixed(0)}
      </div>

      <div class="apg-divider"></div>

      <h3>Estimated Monthly Cost in ${prettyCountry(activeCountry)}</h3>
      ${targetLines}
      <div class="apg-total">
        Total: ${symbol}${(targetTotal * rate).toFixed(0)}
      </div>

      <div class="apg-highlight">
        ${percentDiff >= 0 ? "Increase" : "Decrease"} of
        ${Math.abs(percentDiff).toFixed(1)}%
      </div>

      <div class="apg-note">
        Estimates reflect conservative national averages. Actual costs vary by city,
        housing type, and lifestyle.
      </div>
    </div>
  `;
}

/* ======================================================
   Helpers
   ====================================================== */

function updateCountryTitle() {
  const el = document.getElementById("country-title");
  if (!el || !activeCountry) return;

  el.textContent =
    `${prettyCountry(activeCountry)} — Cost of Living Estimate`;
}

function prettyLabel(key) {
  const map = {
    housing: "Housing",
    groceries: "Groceries",
    transportation: "Transportation",
    utilities: "Utilities",
    healthcare: "Healthcare",
    discretionary: "Dining, Entertainment & Discretionary"
  };
  return map[key] || key;
}

function prettyCountry(slug) {
  return slug.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
