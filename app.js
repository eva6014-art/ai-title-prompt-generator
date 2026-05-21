/* ── State ── */
let selectedLang = 'zh';
let selectedAR   = '';
let activePreset = null;

/* ── Style Presets definition ── */
const PRESETS = {
  claymation: {
    label: '3D Claymation',
    styleTags: ['3D立體', '可愛活潑'],
    industryTags: [],
    moodTags: ['柔和影棚光'],
    extraPrompt: '3D claymation style, soft clay texture, rounded puffy shapes, pastel tones, playful and friendly, smooth plastic surface, studio lighting, chibi proportions',
  },
  minimalist: {
    label: 'Minimalist 2D Vector',
    styleTags: ['極簡主義', '現代簡約'],
    industryTags: ['金融理財'],
    moodTags: ['純白極簡背景'],
    extraPrompt: 'minimalist 2D vector illustration, flat design, clean geometric shapes, limited color palette (2-3 colors), professional and trustworthy, ample white space, no gradients',
  },
  flatline: {
    label: 'Flat Clean Outline',
    styleTags: ['現代簡約'],
    industryTags: [],
    moodTags: ['純白極簡背景'],
    extraPrompt: 'flat design illustration, clean black outlines, simple shapes, friendly and fresh, clear linework, scannable layout, banner-friendly composition',
  },
  luxury: {
    label: 'Luxury Finance',
    styleTags: ['奢華高端', '金屬質感'],
    industryTags: ['銀行信託', '投資基金'],
    moodTags: ['深色奢華背景'],
    extraPrompt: 'luxury finance aesthetic, deep navy and gold palette, metallic typography, sophisticated and authoritative, subtle texture, premium brand feel, cinematic lighting',
  },
};

/* ── Color map for style badges ── */
const COLOR_MAP = {
  '現代簡約':['#e8f0e8','#1a4a2e'],'奢華高端':['#ede8f5','#3a2060'],'工業冷酷':['#ebebeb','#2a2a2a'],
  '自然有機':['#e8f2e0','#2a5020'],'極簡主義':['#f0eeea','#4a4845'],'可愛活潑':['#fce8f0','#6a1840'],
  '復古懷舊':['#f5ead8','#5a3008'],'浪漫夢幻':['#fce8f2','#8a1848'],'神秘暗黑':['#e8e4f5','#281858'],
  '清新溫柔':['#e0f2ee','#0a4838'],'霓虹發光':['#eae0f8','#4020a0'],'科技感':['#daf0ea','#085840'],
  '手寫塗鴉':['#fae8e0','#681808'],'3D立體':['#daeaf8','#103060'],'水彩暈染':['#f8e0ee','#901848'],
  '金屬質感':['#e8e8e4','#282820'],'日系清新':['#e8f2dc','#2a5808'],'韓系時尚':['#fce4ee','#881840'],
  '歐美大片':['#dce8f5','#082848'],'台灣在地':['#fae0d8','#882010'],'中式國潮':['#fce0e0','#701010'],
  '金融理財':['#ddf0e8','#0a4028'],'銀行信託':['#dce8f5','#0a3060'],'投資基金':['#e0f0e0','#184818'],
  '保險安全':['#dce8f8','#103870'],'科技新創':['#d8f0e8','#085038'],'醫療健康':['#d8f0ea','#065840'],
  '餐飲美食':['#fae0d4','#882808'],'時尚美妝':['#fce0ea','#881838'],'教育學習':['#f5e8d0','#583008'],
  '房地產':['#ebebeb','#303028'],
};

function getBadgeStyle(name) {
  const col = COLOR_MAP[name] || ['#eceae4','#3a3830'];
  return `background:${col[0]};color:${col[1]}`;
}

/* ── Key toggle ── */
function toggleKey() {
  const inp = document.getElementById('apiKey');
  const btn = document.getElementById('toggleKeyBtn');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '顯示' : '隱藏';
}

/* ── Lang ── */
function setLang(lang, el) {
  selectedLang = lang;
  document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  // show AR field only for Midjourney
  syncARField();
}

/* ── Aspect Ratio ── */
function selectAR(el) {
  document.querySelectorAll('.ar-card').forEach(c => c.classList.remove('active'));
  if (el.dataset.ar === selectedAR) {
    selectedAR = ''; // deselect on second click
  } else {
    el.classList.add('active');
    selectedAR = el.dataset.ar;
  }
}

function syncARField() {
  const platform = document.querySelector('.tag--single[data-group="platform"].active')?.textContent || '';
  const arField  = document.getElementById('ar-field');
  arField.classList.toggle('visible', platform.includes('Midjourney'));
}

/* ── Tags ── */
function toggleTag(el) {
  el.classList.toggle('active');
  updateStyleCount();
}

function toggleSingle(el, group) {
  document.querySelectorAll(`.tag--single[data-group="${group}"]`).forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (group === 'platform') syncARField();
}

function updateStyleCount() {
  const count = document.querySelectorAll('.tag:not(.tag--single):not(.tag--mood).active').length;
  document.getElementById('styleCount').textContent = count ? `${count} 已選` : '0 已選';
}

/* ── ★ Apply Preset ── */
function applyPreset(el) {
  const key = el.dataset.preset;
  const preset = PRESETS[key];
  if (!preset) return;

  // toggle off if already active
  if (activePreset === key) {
    el.classList.remove('active');
    activePreset = null;
    return;
  }

  // deactivate other presets
  document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activePreset = key;

  // clear existing style/industry/mood tags
  document.querySelectorAll('.tag:not(.tag--single)').forEach(t => t.classList.remove('active'));

  // activate matching tags
  preset.styleTags.forEach(name => {
    document.querySelectorAll('.tag:not(.tag--single):not(.tag--industry):not(.tag--mood)').forEach(t => {
      if (t.textContent.trim() === name) t.classList.add('active');
    });
  });
  preset.industryTags.forEach(name => {
    document.querySelectorAll('.tag--industry').forEach(t => {
      if (t.textContent.trim() === name) t.classList.add('active');
    });
  });
  preset.moodTags.forEach(name => {
    document.querySelectorAll('.tag--mood').forEach(t => {
      if (t.textContent.trim() === name) t.classList.add('active');
    });
  });

  updateStyleCount();
}

/* ── Getters ── */
function getActiveStyleTags() {
  return [...document.querySelectorAll('.tag:not(.tag--single):not(.tag--mood).active')].map(t => t.textContent.trim());
}

function getActiveMoodTags() {
  return [...document.querySelectorAll('.tag--mood.active')].map(t => {
    const en = t.dataset.en || t.textContent.trim();
    return en;
  });
}

function getActiveSingle(group) {
  return document.querySelector(`.tag--single[data-group="${group}"].active`)?.textContent.trim() || '';
}

/* ── Prompt builder ── */
function getLangInstruction() {
  switch (selectedLang) {
    case 'zh':   return '每個 prompt 只用繁體中文撰寫，用中文描述所有視覺細節。';
    case 'en':   return 'Write each prompt in English only.';
    case 'both': return '每個元素提供中英文兩個版本。JSON 欄位為 style、prompt_zh（繁體中文）、prompt_en（英文）。';
  }
}

function getJsonFormat() {
  return selectedLang === 'both'
    ? '[{"style":"風格名稱","prompt_zh":"...","prompt_en":"..."}]'
    : '[{"style":"風格名稱","prompt":"..."}]';
}

function buildSystemPrompt() {
  return `你是一位專業視覺設計師，擅長為圖片生成 AI 撰寫標題文字設計的 prompt。
產出 3 個不同方向的設計 prompt，每個方向風格要有明顯差異。
${getLangInstruction()}
每個 prompt 需包含：字體風格、顏色配置、背景元素、光影效果、排版構圖等細節。
若有選擇產業風格（如金融理財、銀行信託等），prompt 必須融入該產業的視覺語言，強調專業感與信任感。
若有指定背景氛圍關鍵字，必須自然融入 prompt 中。
若是 Midjourney 平台，prompt 結尾加上 Midjourney 參數（如 --ar、--v 6.1）。
回傳格式為 JSON array：${getJsonFormat()}
只回傳 JSON，不要 markdown 符號，不要其他說明文字。`;
}

/* ── Render ── */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderCards(prompts) {
  const isBoth = selectedLang === 'both';
  const styles = getActiveStyleTags();

  return prompts.map((p, i) => {
    const matchStyle = styles[i] || styles[0] || p.style;
    const badge = getBadgeStyle(matchStyle);

    if (isBoth) {
      return `<div class="prompt-card" style="animation-delay:${i*0.08}s">
        <div class="card-header">
          <span class="style-badge" style="${badge}">${p.style}</span>
          <div class="card-actions">
            <button class="action-btn" onclick="copyPrompt('zh-${i}',this)">複製中文</button>
            <button class="action-btn" onclick="copyPrompt('en-${i}',this)">複製英文</button>
          </div>
        </div>
        <div class="prompt-sub-label">中文</div>
        <div class="prompt-box prompt-gap" id="zh-${i}">${escHtml(p.prompt_zh)}</div>
        <div class="prompt-sub-label">English</div>
        <div class="prompt-box" id="en-${i}">${escHtml(p.prompt_en)}</div>
      </div>`;
    } else {
      return `<div class="prompt-card" style="animation-delay:${i*0.08}s">
        <div class="card-header">
          <span class="style-badge" style="${badge}">${p.style}</span>
          <button class="action-btn" onclick="copyPrompt('p-${i}',this)">複製 Prompt</button>
        </div>
        <div class="prompt-box" id="p-${i}">${escHtml(p.prompt)}</div>
      </div>`;
    }
  }).join('');
}

/* ── Copy ── */
function copyPrompt(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ 已複製';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  }).catch(() => alert('複製失敗，請手動選取文字後複製。'));
}

/* ── Generate ── */
async function generate() {
  const apiKey    = document.getElementById('apiKey').value.trim();
  const titleText = document.getElementById('titleText').value.trim();
  const styles    = getActiveStyleTags();
  const moods     = getActiveMoodTags();
  const scene     = getActiveSingle('scene');
  const platform  = getActiveSingle('platform') || '通用格式';
  const out       = document.getElementById('output');
  const btn       = document.getElementById('generateBtn');

  if (!apiKey)    { out.innerHTML = '<div class="error-state">請輸入 Google Gemini API Key。</div>'; return; }
  if (!titleText) { out.innerHTML = '<div class="error-state">請輸入標題文字。</div>'; return; }

  btn.disabled = true;
  out.innerHTML = `<div class="loading-state"><div class="spinner"></div><div>AI 設計師構思中，請稍候...</div></div>`;

  // build extra context from preset
  const presetExtra = activePreset ? `\n風格預設：${PRESETS[activePreset].label}（${PRESETS[activePreset].extraPrompt}）` : '';

  // AR suffix
  const arSuffix = (platform.includes('Midjourney') && selectedAR) ? `\nMidjourney 比例參數：${selectedAR}` : '';

  const userMsg = `標題文字：「${titleText}」
設計風格：${styles.length ? styles.join('、') : '不限，請自由發揮'}
背景氛圍：${moods.length ? moods.join(', ') : '不限'}
使用場景：${scene || '通用'}
目標平台：${platform}${presetExtra}${arSuffix}`;

  const body = {
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: [{ parts: [{ text: userMsg }] }],
    generationConfig: { temperature: 0.9 }
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const data = await res.json();

    if (data.error) {
      let msg = `API 錯誤（${data.error.code}）：${data.error.message}`;
      if (data.error.code === 429) msg = '⏳ 請求過於頻繁，請等待約 60 秒後再試。';
      if (data.error.code === 403) msg = '🔑 API Key 無效或無權限，請確認 Key 是否正確。';
      out.innerHTML = `<div class="error-state">${msg}</div>`;
      return;
    }

    const raw    = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean  = raw.replace(/```json|```/g, '').trim();
    const prompts = JSON.parse(clean);
    out.innerHTML = renderCards(prompts);

  } catch (err) {
    if (err instanceof SyntaxError) {
      out.innerHTML = '<div class="error-state">AI 回傳格式錯誤，請再試一次。</div>';
    } else {
      out.innerHTML = `<div class="error-state">發生錯誤：${err.message}</div>`;
    }
  } finally {
    btn.disabled = false;
  }
}

/* ── Enter shortcut ── */
document.getElementById('titleText').addEventListener('keydown', e => {
  if (e.key === 'Enter') generate();
});
