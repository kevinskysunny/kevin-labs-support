# App Store 全球入口修复 · 网站 2.4.1

2026-11-08。范围：支持官网五款 Mac App Store 产品；不改变独立销售产品的渠道或 App Store Connect 上架地区。

## 故障与修复

PresenterDeck 产品页缺少商店入口，首页卡片误标“查看支持”。其他产品使用无地区 HTTPS 链接，本机请求被 Apple 302 到 `/cn`，随后进入 `/cn/iphone/today`，丢失商品 ID；完整英文 slug、US 地区、platform=mac、uo=4、旧 itunes 域名也不能解决本机重定向问题。HTTP 200 不代表商品页验收成功。这是观察到的 Apple 网页区域跳转行为，不能推断应用仅中国区上架。

五款产品统一使用无国家的 `macappstores://apps.apple.com/app/id<ID>` 显式点击入口，绕过网页地区跳转，商店账户决定购买地区。保留可展开的 HTTPS 网页入口，由用户明确选择商店国家或地区；175 地区列表采自 Apple 当日的国家选择页，不把网页语言或 IP 当作账户地区，不强制 CN/US、不自动双重跳转。地区选择本机持久化，并独立于界面语言。禁用脚本时仍提供原生链接和标准 HTTPS 链接，但不能修复 Apple 自身的无地区网页重定向。

PresenterDeck 首页卡片八语统一为“了解应用”；介绍页标题恢复产品名，介绍页与支持页补商店按钮。新按钮及地区控制八语覆盖，已有正文语言回退不变。

来源集中在 index.json（商品 ID）、content/ui.json（文案）、content/store-regions.json（地区）；sync-store-links.mjs 生成产品页商店区域及客户端地区列表。App 版本不变，网站修订为 2.4.1，共享资源指纹同步。

## 验证

- 20 项 Node 测试通过，含生成结果一致性、单一商品来源与网站版本一致性。
- 80 个五产品×八语言×两视口场景通过；每款覆盖全部175地区URL，其他场景覆盖8个代表地区；验证 ID、归因参数、无横向溢出、语言独立、地区持久化和存储禁用。此测试屏蔽外部网络，只证明本站行为。
- 16 个原有多语言交互场景、154 个布局组合回归通过。
- Safari 实际点击 PresenterDeck 本机网站入口并进入原生商品页；五个无国家原生链接均在本机 App Store 显示对应标题（PresenterDeck、VolMix、NetDoctor、KSIC Studio、BarNest），未执行购买或下载。
- 公共 iTunes lookup 在20个代表地区均返回5个商品ID。首次4个地区TLS失败已重试成功，不能把网络失败写成未上架。
- 先前实际 GET 检查五个 CN HTTPS 链接均保留正确商品ID及商品标题；其他地区经本机网络仍可能受 Apple 区域重定向影响，未声称所有国家、网络、账户均实测通过。

限制：本机原生账户测试不能替代175国购买验证；手选外国网页仍可能受Apple网络重定向影响，主要可用路线是Mac原生商店。未更改账户地区或承诺区域可购。iPhone/Windows可查看产品信息和网页入口，安装需兼容Mac。

## 官方依据

- [Apple 商店地区列表](https://apps.apple.com/choose-country-region)
- [Campaign links：本地 storefront 行为](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links)
- [App Store 供应地区与账户地区](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store)
- [Mac 商店账户地区](https://support.apple.com/en-gb/guide/app-store/fir230e49a06/mac)

部署证据在同目录 deployment.md，保留真实线上构建和资源核对结果。
