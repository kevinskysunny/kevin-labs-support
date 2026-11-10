# 产品页统一建议与NextMirror尾部小修

日期2026-11-10。用户希望讨论以 https://macpulse.kevinlabs.app/ 为参照统一各App页面。本轮对MacPulse、NextMirror、SmoothCast、BarNest Pro和MindCharge的公开首屏及尾部做了只读浏览器对照。用户随后已明确授权：先发布两项小修，再推进完整优化。整体优化目前进入结构梳理，下一步以NextMirror实施样板后扩展其它产品；新优化版本仍须先审核diff再发布。

## 判断

建议统一结构、组件和操作习惯，沿用各产品自己的配色、真实展示和功能重点。MacPulse值得参考的是清楚的产品展示、分区节奏、价格与FAQ结构；按每款产品的信息量取舍，不机械复制所有区块或统一成橙色。

| 统一部分 | 建议 |
|---|---|
| 页头 | Kevin Labs / 产品名，固定的功能、价格、支持与语言入口；手选和系统模式保持 |
| 首屏 | 一句话说明用途，实际界面/录屏配合兼容信息；直销试用/购买动作明确，商店版保留实际商店渠道 |
| 正文 | 少量功能组配真实示例，接兼容条件/权限/试用与价格；保持相近字号、内容宽度、留白和按钮形状 |
| 支持与隐私 | 支持只有一个主要联系入口；保留完成使用决策所需的隐私摘要，完整法律入口集中页脚 |
| 页脚 | 一套对齐、间距与语言样式，同一法律目的只出现一次；法律目标依据各产品实际购买渠道，内部网站版本不抢占用户空间 |

现有五站已有共同品牌基础；差异主要是页头结构、首屏展示、正文密度和尾部组织。NextMirror目前偏长文、首屏主要是放大图标；BarNest Pro较精简，MindCharge已有产品示意；这些应按任务调整，而不是把内容都加成与MacPulse同样长。

实施顺序建议：先把NextMirror作为一页样板确认，再扩展其余直销产品，最后校对商店版页面。主站上3下6布局保持。商店/直销政策、价格、Paddle、路由/接口、统计、下载/授权/恢复购买全部作为冻结项。

代码落点：MacPulse使用server/src/landing.js与i18n.js的服务端页面，NextMirror使用website/public HTML/CSS，SmoothCast使用site与worker生成器，MindCharge使用website构建器。优先用一致的组件规格和样式变量落到各自现有来源，不为统一外观引入新的跨仓库框架或更改服务契约。

## 本轮已执行的NextMirror尾部去重（已上线验证）

用户另外明确指出页尾重复，本轮做最小修正：

- 八语正文中删除重复的“NextMirror—购买条款与隐私”链接，统一保留页脚法律入口与网站隐私入口。
- 删除八语隐私摘要末尾重复的“完整政策见下方”提示句，保留HDC本地处理、临时JPEG可能残留、激活/购买联网的全部实质说明；使用支持和联系入口保留。
- 去掉页脚内部网站版本1.0.2，保留版权；新增独立内部网站版本来源website/site-version.json，当前1.0.3。App版本1.0.1/build23、价格和购买流程未改。

来源文件：NextMirror仓库website/public/index.html、website/site-version.json；没有改支付或统计代码。原网站检查脚本通过（八语、App版本、既有DMG摘要）；本地浏览器八语×390/1280px共16组通过：每种语言仅一个完整政策入口、一个网站隐私入口，必要隐私披露保留，无横向溢出。

本轮没有将NextMirror完整重构成MacPulse风格，仅完成用户已指出的尾部重复；其他产品页未修改。修后本地预览：官网仓库output/playwright/nextmirror-footer-1280.png、nextmirror-footer-390.png。五站公开页面对照在output/playwright/product-ui-comparison.png（只供本次设计评审）。

用户批准后，尾部去重已上线（NextMirror来源e51f4ef，Worker版本见product-page-polish-release-2026-11-10.json）；生产GET200、正文重复链接已删除、页脚仅一个完整政策入口，隐私披露保留。完整统一优化继续在审核版本实施。
