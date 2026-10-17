# 守卫验证登记表

> 规矩：**不会失败的检查只是装饰。** 每一道守卫都必须被「故意改坏一次、确认它变红」验证过，
> 并且必须登记在这里——元守卫 `check-guard-coverage.py` 会断言本表覆盖了所有 `check-*.py`，
> 所以**新增守卫却不验证它，门禁会直接失败**。

| 守卫 | 保护什么 | 验证时植入的缺陷 | 观察到的报错 |
|---|---|---|---|
| `check-app-claims.py` | 应用行为承诺（1806 项） | 在 Commerce.swift 里插入一处 URLSession 调用（白名单外） | 「出现了网络调用，但它不在白名单里（承诺是全应用只有兑换短码联网）」 |
| `check-localization.py` | 界面字符串覆盖与格式符一致（1276 条/语言） | 删掉 en.lproj 最后一条翻译 | 缺 1 条 |
| `check-versions.py` | 版本号单一来源 + **发布链路完整性**（Site/dl 安装包存在、appcast length/签名与文件一致、8 语言 JSON-LD、CHANGELOG 小节、两份 CHANGELOG 一致） | ① 把 site.js 的下载文件改成 5.7.0；② 删掉 Site/dl 的安装包；③ 改坏 appcast 的 length | ①「Site/site.js 下载直链不一致」；②「缺少 Site/dl/DisplayPilot-5.7.1.dmg（线上会 404）」；③「appcast length 与安装包大小一致 —— feed 写 …，文件是 …」 |
| `check-pricing.py` | 价格单一来源（14 处引用） | 把 zh-Hans/index.html 的价格 99 改成 98 | 价格引用不一致 |
| `check-site-claims.py` | 官网规格主张 + 透明页守卫数量 + **仓库内不得出现 11 位手机号** | ① 把透明页「16 道自动检查」改成 15；② 在页面里植入 `17551085105` | ①「写 15 道自动检查，实测 16」；②「Site/__phone_probe.html 出现 11 位手机号」 |
| `check-site-seo.py` | canonical / hreflang / sitemap 双向一致 + **全站页面骨架一致**（统一导航 / skip / main / 页脚 / 唯一 h1） | ① 把 index.html 的 canonical 指向 example.com；② 改坏 verify.html 的 `<header class="nav">` | ①「canonical 非自指」；②「verify.html: 缺少统一导航（页面骨架与全站不一致）」 |
| `check-privacy.py` | 8 个语言的隐私页 + **设备登记措辞必须与代码一致**（sha256(IOPlatformUUID+hw.model)，随机 UUID 只用于短码兑换） | ① 移走 Site/de/privacy.html；② 删掉英文页的设备登记准确说明 | ①「de/privacy.html: 文件不存在」；②「privacy.html: 缺少设备登记的准确说明」 |
| `check-eula.py` | 8 个语言的 EULA（结构 / 功能引用 / 英文本优先） | 移走 Site/de/eula.html | 「de/eula.html: 文件不存在」 |
| `check-launch-posts.py` | 发布文案的数字主张与归因（22 项） | 把已撤回的说法「面板原始曲线」塞回文案 | 「已撤回的说法又出现了」 |
| `check-channel-tags.py` | 文档里的渠道标签（13 处） | 把 Docs/launch-posts.md 的 ?src=v2ex 写成 ?src=V2EX | 「用了未登记的标签 ?src=V2EX」（大写会让漏斗拒绝，归因静默丢失） |
| `check-audit-report.py` | 报告里的关键数字与实测一致 | 新增一道守卫后，报告仍写「13 道守卫」 | 「报告里的守卫数量提法不一致：13 道守卫，实测 14」（自然触发） |
| `check-guard-coverage.py` | 每道守卫都真的量了东西（不低于实测下限） | 让某道守卫自身失败 | 「守卫自身失败」+「只检查了 N 项（下限 M）」 |
| `check-site-links.py` | 站内链接存在性与大小写（1161 个引用） | 两处：href="Style.css"（大小写不符）与 href="index-nope.html"（文件缺失） | 「大小写不符，磁盘上是「style.css」」/「文件不存在」 |
| `check-shell-scripts.py` | shell 脚本语法 + 变量后非 ASCII（25 个脚本） | 两处：变量后接全角括号；删掉一个 then | 报出具体行与字符 / bash -n 语法错误 |
| `check-typos.py` | 英文页文案的常见错拼（83 个模式） | 把 index.html 的 Smoothing 改成 Smooting | 「index.html: 「Smooting」应为「smoothing」」 |
| `check-conventions.py` | 译文引用与文件行数（24 处引用） | 给 Commerce.swift 追加 400 个空行 | 文件行数超限 |

所有植入都在验证后**逐字节还原**（sha256 比对）。验证日期：2026-10-19（第 25 轮）；
2026-10-18 为上述四道守卫新增的发布链路 / 隐私措辞 / 页面骨架 / 手机号断言各做了一次故意改坏验证。