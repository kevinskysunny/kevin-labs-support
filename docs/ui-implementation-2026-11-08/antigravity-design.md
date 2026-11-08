# Antigravity 方案审查

方式：本机 agy CLI，只读方案审查。结论是方案通过，不代表实现或生产已验收。

三批改造方案（`2.2.7` → `2.3.0` → `2.3.1`）与 [docs/ui-audit-2026-11-08/README.md](../../docs/ui-audit-2026-11-08/README.md) 及 [`crap-ui-polisher`](https://github.com/kevinskysunny/kevin-labs-support) 六步重构法高度一致，优先解决 P0/P1 布局回归，再收敛信息层级与微时刻反馈，且严守浅色品牌、既有功能与独立站边界。

审核发现的**具体遗漏与实施风险**如下（请在对应批次编码中补齐）：

### 1. 第一批（`2.2.7`：布局 CSS 覆盖、同规格主卡、手机单列、文档全宽、纯文字模板单列、焦点顺序）
- **中等视口（601–900px）两列过渡与断点冲突（R06）**：[assets/monochrome.css](../../assets/monochrome.css#L5-L90) 散落了 `600px`、`700px`、`850px`、`851px`、`900px` 多处断点。清理第 68/86/114/153 行后置覆盖时，需统一定义平板/窄桌面（如 `768px`、`850/851px`）的两列过渡与容器边距，避免仅修好手机单列和桌面三列而在 `850→851px` 处仍发生高度剧烈跳变。
- **产品详情页 `.actions` / `.meta` 的 CSS `order` 遗漏（R07）**：除首页 `nextmirror` 的 `order:-1`（第 71 行）和手机页头 `.bar` 的 `order:1/2/3`（第 59 行）外，[assets/monochrome.css](../../assets/monochrome.css#L122-L123) 还对 `.product-copy .actions{order:3}` 与 `.meta{order:4}` 使用了 `order`，导致 [volmix/index.html](../../volmix/index.html#L65-L69)、[netdoctor/index.html](../../netdoctor/index.html#L57-L61)、[ksic-studio/index.html](../../ksic-studio/index.html#L57-L61) 视觉顺序与 DOM/Tab 焦点顺序颠倒，应一并改为 DOM 自然顺序。
- **桌面阅读目录高度拉伸与横向裁切检测（R03/R08/D07）**：修手机文档全宽时，桌面端 `.reading-layout` 的 `.contents`（[assets/monochrome.css](../../assets/monochrome.css#L154)）需补 `align-self:start` 及视口内滚动边界，防止 sticky 目录被 Grid 拉伸至全文高度；同时因根元素设有 `overflow-x:clip`，测试必须校验 320/390/430px（含德/法语长词）可见元素的真实 `getBoundingClientRect().right`，不能只查 `scrollWidth`。

### 2. 第二批（`2.3.0`：首页八语单标题、用途去胶囊、旧版支持移出网格、PresenterDeck 入口标识、VolMix HTTPS 商店与功能归组）
- **全局 `li+li` 导致功能卡片同行错位（D03）**：[assets/site.css](../../assets/site.css#L3) 的全局 `li+li{margin-top:10px}` 叠加在 `.product-page main>section>section.help ul`（[assets/monochrome.css](../../assets/monochrome.css#L134-L135)）上，导致同行第 2、3 列卡片顶部下移 10px；VolMix 功能归组及卡片化列表必须显式重置 `margin-top:0`。
- **其他商店应用 HTTPS 链接与统计埋点兼容（D02/E06）**：除 [volmix/index.html](../../volmix/index.html#L67) 外，[netdoctor/index.html](../../netdoctor/index.html#L59) 与 [ksic-studio/index.html](../../ksic-studio/index.html#L59) 主按钮同样仅使用 `macappstores://`，建议同步提供 `https://apps.apple.com/...` 稳定链接；且链接域名须保持 `apps.apple.com` 以确保 [assets/site.js](../../assets/site.js#L217) 的 `store_click` 统计正常触发。
- **截图无障碍放大、支持目录说明与 FAQ 结构化数据同步（D04/D06/I08）**：VolMix 手机端对比截图需提供键盘/触屏可达的放大或原图查看入口（不依赖 hover）；[guides.html](../../guides.html#L111-L118) 支持目录各行建议补充简短用途或支持标识；若调整首页 FAQ 条目（如移出 VolMix 专属权限问题），须同步更新 [index.html](../../index.html#L22-L61) 与 [guides.html](../../guides.html#L22-L61) 顶部的 `FAQPage` JSON-LD。

### 3. 第三批（`2.3.1`：八语反馈、邮件复制分离、跨页语言、版本、模板数据与回归）
- **多源产品数据冲突必须在模板化前先行核对（E03，高风险）**：
  - [assets/products.json](../../assets/products.json#L75) 中 VolMix 的 `limits` 仍写着“不支持按应用分配输出设备（no per-app output routing）”，与 [volmix/index.html](../../volmix/index.html#L75) 的实际核心功能直接冲突；
  - SmoothCast 版本在 [assets/products.json](../../assets/products.json#L250) 为 `1.1.1`，在 [index.json](../../index.json#L177) 为 `1.3.2`；
  - NextMirror 在 [index.json](../../index.json#L199-L204) 仍为 `1.0.0 / build 6`；[design.md](../../design.md#L3) 仍为 `2.1.0`。切勿直接用未核实的旧 JSON 覆盖现有 HTML 文案。
- **八语邮件预填模板与 Toast 无障碍状态（I01/I02/I03）**：[index.html](../../index.html#L219-L425) 中日/韩/德/法/西/葡六语的 `mailto:` 和 Gmail 链接 `subject`/`body` 仍是英文模板，需随八语反馈词条一并本地化；[`showToast`](../../assets/site.js#L139) 需补 `role="status"` / `aria-live="polite"`，且在隐藏时设置 `hidden` 或 `inert` 防止隐藏的 Gmail 链接仍被 Tab 聚焦。
- **跨页/跨域语言传递覆盖不全与自动模式污染风险（I04/I05）**：[assets/site.js](../../assets/site.js#L98-L109) 目前仅处理了 `mindcharge` 和 `smoothcast`，漏掉了 `nextmirror.kevinlabs.app`、`barnest.kevinlabs.app`（[index.html](../../index.html#L104) 与 [guides.html](../../guides.html#L112-L113) 中存在静态写死的 `?lang=` 或无参链接）及 URL `?lang=` 访问时的站内链接传递；修复时须严守 `system` 自动模式不落盘固化为具体语种，并对 `mindcharge` 不支持 `ko`/`pt` 及站内仅中英双语子页（`netdoctor`、`presenter-deck`、`ksic-studio`、`support.html`）做好明确回退处理。
- **触控热区、语言下拉截断、色彩元标签与缓存哈希（I06/I07/I09/I10）**：需纳入 44px 主要触控热区调整、解除手机端 `.bar .language select` 的 `112px` 宽度硬限制（[assets/monochrome.css](../../assets/monochrome.css#L59)）、将各页 `<meta content="light dark" name="color-scheme"/>` 与 [assets/site.css](../../assets/site.css#L3) 残留暗色变量统一收敛为 `light`，并在每一批发布时同步刷新全站 HTML 中 `site.css?v=`、`monochrome.css?v=`、`site.js?v=` 的版本号与页脚 `.site-version`（`v2.2.7` / `v2.3.0` / `v2.3.1`）。

STATUS: APPROVED
