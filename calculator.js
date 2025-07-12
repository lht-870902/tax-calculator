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
function exportExcel() {
  const taxType = document.getElementById("taxType").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const fee = parseFloat(document.getElementById("fee").value);
  const today = new Date();
  const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  // 判斷稅別使用的工作表
  let sheetName, fileName;
  if (taxType === "fb") {
    sheetName = "付款憑單 FB";
    fileName = "付款單_FB.xlsx";
  } else if (taxType === "foreign") {
    sheetName = "付款憑單 境外稅";
    fileName = "付款單_其他境外.xlsx";
  } else {
    alert("臺灣營業稅不適用匯出功能");
    return;
  }

  // base64 → binary
  const binary = atob(excelTemplateBase64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }

  // 使用 XLSX 套件讀取
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return alert("找不到對應工作表");

  // 寫入資料
  sheet["F8"] = { t: "n", v: amount };
  sheet["F9"] = { t: "n", v: fee };
  sheet["D4"] = { t: "s", v: dateStr };

  // 匯出
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
