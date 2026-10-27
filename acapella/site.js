(function () {
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");

  if (lang !== "zh" && lang !== "en") {
    lang = (navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-lang-block]").forEach(function (el) {
    el.hidden = el.getAttribute("data-lang-block") !== lang;
  });

  document.querySelectorAll("[data-lang-link]").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("data-lang-link") === lang);
  });

  document.querySelectorAll("[data-lang-text]").forEach(function (el) {
    el.hidden = el.getAttribute("data-lang-text") !== lang;
  });

  var root = document.documentElement;
  var title = lang === "zh" ? root.getAttribute("data-title-zh") : root.getAttribute("data-title-en");
  if (title) document.title = title;
})();
