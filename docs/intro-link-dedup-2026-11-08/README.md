# App 介绍页末尾法律入口去重

2026-11-08。支持主站内部版本 2.3.2，NextMirror 网站内部版本 1.0.4；不改变 App 版本或下载制品。

| 实际页面 | 结论与处理 |
| --- | --- |
| nextmirror.kevinlabs.app 首页 | 正文末尾与紧邻页脚重复指向 legal.html；删除八语正文末尾链接段落，保留完整页脚及隐私摘要 |
| support.kevinlabs.app/presenter-deck/index.html | 英文、中文正文最后只有一个隐私标题和跳转句，与页脚重复；删除该空壳小节，保留页脚隐私入口及权限说明 |
| mindcharge.kevinlabs.app 首页 | 购买区的完整条款入口用于决策时查阅；页脚另有精确到隐私／购买／退款的锚点，保留 |
| barnest.kevinlabs.app 首页 | 无同类末尾法律入口重复；顶部和后段下载 CTA 有不同上下文，保留 |
| smoothcast.kevinlabs.app 首页 | 无同类末尾法律入口重复；导航、首屏和末尾下载入口服务不同浏览位置，保留 |
| support.kevinlabs.app 的 VolMix、BarNest 商店版、NetDoctor、KSIC Studio 介绍页 | 未发现正文末尾与页脚重复的法律入口，保留现状 |

本轮检查 9 个实际页面（包括 BarNest 商店版历史介绍）。PhotoSlim 目前只有隐私页，目录也只提供该入口，没有额外介绍页可纳入。NextMirror/MindCharge/SmoothCast 在支持仓库中的旧入口为转向独立站的兼容页，按最终目的地检查。

只删除紧邻页脚、同目的地且无额外决策信息的入口，不将同 URL 的所有上下文链接机械合并。其他营销文案和功能结构未作全面改写。

本地验证：主站 19 项、NextMirror commerce 33 项现有测试通过；网站八语、版本及安装包摘要校验通过；两个修改页面 × 八语选择 × 390/1440px 共 32 个浏览器场景通过，正文重复政策链接 0、页脚保留两项、无横向溢出或脚本异常。PresenterDeck 其他语言保持既有英文回退。机械设计检查无问题，并查看实际渲染截图。线上发布后的结果另存 production-verification.json；本机浏览器证据不代表 Safari／手机真机或国内直连验收。

线上验收：NextMirror 65beef7 已部署至 nextmirror-commerce-live；支持站 e41ddea 的 GitHub Pages 构建状态为 built。32 个生产语言／视口场景全部通过，三个保留政策目标 HEAD 均 200。没有发起支付、下载或邮件。两仓库本地实现提交与远端 main 一致。
