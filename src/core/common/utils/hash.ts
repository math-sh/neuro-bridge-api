import loadArgon2idWasm from 'argon2id';
export async function hashPassword(password: string): Promise<string> {
  const argon2id = await loadArgon2idWasm();
  const hash = argon2id({
    password: new TextEncoder().encode(password),
    salt: crypto.getRandomValues(new Uint8Array(32)),
    parallelism: 4,
    passes: 3,
    memorySize: 2 ** 16,
  });

  return Buffer.from(hash).toString('hex');
}
