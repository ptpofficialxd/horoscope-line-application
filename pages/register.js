/* pages/register.js */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import liff from "@line/liff"; // ใช้ LINE LIFF SDK
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
  const [userProfile, setUserProfile] = useState(null); // เก็บข้อมูลโปรไฟล์ผู้ใช้
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const router = useRouter();

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // เริ่มต้น LIFF SDK
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });

        // ตรวจสอบสถานะการล็อกอิน
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserProfile(profile); // เก็บข้อมูลโปรไฟล์ผู้ใช้
        } else {
          // ถ้าไม่ได้ล็อกอิน ให้ทำการขออนุญาต
          liff.login(); // จะเปิดหน้าต่างให้ผู้ใช้ล็อกอิน
        }
      } catch (err) {
        console.error("LIFF Initialization Error:", err);
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จ จะตั้งค่า loading เป็น false
      }
    };

    initializeLiff();
  }, []);

  const handleSelectCustomer = () => {
    router.push({
      pathname: "/register/customer",
      query: { lineId: userProfile.userId }, // ส่ง Line ID ไปยังหน้าลูกค้า
    });
  };

  const handleSelectAstrologer = () => {
    router.push({
      pathname: "/register/astrologer",
      query: { lineId: userProfile.userId }, // ส่ง Line ID ไปยังหน้าหมอดูดวง
    });
  };

  const handleLogout = () => {
    liff.logout(); // ทำการออกจากระบบ LINE
    setUserProfile(null); // รีเซ็ตข้อมูลโปรไฟล์
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID }); // รีสตาร์ท LIFF
    window.location.reload(); // รีเฟรชหน้าหลังจากออกจากระบบ
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center p-4 border rounded shadow-lg">
        <h1 className="mb-4 text-primary">กรุณาเลือกประเภทผู้ใช้งาน</h1>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">กำลังโหลด...</span>
          </div>
        ) : userProfile ? (
          <>
            <h4 className="mb-4">
              ยินดีต้อนรับ, <strong>{userProfile.displayName}</strong>
            </h4>
            <button
              onClick={handleSelectCustomer}
              className="btn btn-success w-100 mb-3"
            >
              ฉันเป็นลูกค้า
            </button>
            <button
              onClick={handleSelectAstrologer}
              className="btn btn-warning w-100 mb-3"
            >
              ฉันเป็นหมอดูดวง
            </button>
          </>
        ) : (
          <p className="text-danger">
            เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE <br />
            หรือไม่ได้รับอนุญาตให้ใช้ Application นี้!
          </p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-danger position-fixed top-0 end-0 m-3"
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default RegisterPage;
