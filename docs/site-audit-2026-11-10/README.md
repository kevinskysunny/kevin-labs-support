# kevinlabs.app 审计修复与部署前审核

日期：2026-11-10（Asia/Shanghai）。依据：`../kevinlabs-site-audit-2026-11-10.md`（Grok bot 建议）。本轮逐条核对本机真实来源与线上 HTTP/浏览器行为；截至本报告交付，修改仅在审核分支，**尚未部署**。以下「已修」均指代码及本机验证，不能理解成线上已经生效。

## 最新范围调整（2026-11-10，用户确认）

用户最终选择保留原首页视觉：上方 VolMix 图文大卡片、MacPulse、BarNest Pro，下方 NextMirror、SmoothCast、PresenterDeck、MindCharge、NetDoctor、KSIC Studio，共上 3 下 6。用户随后按图先对调下方 MindCharge 与 PresenterDeck，再对调 PresenterDeck 与 SmoothCast，最终顺序已同步八语。不对调 VolMix/MindCharge，不新增 NextMirror 图片，不给首页增添按钮。下文原首页重排方案已撤回；产品导向 title/description、下载与 SEO/路由修复保留。MindCharge 将来上架 Apple 商店是用户计划，不代表当前已上架，不新增商店地址。

## 逐条结论

| 编号 | 优先级 | 核实与状态 | 实际处理 |
|---|---|---|---|
| 1 | P0 | **不成立：正常浏览器加载后按钮失效**；**已修：初始 HTML／无脚本状态仍禁用** | 线上浏览器实测加载 `/release.json` 后为 `Download free trial`，`aria-disabled=false`，链接 `/download`。初始 HTML 确有 coming soon、`#release`、禁用标记；修改 MindCharge 构建源，七种语言默认即提供 `https://mindcharge.kevinlabs.app/download`，保留原发布状态检查。不是修改安装包或发布清单。 |
| 2 | P0 | **已修** | 原主域 `/barnest/index.html` 实测 200、canonical 自指。门户 Worker 对 `/barnest`、`/barnest/`、`/barnest/index.html` 返回 301 到 BarNest Pro；从 sitemap 移除。旧源页 canonical 同步指向 Pro；历史商店版帮助与隐私保留。 |
| 3 | P0 | **已修：title/description；首页视觉重排按用户最新意见撤回** | 保留产品导向 SEO 元信息；首页恢复上 3 下 6、VolMix 大图及既有产品顺序，下载/购买动作保留在产品落地页，不再添加首页 CTA。 |
| 4 | P1 | **已修：日期、清单及子域 sitemap**；**不成立：单行 XML 非法／主站必须混入子域 URL** | 原 XML 可解析，单行本身没有错。规范缩进，更新首页和指南实际变更日期，移除旧 BarNest 及 canonical 指向独立站的兼容入口。BarNest 新增静态 sitemap/robots，MacPulse 新增服务端 sitemap/robots；已有 SmoothCast/MindCharge/NextMirror 继续独立维护。MindCharge sitemap 补真实语言内容页。未对未变正文的页面统一伪造 lastmod。 |
| 5 | P1 | **已修** | guides.html canonical 与 og:url 确实错指首页，已改自指；SmoothCast/BarNest/MacPulse 根路径确实缺 canonical，已补。MacPulse 已有语言页 canonical 和 hreflang，保留；即使根路径读取语言 Cookie，canonical 仍稳定自指根路径。BarNest 支持/隐私/更新路由分别自指，不一律指向首页。 |
| 6 | P1 | **已修：导航语言参数与真实语言页 hreflang**；**不成立：八语共用 URL 必须有八条 hreflang** | 清理主站及相关子站导航动态添加的 `?lang=`，保留旧入站参数兼容解析、本站语言持久化、自动模式。MindCharge 的七语独立路径补自引用 canonical、相互 hreflang 与 x-default；MacPulse 已有八语/x-default，保留。SmoothCast `/en/` 实测 404，但其单 URL 已支持切换语言，本站未暴露该不存在路径，因此不虚构英语路由、不为同 URL 添加假语言集合。跨域无独立语言路径时由目标站自身设置／系统语言决定。 |
| 7 | P1 | **已修（canonical 方案）** | support 首页与主域重复且已经指向主域。补齐缺失的文档 canonical、纠正 guides 页面。support 是主域门户当前内容源，整体 301 会令门户回源循环，因此保留源站，选择用户允许的 canonical 方案。独立产品兼容页保留其真实产品 canonical。 |
| 8 | P1 | **已修** | 线上 GET `/download` 为 302，HEAD 为 500，确实存在。原因是 HEAD 被透传到 releases.json，随后解析空响应体。内部 manifest 请求固定 GET，对外仍返回 302；附 GET/HEAD 回归测试，并避免 HEAD 文档响应读取空 HTML。统计代码未修改。 |
| 9 | P2 | **已修：站内社交卡片／信息核查；需我决定：真实媒体素材** | 补齐产品分享 OG/Twitter 字段，MindCharge 分享图从 SVG 改现有 PNG 图标。五款直销站原有系统要求、功能、试用、价格、隐私和联系入口保留，没有重写商业承诺。MacPulse 已有真实功能截图；其他四站以文字、交互示意或产品图标为主，仍缺经确认可公开使用的真实截图／视频，不能把图标或示意图冒充实拍。BarNest 仓库有推广图，需确认采用哪张及其当前版本适用性；NextMirror 本轮已有未跟踪图片，未擅自纳入。建议单独确认素材后追加。 |
| 10 | P2 | **需我决定（按本轮要求暂不执行）** | 不向 awesome-mac、MacUpdate、AlternativeTo、Product Hunt 提交，不创建外部目录 PR。是否已有收录不影响本站修复，本轮未声称核实。 |
| 11 | P2 | **需我决定（按本轮要求暂不执行）** | 不向 V2EX、HN、X、Reddit 投稿或发消息。没有联系 Antigravity 的可用入口，未声称已与其讨论。 |

## 未动的范围

没有修改任何价格／优惠期限、Paddle 产品与结账配置、支付 API、许可证逻辑、应用版本／安装包／发布清单、统计脚本或统计模块。导航 URL 的规范化会改变访问 URL；这不是改统计实现。没有使用低样本访问数推断转化，没有开展外部推广，没有部署。

Search Console 当前告警、Lighthouse 分数、目录实际收录和 NextMirror 来源归因均未取得新证据，不写成已核实或已修复。

## Diff 摘要与文件

- 主站网站版本 2.8.3：`content/home.json`、`scripts/render-catalog.mjs`、`index.html`、`assets/monochrome.css` 恢复原八语上 3 下 6 布局和 VolMix 图文展示；`assets/site.js`、`assets/smoothcast-redirect.js` 清理链接，兼容旧入站参数；`guides.html`、`edge/worker.mjs`、`sitemap.xml` 修复 SEO/路由；`scripts/sync-site.mjs` 补元信息；其余 HTML 为元信息或共享资源指纹同步。原 `.hallmark/` 未纳入。
- SmoothCast 网站 1.2.15：`site/index.html`、`site/assets/js/legal.js`、`scripts/site.test.mjs`、`package.json`、`package-lock.json`。生成 dist 为忽略产物，不单独提交。
- BarNest 网站 1.4.21：`website/worker.mjs`、`website/public/index.html`、`website/public/assets/site.js`、`website/public/{robots.txt,sitemap.xml}`、`website/test/seo.test.mjs`、`website/package.json`。已有 videos/ 未纳入。
- MacPulse 网站服务 1.4.2：`server/src/{landing.js,index.js,i18n.js}`、`server/test/pages.test.mjs`、`server/package.json`、`server/package-lock.json`。
- MindCharge 网站 1.0.8：`scripts/build_website.py`、`website/public/assets/site.js`、`website/site-version.json`、`website/public/sitemap.xml` 与 33 个生成 HTML；没有编辑购买脚本中的价格或 Paddle 调用。
- NextMirror：`website/public/index.html`、`website/public/assets/site.js`，仅 SEO／导航，不改变 App 版本。已有未跟踪 `NextMirror0923.png` 未纳入。

完整逐仓库文件列表、基线、提交与远端核对见 `delivery.json`；主站文件列表和完整 diff 见 `files.txt`、`changes.diff.gz`（完整补丁压缩包）。本次不用发布分支推送静态内容，防止 GitHub Pages 提前上线。

## 验证证据

- 主站 27 项测试通过；BarNest 24 项（含新增 HEAD 下载回归）、MacPulse 38 项、SmoothCast 36 项通过。
- 主站 154 组页面×尺寸布局检查通过，16 组本地化联系/布局场景与语言持久化、系统模式、键盘、无 JS 回归通过；首页八语及自动模式、390/1440 宽度的上 3 下 6 布局、原有产品顺序与干净 URL 检查通过。
- MindCharge 33 页生成检查通过；浏览器验证无 JS 下载入口、七语言 alternates+x-default、手动切换与自动模式刷新持久化。线上正常加载下载按钮可用（未点击下载）。
- NextMirror 原有网站检查通过（八语、版本及本地既有 DMG 摘要核对）；未执行购买。
- 所有仓库 diff whitespace 检查通过。改动审核确认价格文件、commerce 配置、统计模块未纳入；共享脚本只改导航逻辑。
- 线上抓取摘要：`evidence/live.json`。HTTP 表示抓取时状态，不表示搜索引擎已经收录。浏览器检查屏蔽统计请求、购买和下载操作；未下单、未发送邮件。

## 确认上线后的验收清单（尚未执行）

| URL／请求 | 期望结果 |
|---|---|
| `https://kevinlabs.app/` | 200；原始 title/description 为产品导向；八语切换保持上 3 下 6 的原有布局与顺序；VolMix 图文展示正常，无新 `?lang=` 导航 |
| `https://mindcharge.kevinlabs.app/`、`https://mindcharge.kevinlabs.app/i18n/zh-Hans/index.html` | 原始 HTML 中下载文案正确、无禁用标记，链接指向 `https://mindcharge.kevinlabs.app/download`；后者 canonical 自指，含七语与 x-default |
| `HEAD https://mindcharge.kevinlabs.app/download` | 200，附件为 MindCharge.dmg；不以成功下载代替签名/公证验收 |
| `GET/HEAD https://kevinlabs.app/barnest/index.html` | 301，Location 严格为 `https://barnest.kevinlabs.app/`，不回旧商店页 |
| `https://kevinlabs.app/guides.html` | canonical 与 og:url 均为该完整 URL |
| `https://smoothcast.kevinlabs.app/`、`https://barnest.kevinlabs.app/`、`https://macpulse.kevinlabs.app/` | 200；源 HTML 含自引用 canonical 与 OG/Twitter；MacPulse 携带语言 Cookie 时 canonical 仍为根路径 |
| `https://macpulse.kevinlabs.app/en/`、`https://macpulse.kevinlabs.app/zh/` | 各自 canonical 自指，八语 hreflang+x-default，相互对应 |
| `https://kevinlabs.app/sitemap.xml` | 可解析 XML，首页/指南 lastmod 为 2026-11-10，没有旧 BarNest 及指向独立站的兼容入口，无跨域 URL 混入 |
| `https://barnest.kevinlabs.app/sitemap.xml`、`https://macpulse.kevinlabs.app/sitemap.xml` | 200，application/xml（BarNest 静态源可为 text/xml），仅本站公开内容页，不包含结账、授权 API 或安装包 |
| `https://barnest.kevinlabs.app/robots.txt`、`https://macpulse.kevinlabs.app/robots.txt` | 200，含各自域名的 Sitemap 声明 |
| `https://mindcharge.kevinlabs.app/sitemap.xml` | 包含七语独立内容与法律页，不把恢复许可证或结账页作为推广落地页 |
| `https://support.kevinlabs.app/`、`https://support.kevinlabs.app/guides.html`、`https://support.kevinlabs.app/volmix/index.html` | 作为源站保留 200；canonical 指向对应 `https://kevinlabs.app/` 页面，主站不发生循环跳转 |
| `GET/HEAD https://barnest.kevinlabs.app/download` | 两者均 302 指向同一现有公开 DMG；HEAD 不再 500，响应体为空 |
| 五款产品的现有购买入口 | 导航仍到各产品原有购买页／价格区；比较原有价格、Paddle 配置及统计脚本指纹，确认未变化；不进行真实付款 |

部署需要分别发布五个子站和主站静态源／门户 Worker，不能从主站发布成功推导子站已生效。发布后逐项复测，并区分源站内容更新与主域边缘规则更新。收录／搜索缓存改善有延迟，HTTP 验收不等于搜索排名承诺。
