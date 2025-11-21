const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');
const strengthText = document.getElementById('strengthText');
const strengthBar = document.getElementById('strengthBar');

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Actualizar valor del slider
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
  generatePassword(); // regenera al mover
});

// Generar contraseña
function generatePassword() {
  let chars = '';
  if (uppercaseCheck.checked) chars += uppercase;
  if (lowercaseCheck.checked) chars += lowercase;
  if (numbersCheck.checked) chars += numbers;
  if (symbolsCheck.checked) chars += symbols;

  if (chars === '') {
    passwordInput.value = 'Selecciona al menos una opción 😅';
    updateStrength(0);
    return;
  }

  let password = '';
  const length = lengthInput.value;
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  passwordInput.value = password;
  updateStrength(length, uppercaseCheck.checked, numbersCheck.checked, symbolsCheck.checked);
}

// Copiar al portapapeles
copyBtn.addEventListener('click', () => {
  if (!passwordInput.value || passwordInput.value.includes('Selecciona')) return;
  
  passwordInput.select();
  navigator.clipboard.writeText(passwordInput.value);
  
  copyBtn.textContent = '✅';
  setTimeout(() => copyBtn.textContent = '📋', 2000);
});

// Actualizar barra de fuerza
function updateStrength(length, hasUpper, hasNumber, hasSymbol) {
  let strength = 0;
  if (length >= 8) strength++;
  if (length >= 12) strength++;
  if (length >= 16) strength++;
  if (hasUpper) strength++;
  if (hasNumber) strength++;
  if (hasSymbol) strength++;

  strengthBar.className = '';
  if (strength <= 2) {
    strengthText.textContent = 'Débil';
    strengthBar.classList.add('weak');
  } else if (strength <= 4) {
    strengthText.textContent = 'Media';
    strengthBar.classList.add('medium');
  } else if (strength <= 5) {
    strengthText.textContent = 'Fuerte';
    strengthBar.classList.add('strong');
  } else {
    strengthText.textContent = 'Muy fuerte';
    strengthBar.classList.add('very-strong');
  }
}

// Eventos
generateBtn.addEventListener('click', generatePassword);
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(cb => {
  cb.addEventListener('change', generatePassword);
});

// Generar una al cargar
generatePassword();