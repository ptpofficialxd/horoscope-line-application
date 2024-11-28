/* public/liff.js */

export const initializeLiff = () => {
  return new Promise((resolve, reject) => {
    // ตรวจสอบว่า LIFF SDK ถูกโหลดหรือยัง
    if (window.liff) {
      console.log("LIFF SDK already loaded");
      resolve(window.liff);
      return;
    }

    // โหลด LIFF SDK
    const script = document.createElement("script");
    script.src = "https://d.line-scdn.net/liff/2.1/sdk.js"; // URL ของ LIFF SDK
    script.onload = () => {
      console.log("LIFF SDK loaded");
      window.liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID }) // ใช้ LIFF ID จาก Environment Variable
        .then(() => resolve(window.liff))
        .catch((err) => {
          console.error("LIFF initialization failed:", err);
          reject(err);
        });
    };
    script.onerror = () => {
      console.error("Failed to load LIFF SDK");
      reject("Failed to load LIFF SDK");
    };
    document.body.appendChild(script);
  });
};
