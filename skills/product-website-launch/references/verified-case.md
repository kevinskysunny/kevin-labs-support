# Kevin Labs 支持官网案例（2026-11-08）

证据位置：本技能所在仓库 docs/store-routing-2026-11-08/README.md；源码版本2.4.1。不是其他项目的固定模板，执行时重新核查。

- index.json管理商品ID；content/ui.json管理八语文案；content/store-regions.json保存Apple当日175商店地区。
- scripts/sync-store-links.mjs从上述来源生成五产品介绍页商店区域；不影响BarNest Pro等直销渠道。
- tests/browser-store-links.mjs验证80产品/语言/视口组合、175地区路径、语言独立、持久化、禁用存储；harness屏蔽外网，不构成商店落页证据。
- 无国家及US HTTPS链接在本机Apple端丢ID落Today，CN链接正确；仅加英文slug、platform或uo参数无效。不能硬编码CN来掩盖全球问题。
- Safari显式原生链接已看到五个正确商品标题；20地区lookup均返回五个商品。其余国家、不同账户和网络不可据此宣称实测。
- “查看支持”改成“了解应用”须同时修介绍页定位和获取入口；只换文案仍未完成新用户路径。

邮件入口补充（2.4.2）：“发邮件”按钮原为mailto且没有反馈。命中正常/defaultPrevented=false也不代表外部邮件应用已打开；修复增加八语即时反馈和显式复制/Gmail备用，测试在window末端模拟无处理器验证网页行为，不声称用户环境已配置。见docs/mail-fallback-2026-11-08/README.md。
