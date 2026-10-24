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

// Actualizar valor del slider
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
  generatePassword(); // regenera al mover
});

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

  const length = Number(lengthInput.value);
  passwordInput.value = buildPassword(length, groups);

  updateStrength(length, uppercaseCheck.checked, lowercaseCheck.checked, numbersCheck.checked, symbolsCheck.checked);
}

// Copiar al portapapeles
const copyStatus = document.getElementById('copyStatus');

// Muestra un aviso debajo de la contraseña y lo borra a los 2 segundos
function showCopyStatus(message, isError) {
  copyStatus.textContent = message;
  copyStatus.classList.toggle('error', isError);
  setTimeout(() => { copyStatus.textContent = ''; }, 2000);
}

copyBtn.addEventListener('click', async () => {
  if (!passwordInput.value || passwordInput.value.includes('Selecciona')) return;

  passwordInput.select();
  try {
    // writeText es asíncrono: "await" espera a saber si de verdad se copió
    await navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = '✅';
    setTimeout(() => copyBtn.textContent = '📋', 2000);
    showCopyStatus('Contraseña copiada', false);
  } catch (error) {
    // Pasa si el navegador no permite copiar (por ejemplo, sin HTTPS)
    showCopyStatus('No se pudo copiar: la contraseña quedó seleccionada, cópiala a mano', true);
  }
});

// Actualizar barra de fuerza
function updateStrength(length, hasUpper, hasLower, hasNumber, hasSymbol) {
  const strength = strengthScore(length, hasUpper, hasLower, hasNumber, hasSymbol);

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