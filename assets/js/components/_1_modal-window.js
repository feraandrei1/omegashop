(function () {
  var Modal = function (element) {
    this.element = element;
    this.triggers = document.querySelectorAll(
      '[aria-controls="' + this.element.getAttribute("id") + '"]'
    );
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null;
    this.modalFocus = this.element.getAttribute("data-modal-first-focus")
      ? this.element.querySelector(
          this.element.getAttribute("data-modal-first-focus")
        )
      : null;
    this.selectedTrigger = null;
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.initModal = function () {
    var self = this;

    if (this.triggers) {
      for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener("click", function (event) {
          event.preventDefault();
          if (Util.hasClass(self.element, self.showClass)) {
            self.closeModal();
            return;
          }
          self.selectedTrigger = event.target;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    this.element.addEventListener("openModal", function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    this.element.addEventListener("closeModal", function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });

    if (Util.hasClass(this.element, this.showClass)) this.initModalEvents();
  };

  Modal.prototype.showModal = function () {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    this.moveFocusEl.focus();

    this.element.addEventListener("transitionend", function cb(event) {
      self.moveFocusEl.focus();
      self.element.removeEventListener("transitionend", cb);
    });
    this.emitModalEvents("modalIsOpen");
  };

  Modal.prototype.closeModal = function () {
    if (!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();

    this.cancelModalEvents();
    this.emitModalEvents("modalIsClose");
  };

  Modal.prototype.initModalEvents = function () {
    this.element.addEventListener("keydown", this);
    this.element.addEventListener("click", this);
  };

  Modal.prototype.cancelModalEvents = function () {
    this.element.removeEventListener("keydown", this);
    this.element.removeEventListener("click", this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch (event.type) {
      case "click": {
        this.initClick(event);
      }
      case "keydown": {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function (event) {
    if (
      (event.keyCode && event.keyCode == 9) ||
      (event.key && event.key == "Tab")
    ) {
      this.trapFocus(event);
    } else if (
      ((event.keyCode && event.keyCode == 13) ||
        (event.key && event.key == "Enter")) &&
      event.target.closest(".js-modal__close")
    ) {
      event.preventDefault();
      this.closeModal();
    }
  };

  Modal.prototype.initClick = function (event) {
    if (
      !event.target.closest(".js-modal__close") &&
      !Util.hasClass(event.target, "js-modal")
    )
      return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function (event) {
    if (this.firstFocusable == document.activeElement && event.shiftKey) {
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable == document.activeElement && !event.shiftKey) {
      event.preventDefault();
      this.firstFocusable.focus();
    }
  };

  Modal.prototype.getFocusableElements = function () {
    var allFocusable = this.element.querySelectorAll(focusableElString);
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
    this.getFirstFocusable();
  };

  Modal.prototype.getFirstVisible = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      if (isVisible(elements[i])) {
        this.firstFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getLastVisible = function (elements) {
    for (var i = elements.length - 1; i >= 0; i--) {
      if (isVisible(elements[i])) {
        this.lastFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getFirstFocusable = function () {
    if (!this.modalFocus || !Element.prototype.matches) {
      this.moveFocusEl = this.firstFocusable;
      return;
    }
    var containerIsFocusable = this.modalFocus.matches(focusableElString);
    if (containerIsFocusable) {
      this.moveFocusEl = this.modalFocus;
    } else {
      var elements = this.modalFocus.querySelectorAll(focusableElString);
      for (var i = 0; i < elements.length; i++) {
        if (isVisible(elements[i])) {
          this.moveFocusEl = elements[i];
          break;
        }
      }
    }
  };

  Modal.prototype.emitModalEvents = function (eventName) {
    var event = new CustomEvent(eventName, { detail: this.selectedTrigger });
    this.element.dispatchEvent(event);
  };

  function isVisible(element) {
    return (
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  var modals = document.getElementsByClassName("js-modal");

  var focusableElString =
    '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
  if (modals.length > 0) {
    var modalArrays = [];
    for (var i = 0; i < modals.length; i++) {
      (function (i) {
        modalArrays.push(new Modal(modals[i]));
      })(i);
    }

    window.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        for (var i = 0; i < modalArrays.length; i++) {
          (function (i) {
            modalArrays[i].closeModal();
          })(i);
        }
      }
    });
  }
})();
