# 2026-11-10 已上线与生产验收

用户确认「就这样吧。安排上线吧」后执行。发布来源为已审核的主站 **2.8.3 / afe1ec2** 及 delivery.json 中五个产品站提交；没有把其他 App 工作、未跟踪图片或 .hallmark 文件带入发布。

## 结果

- 主站 main 已安全快进并推送至 afe1ec2，GitHub Pages 构建成功且对应同一提交。主站门户与五个产品子站共六个 Worker 均已发布，部署版本与前版本见 deployment.json，可据此回滚。
- 首页保留上 3 下 6：VolMix 图文大卡、MacPulse、BarNest Pro；下方 NextMirror / SmoothCast / PresenterDeck，MindCharge / NetDoctor / KSIC Studio。
- 63 项生产 HTTP 验收全部通过：旧 BarNest 页 GET/HEAD 均 301 到 Pro，下载 GET/HEAD 均 302；MindCharge 初始 HTML 中英文下载按钮可用、下载 HEAD200；guides canonical/og:url 正确；三个子站自引用 canonical、真实语言页 hreflang、sitemap/robots 及 support 指向主域均已核实。
- 生产浏览器验证：首页八语与自动模式×390/1440px，共18组，卡片顺序、3+6结构与无lang查询导航通过；五个产品站×390/1440px，共10组，手选德语、刷新持久化、系统英语、无脚本错误、无破图及水平溢出检查通过。
- 全部站点发布前后 plain-text变量及secret绑定对比相同；本次保留现有变量，没有更改价格、Paddle配置、统计实现或数据库。既有安装包部署前后摘要相同，未重新编译或替换 App。
- 主站三份共享 JS/CSS 的生产指纹与来源完全相同；八语首页目录原始内容相同。Cloudflare 现有邮箱保护会改写邮件链接，因此原始 HTML 不能直接做整页字节等同；仅还原该现有邮箱保护改写后，整页与来源完全一致，没有更改邮箱保护设置。

## 发布过程中的边界

GitHub Pages 构建完成之前，第一轮读取主站仍得到旧内容，另有两次 support 路径 TLS 连接失败。这批观察保留为 evidence/production-http-initial.json；等待正式构建成功并对只读请求重试后，最终63项全部通过，不把初次传播中间态混作最终验收。

未执行真实付款、发邮件或外部推广；未把页面访问成功冒充完成交易、搜索引擎已重新收录或全地域可达。真实产品截图/视频的选择仍按原报告留待确认，不影响本次已批准入口与SEO修复上线。

## 证据

- deployment.json：各站来源提交、部署与回滚版本，以及主站构建提交。
- evidence/production-http.json：正式URL、HTTP状态、canonical/hreflang等63项结论。
- evidence/production-subsites-browser.json：五个产品站10组生产浏览器结果。
- evidence/configuration-checks.json、asset-fingerprints.json、source-fingerprints.json、pages-build.json：配置保持、资产/源码指纹及正式构建证据。

本发布记录后续提交在审核分支，生产应用来源仍为上述已验证提交，避免只为文档变更再次触发官网内容发布。
