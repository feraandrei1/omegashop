(function () {
  var Dropdown = function (element) {
    this.element = element;
    this.trigger = this.element.getElementsByClassName("dropdown__trigger")[0];
    this.dropdown = this.element.getElementsByClassName("dropdown__menu")[0];
    this.triggerFocus = false;
    this.dropdownFocus = false;
    this.hideInterval = false;

    this.dropdownSubElements = this.element.getElementsByClassName(
      "dropdown__sub-wrapperu"
    );
    this.prevFocus = false;
    this.addDropdownEvents();
  };

  Dropdown.prototype.addDropdownEvents = function () {
    var self = this;
    this.placeElement();
    this.element.addEventListener("placeDropdown", function (event) {
      self.placeElement();
    });

    this.initElementEvents(this.trigger, this.triggerFocus);
    this.initElementEvents(this.dropdown, this.dropdownFocus);

    this.initSublevels();
  };

  Dropdown.prototype.placeElement = function () {
    var triggerPosition = this.trigger.getBoundingClientRect(),
      isRight =
        window.innerWidth <
        triggerPosition.left +
          parseInt(getComputedStyle(this.dropdown).getPropertyValue("width"));

    var xPosition = isRight
      ? "right: 0px; left: auto;"
      : "left: 0px; right: auto;";
    this.dropdown.setAttribute("style", xPosition);
  };

  Dropdown.prototype.initElementEvents = function (element, bool) {
    var self = this;
    element.addEventListener("mouseenter", function () {
      bool = true;
      self.showDropdown();
    });
    element.addEventListener("focus", function () {
      self.showDropdown();
    });
    element.addEventListener("mouseleave", function () {
      bool = false;
      self.hideDropdown();
    });
    element.addEventListener("focusout", function () {
      self.hideDropdown();
    });
  };

  Dropdown.prototype.showDropdown = function () {
    if (this.hideInterval) clearInterval(this.hideInterval);
    this.showLevel(this.dropdown, true);
  };

  Dropdown.prototype.hideDropdown = function () {
    var self = this;
    if (this.hideInterval) clearInterval(this.hideInterval);
    this.hideInterval = setTimeout(function () {
      var dropDownFocus = document.activeElement.closest(".js-dropdown"),
        inFocus = dropDownFocus && dropDownFocus == self.element;

      if (!self.triggerFocus && !self.dropdownFocus && !inFocus) {
        self.hideLevel(self.dropdown);

        self.hideSubLevels();
        self.prevFocus = false;
      }
    }, 300);
  };

  Dropdown.prototype.initSublevels = function () {
    var self = this;
    var dropdownMenu = this.element.getElementsByClassName("dropdown__menu");
    for (var i = 0; i < dropdownMenu.length; i++) {
      var listItems = dropdownMenu[i].children;

      new menuAim({
        menu: dropdownMenu[i],
        activate: function (row) {
          var subList = row.getElementsByClassName("dropdown__menu")[0];
          if (!subList) return;
          Util.addClass(row.querySelector("a"), "dropdown__item--hover");
          self.showLevel(subList);
        },
        deactivate: function (row) {
          var subList = row.getElementsByClassName("dropdown__menu")[0];
          if (!subList) return;
          Util.removeClass(row.querySelector("a"), "dropdown__item--hover");
          self.hideLevel(subList);
        },
        submenuSelector: ".dropdown__sub-wrapper",
      });
    }

    this.element.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key == "Tab")
      ) {
        self.prevFocus = document.activeElement;
      }
    });

    this.element.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key == "Tab")
      ) {
        var focusElement = document.activeElement,
          focusElementParent = focusElement.closest(".dropdown__menu"),
          focusElementSibling = focusElement.nextElementSibling;

        if (
          focusElementParent &&
          !Util.hasClass(focusElementParent, "dropdown__menu--is-visible")
        ) {
          self.showLevel(focusElementParent);
        }

        if (
          focusElementSibling &&
          !Util.hasClass(focusElementSibling, "dropdown__menu--is-visible")
        ) {
          self.showLevel(focusElementSibling);
        }

        if (!self.prevFocus) return;
        var prevFocusElementParent = self.prevFocus.closest(".dropdown__menu"),
          prevFocusElementSibling = self.prevFocus.nextElementSibling;

        if (!prevFocusElementParent) return;

        if (
          focusElementParent &&
          focusElementParent == prevFocusElementParent
        ) {
          if (prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
          return;
        }

        if (
          prevFocusElementSibling &&
          focusElementParent &&
          focusElementParent == prevFocusElementSibling
        )
          return;

        if (
          focusElementSibling &&
          prevFocusElementParent &&
          focusElementSibling == prevFocusElementParent
        )
          return;

        var focusElementParentParent =
          focusElementParent.parentNode.closest(".dropdown__menu");

        if (
          focusElementParentParent &&
          focusElementParentParent == prevFocusElementParent
        ) {
          if (prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
          return;
        }

        if (
          prevFocusElementParent &&
          Util.hasClass(prevFocusElementParent, "dropdown__menu--is-visible")
        ) {
          self.hideLevel(prevFocusElementParent);
        }
      }
    });
  };

  Dropdown.prototype.hideSubLevels = function () {
    var visibleSubLevels = this.dropdown.getElementsByClassName(
      "dropdown__menu--is-visible"
    );
    if (visibleSubLevels.length == 0) return;
    while (visibleSubLevels[0]) {
      this.hideLevel(visibleSubLevels[0]);
    }
    var hoveredItems = this.dropdown.getElementsByClassName(
      "dropdown__item--hover"
    );
    while (hoveredItems[0]) {
      Util.removeClass(hoveredItems[0], "dropdown__item--hover");
    }
  };

  Dropdown.prototype.showLevel = function (level, bool) {
    if (bool == undefined) {
      Util.removeClass(level, "dropdown__menu--left");
      var boundingRect = level.getBoundingClientRect();
      if (
        window.innerWidth - boundingRect.right < 5 &&
        boundingRect.left + window.scrollX > 2 * boundingRect.width
      )
        Util.addClass(level, "dropdown__menu--left");
    }
    Util.addClass(level, "dropdown__menu--is-visible");
    Util.removeClass(level, "dropdown__menu--is-hidden");
  };

  Dropdown.prototype.hideLevel = function (level) {
    if (!Util.hasClass(level, "dropdown__menu--is-visible")) return;
    Util.removeClass(level, "dropdown__menu--is-visible");
    Util.addClass(level, "dropdown__menu--is-hidden");

    level.addEventListener("animationend", function cb() {
      level.removeEventListener("animationend", cb);
      Util.removeClass(level, "dropdown__menu--is-hidden dropdown__menu--left");
    });
  };

  var dropdown = document.getElementsByClassName("js-dropdown");
  if (dropdown.length > 0) {
    for (var i = 0; i < dropdown.length; i++) {
      (function (i) {
        new Dropdown(dropdown[i]);
      })(i);
    }
  }
})();
