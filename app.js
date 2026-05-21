/* ── State ── */
let selectedLang = 'zh';

/* ── Color map for style badges ── */
const COLOR_MAP = {
  '現代簡約': ['#e8f0e8', '#1a4a2e'],
  '奢華高端': ['#ede8f5', '#3a2060'],
  '工業冷酷': ['#ebebeb', '#2a2a2a'],
  '自然有機': ['#e8f2e0', '#2a5020'],
  '極簡主義': ['#f0eeea', '#4a4845'],
  '可愛活潑': ['#fce8f0', '#6a1840'],
  '復古懷舊': ['#f5ead8', '#5a3008'],
  '浪漫夢幻': ['#fce8f2', '#8a1848'],
  '神秘暗黑': ['#e8e4f5', '#281858'],
  '清新溫柔': ['#e0f2ee', '#0a4838'],
  '霓虹發光': ['#eae0f8', '#4020a0'],
  '科技感':   ['#daf0ea', '#085840'],
  '手寫塗鴉': ['#fae8e0', '#681808'],
  '3D立體':   ['#daeaf8', '#103060'],
  '水彩暈染': ['#f8e0ee', '#901848'],
  '金屬質感': ['#e8e8e4', '#282820'],
  '日系清新': ['#e8f2dc', '#2a5808'],
  '韓系時尚': ['#fce4ee', '#881840'],
  '歐美大片': ['#dce8f5', '#082848'],
  '台灣在地': ['#fae0d8', '#882010'],
  '中式國潮': ['#fce0e0', '#701010'],
  '金融理財': ['#ddf0e8', '#0a4028'],
  '銀行信託': ['#dce8f5', '#0a3060'],
  '投資基金': ['#e0f0e0', '#184818'],
  '保險安全': ['#dce8f8', '#103870'],
  '科技新創': ['#d8f0e8', '#085038'],
  '醫療健康': ['#d8f0ea', '#065840'],
  '餐飲美食': ['#fae0d4', '#882808'],
  '時尚美妝': ['#fce0ea', '#881838'],
  '教育學習': ['#f5e8d0', '#583008'],
  '房地產':   ['#ebebeb', '#303028'],
};

function getBadgeStyle(styleName) {
  const col = COLOR_MAP[styleName] || ['#eceae4', '#3a3830'];
  return `background:${col[0]};color:${col[1]}`;
}

/* ── UI helpers ── */
function toggleKey() {
  const input = document.getElementById('apiKey');
  const btn = document.getElementById('toggleKeyBtn');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '隱藏';
  } else {
    input.type = 'password';
    btn.textContent = '顯示';
  }
}

function setLang(lang, el) {
  selectedLang = lang;
  document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function toggleTag(el) {
  el.classList.toggle('active');
  updateStyleCount();
}

function toggleSingle(el, group) {
  document.querySelectorAll(`.tag--single[data-group="${group}"]`).forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function updateStyleCount() {
  const count = document.querySelectorAll('.tag:not(.tag--single).active').length;
  document.getElementById('styleCount').textContent = count ? `${count} 已選` : '0 已選';
}

function getActiveStyleTags() {
  return [...document.querySelectorAll('.tag:not(.tag--single).active')].map(t => t.textContent);
}

function getActiveSingle(group) {
  const el = document.querySelector(`.tag--single[data-group="${group}"].active`);
  return el ? el.textContent : '';
}

/* ── Prompt language instructions ── */
function getLangInstruction() {
  switch (selectedLang) {
    case 'zh':   return '每個 prompt 只用繁體中文撰寫，用中文描述所有視覺細節。';
    case 'en':   return 'Write each prompt in English only.';
    case 'both': return '每個元素提供中英文兩個版本的 prompt。JSON 欄位為 style、prompt_zh（繁體中文）、prompt_en（英文）。';
  }
}

function getJsonFormat() {
  return selectedLang === 'both'
    ? '[{"style":"風格名稱","prompt_zh":"...","prompt_en":"..."}]'
    : '[{"style":"風格名稱","prompt":"..."}]';
}

/* ── Build system prompt ── */
function buildSystemPrompt() {
  return `你是一位專業視覺設計師，擅長為圖片生成 AI 撰寫標題文字設計的 prompt。
產出 3 個不同方向的設計 prompt，每個方向風格要有明顯差異。
${getLangInstruction()}
每個 prompt 需包含：字體風格、顏色配置、背景元素、光影效果、排版構圖等細節，讓生成圖片的 AI 能清楚理解。
若有選擇產業風格（如金融理財、銀行信託等），prompt 必須融入該產業的視覺語言，強調專業感與信任感。
回傳格式為 JSON array：${getJsonFormat()}
只回傳 JSON，不要 markdown 符號（不要 \`\`\`json），不要其他說明文字。`;
}

/* ── Render result cards ── */
function renderCards(prompts) {
  const isBoth = selectedLang === 'both';
  const styles = getActiveStyleTags();

  return prompts.map((p, i) => {
    const matchStyle = styles[i] || styles[0] || p.style;
    const badgeStyle = getBadgeStyle(matchStyle);

    if (isBoth) {
      return `
        <div class="prompt-card" style="animation-delay:${i * 0.08}s">
          <div class="card-header">
            <span class="style-badge" style="${badgeStyle}">${p.style}</span>
            <div class="card-actions">
              <button class="action-btn" onclick="copyPrompt('zh-${i}', this)">複製中文</button>
              <button class="action-btn" onclick="copyPrompt('en-${i}', this)">複製英文</button>
            </div>
          </div>
          <div class="prompt-sub-label">中文</div>
          <div class="prompt-box prompt-gap" id="zh-${i}">${escHtml(p.prompt_zh)}</div>
          <div class="prompt-sub-label">English</div>
          <div class="prompt-box" id="en-${i}">${escHtml(p.prompt_en)}</div>
        </div>`;
    } else {
      return `
        <div class="prompt-card" style="animation-delay:${i * 0.08}s">
          <div class="card-header">
            <span class="style-badge" style="${badgeStyle}">${p.style}</span>
            <button class="action-btn" onclick="copyPrompt('p-${i}', this)">複製 Prompt</button>
          </div>
          <div class="prompt-box" id="p-${i}">${escHtml(p.prompt)}</div>
        </div>`;
    }
  }).join('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ── Copy to clipboard ── */
function copyPrompt(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ 已複製';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    alert('複製失敗，請手動選取文字後複製。');
  });
}

/* ── Main generate function ── */
async function generate() {
  const apiKey    = document.getElementById('apiKey').value.trim();
  const titleText = document.getElementById('titleText').value.trim();
  const styles    = getActiveStyleTags();
  const scene     = getActiveSingle('scene');
  const platform  = getActiveSingle('platform') || '通用格式';
  const out       = document.getElementById('output');
  const btn       = document.getElementById('generateBtn');

  if (!apiKey) {
    out.innerHTML = '<div class="error-state">請輸入 Google Gemini API Key。</div>';
    return;
  }
  if (!titleText) {
    out.innerHTML = '<div class="error-state">請輸入標題文字。</div>';
    return;
  }

  btn.disabled = true;
  out.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>AI 設計師構思中，請稍候...</div>
    </div>`;

  const userMsg = `標題文字：「${titleText}」
設計風格：${styles.length ? styles.join('、') : '不限，請自由發揮'}
使用場景：${scene || '通用'}
目標平台：${platform}`;

  const body = {
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: [{ parts: [{ text: userMsg }] }],
    generationConfig: { temperature: 0.9 }
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    const data = await res.json();

    if (data.error) {
      out.innerHTML = `<div class="error-state">API 錯誤（${data.error.code}）：${data.error.message}</div>`;
      return;
    }

    const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const prompts = JSON.parse(clean);

    out.innerHTML = renderCards(prompts);

  } catch (err) {
    if (err instanceof SyntaxError) {
      out.innerHTML = '<div class="error-state">AI 回傳格式錯誤，請再試一次。</div>';
    } else {
      out.innerHTML = `<div class="error-state">發生錯誤：${err.message}。請確認 API Key 是否正確，或檢查網路連線。</div>`;
    }
  } finally {
    btn.disabled = false;
  }
}

/* ── Enter key shortcut ── */
document.getElementById('titleText').addEventListener('keydown', e => {
  if (e.key === 'Enter') generate();
});
