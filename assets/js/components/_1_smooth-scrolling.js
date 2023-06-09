(function () {
  var SmoothScroll = function (element) {
    this.element = element;
    this.scrollDuration =
      parseInt(this.element.getAttribute("data-duration")) || 300;
    this.dataElement = this.element.getAttribute("data-element");
    this.scrollElement = this.dataElement
      ? document.querySelector(this.dataElement)
      : window;
    this.initScroll();
  };

  SmoothScroll.prototype.initScroll = function () {
    var self = this;

    this.element.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = event.target
          .closest(".js-smooth-scroll")
          .getAttribute("href")
          .replace("#", ""),
        target = document.getElementById(targetId),
        targetTabIndex = target.getAttribute("tabindex"),
        windowScrollTop =
          self.scrollElement.scrollTop || document.documentElement.scrollTop;

      if (!self.dataElement)
        windowScrollTop = window.scrollY || document.documentElement.scrollTop;

      var scrollElement = self.dataElement ? self.scrollElement : false;

      var fixedHeight = self.getFixedElementHeight();
      Util.scrollTo(
        target.getBoundingClientRect().top + windowScrollTop - fixedHeight,
        self.scrollDuration,
        function () {
          Util.moveFocus(target);
          history.pushState(false, false, "#" + targetId);
          self.resetTarget(target, targetTabIndex);
        },
        scrollElement
      );
    });
  };

  SmoothScroll.prototype.resetTarget = function (target, tabindex) {
    if (parseInt(target.getAttribute("tabindex")) < 0) {
      target.style.outline = "none";
      !tabindex && target.removeAttribute("tabindex");
    }
  };

  SmoothScroll.prototype.getFixedElementHeight = function () {
    var fixedElementDelta = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "scroll-padding"
      )
    );
    if (isNaN(fixedElementDelta)) {
      fixedElementDelta = 0;
      var fixedElement = document.querySelector(
        this.element.getAttribute("data-fixed-element")
      );
      if (fixedElement)
        fixedElementDelta = parseInt(
          fixedElement.getBoundingClientRect().height
        );
    }
    return fixedElementDelta;
  };

  var smoothScrollLinks = document.getElementsByClassName("js-smooth-scroll");
  if (
    smoothScrollLinks.length > 0 &&
    !Util.cssSupports("scroll-behavior", "smooth") &&
    window.requestAnimationFrame
  ) {
    for (var i = 0; i < smoothScrollLinks.length; i++) {
      (function (i) {
        new SmoothScroll(smoothScrollLinks[i]);
      })(i);
    }
  }
})();
