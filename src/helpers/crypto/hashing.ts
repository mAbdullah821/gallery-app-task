import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text string using bcrypt
 * @param {string} plainText - The plain text string to hash
 * @param {number} [saltRounds=10] - Number of salt rounds for bcrypt (optional)
 * @returns {Promise<string>} A promise that resolves to the hashed string
 */
export async function hashString(
  plainText: string,
  saltRounds: number = 10,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);

  return bcrypt.hash(plainText, salt);
}

/**
 * Verifies if a plain text matches a hashed string
 * @param {string} plainText - The plain text to verify
 * @param {string} hashedString - The hashed string to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if matched, false otherwise
 */
export async function verifyHash(
  plainText: string,
  hashedString: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hashedString);
}
