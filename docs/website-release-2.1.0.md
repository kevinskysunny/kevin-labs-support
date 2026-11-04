# 网站 2.1.0：三款主展示与完整产品目录

2026-11-04，用户确认首页产品层级后实施。

- 三款同规格主产品：VolMix、BarNest Pro、SmoothCast，依次显示真实应用图标、用途、简短说明和查看入口。桌面三列，700px及以下单列；没有按销量排名的声明。
- 三款其他工具：PresenterDeck、NetDoctor、KSIC Studio。统一紧凑卡片，补齐用途说明与入口。
- 六款产品均只展示一次。首页移除大幅营销图片，最新图片继续保留在产品详情页/独立产品站；素材文件未删除。
- BarNest 商店版使用指南与隐私入口作为家族支持独立保留，与 Pro 官网入口区分。
- 八种语言、跟随系统、即时切换与持久化、无脚本英文回退、FAQ和邮件/Gmail入口保留。
- index.json 的网站版本同步为2.1.0；产品版本字段没有改动。

图标来源：VolMix/Sources/VolMix/Assets.xcassets/AppIcon.appiconset/icon_256x256.png、kl-ibar/Resources/Assets.xcassets/AppIcon.appiconset/icon_256x256.png、SmoothCast/Assets.xcassets/AppIcon.appiconset/icon_256x256.png，均来自本机对应项目，未重新生成或改色。

验证：8项Node测试；首页6种宽度×8语言共48组合，检查产品顺序与唯一性、桌面卡片同排等高、手机单列、图片解码及横向越界；语言持久化、FAQ和无脚本回退通过；原有全部链接目的地集合保留，本地链接可解析。

独立Hallmark完成复核：ship，范围为首页桌面/手机截图及八语结构。机械扫描仍保留历史文案和隐藏节点识别等告警，不把本次设计验收表述为全站规则零告警。验证摘要见 website-2.1.0-validation.json；临时截图和完整扫描在本地 .hallmark/home-2.1.0/。
