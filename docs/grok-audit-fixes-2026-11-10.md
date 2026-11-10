# Grok反馈补修审核

日期2026-11-10。状态：本机完成、已提交审核；**新增补修未部署，待用户审阅diff后确认**。

- BarNest商店支持页中文步骤4的7天改为14天。逐语核查八语，其余没有残留七天说法；英文步骤4原不含天数，其余六语没有步骤4徽章，不为文字修正新增内容结构。
- 采集器1.1.1支持kl_test=0：Max-Age=0删除Domain=.kevinlabs.app、Path=/标记，并清除当前主机旧host-only标记。其他域只清自身标记，保留其他偏好；kl_test=1仍跨子域持久排除。同步到中央分发源与五站现有副本，未替换各站域名列表和业务脚本。
- 中央网页与服务端统计入口明确按大小写不敏感的KevinLabsMonitor子串排除；X-KevinLabs-Test: 1保持。三个产品共享下载helper同步UA匹配；SmoothCast原下载helper缺测试请求头/Query/Cookie短路，本次补齐。MacPulse当前没有这份自定义采集器，本次不添加统计。

线上只读核实：X-KevinLabs-Test: 1在event/server-event均204；KevinLabsMonitor/1.0均204；Mozilla/5.0 KevinLabsMonitor在event204、server-event401，故不能声称原线上已满足所有UA包含匹配。使用空对象且无服务令牌，不产生有效事件。

验证：中央npm run verify通过（类型、28套/124项测试、学习资料与生产构建）；共享下载helper3项通过；主站30、BarNest25、SmoothCast37、MindCharge39项通过；NextMirror校验与MindCharge33页校验通过。真实Chromium验证六份脚本的共享/host-onlyCookie删除、偏好保留、跨域持久排除与恢复采集通过，全部拦截在隔离页面，不向生产发有效事件。

仅更新网站/采集器版本及缓存引用；价格、Paddle、App版本、安装包及法律实质条款不改。主站生成页面里的公共JS指纹同步更新，首页布局不变。此前批准设计已上线并单独记录，不能把其上线授权延伸至这些新增补修。
