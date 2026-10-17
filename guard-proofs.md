# 守卫验证登记表

> 规矩：**不会失败的检查只是装饰。** 每一道守卫都必须被「故意改坏一次、确认它变红」验证过，
> 并且必须登记在这里——元守卫 `check-guard-coverage.py` 会断言本表覆盖了所有 `check-*.py`，
> 所以**新增守卫却不验证它，门禁会直接失败**。

| 守卫 | 保护什么 | 验证时植入的缺陷 | 观察到的报错 |
|---|---|---|---|
| `check-app-claims.py` | 应用行为承诺（1716 项） | 在 Commerce.swift 里插入一处 URLSession 调用（白名单外） | 「出现了网络调用，但它不在白名单里（承诺是全应用只有兑换短码联网）」 |
| `check-localization.py` | 界面字符串覆盖与格式符一致（1276 条/语言） | 删掉 en.lproj 最后一条翻译 | 缺 1 条 |
| `check-versions.py` | 版本号单一来源（12 处引用） | 把 Site/site.js 的 5.0.2 改成 5.0.3 | 版本引用不一致 |
| `check-pricing.py` | 价格单一来源（14 处引用） | 把 zh-Hans/index.html 的价格 99 改成 98 | 价格引用不一致 |
| `check-site-claims.py` | 官网规格主张（57 项）+ 透明页的守卫数量 | 把透明页的「14 道自动检查」改成 15 | 「Site/audit.html 写 15 道自动检查，实测 14」 |
| `check-site-seo.py` | canonical / hreflang / sitemap 双向一致 | 把 index.html 的 canonical 指向 example.com | 「canonical 非自指」 |
| `check-privacy.py` | 8 个语言的隐私页（24 项） | 移走 Site/de/privacy.html | 「de/privacy.html: 文件不存在」 |
| `check-eula.py` | 8 个语言的 EULA（结构 / 功能引用 / 英文本优先） | 移走 Site/de/eula.html | 「de/eula.html: 文件不存在」 |
| `check-launch-posts.py` | 发布文案的数字主张与归因（22 项） | 把已撤回的说法「面板原始曲线」塞回文案 | 「已撤回的说法又出现了」 |
| `check-channel-tags.py` | 文档里的渠道标签（13 处） | 把 Docs/launch-posts.md 的 ?src=v2ex 写成 ?src=V2EX | 「用了未登记的标签 ?src=V2EX」（大写会让漏斗拒绝，归因静默丢失） |
| `check-audit-report.py` | 报告里的关键数字与实测一致 | 新增一道守卫后，报告仍写「13 道守卫」 | 「报告里的守卫数量提法不一致：13 道守卫，实测 14」（自然触发） |
| `check-guard-coverage.py` | 每道守卫都真的量了东西（不低于实测下限） | 让某道守卫自身失败 | 「守卫自身失败」+「只检查了 N 项（下限 M）」 |
| `check-site-links.py` | 站内链接存在性与大小写（1161 个引用） | 两处：href="Style.css"（大小写不符）与 href="index-nope.html"（文件缺失） | 「大小写不符，磁盘上是「style.css」」/「文件不存在」 |
| `check-shell-scripts.py` | shell 脚本语法 + 变量后非 ASCII（25 个脚本） | 两处：变量后接全角括号；删掉一个 then | 报出具体行与字符 / bash -n 语法错误 |
| `check-typos.py` | 英文页文案的常见错拼（83 个模式） | 把 index.html 的 Smoothing 改成 Smooting | 「index.html: 「Smooting」应为「smoothing」」 |
| `check-conventions.py` | 译文引用与文件行数（24 处引用） | 给 Commerce.swift 追加 400 个空行 | 文件行数超限 |

所有植入都在验证后**逐字节还原**（sha256 比对）。验证日期：2026-10-19（第 25 轮）。
