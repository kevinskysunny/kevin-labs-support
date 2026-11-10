# BarNest 商店版 canonical 修正：已修待上线

用户已确认主域及support域的App Store版介绍页统一标记 `https://kevinlabs.app/barnest/` 为主地址。现网仍是上一批发布；本轮按既有要求先提交diff供审核，未更新生产main、未部署。

## Diff摘要

- `barnest/index.html`：canonical从 `https://barnest.kevinlabs.app/` 改为 `https://kevinlabs.app/barnest/`。两域使用同一源文件，主域与support域将同时生效，包含 `/barnest/` 和 `/barnest/index.html`。
- `sitemap.xml`：商店版营销URL由 `/barnest/index.html` 归一到 `/barnest/`，与canonical一致；支持、隐私条目继续保留。
- `tests/barnest-store.test.mjs`：更新已有canonical与sitemap断言。
- 网站内部版本2.9.1，package/锁文件/site.json/index.json同步。正常构建另外修正了已有共享site.js的资源指纹引用；这些HTML只变查询指纹，共享脚本字节未改，未修改统计实现。

没有增加301，没有改变页面内容、价格、试用、隐私正文、渠道或Pro版站点。App Store版继续直接访问登记URL；Pro保持独立直销入口。

## 验证

`npm run build`、`npm test`通过，30项测试通过，包括隐私正文不变、商店价格/版本及正常回源。`git diff --check`通过。此类元信息修改没有改布局，不额外开展整站改版。

批准上线后检查以下四个URL：HTTP200，无Location，原始HTML canonical精确为 `https://kevinlabs.app/barnest/`：

- https://kevinlabs.app/barnest/
- https://kevinlabs.app/barnest/index.html
- https://support.kevinlabs.app/barnest/
- https://support.kevinlabs.app/barnest/index.html

另检查 https://barnest.kevinlabs.app/ 仍自引用Pro地址，主站sitemap保留商店版营销/支持/隐私三类URL。当前仅本地验证，不写成线上已生效。
