function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateTax() {
  const taxType = document.getElementById("taxType").value;
  const amountInput = document.getElementById("amount");
  const feeInput = document.getElementById("fee");
  const resultDiv = document.getElementById("result");

  let amount = Number(amountInput.value);
  let fee = Number(feeInput.value);

  if (amount < 0 || isNaN(amount)) {
    resultDiv.textContent = "請輸入有效的發票金額";
    resultDiv.classList.add("show");
    return;
  }
  if (fee < 0 || isNaN(fee)) {
    resultDiv.textContent = "請輸入有效的手續費金額";
    resultDiv.classList.add("show");
    return;
  }

  let tax = 0;
  let netAmount = 0;

  switch (taxType) {
    case "fb":
      tax = Math.floor(amount * 0.03);
      netAmount = amount - tax - fee;
      break;
    case "foreign":
      tax = Math.floor(amount * 0.20);
      netAmount = amount - tax - fee;
      break;
    case "taiwan":
      tax = Math.round((amount / 1.05) * 0.05);
      netAmount = amount - tax - fee;
      break;
  }

  resultDiv.innerHTML = `
    發票金額：${formatNumber(amount)}<br>
    手續費：${formatNumber(fee)}<br>
    稅額：${formatNumber(tax)}<br>
    請款人實領金額：${formatNumber(netAmount)}
  `;
  resultDiv.classList.add("show");
}
