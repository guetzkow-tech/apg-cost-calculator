let activeCountry = null;

// Handle country selection
document.querySelectorAll("[data-country]").forEach(button => {
  button.addEventListener("click", () => {
    activeCountry = button.dataset.country;
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

  // Read inputs
  const inputs = {
    housing: Number(document.getElementById("housing").value || 0),
    groceries: Number(document.getElementById("groceries").value || 0),
    transportation: Number(document.getElementById("transportation").value || 0),
    utilities: Number(document.getElementById("utilities").value || 0),
    healthcare: Number(document.getElementById("healthcare").value || 0),
    discretionary: Number(document.getElementById("discretionary").value || 0)
  };

  // Step 1: total current monthly spend
  let currentTotal = 0;
  for (const key in inputs) {
    currentTotal += inputs[key];
  }

  // Step 2: translate lifestyle using country ratios
  let adjustedTotal = 0;
  for (const key in inputs) {
    adjustedTotal += inputs[key] * ratios[key];
  }

  // Step 3: compute difference
  const differencePercent =
    ((adjustedTotal - currentTotal) / currentTotal) * 100;

  // Step 4: display result cleanly
  document.getElementById("result").innerHTML = `
    <div style="padding:16px; border:1px solid #e5e7eb; border-radius:8px; background:#f9fafb;">
      <div><strong>Your current monthly budget:</strong> $${currentTotal.toFixed(0)}</div>
      <div style="margin-top:6px;">
        <strong>Estimated monthly cost in ${activeCountry.replace(/_/g, " ")}:</strong>
        $${adjustedTotal.toFixed(0)}
      </div>
      <div style="margin-top:6px; color:#555;">
        (${differencePercent.toFixed(1)}% difference)
      </div>
    </div>
  `;
});
