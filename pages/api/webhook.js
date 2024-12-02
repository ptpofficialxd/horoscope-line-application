import axios from "axios";
import { createAstrologerFlexMessage } from "../../utils/flexMessage"; // ปรับ path ให้ตรงกับตำแหน่งไฟล์

// LINE Access Token (แทนที่ด้วย Access Token จริงของคุณ)
const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const replyMessage = async (replyToken, message) => {
  const url = "https://api.line.me/v2/bot/message/reply";
  const headers = {
    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const body = {
    replyToken,
    messages: [message],
  };

  try {
    await axios.post(url, body, { headers });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userMessage = event.message.text.trim();
        const replyToken = event.replyToken;

        if (userMessage === "ติดต่อหมอดู") {
          // ตัวอย่างข้อมูลหมอดู (mock data)
          const astrologerData = {
            firstName: "PTP",
            lastName: "TestTwo",
            phone: "0886317937",
          };

          // สร้าง Flex Message โดยใช้ฟังก์ชันจากไฟล์ utils/flexMessage.js
          const flexMessage = createAstrologerFlexMessage(astrologerData);

          await replyMessage(replyToken, flexMessage);
        } else {
          const message = {
            type: "text",
            text: "กรุณาพิมพ์ 'ติดต่อหมอดู' เพื่อรับข้อมูลค่ะ!",
          };

          await replyMessage(replyToken, message);
        }
      }
    }

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
