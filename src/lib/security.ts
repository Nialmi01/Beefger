/**
 * BEFFGER Security Core
 * Cryptographic hashing, session signing, and anti-tampering defenses
 */

const SESSION_SECRET =
  process.env.BEFFGER_SESSION_SECRET ||
  'beffger_2026_super_hardened_secret_key_8f94e2b6a1c7d0e3';

/**
 * Pure synchronous SHA-256 implementation compatible across Node, Edge, and all browsers
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0,
    j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, number> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const t1 =
        hash[7] +
        (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) +
        ch +
        k[i] +
        (w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
      const t2 =
        (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;
      hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[3] + t1) | 0, hash[4], hash[5], hash[6]];
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export interface SessionPayload {
  id: string;
  role: string;
  email: string;
  issuedAt: number;
}

/**
 * Creates a cryptographically signed session token: payload.signature
 */
export function signSession(payload: { id: string; role: string; email: string }): string {
  const fullPayload: SessionPayload = {
    ...payload,
    issuedAt: Date.now(),
  };
  const jsonStr = JSON.stringify(fullPayload);
  const signature = sha256(`${jsonStr}:${SESSION_SECRET}`);
  return `${jsonStr}.${signature}`;
}

/**
 * Validates a signed session token. Returns parsed payload if signature matches, null otherwise.
 */
export function verifySession(rawToken: string): SessionPayload | null {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const lastDot = rawToken.lastIndexOf('.');
  if (lastDot === -1) return null;

  const jsonStr = rawToken.substring(0, lastDot);
  const receivedSig = rawToken.substring(lastDot + 1);
  const expectedSig = sha256(`${jsonStr}:${SESSION_SECRET}`);

  if (receivedSig !== expectedSig) {
    return null; // Signature tampered with!
  }

  try {
    const payload: SessionPayload = JSON.parse(jsonStr);
    if (!payload || !payload.id || !payload.role || !payload.email) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}
