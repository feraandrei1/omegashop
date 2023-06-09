(function () {
  var AdaptNav = function (element) {
    this.element = element;
    this.list = this.element.getElementsByClassName("js-adapt-nav__list")[0];
    this.items = this.element.getElementsByClassName("js-adapt-nav__item");
    this.moreBtn = this.element.getElementsByClassName(
      "js-adapt-nav__item--more"
    )[0];
    this.dropdown = this.moreBtn.getElementsByTagName("ul")[0];
    this.dropdownItems = this.dropdown.getElementsByTagName("a");
    this.dropdownClass = "adapt-nav__dropdown--is-visible";
    this.resizing = false;

    this.outrunIndex = this.items.length;
    initAdaptNav(this);
  };

  function initAdaptNav(nav) {
    nav.resizing = true;
    resetOutrun(nav, "", true);
    resetAdaptNav.bind(nav)();

    window.addEventListener("resize", function (event) {
      if (nav.resizing) return;
      nav.resizing = true;
      window.requestAnimationFrame(resetAdaptNav.bind(nav));
    });

    if (document.fonts) {
      document.fonts.ready.then(function () {
        if (nav.resizing) return;
        nav.resizing = true;
        window.requestAnimationFrame(resetAdaptNav.bind(nav));
      });
    }

    Util.setAttributes(nav.moreBtn, {
      "aria-expanded": "false",
      "aria-haspopup": "true",
      "aria-controls": nav.dropdown.getAttribute("id"),
    });

    nav.moreBtn.addEventListener("click", function (event) {
      if (nav.dropdown.contains(event.target)) return;
      event.preventDefault();
      toggleMoreDropdown(
        nav,
        !Util.hasClass(nav.dropdown, nav.dropdownClass),
        true
      );
    });

    nav.dropdown.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 40) ||
        (event.key && event.key.toLowerCase() == "arrowdown")
      ) {
        navigateItems(nav, event, "next");
      } else if (
        (event.keyCode && event.keyCode == 38) ||
        (event.key && event.key.toLowerCase() == "arrowup")
      ) {
        navigateItems(nav, event, "prev");
      }
    });

    window.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key.toLowerCase() == "tab")
      ) {
        if (!nav.moreBtn.contains(document.activeElement))
          toggleMoreDropdown(nav, false, false);
      } else if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        toggleMoreDropdown(nav, false, false);
      }
    });

    window.addEventListener("click", function (event) {
      if (!nav.moreBtn.contains(event.target)) toggleMoreDropdown(nav, false);
    });
  }

  function resetAdaptNav() {
    var totalWidth = getListWidth(this.list),
      moreWidth = getFullWidth(this.moreBtn),
      maxPosition = totalWidth - moreWidth,
      cloneList = "",
      hideAll = false;

    cloneList = resetOutrun(this, cloneList, false);

    for (var i = 0; i < this.outrunIndex; i++) {
      if (Util.hasClass(this.items[i], "is-hidden")) {
        Util.addClass(this.items[i], "adapt-nav__item--hidden");
        Util.removeClass(this.items[i], "is-hidden");
      }
      var right =
        this.items[i].offsetWidth +
        this.items[i].offsetLeft +
        parseFloat(
          window
            .getComputedStyle(this.items[i])
            .getPropertyValue("margin-right")
        );
      if (right >= maxPosition || hideAll) {
        var clone = this.items[i].cloneNode(true);
        cloneList = cloneList + modifyClone(clone);
        Util.addClass(this.items[i], "is-hidden");
        hideAll = true;
      } else {
        Util.removeClass(this.items[i], "is-hidden");
      }
      Util.removeClass(this.items[i], "adapt-nav__item--hidden");
    }

    Util.toggleClass(this.moreBtn, "adapt-nav__item--hidden", cloneList == "");
    this.dropdown.innerHTML = cloneList;
    Util.addClass(this.element, "adapt-nav--is-visible");
    this.outrunIndex = this.items.length;
    this.resizing = false;
  }

  function resetOutrun(nav, cloneList, bool) {
    if (nav.items[0].offsetLeft < 0 || (bool && nav.outrunIndex > 1)) {
      nav.outrunIndex = nav.outrunIndex - 1;
      var clone = nav.items[nav.outrunIndex].cloneNode(true);
      Util.addClass(nav.items[nav.outrunIndex], "is-hidden");
      cloneList = modifyClone(clone) + cloneList;
      return resetOutrun(nav, cloneList, bool);
    } else {
      if (bool) nav.outrunIndex = nav.items.length;
      return cloneList;
    }
  }

  function getListWidth(list) {
    var style = window.getComputedStyle(list);
    return (
      parseFloat(list.getBoundingClientRect().width) -
      parseFloat(style.getPropertyValue("padding-right"))
    );
  }

  function getFullWidth(item) {
    return parseFloat(window.getComputedStyle(item).getPropertyValue("width"));
  }

  function toggleMoreDropdown(nav, bool, moveFocus) {
    Util.toggleClass(nav.dropdown, nav.dropdownClass, bool);
    if (bool) {
      nav.moreBtn.setAttribute("aria-expanded", "true");
      Util.moveFocus(nav.dropdownItems[0]);
      nav.dropdown.addEventListener(
        "transitionend",
        function (event) {
          Util.moveFocus(nav.dropdownItems[0]);
        },
        { once: true }
      );
      placeDropdown(nav);
    } else {
      nav.moreBtn.setAttribute("aria-expanded", "false");
      if (moveFocus)
        Util.moveFocus(nav.moreBtn.getElementsByTagName("button")[0]);
      nav.dropdown.style.right = "";
    }
  }

  function placeDropdown(nav) {
    var dropdownLeft = nav.dropdown.getBoundingClientRect().left;
    if (dropdownLeft < 0) nav.dropdown.style.right = dropdownLeft - 4 + "px";
  }

  function navigateItems(nav, event, direction) {
    event.preventDefault();
    var index = Util.getIndexInArray(nav.dropdownItems, event.target),
      nextIndex = direction == "next" ? index + 1 : index - 1;
    if (nextIndex < 0) nextIndex = nav.dropdownItems.length - 1;
    if (nextIndex > nav.dropdownItems.length - 1) nextIndex = 0;
    Util.moveFocus(nav.dropdownItems[nextIndex]);
  }

  function modifyClone(clone) {
    Util.addClass(clone, "adapt-nav__dropdown-item");
    Util.removeClass(
      clone,
      "js-adapt-nav__item is-hidden adapt-nav__item--hidden adapt-nav__item"
    );
    var link = clone.getElementsByClassName("adapt-nav__link");
    if (link.length > 0) {
      Util.addClass(link[0], "adapt-nav__dropdown-link js-tab-focus");
      link[0].style.outline = "none";
      Util.removeClass(link[0], "adapt-nav__link");
    }
    return clone.outerHTML;
  }

  var adaptNavs = document.getElementsByClassName("js-adapt-nav"),
    flexSupported = Util.cssSupports("align-items", "stretch");
  if (adaptNavs.length > 0) {
    for (var i = 0; i < adaptNavs.length; i++) {
      (function (i) {
        if (flexSupported) new AdaptNav(adaptNavs[i]);
        else Util.addClass(adaptNavs[i], "adapt-nav--is-visible");
      })(i);
    }
  }
})();
