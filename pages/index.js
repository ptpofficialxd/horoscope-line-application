import React, { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');  // ใช้เพื่อแสดงข้อความ

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/registerCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email }),
      });

      // รับผลลัพธ์จาก API
      const result = await response.json();
      
      if (response.ok) {
        setMessage(result.message);  // แสดงข้อความเมื่อสำเร็จ
      } else {
        setMessage(`Error: ${result.message}`);  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong');
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      {/* แสดงข้อความตอบสนองจาก API */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
