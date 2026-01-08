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

  const inputs = {
    housing: Number(document.getElementById("housing").value || 0),
    groceries: Number(document.getElementById("groceries").value || 0),
    transportation: Number(document.getElementById("transportation").value || 0),
    utilities: Number(document.getElementById("utilities").value || 0),
    healthcare: Number(document.getElementById("healthcare").value || 0),
    discretionary: Number(document.getElementById("discretionary").value || 0)
  };

  let total = 0;

  for (const key in inputs) {
    total += inputs[key] * ratios[key];
  }

  document.getElementById("result").innerHTML =
    `<strong>Estimated Monthly Cost:</strong> $${total.toFixed(0)}`;
});

