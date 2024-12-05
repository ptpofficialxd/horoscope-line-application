/* pages/register/customer.js */

import { useRouter } from "next/router";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/th";

const CustomerRegistration = () => {
  const router = useRouter();
  const { lineId } = router.query; // ดึง Line ID จาก query
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    birthdate: "",
    age: "", // จะคำนวณอายุจากวันเกิด
  });

  dayjs.extend(customParseFormat);
  dayjs.locale("th");

  const handleSelectDate = (date) => {
    setFormData({
      ...formData,
      birthdate: date ? date.format("YYYY-MM-DD") : "",
    });
  };

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

    // เช็คว่าเลือกเพศหรือยัง
    if (!formData.gender) {
      alert("กรุณาเลือกเพศของคุณ!");
      return;
    }

    // เช็คว่าเลือกวันเกิดหรือยัง
    if (!formData.birthdate) {
      alert("กรุณาเลือกวันเกิดของคุณ!");
      return; // ถ้ายังไม่เลือกวันเกิดจะไม่ส่งข้อมูลไปที่ API
    }

    // คำนวณอายุ
    const age = calculateAge(formData.birthdate);
    setFormData((prevData) => ({ ...prevData, age }));

    // ส่งข้อมูลไปที่ API
    const response = await fetch("/api/registerCustomerAPI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, lineId, age }),
    });

    if (response.ok) {
      alert("สมัครสมาชิกสำเร็จ \nยินดีต้อนรับเข้าสู่แอปพลิเคชั่นของเรา!");

      // เรียก API เพื่อเชื่อมโยง Rich Menu
      const linkRichMenuResponse = await fetch("/api/linkRichMenuAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }), // ส่ง Line ID ไปเชื่อมโยง Rich Menu
      });

      if (linkRichMenuResponse.ok) {
        console.log("เชื่อมโยง Rich Menu สำเร็จ");
      } else {
        const errorData = await linkRichMenuResponse.json();
        console.error(
          "เกิดข้อผิดพลาดในการเชื่อมโยง Rich Menu:",
          errorData.message
        );
      }

      router.push("/profile"); // ไปหน้า profile
    } else {
      const errorData = await response.json();
      alert(
        `เกิดข้อผิดพลาด: ${errorData.message || "ไม่สามารถสมัครสมาชิกได้"}`
      );
    }
  };

  return (
    <div className="register-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="text-center mb-4">สมัครสมาชิก (ลูกค้า)</h2>
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
            <div className="form-group mb-3">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
              >
                <DatePicker
                  label="วันเกิด"
                  value={formData.birthdate ? dayjs(formData.birthdate) : null}
                  onChange={handleSelectDate}
                  format="DD/MM/YYYY"
                  views={["year", "month", "day"]}
                  yearsOrder="desc"
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      inputProps: {
                        readOnly: true,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                ยืนยันข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
