let activeCountry = null;
// If a country is provided in the URL, auto-select it and hide the country buttons.
const params = new URLSearchParams(window.location.search);
const presetCountry = params.get("country");

if (presetCountry) {
  activeCountry = presetCountry.toLowerCase().trim();
  const countriesEl = document.getElementById("countries");
  if (countriesEl) countriesEl.style.display = "none";
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
   Helper: update all currency symbols
   ====================================================== */

function updateCurrencySymbols() {
  const currencySelect = document.getElementById("currency");
  if (!currencySelect) return;

  const currency = currencySelect.value || "USD";
  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  document.querySelectorAll(".currency-symbol").forEach(el => {
    el.textContent = symbol;
  });
}

/* ======================================================
   Initialization (runs once on page load)
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure symbols default to $
  updateCurrencySymbols();

  // Keep symbols synced when currency changes
  document.getElementById("currency").addEventListener("change", updateCurrencySymbols);

  // Country selection
  document.querySelectorAll("[data-country]").forEach(button => {
    button.addEventListener("click", () => {
      activeCountry = button.dataset.country;
    });
  });

  // Calculate button
  document.getElementById("calculate").addEventListener("click", calculate);
});

/* ======================================================
   Core calculation logic
   ====================================================== */

function calculate() {
  if (!activeCountry) {
    alert("Please select a country first.");
    return;
  }

  const countryData = APG_COST_DATA.countries[activeCountry];
  if (!countryData) {
    alert("Selected country data not found.");
    return;
  }

  const ratios = countryData.buckets;

  const inputs = {
    housing: Number(document.getElementById("housing").value || 0),
    groceries: Number(document.getElementById("groceries").value || 0),
    transportation: Number(document.getElementById("transportation").value || 0),
    utilities: Number(document.getElementById("utilities").value || 0),
    healthcare: Number(document.getElementById("healthcare").value || 0),
    discretionary: Number(document.getElementById("discretionary").value || 0)
  };

  // Baseline monthly total (orientation currency)
  let baselineTotal = 0;
  for (const key in inputs) {
    baselineTotal += inputs[key];
  }

  // Translated lifestyle total (same orientation currency)
  let translatedTotal = 0;
  for (const key in inputs) {
    translatedTotal += inputs[key] * ratios[key];
  }

  const currency = document.getElementById("currency").value || "USD";
  const rate = CURRENCY_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  const baselineDisplay = baselineTotal * rate;
  const translatedDisplay = translatedTotal * rate;

  const differencePercent =
    baselineTotal === 0
      ? 0
      : ((translatedTotal - baselineTotal) / baselineTotal) * 100;

  document.getElementById("result").innerHTML = `
    <div style="padding:16px; border:1px solid #e5e7eb; border-radius:8px; background:#f9fafb;">
      <div><strong>Your current monthly budget:</strong> ${symbol}${baselineDisplay.toFixed(0)}</div>
      <div style="margin-top:6px;">
        <strong>Estimated monthly cost in ${activeCountry.replace(/_/g, " ")}:</strong>
        ${symbol}${translatedDisplay.toFixed(0)}
      </div>
      <div style="margin-top:6px; color:#555;">
        (${differencePercent.toFixed(1)}% difference)
      </div>
      <div style="margin-top:10px; font-size:12px; color:#666;">
        Estimates reflect conservative national averages and approximate currency orientation.
      </div>
    </div>
  `;
}
