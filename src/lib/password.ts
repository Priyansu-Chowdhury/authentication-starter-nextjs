export const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltString = btoa(String.fromCharCode(...salt));

  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, [
    "deriveBits",
  ]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: 100000,
    },
    key,
    256
  );

  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));

  return `${saltString}.${hash}`;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const [saltString, storedHash] = hashedPassword.split(".");
  if (!saltString || !storedHash) {
    throw new Error("Invalid hashed password format");
  }

  const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));

  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, [
    "deriveBits",
  ]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: 100000,
    },
    key,
    256
  );

  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));

  return hash === storedHash;
};
