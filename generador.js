// Lógica pura del generador: crea contraseñas y calcula su fuerza.
// No toca la pantalla, así se puede probar sola con Node (ver tests/).

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

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

// Crea una contraseña de `length` caracteres con al menos uno de cada grupo.
// `groups` es una lista de textos, por ejemplo [uppercase, numbers].
function buildPassword(length, groups) {
  const chars = groups.join('');
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
  return secureShuffle(password).join('');
}

// Puntaje de fuerza de 0 a 7: hasta 3 por longitud y 1 por cada tipo usado
function strengthScore(length, hasUpper, hasLower, hasNumber, hasSymbol) {
  let strength = 0;
  if (length >= 8) strength++;
  if (length >= 12) strength++;
  if (length >= 16) strength++;
  if (hasUpper) strength++;
  if (hasLower) strength++;
  if (hasNumber) strength++;
  if (hasSymbol) strength++;
  return strength;
}

// Permite usar estas funciones en Node (pruebas); en el navegador se ignora.
if (typeof module !== 'undefined') {
  module.exports = { uppercase, lowercase, numbers, symbols, secureRandomIndex, secureShuffle, buildPassword, strengthScore };
}
