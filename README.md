# DisplayPilot

**macOS 显示器控制台** —— 亮度、色彩、滚动与磁盘，一个应用说清楚。

[官网](https://huayanming.github.io/displaypilot/zh-Hans/?src=github) ·
[下载](https://github.com/huayanming/displaypilot/releases) ·
[DDC/CI 排查指南](https://huayanming.github.io/displaypilot/zh-Hans/guide-ddc.html?src=github) ·
[清理指南](https://huayanming.github.io/displaypilot/zh-Hans/guide-cleanup.html?src=github) ·
[问题反馈](https://github.com/huayanming/displaypilot/issues)

> 本仓库是**官网与发行版**（GitHub Pages + Releases）。它同时是 Homebrew cask
> 与更新源（`appcast.xml`）的后端。

![显示器控制](https://huayanming.github.io/displaypilot/zh-Hans/img/display.webp)

## 它解决什么

| | |
|---|---|
| **显示器控制** | DDC/CI 可用时走硬件亮度/音量/输入源；**不可用时自动改用 CoreGraphics 伽马表调光**，并在界面上明确标注「DDC 无应答」，不假装成功 |
| **色彩校准** | 对比度、伽马、色温都以**面板原始曲线**为基准重算，反复调节不会累积误差，一键交回 ColorSync |
| **平滑滚动** | 逐帧投递，按经过时间衰减，60Hz 与 144Hz 手感一致（需要辅助功能权限） |
| **安全清理** | 只处理 **13 类有确定性重建方式**的产物；**先移入隔离区保留 30 天**，永久删除默认关闭，且必须同时满足 6 个条件 |

![平滑滚动](https://huayanming.github.io/displaypilot/zh-Hans/img/scroll.webp)
![存储](https://huayanming.github.io/displaypilot/zh-Hans/img/storage.webp)

## 安装

**Homebrew（推荐）**

```bash
brew install --cask huayanming/tap/displaypilot
```

**直接下载**

到 [Releases](https://github.com/huayanming/displaypilot/releases/latest) 取 `DisplayPilot-5.0.2.dmg`，
或从[官网](https://huayanming.github.io/displaypilot/zh-Hans/?src=github)下载。

- 要求 **macOS 14 或更高**
- 已用 Developer ID 签名并通过 Apple 公证（Gatekeeper 直接放行）
- 通用二进制（Apple 芯片与 Intel）

## 价格

- **14 天免费试用，功能完整**，不需要注册账号
- 一次性买断 **¥99 / US$14**，没有订阅、没有续费
- 激活码为 Ed25519 签名，**本地离线验证**：激活后不联网，也不绑定设备

## 隐私

**不做遥测、不做埋点、不上传使用数据，也不自动上传崩溃日志。**

真正联网的只有三件事：

1. 检查更新（**默认关闭**，可在设置里手动检查）
2. 兑换激活短码（只有你主动输入时才发生）
3. 你主动点击链接时打开网页

「报告问题」生成的内容只留在你本机，必须由你手动发送。

以上每一条都有对应的代码依据，并登记在随源码维护的**对外承诺台账**（`Docs/claims.md`）里，
附一键复现命令。改代码动了对应实现就必须同步更新台账——我们不希望官网说的话和程序做的事出现偏差。

## 已知边界（说清楚比含糊好）

- 显示器**没有实现 DDC/CI** 时，硬件亮度/音量/输入源切换就是不可用；伽马表调光压的是画面而非背光，
  省电不如硬件调光，也**对 HDR 内容无效**。
- 扩展坞、主动式转接线、KVM 常会丢掉 DDC 侧通道——这属于环境问题，换线或直连通常能修好。
- 退款：购买后 14 天内，如果软件在你的设备上无法正常工作且我们无法解决，全额退款
  （见[许可协议](https://huayanming.github.io/displaypilot/zh-Hans/eula.html)第五节）。

## 更新

应用内置 Sparkle 更新器，feed 为
[`appcast.xml`](https://huayanming.github.io/displaypilot/appcast.xml)，
更新包用 Ed25519 独立签名（与激活码密钥**分开**，互相不能替代）。

## 许可

本仓库中的**网站内容与文档**版权归作者所有；**应用为商业软件**，
其使用受[最终用户许可协议](https://huayanming.github.io/displaypilot/zh-Hans/eula.html)约束。
应用内「开源许可」面板列出了所有第三方组件及其许可证。
