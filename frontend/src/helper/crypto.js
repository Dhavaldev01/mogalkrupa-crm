import CryptoJS from "crypto-js";

const SECRET = "kexacode-raviChodvadiya-00467553"; // same as backend

// ✅ Generate SAME key as backend (raw bytes)
const hashBase64 = CryptoJS.SHA256(SECRET).toString(CryptoJS.enc.Base64);

// Step 2: slice (same)
const keyString = hashBase64.substring(0, 32);

// ✅ Step 3: IMPORTANT → use Latin1 (this fixes mismatch)
const KEY = CryptoJS.enc.Latin1.parse(keyString);

// ✅ IV (same)
const IV = CryptoJS.enc.Utf8.parse("\0".repeat(16));

// =======================
// ENCRYPT
// =======================
export const encrypt = (data) => {
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        KEY,
        {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    return encrypted.toString(); // base64
};

// =======================
// DECRYPT
// =======================
export const decrypt = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, KEY, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        // ⚠️ don't directly stringify if broken
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
            throw new Error("Empty or invalid UTF-8 → wrong key/IV");
        }
        return JSON.parse(decrypted);
    } catch (err) {
        console.error("Decrypt error:", err);
        return null;
    }
};