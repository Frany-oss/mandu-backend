/**
 * Genera un nivel aleatorio entre 1 y 10
 */
export function generateRandomLevel(): number {
  return Math.floor(Math.random() * 10) + 1;
}

/**
 * Genera una cantidad aleatoria de colaboradores entre 1 y 100
 */
export function generateRandomCollaborators(): number {
  return Math.floor(Math.random() * 100) + 1;
}
