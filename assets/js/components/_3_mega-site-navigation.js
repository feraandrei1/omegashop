(function () {
  var MegaNav = function (element) {
    this.element = element;
    this.search = this.element.getElementsByClassName("js-mega-nav__search");
    this.searchActiveController = false;
    this.menu = this.element.getElementsByClassName("js-mega-nav__nav");
    this.menuItems = this.menu[0].getElementsByClassName("js-mega-nav__item");
    this.menuActiveController = false;
    this.itemExpClass = "mega-nav__item--expanded";
    this.classIconBtn = "mega-nav__icon-btn--state-b";
    this.classSearchVisible = "mega-nav__search--is-visible";
    this.classNavVisible = "mega-nav__nav--is-visible";
    this.classMobileLayout = "mega-nav--mobile";
    this.classDesktopLayout = "mega-nav--desktop";
    this.layout = "mobile";

    this.dropdown = this.element.getElementsByClassName("js-dropdown");

    this.expandedClass = "mega-nav--expanded";
    initMegaNav(this);
  };

  function initMegaNav(megaNav) {
    setMegaNavLayout(megaNav);
    initSearch(megaNav);
    initMenu(megaNav);
    initSubNav(megaNav);

    megaNav.element.addEventListener("update-menu-layout", function (event) {
      setMegaNavLayout(megaNav);
    });
  }

  function setMegaNavLayout(megaNav) {
    var layout = getComputedStyle(megaNav.element, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    if (layout == megaNav.layout) return;
    megaNav.layout = layout;
    Util.toggleClass(
      megaNav.element,
      megaNav.classDesktopLayout,
      megaNav.layout == "desktop"
    );
    Util.toggleClass(
      megaNav.element,
      megaNav.classMobileLayout,
      megaNav.layout != "desktop"
    );
    if (megaNav.layout == "desktop") {
      closeSubNav(megaNav, false);

      triggerDropdownPosition(megaNav);
    }
    closeSearch(megaNav, false);
    resetMegaNavOffset(megaNav);
    resetNavAppearance(megaNav);
  }

  function resetMegaNavOffset(megaNav) {
    document.documentElement.style.setProperty(
      "--mega-nav-offset-y",
      megaNav.element.getBoundingClientRect().top + "px"
    );
  }

  function closeNavigation(megaNav) {
    closeSearch(megaNav);

    if (Util.hasClass(megaNav.menu[0], megaNav.classNavVisible)) {
      toggleMenu(
        megaNav,
        megaNav.menu[0],
        "menuActiveController",
        megaNav.classNavVisible,
        megaNav.menuActiveController,
        true
      );
    }

    closeSubNav(megaNav, false);
    resetNavAppearance(megaNav);
  }

  function closeFocusNavigation(megaNav) {
    if (
      Util.hasClass(megaNav.search[0], megaNav.classSearchVisible) &&
      !document.activeElement.closest(".js-mega-nav__search")
    ) {
      toggleMenu(
        megaNav,
        megaNav.search[0],
        "searchActiveController",
        megaNav.classSearchVisible,
        megaNav.searchActiveController,
        true
      );
    }

    if (
      Util.hasClass(megaNav.menu[0], megaNav.classNavVisible) &&
      !document.activeElement.closest(".js-mega-nav__nav")
    ) {
      toggleMenu(
        megaNav,
        megaNav.menu[0],
        "menuActiveController",
        megaNav.classNavVisible,
        megaNav.menuActiveController,
        true
      );
    }

    for (var i = 0; i < megaNav.menuItems.length; i++) {
      if (!Util.hasClass(megaNav.menuItems[i], megaNav.itemExpClass)) continue;
      var parentItem = document.activeElement.closest(".js-mega-nav__item");
      if (parentItem && parentItem == megaNav.menuItems[i]) continue;
      closeSingleSubnav(megaNav, i);
    }
    resetNavAppearance(megaNav);
  }

  function closeSearch(megaNav, bool) {
    if (Util.hasClass(megaNav.search[0], megaNav.classSearchVisible)) {
      toggleMenu(
        megaNav,
        megaNav.search[0],
        "searchActiveController",
        megaNav.classSearchVisible,
        megaNav.searchActiveController,
        bool
      );
    }
  }

  function initSearch(megaNav) {
    if (megaNav.search.length == 0) return;

    megaNav.searchToggles = document.querySelectorAll(
      '[aria-controls="' + megaNav.search[0].getAttribute("id") + '"]'
    );
    for (var i = 0; i < megaNav.searchToggles.length; i++) {
      (function (i) {
        megaNav.searchToggles[i].addEventListener("click", function (event) {
          toggleMenu(
            megaNav,
            megaNav.search[0],
            "searchActiveController",
            megaNav.classSearchVisible,
            megaNav.searchToggles[i],
            true
          );

          if (Util.hasClass(megaNav.menu[0], megaNav.classNavVisible)) {
            toggleMenu(
              megaNav,
              megaNav.menu[0],
              "menuActiveController",
              megaNav.classNavVisible,
              megaNav.menuActiveController,
              false
            );
          }

          closeSubNav(megaNav, false);
          resetNavAppearance(megaNav);
        });
      })(i);
    }
  }

  function initMenu(megaNav) {
    if (megaNav.menu.length == 0) return;

    megaNav.menuToggles = document.querySelectorAll(
      '[aria-controls="' + megaNav.menu[0].getAttribute("id") + '"]'
    );
    for (var i = 0; i < megaNav.menuToggles.length; i++) {
      (function (i) {
        megaNav.menuToggles[i].addEventListener("click", function (event) {
          toggleMenu(
            megaNav,
            megaNav.menu[0],
            "menuActiveController",
            megaNav.classNavVisible,
            megaNav.menuToggles[i],
            true
          );

          if (Util.hasClass(megaNav.search[0], megaNav.classSearchVisible)) {
            toggleMenu(
              megaNav,
              megaNav.search[0],
              "searchActiveController",
              megaNav.classSearchVisible,
              megaNav.searchActiveController,
              false
            );
          }
          resetNavAppearance(megaNav);
        });
      })(i);
    }
  }

  function toggleMenu(
    megaNav,
    element,
    controller,
    visibleClass,
    toggle,
    moveFocus
  ) {
    var menuIsVisible = Util.hasClass(element, visibleClass);
    Util.toggleClass(element, visibleClass, !menuIsVisible);
    Util.toggleClass(toggle, megaNav.classIconBtn, !menuIsVisible);
    menuIsVisible
      ? toggle.removeAttribute("aria-expanded")
      : toggle.setAttribute("aria-expanded", "true");
    if (menuIsVisible) {
      if (toggle && moveFocus) toggle.focus();
      megaNav[controller] = false;
    } else {
      if (toggle) megaNav[controller] = toggle;
      getFirstFocusable(element).focus();
    }
  }

  function getFirstFocusable(element) {
    var focusableEle = element.querySelectorAll(
        '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'
      ),
      firstFocusable = false;
    for (var i = 0; i < focusableEle.length; i++) {
      if (
        focusableEle[i].offsetWidth ||
        focusableEle[i].offsetHeight ||
        focusableEle[i].getClientRects().length
      ) {
        firstFocusable = focusableEle[i];
        break;
      }
    }
    return firstFocusable;
  }

  function initSubNav(megaNav) {
    megaNav.element.addEventListener("click", function (event) {
      var triggerBtn = event.target.closest(".js-mega-nav__control");
      if (!triggerBtn) return;
      var mainItem = triggerBtn.closest(".js-mega-nav__item");
      if (!mainItem) return;
      var itemExpanded = Util.hasClass(mainItem, megaNav.itemExpClass);
      Util.toggleClass(mainItem, megaNav.itemExpClass, !itemExpanded);
      itemExpanded
        ? triggerBtn.removeAttribute("aria-expanded")
        : triggerBtn.setAttribute("aria-expanded", "true");
      if (megaNav.layout == "desktop" && !itemExpanded)
        closeSubNav(megaNav, mainItem);

      closeSearch(megaNav, false);
      resetNavAppearance(megaNav);
    });
  }

  function closeSubNav(megaNav, selectedItem) {
    if (megaNav.menuItems.length == 0) return;
    for (var i = 0; i < megaNav.menuItems.length; i++) {
      if (megaNav.menuItems[i] != selectedItem) closeSingleSubnav(megaNav, i);
    }
  }

  function closeSingleSubnav(megaNav, index) {
    Util.removeClass(megaNav.menuItems[index], megaNav.itemExpClass);
    var triggerBtn = megaNav.menuItems[index].getElementsByClassName(
      "js-mega-nav__control"
    );
    if (triggerBtn.length > 0) triggerBtn[0].removeAttribute("aria-expanded");
  }

  function triggerDropdownPosition(megaNav) {
    if (megaNav.dropdown.length == 0) return;
    for (var i = 0; i < megaNav.dropdown.length; i++) {
      megaNav.dropdown[i].dispatchEvent(new CustomEvent("placeDropdown"));
    }
  }

  function resetNavAppearance(megaNav) {
    (megaNav.element.getElementsByClassName(megaNav.itemExpClass).length > 0 &&
      megaNav.layout == "desktop") ||
    megaNav.element.getElementsByClassName(megaNav.classSearchVisible).length >
      0 ||
    (megaNav.element.getElementsByClassName(megaNav.classNavVisible).length >
      0 &&
      megaNav.layout == "mobile")
      ? Util.addClass(megaNav.element, megaNav.expandedClass)
      : Util.removeClass(megaNav.element, megaNav.expandedClass);
  }

  var megaNav = document.getElementsByClassName("js-mega-nav");
  if (megaNav.length > 0) {
    var megaNavArray = [];
    for (var i = 0; i < megaNav.length; i++) {
      (function (i) {
        megaNavArray.push(new MegaNav(megaNav[i]));
      })(i);
    }

    window.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        for (var i = 0; i < megaNavArray.length; i++) {
          (function (i) {
            closeNavigation(megaNavArray[i]);
          })(i);
        }
      }

      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key.toLowerCase() == "tab")
      ) {
        for (var i = 0; i < megaNavArray.length; i++) {
          (function (i) {
            closeFocusNavigation(megaNavArray[i]);
          })(i);
        }
      }
    });

    window.addEventListener("click", function (event) {
      if (!event.target.closest(".js-mega-nav"))
        closeNavigation(megaNavArray[0]);
    });

    var resizingId = false,
      customEvent = new CustomEvent("update-menu-layout");
    window.addEventListener("resize", function (event) {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 200);
    });

    function doneResizing() {
      for (var i = 0; i < megaNavArray.length; i++) {
        (function (i) {
          megaNavArray[i].element.dispatchEvent(customEvent);
        })(i);
      }
    }
  }
})();
