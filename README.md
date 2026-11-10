# Kevin Labs Support

静态产品目录、支持、使用指南和隐私页面。正式门户为 https://kevinlabs.app；GitHub Pages 从 main 根目录部署，support.kevinlabs.app 保留为内容源站及历史入口。Cloudflare 仅对主域名提供固定源站转发，配置与回滚见 docs/brand-integration-2026-11-08/README.md。

## 本机开发与验收

```sh
npm ci
npm run build
npm test
npm run test:browser
npm run test:interactions
node tests/browser-store-links.mjs
node tests/browser-mail-fallback.mjs
npm run test:footers # 按五个实际域名逐路由检查公开页脚
python3 -m http.server 18765 --bind 127.0.0.1
```

浏览器验收使用已安装的Google Chrome；其他安装位置通过`BROWSER_EXECUTABLE`指定。`SITE_BASE_URL`可指向生产地址做同样的只读验收。测试屏蔽外部请求，剪贴板交互使用模拟，不发邮件、不触发购买、下载或真实剪贴板写入。浏览器布局结果保存到忽略的`output/playwright/`。

## 内容与版本来源

- `site.json`：网站内部版本、语言列表及主题。网站版本不在面向用户的页脚展示（2026-11-08用户明确要求）；产品版本独立维护。
- `content/home.json`：八语产品目录文案，由`render-catalog.mjs`生成首页目录；原FAQ与法律正文保留。
- `content/ui.json`：八语提示、复制反馈、邮件模板与语言回退说明，由`build-ui.mjs`编译到延迟加载的`site.js`。HTML默认英文、禁用脚本时仍可浏览。
- `index.json`：机器可读产品目录、链接及带核查日期的版本快照；不是自动获取的实时商店版本。
- `content/product-details.json`：兼容旧API的能力细节；`sync-products.mjs`从index.json派生旧`assets/products.json`中的版本、简介及链接，避免双写。
- `sync-site.mjs`：共享资源SHA-256指纹与内部网站版本同步；不改产品版本。

先修改来源再执行构建，不直接编辑生成区。首页以 NextMirror 为首，优先展示五款直销产品及下载/购买入口，另列四款工具；BarNest商店版不再在目录推广，既有支持/隐私直达地址保留；DOM、视觉与键盘顺序一致。

## 样式与跨端约束

共享基础为`assets/site.css`，现有浅色品牌主题为`assets/monochrome.css`。在Antigravity原有卡片、轻阴影、圆角、渐变舞台和悬停反馈上修复布局；不随意换主题或另起视觉系统。组件规则在前、响应式规则在后，避免后置桌面规则覆盖窄屏。目录、图文Hero和纯文字支持页分别处理。DOM顺序直接表达视觉/键盘顺序。

主要操作触控目标44px；正文16px；手机卡片单列、中屏两列、宽屏三列。保留权限和兼容限制、历史BarNest商店版支持页面（不在首页展示）、产品分发渠道、法律链接和既有隐私统计行为。独立产品站另有仓库，本仓库规范链接与语言传递，不代替其购买或授权实现。

## 审查与发布证据

- `docs/ui-audit-2026-11-08/README.md`：原42项审查及基线截图。
- `docs/ui-implementation-2026-11-08/`：Antigravity独立审查、实施对应表与验证边界。
- `docs/website-release-*.md`：按批次发布记录。

Safari/iOS真机、读屏和真实交易必须分别验证，不将Chrome或代码审查结果标成这些平台已经通过。

全站设计接收与五域名优化记录：`docs/full-site-reception-2026-11-08/README.md`。当前设计以该记录和design.md为准，保留此前报告作为历史。

## 官网产品上架与商店入口

商品入口从 `index.json` 统一生成（`scripts/sync-store-links.mjs`），八语文案来自 `content/ui.json`，完整商店地区来自 `content/store-regions.json`。地区选择独立于界面语言；原生商店只在点击时打开。地区列表更新时重新核对 Apple 官方列表，不按UI语言强制 CN 或 US。

本机可复用技能：`skills/product-website-launch/SKILL.md`。2.4.1 修复与真实验收边界：`docs/store-routing-2026-11-08/README.md`。
