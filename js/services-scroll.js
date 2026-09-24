(function () {
  "use strict";

  var wrapper = document.getElementById("services-scroll");
  if (!wrapper) return;

  var pin = wrapper.querySelector(".services-pin");
  var panels = Array.prototype.slice.call(wrapper.querySelectorAll(".services-panel"));
  var dots = Array.prototype.slice.call(wrapper.querySelectorAll(".services-dot"));
  if (!panels.length) return;

  wrapper.style.setProperty("--panel-count", String(panels.length));

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wideEnough = window.matchMedia("(min-width: 900px)");
  var pinned = false;
  var currentIndex = 0;
  var ticking = false;

  function setActive(index) {
    if (index === currentIndex && panels[index].classList.contains("is-active")) return;
    currentIndex = index;
    panels.forEach(function (panel, i) {
      var active = i === index;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (!pinned) return;
      var rect = wrapper.getBoundingClientRect();
      var scrolled = -rect.top;
      var scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var progress = Math.min(1, Math.max(0, scrolled / scrollable));
      var index = Math.min(panels.length - 1, Math.floor(progress * panels.length));
      setActive(index);
    });
  }

  function enablePinned() {
    if (pinned) return;
    pinned = true;
    wrapper.classList.add("is-pinned");
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function disablePinned() {
    if (!pinned) return;
    pinned = false;
    wrapper.classList.remove("is-pinned");
    window.removeEventListener("scroll", onScroll);
    setActive(0);
  }

  function evaluate() {
    if (wideEnough.matches && !reduceMotion.matches) {
      enablePinned();
    } else {
      disablePinned();
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      if (!pinned) {
        panels[index].scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var scrollable = wrapper.offsetHeight - window.innerHeight;
      var target = wrapper.offsetTop + (index / panels.length) * scrollable + 2;
      window.scrollTo({ top: target, behavior: "smooth" });
    });
  });

  evaluate();
  window.addEventListener("resize", evaluate);
  if (wideEnough.addEventListener) wideEnough.addEventListener("change", evaluate);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", evaluate);
})();
