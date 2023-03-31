(function () {
  var fxElements = document.getElementsByClassName("reveal-fx");
  var intersectionObserverSupported =
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype;
  if (fxElements.length > 0) {
    if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
      fxRemoveClasses();
      return;
    }

    if (fxDisabled(fxElements[0])) {
      fxRevealAll();
      return;
    }

    var fxRevealDelta = 150;

    var viewportHeight = window.innerHeight,
      fxChecking = false,
      fxRevealedItems = [],
      fxElementDelays = fxGetDelays(),
      fxElementDeltas = fxGetDeltas();

    window.addEventListener("load", fxReveal);
    window.addEventListener("resize", fxResize);

    var observer = [];
    initObserver();

    function initObserver() {
      for (var i = 0; i < fxElements.length; i++) {
        observer[i] = new IntersectionObserver(
          function (entries, observer) {
            if (entries[0].isIntersecting) {
              fxRevealItemObserver(entries[0].target);
              observer.unobserve(entries[0].target);
            }
          },
          { rootMargin: "0px 0px -" + fxElementDeltas[i] + "px 0px" }
        );

        observer[i].observe(fxElements[i]);
      }
    }

    function fxRevealAll() {
      for (var i = 0; i < fxElements.length; i++) {
        Util.addClass(fxElements[i], "reveal-fx--is-visible");
      }
    }

    function fxResize() {
      if (fxChecking) return;
      fxChecking = true;
      !window.requestAnimationFrame
        ? setTimeout(function () {
            fxReset();
          }, 250)
        : window.requestAnimationFrame(fxReset);
    }

    function fxReset() {
      viewportHeight = window.innerHeight;
      fxReveal();
    }

    function fxReveal() {
      for (var i = 0; i < fxElements.length; i++) {
        (function (i) {
          if (fxRevealedItems.indexOf(i) != -1) return;
          if (fxElementIsVisible(fxElements[i], i)) {
            fxRevealItem(i);
            fxRevealedItems.push(i);
          }
        })(i);
      }
      fxResetEvents();
      fxChecking = false;
    }

    function fxRevealItem(index) {
      if (fxElementDelays[index] && fxElementDelays[index] != 0) {
        setTimeout(function () {
          Util.addClass(fxElements[index], "reveal-fx--is-visible");
        }, fxElementDelays[index]);
      } else {
        Util.addClass(fxElements[index], "reveal-fx--is-visible");
      }
    }

    function fxRevealItemObserver(item) {
      var index = Util.getIndexInArray(fxElements, item);
      if (fxRevealedItems.indexOf(index) != -1) return;
      fxRevealItem(index);
      fxRevealedItems.push(index);
      fxResetEvents();
      fxChecking = false;
    }

    function fxGetDelays() {
      var delays = [];
      for (var i = 0; i < fxElements.length; i++) {
        delays.push(
          fxElements[i].getAttribute("data-reveal-fx-delay")
            ? parseInt(fxElements[i].getAttribute("data-reveal-fx-delay"))
            : 0
        );
      }
      return delays;
    }

    function fxGetDeltas() {
      var deltas = [];
      for (var i = 0; i < fxElements.length; i++) {
        deltas.push(
          fxElements[i].getAttribute("data-reveal-fx-delta")
            ? parseInt(fxElements[i].getAttribute("data-reveal-fx-delta"))
            : fxRevealDelta
        );
      }
      return deltas;
    }

    function fxDisabled(element) {
      return !(
        window
          .getComputedStyle(element, "::before")
          .getPropertyValue("content")
          .replace(/'|"/g, "") == "reveal-fx"
      );
    }

    function fxElementIsVisible(element, i) {
      return (
        fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]
      );
    }

    function fxGetElementPosition(element) {
      return element.getBoundingClientRect().top;
    }

    function fxResetEvents() {
      if (fxElements.length > fxRevealedItems.length) return;

      window.removeEventListener("load", fxReveal);
      window.removeEventListener("resize", fxResize);
    }

    function fxRemoveClasses() {
      while (fxElements[0]) {
        var classes = fxElements[0].className.split(" ").filter(function (c) {
          return c.lastIndexOf("reveal-fx--", 0) !== 0;
        });
        fxElements[0].className = classes.join(" ").trim();
        Util.removeClass(fxElements[0], "reveal-fx");
      }
    }
  }
})();
