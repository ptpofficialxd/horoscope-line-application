/* pages/profile.js */

import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null); // สำหรับเก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // สำหรับสถานะการโหลด
  const [error, setError] = useState(null); // สำหรับสถานะข้อผิดพลาด

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/getUserDataAPI");
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูล API ผู้ใช้งานได้");
        }
        const data = await response.json();
        setUserData(data); // ตั้งค่าข้อมูลผู้ใช้
      } catch (err) {
        setError(err.message); // ตั้งค่าข้อผิดพลาดถ้ามี
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จ
      }
    };

    fetchUserData(); // เรียกใช้งานฟังก์ชันเมื่อโหลดคอมโพเนนต์
  }, []); // [] หมายความว่าใช้ effect แค่ครั้งเดียวหลังจากคอมโพเนนต์โหลด

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h1 className="mb-4">กำลังโหลดข้อมูล...</h1>
          <p>ระบบกำลังนำคุณไปยังหน้าโปรไฟล์ กรุณารอสักครู่</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h1 className="mb-4 text-danger">เกิดข้อผิดพลาดในการโหลดข้อมูล</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="card shadow-lg">
        <div className="card-body">
          {userData.customer ? (
            <div>
              <h2 className="text-center">โปรไฟล์สมาชิก</h2>
              <p>
                <strong>ชื่อ:</strong> {userData.customer.firstName}{" "}
                {userData.customer.lastName}
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong> {userData.customer.phone}
              </p>
              <p>
                <strong>วันเกิด:</strong> {userData.customer.birthdate}
              </p>
              <p>
                <strong>อายุ:</strong> {userData.customer.age}
              </p>
              <p>
                <strong>เพศ:</strong>{" "}
                {
                  // แปลงค่าของ gender เป็นภาษาไทย
                  userData.customer.gender === "male"
                    ? "ชาย"
                    : userData.customer.gender === "female"
                    ? "หญิง"
                    : userData.customer.gender === "others"
                    ? "อื่นๆ"
                    : ""
                }
              </p>
              <p>
                <strong>ประเภทผู้ใช้งาน:</strong>{" "}
                {
                  // แปลงค่าของ userType เป็นภาษาไทย
                  userData.customer.userType === "customer" ? "ลูกค้า" : ""
                }
              </p>
              <p>
                <strong>วันที่สร้างบัญชี:</strong> {userData.customer.createdAt}
              </p>
            </div>
          ) : userData.astrologer ? (
            <div>
              <h2 className="text-center">โปรไฟล์สมาชิก</h2>
              <p>
                <strong>ชื่อ:</strong> {userData.astrologer.firstName}{" "}
                {userData.astrologer.lastName}
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong> {userData.astrologer.phone}
              </p>
              <p>
                <strong>วันเกิด:</strong> {userData.astrologer.birthdate}
              </p>
              <p>
                <strong>อายุ:</strong> {userData.astrologer.age}
              </p>
              <p>
                <strong>เพศ:</strong>{" "}
                {
                  // แปลงค่าของ gender เป็นภาษาไทย
                  userData.astrologer.gender === "male"
                    ? "ชาย"
                    : userData.astrologer.gender === "female"
                    ? "หญิง"
                    : userData.astrologer.gender === "others"
                    ? "อื่นๆ"
                    : ""
                }
              </p>
              <p>
                <strong>ประเภทผู้ใช้งาน:</strong>{" "}
                {
                  // แปลงค่าของ userType เป็นภาษาไทย
                  userData.astrologer.userType === "astrologer"
                    ? "หมอดูดวง"
                    : ""
                }
              </p>
              <p>
                <strong>รายละเอียดเกี่ยวกับตัวเอง:</strong>{" "}
                {userData.astrologer.selfDescription}
              </p>
              <p>
                <strong>สาขาวิชาที่เชี่ยวชาญ:</strong>{" "}
                {userData.astrologer.branch}
              </p>
              <p>
                <strong>วันที่สร้างบัญชี:</strong>{" "}
                {userData.astrologer.createdAt}
              </p>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
