const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Lỗi: Không tìm thấy GEMINI_API_KEY trong file .env");
  console.error("Vui lòng thêm GEMINI_API_KEY=your_key_here vào file server/.env");
  process.exit(1);
}

const prompt = `A set of 15 beautifully crafted, artistic book covers, inspired by classical and philosophical literature like "The Alchemist" by Paulo Coelho. The style is a blend of traditional illustration, fine art, and minimalist modern design. Each cover is a unique piece of art, depicting: 1. "Vũ Điệu Của Những Vì Sao" (Nebula and constellations forming a dance), 2. "Chữ Cái Chờ Đợi" (Calligraphic letters intertwining), 3. "Dòng Sông Ký Ức" (Memory river in fine ink-wash style), 4. "Hơi Thở Của Rừng" (Detailed botanical patterns as forest spirits), 5. "Bản Giao Hưởng Của Bóng Đêm" (Piano notes transforming into light creatures), 6. "Con Đường Tơ Lụa" (Camels and old silks), 7. "Giấc Mơ Của Người Thợ Gốm" (Intricate pottery pattern becoming a story), 8. "Vòng Tròn Của Thời Gian" (Ancient gears as a philosophical time wheel), 9. "Linh Hồn Của Những Hòn Đá" (Stone sculptures with native Vietnamese motifs), 10. "Trái Tim Của Biển" (Marine life with flowing abstract coral), 11. "Câu Chuyện Của Những Cánh Diều" (Wind-blown kites with folk art), 12. "Bức Họa Của Gió" (Painter's brushstrokes merging with wind), 13. "Hành Trình Của Những Con Số" (Geometric and number patterns as a puzzle), 14. "Giọng Nói Của Phố Cổ" (Ancient buildings and lanterns), 15. "Kho Báu Của Những Bức Thư" (Letters transforming into historical events). Each cover has a refined, elegant font (like calligraphy) for the Vietnamese title and author name (e.g., "Tác Giả: Tên"). The colors are rich and harmonious (deep blues, warm terracottas, olive greens, and metallic golds). The setting is a flat lay or an organized collection of 15 distinct, square-shaped books on a wooden surface with a soft, natural sunlight, showcasing textures of paper and gold foil. High detail.`;

async function generateImage() {
  console.log("Đang gọi API Nano Banana Pro (Gemini 3 Pro Image) để tạo ảnh...");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content.parts[0].inlineData) {
      console.log("Response JSON:", JSON.stringify(data, null, 2));
      throw new Error("Không tìm thấy dữ liệu ảnh trong phản hồi từ API.");
    }

    const base64Data = data.candidates[0].content.parts[0].inlineData.data;
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log("Đã tạo ảnh thành công! Đang lưu...");
    
    // Lưu vào client/public/images/books/
    const destDir = path.join(__dirname, '..', 'client', 'public', 'images', 'books');
    
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const destPath = path.join(destDir, 'generated_book_collection.png');
    
    fs.writeFileSync(destPath, buffer);
    
    console.log(`\n🎉 Xong! Ảnh đã được lưu thành công tại:`);
    console.log(destPath);

  } catch (error) {
    console.error("Lỗi trong quá trình tạo hoặc lưu ảnh:", error.message || error);
  }
}

// Chạy hàm generate
generateImage();