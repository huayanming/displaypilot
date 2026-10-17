# DisplayPilot

**A macOS console for external displays** — brightness, colour, scrolling and disk, in one app.

[Website](https://huayanming.github.io/displaypilot/?src=github) ·
[Download](https://github.com/huayanming/displaypilot/releases) ·
[DDC/CI troubleshooting](https://huayanming.github.io/displaypilot/guide-ddc.html?src=github) ·
[Cleanup guide](https://huayanming.github.io/displaypilot/guide-cleanup.html?src=github) ·
[Issues](https://github.com/huayanming/displaypilot/issues) ·
[中文说明](#中文说明)

> This repository is the **website and distribution channel** (GitHub Pages + Releases).
> It also backs the Homebrew cask and the Sparkle update feed (`appcast.xml`).
>
> The app itself is **closed source**. This repository contains the site, the release
> notes and the download links — not the application’s source code. Please do not
> reuse the site’s text or images without asking.

![Display control](https://huayanming.github.io/displaypilot/img/display.webp)

## Deep dives

Written from the implementation, not from a feature list. Each one can be checked against what the app does.

| Page | What it is about |
|---|---|
| [All guides](https://huayanming.github.io/displaypilot/guides.html?src=github) | Organised by symptom |
| [What an implementation has to get right](https://huayanming.github.io/displaypilot/dev-ddc.html?src=github) | I2C addresses, why EDID reads are shallow, why a monitor needs a beat, why symbols are resolved with dlsym |
| [Which layer is dimming your screen](https://huayanming.github.io/displaypilot/guide-layers.html?src=github) | hardware / software / unavailable / unknown, and why the last two are not the same |
| [What a gamma table actually does](https://huayanming.github.io/displaypilot/guide-gamma.html?src=github) | The five operations, the contrast pivot at 0.5, and three traps |
| [A test you cannot read is just a colourful screen](https://huayanming.github.io/displaypilot/guide-test.html?src=github) | Five full-screen patterns, and why a test tool must never trap you |
| [Two apps fighting over the same setting](https://huayanming.github.io/displaypilot/guide-conflict.html?src=github) | Bundle-id prefix matching, and why a miss beats a false alarm |
| [Was it the update?](https://huayanming.github.io/displaypilot/guide-update.html?src=github) | Direction is the evidence, and why "ok" must be a positive confirmation |

## How this project is checked

Sixteen offline guards and 208 tests, and every guard is proved to fail on a planted defect.
Both records are public:

- [The audit log](https://huayanming.github.io/displaypilot/audit-log.md?src=github) — every round, including the ones where this project was wrong.
- [Each guard failing on purpose](https://huayanming.github.io/displaypilot/guard-proofs.md?src=github) — so the checks are not decorative.

## What it solves

| | |
|---|---|
| **Display control** | Uses DDC/CI for hardware brightness, volume and input switching **when the panel implements it**; otherwise it falls back to **CoreGraphics gamma dimming** and says so in the UI ("no DDC reply") instead of pretending it worked |
| **Colour calibration** | Contrast, gamma and temperature are recomputed against the panel's **original curves**, so repeated adjustments do not accumulate error; one click hands control back to ColorSync |
| **Smooth scrolling** | Frame-by-frame delivery with time-based decay, so 60 Hz and 144 Hz feel the same (requires Accessibility permission) |
| **Safe cleanup** | Only the **13 kinds of artifacts that have a deterministic rebuild path** are touched; everything moves to a **30-day quarantine** first; permanent deletion is off by default and requires **six conditions** to hold |

![Smooth scrolling](https://huayanming.github.io/displaypilot/img/scroll.webp)
![Storage](https://huayanming.github.io/displaypilot/img/storage.webp)

## Install

**Homebrew (recommended)**

```bash
brew install --cask huayanming/tap/displaypilot
```

**Direct download**

Get `DisplayPilot-5.1.3.dmg` from [Releases](https://github.com/huayanming/displaypilot/releases/latest),
or download it from the [website](https://huayanming.github.io/displaypilot/?src=github).

- Requires **macOS 14 or later**
- Signed with a Developer ID certificate and notarised by Apple (Gatekeeper opens it directly)
- Universal binary (Apple silicon and Intel)

## Price

- **14-day free trial with every feature unlocked** — no account required
- One-time purchase of **¥99 / US$14** — no subscription, no renewals
- Activation codes are Ed25519-signed and verified **offline**: after activation the app does not phone home and is not bound to a device

## Privacy

**No telemetry, no analytics, no usage uploads, and no automatic crash reports.**

Only three things ever reach the network:

1. Checking for updates (**off by default**; can be triggered by hand in Settings)
2. Redeeming a short activation code (only when you paste one)
3. Opening a web page when you click a link

"Report a problem" keeps everything on your Mac until you send it yourself.

Every one of these claims has a code reference and is registered in the claims ledger that ships with the
source, with a one-command way to reproduce it. Changing the code means updating the ledger — we do not want
the website and the application to drift apart.

## Known boundaries

- If a display **does not implement DDC/CI**, hardware brightness, volume and input switching simply are not
  available. Gamma dimming dims the picture, not the backlight: it saves less power and **has no effect on HDR content**.
- Docks, active adapters and KVMs often drop the DDC side channel — that is an environment problem, and a
  different cable or a direct connection usually fixes it.
- Refunds: within 14 days of purchase, if the app cannot work on your machine and we cannot fix it, we refund
  in full (see section 5 of the [EULA](https://huayanming.github.io/displaypilot/eula.html)).

## Updates

The app ships with a Sparkle updater; the feed is
[`appcast.xml`](https://huayanming.github.io/displaypilot/appcast.xml). Update packages are signed with an
Ed25519 key that is **separate from the activation-code key** — neither can stand in for the other.

## Licence

The **website content and documentation** in this repository are copyright the author. The **application is
commercial software** and its use is governed by the
[end-user licence agreement](https://huayanming.github.io/displaypilot/eula.html). The in-app "Open source
licences" panel lists every third-party component and its licence.

---

## 中文说明

**macOS 显示器控制台** —— 亮度、色彩、滚动与磁盘，一个应用说清楚。

[官网](https://huayanming.github.io/displaypilot/zh-Hans/?src=github) ·
[下载](https://github.com/huayanming/displaypilot/releases) ·
[DDC/CI 排查指南](https://huayanming.github.io/displaypilot/zh-Hans/guide-ddc.html?src=github) ·
[清理指南](https://huayanming.github.io/displaypilot/zh-Hans/guide-cleanup.html?src=github)

| | |
|---|---|
| **显示器控制** | DDC/CI 可用时走硬件亮度/音量/输入源；**不可用时自动改用 CoreGraphics 伽马表调光**，并在界面上明确标注「DDC 无应答」，不假装成功 |
| **色彩校准** | 对比度、伽马、色温都以**面板原始曲线**为基准重算，反复调节不会累积误差，一键交回 ColorSync |
| **平滑滚动** | 逐帧投递，按经过时间衰减，60Hz 与 144Hz 手感一致（需要辅助功能权限） |
| **安全清理** | 只处理 **13 类有确定性重建方式**的产物；**先移入隔离区保留 30 天**，永久删除默认关闭，且必须同时满足 6 个条件 |

**安装**：`brew install --cask huayanming/tap/displaypilot`，或从 [Releases](https://github.com/huayanming/displaypilot/releases/latest) 取 `DisplayPilot-5.1.3.dmg`。要求 **macOS 14 或更高**，已用 Developer ID 签名并通过 Apple 公证，通用二进制。

**价格**：**14 天免费试用，功能完整**，不需要注册账号；一次性买断 **¥99 / US$14**，没有订阅。激活码为 Ed25519 签名、**本地离线验证**：激活后不联网，也不绑定设备。

**隐私**：**不做遥测、不做埋点、不上传使用数据，也不自动上传崩溃日志。** 真正联网的只有三件事：检查更新（**默认关闭**）、兑换激活短码（只有你主动输入时）、你主动点击链接时打开网页。「报告问题」生成的内容只留在你本机，必须由你手动发送。

**已知边界**：显示器**没有实现 DDC/CI** 时，硬件亮度/音量/输入源切换就是不可用；伽马表调光压的是画面而非背光，省电不如硬件调光，也**对 HDR 内容无效**。扩展坞、主动式转接线、KVM 常会丢掉 DDC 侧通道——换线或直连通常能修好。退款：购买后 14 天内，如果软件在你的设备上无法正常工作且我们无法解决，全额退款（见[许可协议](https://huayanming.github.io/displaypilot/zh-Hans/eula.html)第五节）。

**更新**：内置 Sparkle 更新器，feed 为 [`appcast.xml`](https://huayanming.github.io/displaypilot/appcast.xml)；更新包用 Ed25519 独立签名（与激活码密钥**分开**，互相不能替代）。
