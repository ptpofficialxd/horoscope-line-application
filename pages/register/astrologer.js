/* pages/register/astrologer.js */

import { useRouter } from "next/router";
import { useState } from "react";

// ฟังก์ชันคำนวณอายุจากวันเกิด
const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const AstrologerRegistration = () => {
  const router = useRouter();
  const { lineId } = router.query; // ดึง Line ID จาก query
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthdate: "",
    gender: "",
    selfDescription: "", // รายละเอียดเกี่ยวกับตัวเอง
    branch: "", // สาขาที่เชี่ยวชาญ
    age: "", // คำนวณอายุจากวันเกิด
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nameRegex = /^[A-Za-zก-ฮะ-์]+$/; // ชื่อและนามสกุลต้องเป็นตัวอักษรทั้งภาษาอังกฤษและไทย
    if (!nameRegex.test(formData.firstName)) {
      alert("กรุณากรอกชื่อเป็นตัวอักษรเท่านั้น!");
      return; // ถ้าชื่อไม่ถูกต้องจะไม่ส่งข้อมูลไปที่ API
    }
  
    if (!nameRegex.test(formData.lastName)) {
      alert("กรุณากรอกนามสกุลเป็นตัวอักษรเท่านั้น!");
      return; // ถ้านามสกุลไม่ถูกต้องจะไม่ส่งข้อมูลไปที่ API
    }
  
    // เช็คว่าเบอร์โทรศัพท์มีตัวเลขและมีความยาว 10 ตัว
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("กรุณากรอกเบอร์โทรศัพท์ที่เป็นตัวเลข 10 หลัก!");
      return; // ถ้าเบอร์ไม่ถูกต้องจะไม่ส่งข้อมูลไปที่ API
    }

    // เช็คว่าเลือกวันเกิดหรือยัง
    if (!formData.birthdate) {
      alert("กรุณาเลือกวันเกิดของคุณ!");
      return; // ถ้ายังไม่เลือกวันเกิดจะไม่ส่งข้อมูลไปที่ API
    }
  
    // เช็คว่าเลือกเพศหรือยัง
    if (!formData.gender) {
      alert("กรุณาเลือกเพศของคุณ!");
      return;
    }
  
    // ตรวจสอบว่า "รายละเอียดเกี่ยวกับตัวเอง" ถูกกรอกหรือยัง
    if (!formData.selfDescription) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return; // ถ้าไม่กรอกจะไม่ส่งข้อมูลไปที่ API
    }
  
    // ตรวจสอบว่า "สาขาวิชาที่เชี่ยวชาญ" ถูกกรอกหรือยัง
    if (!formData.branch) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return; // ถ้าไม่กรอกจะไม่ส่งข้อมูลไปที่ API
    }
  
    // คำนวณอายุ
    const age = calculateAge(formData.birthdate);
  
    // อัปเดตค่า age ใน formData ก่อนส่งไปที่ API
    setFormData((prevData) => ({
      ...prevData,
      age, // เพิ่ม age ที่คำนวณแล้ว
    }));
  
    // ส่งข้อมูลไปที่ API
    const response = await fetch("/api/registerAstrologerAPI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, lineId, age }), // ส่ง age ที่คำนวณแล้วไปด้วย
    });
  
    if (response.ok) {
      alert("สมัครสมาชิกสำเร็จ \nยินดีต้อนรับเข้าสู่แอปพลิเคชั่นของเรา!");

      // เรียก API เพื่อเชื่อมโยง Rich Menu
      const linkRichMenuResponse = await fetch("/api/linkRichMenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }), // ส่ง Line ID ไปเชื่อมโยง Rich Menu
      });

      if (linkRichMenuResponse.ok) {
        console.log("เชื่อมโยง Rich Menu สำเร็จ");
      } else {
        const errorData = await linkRichMenuResponse.json();
        console.error("เกิดข้อผิดพลาดในการเชื่อมโยง Rich Menu:", errorData.message);
      }

      router.push("/success"); // ไปหน้า Success
    } else {
      const errorData = await response.json();
      alert(`เกิดข้อผิดพลาด: ${errorData.message || "ไม่สามารถสมัครสมาชิกได้"}`);
    }
  };  

  return (
    <div className="register-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="text-center mb-4">สมัครสมาชิก (หมอดู)</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="ชื่อ"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="นามสกุล"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="เบอร์โทรศัพท์"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="date"
                className="form-control"
                value={formData.birthdate}
                onChange={(e) =>
                  setFormData({ ...formData, birthdate: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-4">
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="" disabled>
                  เพศ
                </option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="others">อื่นๆ</option>
              </select>
            </div>
            {/* รายละเอียดเกี่ยวกับตัวเอง */}
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                placeholder="รายละเอียดเกี่ยวกับตัวเอง"
                value={formData.selfDescription}
                onChange={(e) =>
                  setFormData({ ...formData, selfDescription: e.target.value })
                }
              />
            </div>

            {/* สาขาที่เชี่ยวชาญ */}
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                placeholder="สาขาวิชาที่เชี่ยวชาญ"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                สมัคร
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AstrologerRegistration;
