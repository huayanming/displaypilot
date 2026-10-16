/* DisplayPilot 站点脚本 —— 全站唯一的地址与价格常量，外加几个很小的交互。
   没有跟踪、没有 Cookie、没有第三方请求，也没有外部字体。

   · 价格只有一个来源：下面的 SITE.pricing。页面里的静态数字是构建时从同一份
     映射写出来的（为了禁用 JS 时也能看到价格，并让搜索引擎抓到），运行时这里
     会再写一遍 —— 改价只改这一处，8 个语言页同时生效。
   · 购买入口 = 自建发码服务的下单页（加密货币收款，四条链）。
     全站生效；留空则价格区显示「购买通道尚未接通」，不会出现点了没反应的按钮。 */
(function () {
  "use strict";

  /* ── 只改这里 ────────────────────────────────────────────── */
  var SITE = {
    // 安装包直链（GitHub Releases）。发新版只改这一行。
    download: "https://github.com/huayanming/displaypilot/releases/download/v5.0.1/DisplayPilot-5.0.1.dmg",
    // 结账地址。空字符串 = 还没有可用的付款入口。
    purchase: "https://displaypilot-license.huayanming2019.workers.dev/buy",
    // 价格：全站唯一常量。key 是页面的 <html lang>，default 覆盖其余语言。
    pricing: {
      "default": { num: "US$14", unit: "" },
      "en":      { num: "$14",   unit: "" },
      "zh-Hans": { num: "99",    unit: "元" }
      // 要做区域定价，在这里加一行即可（运行时立即对 8 个语言页生效），例如：
      // , "ja": { num: "¥2,000", unit: "" }
      // 注意：页面里的静态数字是构建时写入的兜底值（供禁用 JS 的访客与搜索引擎使用）；
      // 取消注释后若要让禁用 JS 的访客也看到新价，重新生成一次页面即可。
    }
  };
  /* ───────────────────────────────────────────────────────── */

  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // 1) 价格：按 <html lang> 取映射表里的一项，写进带 data-price 的槽位。
  //    构建时的静态值与这里同源，所以禁用 JS 也看得到价格。
  var pricing = SITE.pricing[document.documentElement.lang] || SITE.pricing["default"];
  all("[data-price]").forEach(function (el) {
    var v = pricing[el.getAttribute("data-price")];
    if (typeof v === "string") el.textContent = v;
  });

  // 2) 下载：脚本可用时指向安装包直链；脚本被禁用时保留 HTML 里的 Releases 页面兜底。
  if (SITE.download) {
    all('[data-site="download"]').forEach(function (a) { a.href = SITE.download; });
  }

  // 3) 购买：接通了才露出按钮；没接通就只留诚实的状态说明。
  if (SITE.purchase) {
    all('[data-site="purchase"]').forEach(function (a) {
      a.href = SITE.purchase; a.target = "_blank"; a.rel = "noopener"; a.hidden = false;
    });
    all('[data-buy-status="pending"]').forEach(function (n) { n.hidden = true; });
  }

  // 4) 顶栏语言切换器：原生 <details>，无 JS 也能展开跳转；这里只补两件小事
  //    —— 点击外面关掉、按 Esc 关掉并把焦点还给按钮。
  var lang = document.querySelector(".lang");
  if (lang) {
    document.addEventListener("click", function (e) {
      if (lang.open && !lang.contains(e.target)) lang.open = false;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lang.open) {
        lang.open = false;
        var s = lang.querySelector("summary");
        if (s) s.focus();
      }
    });
  }

  // 5) 顶栏：滚动后出现一条发丝分隔线。
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
