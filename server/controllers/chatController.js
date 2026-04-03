const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("No Gemini API Key found.");
      return res.status(500).json({
        message: "API key is missing. Please configure GEMINI_API_KEY in the environment."
      });
    }

    // 🔥 Updated Prompt (Hindi optimized & Comprehensive AI)
    const prompt = `आप एक स्मार्ट और अनुभवी कृषि सहायक (AI Assistant) हैं जो भारतीय किसानों की हर संभव कृषि-संबंधी मदद करता है।

निर्देश:
- केवल सरल और शुद्ध हिंदी (देवनागरी) में जवाब दें।
- कठिन अंग्रेजी शब्दों का उपयोग न करें।
- किसान के हर सवाल का (फसल, मौसम, मिट्टी, सरकारी योजनाएं, खाद, बीज, बीमारी आदि) विशेषज्ञ की तरह सीधा और व्यावहारिक समाधान दें।
- अगर कोई सवाल खेती-किसानी से जुड़ा नहीं है, तो विनम्रता से बताएं कि आप मुख्य रूप से कृषि सहायक हैं।
- जवाब ऐसा हो कि बोलने पर भी आसानी से समझ आए और किसान तुरंत उस पर अमल कर सके।

खेत की जानकारी (अगर उपलब्ध है):
फसल डेटा: ${JSON.stringify(context?.recommendedCrops || "कोई डेटा नहीं")}
मौसम: ${JSON.stringify(context?.weather || "कोई डेटा नहीं")}
स्थान: ${context?.location || "अज्ञात"}
मिट्टी का प्रकार: ${context?.soilType || "अज्ञात"}
जमीन: ${context?.area || "अज्ञात"} एकड़
मौसम/सीजन: ${context?.season || "अज्ञात"}

किसान का सवाल: "${message}"

अब साफ, आसान और सटीक हिंदी में जवाब दें:`;


    // ✅ UPDATED API (gemini-2.5-flash via v1beta endpoint)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "माफ़ करें, अभी जवाब नहीं मिल पाया।";

    res.json({ success: true, reply });

  } catch (error) {
    console.error("Chatbot error details:", error.response?.data || error.message);

    // API key error
    if (error.response?.data?.error?.message?.includes("API key not valid")) {
      return res.json({
        success: true,
        reply: "माफ़ करें, API key में समस्या है। कृपया सही key डालें और सर्वर को फिर से चालू करें।"
      });
    }

    // Model error
    if (error.response?.data?.error?.message?.includes("not found")) {
      return res.json({
        success: true,
        reply: "सिस्टम अपडेट हो रहा है, कृपया थोड़ी देर बाद फिर प्रयास करें।"
      });
    }

    res.status(500).json({
      message: "AI Assistant से कनेक्ट करने में समस्या आई"
    });
  }
};