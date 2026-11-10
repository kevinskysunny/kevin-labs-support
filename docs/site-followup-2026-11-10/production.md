# 2026-11-10 补修上线与实际验收

状态：**已上线验证**。用户明确批准后，主站main安全快进到8762e5f（网站2.9.0），GitHub Pages构建成功且对应相同提交。门户与五个产品子站的六个Worker均已发布。来源、部署版本和前版本回滚点见deployment.json。

| 项目 | 实际生产结果 |
|---|---|
| 1 首页元信息 | 原始HTML五个description/OG/Twitter字段均为产品导向；浏览器八语＋自动模式×390/1440px共18组逐字段通过，首页上3下6及最终顺序保持。|
| 2 sitemap | XML首行精确为UTF-8标准声明；App Store版index/support/privacy三个条目保留，各子域继续独立。|
| 3 英文兼容网址 | /en/、/en/index.html的GET/HEAD均301，Location严格为https://kevinlabs.app/，无lang参数。首页GET200。|
| 4 /buy HEAD | NextMirror/MindCharge的GET和HEAD均200、Content-Type一致；浏览器实际读取HEAD响应体均0字节，GET响应体正常且非空。未真实购买。|
| 5 尾斜杠 | 已声明的11条缺失别名均HEAD301到现有无斜杠路径；NextMirror /buy/另以GET确认301。原本正常的MindCharge /buy/、BarNest Pro /support/与/privacy/仍200。SmoothCast、MacPulse /buy/仍404，未新增购买流程。没有跟随GET下载安装包。|
| 6 App Store版 | 主域及support域的/barnest/、index.html、support.html、privacy.html共8个网址GET/HEAD均200、无Location。八语顶部版本适用提示正确；营销页1.0.2、14天$0试用内购、不自动扣费，原价格与2026-12-01日期保留。隐私正文还原既有Cloudflare邮箱保护并去掉本次新增顶部提示后，与修前SHA-256完全相同。营销页canonical仍是https://barnest.kevinlabs.app/，按要求未改。|

HTTP检查共77项，失败0。主站App Store三页×八语×390/1440px共48组生产浏览器检查通过；五个直销产品站×390/1440px共10组手选语言、刷新持久化、系统模式、无脚本错误/破图/水平溢出检查通过。主站3份共享JS/CSS指纹与批准源码一致。

发布前后线上变量及secret绑定完全一致，既有30份安装包文件摘要一致。没有更改Paddle设置、收费数字、统计实现或数据库，没有提交App Store新版本、执行真实付款或发邮件。独立统计修复原已在基线，本批未改它。

营销canonical的建议仍单列：后续可统一指向主域App Store介绍页https://kevinlabs.app/barnest/，这次没有顺手实施。HTTP验收不等于搜索引擎已重新收录。

## 复验入口

- https://kevinlabs.app/ 和 https://kevinlabs.app/sitemap.xml
- https://kevinlabs.app/en/ 与 https://kevinlabs.app/en/index.html
- https://nextmirror.kevinlabs.app/buy 、https://mindcharge.kevinlabs.app/buy 、https://nextmirror.kevinlabs.app/buy/
- https://support.kevinlabs.app/barnest/ 、https://support.kevinlabs.app/barnest/support.html 、https://support.kevinlabs.app/barnest/privacy.html
- https://kevinlabs.app/barnest/ 、https://kevinlabs.app/barnest/support.html 、https://kevinlabs.app/barnest/privacy.html

原清单中的curl命令已按GET/HEAD分别核查；完整URL、状态、Location、Content-Type和逐项结论见evidence/production-http.json，HEAD空体实测见buy-head-body.json。生产浏览器及配置/指纹、正式构建证据同目录保存。

本发布记录提交到审核分支，生产应用来源仍为已验收的8762e5f及各子站提交，避免仅为文档记录再次触发发布。
