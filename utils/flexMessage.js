// flexMessage.js

export const createAstrologerFlexMessage = (astrologerData) => {
    return {
      type: "flex",
      altText: "ข้อมูลหมอดู",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://example.com/image.jpg", // ใส่ URL ของรูปโปรไฟล์
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${astrologerData.firstName} ${astrologerData.lastName}`,
              weight: "bold",
              size: "xl",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "โทรศัพท์",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: astrologerData.phone,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "LINE",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `https://line.me/ti/p/tESt786FYh`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "ดูโปรไฟล์",
                uri: `https://line.me/ti/p/tESt786FYh`,
              },
            },
          ],
          flex: 0,
        },
      },
    };
  };
  