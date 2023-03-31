(function () {
  var hidingNav = document.getElementsByClassName("js-hide-nav");
  if (hidingNav.length > 0 && window.requestAnimationFrame) {
    var mainNav = Array.prototype.filter.call(hidingNav, function (element) {
        return Util.hasClass(element, "js-hide-nav--main");
      }),
      subNav = Array.prototype.filter.call(hidingNav, function (element) {
        return Util.hasClass(element, "js-hide-nav--sub");
      });

    var scrolling = false,
      previousTop = window.scrollY,
      currentTop = window.scrollY,
      scrollDelta = 10,
      scrollOffset = 150,
      headerHeight = 0;

    var navIsFixed = false;
    if (mainNav.length > 0 && Util.hasClass(mainNav[0], "hide-nav--fixed"))
      navIsFixed = true;

    var triggerMobile = getTriggerMobileMenu();
    var prevElement = createPrevElement();
    var mainNavTop = 0;

    var navOpenClasses = hidingNav[0].getAttribute("data-nav-target-class"),
      navOpenArrayClasses = [];
    if (navOpenClasses) navOpenArrayClasses = navOpenClasses.split(" ");
    getMainNavTop();
    if (mainNavTop > 0) {
      scrollOffset = scrollOffset + mainNavTop;
    }

    getHeaderHeight();
    initSecondaryNav();
    initFixedNav();
    resetHideNav();
    window.addEventListener("scroll", function (event) {
      if (scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(resetHideNav);
    });

    window.addEventListener("resize", function (event) {
      if (scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(function () {
        if (headerHeight > 0) {
          getMainNavTop();
          getHeaderHeight();
          initSecondaryNav();
          initFixedNav();
        }

        hideNavScrollUp();

        scrolling = false;
      });
    });

    function getHeaderHeight() {
      headerHeight = mainNav[0].offsetHeight;
    }

    function initSecondaryNav() {
      if (subNav.length < 1 || mainNav.length < 1) return;
      subNav[0].style.top = headerHeight - 1 + "px";
    }

    function initFixedNav() {
      if (!navIsFixed || mainNav.length < 1) return;
      mainNav[0].style.marginBottom = "-" + headerHeight + "px";
    }

    function resetHideNav() {
      currentTop = window.scrollY;
      if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
        hideNavScrollDown();
      } else if (
        previousTop - currentTop > scrollDelta ||
        (previousTop - currentTop > 0 && currentTop < scrollOffset)
      ) {
        hideNavScrollUp();
      } else if (
        previousTop - currentTop > 0 &&
        subNav.length > 0 &&
        subNav[0].getBoundingClientRect().top > 0
      ) {
        setTranslate(subNav[0], "0%");
      }

      if (navIsFixed) {
        var scrollTop = window.scrollY || window.pageYOffset;
        Util.toggleClass(
          mainNav[0],
          "hide-nav--has-bg",
          scrollTop > headerHeight + mainNavTop
        );
      }
      previousTop = currentTop;
      scrolling = false;
    }

    function hideNavScrollDown() {
      if (
        subNav.length > 0 &&
        subNav[0].getBoundingClientRect().top > headerHeight
      )
        return;

      if (
        triggerMobile &&
        triggerMobile.getAttribute("aria-expanded") == "true"
      )
        return;

      if (mainNav.length > 0 && (!navOpenClasses || !checkNavExpanded())) {
        setTranslate(mainNav[0], "-100%");
        mainNav[0].addEventListener("transitionend", addOffCanvasClass);
      }
      if (subNav.length > 0) setTranslate(subNav[0], "-" + headerHeight + "px");
    }

    function hideNavScrollUp() {
      if (mainNav.length > 0) {
        setTranslate(mainNav[0], "0%");
        Util.removeClass(mainNav[0], "hide-nav--off-canvas");
        mainNav[0].removeEventListener("transitionend", addOffCanvasClass);
      }
      if (subNav.length > 0) setTranslate(subNav[0], "0%");
    }

    function addOffCanvasClass() {
      mainNav[0].removeEventListener("transitionend", addOffCanvasClass);
      Util.addClass(mainNav[0], "hide-nav--off-canvas");
    }

    function setTranslate(element, val) {
      element.style.transform = "translateY(" + val + ")";
    }

    function getTriggerMobileMenu() {
      var triggerMobileClass = hidingNav[0].getAttribute("data-mobile-trigger");
      if (!triggerMobileClass) return false;
      if (triggerMobileClass.indexOf("#") == 0) {
        var trigger = document.getElementById(
          triggerMobileClass.replace("#", "")
        );
        if (trigger) return trigger;
      } else {
        var trigger = hidingNav[0].getElementsByClassName(triggerMobileClass);
        if (trigger.length > 0) return trigger[0];
      }

      return false;
    }

    function createPrevElement() {
      if (mainNav.length < 1) return false;
      var newElement = document.createElement("div");
      newElement.setAttribute("aria-hidden", "true");
      mainNav[0].parentElement.insertBefore(newElement, mainNav[0]);
      var prevElement = mainNav[0].previousElementSibling;
      prevElement.style.opacity = "0";
      return prevElement;
    }

    function getMainNavTop() {
      if (!prevElement) return;
      mainNavTop = prevElement.getBoundingClientRect().top + window.scrollY;
    }

    function checkNavExpanded() {
      var navIsOpen = false;
      for (var i = 0; i < navOpenArrayClasses.length; i++) {
        if (Util.hasClass(mainNav[0], navOpenArrayClasses[i].trim())) {
          navIsOpen = true;
          break;
        }
      }
      return navIsOpen;
    }
  } else {
    var mainNav = document.getElementsByClassName("js-hide-nav--main");
    if (mainNav.length < 1) return;
    if (Util.hasClass(mainNav[0], "hide-nav--fixed"))
      Util.addClass(mainNav[0], "hide-nav--has-bg");
  }
})();
