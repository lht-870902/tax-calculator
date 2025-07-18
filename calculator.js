function updateLabel() {
  const taxType = document.getElementById('taxType').value;
  const label = document.getElementById('amountLabel');
  const feeBlock = document.getElementById('feeBlock');

  if (taxType === 'fb' || taxType === 'foreign') {
    label.textContent = '請輸入發票/信用卡金額：';
    feeBlock.style.display = 'block';
  } else {
    label.textContent = '請輸入發票金額或含稅金額：';
    feeBlock.style.display = 'none';
  }
}

function formatCurrency(amount) {
  return Math.round(amount).toLocaleString('zh-TW');
}

function calculateTax() {
  const type = document.getElementById('taxType').value;
  const amount = parseFloat(document.getElementById('amount').value) || 0;
  const fee = parseFloat(document.getElementById('fee').value) || 0;
  let total = 0;
  let tax = 0;

  if (type === 'fb') {
    total = amount / 0.97;
    tax = Math.floor(total * 0.03);
  } else if (type === 'foreign') {
    total = amount / 0.8;
    tax = Math.floor(total * 0.2);
  } else if (type === 'taiwan') {
    tax = Math.round((amount / 1.05) * 0.05);
    total = amount;
  }

  const requesterAmount = (type === 'taiwan') ? amount : amount + fee;

  let output = '';
  if (type === 'taiwan') {
    output += `營業稅：${formatCurrency(tax)} 元\n`;
  } else {
    output += `國稅局：${formatCurrency(tax)} 元\n`;
  }
  output += `請款人：${formatCurrency(requesterAmount)} 元`;

  const resultDiv = document.getElementById('result');
  resultDiv.textContent = output;
  resultDiv.classList.add('show');
}

function setupAutoClear(id) {
  const input = document.getElementById(id);
  input.addEventListener('focus', () => {
    if (input.value === "0") input.value = "";
  });
  input.addEventListener('blur', () => {
    if (input.value === "") input.value = "0";
  });
}

document.getElementById('taxType').addEventListener('change', updateLabel);
window.onload = function () {
  updateLabel();
  setupAutoClear("amount");
  setupAutoClear("fee");
};