const test = require('node:test');
const assert = require('node:assert');
const g = require('../generador.js');

const todos = [g.uppercase, g.lowercase, g.numbers, g.symbols];
const tiene = (texto, grupo) => [...texto].some(c => grupo.includes(c));

test('la contraseña tiene la longitud pedida', () => {
  assert.strictEqual(g.buildPassword(8, todos).length, 8);
  assert.strictEqual(g.buildPassword(50, todos).length, 50);
});

test('siempre trae al menos un carácter de cada tipo marcado', () => {
  for (let i = 0; i < 500; i++) {
    const p = g.buildPassword(8, todos);
    for (const grupo of todos) assert.ok(tiene(p, grupo), `falta un tipo en ${p}`);
  }
});

test('no usa caracteres de tipos sin marcar', () => {
  const p = g.buildPassword(30, [g.numbers]);
  assert.match(p, /^[0-9]{30}$/);
});

test('el índice aleatorio nunca se sale del rango', () => {
  for (let i = 0; i < 1000; i++) {
    const n = g.secureRandomIndex(7);
    assert.ok(n >= 0 && n < 7);
  }
});

test('mezclar no pierde ni agrega elementos', () => {
  const mezclado = g.secureShuffle([1, 2, 3, 4, 5]);
  assert.deepStrictEqual([...mezclado].sort(), [1, 2, 3, 4, 5]);
});

test('puntaje de fuerza', () => {
  assert.strictEqual(g.strengthScore(0, false, false, false, false), 0);
  assert.strictEqual(g.strengthScore(16, false, true, false, false), 4);
  assert.strictEqual(g.strengthScore(16, true, true, true, true), 7);
});
