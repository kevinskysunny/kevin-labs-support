# 生产验收 · 2026-11-08

实现提交：f3b8cb8ac2ed7290dc2025e7ee68348a4f173e5d。origin/main与本地HEAD一致；GitHub Pages build status=built，commit精确匹配实现提交，error.message=null。

生产地址：https://support.kevinlabs.app/ 。site.json与index.json核对为网站2.4.1；八语目录PresenterDeck动作已统一为产品介绍入口。

线上11份资源核对通过：site.json、index.json与源码解析值一致；site.js、site.css与源码字节一致；首页及PresenterDeck介绍/支持页、VolMix、NetDoctor、KSIC Studio、BarNest商品入口的ID、原生协议和最新共享资源指纹一致。HTML保留已有边缘处理，不将整页字节相等作为唯一条件。

`SITE_BASE_URL=https://support.kevinlabs.app node tests/browser-store-links.mjs`：80产品/语言/视口生产场景通过；每产品175地区URL及代表地区、持久化、存储禁用和语言独立验证通过。此harness仍屏蔽外部请求，不能充当Apple真实落页证据。

另在Safari实际打开线上PresenterDeck介绍页并点击商店按钮，从先前BarNest商品页切换至原生PresenterDeck商品页，确认产品标题和副标题正确。五款原生链接本机测试及20区lookup结果见README。未购买、下载或更改账户地区。

可复用技能已随实现提交保存于skills/product-website-launch，通过quick_validate.py，本机~/.codex/skills/product-website-launch链接到仓库源码；实际自动触发留待下一任务验证。

此文档提交仅补验收记录，不改变上线资源；提交后再次核对远端与Pages构建状态。
