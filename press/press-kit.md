# LumePane — press kit

One page of facts, plus ready-to-use assets. Everything here has been checked against the
shipped build; nothing is aspirational.

## The one-paragraph version

LumePane is a macOS console for external displays: brightness, colour, scrolling and disk
in one window. Its reason to exist is the failure everyone hits eventually — a lot of monitors
ship without DDC/CI, so the Mac's brightness keys do nothing. LumePane falls back to
CoreGraphics gamma tables, which means the panel can still be dimmed and it is fully
reversible. It also does colour calibration anchored to the panel's original curves, scroll
smoothing that is time-based rather than frame-based, and a cleanup that only touches files
with a deterministic rebuild path — quarantined for 30 days before anything is removed.

## Facts

| | |
|---|---|
| Name | LumePane |
| Version | 5.7.1 |
| Platform | macOS 14 or later · universal binary (Apple silicon + Intel) |
| Bundle identifier | `com.neeson.displaypilot` |
| Developer ID team | `7P2P353LBW` (yanming hua) |
| Signing | Developer ID, hardened runtime, notarized by Apple, ticket stapled |
| Price | ¥99 / US$19 one-time (perpetual licence, one user; one year of updates included) |
| Trial | 14 days, all features, no account required |
| Distribution | Direct download (notarized DMG) · Homebrew tap `huayanming/tap` |
| Telemetry | None. Update checks are off by default; the app's own code has exactly one endpoint, used only when you paste a short support code |
| Source | Closed source. An independent developer, no company behind it |

## The technical angle (what is actually interesting)

1. **Gamma-table fallback when DDC/CI is absent.** Many panels expose no DDC/CI at all. The app
   drives brightness through CoreGraphics gamma tables instead, does not accumulate error
   across repeated adjustment, and hands control back to ColorSync in one click.
2. **Cleanup with a quarantine and a narrow definition.** Only 13 kinds of artifacts that have a
   deterministic rebuild path are touched; everything moves to quarantine for 30 days first;
   permanent deletion is off by default and requires six conditions to hold.
3. **Offline activation.** A `DP-` code is verified locally with an embedded Ed25519 public key:
   no server call, no device binding.

## Assets in this kit

| File | Size | Use |
|---|---|---|
| `displaypilot-icon-1024.png` | 1024×1024 | App icon, store/listing art |
| `displaypilot-icon-512.png` | 512×512 | Smaller icon slots |
| `screenshot-display-en.png` | 1090×2416 | Display panel (English) |
| `screenshot-scroll-en.png` | 700×1552 | Scrolling panel (English) |
| `screenshot-storage-en.png` | 700×1552 | Storage panel (English) |
| `screenshot-display-zh-Hans.png` | 1090×2416 | Display panel (简体中文) |
| `screenshot-scroll-zh-Hans.png` | 700×1552 | Scrolling panel (简体中文) |
| `screenshot-storage-zh-Hans.png` | 700×1552 | Storage panel (简体中文) |

Screenshots are unretouched captures of the shipping UI on a real external monitor
(UP32R7-A, DisplayPort, 3008×1692 @ 120 Hz). Please do not crop out the window chrome.

## Claims you can check, and what we do not claim

- Every claim about the build is checkable by the reviewer: see
  <https://lumepane.com/verify.html> (signature, notarization, checksum,
  offline activation, no telemetry — with the exact commands).
- **We do not claim** HiDPI scaling, virtual screens or XDR/HDR extra brightness — other apps do
  those and we point people at them in
  <https://lumepane.com/alternatives.html>.
- **We do not claim** a device count is enforced. The licence is per user and the code is not
  bound to a machine; that is deliberate.

## Contact

Email **huayanming2019@gmail.com** — a person reads it, usually within a few hours.
Download: <https://lumepane.com/dl/DisplayPilot-8.0.5.dmg>
Homepage: <https://lumepane.com/>

---

## 中文版（供中文媒体使用）

LumePane 是一款 macOS 外接显示器控制台：亮度、色彩、滚动与磁盘清理集中在一个窗口里。
它存在的理由是那个迟早会遇到的故障——大量显示器没有实现 DDC/CI，Mac 的亮度键因此完全不起作用。
LumePane 改用 CoreGraphics 伽马表接管，面板依然可以调暗，而且完全可回退。

**事实**：版本 5.7.1 · macOS 14 及以上 · 通用二进制（Apple 芯片与 Intel）·
Developer ID 团队 `7P2P353LBW` · 已由 Apple 公证且凭据钉扎 · ¥99 / US$19 一次买断（含一年更新）·
14 天全功能试用，无需注册 · 无遥测（自动检查更新默认关闭）· 闭源，独立开发者，背后没有公司。

**技术看点**：① DDC/CI 缺失时的伽马表回退（不累积误差、一键交回 ColorSync）；
② 只碰 13 类有确定性重建方式的产物的清理，先隔离 30 天，永久删除默认关闭；
③ 用内嵌 Ed25519 公钥离线验证的激活码（不联网、不绑设备）。

**我们不主张**：HiDPI 缩放、虚拟屏、XDR 增亮（这些是别的工具擅长的，我们在对比页里直接推荐它们）。

**联系**：huayanming2019@gmail.com（有人读，通常几小时内回）。
