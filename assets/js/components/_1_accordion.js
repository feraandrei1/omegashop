(function () {
  var Accordion = function (element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(
      this.element,
      "js-accordion__item"
    );
    this.version = this.element.getAttribute("data-version")
      ? "-" + this.element.getAttribute("data-version")
      : "";
    this.showClass = "accordion" + this.version + "__item--is-open";
    this.animateHeight = this.element.getAttribute("data-animation") == "on";
    this.multiItems = !(this.element.getAttribute("data-multi-items") == "off");
    this.initAccordion();
  };

  Accordion.prototype.initAccordion = function () {
    for (var i = 0; i < this.items.length; i++) {
      var button = this.items[i].getElementsByTagName("button")[0],
        content = this.items[i].getElementsByClassName(
          "js-accordion__panel"
        )[0],
        isOpen = Util.hasClass(this.items[i], this.showClass)
          ? "true"
          : "false";
      Util.setAttributes(button, {
        "aria-expanded": isOpen,
        "aria-controls": "accordion-content-" + i,
        id: "accordion-header-" + i,
      });
      Util.addClass(button, "js-accordion__trigger");
      Util.setAttributes(content, {
        "aria-labelledby": "accordion-header-" + i,
        id: "accordion-content-" + i,
      });
    }

    this.initAccordionEvents();
  };

  Accordion.prototype.initAccordionEvents = function () {
    var self = this;

    this.element.addEventListener("click", function (event) {
      var trigger = event.target.closest(".js-accordion__trigger");

      if (
        trigger &&
        Util.getIndexInArray(self.items, trigger.parentElement) >= 0
      )
        self.triggerAccordion(trigger);
    });
  };

  Accordion.prototype.triggerAccordion = function (trigger) {
    var self = this;
    var bool = trigger.getAttribute("aria-expanded") === "true";

    this.animateAccordion(trigger, bool);
  };

  Accordion.prototype.animateAccordion = function (trigger, bool) {
    var self = this;
    var item = trigger.closest(".js-accordion__item"),
      content = item.getElementsByClassName("js-accordion__panel")[0],
      ariaValue = bool ? "false" : "true";

    if (!bool) Util.addClass(item, this.showClass);
    trigger.setAttribute("aria-expanded", ariaValue);
    self.resetContentVisibility(item, content, bool);

    if (!this.multiItems && !bool) this.closeSiblings(item);
  };

  Accordion.prototype.resetContentVisibility = function (item, content, bool) {
    Util.toggleClass(item, this.showClass, !bool);
    content.removeAttribute("style");
    if (bool && !this.multiItems) {
      this.moveContent();
    }
  };

  Accordion.prototype.closeSiblings = function (item) {
    var index = Util.getIndexInArray(this.items, item);
    for (var i = 0; i < this.items.length; i++) {
      if (Util.hasClass(this.items[i], this.showClass) && i != index) {
        this.animateAccordion(
          this.items[i].getElementsByClassName("js-accordion__trigger")[0],
          true
        );
        return false;
      }
    }
  };

  Accordion.prototype.moveContent = function () {
    var openAccordion = this.element.getElementsByClassName(this.showClass);
    if (openAccordion.length == 0) return;
    var boundingRect = openAccordion[0].getBoundingClientRect();
    if (boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
      var windowScrollTop =
        window.scrollY || document.documentElement.scrollTop;
      window.scrollTo(0, boundingRect.top + windowScrollTop);
    }
  };

  var accordions = document.getElementsByClassName("js-accordion");
  if (accordions.length > 0) {
    for (var i = 0; i < accordions.length; i++) {
      (function (i) {
        new Accordion(accordions[i]);
      })(i);
    }
  }
})();
