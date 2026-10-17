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
    download: "https://huayanming.github.io/displaypilot/dl/DisplayPilot-5.7.2.dmg",
    // 结账地址。空字符串 = 还没有可用的付款入口。
    purchase: "https://displaypilot-license.huayanming2019.workers.dev/buy",
    // 价格：全站唯一常量。key 是页面的 <html lang>，default 覆盖其余语言。
    pricing: {
      "default": { num: "≈US$14", unit: "" },
      "en":      { num: "≈$14",   unit: "" },
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
  //
  //    归因：投放链接带 ?src=chiphell 落到本页时，必须把它一路带到下单页，
  //    否则下单页读不到来源，整条漏斗的渠道归因就断在「点购买」这一步。
  //    规则与下单页一致：小写字母数字、-、_，最长 32 字符，不合规一律丢弃
  //    （只记「直接访问」，绝不把来路不明的字符串透传下去）。
  var SRC_KEY = "dp-src";
function validSrc(v) {
  return v && /^[a-z0-9][a-z0-9_-]{0,31}$/i.test(v.trim()) ? v.trim().toLowerCase() : null;
}
// 站内导航会丢掉查询串：拿到合规 src 就存进 sessionStorage（仅本标签页、关掉即清、无标识），
// 之后没有 ?src= 的页面用它兜底。
function campaignSource() {
  try {
    var fromUrl = validSrc(new URLSearchParams(location.search).get("src"));
    if (fromUrl) {
      try { sessionStorage.setItem(SRC_KEY, fromUrl); } catch (e) { /* 隐私模式 */ }
      return fromUrl;
    }
    return validSrc(sessionStorage.getItem(SRC_KEY));
  } catch (err) {
    return null;
  }
}
  if (SITE.purchase) {
    var src = campaignSource();
    var purchaseUrl = src
      ? SITE.purchase + (SITE.purchase.indexOf("?") === -1 ? "?" : "&") + "src=" + encodeURIComponent(src)
      : SITE.purchase;
    all('[data-site="purchase"]').forEach(function (a) {
      a.href = purchaseUrl; a.target = "_blank"; a.rel = "noopener"; a.hidden = false;
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


/* 我已付款上报：个人收款码没有回调，买家点一下才能让店主知道。 */
(function () {
  var ENDPOINT = 'https://displaypilot-license.huayanming2019.workers.dev/api/paid';
  document.addEventListener('click', function (event) {
    var btn = event.target.closest ? event.target.closest('[data-paid-report]') : null;
    if (!btn || btn.getAttribute('data-busy') === '1') return;
    event.preventDefault();
    btn.setAttribute('data-busy', '1');
    var original = btn.textContent;
    var channel = btn.getAttribute('data-paid-report') || 'unknown';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ channel: channel })
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.ok) {
        btn.setAttribute('role', 'status');
        btn.setAttribute('aria-live', 'polite');
        var zh = (document.documentElement.lang || '').indexOf('zh') === 0;
        btn.textContent = (zh ? '已通知店主 · ' : 'Seller notified · ') + data.orderId;
      } else {
        btn.textContent = original + ' (' + 'failed' + ')';
        btn.removeAttribute('data-busy');
      }
    }).catch(function () {
      btn.textContent = original + ' (' + 'failed' + ')';
      btn.removeAttribute('data-busy');
    });
  });
})();
