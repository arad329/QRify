const errorEl = document.querySelector('.form__error');

const isValidURL = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const showError = (message) => {
  errorEl.textContent = message;
  errorEl.classList.add('is-visible');
  input.classList.add('is-error');
};

const clearError = () => {
  errorEl.classList.remove('is-visible');
  input.classList.remove('is-error');
};

const form = document.querySelector('.form');
const input = document.querySelector('.form__input');
const result = document.querySelector('.result');
const qrWrapper = document.querySelector('.qr-wrapper');
const downloadBtn = document.querySelector('.btn--secondary');
const copyBtn = document.querySelector('.btn--ghost');

let currentQR = null;

const generateQR = (text) => {
  qrWrapper.innerHTML = '';
  currentQR = null;

  try {
    // ساخت div برای QR
    const qrDiv = document.createElement('div');
    qrWrapper.appendChild(qrDiv);

    // ساخت QR
    currentQR = new QRCode(qrDiv, {
      text: text,
      width: 180,
      height: 180,
      colorDark: "#020617",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

  } catch (err) {
    console.error('خطا:', err);
    alert('خطا در ساخت QR کد');
  }
};

const showResult = () => {
  result.style.display = 'flex';
};



const downloadQR = () => {
  if (!currentQR) return;

  const canvas = qrWrapper.querySelector('canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = 'qr-code.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const copyQR = async () => {
  if (!currentQR) return;

  const canvas = qrWrapper.querySelector('canvas');
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    } catch (err) {
      alert('مرورگر از کپی پشتیبانی نمی‌کنه');
    }
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = input.value.trim();

  if (!value) {
    showError('Please enter a URL');
    return;
  }

  if (!isValidURL(value)) {
    showError('That doesn’t look like a valid URL');
    return;
  }

  clearError();
  generateQR(value);
  showResult();
});

downloadBtn.addEventListener('click', downloadQR);
copyBtn.addEventListener('click', copyQR);