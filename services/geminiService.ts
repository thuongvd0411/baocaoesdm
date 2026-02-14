
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ESDMResult } from "../types";

export const analyzeESDMFiles = async (parts: any[], selectedLevels: number[], columns: number[]): Promise<ESDMResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const levelsPrompt = selectedLevels.map(l => `CẤP ĐỘ ${l}`).join(', ');
  
  // Sort columns to ensure chronological order if user selected out of order (e.g. 2 then 1 -> 1 then 2)
  const sortedCols = [...columns].sort((a, b) => a - b);
  const isComparison = sortedCols.length > 1;
  
  let columnInstruction = "";
  if (!isComparison) {
    columnInstruction = `2. CHỈ đếm dấu "+" tại cột "Lần ${sortedCols[0]}". (Bỏ qua các cột khác). Trả về kết quả dạng "X/Y" (X là số đạt, Y là tổng).`;
  } else {
    columnInstruction = `2. Bạn cần so sánh 2 cột: Cột "Lần ${sortedCols[0]}" (Cũ) và Cột "Lần ${sortedCols[1]}" (Mới).
    - Đếm dấu "+" của cột "Lần ${sortedCols[0]}" (gọi là A).
    - Đếm dấu "+" của cột "Lần ${sortedCols[1]}" (gọi là B).
    - Trả về dữ liệu trong bảng dưới dạng chuỗi: "A/Total => B/Total". (Ví dụ: "2/4 => 4/4").
    - 'percents': tính % dựa trên cột MỚI NHẤT (Lần ${sortedCols[1]}).
    - 'percentsOld': tính % dựa trên cột CŨ HƠN (Lần ${sortedCols[0]}).`;
  }

  const prompt = `
Bạn là chuyên gia đánh giá ESDM chuyên sâu. Nhiệm vụ của bạn là đọc và trích xuất dữ liệu từ các trang của Phiếu Đánh Giá Chi Tiết ESDM.

QUY TẮC PHÂN TÍCH:
1. CHỈ xét các cấp độ: ${levelsPrompt}.
${columnInstruction}
3. Ký hiệu "+/-", "-", hoặc ô trống được tính là 0 mục đạt.
4. Mẫu số (tổng số mục) là tổng số dòng/mục con có trong danh sách kiểm tra của kỹ năng đó tại cấp độ đó.

PHẢI TRẢ VỀ DỮ LIỆU JSON CHÍNH XÁC VỚI CÁC TÊN KỸ NĂNG SAU:
- Giao tiếp tiếp nhận
- Giao tiếp diễn đạt
- Kỹ năng xã hội
- Bắt chước
- Nhận thức
- Chơi
- Vận động tinh
- Vận động thô
- Hành vi thích ứng
- Hành vi chú ý
- Tự lập
- Tổng điểm

Cấu trúc JSON:
{
  "table": [
    { "skill": "Tên kỹ năng", "level0": "...", "level1": "...", "level2": "...", "level3": "...", "level4": "..." },
    ...
  ],
  "percents": { "level0": float, "level1": float, "level2": float, "level3": float, "level4": float },
  ${isComparison ? '"percentsOld": { "level0": float, "level1": float, ... },' : ''}
  "summary": "Nhận xét tổng quát bằng tiếng Việt..."
}
`;

  // Define properties for the schema
  const schemaProperties: any = {
    table: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          level0: { type: Type.STRING },
          level1: { type: Type.STRING },
          level2: { type: Type.STRING },
          level3: { type: Type.STRING },
          level4: { type: Type.STRING }
        },
        required: ["skill", "level1", "level2", "level3", "level4"]
      }
    },
    percents: {
      type: Type.OBJECT,
      properties: {
        level0: { type: Type.NUMBER },
        level1: { type: Type.NUMBER },
        level2: { type: Type.NUMBER },
        level3: { type: Type.NUMBER },
        level4: { type: Type.NUMBER }
      }
    },
    summary: { type: Type.STRING }
  };

  // Add percentsOld to schema if comparing
  if (isComparison) {
    schemaProperties.percentsOld = {
      type: Type.OBJECT,
      properties: {
        level0: { type: Type.NUMBER },
        level1: { type: Type.NUMBER },
        level2: { type: Type.NUMBER },
        level3: { type: Type.NUMBER },
        level4: { type: Type.NUMBER }
      }
    };
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [...parts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: schemaProperties,
        required: isComparison ? ["table", "percents", "percentsOld", "summary"] : ["table", "percents", "summary"]
      }
    }
  });

  try {
    let text = response.text || "{}";
    if (text.startsWith("```")) {
        text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "");
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("Lỗi định dạng dữ liệu từ AI. Vui lòng thử lại.");
  }
};
