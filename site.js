/* LumePane 站点脚本 —— 全站唯一的地址与价格常量，外加几个很小的交互。
   没有跟踪、没有 Cookie、没有第三方请求，也没有外部字体。

   · 价格只有一个来源：下面的 SITE.pricing。页面里的静态数字是构建时从同一份
     映射写出来的（为了禁用 JS 时也能看到价格，并让搜索引擎抓到），运行时这里
     会再写一遍 —— 改价只改这一处，8 个语言页同时生效。
   · 购买入口 = 自建发码服务的下单页（加密货币收款，四条链）。
     全站生效；留空则价格区显示「购买通道尚未接通」，不会出现点了没反应的按钮。 */
(function () {
  "use strict";

  // GitHub Pages cannot set X-Frame-Options (the platform ignores _headers).
  // The meta CSP is the main defence; this frame-busts the remaining case so
  // the mirror cannot be embedded as a clickjacking surface. It is a fallback,
  // not a replacement for the Cloudflare response headers on the canonical host.
  try {
    if (window.top !== window.self) window.top.location.href = window.location.href;
  } catch (e) { /* sandboxed frame: best effort only */ }

  /* ── 只改这里 ────────────────────────────────────────────── */
  var SITE = {
    // 下载计数入口。由发码 Worker 记一次匿名下载、再 302 到当前 DMG；
    // 脚本被禁用时，HTML 里的 Releases 页面仍可兜底（但不会计数）。
    download: "https://lumepane.com/dl/DisplayPilot-8.0.4.dmg",
    // 下载计数入口；保留上面的直链作为版本/兜底来源，运行时优先走计数入口。
    downloadEndpoint: "https://lumepane.com/api/download",
    // 结账地址。空字符串 = 还没有可用的付款入口。
    purchase: "https://license.lumepane.com/buy",
    // 价格：全站唯一常量。key 是页面的 <html lang>，default 覆盖其余语言。
    pricing: {
      "default": { num: "≈US$19", unit: "" },
      "en":      { num: "≈$19",   unit: "" },
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

  // 2) 下载：脚本可用时指向计数入口；脚本被禁用时保留 HTML 里的 Releases 页面兜底。
  //    来源标签一并带上，后台才能看出下载来自哪个渠道（不会记录 IP/UA）。
  var downloadTarget = SITE.downloadEndpoint || SITE.download;
  if (downloadTarget) {
    var dlSrc = campaignSource();
    var dlUrl = dlSrc
      ? downloadTarget + (downloadTarget.indexOf("?") === -1 ? "?" : "&") + "src=" + encodeURIComponent(dlSrc)
      : downloadTarget;
    all('[data-site="download"]').forEach(function (a) { a.href = dlUrl; });
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


/* 买家付款通知：个人收款码没有回调，买家点一下才能让开发者知道。 */
(function () {
  var ENDPOINT = 'https://license.lumepane.com/api/paid';
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

/* ── Motion / instrument layer ─────────────────────────────────────
   Small, dependency-free enhancements. All targets are optional: the
   static page remains complete if this file is blocked or JS is off. */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var hero = document.querySelector(".hero-v2");
  var consoleEl = document.querySelector(".hero-console");
  var screen = document.querySelector(".console-screen");

  /* Top-of-page instrument meter. */
  var meter = document.createElement("div");
  meter.className = "scroll-meter";
  meter.setAttribute("aria-hidden", "true");
  meter.appendChild(document.createElement("i"));
  document.body.appendChild(meter);
  var meterFill = meter.firstChild;
  var ticking = false;
  function paintMeter() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    meterFill.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
  }
  addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(paintMeter); }
  }, { passive: true });
  paintMeter();

  /* Pointer light and shallow tilt, confined to the hero console. */
  if (hero && consoleEl) {
    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
      hero.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
    });
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      consoleEl.addEventListener("pointermove", function (event) {
        var rect = consoleEl.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        consoleEl.style.transform = "perspective(1100px) rotateX(" + (-y * 3.2) + "deg) rotateY(" + (x * 4.5) + "deg)";
      });
      consoleEl.addEventListener("pointerleave", function () {
        consoleEl.style.transform = "";
      });
    }
  }

  if (screen) {
    /* The readout is a real, keyboard-accessible brightness control. */
    screen.removeAttribute("aria-hidden");
    var track = screen.querySelector(".cs-track");
    var fill = screen.querySelector(".cs-fill");
    var knob = screen.querySelector(".cs-knob");
    var readout = screen.querySelector(".cs-readout .num");
    var sliderValue = 100;
    var dragging = false;
    function setBrightness(value) {
      sliderValue = Math.max(0, Math.min(100, Math.round(value)));
      if (fill) fill.style.width = sliderValue + "%";
      if (knob) knob.style.left = "calc(" + sliderValue + "% - 8px)";
      if (readout) readout.textContent = String(sliderValue);
      if (track) track.setAttribute("aria-valuenow", String(sliderValue));
    }
    if (track) {
      track.setAttribute("role", "slider");
      track.setAttribute("tabindex", "0");
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "100");
      track.setAttribute("aria-valuenow", "100");
      track.setAttribute("aria-label", (screen.querySelector(".cs-label") || {}).textContent + " brightness");
      var fromPointer = function (event) {
        var rect = track.getBoundingClientRect();
        setBrightness(((event.clientX - rect.left) / rect.width) * 100);
      };
      track.addEventListener("pointerdown", function (event) {
        dragging = true; track.setPointerCapture(event.pointerId); fromPointer(event);
      });
      track.addEventListener("pointermove", function (event) {
        if (dragging) fromPointer(event);
      });
      track.addEventListener("pointerup", function () { dragging = false; });
      track.addEventListener("pointercancel", function () { dragging = false; });
      track.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setBrightness(sliderValue - 2); }
        if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setBrightness(sliderValue + 2); }
        if (event.key === "Home") { event.preventDefault(); setBrightness(0); }
        if (event.key === "End") { event.preventDefault(); setBrightness(100); }
      });
      setBrightness(100);
    }

    /* Values settle once; no perpetual number churn. */
    var reduce = function () { return matchMedia("(prefers-reduced-motion: reduce)").matches; };
    var settle = function (el, target, decimals) {
      if (!el || reduce()) return;
      var textNode = null;
      for (var i = 0; i < el.childNodes.length; i += 1) {
        if (el.childNodes[i].nodeType === 3) { textNode = el.childNodes[i]; break; }
      }
      if (!textNode) return;
      var start = performance.now();
      var duration = 850;
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        var value = target * eased;
        textNode.nodeValue = decimals ? value.toFixed(decimals) : String(Math.round(value));
        if (t < 1) requestAnimationFrame(tick);
        else textNode.nodeValue = decimals ? target.toFixed(decimals) : String(target);
      }
      textNode.nodeValue = decimals ? "0".repeat(decimals + 1) : "0";
      requestAnimationFrame(tick);
    };
    var gauges = screen.querySelectorAll(".cs-gauge .v");
    var gaugeTargets = [{ value: 6500, decimals: 0 }, { value: 2.2, decimals: 1 }, { value: 104, decimals: 0 }];
    for (var gi = 0; gi < gauges.length && gi < gaugeTargets.length; gi += 1) {
      settle(gauges[gi], gaugeTargets[gi].value, gaugeTargets[gi].decimals);
    }
    requestAnimationFrame(function () { screen.classList.add("is-live"); });

    /* A small live badge above the console. */
    if (consoleEl) {
      var hud = document.createElement("div");
      hud.className = "hero-hud";
      hud.setAttribute("aria-hidden", "true");
      var live = document.createElement("span");
      live.className = "hud-live";
      var dot = document.createElement("i");
      live.appendChild(dot);
      live.appendChild(document.createTextNode("Live"));
      hud.appendChild(live);
      ["DDC", "CG", "ΔE 0.8"].forEach(function (label) {
        var item = document.createElement("span");
        item.textContent = label;
        hud.appendChild(item);
      });
      consoleEl.insertBefore(hud, consoleEl.firstChild);
    }
  }

  /* Modules reveal once, at the moment they enter the viewport. */
  var revealTargets = document.querySelectorAll(".sec-head, .feature, .catalog-item, .insight-card, .price-card, .controls-grid");
  if ("IntersectionObserver" in window && revealTargets.length) {
    for (var ri = 0; ri < revealTargets.length; ri += 1) {
      revealTargets[ri].classList.add("motion-reveal");
      revealTargets[ri].style.setProperty("--reveal-delay", (ri % 4) * 55 + "ms");
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    for (var oi = 0; oi < revealTargets.length; oi += 1) observer.observe(revealTargets[oi]);
  }

  /* Catalog cards trace the pointer with a soft local light. */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".catalog-item").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", ((event.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--spot-y", ((event.clientY - rect.top) / rect.height) * 100 + "%");
        card.classList.add("is-spot");
      });
      card.addEventListener("pointerleave", function () { card.classList.remove("is-spot"); });
    });
  }
})();


/* Support → contact developer. Progressive enhancement; the rest of the
   support page remains complete without JavaScript. */
(function () {
  "use strict";
  var path = location.pathname;
  if (!/(^|\/)support(\.html)?$/.test(path)) return;
  var doc = document.querySelector("article.doc");
  if (!doc || doc.querySelector(".contact-card")) return;
  var lang = document.documentElement.lang || "en";
  var copy = {
    "en": {title:"Contact the developer", body:"Questions, purchase help, or feedback? Contact <strong>Neeson &amp; Sea</strong> by email or WeChat. For purchase issues, include the order number or receipt email.", email:"Email", wechat:"WeChat", emailBtn:"Send email", issue:"GitHub Issues", note:"Usually answered within 24 hours."},
    "zh-Hans": {title:"联系开发者", body:"遇到问题、购买咨询或想反馈建议，请联系 <strong>尼森与海</strong>。购买相关问题请附上订单号或收据邮箱。", email:"邮箱", wechat:"微信", emailBtn:"发邮件", issue:"GitHub Issues", note:"通常在 24 小时内回复。"},
    "zh-Hant": {title:"聯繫開發者", body:"遇到問題、購買諮詢或想回饋建議，請聯繫 <strong>尼森與海</strong>。購買相關問題請附上訂單號或收據郵箱。", email:"郵箱", wechat:"微信", emailBtn:"寄郵件", issue:"GitHub Issues", note:"通常在 24 小時內回覆。"},
    "ja": {title:"開発者に連絡", body:"ご不明点、購入の相談、ご意見は <strong>Neeson &amp; Sea</strong> までメールまたは WeChat でお送りください。購入に関する場合は注文番号または領収書のメールアドレスを添えてください。", email:"メール", wechat:"WeChat", emailBtn:"メールを送る", issue:"GitHub Issues", note:"通常 24 時間以内に返信します。"},
    "ko": {title:"개발자에게 문의", body:"질문, 구매 상담, 의견은 <strong>Neeson &amp; Sea</strong>에게 이메일 또는 WeChat으로 보내 주세요. 구매 관련 문의는 주문 번호나 영수증 이메일을 포함해 주세요.", email:"이메일", wechat:"WeChat", emailBtn:"이메일 보내기", issue:"GitHub Issues", note:"보통 24시간 이내에 답장합니다."},
    "de": {title:"Entwickler kontaktieren", body:"Fragen, Kaufberatung oder Feedback? Schreib <strong>Neeson &amp; Sea</strong> per E-Mail oder WeChat. Bei Kaufproblemen bitte Bestellnummer oder Rechnungs-E-Mail angeben.", email:"E-Mail", wechat:"WeChat", emailBtn:"E-Mail senden", issue:"GitHub Issues", note:"Antwort in der Regel innerhalb von 24 Stunden."},
    "fr": {title:"Contacter le développeur", body:"Une question, un achat ou une suggestion ? Contactez <strong>Neeson &amp; Sea</strong> par e-mail ou WeChat. Pour un achat, indiquez le numéro de commande ou l’e-mail du reçu.", email:"E-mail", wechat:"WeChat", emailBtn:"Envoyer un e-mail", issue:"GitHub Issues", note:"Réponse généralement sous 24 heures."},
    "es": {title:"Contactar con el desarrollador", body:"¿Dudas, compra o sugerencias? Contacta con <strong>Neeson &amp; Sea</strong> por correo o WeChat. Para compras, incluye el número de pedido o el correo del recibo.", email:"Correo", wechat:"WeChat", emailBtn:"Enviar correo", issue:"GitHub Issues", note:"Normalmente respondo en 24 horas."}
  };
  var c = copy[lang] || copy.en;
  var prefix = /\/(zh-Hans|zh-Hant|ja|ko|de|fr|es)\//.test(path) ? "../img/" : "img/";
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  var section = el("section", "contact-card");
  section.setAttribute("aria-labelledby", "contact-dev");

  var qr = el("a", "contact-qr");
  qr.href = prefix + "wechat-service-qr.png";
  qr.target = "_blank";
  qr.rel = "noopener";
  qr.setAttribute("aria-label", c.wechat + " QR");
  var img = document.createElement("img");
  img.src = prefix + "wechat-service-qr.png";
  img.alt = c.wechat;
  img.width = 128; img.height = 114; img.loading = "lazy";
  qr.appendChild(img);
  section.appendChild(qr);

  var copyCol = el("div", "contact-copy");
  copyCol.appendChild(el("h2", "", c.title)).id = "contact-dev";
  // Keep the card text content-only: no markup from a language table ever
  // reaches the DOM as markup.
  copyCol.appendChild(el("p", "", c.body.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&")));
  var kv = el("div", "contact-kv");
  var emailLine = el("span", "", c.email + ": ");
  var emailLink = el("a", "", "huayanming2019@gmail.com");
  emailLink.href = "mailto:huayanming2019@gmail.com";
  emailLine.appendChild(emailLink);
  kv.appendChild(emailLine);
  var wechatLine = el("span", "", c.wechat + ": ");
  var wechatCode = el("code", "", "neeson1987");
  wechatLine.appendChild(wechatCode);
  kv.appendChild(wechatLine);
  copyCol.appendChild(kv);

  var actions = el("div", "contact-actions");
  var mail = el("a", "btn btn-primary", c.emailBtn);
  mail.href = "mailto:huayanming2019@gmail.com?subject=LumePane%20support";
  actions.appendChild(mail);
  var issues = el("a", "btn btn-ghost", c.issue);
  issues.href = "https://github.com/huayanming/displaypilot/issues";
  actions.appendChild(issues);
  copyCol.appendChild(actions);
  copyCol.appendChild(el("p", "small", c.note));
  section.appendChild(copyCol);

  var back = doc.querySelector("a.back");
  if (back) doc.insertBefore(section, back); else doc.appendChild(section);
})();

/* Subpage instrument shell — progressive enhancement only.
   Wraps each h2 section in a card and inserts a contents rail. If this
   script is blocked, the original article remains complete and readable. */
(function () {
  "use strict";
  var doc = document.querySelector("article.doc");
  if (!doc || doc.dataset.enhanced === "1") return;
  var h1 = doc.querySelector("h1");
  if (!h1) return;
  var top = [];
  var summaries = doc.querySelectorAll(".summary");
  var updated = doc.querySelector(".updated");
  if (updated) top.push(updated);
  Array.prototype.forEach.call(summaries, function (node) { top.push(node); });

  var hero = document.createElement("header");
  hero.className = "doc-hero";
  h1.parentNode.insertBefore(hero, h1);
  hero.appendChild(h1);
  top.forEach(function (node) { hero.appendChild(node); });

  var body = document.createElement("div");
  body.className = "doc-body";
  var toc = document.createElement("aside");
  toc.className = "doc-toc";
  toc.setAttribute("aria-label", "On this page");
  var tocTitle = document.createElement("p");
  tocTitle.className = "doc-toc-title";
  var tocLabels = {
    "en": "On this page",
    "zh-Hans": "本页目录",
    "zh-Hant": "本頁目錄",
    "ja": "このページの目次",
    "ko": "이 페이지 목차",
    "de": "Auf dieser Seite",
    "fr": "Sur cette page",
    "es": "En esta página"
  };
  tocTitle.textContent = tocLabels[document.documentElement.lang] || tocLabels.en;
  var list = document.createElement("ol");
  toc.appendChild(tocTitle);
  toc.appendChild(list);

  var current = null;
  var intro = null;
  var index = 0;
  Array.prototype.slice.call(doc.children).forEach(function (child) {
    if (child === hero || child.tagName === "H1") return;
    if (child.tagName === "H2") {
      index += 1;
      var id = "section-" + index;
      child.id = child.id || id;
      var section = document.createElement("section");
      section.className = "doc-section";
      section.appendChild(child);
      body.appendChild(section);
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + child.id;
      link.textContent = child.textContent;
      item.appendChild(link);
      list.appendChild(item);
      current = section;
    } else if (current) {
      current.appendChild(child);
    } else {
      // Anything before the first h2 belongs to one intro card. Leaving it
      // as bare text between the hero and the first section made support pages
      // look like two unrelated layouts stacked together.
      if (!intro) {
        intro = document.createElement("section");
        intro.className = "doc-section doc-intro";
        body.appendChild(intro);
      }
      intro.appendChild(child);
    }
  });

  var layout = document.createElement("div");
  layout.className = "doc-layout";
  layout.appendChild(body);
  if (list.children.length > 1) layout.appendChild(toc);
  doc.appendChild(layout);
})();

/* Glow Orb / 光彩魔丸: a click-to-expand dock that mirrors the macOS app. */
(function () {
  var stage = document.querySelector(".orb-stage");
  if (!stage) return;
  var orb = stage.querySelector(".glow-orb");
  var toggle = document.querySelector("[data-glow-orb-toggle]");
  var panel = stage.querySelector(".orb-dock");
  if (!orb || !panel) return;

  function setOpen(open) {
    stage.classList.toggle("is-open", open);
    orb.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open
        ? (toggle.getAttribute("data-label-close") || "Close Glow Orb")
        : (toggle.getAttribute("data-label-open") || "Open Glow Orb");
    }
  }

  orb.addEventListener("click", function () { setOpen(!stage.classList.contains("is-open")); });
  if (toggle) toggle.addEventListener("click", function () { setOpen(!stage.classList.contains("is-open")); });
  if (location.hash === "#glow-orb-open") setOpen(true);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && stage.classList.contains("is-open")) {
      setOpen(false);
      orb.focus();
    }
  });
})();
