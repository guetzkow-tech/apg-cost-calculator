let activeCountry = null;

// Approximate currency conversion (planning only)
const CURRENCY_RATES = {
  USD: 1,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92
};

// Handle country selection
document.querySelectorAll("[data-country]").forEach(button => {
  button.addEventListener("click", () => {
    activeCountry = button.dataset.country;
  });
});


const CURRENCY_SYMBOLS = {
  USD: "$",
  CAD: "$",
  GBP: "£",
  EUR: "€"
};

// Update currency symbols when selector changes
document.getElementById("currency").addEventListener("change", (e) => {
  const symbol = CURRENCY_SYMBOLS[e.target.value] || "$";
  document.querySelectorAll(".currency-symbol").forEach(el => {
    el.textContent = symbol;
  });
});

// Handle calculation
document.getElementById("calculate").addEventListener("click", () => {
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

  // Step 1: total current monthly spend (USD)
  let currentTotalUSD = 0;
  for (const key in inputs) {
    currentTotalUSD += inputs[key];
  }

  // Step 2: translate lifestyle (USD)
  let adjustedTotalUSD = 0;
  for (const key in inputs) {
    adjustedTotalUSD += inputs[key] * ratios[key];
  }

  // Step 3: apply display currency
  const currency = document.getElementById("currency").value;
  const rate = CURRENCY_RATES[currency] || 1;

  const currentTotal = currentTotalUSD * rate;
  const adjustedTotal = adjustedTotalUSD * rate;

  const differencePercent =
    ((adjustedTotalUSD - currentTotalUSD) / currentTotalUSD) * 100;

  // Step 4: display
  document.getElementById("result").innerHTML = `
    <div style="padding:16px; border:1px solid #e5e7eb; border-radius:8px; background:#f9fafb;">
      <div><strong>Your current monthly budget:</strong> ${currency} ${currentTotal.toFixed(0)}</div>
      <div style="margin-top:6px;">
        <strong>Estimated monthly cost in ${activeCountry.replace(/_/g, " ")}:</strong>
        ${currency} ${adjustedTotal.toFixed(0)}
      </div>
      <div style="margin-top:6px; color:#555;">
        (${differencePercent.toFixed(1)}% difference)
      </div>
      <div style="margin-top:10px; font-size:12px; color:#666;">
        Estimates use approximate currency conversions for planning purposes.
      </div>
    </div>
  `;
});
