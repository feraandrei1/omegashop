(function () {
  var SideNav2 = function (element) {
    this.element = element;
    this.controller = this.element.getElementsByClassName(
      "js-sidenav-v2__control"
    );
    this.staticLayoutClass = "sidenav-v2--static";
    this.expandedClass = "sidenav-v2--expanded";
    this.isStatic = Util.hasClass(this.element, this.staticLayoutClass);
    this.layout = "static";
    this.customStatic = this.element.getAttribute("data-static-class");
    this.sideNavItems = this.element.getElementsByClassName(
      "js-sidenav-v2__link"
    );
    initSideNav2(this);
  };

  function initSideNav2(element) {
    checkNavLayour(element);

    element.element.addEventListener("update-side-nav-v2", function (event) {
      checkNavLayour(element);
    });

    initCollapsedVersion(element);
  }

  function initCollapsedVersion(element) {
    if (element.controller.length < 1) return;

    element.controller[0].addEventListener("click", function (event) {
      var isOpen = Util.hasClass(element.element, element.expandedClass);
      toggleSideNav(element, isOpen);
    });

    element.element.addEventListener("keydown", function (event) {
      if (element.layout == "static") return;
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        toggleSideNav(element, true);
        element.controller[0].focus();
      }
    });
  }

  function toggleSideNav(element, bool) {
    Util.toggleClass(element.element, element.expandedClass, !bool);
    bool
      ? element.controller[0].removeAttribute("aria-expanded")
      : element.controller[0].setAttribute("aria-expanded", "true");
    if (!bool && element.sideNavItems.length > 0) {
      element.sideNavItems[0].focus();
    }
  }

  function checkNavLayour(element) {
    if (element.isStatic) return;
    element.layout = getComputedStyle(element.element, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    Util.toggleClass(
      element.element,
      element.staticLayoutClass,
      element.layout == "static"
    );
    if (element.customStatic)
      Util.toggleClass(
        element.element,
        element.customStatic,
        element.layout == "static"
      );
  }

  var sideNav = document.getElementsByClassName("js-sidenav-v2");
  if (sideNav.length > 0) {
    var sideNavArray = [];
    for (var i = 0; i < sideNav.length; i++) {
      (function (i) {
        sideNavArray.push(new SideNav2(sideNav[i]));
      })(i);
    }

    var resizingId = false,
      customEvent = new CustomEvent("update-side-nav-v2");
    window.addEventListener("resize", function (event) {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 300);
    });

    function doneResizing() {
      for (var i = 0; i < sideNavArray.length; i++) {
        (function (i) {
          sideNavArray[i].element.dispatchEvent(customEvent);
        })(i);
      }
    }

    window.requestAnimationFrame
      ? window.requestAnimationFrame(doneResizing)
      : doneResizing();
  }
})();
