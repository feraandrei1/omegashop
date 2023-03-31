(function () {
  var Details = function (element, index) {
    this.element = element;
    this.summary = this.element.getElementsByClassName(
      "js-details__summary"
    )[0];
    this.details = this.element.getElementsByClassName(
      "js-details__content"
    )[0];
    this.htmlElSupported = "open" in this.element;
    this.initDetails(index);
    this.initDetailsEvents();
  };

  Details.prototype.initDetails = function (index) {
    Util.setAttributes(this.summary, {
      "aria-expanded": "false",
      "aria-controls": "details--" + index,
      role: "button",
    });
    Util.setAttributes(this.details, {
      "aria-hidden": "true",
      id: "details--" + index,
    });
  };

  Details.prototype.initDetailsEvents = function () {
    var self = this;
    if (this.htmlElSupported) {
      this.element.addEventListener("toggle", function (event) {
        var ariaValues = self.element.open
          ? ["true", "false"]
          : ["false", "true"];

        self.updateAriaValues(ariaValues);
      });
    } else {
      this.summary.addEventListener("click", function (event) {
        event.preventDefault();
        var isOpen = self.element.getAttribute("open"),
          ariaValues = [];

        isOpen
          ? self.element.removeAttribute("open")
          : self.element.setAttribute("open", "true");
        ariaValues = isOpen ? ["false", "true"] : ["true", "false"];
        self.updateAriaValues(ariaValues);
      });
    }
  };

  Details.prototype.updateAriaValues = function (values) {
    this.summary.setAttribute("aria-expanded", values[0]);
    this.details.setAttribute("aria-hidden", values[1]);
  };

  var detailsEl = document.getElementsByClassName("js-details");
  if (detailsEl.length > 0) {
    for (var i = 0; i < detailsEl.length; i++) {
      (function (i) {
        new Details(detailsEl[i], i);
      })(i);
    }
  }
})();
