const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện của ThanhStore - cửa hàng sách trực tuyến hàng đầu Việt Nam.

Nhiệm vụ của bạn:
- Tư vấn và gợi ý sách phù hợp với nhu cầu khách hàng
- Giải đáp thắc mắc về thể loại sách, tác giả, nội dung sách
- Hỗ trợ khách hàng tìm kiếm sách theo chủ đề, lứa tuổi, mục đích đọc
- Giải thích các chính sách của ThanhStore: giao hàng, đổi trả, thanh toán
- Hỗ trợ khách hàng với các vấn đề liên quan đến đơn hàng

Thông tin về ThanhStore:
- Cửa hàng chuyên bán sách tiếng Việt và ngoại văn
- Có đầy đủ các thể loại: văn học, khoa học, kinh doanh, thiếu nhi, tâm lý, lịch sử...
- Chính sách giao hàng: miễn phí cho đơn trên 200.000đ
- Thanh toán: COD, MoMo, VNPay, thẻ ngân hàng
- Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi

Quy tắc giao tiếp:
- Luôn trả lời bằng tiếng Việt, thân thiện và nhiệt tình
- Xưng hô: tự gọi là "mình" hoặc "ThanhStore", gọi khách là "bạn"
- Giữ câu trả lời ngắn gọn, súc tích (không quá 200 từ mỗi câu trả lời)
- Nếu không biết thông tin cụ thể, hãy gợi ý khách hàng liên hệ hỗ trợ
- Thêm emoji phù hợp để câu trả lời sinh động hơn
- Không trả lời các câu hỏi ngoài phạm vi hỗ trợ sách và ThanhStore`

const chatController = {
    chat: async (req, res) => {
        try {
            const { message, history = [] } = req.body

            if (!message || message.trim() === '') {
                return res.status(400).json({ error: 'Tin nhắn không được để trống' })
            }

            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                return res.status(503).json({ 
                    error: 'Chatbot chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env' 
                })
            }

            const model = genAI.getGenerativeModel({ 
                model: 'gemini-2.5-flash-lite',
                systemInstruction: SYSTEM_PROMPT
            })

            // Build chat history (convert format)
            const formattedHistory = history.map(msg => ({
                role: msg.role === 'bot' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }))

            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.8,
                }
            })

            const result = await chat.sendMessage(message)
            const response = result.response.text()

            return res.json({ 
                success: true,
                response: response 
            })

        } catch (error) {
            console.error('Chat error:', error.message)
            
            if (error.message?.includes('API_KEY_INVALID')) {
                return res.status(401).json({ error: 'API key Gemini không hợp lệ' })
            }

            if (error.message?.includes('429') || error.message?.includes('Too Many Requests') || error.message?.includes('quota')) {
                return res.status(429).json({ 
                    error: 'Chatbot đang bận, vui lòng thử lại sau ít phút nhé! 🙏' 
                })
            }

            if (error.message?.includes('404') || error.message?.includes('not found')) {
                return res.status(503).json({ 
                    error: 'Model AI tạm thời không khả dụng. Vui lòng thử lại sau!' 
                })
            }
            
            return res.status(500).json({ 
                error: 'Xin lỗi, mình gặp sự cố. Vui lòng thử lại sau!' 
            })
        }
    }
}

module.exports = chatController
