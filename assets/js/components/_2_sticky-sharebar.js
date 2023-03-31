(function () {
  var StickyShareBar = function (element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName(
      "js-sticky-sharebar-target"
    );
    this.showClass = "sticky-sharebar--on-target";
    this.threshold = "50%";
    initShareBar(this);
  };

  function initShareBar(shareBar) {
    if (shareBar.contentTarget.length < 1) {
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if (intersectionObserverSupported) {
      initObserver(shareBar);
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  }

  function initObserver(shareBar) {
    var observer = new IntersectionObserver(
      function (entries, observer) {
        Util.toggleClass(
          shareBar.element,
          shareBar.showClass,
          entries[0].isIntersecting
        );
      },
      { rootMargin: "0px 0px -" + shareBar.threshold + " 0px" }
    );
    observer.observe(shareBar.contentTarget[0]);
  }

  var stickyShareBar = document.getElementsByClassName("js-sticky-sharebar"),
    intersectionObserverSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;

  if (stickyShareBar.length > 0) {
    for (var i = 0; i < stickyShareBar.length; i++) {
      (function (i) {
        new StickyShareBar(stickyShareBar[i]);
      })(i);
    }
  }
})();
