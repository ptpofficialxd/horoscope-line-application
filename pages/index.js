/* pages/index.js */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import liff from "@line/liff"; // ใช้ LINE LIFF SDK
import "bootstrap/dist/css/bootstrap.min.css"; // เพิ่มการใช้งาน Bootstrap

const Index = () => {
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

          // เมื่อผู้ใช้ล็อกอินแล้ว ให้เปลี่ยนเส้นทางไปหน้า test.js
          router.push("/register");
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

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="mb-4">กำลังโหลดข้อมูล...</h1>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
        ) : userProfile ? (
          <div>
            <p>ระบบกำลังนำคุณไปยังหน้าสมัครสมาชิก กรุณารอสักครู่</p>
          </div>
        ) : (
          <div>
            <p className="text-danger">
              เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE <br />
              หรือไม่ได้รับอนุญาตให้ใช้ Application นี้!
            </p>
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
