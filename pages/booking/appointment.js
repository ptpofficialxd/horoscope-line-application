import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";
import { branchOptions } from "../../models/branchOptions";

const AppointmentBooking = () => {
  const router = useRouter();
  const { lineId } = router.query;

  const [formData, setFormData] = useState({
    branch: [],
    serviceTime: "",
  });

  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectBranch = (selectedOptions) => {
    const selectedBranches = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({
      ...formData,
      branch: selectedBranches,
    });
  };

  const handleSelectServiceTime = (e) => {
    setFormData({
      ...formData,
      serviceTime: e.target.value,
    });
  };

  const handleSearchAstrologers = async () => {
    if (formData.branch.length === 0 && !formData.serviceTime) {
      alert("กรุณาเลือกสาขาที่เชี่ยวชาญหรือช่วงเวลาให้บริการ");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/appointmentBookingAPI', {
        branch: formData.branch,
        serviceTime: formData.serviceTime,
      });

      if (response.data && response.data.length > 0) {
        setAstrologers(response.data);
      } else {
        setAstrologers([]);
      }
    } catch (error) {
      console.error("Error fetching astrologers:", error);
      setAstrologers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="text-center mb-4">ค้นหาหมอดู</h2>
          <div className="form-group mb-3">
            <Select
              isMulti
              options={branchOptions}
              onChange={handleSelectBranch}
              placeholder="เลือกสาขาที่เชี่ยวชาญ"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="form-group mb-3">
            <select className="form-control" onChange={handleSelectServiceTime}>
              <option value="">เลือกช่วงเวลาให้บริการ</option>
              <option value="morning">ให้บริการในช่วงเช้า (07:00 - 12:00)</option>
              <option value="afternoon">ให้บริการในช่วงเย็น (12:00 เป็นต้นไป)</option>
            </select>
          </div>
          <div className="d-grid">
            <button className="btn btn-primary" onClick={handleSearchAstrologers}>
              ค้นหาหมอดู
            </button>
          </div>
          {loading && <p className="text-center mt-3">กำลังโหลด...</p>}
          <div className="mt-3">
            {astrologers.length > 0 ? (
              astrologers.map((astrologer) => (
                <div key={astrologer._id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{astrologer.firstName} {astrologer.lastName}</h5>
                    <p className="card-text">เบอร์โทรศัพท์: {astrologer.phone}</p>
                    <p className="card-text">เพศ: {astrologer.gender}</p>
                    <p className="card-text">อายุ: {astrologer.age}</p>
                    <p className="card-text">รายละเอียด: {astrologer.selfDescription}</p>
                    <p className="card-text">สาขาที่เชี่ยวชาญ: {astrologer.branch.join(', ')}</p>
                  </div>
                </div>
              ))
            ) : (
              !loading && <p className="text-center mt-3">ค้นหาหมอดูไม่พบ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;