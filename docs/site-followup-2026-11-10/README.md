# 官网补修：上线前审核（2026-11-10）

状态：**已修待上线**。用户明确选择第1–6项一并实施并提交审核，发布前仍需批准。本次没有部署，没有更新主站生产 main，没有修改价格、Paddle 配置或统计代码；各仓库提交只包含 delivery.json 的声明文件。首页上3下6、卡片按钮、VolMix商店渠道、support内容源和既有多语言切换功能保持。

## 六项状态与实际验证

| 项目 | 状态 | 修改与实际结果 |
|---|---|---|
| 1 首页 description | 已修待上线 | 改正此前遗漏的独立 `meta name="description"`。静态 HTML 中 description/OG/Twitter 都是产品导向；脚本按已有语言选择同步 document.title 及五个 head 字段，八语完整。浏览器在八语＋自动模式、390/1440px 共18组中逐字段与语言源比对通过。|
| 2 XML 声明 | 已修待上线 | 主站声明精确为 `<?xml version="1.0" encoding="UTF-8"?>`，本机解析及声明断言通过。保留各子域独立 sitemap。BarNest 支持、隐私条目保留，恢复此前因旧跳转决定而移除的 App Store 营销页 `barnest/index.html`，三页 lastmod 更新为本次实际修订日期。|
| 3 /en/ | 已修待上线 | 门户 Worker 对 `/en/`、`/en/index.html` 的 GET/HEAD 均301到干净根路径，不保留 `?lang=`。单测确认无回源，Location 严格为 `https://kevinlabs.app/`，不伪造英语页或 hreflang。|
| 4 两站 /buy HEAD | 已修待上线 | NextMirror/MindCharge 仅为已有 `/buy` 增加 HEAD：复用 GET 的配置及售价有效性读取，返回同类状态和必要响应头，移除响应体；未配置/停售仍503，不伪装200。HEAD不调用已有促销清理函数，测试验证数据库未变、未发邮件；GET原路径、价格、交易、授权实现保持。每站验证正常GET/HEAD200、Content-Type一致、HEAD空体及不可用HEAD503通过。|
| 5 斜杠兼容 | 已修待上线，部分不成立 | NextMirror `/buy/`、`/download/`；MindCharge `/download/`；BarNest Pro `/buy/`、`/download/`；SmoothCast `/download/`、`/support/`、`/privacy/`；MacPulse同三路由，均仅对GET/HEAD301去尾斜杠并保留其它查询参数。**不成立／不改**：MindCharge `/buy/`本次HEAD200、BarNest Pro `/support/`和`/privacy/`200，保持原状；SmoothCast/MacPulse本来无 `/buy`，未新增。已用既有Worker单测验证301与查询参数；下载没有跟随GET获取安装包。线上修前28次HEAD结果见 evidence/routes-before.json。|
| 6 BarNest App Store版 | 已修待上线；canonical仅建议，未改 | 三份源页八语明确适用Mac App Store版，并提供BarNest Pro首页、直销支持、直销隐私链接；官网正常产品目录仍只推广Pro。支持页及营销页统一14天、$0试用内购、不自动扣费，保留$2.99与$5.99，注明2026-12-01起$5.99。营销页与机器目录版本1.0.2（依据用户确认，App ID 6820881227不变）。隐私正文逐字未改，仅顶部添加版本范围提示；移除该提示后 main正文SHA-256与修前完全一致。|

## BarNest 的路由和 canonical 评估

ASC登记的 `https://support.kevinlabs.app/barnest/`、`/barnest/support.html`、`/barnest/privacy.html` 当前HEAD均200，本轮保持这些网址和源站架构。主域两个支持/隐私页当前也均200，继续不跳转。

先前已经上线的门户规则把主域 `/barnest/`、`/barnest/index.html` 转向Pro，这与本轮确认的“App Store版营销页不跳转”冲突。因此本轮撤回这条既有规则，让这些App Store介绍路径正常回源；不把商店版换成Paddle版，不影响独立的 `https://barnest.kevinlabs.app/` 直销站，也不把商店版加回首页产品目录。

**canonical建议**：App Store营销页内容属于另一分发版本，当前指向 `https://barnest.kevinlabs.app/` 会混淆两版身份。建议后续统一为 `https://kevinlabs.app/barnest/`：主域同页自引用，support源页归一到主域对应的App Store介绍页。支持/隐私页已有主域各自canonical，可继续沿用。用户最新明确“先别改”，故本次保留营销页现有canonical，没有擅自实施建议；它是单列待决定项，不写成已修。

## Diff摘要／文件

- 主站 **2.9.0**：`index.html`、`content/ui.json`、`assets/site.js`修首页静态与八语动态元信息；`edge/worker.mjs`修英文兼容地址并撤回商店营销页的旧跳转；`barnest/{index,support,privacy}.html`修商店版文案与范围说明；`index.json`→生成的`assets/products.json`同步商店版1.0.2；`sitemap.xml`；版本清单与对应测试。其它HTML仅刷新共享site.js资源指纹，首页布局和顺序未改。
- NextMirror、MindCharge：`commerce/worker.mjs`、`commerce/test/worker.test.mjs`、`commerce/package.json`（服务内部1.0.1）。未改commerce价格、Paddle绑定、配置文件或App营销版本。
- BarNest Pro网站 **1.4.22**：`website/worker.mjs`、`website/test/seo.test.mjs`、`website/package.json`、`website/public/index.html`资源版本引用；直销正文与购买配置未改。
- SmoothCast网站 **1.2.16**：`scripts/worker_runtime.js`、`scripts/site.test.mjs`、`package.json`和锁文件；生成dist为忽略产物。没有新造购买页。
- MacPulse网站服务 **1.4.3**：`server/src/index.js`、`server/test/pages.test.mjs`、`server/package.json`和锁文件。

本轮进行期间，另一路会话在部分仓库提交了独立统计修复。本轮没有更改、撤回或混入那些文件；本轮diff以各自当前已发布Git基线为界，额外在原统计基线上仅应用本轮指定补丁，五仓库隔离测试全部通过。完整受控文件范围与基线/提交见 delivery.json；完整跨仓库补丁见 changes.diff.gz，主站文件列表见 files.txt。

## 验证命令及结果

本地实际执行：

```sh
npm run build
npm test
node tests/browser-seo-audit.mjs
node tests/browser-barnest-store.mjs
npm run test:browser
```

主站30项；NextMirror33项、MindCharge39项、BarNest Pro25项、SmoothCast37项、MacPulse39项，共203项单测通过。五个子仓库另以已发布的原统计版本加本轮补丁做隔离测试，全部通过。浏览器首页18组元信息/原顺序检查、App Store三页×八语×390/1440px共48组，以及原154组布局回归通过。FAQ价格折叠内容按DOM正文核查，未为测试而展开所有页面或改变既有交互。

隐私正文原SHA-256：`8a44c314ea8f24ec7fda7b8723896eb5f7c67228e0971c6c1efa0ba24bf5baa3`，去掉新加范围提示后完全一致。商店App ID、价格数字、首页3+6顺序及不推广商店版的断言通过。

本轮只读线上修前核查见 evidence/，不是发布后成功结果。**尚未执行生产发布与下列上线后验收**。

## 批准上线后的验证命令／期望结果

```sh
# 1：查看静态字段；另在浏览器切八语并检查head
curl -s https://kevinlabs.app/ | grep -iE 'name="description"|og:(title|description)|twitter:(title|description)'
# 2：标准UTF-8声明
curl -s https://kevinlabs.app/sitemap.xml | head -1
# 3：均301，Location严格指向根路径；根路径GET200
curl -sI https://kevinlabs.app/en/
curl -sI https://kevinlabs.app/en/index.html
curl -s -o /dev/null -w '%{http_code}' https://kevinlabs.app/
# 4：两站HEAD/GET均200，同类Content-Type；HEAD响应体为空
curl -sI https://nextmirror.kevinlabs.app/buy
curl -s -o /dev/null -w '%{http_code} %{content_type}' https://nextmirror.kevinlabs.app/buy
curl -sI https://mindcharge.kevinlabs.app/buy
curl -s -o /dev/null -w '%{http_code} %{content_type}' https://mindcharge.kevinlabs.app/buy
# 5：301到无斜杠路径；下载只HEAD或GET不跟随
curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://nextmirror.kevinlabs.app/buy/
curl -sI https://barnest.kevinlabs.app/download/
# 6：四个已登记支持/隐私地址均200且无Location
curl -sI https://support.kevinlabs.app/barnest/support.html
curl -sI https://support.kevinlabs.app/barnest/privacy.html
curl -sI https://kevinlabs.app/barnest/support.html
curl -sI https://kevinlabs.app/barnest/privacy.html
# 同时检查营销页200、保留三条sitemap和商店价格
curl -sI https://support.kevinlabs.app/barnest/
curl -sI https://kevinlabs.app/barnest/
curl -s https://support.kevinlabs.app/barnest/support.html | grep -iE '14|7-day|7 天'
```

生产验证须分开报告GET与HEAD，不跟随GET下载完整安装包，不进行真实购买或邮件发送。canonical建议另等明确决定，本批不得顺手修改。
