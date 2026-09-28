(function () {
  "use strict";

  var tabButtons = document.querySelectorAll("[data-audience-tab]");
  var panels = document.querySelectorAll("[data-audience-panel]");

  if (!tabButtons.length || !panels.length) return;

  function revealNow(root) {
    root.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      el.classList.add("is-visible");
    });
    if (root.classList.contains("reveal") && !root.classList.contains("is-visible")) {
      root.classList.add("is-visible");
    }
  }

  function setAudience(audience) {
    tabButtons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-audience-tab") === audience;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    panels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-audience-panel") === audience;
      panel.classList.toggle("is-active", isActive);
      if (isActive) {
        panel.hidden = false;
        revealNow(panel);
      } else {
        panel.hidden = true;
      }
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setAudience(btn.getAttribute("data-audience-tab"));
    });
  });
})();
