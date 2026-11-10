# Grok补修生产发布记录

2026-11-10，用户审阅补修diff及两轮Grok源码复核后明确批准上线。主站网站2.10.1、NextMirror网站1.1.1、BarNest Pro网站1.5.1、SmoothCast网站1.3.1、MindCharge网站1.1.1及中央服务1.1.3/采集器1.1.1已发布。App版本、安装包和真实价格不变。

## 实际来源与发布路径

- NextMirror: `b64f8639b2e7bc8153100b981bbfc0677a329cab`（以已上线`532398cc497c`为基线的批准增量）。
- kl-ibar: `2c40b097c359f9a10defdbd8f7d41e67afa6e290`（以已上线`dcae39789cbd`为基线的批准增量）。
- smoothcast-site: `5c813ce6c838e7664cb579d81e5a1cb13b26994a`（以已上线`4b16181fce40`为基线的批准增量）。
- mindcharge: `e17f3c01fd588d983c23cdae11a8d6038d70f4de`（以已上线`13ea7d69325a`为基线的批准增量）。
- portal: `b2e8b3604cb0469dd227260da596c86f913aad63`（以已上线`fbc91649ec88`为基线的批准增量）。
- stats: `7406de9aac0a8b966c05f913a852c03e2839c619`（以已上线`347701b15be1`为基线的批准增量）。

主站main安全快进，GitHub Pages built对应同SHA；原主站只读代理未改，复用原Worker。四产品Worker以--keep-vars发布，前版本保留于JSON作回滚点。统计main仅快进批准的两项提交，通过既有CI/CD workflow_dispatch部署，运行42808911009成功；生产login明确显示7406de9时间戳版本。没有把产品审核分支整支合入落后的默认main，也没有带入统计仓库已有IMPLEMENTATION_PLAN.md改动。

## 生产验收

- 26项HTTP/资源检查通过：六份公开站点采集器与批准源码字节一致，两域BarNest商店支持页徽章14天，canonical与法律路由保持；NextMirror首页/法律页及SmoothCast六页资源指纹正确；四站download的HEAD正常。
- 16个生产页面真实Chromium验证：kl_test=1设共享标记，无参数导航继续排除，kl_test=0清共享Domain=.kevinlabs.app、Path=/及旧host-only标记并恢复采集，其他偏好保留；390/1280px共32组布局通过。恢复采集的POST全部在浏览器层拦截为204，没有写入有效合成统计事件。
- 中央两个入口用无令牌空对象请求验证：X-KevinLabs-Test: 1、KevinLabsMonitor/1.0、Mozilla/5.0 KevinLabsMonitor六项全部204；原server-event不带斜杠UA返回401的问题不再出现。204结论结合已部署过滤源码与实际版本，不代表执行了真实交易。
- 发布前后Worker变量和secret绑定完全一致；原30份安装包SHA-256全部一致。没有更改价格、Paddle、App版本/构建、发布清单或真实付款/发信流程。
- 中央/product-analytics.js原本受登录保护，匿名307到/login；未为核验新增公开权限。中央实际来源通过批准SHA、CI/CD与生产login版本核对，不声称匿名读取该文件成功。MacPulse未接这份自定义统计、Cloudflare Web Analytics范围均未扩展。

## 交叉复查

Grok Bot“运营专家”已实际返回线上只读复核：两域BarNest14天徽章及无七天残留、六站采集器1.1.1代码、NextMirror两页指纹和页脚、SmoothCast六页指纹均确认上线。Grok明确Cookie未做真实浏览器运行，本报告保留该限制；Codex另行完成16页真实浏览器行为检查。没有把消息发出当成已验证，也没有向未授权第三方发送消息。

### MindCharge指纹疑问的核实

Grok将查询参数与单文件SHA-256比较，提出参数可能未更新的疑问。Codex独立检查scripts/build_website.py第16行：ASSET_VERSION是SHA256(site.css + 源copy.json + site.js)前12位的组合值，并非各文件独立哈希。已上线父提交13ea7d6的组合值9011225962c5，本批因脚本变化更新为3514e06efea1，与所有生成引用及线上观察一致；因此没有此次缓存遗漏，不新增无关改造或部署。结论与可复算证据已回传Grok。

Grok最后已明确接受组合指纹结论，将这批补修全部记为已上线验证；其Cookie证据仍标明仅代码复核，与Codex真实浏览器证据分开。
