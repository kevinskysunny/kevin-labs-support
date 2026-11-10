# kevinlabs.app 站点问题与推广建议（2026-11-10，只读检查）

> 来源：2026-11-10 中午（上海时间）对线上页面的只读抓取（HTML、robots、sitemap、canonical、按钮链接）。没改代码，没投稿。
> 请 Codex 先在仓库里逐条**核实**，确认属实再改；与实际不符的条目请标注「不成立」并说明。

## 背景
- kevinlabs.app 是 Kevin Labs 的官网，同时承担直销（Paddle）。直销产品：NextMirror（14 天试用）、SmoothCast Pro、BarNest Pro、MindCharge、MacPulse（仅官网直销）。VolMix 走 Mac App Store。
- BarNest：App Store 版官网已不再推广，只推直销版 BarNest Pro（https://barnest.kevinlabs.app/）。
- 官网统计刚上线，近 30 天样本很小（34 次访问 / 11 次下载请求 / 1 笔付费），不能据此判断转化。

## P0：直接影响下载和成交
1. **MindCharge 下载按钮失效文案**
   - 现象：中英文首页按钮仍是「下载即将开放 / Download coming soon」。
   - 实际：https://mindcharge.kevinlabs.app/download 已能下载 MindCharge.dmg。
   - 建议：按钮改为指向真实 /download，文案改成「下载试用 / Download」。
2. **旧 BarNest 页仍在推 App Store 版**
   - 页面：https://kevinlabs.app/barnest/index.html （写着 Mac App Store、Launch Special $2.99、7 天试用；canonical 指向自己）。
   - sitemap 里该页优先级 0.9。
   - 建议：301 跳转到 https://barnest.kevinlabs.app/；从 sitemap 移除旧页；站内所有 BarNest 链接改到直销页。
3. **首页定位像帮助站而非产品站**
   - 现象：title / meta description 仍是 "Official Support & Guides"；首屏主推 VolMix、MacPulse、BarNest Pro，NextMirror、SmoothCast、MindCharge 放在 More apps。
   - 建议：title / description 改为产品导向；首屏展示直销产品（建议 NextMirror 靠前），每个产品有清楚的「下载试用」和「购买」按钮；帮助文档移到 /guides 或 support 子域。

## P1：搜索收录（SEO）
4. **sitemap**
   - https://kevinlabs.app/sitemap.xml：首页 lastmod 仍为 2026-10-08；缺各直销子域；mindcharge 条目挤在一行（格式需检查是否合法）。
   - barnest.kevinlabs.app、macpulse.kevinlabs.app 的 /sitemap.xml 返回 404。
   - 建议：更新 lastmod；每个子域提供自己的 sitemap，并在各自 robots.txt 里声明；去掉旧 BarNest 页。
5. **canonical 错误或缺失**
   - https://kevinlabs.app/guides.html 的 canonical 和 og:url 错指首页 → 改为自身 URL。
   - SmoothCast、BarNest Pro、MacPulse 根路径缺 canonical（MacPulse 只有 /en/ 有）→ 补自引用 canonical。
6. **多语言处理**
   - 首页把 8 种语言写在同一 HTML 里，没有 hreflang；首页还用 `?lang=` 链接 BarNest / MindCharge。
   - SmoothCast 默认中文，没有 /en/ 路径（访问 404）。
   - 建议：站内链接不要再带 `?lang=`；有独立语言路径的页面补 hreflang（含 x-default）；SmoothCast 视情况补英文页，或至少不暴露 404 链接。
7. **重复站点**
   - support.kevinlabs.app 与 kevinlabs.app 内容重复，首页 canonical 指向 kevinlabs.app。
   - 建议：确认主域；support 子域整体 301 到对应页，或全部 canonical 指向主域。
8. **BarNest /download 的 HEAD 请求返回 500**（GET 正常，可下到 BarNest-Pro-1.0.2-98.dmg）。
   - 建议：让 HEAD 正常返回 200/302，避免检测工具和部分爬虫误判。

## P2：推广准备（站点修好后）
9. 每个产品页确认有：OG 图片 / Twitter card、简短功能截图或视频、系统要求、试用说明、价格、隐私说明、联系方式。
10. 提交 Mac 应用目录（Kevin 自己提交或另行审批，Codex 不需要提交）：
    - awesome-mac（https://github.com/jaywcjlove/awesome-mac）中英文 README 均未收录，按贡献说明一个应用一个 PR。
    - MacUpdate（要求可下载试用）、AlternativeTo（Suggest new application）、Product Hunt。
    - 适合：NextMirror、SmoothCast、BarNest Pro、MacPulse；MindCharge 等按钮修好后再提交。
11. 社区：V2EX「分享创造」、Hacker News Show HN（需能直接试用、作者在场讨论），写开发过程和局限，不写成广告；X、Reddit 账号目前粉丝/karma 很低，短期带量有限。

## 未核实
- Search Console 当前是否仍报重复页面错误。
- 页面速度（没跑 Lighthouse）。
- Product Hunt / AlternativeTo 是否已有条目（搜索页 403）。
- NextMirror 的访问是否来自少数派文章。
