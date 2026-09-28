# Kevin Labs Support — Minimal Refresh (2026-09-25)

对齐 https://support.notbor.ing/ 的极简清爽风格的一轮全站改造。站点版本 bump 至 `1.4.0 · 2026-09-25`。

## 七项改动

### 1. 补齐 6 个语言 section + PresenterDeck 版本号(修 bug)
- `index.html` 的 ja/ko/de/fr/es/pt 六个 section 从旧布局(无 callout、无 FAQ、PresenterDeck 只在底部 more 区)重写为与 en/zh 完全相同的结构:eyebrow + h1 + lead + callout-box + 5 产品 catalog + faq-section(4 条 FAQ);删除旧的 help/more section 与 store 提示 meta 段。
- 翻译决策:各语言原有 h1/lead/产品描述/eyebrow 标语保留(本来就是本地化的);新增内容(callout、FAQ、PresenterDeck 描述、链接标签)以 en 版为源做自然地道翻译。六个语言的 mailto/Gmail 链接复用 en 版的 URL(subject/body 为英文模板),因为旧版这些语言本就没有本地化邮件模板。
- PresenterDeck 卡片 meta 全站 8 语言从 `v1.1.0` 更新为 `v1.4.0`;描述保留"聚光灯放大镜/spotlight with magnifier"表述并为六个新语言补齐翻译。

### 2. 产品网格改单列列表
- `.catalog` 4 列卡片网格 → `.catalog-list` 单列 5 行:40px monogram 圆角图标 + 粗体产品名 + eyebrow + 一句话描述 + meta + 尾随文字链接(沿用现有 href)。行间 1px hairline,无卡片边框/背景/阴影。
- grep 确认 `.catalog`/`.product` 仅 index.html 使用,故旧网格/卡片样式从 `site.css` 删除;新增 `.catalog-list`/`.catalog-row`/`.catalog-main`/`.catalog-title`/`.catalog-eyebrow`/`.catalog-desc`/`.catalog-links`。
- 移动端(≤850px)链接区整行换行并与文本列对齐(padding-left:64px)。

### 3. 按钮降级
- 首页产品行的深色实心 `.button` 全部改为 accent 色文字链接(带 → 箭头)。
- callout-box 内只保留 1 个主按钮(✉️ Email Kevin,`.button-accent`);💡 Feature Wishlist、🌐 Open Web Gmail 降级为 `.callout-link` 文字链接。
- `.button`/`.button-outline` 类保留,子页面继续使用。

### 4. 卡片去框 + FAQ 去卡片化
- `.callout-box`:去边框、去左侧 5px accent 粗边、去阴影;背景改米色 `#f7f5ef`,保留圆角/内边距/badge。暗色模式背景回落为 `--card`。
- `.faq-accordion`:去边框/圆角/背景;每条 1px hairline 上分隔线(最后一条加下分隔线);summary 内边距收窄为 16px 0;保留 `<details>` 折叠与 +/- 指示器。

### 5. 背景纯白
- `:root --bg` 从 `#f7f7f2` 改为 `#fff`(暗色模式 `#131c1a` 不变)。米色 `#f7f5ef` 仅用于 callout-box 与 banner 底色。

### 6. 顶部品牌插画 banner
- 新增手写 `assets/banner.svg`(1160×280 viewBox):米白底上散布云朵、闪电、四角星、圆环、波浪、十字等扁平几何元素,配色 = 品牌绿 `#17665a` + 5 个 monogram 色(#6743a6/#215e76/#237b70/#0e7490/#4338ca)+ 暖黄 `#f2b544`/橙 `#e8863a`。
- SVG 内置 `prefers-color-scheme: dark` 样式(底色/点缀点/云朵切换为暗色调),作为 `<img>` 引用时同样生效。
- 插入 `index.html` 的 `<main>` 顶部、各语言 section 之前(语言无关的纯装饰,`alt=""` + `aria-hidden="true"`),CSS `.hero-banner` 全宽圆角 16px。

### 7. 语言选择器挪到页脚
- 13 个核心页面的 header `.bar`:移除右侧 `.language`(label+select)与品牌名后的 breadcrumb 后缀("/ 应用支持"等),header 只留 logo + "Kevin Labs";同时删除 CSS 中 `.brand>span` 与移动端 `.language` 规则。
- 语言选择器挪到 footer 第一行(`.footer-language` 包裹),`select#language` id 保留且全页唯一(逐页校验 select=1、header 内无 .language)。`assets/site.js` 未改动,`?lang=` 与下拉切换均已实测正常。

## 涉及文件

- `index.html`(整页重写:header/footer/banner/8 语言 section)
- `assets/site.css`(配色、列表、callout、FAQ、banner、footer-language)
- `assets/banner.svg`(新增)
- `index.json`(presenter-deck version 1.4.0、siteVersion 1.4.0、updatedAt 2026-09-25)
- 12 个子页面:`support.html`、`privacy.html`、`website-privacy.html`、`volmix/{index,support,privacy}.html`、`netdoctor/{index,support,privacy}.html`、`presenter-deck/{support,privacy}.html`、`ksic-studio/index.html`(header 精简 + footer 语言选择器 + 版本号 `1.4.0 · 2026-09-25`)
- 未动:`networkconsole-lite/`(跳转 stub)、各 `review/` 目录、`assets/site.js`

## 验证

- `grep -r "v1.1.0"`(排除 docs/)无残留;全站页脚统一 `1.4.0 · 2026-09-25`。
- 本地 `python3 -m http.server 8123` + 浏览器截图核验:桌面端 zh/ja/de、移动端 iphone-14-pro、子页面 volmix/index.html,banner/列表/FAQ/callout/header/footer 均符合预期;页脚语言下拉实测可切换语言。
- 暗色模式:CSS 变量与 SVG 内媒体查询已人工核对同步,未做真机模拟。

## 备注 / 取舍

- `index.json` 中 PresenterDeck 演示视频标题保留 "1.1.0 功能演示" 字样——它描述的是录制内容的历史版本,非当前版本号。
- `.more` CSS 类暂时保留(已无页面使用,无危害);`.help` 仍被子页面使用,样式未动。

---

# 第二轮瘦身(2026-09-25,同日用户评价后)

进一步对齐 notboring 的极简风格。

## 改动 1:首页产品列表改为纯「图标 + 名称链接」

- `index.html` 全部 8 个语言 section 的 `.catalog-list` 替换为 5 行 `<a class="app-row">`(monogram + 产品名,整行可点击)。链接目标:VolMix → `volmix/index.html`;IE Compat Bridge → 官方门户;KSIC Studio → `ksic-studio/index.html`;NetDoctor → `netdoctor/index.html`;PresenterDeck → `presenter-deck/support.html`。
- 删除每行的描述、版本 meta、右侧链接组(App Store/演示视频等信息子页面均有)。
- CSS:新增 `.app-row`(20px、`var(--ink)`、继承全局细下划线、padding 10px 12px、圆角 8px、hover 淡灰底,暗色模式 hover 为白色 6%);负 margin -12px 让文字与正文左缘对齐、hover 底色外扩。删除 hairline 分隔线及 `.catalog-row`/`.catalog-main`/`.catalog-title`/`.catalog-eyebrow`/`.catalog-desc`/`.catalog-links` 全部旧样式;`.video-pill` 经 grep 确认全站无 HTML 使用,CSS 一并删除(含暗色与 hover 规则)。
- 区块标题(「全部应用与指南」等各语言原标题)保留;monogram `aria-hidden` 保留。
- 移动端天然单列,无需额外媒体查询(850px 处的 catalog 相关规则已一并移除)。

## 改动 2:页脚删除商标声明与网站版本号

- 13 个核心页面的 footer 统一删除:商标声明段落(Apple/Mac/macOS/App Store/Chrome trademarks 的 `<p>`,含 8 个 `data-lang` span)与「网站版本 1.4.0 · 2026-09-25」的 `<small>` 行。
- 保留:语言选择器(`.footer-language`)与链接行(全部应用 · 网站隐私 · 联系支持)。删除后无空 `<p>`/`<small>` 残留(已 grep 验证)。
- `index.json` 的 `siteVersion`/`updatedAt` 不动(元数据,非页面展示)。

## 验证

- 本地 8123 端口服务仍在运行,浏览器截图核验:zh 首页列表(纯图标+名称)、hover 行高亮(KSIC Studio 行淡灰圆角底色)、zh 页脚、ja 首页、volmix/index.html 子页面页脚,均符合预期。
- grep(排除 docs/)确认无 `Site version`、`trademarks of Apple`、`网站版本`、`商标` 残留;`class="app-row"` 在 index.html 恰好 40 处(8 语言 × 5 产品);13 页 footer 均保留唯一 `select#language`。

---

# 第三轮调整(2026-09-25,同日):语言选择器移回 header

用户评价后决定语言选择器放回右上角,回摆第二轮第 7 步(第一轮)的 footer 方案。

- 13 个核心页面:`.language`(label 多语言 span + `select#language`)从 footer 移回 header `.bar` 右侧;header 布局为「logo + Kevin Labs(左)…… 语言选择器(右)」,breadcrumb 后缀维持已删除状态。footer 只保留链接行(全部应用 · 网站隐私 · 联系支持)。
- `select#language` id 不变、全页唯一(逐页断言 select=1、header 内 1 处、footer 0 处),`assets/site.js` 未改动,实测 header 下拉切换 ja 正常,偏好经 localStorage 跨页保持。
- CSS:删除不再使用的 `.footer-language`;恢复 520px 移动端规则 `.bar{flex-wrap:wrap}` + `.language{width:100%;justify-content:space-between}`(选择器在小屏换行占满一行)。

验证截图:首页 header(en/ja 切换)、volmix/index.html 子页面 header + footer(无选择器)。

---

# 第四轮调整(2026-09-25,同日):首页 callout 区大精简

用户圈选首页三处 + 追加一处,共四项移除(`index.html` 全部 8 个语言 section 同步):

1. **删除 `.lead` 副标题行** — h1 下的站点定位句("Kevin Labs 官方应用指南、使用手册与作者反馈通道。"等)。CSS 中 `.lead` 类因 `support.html`/`privacy.html` 等子页面仍在使用而保留。
2. **删除「💡 提交功能愿望清单」链接** — callout 只剩「✉️ Email Kevin」主按钮 +「🌐 在网页版 Gmail 打开」链接。
3. **删除「直接联系邮箱: support@kevinlabs.app」提示行** — `.callout-hint`/`.copy-email`/`.copy-feedback` CSS 一并删除(全站已无引用);`assets/site.js` 中 `.copy-email` 的点击处理保留(`closest` 匹配不到即跳过,无害)。
4. **删除 callout 内自我介绍段** — "我是 Kevin,Kevin Labs 背后的独立开发者……"整段 `<p>` 移除,8 个语言全部清除。

备注:本轮执行期间子任务曾被用户中断,前三项由中断前的子任务完成,第四项及收尾由主会话补齐;一次性迁移脚本(`scripts/round4_slim_home.py`)已删除,保持零构建仓库干净。

---

# 第五轮调整(2026-09-25,同日):hero 大标题与徽章移除

用户圈选首页两处继续删减(`index.html` 全部 8 个语言 section):

1. **删除 hero 大标题 h1**("做点好用的小工具,解决日常问题。"等)——首页顶部现为 banner + eyebrow 后直接是联系 callout。`assets/site.js` 的 document.title 绑定逻辑本就带 h1 存在性守卫,无 h1 时保留静态 `<title>`,无需改动。
2. **删除 callout 内「联系作者」徽章**(`.callout-badge`,8 处)——CSS 规则(含暗色覆盖)同步删除,全站无其他使用。

另:CSS 引用版本号 bump 为 `?v=1.4.1`(因 site.css 有变更,延续第四轮的 Cloudflare 缓存规避方案)。

---

# 第六轮调整(2026-09-29): 首页联系 callout 区左对齐与扁平化 (方案 A)

用户反馈首页联系区块文本未与上下段落（上方 eyebrow、下方「全部应用与指南」标题）左对齐。

1. **`.callout-box` 扁平化** — 移除卡片浅色背景 `#f7f5ef`、暗色模式背景 `var(--card)`、圆角 `border-radius: 14px` 以及内边距 `padding: 28px 32px`，改为 `margin: 24px 0 44px; padding: 0;`。
2. **左对齐一致性** — 去除内边距后，内部 `<h3>` 与 `.callout-actions` 主按钮及 Gmail 链接在水平方向直接贴齐页面主容器左基准线（x = 0），与上方 eyebrow 及下方应用列表完全对齐。
3. **版本号升级** — 全站 16 个 HTML 文件中的 `site.css?v=1.4.1` 引用升级为 `?v=1.4.2`，规避 Cloudflare 边缘缓存。

