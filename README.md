[README.md](https://github.com/user-attachments/files/28110811/README.md)
# AI 標題設計 Prompt 產生器

用 Google Gemini API 自動產出標題文字的圖片生成 prompt，直接複製貼到 ChatGPT、Midjourney、Gemini Imagen 等平台產圖。

## 功能

- 輸入標題文字（中英文皆可）
- 選擇設計風格：質感、情感、技法、地域、產業（含金融理財、銀行信託等）
- 選擇使用場景與目標平台
- 生成語言切換：中文 / 英文 / 兩種都要
- 一鍵複製每個 prompt
- 純前端，無後端伺服器，API Key 僅存於瀏覽器記憶體

## 使用方式

### 直接開啟（本地）

```bash
# clone 專案
git clone https://github.com/your-username/ai-title-prompt-generator.git
cd ai-title-prompt-generator

# 直接用瀏覽器開啟即可（不需要 server）
open index.html
```

> 注意：若遇到 CORS 問題，請用 Live Server 或任何靜態伺服器執行。

### 用 VS Code Live Server

1. 安裝 [Live Server 擴充套件](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. 右鍵 `index.html` → Open with Live Server

### 部署到 GitHub Pages

1. 進入 GitHub repo → Settings → Pages
2. Source 選 `main` branch、`/ (root)`
3. 儲存後即可透過 `https://your-username.github.io/ai-title-prompt-generator/` 存取

## 取得 API Key

前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 建立免費的 Gemini API Key。

免費額度（截至 2025 年）：Gemini 2.0 Flash 每分鐘 15 次請求，每天 1500 次。

## 檔案結構

```
ai-title-prompt-generator/
├── index.html   # 主頁面結構
├── style.css    # 樣式
├── app.js       # 邏輯與 API 呼叫
└── README.md
```

## 使用的模型

`gemini-2.0-flash` — Google 最快速、最省 token 的模型，適合此類 prompt 生成任務。

## 隱私說明

- API Key 僅保存在使用者的瀏覽器記憶體中（不寫入 localStorage）
- 關閉或重整頁面後 Key 會消失，需重新輸入
- 所有請求直接從使用者瀏覽器發送到 Google API，不經過任何中間伺服器

## License

MIT
