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

// Índice aleatorio uniforme en [0, max) usando el generador criptográfico
// del navegador. Descarta los valores del final del rango (rejection sampling)
// para que el módulo no favorezca a ningún carácter.
function secureRandomIndex(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

// Mezcla un arreglo al azar (algoritmo Fisher-Yates) usando el generador seguro
function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generar contraseña
function generatePassword() {
  // Lista de los grupos de caracteres que el usuario marcó
  const groups = [];
  if (uppercaseCheck.checked) groups.push(uppercase);
  if (lowercaseCheck.checked) groups.push(lowercase);
  if (numbersCheck.checked) groups.push(numbers);
  if (symbolsCheck.checked) groups.push(symbols);

  if (groups.length === 0) {
    passwordInput.value = 'Selecciona al menos una opción 😅';
    updateStrength(0);
    return;
  }

  const chars = groups.join('');
  const length = Number(lengthInput.value);
  const password = [];

  // 1) Garantiza al menos un carácter de cada grupo marcado
  for (const group of groups) {
    password.push(group.charAt(secureRandomIndex(group.length)));
  }
  // 2) Rellena el resto con cualquier carácter permitido
  while (password.length < length) {
    password.push(chars.charAt(secureRandomIndex(chars.length)));
  }
  // 3) Mezcla para que los garantizados no queden siempre al principio
  passwordInput.value = secureShuffle(password).join('');

  updateStrength(length, uppercaseCheck.checked, lowercaseCheck.checked, numbersCheck.checked, symbolsCheck.checked);
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
function updateStrength(length, hasUpper, hasLower, hasNumber, hasSymbol) {
  let strength = 0;
  if (length >= 8) strength++;
  if (length >= 12) strength++;
  if (length >= 16) strength++;
  if (hasUpper) strength++;
  if (hasLower) strength++;
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