(function () {
  var Menu = function (element) {
    this.element = element;
    this.elementId = this.element.getAttribute("id");
    this.menuItems = this.element.getElementsByClassName("js-menu__content");
    this.trigger = document.querySelectorAll(
      '[aria-controls="' + this.elementId + '"]'
    );
    this.selectedTrigger = false;
    this.menuIsOpen = false;
    this.initMenu();
    this.initMenuEvents();
  };

  Menu.prototype.initMenu = function () {
    for (var i = 0; i < this.trigger.length; i++) {
      Util.setAttributes(this.trigger[i], {
        "aria-expanded": "false",
        "aria-haspopup": "true",
      });
    }

    for (var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].setAttribute("tabindex", "0");
    }
  };

  Menu.prototype.initMenuEvents = function () {
    var self = this;
    for (var i = 0; i < this.trigger.length; i++) {
      (function (i) {
        self.trigger[i].addEventListener("click", function (event) {
          event.preventDefault();

          if (
            Util.hasClass(self.element, "menu--is-visible") &&
            self.selectedTrigger != self.trigger[i]
          ) {
            self.toggleMenu(false, false);
          }

          self.selectedTrigger = self.trigger[i];
          self.toggleMenu(
            !Util.hasClass(self.element, "menu--is-visible"),
            true
          );
        });
      })(i);
    }

    this.element.addEventListener("keydown", function (event) {
      if (!Util.hasClass(event.target, "js-menu__content")) return;
      if (
        (event.keyCode && event.keyCode == 40) ||
        (event.key && event.key.toLowerCase() == "arrowdown")
      ) {
        self.navigateItems(event, "next");
      } else if (
        (event.keyCode && event.keyCode == 38) ||
        (event.key && event.key.toLowerCase() == "arrowup")
      ) {
        self.navigateItems(event, "prev");
      }
    });
  };

  Menu.prototype.toggleMenu = function (bool, moveFocus) {
    var self = this;

    Util.toggleClass(this.element, "menu--is-visible", bool);
    this.menuIsOpen = bool;
    if (bool) {
      this.selectedTrigger.setAttribute("aria-expanded", "true");
      Util.moveFocus(this.menuItems[0]);
      this.element.addEventListener(
        "transitionend",
        function (event) {
          Util.moveFocus(self.menuItems[0]);
        },
        { once: true }
      );

      this.positionMenu();

      Util.addClass(this.selectedTrigger, "menu-control--active");
    } else if (this.selectedTrigger) {
      this.selectedTrigger.setAttribute("aria-expanded", "false");
      if (moveFocus) Util.moveFocus(this.selectedTrigger);

      Util.removeClass(this.selectedTrigger, "menu-control--active");
      this.selectedTrigger = false;
    }
  };

  Menu.prototype.positionMenu = function (event, direction) {
    var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
      menuOnTop =
        window.innerHeight - selectedTriggerPosition.bottom <
        selectedTriggerPosition.top;

    var left = selectedTriggerPosition.left,
      right = window.innerWidth - selectedTriggerPosition.right,
      isRight =
        window.innerWidth <
        selectedTriggerPosition.left + this.element.offsetWidth;

    var horizontal = isRight
        ? "right: " + right + "px;"
        : "left: " + left + "px;",
      vertical = menuOnTop
        ? "bottom: " +
          (window.innerHeight - selectedTriggerPosition.top) +
          "px;"
        : "top: " + selectedTriggerPosition.bottom + "px;";

    if (isRight && right + this.element.offsetWidth > window.innerWidth)
      horizontal =
        "left: " +
        parseInt((window.innerWidth - this.element.offsetWidth) / 2) +
        "px;";
    var maxHeight = menuOnTop
      ? selectedTriggerPosition.top - 20
      : window.innerHeight - selectedTriggerPosition.bottom - 20;
    this.element.setAttribute(
      "style",
      horizontal + vertical + "max-height:" + Math.floor(maxHeight) + "px;"
    );
  };

  Menu.prototype.navigateItems = function (event, direction) {
    event.preventDefault();
    var index = Util.getIndexInArray(this.menuItems, event.target),
      nextIndex = direction == "next" ? index + 1 : index - 1;
    if (nextIndex < 0) nextIndex = this.menuItems.length - 1;
    if (nextIndex > this.menuItems.length - 1) nextIndex = 0;
    Util.moveFocus(this.menuItems[nextIndex]);
  };

  Menu.prototype.checkMenuFocus = function () {
    var menuParent = document.activeElement.closest(".js-menu");
    if (!menuParent || !this.element.contains(menuParent))
      this.toggleMenu(false, false);
  };

  Menu.prototype.checkMenuClick = function (target) {
    if (
      !this.element.contains(target) &&
      !target.closest('[aria-controls="' + this.elementId + '"]')
    )
      this.toggleMenu(false);
  };

  window.Menu = Menu;

  var menus = document.getElementsByClassName("js-menu");
  if (menus.length > 0) {
    var menusArray = [];
    for (var i = 0; i < menus.length; i++) {
      (function (i) {
        menusArray.push(new Menu(menus[i]));
      })(i);
    }

    window.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key.toLowerCase() == "tab")
      ) {
        menusArray.forEach(function (element) {
          element.checkMenuFocus();
        });
      } else if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        menusArray.forEach(function (element) {
          element.toggleMenu(false, false);
        });
      }
    });

    window.addEventListener("click", function (event) {
      menusArray.forEach(function (element) {
        element.checkMenuClick(event.target);
      });
    });

    window.addEventListener("resize", function (event) {
      menusArray.forEach(function (element) {
        element.toggleMenu(false, false);
      });
    });

    window.addEventListener("scroll", function (event) {
      menusArray.forEach(function (element) {
        if (element.menuIsOpen) element.toggleMenu(false, false);
      });
    });
  }
})();
