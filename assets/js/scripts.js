function Util() {}

Util.hasClass = function (el, className) {
  return el.classList.contains(className);
};

Util.addClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};

Util.removeClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

Util.getChildrenByClassName = function (el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className))
      childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function (elem, selector) {
  if (selector.nodeType) {
    return elem === selector;
  }

  var qa =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : selector,
    length = qa.length,
    returnArr = [];

  while (length--) {
    if (qa[length] === elem) {
      return true;
    }
  }

  return false;
};

Util.setHeight = function (start, to, element, duration, cb, timeFunction) {
  var change = to - start,
    currentTime = null;

  var animateHeight = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = parseInt((progress / duration) * change + start);
    if (timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val + "px";
    if (progress < duration) {
      window.requestAnimationFrame(animateHeight);
    } else {
      if (cb) cb();
    }
  };

  element.style.height = start + "px";
  window.requestAnimationFrame(animateHeight);
};

Util.scrollTo = function (final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if (!scrollEl) start = window.scrollY || document.documentElement.scrollTop;

  var animateScroll = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    element.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

Util.moveFocus = function (element) {
  if (!element) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute("tabindex", "-1");
    element.focus();
  }
};

Util.getIndexInArray = function (array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function (property, value) {
  if ("CSS" in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return jsProperty in document.body.style;
  }
};

Util.extend = function () {
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }

  var merge = function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (
          deep &&
          Object.prototype.toString.call(obj[prop]) === "[object Object]"
        ) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

Util.osHasReducedMotion = function () {
  if (!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (matchMediaObj) return matchMediaObj.matches;
  return false;
};

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

if (typeof window.CustomEvent !== "function") {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
  t /= d;
  return c * t * t * t * t + b;
};

Math.easeOutQuart = function (t, b, c, d) {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t * t + b;
  t -= 2;
  return (-c / 2) * (t * t * t * t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s = 1.70158;
  var p = d * 0.7;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return (
    a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
    c +
    b
  );
};

(function () {
  var focusTab = document.getElementsByClassName("js-tab-focus"),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if (focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener("keydown", detectTab);
    }
    window.removeEventListener("mousedown", detectClick);
    outlineStyle = false;
    eventDetected = true;
  }

  function detectTab(event) {
    if (event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener("keydown", detectTab);
    window.addEventListener("mousedown", detectClick);
    outlineStyle = true;
  }

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? "" : "none";
    for (var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty("outline", outlineStyle);
    }
  }

  function initFocusTabs() {
    if (shouldInit) {
      if (eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener("mousedown", detectClick);
  }

  initFocusTabs();
  window.addEventListener("initFocusTabs", initFocusTabs);
})();

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent("initFocusTabs"));
}

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

(function () {
  var ChoiceAccordion = function (element) {
    this.element = element;
    this.btns = this.element.getElementsByClassName("js-choice-accordion__btn");
    this.inputs = getChoiceInput(this);
    this.contents = getChoiceContent(this);
    this.isRadio = this.inputs[0].type == "radio";
    this.animateHeight = this.element.getAttribute("data-animation") == "on";
    initAccordion(this);
    resetCheckedStatus(this, false);
    initChoiceAccordionEvent(this);
  };

  function getChoiceInput(element) {
    var inputs = [],
      fallbacks = element.element.getElementsByClassName(
        "js-choice-accordion__fallback"
      );
    for (var i = 0; i < fallbacks.length; i++) {
      inputs.push(fallbacks[i].getElementsByTagName("input")[0]);
    }
    return inputs;
  }

  function getChoiceContent(element) {
    var contents = [];
    for (var i = 0; i < element.btns.length; i++) {
      var content = Util.getChildrenByClassName(
        element.btns[i].parentNode,
        "js-choice-accordion__panel"
      );
      if (content.length > 0) contents.push(content[0]);
      else contents.push(false);
    }
    return contents;
  }

  function initAccordion(element) {
    for (var i = 0; i < element.inputs.length; i++) {
      if (!element.contents[i]) return;
      var isOpen = element.inputs[i].checked,
        id = element.inputs[i].getAttribute("id");
      if (!id) id = "choice-accordion-header-" + i;

      Util.setAttributes(element.inputs[i], {
        "aria-expanded": isOpen,
        "aria-controls": "choice-accordion-content-" + i,
        id: id,
      });
      Util.setAttributes(element.contents[i], {
        "aria-labelledby": id,
        id: "choice-accordion-content-" + i,
      });
      Util.toggleClass(element.contents[i], "is-hidden", !isOpen);
    }
  }

  function initChoiceAccordionEvent(choiceAcc) {
    choiceAcc.element.addEventListener("click", function (event) {
      if (Util.getIndexInArray(choiceAcc.inputs, event.target) > -1) return;

      var selectedBtn = event.target.closest(".js-choice-accordion__btn");
      if (!selectedBtn) return;

      var index = Util.getIndexInArray(choiceAcc.btns, selectedBtn);
      if (choiceAcc.isRadio && choiceAcc.inputs[index].checked) {
        choiceAcc.inputs[index].focus();
        return;
      }

      choiceAcc.inputs[index].checked = !choiceAcc.inputs[index].checked;
      choiceAcc.inputs[index].dispatchEvent(new CustomEvent("change"));
      choiceAcc.inputs[index].focus();
    });

    for (var i = 0; i < choiceAcc.btns.length; i++) {
      (function (i) {
        choiceAcc.inputs[i].addEventListener("change", function (event) {
          choiceAcc.isRadio
            ? resetCheckedStatus(choiceAcc, true)
            : resetSingleStatus(choiceAcc, i, true);
        });

        choiceAcc.inputs[i].addEventListener("focus", function (event) {
          resetFocusStatus(choiceAcc, i, true);
        });

        choiceAcc.inputs[i].addEventListener("blur", function (event) {
          resetFocusStatus(choiceAcc, i, false);
        });
      })(i);
    }
  }

  function resetCheckedStatus(choiceAcc, bool) {
    for (var i = 0; i < choiceAcc.btns.length; i++) {
      resetSingleStatus(choiceAcc, i, bool);
    }
  }

  function resetSingleStatus(choiceAcc, index, bool) {
    Util.toggleClass(
      choiceAcc.btns[index],
      "choice-accordion__btn--checked",
      choiceAcc.inputs[index].checked
    );
    if (bool)
      resetSingleContent(choiceAcc, index, choiceAcc.inputs[index].checked);
  }

  function resetFocusStatus(choiceAcc, index, bool) {
    Util.toggleClass(
      choiceAcc.btns[index],
      "choice-accordion__btn--focus",
      bool
    );
  }

  function resetSingleContent(choiceAcc, index, bool) {
    var input = choiceAcc.inputs[index],
      content = choiceAcc.contents[index];

    if (bool && content) Util.removeClass(content, "is-hidden");
    input.setAttribute("aria-expanded", bool);

    if (choiceAcc.animateHeight && content) {
      var initHeight = !bool ? content.offsetHeight : 0,
        finalHeight = !bool ? 0 : content.offsetHeight;
    }

    if (
      window.requestAnimationFrame &&
      choiceAcc.animateHeight &&
      !reducedMotion &&
      content
    ) {
      Util.setHeight(initHeight, finalHeight, content, 200, function () {
        resetContentVisibility(content, bool);
      });
    } else {
      resetContentVisibility(content, bool);
    }
  }

  function resetContentVisibility(content, bool) {
    if (!content) return;
    Util.toggleClass(content, "is-hidden", !bool);
    content.removeAttribute("style");
  }

  var choiceAccordion = document.getElementsByClassName("js-choice-accordion"),
    reducedMotion = Util.osHasReducedMotion();
  if (choiceAccordion.length > 0) {
    for (var i = 0; i < choiceAccordion.length; i++) {
      (function (i) {
        new ChoiceAccordion(choiceAccordion[i]);
      })(i);
    }
  }
})();

(function () {
  var ChoiceButton = function (element) {
    this.element = element;
    this.btns = this.element.getElementsByClassName("js-choice-btn");
    this.inputs = getChoiceInput(this);
    this.isRadio = this.inputs[0].type.toString() == "radio";
    resetCheckedStatus(this);
    initChoiceButtonEvent(this);
  };

  function getChoiceInput(element) {
    var inputs = [];
    for (var i = 0; i < element.btns.length; i++) {
      inputs.push(element.btns[i].getElementsByTagName("input")[0]);
    }
    return inputs;
  }

  function initChoiceButtonEvent(choiceBtn) {
    choiceBtn.element.addEventListener("click", function (event) {
      if (Util.getIndexInArray(choiceBtn.inputs, event.target) > -1) return;

      var selectedBtn = event.target.closest(".js-choice-btn");
      if (!selectedBtn) return;
      var index = Util.getIndexInArray(choiceBtn.btns, selectedBtn);
      if (choiceBtn.isRadio && choiceBtn.inputs[index].checked) {
        choiceBtn.inputs[index].focus();
        return;
      }

      choiceBtn.inputs[index].checked = !choiceBtn.inputs[index].checked;
      choiceBtn.inputs[index].dispatchEvent(new CustomEvent("change"));
      choiceBtn.inputs[index].focus();
    });

    for (var i = 0; i < choiceBtn.btns.length; i++) {
      (function (i) {
        choiceBtn.inputs[i].addEventListener("change", function (event) {
          choiceBtn.isRadio
            ? resetCheckedStatus(choiceBtn)
            : resetSingleStatus(choiceBtn, i);
        });

        choiceBtn.inputs[i].addEventListener("focus", function (event) {
          resetFocusStatus(choiceBtn, i, true);
        });

        choiceBtn.inputs[i].addEventListener("blur", function (event) {
          resetFocusStatus(choiceBtn, i, false);
        });
      })(i);
    }
  }

  function resetCheckedStatus(choiceBtn) {
    for (var i = 0; i < choiceBtn.btns.length; i++) {
      resetSingleStatus(choiceBtn, i);
    }
  }

  function resetSingleStatus(choiceBtn, index) {
    Util.toggleClass(
      choiceBtn.btns[index],
      "choice-btn--checked",
      choiceBtn.inputs[index].checked
    );
  }

  function resetFocusStatus(choiceBtn, index, bool) {
    Util.toggleClass(choiceBtn.btns[index], "choice-btn--focus", bool);
  }

  var choiceButton = document.getElementsByClassName("js-choice-btns");
  if (choiceButton.length > 0) {
    for (var i = 0; i < choiceButton.length; i++) {
      (function (i) {
        new ChoiceButton(choiceButton[i]);
      })(i);
    }
  }
})();

(function () {
  var ColTable = function (element) {
    this.element = element;
    this.header = this.element.getElementsByTagName("thead")[0];
    this.body = this.element.getElementsByTagName("tbody")[0];
    this.headerRows = this.header.getElementsByTagName("th");
    this.tableRows = this.body.getElementsByTagName("tr");
    this.collapsedLayoutClass = "cl-table--collapsed";
    this.mainColCellClass = "cl-table__th-inner";
    initTable(this);
  };

  function initTable(table) {
    addTableContent(table);
    setTableRoles(table);

    table.element.addEventListener("update-col-table", function (event) {
      checkTableLayour(table);
    });

    table.element.addEventListener("click", function (event) {
      revealColDetails(table, event);
    });
    table.element.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 13) ||
        (event.key && event.key.toLowerCase() == "enter")
      ) {
        revealColDetails(table, event);
      }
    });
  }

  function checkTableLayour(table) {
    var layout = getComputedStyle(table.element, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    Util.toggleClass(
      table.element,
      table.collapsedLayoutClass,
      layout != "expanded"
    );
  }

  function addTableContent(table) {
    var content = [];
    for (var i = 0; i < table.tableRows.length; i++) {
      var cells = table.tableRows[i].getElementsByClassName("cl-table__cell");
      for (var j = 1; j < cells.length; j++) {
        if (i == 0) content[j] = "";
        content[j] =
          content[j] +
          '<li class="cl-table__item"><span class="cl-table__label">' +
          cells[0].innerHTML +
          ":</span><span>" +
          cells[j].innerHTML +
          "</span></li>";
      }
    }

    for (var j = 1; j < table.headerRows.length; j++) {
      var colContent =
        '<input type="text" class="cl-table__input" aria-hidden="true"><span class="cl-table__th-inner">' +
        table.headerRows[j].innerHTML +
        '<i class="cl-table__th-icon" aria-hidden="true"></i></span><ul class="cl-table__list" aria-hidden="true">' +
        content[j] +
        "</ul>";
      table.headerRows[j].innerHTML = colContent;
      Util.addClass(table.headerRows[j], "js-" + table.mainColCellClass);
    }
  }

  function setTableRoles(table) {
    var trElements = table.header.getElementsByTagName("tr");
    for (var i = 0; i < trElements.length; i++) {
      trElements[i].setAttribute("role", "row");
    }
    var thElements = table.header.getElementsByTagName("th");
    for (var i = 0; i < thElements.length; i++) {
      thElements[i].setAttribute("role", "cell");
    }
  }

  function revealColDetails(table, event) {
    var col = event.target.closest(".js-" + table.mainColCellClass);
    if (!col || event.target.closest(".cl-table__list")) return;
    Util.toggleClass(
      col,
      "cl-table__cell--show-list",
      !Util.hasClass(col, "cl-table__cell--show-list")
    );
  }

  var colTables = document.getElementsByClassName("js-cl-table");
  if (colTables.length > 0) {
    var j = 0,
      colTablesArray = [];
    for (var i = 0; i < colTables.length; i++) {
      var beforeContent = getComputedStyle(
        colTables[i],
        ":before"
      ).getPropertyValue("content");
      if (beforeContent && beforeContent != "" && beforeContent != "none") {
        (function (i) {
          colTablesArray.push(new ColTable(colTables[i]));
        })(i);
        j = j + 1;
      }
    }

    if (j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent("update-col-table");
      window.addEventListener("resize", function (event) {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for (var i = 0; i < colTablesArray.length; i++) {
          (function (i) {
            colTablesArray[i].element.dispatchEvent(customEvent);
          })(i);
        }
      }

      window.requestAnimationFrame
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
})();

(function () {
  var ColorSwatches = function (element) {
    this.element = element;
    this.select = false;
    initCustomSelect(this);
    this.list = this.element.getElementsByClassName(
      "js-color-swatches__list"
    )[0];
    this.swatches = this.list.getElementsByClassName(
      "js-color-swatches__option"
    );
    this.labels = this.list.getElementsByClassName("js-color-swatch__label");
    this.selectedLabel = this.element.getElementsByClassName(
      "js-color-swatches__color"
    );
    this.focusOutId = false;
    initColorSwatches(this);
  };

  function initCustomSelect(element) {
    var select = element.element.getElementsByClassName(
      "js-color-swatches__select"
    );
    if (select.length == 0) return;
    element.select = select[0];
    var customContent = "";
    for (var i = 0; i < element.select.options.length; i++) {
      var ariaChecked = i == element.select.selectedIndex ? "true" : "false",
        customClass =
          i == element.select.selectedIndex
            ? " color-swatches__item--selected"
            : "",
        customAttributes = getSwatchCustomAttr(element.select.options[i]);
      customContent =
        customContent +
        '<li class="color-swatches__item js-color-swatches__item' +
        customClass +
        '" role="radio" aria-checked="' +
        ariaChecked +
        '" data-value="' +
        element.select.options[i].value +
        '"><span class="js-color-swatches__option js-tab-focus" tabindex="0"' +
        customAttributes +
        '><span class="sr-only js-color-swatch__label">' +
        element.select.options[i].text +
        '</span><span aria-hidden="true" style="' +
        element.select.options[i].getAttribute("data-style") +
        '" class="color-swatches__swatch"></span></span></li>';
    }

    var list = document.createElement("ul");
    Util.setAttributes(list, {
      class: "color-swatches__list js-color-swatches__list",
      role: "radiogroup",
    });

    list.innerHTML = customContent;
    element.element.insertBefore(list, element.select);
    Util.addClass(element.select, "is-hidden");
  }

  function initColorSwatches(element) {
    element.list.addEventListener("focusin", function (event) {
      if (element.focusOutId) clearTimeout(element.focusOutId);
      updateSelectedLabel(element, document.activeElement);
    });
    element.list.addEventListener("focusout", function (event) {
      element.focusOutId = setTimeout(function () {
        resetSelectedLabel(element);
      }, 200);
    });

    for (var i = 0; i < element.swatches.length; i++) {
      handleHoverEvents(element, i);
    }

    if (element.select) {
      element.list.addEventListener("click", function (event) {
        resetSelectedOption(element, event.target);
      });

      element.list.addEventListener("keydown", function (event) {
        if (
          (event.keyCode && event.keyCode == 32) ||
          (event.key && event.key == " ") ||
          (event.keyCode && event.keyCode == 13) ||
          (event.key && event.key.toLowerCase() == "enter")
        ) {
          resetSelectedOption(element, event.target);
        }
      });
    }
  }

  function handleHoverEvents(element, index) {
    element.swatches[index].addEventListener("mouseenter", function (event) {
      updateSelectedLabel(element, element.swatches[index]);
    });
    element.swatches[index].addEventListener("mouseleave", function (event) {
      resetSelectedLabel(element);
    });
  }

  function resetSelectedOption(element, target) {
    var option = target.closest(".js-color-swatches__item");
    if (!option) return;
    var selectedSwatch = element.list.querySelector(
      ".color-swatches__item--selected"
    );
    if (selectedSwatch) {
      Util.removeClass(selectedSwatch, "color-swatches__item--selected");
      selectedSwatch.setAttribute("aria-checked", "false");
    }
    Util.addClass(option, "color-swatches__item--selected");
    option.setAttribute("aria-checked", "true");

    updateNativeSelect(element.select, option.getAttribute("data-value"));
  }

  function resetSelectedLabel(element) {
    var selectedSwatch = element.list.getElementsByClassName(
      "color-swatches__item--selected"
    );
    if (selectedSwatch.length > 0)
      updateSelectedLabel(element, selectedSwatch[0]);
  }

  function updateSelectedLabel(element, swatch) {
    var newLabel = swatch.getElementsByClassName("js-color-swatch__label");
    if (newLabel.length == 0) return;
    element.selectedLabel[0].textContent = newLabel[0].textContent;
  }

  function updateNativeSelect(select, value) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value == value) {
        select.selectedIndex = i;
        select.dispatchEvent(new CustomEvent("change"));
        break;
      }
    }
  }

  function getSwatchCustomAttr(swatch) {
    var customAttrArray = swatch.getAttribute("data-custom-attr");
    if (!customAttrArray) return "";
    var customAttr = " ",
      list = customAttrArray.split(",");
    for (var i = 0; i < list.length; i++) {
      var attr = list[i].split(":");
      customAttr = customAttr + attr[0].trim() + '="' + attr[1].trim() + '" ';
    }
    return customAttr;
  }

  var swatches = document.getElementsByClassName("js-color-swatches");
  if (swatches.length > 0) {
    for (var i = 0; i < swatches.length; i++) {
      new ColorSwatches(swatches[i]);
    }
  }
})();

(function () {
  var CountDown = function (element) {
    this.element = element;
    this.labels = this.element.getAttribute("data-labels")
      ? this.element.getAttribute("data-labels").split(",")
      : [];
    this.intervalId;

    this.createCountDown();

    this.days = this.element.getElementsByClassName(
      "js-countdown__value--0"
    )[0];
    this.hours = this.element.getElementsByClassName(
      "js-countdown__value--1"
    )[0];
    this.mins = this.element.getElementsByClassName(
      "js-countdown__value--2"
    )[0];
    this.secs = this.element.getElementsByClassName(
      "js-countdown__value--3"
    )[0];
    this.endTime = this.getEndTime();

    this.initCountDown();
  };

  CountDown.prototype.createCountDown = function () {
    var wrapper = document.createElement("div");
    Util.setAttributes(wrapper, {
      "aria-hidden": "true",
      class: "countdown__timer",
    });

    for (var i = 0; i < 4; i++) {
      var timeItem = document.createElement("span"),
        timeValue = document.createElement("span"),
        timeLabel = document.createElement("span");

      timeItem.setAttribute("class", "countdown__item");
      timeValue.setAttribute(
        "class",
        "countdown__value countdown__value--" + i + " js-countdown__value--" + i
      );
      timeItem.appendChild(timeValue);

      if (this.labels && this.labels.length > 0) {
        timeLabel.textContent = this.labels[i].trim();
        timeLabel.setAttribute("class", "countdown__label");
        timeItem.appendChild(timeLabel);
      }

      wrapper.appendChild(timeItem);
    }

    this.element.insertBefore(wrapper, this.element.firstChild);
  };

  CountDown.prototype.getEndTime = function () {
    if (this.element.getAttribute("data-timer"))
      return (
        Number(this.element.getAttribute("data-timer")) * 1000 +
        new Date().getTime()
      );
    else if (this.element.getAttribute("data-countdown"))
      return Number(
        new Date(this.element.getAttribute("data-countdown")).getTime()
      );
  };

  CountDown.prototype.initCountDown = function () {
    var self = this;
    this.intervalId = setInterval(function () {
      self.updateCountDown(false);
    }, 1000);
    this.updateCountDown(true);
  };

  CountDown.prototype.updateCountDown = function (bool) {
    var time = parseInt((this.endTime - new Date().getTime()) / 1000),
      days = 0,
      hours = 0,
      mins = 0,
      seconds = 0;

    if (isNaN(time) || time < 0) {
      clearInterval(this.intervalId);
      this.emitEndEvent();
    } else {
      days = parseInt(time / 86400);
      time = time % 86400;
      hours = parseInt(time / 3600);
      time = time % 3600;
      mins = parseInt(time / 60);
      time = time % 60;
      seconds = parseInt(time);
    }

    if (bool && days == 0) this.days.parentElement.style.display = "none";
    if (bool && days == 0 && hours == 0)
      this.hours.parentElement.style.display = "none";
    if (bool && days == 0 && hours == 0 && mins == 0)
      this.mins.parentElement.style.display = "none";

    this.days.textContent = days;
    this.hours.textContent = this.getTimeFormat(hours);
    this.mins.textContent = this.getTimeFormat(mins);
    this.secs.textContent = this.getTimeFormat(seconds);
  };

  CountDown.prototype.getTimeFormat = function (time) {
    return ("0" + time).slice(-2);
  };

  CountDown.prototype.emitEndEvent = function (time) {
    var event = new CustomEvent("countDownFinished");
    this.element.dispatchEvent(event);
  };

  var countDown = document.getElementsByClassName("js-countdown");
  if (countDown.length > 0) {
    for (var i = 0; i < countDown.length; i++) {
      (function (i) {
        new CountDown(countDown[i]);
      })(i);
    }
  }
})();

(function () {
  var CustomSelect = function (element) {
    this.element = element;
    this.select = this.element.getElementsByTagName("select")[0];
    this.optGroups = this.select.getElementsByTagName("optgroup");
    this.options = this.select.getElementsByTagName("option");
    this.selectedOption = getSelectedOptionText(this);
    this.selectId = this.select.getAttribute("id");
    this.trigger = false;
    this.dropdown = false;
    this.customOptions = false;
    this.arrowIcon = this.element.getElementsByTagName("svg");
    this.label = document.querySelector('[for="' + this.selectId + '"]');

    this.optionIndex = 0;

    initCustomSelect(this);
    initCustomSelectEvents(this);
  };

  function initCustomSelect(select) {
    select.element.insertAdjacentHTML(
      "beforeend",
      initButtonSelect(select) + initListSelect(select)
    );

    select.dropdown = select.element.getElementsByClassName(
      "js-select__dropdown"
    )[0];
    select.trigger =
      select.element.getElementsByClassName("js-select__button")[0];
    select.customOptions =
      select.dropdown.getElementsByClassName("js-select__item");

    Util.addClass(select.select, "is-hidden");
    if (select.arrowIcon.length > 0) select.arrowIcon[0].style.display = "none";

    placeDropdown(select);
  }

  function initCustomSelectEvents(select) {
    initSelection(select);

    select.trigger.addEventListener("click", function () {
      toggleCustomSelect(select, false);
    });
    if (select.label) {
      select.label.addEventListener("click", function () {
        Util.moveFocus(select.trigger);
      });
    }

    select.dropdown.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 38) ||
        (event.key && event.key.toLowerCase() == "arrowup")
      ) {
        keyboardCustomSelect(select, "prev", event);
      } else if (
        (event.keyCode && event.keyCode == 40) ||
        (event.key && event.key.toLowerCase() == "arrowdown")
      ) {
        keyboardCustomSelect(select, "next", event);
      }
    });

    select.element.addEventListener("select-updated", function (event) {
      resetCustomSelect(select);
    });
  }

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
    if (bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded =
        select.trigger.getAttribute("aria-expanded") == "true"
          ? "false"
          : "true";
    }
    select.trigger.setAttribute("aria-expanded", ariaExpanded);
    if (ariaExpanded == "true") {
      var selectedOption = getSelectedOption(select);
      Util.moveFocus(selectedOption);
      select.dropdown.addEventListener("transitionend", function cb() {
        Util.moveFocus(selectedOption);
        select.dropdown.removeEventListener("transitionend", cb);
      });
      placeDropdown(select);
    }
  }

  function placeDropdown(select) {
    Util.removeClass(
      select.dropdown,
      "select__dropdown--right select__dropdown--up"
    );
    var triggerBoundingRect = select.trigger.getBoundingClientRect();
    Util.toggleClass(
      select.dropdown,
      "select__dropdown--right",
      document.documentElement.clientWidth - 5 <
        triggerBoundingRect.left + select.dropdown.offsetWidth
    );

    var moveUp =
      window.innerHeight - triggerBoundingRect.bottom - 5 <
      triggerBoundingRect.top;
    Util.toggleClass(select.dropdown, "select__dropdown--up", moveUp);

    var maxHeight = moveUp
      ? triggerBoundingRect.top - 20
      : window.innerHeight - triggerBoundingRect.bottom - 20;

    select.dropdown.setAttribute(
      "style",
      "max-height: " +
        maxHeight +
        "px; width: " +
        triggerBoundingRect.width +
        "px;"
    );
  }

  function keyboardCustomSelect(select, direction, event) {
    event.preventDefault();
    var index = Util.getIndexInArray(
      select.customOptions,
      document.activeElement
    );
    index = direction == "next" ? index + 1 : index - 1;
    if (index < 0) index = select.customOptions.length - 1;
    if (index >= select.customOptions.length) index = 0;
    Util.moveFocus(select.customOptions[index]);
  }

  function initSelection(select) {
    select.dropdown.addEventListener("click", function (event) {
      var option = event.target.closest(".js-select__item");
      if (!option) return;
      selectOption(select, option);
    });
  }

  function selectOption(select, option) {
    if (
      option.hasAttribute("aria-selected") &&
      option.getAttribute("aria-selected") == "true"
    ) {
      select.trigger.setAttribute("aria-expanded", "false");
    } else {
      var selectedOption = select.dropdown.querySelector(
        '[aria-selected="true"]'
      );
      if (selectedOption) selectedOption.setAttribute("aria-selected", "false");
      option.setAttribute("aria-selected", "true");
      select.trigger.getElementsByClassName("js-select__label")[0].textContent =
        option.textContent;
      select.trigger.setAttribute("aria-expanded", "false");

      updateNativeSelect(select, option.getAttribute("data-index"));
      updateTriggerAria(select);
    }

    select.trigger.focus();
  }

  function updateNativeSelect(select, index) {
    select.select.selectedIndex = index;
    select.select.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  }

  function updateTriggerAria(select) {
    select.trigger.setAttribute(
      "aria-label",
      select.options[select.select.selectedIndex].innerHTML +
        ", " +
        select.label.textContent
    );
  }

  function getSelectedOptionText(select) {
    var label = "";
    if ("selectedIndex" in select.select) {
      label = select.options[select.select.selectedIndex].text;
    } else {
      label = select.select.querySelector("option[selected]").text;
    }
    return label;
  }

  function initButtonSelect(select) {
    var customClasses = select.element.getAttribute("data-trigger-class")
      ? " " + select.element.getAttribute("data-trigger-class")
      : "";

    var label =
      select.options[select.select.selectedIndex].innerHTML +
      ", " +
      select.label.textContent;

    var button =
      '<button type="button" class="js-select__button select__button' +
      customClasses +
      '" aria-label="' +
      label +
      '" aria-expanded="false" aria-controls="' +
      select.selectId +
      '-dropdown"><span aria-hidden="true" class="js-select__label select__label">' +
      select.selectedOption +
      "</span>";
    if (select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
      var clone = select.arrowIcon[0].cloneNode(true);
      Util.removeClass(clone, "select__icon");
      button = button + clone.outerHTML;
    }

    return button + "</button>";
  }

  function initListSelect(select) {
    var list =
      '<div class="js-select__dropdown select__dropdown" aria-describedby="' +
      select.selectId +
      '-description" id="' +
      select.selectId +
      '-dropdown">';
    list = list + getSelectLabelSR(select);
    if (select.optGroups.length > 0) {
      for (var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName("option"),
          optGroupLabel =
            '<li><span class="select__item select__item--optgroup">' +
            select.optGroups[i].getAttribute("label") +
            "</span></li>";
        list =
          list +
          '<ul class="select__list" role="listbox">' +
          optGroupLabel +
          getOptionsList(select, optGroupList) +
          "</ul>";
      }
    } else {
      list =
        list +
        '<ul class="select__list" role="listbox">' +
        getOptionsList(select, select.options) +
        "</ul>";
    }
    return list;
  }

  function getSelectLabelSR(select) {
    if (select.label) {
      return (
        '<p class="sr-only" id="' +
        select.selectId +
        '-description">' +
        select.label.textContent +
        "</p>"
      );
    } else {
      return "";
    }
  }

  function resetCustomSelect(select) {
    var selectedOption = select.dropdown.querySelector(
      '[aria-selected="true"]'
    );
    if (selectedOption) selectedOption.setAttribute("aria-selected", "false");
    var option = select.dropdown.querySelector(
      '.js-select__item[data-index="' + select.select.selectedIndex + '"]'
    );
    option.setAttribute("aria-selected", "true");
    select.trigger.getElementsByClassName("js-select__label")[0].textContent =
      option.textContent;
    select.trigger.setAttribute("aria-expanded", "false");
    updateTriggerAria(select);
  }

  function getOptionsList(select, options) {
    var list = "";
    for (var i = 0; i < options.length; i++) {
      var selected = options[i].hasAttribute("selected")
        ? ' aria-selected="true"'
        : ' aria-selected="false"';
      list =
        list +
        '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="' +
        options[i].value +
        '" ' +
        selected +
        ' data-index="' +
        select.optionIndex +
        '">' +
        options[i].text +
        "</button></li>";
      select.optionIndex = select.optionIndex + 1;
    }
    return list;
  }

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if (option) return option;
    else return select.dropdown.getElementsByClassName("js-select__item")[0];
  }

  function moveFocusToSelectTrigger(select) {
    if (!document.activeElement.closest(".js-select")) return;
    select.trigger.focus();
  }

  function checkCustomSelectClick(select, target) {
    if (!select.element.contains(target)) toggleCustomSelect(select, "false");
  }

  var customSelect = document.getElementsByClassName("js-select");
  if (customSelect.length > 0) {
    var selectArray = [];
    for (var i = 0; i < customSelect.length; i++) {
      (function (i) {
        selectArray.push(new CustomSelect(customSelect[i]));
      })(i);
    }

    window.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        selectArray.forEach(function (element) {
          moveFocusToSelectTrigger(element);
          toggleCustomSelect(element, "false");
        });
      }
    });

    window.addEventListener("click", function (event) {
      selectArray.forEach(function (element) {
        checkCustomSelectClick(element, event.target);
      });
    });
  }
})();

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

(function () {
  var menuAim = function (opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend(
        {
          menu: "",
          rows: false,
          submenuSelector: "*",
          submenuDirection: "right",
          tolerance: 75,
          enter: function () {},
          exit: function () {},
          activate: function () {},
          deactivate: function () {},
          exitMenu: function () {},
        },
        opts
      ),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,
      DELAY = 300;

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function (e) {
      mouseLocs.push({ x: e.pageX, y: e.pageY });

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function () {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        options.enter(this);
        possiblyActivate(this);
      },
      mouseleaveRow = function () {
        options.exit(this);
      };

    var clickRow = function () {
      activate(this);
    };

    /**
     * Activate a menu row.
     */
    var activate = function (row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function (row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function () {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function () {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset,
        };
      }

      var offset = getOffset(menu),
        upperLeft = {
          x: offset.left,
          y: offset.top - options.tolerance,
        },
        upperRight = {
          x: offset.left + menu.offsetWidth,
          y: upperLeft.y,
        },
        lowerLeft = {
          x: offset.left,
          y: offset.top + menu.offsetHeight + options.tolerance,
        },
        lowerRight = {
          x: offset.left + menu.offsetWidth,
          y: lowerLeft.y,
        },
        loc = mouseLocs[mouseLocs.length - 1],
        prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (
        prevLoc.x < offset.left ||
        prevLoc.x > lowerRight.x ||
        prevLoc.y < offset.top ||
        prevLoc.y > lowerRight.y
      ) {
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        return 0;
      }

      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      }

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (
        decreasingSlope < prevDecreasingSlope &&
        increasingSlope > prevIncreasingSlope
      ) {
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener("mouseleave", mouseleaveMenu);
    var rows = options.rows ? options.rows : menu.children;
    if (rows.length > 0) {
      for (var i = 0; i < rows.length; i++) {
        (function (i) {
          rows[i].addEventListener("mouseenter", mouseenterRow);
          rows[i].addEventListener("mouseleave", mouseleaveRow);
          rows[i].addEventListener("click", clickRow);
        })(i);
      }
    }

    document.addEventListener("mousemove", function (event) {
      !window.requestAnimationFrame
        ? mousemoveDocument(event)
        : window.requestAnimationFrame(function () {
            mousemoveDocument(event);
          });
    });
  }
})();

function initGoogleMap() {
  var contactMap = document.getElementsByClassName("js-google-maps");
  if (contactMap.length > 0) {
    for (var i = 0; i < contactMap.length; i++) {
      initContactMap(contactMap[i]);
    }
  }
}

function initContactMap(wrapper) {
  var coordinate = wrapper.getAttribute("data-coordinates").split(",");
  var map = new google.maps.Map(wrapper, {
    zoom: 10,
    center: { lat: Number(coordinate[0]), lng: Number(coordinate[1]) },
  });
  var marker = new google.maps.Marker({
    position: { lat: Number(coordinate[0]), lng: Number(coordinate[1]) },
    map: map,
  });
}

(function () {
  var ImageMagnifier = function (element) {
    this.element = element;
    this.asset = this.element.getElementsByClassName("js-img-mag__asset")[0];
    this.ready = false;
    this.scale = 1;
    this.intervalId = false;
    this.moving = false;
    this.moveEvent = false;
    initImageMagnifier(this);
  };

  function initImageMagnifier(imgMag) {
    imgMag.asset.addEventListener("load", function () {
      initImageMagnifierMove(imgMag);
    });
    if (imgMag.asset.complete) {
      initImageMagnifierMove(imgMag);
    }
  }

  function initImageMagnifierMove(imgMag) {
    if (imgMag.ready) return;
    imgMag.ready = true;
    initImageMagnifierScale(imgMag);

    imgMag.element.addEventListener("mouseenter", handleEvent.bind(imgMag));
  }

  function initImageMagnifierScale(imgMag) {
    var customScale = imgMag.element.getAttribute("data-scale");
    if (customScale) {
      imgMag.scale = customScale;
    } else {
      imgMag.scale = imgMag.asset.naturalWidth / imgMag.element.offsetWidth;

      imgMag.scale = Math.floor(imgMag.scale * 100) / 100;
      if (imgMag.scale > 1.2) imgMag.scale = imgMag.scale - 0.2;
    }
  }

  function initImageMove(imgMag) {
    imgMag.moveEvent = handleEvent.bind(imgMag);
    imgMag.element.addEventListener("mousemove", imgMag.moveEvent);
    imgMag.element.addEventListener("mouseleave", imgMag.moveEvent);
  }

  function cancelImageMove(imgMag) {
    if (imgMag.intervalId) {
      !window.requestAnimationFrame
        ? clearInterval(imgMag.intervalId)
        : window.cancelAnimationFrame(imgMag.intervalId);
      imgMag.intervalId = false;
    }
    if (imgMag.moveEvent) {
      imgMag.element.removeEventListener("mousemove", imgMag.moveEvent);
      imgMag.element.removeEventListener("mouseleave", imgMag.moveEvent);
      imgMag.moveEvent = false;
    }
  }

  function handleEvent(event) {
    switch (event.type) {
      case "mouseenter":
        startMove(this, event);
        break;
      case "mousemove":
        move(this, event);
        break;
      case "mouseleave":
        endMove(this);
        break;
    }
  }

  function startMove(imgMag, event) {
    imgMag.moving = true;
    initImageMove(imgMag);
    zoomImageMagnifier(imgMag, event);
  }

  function move(imgMag, event) {
    if (!imgMag.moving || imgMag.intervalId) return;
    !window.requestAnimationFrame
      ? (imgMag.intervalId = setTimeout(function () {
          zoomImageMagnifier(imgMag, event);
        }, 250))
      : (imgMag.intervalId = window.requestAnimationFrame(function () {
          zoomImageMagnifier(imgMag, event);
        }));
  }

  function endMove(imgMag) {
    imgMag.moving = false;
    cancelImageMove(imgMag);
    imgMag.asset.removeAttribute("style");
  }

  function zoomImageMagnifier(imgMag, event) {
    var elementRect = imgMag.element.getBoundingClientRect();
    var translateX = elementRect.left - event.clientX;
    var translateY = elementRect.top - event.clientY;
    if (translateX > 0) translateX = 0;
    if (translateX < -1 * elementRect.width)
      translateX = -1 * elementRect.width;
    if (translateY > 0) translateY = 0;
    if (translateY < -1 * elementRect.height)
      translateX = -1 * elementRect.height;
    var transform =
      "translateX(" +
      translateX * (imgMag.scale - 1) +
      "px) translateY(" +
      translateY * (imgMag.scale - 1) +
      "px) scale(" +
      imgMag.scale +
      ")";
    imgMag.asset.setAttribute("style", "transform: " + transform + ";");
    imgMag.intervalId = false;
  }

  var imageMag = document.getElementsByClassName("js-img-mag");
  if (imageMag.length > 0) {
    for (var i = 0; i < imageMag.length; i++) {
      new ImageMagnifier(imageMag[i]);
    }
  }
})();

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

(function () {
  var InputNumber = function (element) {
    this.element = element;
    this.input = this.element.getElementsByClassName(
      "js-number-input__value"
    )[0];
    this.min = parseFloat(this.input.getAttribute("min"));
    this.max = parseFloat(this.input.getAttribute("max"));
    this.step = parseFloat(this.input.getAttribute("step"));
    if (isNaN(this.step)) this.step = 1;
    this.precision = getStepPrecision(this.step);
    initInputNumberEvents(this);
  };

  function initInputNumberEvents(input) {
    input.element.addEventListener("click", function (event) {
      var increment = event.target.closest(".js-number-input__btn");
      if (increment) {
        event.preventDefault();
        updateInputNumber(input, increment);
      }
    });

    input.input.addEventListener("focusout", function (event) {
      var value = parseFloat(input.input.value);
      if (value < input.min) value = input.min;
      if (value > input.max) value = input.max;

      value = checkIsMultipleStep(input, value);
      if (value != parseFloat(input.input.value)) input.input.value = value;
    });
  }

  function getStepPrecision(step) {
    return step.toString().length - Math.floor(step).toString().length - 1;
  }

  function updateInputNumber(input, btn) {
    var value = Util.hasClass(btn, "number-input__btn--plus")
      ? parseFloat(input.input.value) + input.step
      : parseFloat(input.input.value) - input.step;
    if (input.precision > 0) value = value.toFixed(input.precision);
    if (value < input.min) value = input.min;
    if (value > input.max) value = input.max;
    input.input.value = value;
    input.input.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  }

  function checkIsMultipleStep(input, value) {
    var remain =
      (value * 10 * input.precision) % (input.step * 10 * input.precision);
    if (remain != 0) value = value - remain;
    if (input.precision > 0) value = value.toFixed(input.precision);
    return value;
  }

  var inputNumbers = document.getElementsByClassName("js-number-input");
  if (inputNumbers.length > 0) {
    for (var i = 0; i < inputNumbers.length; i++) {
      (function (i) {
        new InputNumber(inputNumbers[i]);
      })(i);
    }
  }
})();

(function () {
  var OverscrollSection = function (element) {
    this.element = element;
    this.stickyContent = this.element.getElementsByClassName(
      "js-overscroll-section__sticky-content"
    );
    this.scrollContent = this.element.getElementsByClassName(
      "js-overscroll-section__scroll-content"
    );
    this.scrollingFn = false;
    this.scrolling = false;
    this.resetOpacity = false;
    this.disabledClass = "overscroll-section--disabled";
    initOverscrollSection(this);
  };

  function initOverscrollSection(element) {
    setTop(element);

    createPrevElement(element);

    element.element.addEventListener("update-overscroll-section", function () {
      setTop(element);
      setPrevElementTop(element);
    });

    animateOverscrollSection.bind(element)();

    var observer = new IntersectionObserver(
      overscrollSectionCallback.bind(element)
    );
    observer.observe(element.prevElement);
  }

  function createPrevElement(element) {
    if (element.scrollContent.length == 0) return;
    var newElement = document.createElement("div");
    newElement.setAttribute("aria-hidden", "true");
    element.element.insertBefore(newElement, element.scrollContent[0]);
    element.prevElement = element.scrollContent[0].previousElementSibling;
    element.prevElement.style.opacity = "0";
    setPrevElementTop(element);
  }

  function setPrevElementTop(element) {
    element.prevElementTop =
      element.prevElement.getBoundingClientRect().top + window.scrollY;
  }

  function overscrollSectionCallback(entries) {
    if (entries[0].isIntersecting) {
      if (this.scrollingFn) return;
      overscrollSectionInitEvent(this);
    } else {
      if (!this.scrollingFn) return;
      window.removeEventListener("scroll", this.scrollingFn);
      updateOpacityValue(this, 0);
      this.scrollingFn = false;
    }
  }

  function overscrollSectionInitEvent(element) {
    element.scrollingFn = overscrollSectionScrolling.bind(element);
    window.addEventListener("scroll", element.scrollingFn);
  }

  function overscrollSectionScrolling() {
    if (this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(animateOverscrollSection.bind(this));
  }

  function animateOverscrollSection() {
    if (this.stickyContent.length == 0) return;
    setPrevElementTop(this);
    if (
      parseInt(this.stickyContent[0].style.top) !=
      window.innerHeight - this.stickyContent[0].offsetHeight
    ) {
      setTop(this);
    }
    if (this.prevElementTop - window.scrollY < (window.innerHeight * 2) / 3) {
      var opacity = Math.easeOutQuart(
        (window.innerHeight * 2) / 3 + window.scrollY - this.prevElementTop,
        0,
        1,
        (window.innerHeight * 2) / 3
      );
      if (opacity > 0) {
        this.resetOpacity = false;
        updateOpacityValue(this, opacity);
      } else if (!this.resetOpacity) {
        this.resetOpacity = true;
        updateOpacityValue(this, 0);
      }
    } else {
      updateOpacityValue(this, 0);
    }
    this.scrolling = false;
  }

  function updateOpacityValue(element, value) {
    element.element.style.setProperty("--overscroll-section-opacity", value);
  }

  function setTop(element) {
    if (element.stickyContent.length == 0) return;
    var translateValue =
      window.innerHeight - element.stickyContent[0].offsetHeight;
    element.stickyContent[0].style.top = translateValue + "px";

    Util.toggleClass(
      element.element,
      element.disabledClass,
      translateValue > 2
    );
  }

  var overscrollSections = document.getElementsByClassName(
    "js-overscroll-section"
  );
  var stickySupported =
      Util.cssSupports("position", "sticky") ||
      Util.cssSupports("position", "-webkit-sticky"),
    intObservSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype,
    reducedMotion = Util.osHasReducedMotion();
  if (
    overscrollSections.length > 0 &&
    stickySupported &&
    !reducedMotion &&
    intObservSupported
  ) {
    var overscrollSectionsArray = [];
    for (var i = 0; i < overscrollSections.length; i++) {
      (function (i) {
        overscrollSectionsArray.push(
          new OverscrollSection(overscrollSections[i])
        );
      })(i);
    }

    var resizingId = false,
      customEvent = new CustomEvent("update-overscroll-section");

    window.addEventListener("resize", function () {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    document.fonts.onloadingdone = function (fontFaceSetEvent) {
      doneResizing();
    };

    function doneResizing() {
      for (var i = 0; i < overscrollSectionsArray.length; i++) {
        (function (i) {
          overscrollSectionsArray[i].element.dispatchEvent(customEvent);
        })(i);
      }
    }
  }
})();

(function () {
  var preHeader = document.getElementsByClassName("js-pre-header");
  if (preHeader.length > 0) {
    for (var i = 0; i < preHeader.length; i++) {
      (function (i) {
        addPreHeaderEvent(preHeader[i]);
      })(i);
    }

    function addPreHeaderEvent(element) {
      var close = element.getElementsByClassName("js-pre-header__close-btn")[0];
      if (close) {
        close.addEventListener("click", function (event) {
          event.preventDefault();
          Util.addClass(element, "pre-header--is-hidden");
        });
      }
    }
  }
})();

(function () {
  var Rating = function (element) {
    this.element = element;
    this.icons = this.element.getElementsByClassName("js-rating__control")[0];
    this.iconCode = this.icons.children[0].parentNode.innerHTML;
    this.initialRating = [];
    this.initialRatingElement =
      this.element.getElementsByClassName("js-rating__value")[0];
    this.ratingItems;
    this.selectedRatingItem;
    this.readOnly = Util.hasClass(this.element, "js-rating--read-only");
    this.ratingMaxValue = 5;
    this.getInitialRating();
    this.initRatingHtml();
  };

  Rating.prototype.getInitialRating = function () {
    if (!this.initialRatingElement || !this.readOnly) {
      this.initialRating = [0, false];
      return;
    }

    var initialValue = Number(this.initialRatingElement.textContent);
    if (isNaN(initialValue)) {
      this.initialRating = [0, false];
      return;
    }

    var floorNumber = Math.floor(initialValue);
    this.initialRating[0] =
      floorNumber < initialValue ? floorNumber + 1 : floorNumber;
    this.initialRating[1] =
      floorNumber < initialValue
        ? Math.round((initialValue - floorNumber) * 100)
        : false;
  };

  Rating.prototype.initRatingHtml = function () {
    var iconsList = this.readOnly ? "<ul>" : '<ul role="radiogroup">';

    if (this.initialRating[0] == 0 && !this.initialRating[1]) {
      iconsList =
        iconsList +
        '<li class="rating__item--zero rating__item--checked"></li>';
    }

    for (var i = 0; i < this.ratingMaxValue; i++) {
      iconsList = iconsList + this.getStarHtml(i);
    }
    iconsList = iconsList + "</ul>";

    if (!this.readOnly) {
      var labelElement = this.element.getElementsByTagName("label");
      if (labelElement.length > 0) {
        var legendElement =
          '<legend class="' +
          labelElement[0].getAttribute("class") +
          '">' +
          labelElement[0].textContent +
          "</legend>";
        iconsList = "<fieldset>" + legendElement + iconsList + "</fieldset>";
        Util.addClass(labelElement[0], "is-hidden");
      }
    }

    this.icons.innerHTML = iconsList;

    this.ratingItems = this.icons.getElementsByClassName("js-rating__item");
    this.selectedRatingItem = this.icons.getElementsByClassName(
      "rating__item--checked"
    )[0];

    Util.removeClass(this.icons, "rating__control--is-hidden");

    !this.readOnly && this.initRatingEvents();
  };

  Rating.prototype.getStarHtml = function (index) {
    var listItem = "";
    var checked = index + 1 == this.initialRating[0] ? true : false,
      itemClass = checked ? " rating__item--checked" : "",
      tabIndex =
        checked ||
        (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0)
          ? 0
          : -1,
      showHalf = checked && this.initialRating[1] ? true : false,
      iconWidth = showHalf ? " rating__item--half" : "";
    if (!this.readOnly) {
      listItem =
        '<li class="js-rating__item' +
        itemClass +
        iconWidth +
        '" role="radio" aria-label="' +
        (index + 1) +
        '" aria-checked="' +
        checked +
        '" tabindex="' +
        tabIndex +
        '"><div class="rating__icon">' +
        this.iconCode +
        "</div></li>";
    } else {
      var starInner = showHalf
        ? '<div class="rating__icon">' +
          this.iconCode +
          '</div><div class="rating__icon rating__icon--inactive">' +
          this.iconCode +
          "</div>"
        : '<div class="rating__icon">' + this.iconCode + "</div>";
      listItem =
        '<li class="js-rating__item' +
        itemClass +
        iconWidth +
        '">' +
        starInner +
        "</li>";
    }
    return listItem;
  };

  Rating.prototype.initRatingEvents = function () {
    var self = this;

    this.icons.addEventListener("click", function (event) {
      var trigger = event.target.closest(".js-rating__item");
      self.resetSelectedIcon(trigger);
    });

    this.icons.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && (event.keyCode == 39 || event.keyCode == 40)) ||
        (event.key &&
          (event.key.toLowerCase() == "arrowright" ||
            event.key.toLowerCase() == "arrowdown"))
      ) {
        self.selectNewIcon("next");
      } else if (
        (event.keyCode && (event.keyCode == 37 || event.keyCode == 38)) ||
        (event.key &&
          (event.key.toLowerCase() == "arrowleft" ||
            event.key.toLowerCase() == "arrowup"))
      ) {
        self.selectNewIcon("prev");
      } else if (
        (event.keyCode && event.keyCode == 32) ||
        (event.key && event.key == " ")
      ) {
        self.selectFocusIcon();
      }
    });
  };

  Rating.prototype.selectNewIcon = function (direction) {
    var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
    index = direction == "next" ? index + 1 : index - 1;
    if (index < 0) index = this.ratingItems.length - 1;
    if (index >= this.ratingItems.length) index = 0;
    this.resetSelectedIcon(this.ratingItems[index]);
    this.ratingItems[index].focus();
  };

  Rating.prototype.selectFocusIcon = function (direction) {
    this.resetSelectedIcon(document.activeElement);
  };

  Rating.prototype.resetSelectedIcon = function (trigger) {
    if (!trigger) return;
    Util.removeClass(this.selectedRatingItem, "rating__item--checked");
    Util.setAttributes(this.selectedRatingItem, {
      "aria-checked": false,
      tabindex: -1,
    });
    Util.addClass(trigger, "rating__item--checked");
    Util.setAttributes(trigger, { "aria-checked": true, tabindex: 0 });
    this.selectedRatingItem = trigger;

    var select = this.element.getElementsByTagName("select");
    if (select.length > 0) {
      select[0].value = trigger.getAttribute("aria-label");
    }
  };

  var ratings = document.getElementsByClassName("js-rating");
  if (ratings.length > 0) {
    for (var i = 0; i < ratings.length; i++) {
      (function (i) {
        new Rating(ratings[i]);
      })(i);
    }
  }
})();

(function () {
  var ReadMore = function (element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName(
      "js-read-more__content"
    );
    this.count = this.element.getAttribute("data-characters") || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute("data-btn-class");
    this.ellipsis =
      this.element.getAttribute("data-ellipsis") &&
      this.element.getAttribute("data-ellipsis") == "off"
        ? false
        : true;
    this.btnShowLabel = "Read more";
    this.btnHideLabel = "Read less";
    this.toggleOff =
      this.element.getAttribute("data-toggle") &&
      this.element.getAttribute("data-toggle") == "off"
        ? false
        : true;
    if (this.moreContent.length == 0) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) {
    splitChildren(readMore.element, readMore);
  }

  function splitChildren(parent, readMore) {
    if (readMore.counting >= readMore.count) {
      Util.addClass(parent, "js-read-more__content");
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = "";
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  }

  function wrapText(element, readMore) {
    var content = element.textContent;
    if (content.replace(/\s/g, "").length == 0) return "";
    if (readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + "</span>";
    }
    if (readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(
      0,
      Math.min(firstContent.length, firstContent.lastIndexOf(" "))
    );
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return (
      firstContent +
      '<span class="js-read-more__content">' +
      secondContent +
      "</span>"
    );
  }

  function setBtnLabels(readMore) {
    var btnLabels = readMore.element.getAttribute("data-btn-labels");
    if (btnLabels) {
      var labelsArray = btnLabels.split(",");
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  }

  function initReadMore(readMore) {
    readMore.moreContent = readMore.element.getElementsByClassName(
      "js-read-more__content"
    );
    if (readMore.moreContent.length == 0) {
      Util.addClass(readMore.element, "read-more--loaded");
      return;
    }
    var btnShow =
      ' <button class="js-read-more__btn ' +
      readMore.btnClasses +
      '">' +
      readMore.btnShowLabel +
      "</button>";
    var btnHide =
      ' <button class="js-read-more__btn is-hidden ' +
      readMore.btnClasses +
      '">' +
      readMore.btnHideLabel +
      "</button>";
    if (readMore.ellipsis) {
      btnShow =
        '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>' +
        btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML(
      "afterend",
      btnHide
    );
    readMore.moreContent[0].insertAdjacentHTML("afterend", btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  }

  function resetAppearance(readMore) {
    for (var i = 0; i < readMore.moreContent.length; i++)
      Util.addClass(readMore.moreContent[i], "is-hidden");
    Util.addClass(readMore.element, "read-more--loaded");
  }

  function initEvents(readMore) {
    readMore.btnToggle =
      readMore.element.getElementsByClassName("js-read-more__btn");
    readMore.ellipsis = readMore.element.getElementsByClassName(
      "js-read-more__ellipsis"
    );

    readMore.btnToggle[0].addEventListener("click", function (event) {
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener("click", function (event) {
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  }

  function updateVisibility(readMore, visibile) {
    for (var i = 0; i < readMore.moreContent.length; i++)
      Util.toggleClass(readMore.moreContent[i], "is-hidden", !visibile);

    Util.toggleClass(readMore.btnToggle[0], "is-hidden", visibile);
    Util.toggleClass(readMore.btnToggle[1], "is-hidden", !visibile);
    if (readMore.ellipsis.length > 0)
      Util.toggleClass(readMore.ellipsis[0], "is-hidden", visibile);
    if (!readMore.toggleOff) Util.addClass(readMore.btn, "is-hidden");

    if (visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute("tabindex");
      Util.moveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      Util.moveFocus(readMore.btnToggle[0]);
    }
  }

  function resetFocusTarget(target, tabindex) {
    if (parseInt(target.getAttribute("tabindex")) < 0) {
      target.style.outline = "none";
      !tabindex && target.removeAttribute("tabindex");
    }
  }

  var readMore = document.getElementsByClassName("js-read-more");
  if (readMore.length > 0) {
    for (var i = 0; i < readMore.length; i++) {
      (function (i) {
        new ReadMore(readMore[i]);
      })(i);
    }
  }
})();

(function () {
  var Sidebar = function (element) {
    this.element = element;
    this.triggers = document.querySelectorAll(
      '[aria-controls="' + this.element.getAttribute("id") + '"]'
    );
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.layout = false;
    getCustomStaticClass(this);
    initSidebar(this);
  };

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute("data-static-class");
    if (customClasses) element.customStaticClass = " " + customClasses;
  }

  function initSidebar(sidebar) {
    initSidebarResize(sidebar);

    if (sidebar.triggers) {
      for (var i = 0; i < sidebar.triggers.length; i++) {
        sidebar.triggers[i].addEventListener("click", function (event) {
          event.preventDefault();
          if (Util.hasClass(sidebar.element, sidebar.showClass)) {
            sidebar.selectedTrigger = event.target;
            closeSidebar(sidebar);
            return;
          }
          sidebar.selectedTrigger = event.target;
          showSidebar(sidebar);
          initSidebarEvents(sidebar);
        });
      }
    }
  }

  function showSidebar(sidebar) {
    Util.addClass(sidebar.element, sidebar.showClass);
    getFocusableElements(sidebar);
    Util.moveFocus(sidebar.element);
  }

  function closeSidebar(sidebar) {
    Util.removeClass(sidebar.element, sidebar.showClass);
    sidebar.firstFocusable = null;
    sidebar.lastFocusable = null;
    if (sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute("tabindex");

    cancelSidebarEvents(sidebar);
  }

  function initSidebarEvents(sidebar) {
    sidebar.element.addEventListener("keydown", handleEvent.bind(sidebar));
    sidebar.element.addEventListener("click", handleEvent.bind(sidebar));
  }

  function cancelSidebarEvents(sidebar) {
    sidebar.element.removeEventListener("keydown", handleEvent.bind(sidebar));
    sidebar.element.removeEventListener("click", handleEvent.bind(sidebar));
  }

  function handleEvent(event) {
    switch (event.type) {
      case "click": {
        initClick(this, event);
      }
      case "keydown": {
        initKeyDown(this, event);
      }
    }
  }

  function initKeyDown(sidebar, event) {
    if (
      (event.keyCode && event.keyCode == 27) ||
      (event.key && event.key == "Escape")
    ) {
      closeSidebar(sidebar);
    } else if (
      (event.keyCode && event.keyCode == 9) ||
      (event.key && event.key == "Tab")
    ) {
      trapFocus(sidebar, event);
    }
  }

  function initClick(sidebar, event) {
    if (
      !event.target.closest(".js-sidebar__close-btn") &&
      !Util.hasClass(event.target, "js-sidebar")
    )
      return;
    event.preventDefault();
    closeSidebar(sidebar);
  }

  function trapFocus(sidebar, event) {
    if (sidebar.firstFocusable == document.activeElement && event.shiftKey) {
      event.preventDefault();
      sidebar.lastFocusable.focus();
    }
    if (sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
      event.preventDefault();
      sidebar.firstFocusable.focus();
    }
  }

  function initSidebarResize(sidebar) {
    var beforeContent = getComputedStyle(
      sidebar.element,
      ":before"
    ).getPropertyValue("content");
    if (beforeContent && beforeContent != "" && beforeContent != "none") {
      checkSidebarLayour(sidebar);

      sidebar.element.addEventListener("update-sidebar", function (event) {
        checkSidebarLayour(sidebar);
      });
    }
    Util.addClass(sidebar.element, sidebar.readyClass);
  }

  function checkSidebarLayour(sidebar) {
    var layout = getComputedStyle(sidebar.element, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    if (layout == sidebar.layout) return;
    sidebar.layout = layout;
    if (layout != "static") Util.addClass(sidebar.element, "is-hidden");
    Util.toggleClass(
      sidebar.element,
      sidebar.staticClass + sidebar.customStaticClass,
      layout == "static"
    );
    if (layout != "static")
      setTimeout(function () {
        Util.removeClass(sidebar.element, "is-hidden");
      });

    layout == "static"
      ? sidebar.element.removeAttribute("role", "alertdialog")
      : sidebar.element.setAttribute("role", "alertdialog");

    if (layout == "static" && Util.hasClass(sidebar.element, sidebar.showClass))
      closeSidebar(sidebar);
  }

  function getFocusableElements(sidebar) {
    var allFocusable = sidebar.element.querySelectorAll(
      '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'
    );
    getFirstVisible(sidebar, allFocusable);
    getLastVisible(sidebar, allFocusable);
  }

  function getFirstVisible(sidebar, elements) {
    for (var i = 0; i < elements.length; i++) {
      if (
        elements[i].offsetWidth ||
        elements[i].offsetHeight ||
        elements[i].getClientRects().length
      ) {
        sidebar.firstFocusable = elements[i];
        return true;
      }
    }
  }

  function getLastVisible(sidebar, elements) {
    for (var i = elements.length - 1; i >= 0; i--) {
      if (
        elements[i].offsetWidth ||
        elements[i].offsetHeight ||
        elements[i].getClientRects().length
      ) {
        sidebar.lastFocusable = elements[i];
        return true;
      }
    }
  }

  var sidebar = document.getElementsByClassName("js-sidebar");
  if (sidebar.length > 0) {
    for (var i = 0; i < sidebar.length; i++) {
      (function (i) {
        new Sidebar(sidebar[i]);
      })(i);
    }

    var customEvent = new CustomEvent("update-sidebar");
    window.addEventListener("resize", function (event) {
      !window.requestAnimationFrame
        ? setTimeout(function () {
            resetLayout();
          }, 250)
        : window.requestAnimationFrame(resetLayout);
    });

    function resetLayout() {
      for (var i = 0; i < sidebar.length; i++) {
        (function (i) {
          sidebar[i].dispatchEvent(customEvent);
        })(i);
      }
    }
  }
})();

(function () {
  var fxElements = document.getElementsByClassName("reveal-fx");
  var intersectionObserverSupported =
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype;
  if (fxElements.length > 0) {
    if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
      fxRemoveClasses();
      return;
    }

    if (fxDisabled(fxElements[0])) {
      fxRevealAll();
      return;
    }

    var fxRevealDelta = 150;

    var viewportHeight = window.innerHeight,
      fxChecking = false,
      fxRevealedItems = [],
      fxElementDelays = fxGetDelays(),
      fxElementDeltas = fxGetDeltas();

    window.addEventListener("load", fxReveal);
    window.addEventListener("resize", fxResize);

    var observer = [];
    initObserver();

    function initObserver() {
      for (var i = 0; i < fxElements.length; i++) {
        observer[i] = new IntersectionObserver(
          function (entries, observer) {
            if (entries[0].isIntersecting) {
              fxRevealItemObserver(entries[0].target);
              observer.unobserve(entries[0].target);
            }
          },
          { rootMargin: "0px 0px -" + fxElementDeltas[i] + "px 0px" }
        );

        observer[i].observe(fxElements[i]);
      }
    }

    function fxRevealAll() {
      for (var i = 0; i < fxElements.length; i++) {
        Util.addClass(fxElements[i], "reveal-fx--is-visible");
      }
    }

    function fxResize() {
      if (fxChecking) return;
      fxChecking = true;
      !window.requestAnimationFrame
        ? setTimeout(function () {
            fxReset();
          }, 250)
        : window.requestAnimationFrame(fxReset);
    }

    function fxReset() {
      viewportHeight = window.innerHeight;
      fxReveal();
    }

    function fxReveal() {
      for (var i = 0; i < fxElements.length; i++) {
        (function (i) {
          if (fxRevealedItems.indexOf(i) != -1) return;
          if (fxElementIsVisible(fxElements[i], i)) {
            fxRevealItem(i);
            fxRevealedItems.push(i);
          }
        })(i);
      }
      fxResetEvents();
      fxChecking = false;
    }

    function fxRevealItem(index) {
      if (fxElementDelays[index] && fxElementDelays[index] != 0) {
        setTimeout(function () {
          Util.addClass(fxElements[index], "reveal-fx--is-visible");
        }, fxElementDelays[index]);
      } else {
        Util.addClass(fxElements[index], "reveal-fx--is-visible");
      }
    }

    function fxRevealItemObserver(item) {
      var index = Util.getIndexInArray(fxElements, item);
      if (fxRevealedItems.indexOf(index) != -1) return;
      fxRevealItem(index);
      fxRevealedItems.push(index);
      fxResetEvents();
      fxChecking = false;
    }

    function fxGetDelays() {
      var delays = [];
      for (var i = 0; i < fxElements.length; i++) {
        delays.push(
          fxElements[i].getAttribute("data-reveal-fx-delay")
            ? parseInt(fxElements[i].getAttribute("data-reveal-fx-delay"))
            : 0
        );
      }
      return delays;
    }

    function fxGetDeltas() {
      var deltas = [];
      for (var i = 0; i < fxElements.length; i++) {
        deltas.push(
          fxElements[i].getAttribute("data-reveal-fx-delta")
            ? parseInt(fxElements[i].getAttribute("data-reveal-fx-delta"))
            : fxRevealDelta
        );
      }
      return deltas;
    }

    function fxDisabled(element) {
      return !(
        window
          .getComputedStyle(element, "::before")
          .getPropertyValue("content")
          .replace(/'|"/g, "") == "reveal-fx"
      );
    }

    function fxElementIsVisible(element, i) {
      return (
        fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]
      );
    }

    function fxGetElementPosition(element) {
      return element.getBoundingClientRect().top;
    }

    function fxResetEvents() {
      if (fxElements.length > fxRevealedItems.length) return;

      window.removeEventListener("load", fxReveal);
      window.removeEventListener("resize", fxResize);
    }

    function fxRemoveClasses() {
      while (fxElements[0]) {
        var classes = fxElements[0].className.split(" ").filter(function (c) {
          return c.lastIndexOf("reveal-fx--", 0) !== 0;
        });
        fxElements[0].className = classes.join(" ").trim();
        Util.removeClass(fxElements[0], "reveal-fx");
      }
    }
  }
})();

(function () {
  var ScrollFx = function (element) {
    this.element = element;
    this.options = [];
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    this.scrollingFx = [];
    this.animating = [];
    this.deltaScrolling = [];
    this.observer = [];
    initScrollFx(this);
  };

  function initScrollFx(element) {
    if (Util.osHasReducedMotion()) return;

    var animation = element.element.getAttribute("data-scroll-fx");
    if (animation) {
      element.options.push(extractAnimation(animation));
    } else {
      getAnimations(element, 1);
    }

    initObserver(element);

    initResize(element);
  }

  function initObserver(element) {
    for (var i = 0; i < element.options.length; i++) {
      (function (i) {
        element.scrollingFx[i] = false;
        element.deltaScrolling[i] = getDeltaScrolling(element, i);
        element.animating[i] = false;

        element.observer[i] = new IntersectionObserver(
          function (entries, observer) {
            scrollFxCallback(element, i, entries, observer);
          },
          {
            rootMargin:
              element.options[i][5] -
              100 +
              "% 0px " +
              (0 - element.options[i][4]) +
              "% 0px",
          }
        );

        element.observer[i].observe(element.element);

        animateScrollFx.bind(element, i)();
      })(i);
    }
  }

  function scrollFxCallback(element, index, entries, observer) {
    if (entries[0].isIntersecting) {
      if (element.scrollingFx[index]) return;

      resetDeltaBeforeAnim(element, index);
      triggerAnimateScrollFx(element, index);
    } else {
      if (!element.scrollingFx[index]) return;
      window.removeEventListener("scroll", element.scrollingFx[index]);
      element.scrollingFx[index] = false;
    }
  }

  function triggerAnimateScrollFx(element, index) {
    element.scrollingFx[index] = animateScrollFx.bind(element, index);
    window.addEventListener("scroll", element.scrollingFx[index]);
  }

  function animateScrollFx(index) {
    if (window.scrollY < this.deltaScrolling[index][0]) {
      setCSSProperty(this, index, this.options[index][1]);
      return;
    }
    if (window.scrollY > this.deltaScrolling[index][1]) {
      setCSSProperty(this, index, this.options[index][2]);
      return;
    }
    if (this.animating[index]) return;
    this.animating[index] = true;
    window.requestAnimationFrame(updatePropertyScroll.bind(this, index));
  }

  function updatePropertyScroll(index) {
    if (isNaN(this.options[index][1])) {
      window.scrollY >= this.deltaScrolling[index][1]
        ? setCSSProperty(this, index, this.options[index][2])
        : setCSSProperty(this, index, this.options[index][1]);
    } else {
      var value =
        this.options[index][1] +
        ((this.options[index][2] - this.options[index][1]) *
          (window.scrollY - this.deltaScrolling[index][0])) /
          (this.deltaScrolling[index][1] - this.deltaScrolling[index][0]);

      setCSSProperty(this, index, value);
    }

    this.animating[index] = false;
  }

  function setCSSProperty(element, index, value) {
    if (isNaN(value)) {
      setThemeValue(element, value);
      return;
    }
    if (
      element.options[index][0] == "--scroll-fx-skew" ||
      element.options[index][0] == "--scroll-fx-scale"
    ) {
      element.element.style.setProperty(
        element.options[index][0] + "-x",
        value + element.options[index][3]
      );
      element.element.style.setProperty(
        element.options[index][0] + "-y",
        value + element.options[index][3]
      );
    } else {
      element.element.style.setProperty(
        element.options[index][0],
        value + element.options[index][3]
      );
    }
  }

  function setThemeValue(element, value) {
    if (element.element.getAttribute("data-theme") != value) {
      Util.addClass(element.element, "scroll-fx--theme-transition");
      element.element.offsetWidth;
      element.element.setAttribute("data-theme", value);
      element.element.addEventListener("transitionend", function cb() {
        element.element.removeEventListener("transitionend", cb);
        Util.removeClass(element.element, "scroll-fx--theme-transition");
      });
    }
  }

  function getAnimations(element, index) {
    var option = element.element.getAttribute("data-scroll-fx-" + index);
    if (option) {
      element.options.push(extractAnimation(option));
      getAnimations(element, index + 1);
    }
    return;
  }

  function extractAnimation(option) {
    var array = option.split(",").map(function (item) {
      return item.trim();
    });
    var propertyOptions = getPropertyValues(array[1], array[2]);
    var animation = [
      getPropertyLabel(array[0]),
      propertyOptions[0],
      propertyOptions[1],
      propertyOptions[2],
      parseInt(array[3]),
      parseInt(array[4]),
    ];
    return animation;
  }

  function getPropertyLabel(property) {
    var propertyCss = "--scroll-fx-";
    for (var i = 0; i < property.length; i++) {
      propertyCss =
        property[i] == property[i].toUpperCase()
          ? propertyCss + "-" + property[i].toLowerCase()
          : propertyCss + property[i];
    }
    if (propertyCss == "--scroll-fx-rotate") {
      propertyCss = "--scroll-fx-rotate-z";
    } else if (propertyCss == "--scroll-fx-translate") {
      propertyCss = "--scroll-fx-translate-x";
    }
    return propertyCss;
  }

  function getPropertyValues(val1, val2) {
    var nbVal1 = parseFloat(val1),
      nbVal2 = parseFloat(val2),
      unit = val1.replace(nbVal1, "");
    if (isNaN(nbVal1)) {
      nbVal1 = val1;
      nbVal2 = val2;
      unit = "";
    }
    return [nbVal1, nbVal2, unit];
  }

  function getDeltaScrolling(element, index) {
    var topDelta =
        window.scrollY -
        (element.windowHeight -
          ((element.windowHeight + element.boundingRect.height) *
            element.options[index][4]) /
            100) +
        element.boundingRect.top,
      bottomDelta =
        window.scrollY -
        (element.windowHeight -
          ((element.windowHeight + element.boundingRect.height) *
            element.options[index][5]) /
            100) +
        element.boundingRect.top;
    return [topDelta, bottomDelta];
  }

  function initResize(element) {
    var resizingId = false;
    window.addEventListener("resize", function () {
      clearTimeout(resizingId);
      resizingId = setTimeout(resetResize.bind(element), 500);
    });

    var event = new CustomEvent("scrollFxReady");
    element.element.dispatchEvent(event);
  }

  function resetResize() {
    this.boundingRect = this.element.getBoundingClientRect();
    this.windowHeight = window.innerHeight;
    for (var i = 0; i < this.deltaScrolling.length; i++) {
      this.deltaScrolling[i] = getDeltaScrolling(this, i);
      animateScrollFx.bind(this, i)();
    }

    var event = new CustomEvent("scrollFxResized");
    this.element.dispatchEvent(event);
  }

  function resetDeltaBeforeAnim(element, index) {
    element.boundingRect = element.element.getBoundingClientRect();
    element.windowHeight = window.innerHeight;
    element.deltaScrolling[index] = getDeltaScrolling(element, index);
  }

  window.ScrollFx = ScrollFx;

  var scrollFx = document.getElementsByClassName("js-scroll-fx");
  for (var i = 0; i < scrollFx.length; i++) {
    (function (i) {
      new ScrollFx(scrollFx[i]);
    })(i);
  }
})();

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

(function () {
  var Slider = function (element) {
    this.element = element;
    this.rangeWrapper = this.element.getElementsByClassName("slider__range");
    this.rangeInput = this.element.getElementsByClassName("slider__input");
    this.value = this.element.getElementsByClassName("js-slider__value");
    this.floatingValue = this.element.getElementsByClassName(
      "js-slider__value--floating"
    );
    this.rangeMin = this.rangeInput[0].getAttribute("min");
    this.rangeMax = this.rangeInput[0].getAttribute("max");
    this.sliderWidth = window
      .getComputedStyle(this.element.getElementsByClassName("slider__range")[0])
      .getPropertyValue("width");
    this.thumbWidth = getComputedStyle(this.element).getPropertyValue(
      "--slide-thumb-size"
    );
    this.isInputVar = this.value[0].tagName.toLowerCase() == "input";
    this.isFloatingVar = this.floatingValue.length > 0;
    if (this.isFloatingVar) {
      this.floatingValueLeft = window
        .getComputedStyle(this.floatingValue[0])
        .getPropertyValue("left");
    }
    initSlider(this);
  };

  function initSlider(slider) {
    updateLabelValues(slider);
    updateLabelPosition(slider, false);
    updateRangeColor(slider, false);
    checkRangeSupported(slider);

    for (var i = 0; i < slider.rangeInput.length; i++) {
      (function (i) {
        slider.rangeInput[i].addEventListener("input", function (event) {
          updateSlider(slider, i);
        });
        slider.rangeInput[i].addEventListener("change", function (event) {
          updateSlider(slider, i);
        });
      })(i);
    }

    if (slider.isInputVar) {
      for (var i = 0; i < slider.value.length; i++) {
        (function (i) {
          slider.value[i].addEventListener("change", function (event) {
            updateRange(slider, i);
          });
        })(i);
      }
    }

    slider.element.addEventListener("slider-updated", function (event) {
      for (var i = 0; i < slider.value.length; i++) {
        updateSlider(slider, i);
      }
    });

    slider.element.addEventListener("inputRangeLimit", function (event) {
      updateLabelValues(slider);
      updateLabelPosition(slider, event.detail);
    });
  }

  function updateSlider(slider, index) {
    updateLabelValues(slider);
    updateLabelPosition(slider, index);
    updateRangeColor(slider, index);
  }

  function updateLabelValues(slider) {
    for (var i = 0; i < slider.rangeInput.length; i++) {
      slider.isInputVar
        ? (slider.value[i].value = slider.rangeInput[i].value)
        : (slider.value[i].textContent = slider.rangeInput[i].value);
    }
  }

  function updateLabelPosition(slider, index) {
    if (!slider.isFloatingVar) return;
    var i = index ? index : 0,
      j = index ? index + 1 : slider.rangeInput.length;
    for (var k = i; k < j; k++) {
      var percentage =
        (slider.rangeInput[k].value - slider.rangeMin) /
        (slider.rangeMax - slider.rangeMin);
      slider.floatingValue[k].style.left =
        "calc(0.5 * " +
        slider.floatingValueLeft +
        " + " +
        percentage +
        " * ( " +
        slider.sliderWidth +
        " - " +
        slider.floatingValueLeft +
        " ))";
    }
  }

  function updateRangeColor(slider, index) {
    if (slider.rangeInput.length > 1) {
      slider.element.dispatchEvent(
        new CustomEvent("updateRange", { detail: index })
      );
      return;
    }
    var percentage = parseInt(
        ((slider.rangeInput[0].value - slider.rangeMin) /
          (slider.rangeMax - slider.rangeMin)) *
          100
      ),
      fill =
        "calc(" +
        percentage +
        "*(" +
        slider.sliderWidth +
        " - 0.5*" +
        slider.thumbWidth +
        ")/100)",
      empty =
        "calc(" +
        slider.sliderWidth +
        " - " +
        percentage +
        "*(" +
        slider.sliderWidth +
        " - 0.5*" +
        slider.thumbWidth +
        ")/100)";

    slider.rangeWrapper[0].style.setProperty("--slider-fill-value", fill);
    slider.rangeWrapper[0].style.setProperty("--slider-empty-value", empty);
  }

  function updateRange(slider, index) {
    var newValue = parseFloat(slider.value[index].value);
    if (isNaN(newValue)) {
      slider.value[index].value = slider.rangeInput[index].value;
      return;
    } else {
      if (newValue < slider.rangeMin) newValue = slider.rangeMin;
      if (newValue > slider.rangeMax) newValue = slider.rangeMax;
      slider.rangeInput[index].value = newValue;
      var inputEvent = new Event("change");
      slider.rangeInput[index].dispatchEvent(inputEvent);
    }
  }

  function checkRangeSupported(slider) {
    var input = document.createElement("input");
    input.setAttribute("type", "range");
    Util.toggleClass(
      slider.element,
      "slider--range-not-supported",
      input.type !== "range"
    );
  }

  var sliders = document.getElementsByClassName("js-slider");
  if (sliders.length > 0) {
    for (var i = 0; i < sliders.length; i++) {
      (function (i) {
        new Slider(sliders[i]);
      })(i);
    }
  }
})();

(function () {
  var SmoothScroll = function (element) {
    this.element = element;
    this.scrollDuration =
      parseInt(this.element.getAttribute("data-duration")) || 300;
    this.dataElement = this.element.getAttribute("data-element");
    this.scrollElement = this.dataElement
      ? document.querySelector(this.dataElement)
      : window;
    this.initScroll();
  };

  SmoothScroll.prototype.initScroll = function () {
    var self = this;

    this.element.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = event.target
          .closest(".js-smooth-scroll")
          .getAttribute("href")
          .replace("#", ""),
        target = document.getElementById(targetId),
        targetTabIndex = target.getAttribute("tabindex"),
        windowScrollTop =
          self.scrollElement.scrollTop || document.documentElement.scrollTop;

      if (!self.dataElement)
        windowScrollTop = window.scrollY || document.documentElement.scrollTop;

      var scrollElement = self.dataElement ? self.scrollElement : false;

      var fixedHeight = self.getFixedElementHeight();
      Util.scrollTo(
        target.getBoundingClientRect().top + windowScrollTop - fixedHeight,
        self.scrollDuration,
        function () {
          Util.moveFocus(target);
          history.pushState(false, false, "#" + targetId);
          self.resetTarget(target, targetTabIndex);
        },
        scrollElement
      );
    });
  };

  SmoothScroll.prototype.resetTarget = function (target, tabindex) {
    if (parseInt(target.getAttribute("tabindex")) < 0) {
      target.style.outline = "none";
      !tabindex && target.removeAttribute("tabindex");
    }
  };

  SmoothScroll.prototype.getFixedElementHeight = function () {
    var fixedElementDelta = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "scroll-padding"
      )
    );
    if (isNaN(fixedElementDelta)) {
      fixedElementDelta = 0;
      var fixedElement = document.querySelector(
        this.element.getAttribute("data-fixed-element")
      );
      if (fixedElement)
        fixedElementDelta = parseInt(
          fixedElement.getBoundingClientRect().height
        );
    }
    return fixedElementDelta;
  };

  var smoothScrollLinks = document.getElementsByClassName("js-smooth-scroll");
  if (
    smoothScrollLinks.length > 0 &&
    !Util.cssSupports("scroll-behavior", "smooth") &&
    window.requestAnimationFrame
  ) {
    for (var i = 0; i < smoothScrollLinks.length; i++) {
      (function (i) {
        new SmoothScroll(smoothScrollLinks[i]);
      })(i);
    }
  }
})();

(function () {
  function initSocialShare(button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var social = button.getAttribute("data-social");
      var url = getSocialUrl(button, social);
      social == "mail"
        ? (window.location.href = url)
        : window.open(url, social + "-share-dialog", "width=626,height=436");
    });
  }

  function getSocialUrl(button, social) {
    var params = getSocialParams(social);
    var newUrl = "";
    for (var i = 0; i < params.length; i++) {
      var paramValue = button.getAttribute("data-" + params[i]);
      if (params[i] == "hashtags")
        paramValue = encodeURI(paramValue.replace(/\#| /g, ""));
      if (paramValue) {
        social == "facebook"
          ? (newUrl = newUrl + "u=" + encodeURIComponent(paramValue) + "&")
          : (newUrl =
              newUrl + params[i] + "=" + encodeURIComponent(paramValue) + "&");
      }
    }
    if (social == "linkedin") newUrl = "mini=true&" + newUrl;
    return button.getAttribute("href") + "?" + newUrl;
  }

  function getSocialParams(social) {
    var params = [];
    switch (social) {
      case "twitter":
        params = ["text", "hashtags"];
        break;
      case "facebook":
      case "linkedin":
        params = ["url"];
        break;
      case "pinterest":
        params = ["url", "media", "description"];
        break;
      case "mail":
        params = ["subject", "body"];
        break;
    }
    return params;
  }

  var socialShare = document.getElementsByClassName("js-social-share");
  if (socialShare.length > 0) {
    for (var i = 0; i < socialShare.length; i++) {
      (function (i) {
        initSocialShare(socialShare[i]);
      })(i);
    }
  }
})();

(function () {
  var StickyBackground = function (element) {
    this.element = element;
    this.scrollingElement = this.element.getElementsByClassName(
      "sticky-hero__content"
    )[0];
    this.nextElement = this.element.nextElementSibling;
    this.scrollingTreshold = 0;
    this.nextTreshold = 0;
    initStickyEffect(this);
  };

  function initStickyEffect(element) {
    var observer = new IntersectionObserver(stickyCallback.bind(element), {
      threshold: [0, 0.1, 1],
    });
    observer.observe(element.scrollingElement);
    if (element.nextElement) observer.observe(element.nextElement);
  }

  function stickyCallback(entries, observer) {
    var threshold = entries[0].intersectionRatio.toFixed(1);
    entries[0].target == this.scrollingElement
      ? (this.scrollingTreshold = threshold)
      : (this.nextTreshold = threshold);

    Util.toggleClass(
      this.element,
      "sticky-hero--media-is-fixed",
      this.nextTreshold > 0 || this.scrollingTreshold > 0
    );
  }

  var stickyBackground = document.getElementsByClassName("js-sticky-hero"),
    intersectionObserverSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;
  if (stickyBackground.length > 0 && intersectionObserverSupported) {
    for (var i = 0; i < stickyBackground.length; i++) {
      (function (i) {
        if (
          Util.hasClass(stickyBackground[i], "sticky-hero--overlay-layer") ||
          Util.hasClass(stickyBackground[i], "sticky-hero--scale")
        )
          new StickyBackground(stickyBackground[i]);
      })(i);
    }
  }
})();

(function () {
  var SwipeContent = function (element) {
    this.element = element;
    this.delta = [false, false];
    this.dragging = false;
    this.intervalId = false;
    initSwipeContent(this);
  };

  function initSwipeContent(content) {
    content.element.addEventListener("mousedown", handleEvent.bind(content));
    content.element.addEventListener("touchstart", handleEvent.bind(content));
  }

  function initDragging(content) {
    content.element.addEventListener("mousemove", handleEvent.bind(content));
    content.element.addEventListener("touchmove", handleEvent.bind(content));
    content.element.addEventListener("mouseup", handleEvent.bind(content));
    content.element.addEventListener("mouseleave", handleEvent.bind(content));
    content.element.addEventListener("touchend", handleEvent.bind(content));
  }

  function cancelDragging(content) {
    if (content.intervalId) {
      !window.requestAnimationFrame
        ? clearInterval(content.intervalId)
        : window.cancelAnimationFrame(content.intervalId);
      content.intervalId = false;
    }
    content.element.removeEventListener("mousemove", handleEvent.bind(content));
    content.element.removeEventListener("touchmove", handleEvent.bind(content));
    content.element.removeEventListener("mouseup", handleEvent.bind(content));
    content.element.removeEventListener(
      "mouseleave",
      handleEvent.bind(content)
    );
    content.element.removeEventListener("touchend", handleEvent.bind(content));
  }

  function handleEvent(event) {
    switch (event.type) {
      case "mousedown":
      case "touchstart":
        startDrag(this, event);
        break;
      case "mousemove":
      case "touchmove":
        drag(this, event);
        break;
      case "mouseup":
      case "mouseleave":
      case "touchend":
        endDrag(this, event);
        break;
    }
  }

  function startDrag(content, event) {
    content.dragging = true;

    initDragging(content);
    content.delta = [
      parseInt(unify(event).clientX),
      parseInt(unify(event).clientY),
    ];

    emitSwipeEvents(content, "dragStart", content.delta, event.target);
  }

  function endDrag(content, event) {
    cancelDragging(content);

    var dx = parseInt(unify(event).clientX),
      dy = parseInt(unify(event).clientY);

    if (content.delta && (content.delta[0] || content.delta[0] === 0)) {
      var s = getSign(dx - content.delta[0]);

      if (Math.abs(dx - content.delta[0]) > 30) {
        s < 0
          ? emitSwipeEvents(content, "swipeLeft", [dx, dy])
          : emitSwipeEvents(content, "swipeRight", [dx, dy]);
      }

      content.delta[0] = false;
    }

    if (content.delta && (content.delta[1] || content.delta[1] === 0)) {
      var y = getSign(dy - content.delta[1]);

      if (Math.abs(dy - content.delta[1]) > 30) {
        y < 0
          ? emitSwipeEvents(content, "swipeUp", [dx, dy])
          : emitSwipeEvents(content, "swipeDown", [dx, dy]);
      }

      content.delta[1] = false;
    }

    emitSwipeEvents(content, "dragEnd", [dx, dy]);
    content.dragging = false;
  }

  function drag(content, event) {
    if (!content.dragging) return;

    !window.requestAnimationFrame
      ? (content.intervalId = setTimeout(function () {
          emitDrag.bind(content, event);
        }, 250))
      : (content.intervalId = window.requestAnimationFrame(
          emitDrag.bind(content, event)
        ));
  }

  function emitDrag(event) {
    emitSwipeEvents(this, "dragging", [
      parseInt(unify(event).clientX),
      parseInt(unify(event).clientY),
    ]);
  }

  function unify(event) {
    return event.changedTouches ? event.changedTouches[0] : event;
  }

  function emitSwipeEvents(content, eventName, detail, el) {
    var trigger = false;
    if (el) trigger = el;

    var event = new CustomEvent(eventName, {
      detail: { x: detail[0], y: detail[1], origin: trigger },
    });
    content.element.dispatchEvent(event);
  }

  function getSign(x) {
    if (!Math.sign) {
      return (x > 0) - (x < 0) || +x;
    } else {
      return Math.sign(x);
    }
  }

  window.SwipeContent = SwipeContent;

  var swipe = document.getElementsByClassName("js-swipe-content");
  if (swipe.length > 0) {
    for (var i = 0; i < swipe.length; i++) {
      (function (i) {
        new SwipeContent(swipe[i]);
      })(i);
    }
  }
})();

(function () {
  function initTable(table) {
    checkTableLayour(table);
    Util.addClass(table, "table--loaded");

    table.addEventListener("update-table", function (event) {
      checkTableLayour(table);
    });
  }

  function checkTableLayour(table) {
    var layout = getComputedStyle(table, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    Util.toggleClass(table, tableExpandedLayoutClass, layout != "collapsed");
  }

  var tables = document.getElementsByClassName("js-table"),
    tableExpandedLayoutClass = "table--expanded";
  if (tables.length > 0) {
    var j = 0;
    for (var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(
        tables[i],
        ":before"
      ).getPropertyValue("content");
      if (beforeContent && beforeContent != "" && beforeContent != "none") {
        (function (i) {
          initTable(tables[i]);
        })(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], "table--loaded");
      }
    }

    if (j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent("update-table");
      window.addEventListener("resize", function (event) {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for (var i = 0; i < tables.length; i++) {
          (function (i) {
            tables[i].dispatchEvent(customEvent);
          })(i);
        }
      }

      window.requestAnimationFrame
        ? window.requestAnimationFrame(doneResizing)
        : doneResizing();
    }
  }
})();

(function () {
  var Tab = function (element) {
    this.element = element;
    this.tabList = this.element.getElementsByClassName("js-tabs__controls")[0];
    this.listItems = this.tabList.getElementsByTagName("li");
    this.triggers = this.tabList.getElementsByTagName("a");
    this.panelsList = this.element.getElementsByClassName("js-tabs__panels")[0];
    this.panels = Util.getChildrenByClassName(
      this.panelsList,
      "js-tabs__panel"
    );
    this.hideClass = "is-hidden";
    this.customShowClass = this.element.getAttribute("data-show-panel-class")
      ? this.element.getAttribute("data-show-panel-class")
      : false;
    this.initTab();
  };

  Tab.prototype.initTab = function () {
    this.tabList.setAttribute("role", "tablist");
    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == 0,
        panelId = this.panels[i].getAttribute("id");
      this.listItems[i].setAttribute("role", "presentation");
      Util.setAttributes(this.triggers[i], {
        role: "tab",
        "aria-selected": bool,
        "aria-controls": panelId,
        id: "tab-" + panelId,
      });
      Util.addClass(this.triggers[i], "js-tabs__trigger");
      Util.setAttributes(this.panels[i], {
        role: "tabpanel",
        "aria-labelledby": "tab-" + panelId,
      });
      Util.toggleClass(this.panels[i], this.hideClass, !bool);

      if (!bool) this.triggers[i].setAttribute("tabindex", "-1");
    }

    this.initTabEvents();
  };

  Tab.prototype.initTabEvents = function () {
    var self = this;

    this.tabList.addEventListener("click", function (event) {
      if (event.target.closest(".js-tabs__trigger"))
        self.triggerTab(event.target.closest(".js-tabs__trigger"), event);
    });

    this.tabList.addEventListener("keydown", function (event) {
      if (!event.target.closest(".js-tabs__trigger")) return;
      if (
        (event.keyCode && event.keyCode == 39) ||
        (event.key && event.key == "ArrowRight")
      ) {
        self.selectNewTab("next");
      } else if (
        (event.keyCode && event.keyCode == 37) ||
        (event.key && event.key == "ArrowLeft")
      ) {
        self.selectNewTab("prev");
      }
    });
  };

  Tab.prototype.selectNewTab = function (direction) {
    var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
      index = Util.getIndexInArray(this.triggers, selectedTab);
    index = direction == "next" ? index + 1 : index - 1;

    if (index < 0) index = this.listItems.length - 1;
    if (index >= this.listItems.length) index = 0;
    this.triggerTab(this.triggers[index]);
    this.triggers[index].focus();
  };

  Tab.prototype.triggerTab = function (tabTrigger, event) {
    var self = this;
    event && event.preventDefault();
    var index = Util.getIndexInArray(this.triggers, tabTrigger);

    if (this.triggers[index].getAttribute("aria-selected") == "true") return;

    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == index;
      Util.toggleClass(this.panels[i], this.hideClass, !bool);
      if (this.customShowClass)
        Util.toggleClass(this.panels[i], this.customShowClass, bool);
      this.triggers[i].setAttribute("aria-selected", bool);
      bool
        ? this.triggers[i].setAttribute("tabindex", "0")
        : this.triggers[i].setAttribute("tabindex", "-1");
    }
  };

  var tabs = document.getElementsByClassName("js-tabs");
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      (function (i) {
        new Tab(tabs[i]);
      })(i);
    }
  }
})();

(function () {
  var Carousel = function (opts) {
    this.options = Util.extend(Carousel.defaults, opts);
    this.element = this.options.element;
    this.listWrapper =
      this.element.getElementsByClassName("carousel__wrapper")[0];
    this.list = this.element.getElementsByClassName("carousel__list")[0];
    this.items = this.element.getElementsByClassName("carousel__item");
    this.initItems = [];
    this.itemsNb = this.items.length;
    this.visibItemsNb = 1;
    this.itemsWidth = 1;
    this.itemOriginalWidth = false;
    this.selectedItem = 0;
    this.translateContainer = 0;
    this.containerWidth = 0;
    this.ariaLive = false;

    this.controls = this.element.getElementsByClassName("js-carousel__control");
    this.animating = false;

    this.autoplayId = false;
    this.autoplayPaused = false;

    this.dragStart = false;

    this.resizeId = false;

    this.cloneList = [];

    this.itemAutoSize = false;

    this.totTranslate = 0;

    if (this.options.nav) this.options.loop = false;

    this.counter = this.element.getElementsByClassName("js-carousel__counter");
    this.counterTor = this.element.getElementsByClassName(
      "js-carousel__counter-tot"
    );
    initCarouselLayout(this);
    setItemsWidth(this, true);
    insertBefore(this, this.visibItemsNb);
    updateCarouselClones(this);
    resetItemsTabIndex(this);
    initAriaLive(this);
    initCarouselEvents(this);
    initCarouselCounter(this);
    Util.addClass(this.element, "carousel--loaded");
  };

  Carousel.prototype.showNext = function () {
    showNextItems(this);
  };

  Carousel.prototype.showPrev = function () {
    showPrevItems(this);
  };

  Carousel.prototype.startAutoplay = function () {
    startAutoplay(this);
  };

  Carousel.prototype.pauseAutoplay = function () {
    pauseAutoplay(this);
  };

  function initCarouselLayout(carousel) {
    var itemStyle = window.getComputedStyle(carousel.items[0]),
      containerStyle = window.getComputedStyle(carousel.listWrapper),
      itemWidth = parseFloat(itemStyle.getPropertyValue("width")),
      itemMargin = parseFloat(itemStyle.getPropertyValue("margin-right")),
      containerPadding = parseFloat(
        containerStyle.getPropertyValue("padding-left")
      ),
      containerWidth = parseFloat(containerStyle.getPropertyValue("width"));

    if (!carousel.itemAutoSize) {
      carousel.itemAutoSize = itemWidth;
    }

    containerWidth = getCarouselWidth(carousel, containerWidth);

    if (!carousel.itemOriginalWidth) {
      carousel.itemOriginalWidth = itemWidth;
    } else {
      itemWidth = carousel.itemOriginalWidth;
    }

    if (carousel.itemAutoSize) {
      carousel.itemOriginalWidth = parseInt(carousel.itemAutoSize);
      itemWidth = carousel.itemOriginalWidth;
    }

    if (containerWidth < itemWidth) {
      carousel.itemOriginalWidth = containerWidth;
      itemWidth = carousel.itemOriginalWidth;
    }

    carousel.visibItemsNb = parseInt(
      (containerWidth - 2 * containerPadding + itemMargin) /
        (itemWidth + itemMargin)
    );
    carousel.itemsWidth = parseFloat(
      (
        (containerWidth - 2 * containerPadding + itemMargin) /
          carousel.visibItemsNb -
        itemMargin
      ).toFixed(1)
    );
    carousel.containerWidth =
      (carousel.itemsWidth + itemMargin) * carousel.items.length;
    carousel.translateContainer =
      0 - (carousel.itemsWidth + itemMargin) * carousel.visibItemsNb;

    if (!flexSupported)
      carousel.list.style.width =
        (carousel.itemsWidth + itemMargin) * carousel.visibItemsNb * 3 + "px";

    carousel.totTranslate =
      0 - carousel.selectedItem * (carousel.itemsWidth + itemMargin);
    if (carousel.items.length <= carousel.visibItemsNb)
      carousel.totTranslate = 0;

    centerItems(carousel);
    alignControls(carousel);
  }

  function setItemsWidth(carousel, bool) {
    for (var i = 0; i < carousel.items.length; i++) {
      carousel.items[i].style.width = carousel.itemsWidth + "px";
      if (bool) carousel.initItems.push(carousel.items[i]);
    }
  }

  function updateCarouselClones(carousel) {
    if (!carousel.options.loop) return;

    if (carousel.items.length < carousel.visibItemsNb * 3) {
      insertAfter(
        carousel,
        carousel.visibItemsNb * 3 - carousel.items.length,
        carousel.items.length - carousel.visibItemsNb * 2
      );
    } else if (carousel.items.length > carousel.visibItemsNb * 3) {
      removeClones(
        carousel,
        carousel.visibItemsNb * 3,
        carousel.items.length - carousel.visibItemsNb * 3
      );
    }

    setTranslate(carousel, "translateX(" + carousel.translateContainer + "px)");
  }

  function initCarouselEvents(carousel) {
    if (carousel.options.nav) {
      carouselCreateNavigation(carousel);
      carouselInitNavigationEvents(carousel);
    }

    if (carousel.controls.length > 0) {
      carousel.controls[0].addEventListener("click", function (event) {
        event.preventDefault();
        showPrevItems(carousel);
        updateAriaLive(carousel);
      });
      carousel.controls[1].addEventListener("click", function (event) {
        event.preventDefault();
        showNextItems(carousel);
        updateAriaLive(carousel);
      });

      resetCarouselControls(carousel);
    }

    if (carousel.options.autoplay) {
      startAutoplay(carousel);

      carousel.element.addEventListener("mouseenter", function (event) {
        pauseAutoplay(carousel);
        carousel.autoplayPaused = true;
      });
      carousel.element.addEventListener("focusin", function (event) {
        pauseAutoplay(carousel);
        carousel.autoplayPaused = true;
      });
      carousel.element.addEventListener("mouseleave", function (event) {
        carousel.autoplayPaused = false;
        startAutoplay(carousel);
      });
      carousel.element.addEventListener("focusout", function (event) {
        carousel.autoplayPaused = false;
        startAutoplay(carousel);
      });
    }

    if (carousel.options.drag && window.requestAnimationFrame) {
      new SwipeContent(carousel.element);
      carousel.element.addEventListener("dragStart", function (event) {
        if (
          event.detail.origin &&
          event.detail.origin.closest(".js-carousel__control")
        )
          return;
        if (
          event.detail.origin &&
          event.detail.origin.closest(".js-carousel__navigation")
        )
          return;
        if (
          event.detail.origin &&
          !event.detail.origin.closest(".carousel__wrapper")
        )
          return;
        Util.addClass(carousel.element, "carousel--is-dragging");
        pauseAutoplay(carousel);
        carousel.dragStart = event.detail.x;
        animateDragEnd(carousel);
      });
      carousel.element.addEventListener("dragging", function (event) {
        if (!carousel.dragStart) return;
        if (
          carousel.animating ||
          Math.abs(event.detail.x - carousel.dragStart) < 10
        )
          return;
        var translate =
          event.detail.x - carousel.dragStart + carousel.translateContainer;
        if (!carousel.options.loop) {
          translate =
            event.detail.x - carousel.dragStart + carousel.totTranslate;
        }
        setTranslate(carousel, "translateX(" + translate + "px)");
      });
    }

    window.addEventListener("resize", function (event) {
      pauseAutoplay(carousel);
      clearTimeout(carousel.resizeId);
      carousel.resizeId = setTimeout(function () {
        resetCarouselResize(carousel);

        resetDotsNavigation(carousel);
        resetCarouselControls(carousel);
        setCounterItem(carousel);
        startAutoplay(carousel);
        centerItems(carousel);
        alignControls(carousel);
      }, 250);
    });
  }

  function showPrevItems(carousel) {
    if (carousel.animating) return;
    carousel.animating = true;
    carousel.selectedItem = getIndex(
      carousel,
      carousel.selectedItem - carousel.visibItemsNb
    );
    animateList(carousel, "0", "prev");
  }

  function showNextItems(carousel) {
    if (carousel.animating) return;
    carousel.animating = true;
    carousel.selectedItem = getIndex(
      carousel,
      carousel.selectedItem + carousel.visibItemsNb
    );
    animateList(carousel, carousel.translateContainer * 2 + "px", "next");
  }

  function animateDragEnd(carousel) {
    carousel.element.addEventListener("dragEnd", function cb(event) {
      carousel.element.removeEventListener("dragEnd", cb);
      Util.removeClass(carousel.element, "carousel--is-dragging");
      if (event.detail.x - carousel.dragStart < -40) {
        carousel.animating = false;
        showNextItems(carousel);
      } else if (event.detail.x - carousel.dragStart > 40) {
        carousel.animating = false;
        showPrevItems(carousel);
      } else if (event.detail.x - carousel.dragStart == 0) {
        return;
      } else {
        carousel.animating = true;
        animateList(carousel, carousel.translateContainer + "px", false);
      }
      carousel.dragStart = false;
    });
  }

  function animateList(carousel, translate, direction) {
    pauseAutoplay(carousel);
    Util.addClass(carousel.list, "carousel__list--animating");
    var initTranslate = carousel.totTranslate;
    if (!carousel.options.loop) {
      translate = noLoopTranslateValue(carousel, direction);
    }
    setTranslate(carousel, "translateX(" + translate + ")");
    if (transitionSupported) {
      carousel.list.addEventListener("transitionend", function cb(event) {
        if (event.propertyName && event.propertyName != "transform") return;
        Util.removeClass(carousel.list, "carousel__list--animating");
        carousel.list.removeEventListener("transitionend", cb);
        animateListCb(carousel, direction);
      });
    } else {
      animateListCb(carousel, direction);
    }
    if (!carousel.options.loop && initTranslate == carousel.totTranslate) {
      carousel.list.dispatchEvent(new CustomEvent("transitionend"));
    }
    resetCarouselControls(carousel);
    setCounterItem(carousel);
  }

  function noLoopTranslateValue(carousel, direction) {
    var translate = carousel.totTranslate;
    if (direction == "next") {
      translate = carousel.totTranslate + carousel.translateContainer;
    } else if (direction == "prev") {
      translate = carousel.totTranslate - carousel.translateContainer;
    } else if (direction == "click") {
      translate = carousel.selectedDotIndex * carousel.translateContainer;
    }
    if (translate > 0) {
      translate = 0;
      carousel.selectedItem = 0;
    }
    if (translate < -carousel.translateContainer - carousel.containerWidth) {
      translate = -carousel.translateContainer - carousel.containerWidth;
      carousel.selectedItem = carousel.items.length - carousel.visibItemsNb;
    }
    if (carousel.visibItemsNb > carousel.items.length) translate = 0;
    carousel.totTranslate = translate;
    return translate + "px";
  }

  function animateListCb(carousel, direction) {
    if (direction) updateClones(carousel, direction);
    carousel.animating = false;

    startAutoplay(carousel);

    resetItemsTabIndex(carousel);
  }

  function updateClones(carousel, direction) {
    if (!carousel.options.loop) return;

    var index =
      direction == "next" ? 0 : carousel.items.length - carousel.visibItemsNb;

    removeClones(carousel, index, false);

    direction == "next"
      ? insertAfter(carousel, carousel.visibItemsNb, 0)
      : insertBefore(carousel, carousel.visibItemsNb);

    setTranslate(carousel, "translateX(" + carousel.translateContainer + "px)");
  }

  function insertBefore(carousel, nb, delta) {
    if (!carousel.options.loop) return;
    var clones = document.createDocumentFragment();
    var start = 0;
    if (delta) start = delta;
    for (var i = start; i < nb; i++) {
      var index = getIndex(carousel, carousel.selectedItem - i - 1),
        clone = carousel.initItems[index].cloneNode(true);
      Util.addClass(clone, "js-clone");
      clones.insertBefore(clone, clones.firstChild);
    }
    carousel.list.insertBefore(clones, carousel.list.firstChild);
    emitCarouselUpdateEvent(carousel);
  }

  function insertAfter(carousel, nb, init) {
    if (!carousel.options.loop) return;
    var clones = document.createDocumentFragment();
    for (var i = init; i < nb + init; i++) {
      var index = getIndex(
          carousel,
          carousel.selectedItem + carousel.visibItemsNb + i
        ),
        clone = carousel.initItems[index].cloneNode(true);
      Util.addClass(clone, "js-clone");
      clones.appendChild(clone);
    }
    carousel.list.appendChild(clones);
    emitCarouselUpdateEvent(carousel);
  }

  function removeClones(carousel, index, bool) {
    if (!carousel.options.loop) return;
    if (!bool) {
      bool = carousel.visibItemsNb;
    }
    for (var i = 0; i < bool; i++) {
      if (carousel.items[index])
        carousel.list.removeChild(carousel.items[index]);
    }
  }

  function resetCarouselResize(carousel) {
    var visibleItems = carousel.visibItemsNb;
    initCarouselLayout(carousel);
    setItemsWidth(carousel, false);
    resetItemsWidth(carousel);
    if (carousel.options.loop) {
      if (visibleItems > carousel.visibItemsNb) {
        removeClones(carousel, 0, visibleItems - carousel.visibItemsNb);
      } else if (visibleItems < carousel.visibItemsNb) {
        insertBefore(carousel, carousel.visibItemsNb, visibleItems);
      }
      updateCarouselClones(carousel);
    } else {
      var translate = noLoopTranslateValue(carousel);
      setTranslate(carousel, "translateX(" + translate + ")");
    }
    resetItemsTabIndex(carousel);
  }

  function resetItemsWidth(carousel) {
    for (var i = 0; i < carousel.initItems.length; i++) {
      carousel.initItems[i].style.width = carousel.itemsWidth + "px";
    }
  }

  function resetItemsTabIndex(carousel) {
    var carouselActive = carousel.items.length > carousel.visibItemsNb;
    var j = carousel.items.length;
    for (var i = 0; i < carousel.items.length; i++) {
      if (carousel.options.loop) {
        if (i < carousel.visibItemsNb || i >= 2 * carousel.visibItemsNb) {
          carousel.items[i].setAttribute("tabindex", "-1");
        } else {
          if (i < j) j = i;
          carousel.items[i].removeAttribute("tabindex");
        }
      } else {
        if (
          (i < carousel.selectedItem ||
            i >= carousel.selectedItem + carousel.visibItemsNb) &&
          carouselActive
        ) {
          carousel.items[i].setAttribute("tabindex", "-1");
        } else {
          if (i < j) j = i;
          carousel.items[i].removeAttribute("tabindex");
        }
      }
    }
    resetVisibilityOverflowItems(carousel, j);
  }

  function startAutoplay(carousel) {
    if (
      carousel.options.autoplay &&
      !carousel.autoplayId &&
      !carousel.autoplayPaused
    ) {
      carousel.autoplayId = setInterval(function () {
        showNextItems(carousel);
      }, carousel.options.autoplayInterval);
    }
  }

  function pauseAutoplay(carousel) {
    if (carousel.options.autoplay) {
      clearInterval(carousel.autoplayId);
      carousel.autoplayId = false;
    }
  }

  function initAriaLive(carousel) {
    if (!carousel.options.ariaLive) return;

    var srLiveArea = document.createElement("div");
    Util.setAttributes(srLiveArea, {
      class: "sr-only js-carousel__aria-live",
      "aria-live": "polite",
      "aria-atomic": "true",
    });
    carousel.element.appendChild(srLiveArea);
    carousel.ariaLive = srLiveArea;
  }

  function updateAriaLive(carousel) {
    if (!carousel.options.ariaLive) return;
    carousel.ariaLive.innerHTML =
      "Item " +
      (carousel.selectedItem + 1) +
      " selected. " +
      carousel.visibItemsNb +
      " items of " +
      carousel.initItems.length +
      " visible";
  }

  function getIndex(carousel, index) {
    if (index < 0) index = getPositiveValue(index, carousel.itemsNb);
    if (index >= carousel.itemsNb) index = index % carousel.itemsNb;
    return index;
  }

  function getPositiveValue(value, add) {
    value = value + add;
    if (value > 0) return value;
    else return getPositiveValue(value, add);
  }

  function setTranslate(carousel, translate) {
    carousel.list.style.transform = translate;
    carousel.list.style.msTransform = translate;
  }

  function getCarouselWidth(carousel, computedWidth) {
    var closestHidden = carousel.listWrapper.closest(".sr-only");
    if (closestHidden) {
      Util.removeClass(closestHidden, "sr-only");
      computedWidth = carousel.listWrapper.offsetWidth;
      Util.addClass(closestHidden, "sr-only");
    }
    return computedWidth;
  }

  function resetCarouselControls(carousel) {
    if (carousel.options.loop) return;

    if (carousel.controls.length > 0) {
      carousel.totTranslate == 0
        ? carousel.controls[0].setAttribute("disabled", true)
        : carousel.controls[0].removeAttribute("disabled");
      carousel.totTranslate ==
        -carousel.translateContainer - carousel.containerWidth ||
      carousel.items.length <= carousel.visibItemsNb
        ? carousel.controls[1].setAttribute("disabled", true)
        : carousel.controls[1].removeAttribute("disabled");
    }

    if (carousel.options.nav) {
      var selectedDot = carousel.navigation.getElementsByClassName(
        carousel.options.navigationItemClass + "--selected"
      );
      if (selectedDot.length > 0)
        Util.removeClass(
          selectedDot[0],
          carousel.options.navigationItemClass + "--selected"
        );

      var newSelectedIndex = getSelectedDot(carousel);
      if (
        carousel.totTranslate ==
        -carousel.translateContainer - carousel.containerWidth
      ) {
        newSelectedIndex = carousel.navDots.length - 1;
      }
      Util.addClass(
        carousel.navDots[newSelectedIndex],
        carousel.options.navigationItemClass + "--selected"
      );
    }
  }

  function emitCarouselUpdateEvent(carousel) {
    carousel.cloneList = [];
    var clones = carousel.element.querySelectorAll(".js-clone");
    for (var i = 0; i < clones.length; i++) {
      Util.removeClass(clones[i], "js-clone");
      carousel.cloneList.push(clones[i]);
    }
    emitCarouselEvents(carousel, "carousel-updated", carousel.cloneList);
  }

  function carouselCreateNavigation(carousel) {
    if (
      carousel.element.getElementsByClassName("js-carousel__navigation")
        .length > 0
    )
      return;

    var navigation = document.createElement("ol"),
      navChildren = "";

    var navClasses =
      carousel.options.navigationClass + " js-carousel__navigation";
    if (carousel.items.length <= carousel.visibItemsNb) {
      navClasses = navClasses + " is-hidden";
    }
    navigation.setAttribute("class", navClasses);

    var dotsNr = Math.ceil(carousel.items.length / carousel.visibItemsNb),
      selectedDot = getSelectedDot(carousel),
      indexClass = carousel.options.navigationPagination ? "" : "sr-only";
    for (var i = 0; i < dotsNr; i++) {
      var className =
        i == selectedDot
          ? 'class="' +
            carousel.options.navigationItemClass +
            " " +
            carousel.options.navigationItemClass +
            '--selected js-carousel__nav-item"'
          : 'class="' +
            carousel.options.navigationItemClass +
            ' js-carousel__nav-item"';
      navChildren =
        navChildren +
        "<li " +
        className +
        '><button class="reset js-tab-focus" style="outline: none;"><span class="' +
        indexClass +
        '">' +
        (i + 1) +
        "</span></button></li>";
    }
    navigation.innerHTML = navChildren;
    carousel.element.appendChild(navigation);
  }

  function carouselInitNavigationEvents(carousel) {
    carousel.navigation = carousel.element.getElementsByClassName(
      "js-carousel__navigation"
    )[0];
    carousel.navDots = carousel.element.getElementsByClassName(
      "js-carousel__nav-item"
    );
    carousel.navIdEvent = carouselNavigationClick.bind(carousel);
    carousel.navigation.addEventListener("click", carousel.navIdEvent);
  }

  function carouselRemoveNavigation(carousel) {
    if (carousel.navigation) carousel.element.removeChild(carousel.navigation);
    if (carousel.navIdEvent)
      carousel.navigation.removeEventListener("click", carousel.navIdEvent);
  }

  function resetDotsNavigation(carousel) {
    if (!carousel.options.nav) return;
    carouselRemoveNavigation(carousel);
    carouselCreateNavigation(carousel);
    carouselInitNavigationEvents(carousel);
  }

  function carouselNavigationClick(event) {
    var dot = event.target.closest(".js-carousel__nav-item");
    if (!dot) return;
    if (this.animating) return;
    this.animating = true;
    var index = Util.getIndexInArray(this.navDots, dot);
    this.selectedDotIndex = index;
    this.selectedItem = index * this.visibItemsNb;
    animateList(this, false, "click");
  }

  function getSelectedDot(carousel) {
    return Math.ceil(carousel.selectedItem / carousel.visibItemsNb);
  }

  function initCarouselCounter(carousel) {
    if (carousel.counterTor.length > 0)
      carousel.counterTor[0].textContent = carousel.items.length;
    setCounterItem(carousel);
  }

  function setCounterItem(carousel) {
    if (carousel.counter.length == 0) return;
    var totalItems = carousel.selectedItem + carousel.visibItemsNb;
    if (totalItems > carousel.items.length) totalItems = carousel.items.length;
    carousel.counter[0].textContent = totalItems;
  }

  function centerItems(carousel) {
    if (!carousel.options.justifyContent) return;
    Util.toggleClass(
      carousel.list,
      "justify-center",
      carousel.items.length < carousel.visibItemsNb
    );
  }

  function alignControls(carousel) {
    if (carousel.controls.length < 1 || !carousel.options.alignControls) return;
    if (!carousel.controlsAlignEl) {
      carousel.controlsAlignEl = carousel.element.querySelector(
        carousel.options.alignControls
      );
    }
    if (!carousel.controlsAlignEl) return;
    var translate =
      carousel.element.offsetHeight - carousel.controlsAlignEl.offsetHeight;
    for (var i = 0; i < carousel.controls.length; i++) {
      carousel.controls[i].style.marginBottom = translate + "px";
    }
  }

  function emitCarouselEvents(carousel, eventName, eventDetail) {
    var event = new CustomEvent(eventName, { detail: eventDetail });
    carousel.element.dispatchEvent(event);
  }

  function resetVisibilityOverflowItems(carousel, j) {
    if (!carousel.options.overflowItems) return;
    var itemWidth = carousel.containerWidth / carousel.items.length,
      delta = (window.innerWidth - itemWidth * carousel.visibItemsNb) / 2,
      overflowItems = Math.ceil(delta / itemWidth);

    for (var i = 0; i < overflowItems; i++) {
      var indexPrev = j - 1 - i;
      if (indexPrev >= 0) carousel.items[indexPrev].removeAttribute("tabindex");
      var indexNext = j + carousel.visibItemsNb + i;
      if (indexNext < carousel.items.length)
        carousel.items[indexNext].removeAttribute("tabindex");
    }
  }

  Carousel.defaults = {
    element: "",
    autoplay: false,
    autoplayInterval: 5000,
    loop: true,
    nav: false,
    navigationItemClass: "carousel__nav-item",
    navigationClass: "carousel__navigation",
    navigationPagination: false,
    drag: false,
    justifyContent: false,
    alignControls: false,
    overflowItems: false,
  };

  window.Carousel = Carousel;

  var carousels = document.getElementsByClassName("js-carousel"),
    flexSupported = Util.cssSupports("align-items", "stretch"),
    transitionSupported = Util.cssSupports("transition");

  if (carousels.length > 0) {
    for (var i = 0; i < carousels.length; i++) {
      (function (i) {
        var autoplay =
            carousels[i].getAttribute("data-autoplay") &&
            carousels[i].getAttribute("data-autoplay") == "on"
              ? true
              : false,
          autoplayInterval = carousels[i].getAttribute("data-autoplay-interval")
            ? carousels[i].getAttribute("data-autoplay-interval")
            : 5000,
          drag =
            carousels[i].getAttribute("data-drag") &&
            carousels[i].getAttribute("data-drag") == "on"
              ? true
              : false,
          loop =
            carousels[i].getAttribute("data-loop") &&
            carousels[i].getAttribute("data-loop") == "off"
              ? false
              : true,
          nav =
            carousels[i].getAttribute("data-navigation") &&
            carousels[i].getAttribute("data-navigation") == "on"
              ? true
              : false,
          navigationItemClass = carousels[i].getAttribute(
            "data-navigation-item-class"
          )
            ? carousels[i].getAttribute("data-navigation-item-class")
            : "carousel__nav-item",
          navigationClass = carousels[i].getAttribute("data-navigation-class")
            ? carousels[i].getAttribute("data-navigation-class")
            : "carousel__navigation",
          navigationPagination =
            carousels[i].getAttribute("data-navigation-pagination") &&
            carousels[i].getAttribute("data-navigation-pagination") == "on"
              ? true
              : false,
          overflowItems =
            carousels[i].getAttribute("data-overflow-items") &&
            carousels[i].getAttribute("data-overflow-items") == "on"
              ? true
              : false,
          alignControls = carousels[i].getAttribute("data-align-controls")
            ? carousels[i].getAttribute("data-align-controls")
            : false,
          justifyContent =
            carousels[i].getAttribute("data-justify-content") &&
            carousels[i].getAttribute("data-justify-content") == "on"
              ? true
              : false;
        new Carousel({
          element: carousels[i],
          autoplay: autoplay,
          autoplayInterval: autoplayInterval,
          drag: drag,
          ariaLive: true,
          loop: loop,
          nav: nav,
          navigationItemClass: navigationItemClass,
          navigationPagination: navigationPagination,
          navigationClass: navigationClass,
          overflowItems: overflowItems,
          justifyContent: justifyContent,
          alignControls: alignControls,
        });
      })(i);
    }
  }
})();

(function () {
  var billingCheckBox = document.getElementsByClassName("js-billing-checkbox");
  if (billingCheckBox.length > 0) {
    var billingInfo = document.getElementsByClassName("js-billing-info");
    if (billingInfo.length == 0) return;
    resetBillingInfo(billingCheckBox[0], billingInfo[0]);

    billingCheckBox[0].addEventListener("change", function () {
      resetBillingInfo(billingCheckBox[0], billingInfo[0]);
    });
  }

  function resetBillingInfo(input, content) {
    Util.toggleClass(content, "is-visible", !input.checked);
  }
})();

(function () {
  function initVote(element) {
    var voteCounter = element.getElementsByClassName("js-comments__vote-label");
    element.addEventListener("click", function () {
      var pressed = element.getAttribute("aria-pressed") == "true";
      element.setAttribute("aria-pressed", !pressed);
      Util.toggleClass(element, "comments__vote-btn--pressed", !pressed);
      resetCounter(voteCounter, pressed);
      emitKeypressEvents(element, voteCounter, pressed);
    });
  }

  function resetCounter(voteCounter, pressed) {
    if (voteCounter.length == 0) return;
    var count = parseInt(voteCounter[0].textContent);
    voteCounter[0].textContent = pressed ? count - 1 : count + 1;
  }

  function emitKeypressEvents(element, label, pressed) {
    var count = label.length == 0 ? false : parseInt(label[0].textContent);
    var event = new CustomEvent("newVote", {
      detail: { count: count, upVote: !pressed },
    });
    element.dispatchEvent(event);
  }

  var voteCounting = document.getElementsByClassName("js-comments__vote-btn");
  if (voteCounting.length > 0) {
    for (var i = 0; i < voteCounting.length; i++) {
      (function (i) {
        initVote(voteCounting[i]);
      })(i);
    }
  }
})();

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

(function () {
  var MenuBar = function (element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, "menu-bar__item");
    this.mobHideItems = this.element.getElementsByClassName(
      "menu-bar__item--hide"
    );
    this.moreItemsTrigger = this.element.getElementsByClassName(
      "js-menu-bar__trigger"
    );
    initMenuBar(this);
  };

  function initMenuBar(menu) {
    setMenuTabIndex(menu);
    initMenuBarMarkup(menu);
    checkMenuLayout(menu);
    Util.addClass(menu.element, "menu-bar--loaded");

    menu.element.addEventListener("update-menu-bar", function (event) {
      checkMenuLayout(menu);
      if (menu.menuInstance) menu.menuInstance.toggleMenu(false, false);
    });

    if (menu.moreItemsTrigger.length > 0) {
      menu.moreItemsTrigger[0].addEventListener("keydown", function (event) {
        if (
          (event.keyCode && event.keyCode == 13) ||
          (event.key && event.key.toLowerCase() == "enter")
        ) {
          if (!menu.menuInstance) return;
          menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
          menu.menuInstance.toggleMenu(
            !Util.hasClass(menu.subMenu, "menu--is-visible"),
            true
          );
        }
      });

      menu.subMenu.addEventListener("keydown", function (event) {
        if (
          (event.keyCode && event.keyCode == 27) ||
          (event.key && event.key.toLowerCase() == "escape")
        ) {
          if (menu.menuInstance) menu.menuInstance.toggleMenu(false, true);
        }
      });
    }

    menu.element.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 39) ||
        (event.key && event.key.toLowerCase() == "arrowright")
      ) {
        navigateItems(menu.items, event, "next");
      } else if (
        (event.keyCode && event.keyCode == 37) ||
        (event.key && event.key.toLowerCase() == "arrowleft")
      ) {
        navigateItems(menu.items, event, "prev");
      }
    });
  }

  function setMenuTabIndex(menu) {
    var nextItem = false;
    for (var i = 0; i < menu.items.length; i++) {
      if (i == 0 || nextItem) menu.items[i].setAttribute("tabindex", "0");
      else menu.items[i].setAttribute("tabindex", "-1");
      if (i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
      else nextItem = false;
    }
  }

  function initMenuBarMarkup(menu) {
    if (menu.mobHideItems.length == 0) {
      if (menu.moreItemsTrigger.length > 0)
        menu.element.removeChild(menu.moreItemsTrigger[0]);
      return;
    }

    if (menu.moreItemsTrigger.length == 0) return;

    var content = "";
    menu.menuControlId = "submenu-bar-" + Date.now();
    for (var i = 0; i < menu.mobHideItems.length; i++) {
      var item = menu.mobHideItems[i].cloneNode(true),
        svg = item.getElementsByTagName("svg")[0],
        label = item.getElementsByClassName("menu-bar__label")[0];

      svg.setAttribute("class", "icon menu__icon");
      content =
        content +
        '<li role="menuitem"><span class="menu__content js-menu__content">' +
        svg.outerHTML +
        "<span>" +
        label.innerHTML +
        "</span></span></li>";
    }

    Util.setAttributes(menu.moreItemsTrigger[0], {
      role: "button",
      "aria-expanded": "false",
      "aria-controls": menu.menuControlId,
      "aria-haspopup": "true",
    });

    var subMenu = document.createElement("menu"),
      customClass = menu.element.getAttribute("data-menu-class");
    Util.setAttributes(subMenu, {
      id: menu.menuControlId,
      class: "menu js-menu " + customClass,
    });
    subMenu.innerHTML = content;
    document.body.appendChild(subMenu);

    menu.subMenu = subMenu;
    menu.subItems = subMenu.getElementsByTagName("li");

    menu.menuInstance = new Menu(menu.subMenu);
  }

  function checkMenuLayout(menu) {
    var layout = getComputedStyle(menu.element, ":before")
      .getPropertyValue("content")
      .replace(/\'|"/g, "");
    Util.toggleClass(
      menu.element,
      "menu-bar--collapsed",
      layout == "collapsed"
    );
  }

  function navigateItems(list, event, direction, prevIndex) {
    event.preventDefault();
    var index =
        typeof prevIndex !== "undefined"
          ? prevIndex
          : Util.getIndexInArray(list, event.target),
      nextIndex = direction == "next" ? index + 1 : index - 1;
    if (nextIndex < 0) nextIndex = list.length - 1;
    if (nextIndex > list.length - 1) nextIndex = 0;

    list[nextIndex].offsetParent === null
      ? navigateItems(list, event, direction, nextIndex)
      : Util.moveFocus(list[nextIndex]);
  }

  function checkMenuClick(menu, target) {
    if (
      menu.menuInstance &&
      !menu.moreItemsTrigger[0].contains(target) &&
      !menu.subMenu.contains(target)
    )
      menu.menuInstance.toggleMenu(false, false);
  }

  var menuBars = document.getElementsByClassName("js-menu-bar");
  if (menuBars.length > 0) {
    var j = 0,
      menuBarArray = [];
    for (var i = 0; i < menuBars.length; i++) {
      var beforeContent = getComputedStyle(
        menuBars[i],
        ":before"
      ).getPropertyValue("content");
      if (beforeContent && beforeContent != "" && beforeContent != "none") {
        (function (i) {
          menuBarArray.push(new MenuBar(menuBars[i]));
        })(i);
        j = j + 1;
      }
    }

    if (j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent("update-menu-bar");

      window.addEventListener("resize", function (event) {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 150);
      });

      window.addEventListener("click", function (event) {
        menuBarArray.forEach(function (element) {
          checkMenuClick(element, event.target);
        });
      });

      function doneResizing() {
        for (var i = 0; i < menuBars.length; i++) {
          (function (i) {
            menuBars[i].dispatchEvent(customEvent);
          })(i);
        }
      }
    }
  }
})();

(function () {
  var ProductV3 = function (element) {
    this.element = element;
    this.cta = this.element.getElementsByClassName("js-product-v3__cta");
    this.ctaClone = this.element.getElementsByClassName(
      "js-product-v3__cta-clone"
    );
    this.ctaVisible = false;
    this.sectionVisible = false;
    this.cloneDelta = "200px";

    this.quantity = this.element.getElementsByClassName("js-product-v3__input");
    this.quantityClone = this.element.getElementsByClassName(
      "js-product-v3__input-clone"
    );
    initProductV3(this);
  };

  function initProductV3(product) {
    if (product.ctaClone.length == 0) return;
    if (product.cta.length > 0 && intObservSupported) {
      var observer = new IntersectionObserver(observeCta.bind(product), {
        threshold: [0, 1],
      });
      observer.observe(product.cta[0]);
    }
    if (intObservSupported) {
      var sectionObserver = new IntersectionObserver(
        observeSection.bind(product),
        {
          rootMargin: "0px 0px -" + product.cloneDelta + " 0px",
        }
      );
      sectionObserver.observe(product.element);
    }

    if (product.quantity.length > 0 && product.quantityClone.length > 0)
      syncProductQuantity(product);
  }

  function observeCta(entries) {
    if (entries[0].isIntersecting) {
      this.ctaVisible = true;
      Util.removeClass(this.ctaClone[0], "product-v3__cta-clone--is-visible");
    } else if (this.sectionVisible) {
      this.ctaVisible = false;
      Util.addClass(this.ctaClone[0], "product-v3__cta-clone--is-visible");
    }
  }

  function observeSection(entries) {
    if (entries[0].isIntersecting) {
      this.sectionVisible = true;
    } else {
      this.sectionVisible = false;
      Util.removeClass(this.ctaClone[0], "product-v3__cta-clone--is-visible");
    }
  }

  function syncProductQuantity(product) {
    product.quantity[0].addEventListener("change", function () {
      product.quantityClone[0].value = getAllowedValue(
        product,
        parseInt(product.quantity[0].value)
      );
    });
    product.quantityClone[0].addEventListener("change", function () {
      product.quantity[0].value = getAllowedValue(
        product,
        parseInt(product.quantityClone[0].value)
      );
    });
  }

  function getAllowedValue(product, value) {
    var min = product.quantity[0].getAttribute("min"),
      max = product.quantity[0].getAttribute("max");
    if (min && value < parseInt(min)) value = min;
    if (max && value > parseInt(max)) value = max;
    return value;
  }

  var productV3 = document.getElementsByClassName("js-product-v3"),
    intObservSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;
  if (productV3.length > 0) {
    for (var i = 0; i < productV3.length; i++) {
      (function (i) {
        new ProductV3(productV3[i]);
      })(i);
    }
  }
})();

(function () {
  var SliderMulti = function (element) {
    this.element = element;
    this.rangeWrapper = this.element.getElementsByClassName("slider__range");
    this.rangeInput = this.element.getElementsByClassName("slider__input");
    this.rangeMin = this.rangeInput[0].getAttribute("min");
    this.rangeMax = this.rangeInput[0].getAttribute("max");
    this.sliderWidth = window
      .getComputedStyle(this.element.getElementsByClassName("slider__range")[0])
      .getPropertyValue("width");
    this.thumbWidth = getComputedStyle(this.element).getPropertyValue(
      "--slide-thumb-size"
    );
    initSliderMulti(this);
  };

  function initSliderMulti(slider) {
    toggleMsClass(slider);

    updateRangeColor(slider);

    slider.element.addEventListener("updateRange", function (event) {
      checkRangeValues(slider, event.detail);
      updateRangeColor(slider);
    });

    slider.element.addEventListener(
      "update-slider-multi-value",
      function (event) {
        slider.sliderWidth = window
          .getComputedStyle(
            slider.element.getElementsByClassName("slider__range")[0]
          )
          .getPropertyValue("width");
        updateRangeColor(slider);
      }
    );
  }

  function checkRangeValues(slider, index) {
    var i = index == 0 ? 1 : 0,
      limit = parseFloat(slider.rangeInput[i].value);
    if (
      (index == 0 && slider.rangeInput[0].value >= limit) ||
      (index == 1 && slider.rangeInput[1].value <= limit)
    ) {
      slider.rangeInput[index].value = limit;
      slider.element.dispatchEvent(
        new CustomEvent("inputRangeLimit", { detail: index })
      );
    }
  }

  function updateRangeColor(slider) {
    var percentageStart = parseInt(
        ((slider.rangeInput[0].value - slider.rangeMin) /
          (slider.rangeMax - slider.rangeMin)) *
          100
      ),
      percentageEnd = parseInt(
        ((slider.rangeInput[1].value - slider.rangeMin) /
          (slider.rangeMax - slider.rangeMin)) *
          100
      ),
      start =
        "calc(" +
        percentageStart +
        "*(" +
        slider.sliderWidth +
        " - 0.5*" +
        slider.thumbWidth +
        ")/100)",
      end =
        "calc(" +
        percentageEnd +
        "*(" +
        slider.sliderWidth +
        " - 0.5*" +
        slider.thumbWidth +
        ")/100)";

    slider.rangeWrapper[0].style.setProperty(
      "--slider-fill-value-start",
      start
    );
    slider.rangeWrapper[0].style.setProperty("--slider-fill-value-end", end);
  }

  function toggleMsClass(slider) {
    var cssVariablesSupport = Util.cssSupports("--color-value", "red"),
      imeAlignSuport = Util.cssSupports("-ms-ime-align", "auto");
    if (imeAlignSuport || !cssVariablesSupport)
      Util.addClass(slider.element, "slider--ms-fallback");
  }

  var slidersMulti = document.getElementsByClassName("js-slider");
  if (slidersMulti.length > 0) {
    var slidersMultiArray = [];
    for (var i = 0; i < slidersMulti.length; i++) {
      (function (i) {
        if (slidersMulti[i].getElementsByClassName("slider__input").length > 1)
          slidersMultiArray.push(new SliderMulti(slidersMulti[i]));
      })(i);
    }
    if (slidersMultiArray.length > 0) {
      var resizingId = false,
        customEvent = new CustomEvent("update-slider-multi-value");

      window.addEventListener("resize", function () {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for (var i = 0; i < slidersMultiArray.length; i++) {
          (function (i) {
            slidersMultiArray[i].element.dispatchEvent(customEvent);
          })(i);
        }
      }
    }
  }
})();

(function () {
  var Slideshow = function (opts) {
    this.options = slideshowAssignOptions(Slideshow.defaults, opts);
    this.element = this.options.element;
    this.items = this.element.getElementsByClassName("js-slideshow__item");
    this.controls = this.element.getElementsByClassName(
      "js-slideshow__control"
    );
    this.selectedSlide = 0;
    this.autoplayId = false;
    this.autoplayPaused = false;
    this.navigation = false;
    this.navCurrentLabel = false;
    this.ariaLive = false;
    this.moveFocus = false;
    this.animating = false;
    this.supportAnimation = Util.cssSupports("transition");
    this.animationOff =
      !Util.hasClass(this.element, "slideshow--transition-fade") &&
      !Util.hasClass(this.element, "slideshow--transition-slide") &&
      !Util.hasClass(this.element, "slideshow--transition-prx");
    this.animationType = Util.hasClass(
      this.element,
      "slideshow--transition-prx"
    )
      ? "prx"
      : "slide";
    this.animatingClass = "slideshow--is-animating";
    initSlideshow(this);
    initSlideshowEvents(this);
    initAnimationEndEvents(this);
  };

  Slideshow.prototype.showNext = function () {
    showNewItem(this, this.selectedSlide + 1, "next");
  };

  Slideshow.prototype.showPrev = function () {
    showNewItem(this, this.selectedSlide - 1, "prev");
  };

  Slideshow.prototype.showItem = function (index) {
    showNewItem(this, index, false);
  };

  Slideshow.prototype.startAutoplay = function () {
    var self = this;
    if (this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
      self.autoplayId = setInterval(function () {
        self.showNext();
      }, self.options.autoplayInterval);
    }
  };

  Slideshow.prototype.pauseAutoplay = function () {
    var self = this;
    if (this.options.autoplay) {
      clearInterval(self.autoplayId);
      self.autoplayId = false;
    }
  };

  function slideshowAssignOptions(defaults, opts) {
    var mergeOpts = {};
    mergeOpts.element =
      typeof opts.element !== "undefined" ? opts.element : defaults.element;
    mergeOpts.navigation =
      typeof opts.navigation !== "undefined"
        ? opts.navigation
        : defaults.navigation;
    mergeOpts.autoplay =
      typeof opts.autoplay !== "undefined" ? opts.autoplay : defaults.autoplay;
    mergeOpts.autoplayInterval =
      typeof opts.autoplayInterval !== "undefined"
        ? opts.autoplayInterval
        : defaults.autoplayInterval;
    mergeOpts.swipe =
      typeof opts.swipe !== "undefined" ? opts.swipe : defaults.swipe;
    return mergeOpts;
  }

  function initSlideshow(slideshow) {
    if (
      slideshow.element.getElementsByClassName("slideshow__item--selected")
        .length < 1
    )
      Util.addClass(slideshow.items[0], "slideshow__item--selected");
    slideshow.selectedSlide = Util.getIndexInArray(
      slideshow.items,
      slideshow.element.getElementsByClassName("slideshow__item--selected")[0]
    );

    var srLiveArea = document.createElement("div");
    Util.setAttributes(srLiveArea, {
      class: "sr-only js-slideshow__aria-live",
      "aria-live": "polite",
      "aria-atomic": "true",
    });
    slideshow.element.appendChild(srLiveArea);
    slideshow.ariaLive = srLiveArea;
  }

  function initSlideshowEvents(slideshow) {
    if (slideshow.options.navigation) {
      if (
        slideshow.element.getElementsByClassName("js-slideshow__navigation")
          .length == 0
      ) {
        var navigation = document.createElement("ol"),
          navChildren = "";

        var navClasses = "slideshow__navigation js-slideshow__navigation";
        if (slideshow.items.length <= 1) {
          navClasses = navClasses + " is-hidden";
        }

        navigation.setAttribute("class", navClasses);
        for (var i = 0; i < slideshow.items.length; i++) {
          var className =
              i == slideshow.selectedSlide
                ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"'
                : 'class="slideshow__nav-item js-slideshow__nav-item"',
            navCurrentLabel =
              i == slideshow.selectedSlide
                ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>'
                : "";
          navChildren =
            navChildren +
            "<li " +
            className +
            '><button class="reset"><span class="sr-only">' +
            (i + 1) +
            "</span>" +
            navCurrentLabel +
            "</button></li>";
        }
        navigation.innerHTML = navChildren;
        slideshow.element.appendChild(navigation);
      }

      slideshow.navCurrentLabel = slideshow.element.getElementsByClassName(
        "js-slideshow__nav-current-label"
      )[0];
      slideshow.navigation = slideshow.element.getElementsByClassName(
        "js-slideshow__nav-item"
      );

      var dotsNavigation = slideshow.element.getElementsByClassName(
        "js-slideshow__navigation"
      )[0];

      dotsNavigation.addEventListener("click", function (event) {
        navigateSlide(slideshow, event, true);
      });
      dotsNavigation.addEventListener("keyup", function (event) {
        navigateSlide(slideshow, event, event.key.toLowerCase() == "enter");
      });
    }

    if (slideshow.controls.length > 0) {
      if (slideshow.items.length <= 1) {
        Util.addClass(slideshow.controls[0], "is-hidden");
        Util.addClass(slideshow.controls[1], "is-hidden");
      }
      slideshow.controls[0].addEventListener("click", function (event) {
        event.preventDefault();
        slideshow.showPrev();
        updateAriaLive(slideshow);
      });
      slideshow.controls[1].addEventListener("click", function (event) {
        event.preventDefault();
        slideshow.showNext();
        updateAriaLive(slideshow);
      });
    }

    if (slideshow.options.swipe) {
      new SwipeContent(slideshow.element);
      slideshow.element.addEventListener("swipeLeft", function (event) {
        slideshow.showNext();
      });
      slideshow.element.addEventListener("swipeRight", function (event) {
        slideshow.showPrev();
      });
    }

    if (slideshow.options.autoplay) {
      slideshow.startAutoplay();

      slideshow.element.addEventListener("mouseenter", function (event) {
        slideshow.pauseAutoplay();
        slideshow.autoplayPaused = true;
      });
      slideshow.element.addEventListener("focusin", function (event) {
        slideshow.pauseAutoplay();
        slideshow.autoplayPaused = true;
      });
      slideshow.element.addEventListener("mouseleave", function (event) {
        slideshow.autoplayPaused = false;
        slideshow.startAutoplay();
      });
      slideshow.element.addEventListener("focusout", function (event) {
        slideshow.autoplayPaused = false;
        slideshow.startAutoplay();
      });
    }

    var slideshowId = slideshow.element.getAttribute("id");
    if (slideshowId) {
      var externalControls = document.querySelectorAll(
        '[data-controls="' + slideshowId + '"]'
      );
      for (var i = 0; i < externalControls.length; i++) {
        (function (i) {
          externalControlSlide(slideshow, externalControls[i]);
        })(i);
      }
    }

    slideshow.element.addEventListener("selectNewItem", function (event) {
      if (event.detail) {
        if (event.detail - 1 == slideshow.selectedSlide) return;
        showNewItem(slideshow, event.detail - 1, false);
      }
    });
  }

  function navigateSlide(slideshow, event, keyNav) {
    var target = Util.hasClass(event.target, "js-slideshow__nav-item")
      ? event.target
      : event.target.closest(".js-slideshow__nav-item");
    if (
      keyNav &&
      target &&
      !Util.hasClass(target, "slideshow__nav-item--selected")
    ) {
      slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
      slideshow.moveFocus = true;
      updateAriaLive(slideshow);
    }
  }

  function initAnimationEndEvents(slideshow) {
    for (var i = 0; i < slideshow.items.length; i++) {
      (function (i) {
        slideshow.items[i].addEventListener("animationend", function () {
          resetAnimationEnd(slideshow, slideshow.items[i]);
        });
        slideshow.items[i].addEventListener("transitionend", function () {
          resetAnimationEnd(slideshow, slideshow.items[i]);
        });
      })(i);
    }
  }

  function resetAnimationEnd(slideshow, item) {
    setTimeout(function () {
      if (Util.hasClass(item, "slideshow__item--selected")) {
        if (slideshow.moveFocus) Util.moveFocus(item);
        emitSlideshowEvent(
          slideshow,
          "newItemVisible",
          slideshow.selectedSlide
        );
        slideshow.moveFocus = false;
      }
      Util.removeClass(
        item,
        "slideshow__item--" +
          slideshow.animationType +
          "-out-left slideshow__item--" +
          slideshow.animationType +
          "-out-right slideshow__item--" +
          slideshow.animationType +
          "-in-left slideshow__item--" +
          slideshow.animationType +
          "-in-right"
      );
      item.removeAttribute("aria-hidden");
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }, 100);
  }

  function showNewItem(slideshow, index, bool) {
    if (slideshow.items.length <= 1) return;
    if (slideshow.animating && slideshow.supportAnimation) return;
    slideshow.animating = true;
    Util.addClass(slideshow.element, slideshow.animatingClass);
    if (index < 0) index = slideshow.items.length - 1;
    else if (index >= slideshow.items.length) index = 0;
    var exitItemClass = getExitItemClass(
      slideshow,
      bool,
      slideshow.selectedSlide,
      index
    );
    var enterItemClass = getEnterItemClass(
      slideshow,
      bool,
      slideshow.selectedSlide,
      index
    );

    if (!slideshow.animationOff)
      Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
    Util.removeClass(
      slideshow.items[slideshow.selectedSlide],
      "slideshow__item--selected"
    );
    slideshow.items[slideshow.selectedSlide].setAttribute(
      "aria-hidden",
      "true"
    );
    if (slideshow.animationOff) {
      Util.addClass(slideshow.items[index], "slideshow__item--selected");
    } else {
      Util.addClass(
        slideshow.items[index],
        enterItemClass + " slideshow__item--selected"
      );
    }

    resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
    slideshow.selectedSlide = index;

    slideshow.pauseAutoplay();
    slideshow.startAutoplay();

    resetSlideshowTheme(slideshow, index);

    emitSlideshowEvent(slideshow, "newItemSelected", slideshow.selectedSlide);
    if (slideshow.animationOff) {
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }
  }

  function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = "";
    if (bool) {
      className =
        bool == "next"
          ? "slideshow__item--" + slideshow.animationType + "-out-right"
          : "slideshow__item--" + slideshow.animationType + "-out-left";
    } else {
      className =
        newIndex < oldIndex
          ? "slideshow__item--" + slideshow.animationType + "-out-left"
          : "slideshow__item--" + slideshow.animationType + "-out-right";
    }
    return className;
  }

  function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
    var className = "";
    if (bool) {
      className =
        bool == "next"
          ? "slideshow__item--" + slideshow.animationType + "-in-right"
          : "slideshow__item--" + slideshow.animationType + "-in-left";
    } else {
      className =
        newIndex < oldIndex
          ? "slideshow__item--" + slideshow.animationType + "-in-left"
          : "slideshow__item--" + slideshow.animationType + "-in-right";
    }
    return className;
  }

  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if (slideshow.navigation) {
      Util.removeClass(
        slideshow.navigation[oldIndex],
        "slideshow__nav-item--selected"
      );
      Util.addClass(
        slideshow.navigation[newIndex],
        "slideshow__nav-item--selected"
      );
      slideshow.navCurrentLabel.parentElement.removeChild(
        slideshow.navCurrentLabel
      );
      slideshow.navigation[newIndex]
        .getElementsByTagName("button")[0]
        .appendChild(slideshow.navCurrentLabel);
    }
  }

  function resetSlideshowTheme(slideshow, newIndex) {
    var dataTheme = slideshow.items[newIndex].getAttribute("data-theme");
    if (dataTheme) {
      if (slideshow.navigation)
        slideshow.navigation[0].parentElement.setAttribute(
          "data-theme",
          dataTheme
        );
      if (slideshow.controls[0])
        slideshow.controls[0].parentElement.setAttribute(
          "data-theme",
          dataTheme
        );
    } else {
      if (slideshow.navigation)
        slideshow.navigation[0].parentElement.removeAttribute("data-theme");
      if (slideshow.controls[0])
        slideshow.controls[0].parentElement.removeAttribute("data-theme");
    }
  }

  function emitSlideshowEvent(slideshow, eventName, detail) {
    var event = new CustomEvent(eventName, { detail: detail });
    slideshow.element.dispatchEvent(event);
  }

  function updateAriaLive(slideshow) {
    slideshow.ariaLive.innerHTML =
      "Item " + (slideshow.selectedSlide + 1) + " of " + slideshow.items.length;
  }

  function externalControlSlide(slideshow, button) {
    button.addEventListener("click", function (event) {
      var index = button.getAttribute("data-index");
      if (!index || index == slideshow.selectedSlide + 1) return;
      event.preventDefault();
      showNewItem(slideshow, index - 1, false);
    });
  }

  Slideshow.defaults = {
    element: "",
    navigation: true,
    autoplay: false,
    autoplayInterval: 5000,
    swipe: false,
  };

  window.Slideshow = Slideshow;

  var slideshows = document.getElementsByClassName("js-slideshow");
  if (slideshows.length > 0) {
    for (var i = 0; i < slideshows.length; i++) {
      (function (i) {
        var navigation =
            slideshows[i].getAttribute("data-navigation") &&
            slideshows[i].getAttribute("data-navigation") == "off"
              ? false
              : true,
          autoplay =
            slideshows[i].getAttribute("data-autoplay") &&
            slideshows[i].getAttribute("data-autoplay") == "on"
              ? true
              : false,
          autoplayInterval = slideshows[i].getAttribute(
            "data-autoplay-interval"
          )
            ? slideshows[i].getAttribute("data-autoplay-interval")
            : 5000,
          swipe =
            slideshows[i].getAttribute("data-swipe") &&
            slideshows[i].getAttribute("data-swipe") == "on"
              ? true
              : false;
        new Slideshow({
          element: slideshows[i],
          navigation: navigation,
          autoplay: autoplay,
          autoplayInterval: autoplayInterval,
          swipe: swipe,
        });
      })(i);
    }
  }
})();

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

(function () {
  var Toc = function (element) {
    this.element = element;
    this.list = this.element.getElementsByClassName("js-toc__list")[0];
    this.content = document.getElementsByClassName("js-toc-conten")[0];
    this.anchors = this.list.querySelectorAll('a[href^="#"]');
    this.sections = getSections(this);
    this.clickScrolling = false;
    initToc(this);
  };

  function getSections(toc) {
    var sections = [];

    for (var i = 0; i < toc.anchors.length; i++) {
      var section = document.getElementById(
        toc.anchors[i].getAttribute("href").replace("#", "")
      );
      if (section) sections.push(section);
    }
    return sections;
  }

  function initToc(toc) {
    toc.list.addEventListener("click", function (event) {
      var anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      toc.clickScrolling = true;
      resetAnchors(toc, anchor);
    });

    var observer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          var threshold = entry.intersectionRatio.toFixed(1);
          if (threshold > 0 && !toc.clickScrolling) {
            resetAnchors(
              toc,
              toc.list.querySelector(
                'a[href="#' + entry.target.getAttribute("id") + '"]'
              )
            );
          }
        });
      },
      {
        threshold: [0, 0.1],
        rootMargin: "0px 0px -80% 0px",
      }
    );

    for (var i = 0; i < toc.sections.length; i++) {
      observer.observe(toc.sections[i]);
    }

    toc.element.addEventListener("toc-scroll", function (event) {
      toc.clickScrolling = false;
    });
  }

  function resetAnchors(toc, anchor) {
    if (!anchor) return;
    for (var i = 0; i < toc.anchors.length; i++)
      Util.removeClass(toc.anchors[i], "toc__link--selected");
    Util.addClass(anchor, "toc__link--selected");
  }

  var tocs = document.getElementsByClassName("js-toc"),
    intersectionObserverSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;

  var tocsArray = [];
  if (tocs.length > 0 && intersectionObserverSupported) {
    for (var i = 0; i < tocs.length; i++) {
      (function (i) {
        tocsArray.push(new Toc(tocs[i]));
      })(i);
    }

    var scrollId = false,
      customEvent = new CustomEvent("toc-scroll");

    window.addEventListener("scroll", function () {
      clearTimeout(scrollId);
      scrollId = setTimeout(doneScrolling, 100);
    });

    function doneScrolling() {
      for (var i = 0; i < tocsArray.length; i++) {
        (function (i) {
          tocsArray[i].element.dispatchEvent(customEvent);
        })(i);
      }
    }
  }
})();

(function () {
  var AdvFilter = function (element) {
    this.element = element;
    this.form = this.element.getElementsByClassName("js-adv-filter__form");
    this.resultsList = this.element.getElementsByClassName(
      "js-adv-filter__gallery"
    )[0];
    this.resultsCount = this.element.getElementsByClassName(
      "js-adv-filter__results-count"
    );
    initAdvFilter(this);
  };

  function initAdvFilter(filter) {
    if (filter.form.length > 0) {
      filter.form[0].addEventListener("reset", function (event) {
        setTimeout(function () {
          resetFilters(filter);
          resetGallery(filter);
        });
      });

      filter.form[0].addEventListener("change", function (event) {
        var section = event.target.closest(".js-adv-filter__item");
        if (section) resetSelection(filter, section);
        else if (Util.is(event.target, ".js-adv-filter__form")) {
          var sections = filter.form[0].getElementsByClassName(
            "js-adv-filter__item"
          );
          for (var i = 0; i < sections.length; i++)
            resetSelection(filter, sections[i]);
        }
      });
    }

    if (filter.resultsCount.length > 0) {
      filter.resultsList.addEventListener(
        "filter-selection-updated",
        function (event) {
          updateResultsCount(filter);
        }
      );
    }
  }

  function resetFilters(filter) {
    var customSelect = filter.element.getElementsByClassName("js-select");
    if (customSelect.length > 0) {
      for (var i = 0; i < customSelect.length; i++)
        customSelect[i].dispatchEvent(new CustomEvent("select-updated"));
    }

    var customSlider = filter.element.getElementsByClassName("js-slider");
    if (customSlider.length > 0) {
      for (var i = 0; i < customSlider.length; i++)
        customSlider[i].dispatchEvent(new CustomEvent("slider-updated"));
    }
  }

  function resetSelection(filter, section) {
    var labelSelection = section.getElementsByClassName(
      "js-adv-filter__selection"
    );
    if (labelSelection.length == 0) return;

    var select = section.getElementsByTagName("select");
    if (select.length > 0) {
      labelSelection[0].textContent = getSelectLabel(section, select[0]);
      return;
    }

    var number = section.querySelectorAll('input[type="number"]');
    if (number.length > 0) {
      labelSelection[0].textContent = getNumberLabel(section, number);
      return;
    }

    var slider = section.querySelectorAll('input[type="range"]');
    if (slider.length > 0) {
      labelSelection[0].textContent = getSliderLabel(section, slider);
      return;
    }

    var radio = section.querySelectorAll('input[type="radio"]'),
      checkbox = section.querySelectorAll('input[type="checkbox"]');
    if (radio.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, radio);
      return;
    } else if (checkbox.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, checkbox);
      return;
    }
  }

  function getSelectLabel(section, select) {
    if (select.multiple) {
      var label = "",
        counter = 0;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
          label = label + "" + select.options[i].text;
          counter = counter + 1;
        }
        if (counter > 1)
          label = section
            .getAttribute("data-multi-select-text")
            .replace("{n}", counter);
      }
      return label;
    } else {
      return select.options[select.selectedIndex].text;
    }
  }

  function getNumberLabel(section, number) {
    var counter = 0;
    for (var i = 0; i < number.length; i++) {
      if (number[i].value != number[i].min) counter = counter + 1;
    }
    if (number.length > 1) {
      if (counter > 0) {
        return section
          .getAttribute("data-multi-select-text")
          .replace("{n}", counter);
      } else {
        return section.getAttribute("data-default-text");
      }
    } else {
      if (number[0].value == number[0].min)
        return section.getAttribute("data-default-text");
      else
        return section
          .getAttribute("data-number-format")
          .replace("{n}", number[0].value);
    }
  }

  function getSliderLabel(section, slider) {
    var label = "",
      labelFormat = section.getAttribute("data-number-format");
    for (var i = 0; i < slider.length; i++) {
      if (i != 0) label = label + " - ";
      label = label + labelFormat.replace("{n}", slider[i].value);
    }
    return label;
  }

  function getInputListLabel(section, inputs) {
    var counter = 0;
    label = "";
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        var labelElement = inputs[i].parentNode.getElementsByTagName("label");
        if (labelElement.length > 0) label = labelElement[0].textContent;
        counter = counter + 1;
      }
    }
    if (counter > 1)
      return section
        .getAttribute("data-multi-select-text")
        .replace("{n}", counter);
    else if (counter == 0) return section.getAttribute("data-default-text");
    else return label;
  }

  function resetGallery(filter) {
    filter.form[0].dispatchEvent(new CustomEvent("change"));
    filter.resultsList.dispatchEvent(new CustomEvent("update-filter-results"));
  }

  function updateResultsCount(filter) {
    var resultItems = filter.resultsList.children,
      counter = 0;
    for (var i = 0; i < resultItems.length; i++) {
      if (isVisible(resultItems[i])) counter = counter + 1;
    }
    filter.resultsCount[0].textContent = counter;
  }

  function isVisible(element) {
    return (
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  var advFilter = document.getElementsByClassName("js-adv-filter");
  if (advFilter.length > 0) {
    for (var i = 0; i < advFilter.length; i++) {
      (function (i) {
        new AdvFilter(advFilter[i]);
      })(i);
    }
  }
})();

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

(function () {
  var ThumbSlideshow = function (element) {
    this.element = element;
    this.slideshow = this.element.getElementsByClassName("slideshow")[0];
    this.slideshowItems =
      this.slideshow.getElementsByClassName("js-slideshow__item");
    this.carousel = this.element.getElementsByClassName(
      "thumbslide__nav-wrapper"
    )[0];
    this.carouselList = this.carousel.getElementsByClassName(
      "thumbslide__nav-list"
    )[0];
    this.carouselListWrapper =
      this.carousel.getElementsByClassName("thumbslide__nav")[0];
    this.carouselControls = this.element.getElementsByClassName(
      "js-thumbslide__tb-control"
    );

    this.slideshowObj = false;

    this.thumbItems = false;
    this.thumbOriginalWidth = false;
    this.thumbOriginalHeight = false;
    this.thumbVisibItemsNb = false;
    this.itemsWidth = false;
    this.itemsHeight = false;
    this.itemsMargin = false;
    this.thumbTranslateContainer = false;
    this.thumbTranslateVal = 0;

    this.thumbVertical = Util.hasClass(this.element, "thumbslide--vertical");

    this.recursiveDirection = false;

    this.thumbDragging = false;
    this.dragStart = false;

    this.resize = false;

    this.loaded = false;
    initThumbs(this);
    initSlideshow(this);
    checkImageLoad(this);
  };

  function initThumbs(thumbSlider) {
    var carouselItems = "";
    for (var i = 0; i < thumbSlider.slideshowItems.length; i++) {
      var url = thumbSlider.slideshowItems[i].getAttribute("data-thumb"),
        alt = thumbSlider.slideshowItems[i].getAttribute("data-alt");
      if (!alt) alt = "Image Preview";
      carouselItems =
        carouselItems +
        '<li class="thumbslide__nav-item"><img src="' +
        url +
        '" alt="' +
        alt +
        '">' +
        "</li>";
    }
    thumbSlider.carouselList.innerHTML = carouselItems;
    if (!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
    else loadThumbsVerticalLayout(thumbSlider);
  }

  function initThumbsLayout(thumbSlider) {
    thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName(
      "thumbslide__nav-item"
    );

    var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
      itemWidth = parseFloat(itemStyle.getPropertyValue("width")),
      itemMargin = parseFloat(itemStyle.getPropertyValue("margin-right")),
      containerPadding = parseFloat(
        containerStyle.getPropertyValue("padding-left")
      ),
      containerWidth = parseFloat(containerStyle.getPropertyValue("width"));

    if (!thumbSlider.thumbOriginalWidth) {
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
      itemWidth = thumbSlider.thumbOriginalWidth;
    }

    thumbSlider.thumbVisibItemsNb = parseInt(
      (containerWidth - 2 * containerPadding + itemMargin) /
        (itemWidth + itemMargin)
    );
    thumbSlider.itemsWidth =
      (containerWidth - 2 * containerPadding + itemMargin) /
        thumbSlider.thumbVisibItemsNb -
      itemMargin;
    thumbSlider.thumbTranslateContainer =
      (thumbSlider.itemsWidth + itemMargin) * thumbSlider.thumbVisibItemsNb;
    thumbSlider.itemsMargin = itemMargin;

    if (!flexSupported)
      thumbSlider.carouselList.style.width =
        (thumbSlider.itemsWidth + itemMargin) *
          thumbSlider.slideshowItems.length +
        "px";
    setThumbsWidth(thumbSlider);
  }

  function checkImageLoad(thumbSlider) {
    if (!thumbSlider.thumbVertical) {
      updateVisibleThumb(thumbSlider, 0);
      updateThumbControls(thumbSlider);
      initTbSlideshowEvents(thumbSlider);
    } else {
      var image = new Image();
      image.onload = function () {
        thumbSlider.loaded = true;
      };
      image.onerror = function () {
        thumbSlider.loaded = true;
      };
      image.src = thumbSlider.slideshowItems[0].getAttribute("data-thumb");
    }
  }

  function loadThumbsVerticalLayout(thumbSlider) {
    if (thumbSlider.loaded) {
      initThumbsVerticalLayout(thumbSlider);
      updateVisibleThumb(thumbSlider, 0);
      updateThumbControls(thumbSlider);
      initTbSlideshowEvents(thumbSlider);
    } else {
      setTimeout(function () {
        loadThumbsVerticalLayout(thumbSlider);
      }, 100);
    }
  }

  function initThumbsVerticalLayout(thumbSlider) {
    thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName(
      "thumbslide__nav-item"
    );

    var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
      itemWidth = parseFloat(itemStyle.getPropertyValue("width")),
      itemHeight = parseFloat(itemStyle.getPropertyValue("height")),
      itemRatio = itemWidth / itemHeight,
      itemMargin = parseFloat(itemStyle.getPropertyValue("margin-bottom")),
      containerPadding = parseFloat(
        containerStyle.getPropertyValue("padding-top")
      ),
      containerWidth = parseFloat(containerStyle.getPropertyValue("width")),
      containerHeight = parseFloat(containerStyle.getPropertyValue("height"));

    if (!flexSupported)
      containerHeight = parseFloat(
        window.getComputedStyle(thumbSlider.element).getPropertyValue("height")
      );

    if (!thumbSlider.thumbOriginalHeight) {
      thumbSlider.thumbOriginalHeight = itemHeight;
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
      resetOriginalSize(thumbSlider);
      itemHeight = thumbSlider.thumbOriginalHeight;
    }

    thumbSlider.thumbVisibItemsNb = parseInt(
      (containerHeight - 2 * containerPadding + itemMargin) /
        (itemHeight + itemMargin)
    );
    thumbSlider.itemsHeight =
      (containerHeight - 2 * containerPadding + itemMargin) /
        thumbSlider.thumbVisibItemsNb -
      itemMargin;
    (thumbSlider.itemsWidth = thumbSlider.itemsHeight * itemRatio),
      (thumbSlider.thumbTranslateContainer =
        (thumbSlider.itemsHeight + itemMargin) * thumbSlider.thumbVisibItemsNb);
    thumbSlider.itemsMargin = itemMargin;

    if (!flexSupported) {
      thumbSlider.carousel.style.height =
        (thumbSlider.itemsHeight + itemMargin) *
          thumbSlider.slideshowItems.length +
        "px";
      thumbSlider.carouselListWrapper.style.height = containerHeight + "px";
    }
    setThumbsWidth(thumbSlider);
  }

  function setThumbsWidth(thumbSlider) {
    for (var i = 0; i < thumbSlider.thumbItems.length; i++) {
      thumbSlider.thumbItems[i].style.width = thumbSlider.itemsWidth + "px";
      if (thumbSlider.thumbVertical)
        thumbSlider.thumbItems[i].style.height = thumbSlider.itemsHeight + "px";
    }

    if (thumbSlider.thumbVertical) {
      var padding = parseFloat(
        window
          .getComputedStyle(thumbSlider.carouselListWrapper)
          .getPropertyValue("padding-left")
      );
      thumbSlider.carousel.style.width =
        thumbSlider.itemsWidth + 2 * padding + "px";
      if (!flexSupported)
        thumbSlider.slideshow.style.width =
          parseFloat(
            window
              .getComputedStyle(thumbSlider.element)
              .getPropertyValue("width")
          ) -
          (thumbSlider.itemsWidth + 2 * padding) -
          10 +
          "px";
    }
  }

  function initSlideshow(thumbSlider) {
    var autoplay =
        thumbSlider.slideshow.getAttribute("data-autoplay") &&
        thumbSlider.slideshow.getAttribute("data-autoplay") == "on"
          ? true
          : false,
      autoplayInterval = thumbSlider.slideshow.getAttribute(
        "data-autoplay-interval"
      )
        ? thumbSlider.slideshow.getAttribute("data-autoplay-interval")
        : 5000,
      swipe =
        thumbSlider.slideshow.getAttribute("data-swipe") &&
        thumbSlider.slideshow.getAttribute("data-swipe") == "on"
          ? true
          : false;
    thumbSlider.slideshowObj = new Slideshow({
      element: thumbSlider.slideshow,
      navigation: false,
      autoplay: autoplay,
      autoplayInterval: autoplayInterval,
      swipe: swipe,
    });
  }

  function initTbSlideshowEvents(thumbSlider) {
    thumbSlider.slideshowObj.element.addEventListener(
      "newItemSelected",
      function (event) {
        updateVisibleThumb(thumbSlider, event.detail);
      }
    );

    thumbSlider.carouselList.addEventListener("click", function (event) {
      if (thumbSlider.thumbDragging) return;
      var selectedOption = event.target.closest(".thumbslide__nav-item");
      if (
        !selectedOption ||
        Util.hasClass(selectedOption, "thumbslide__nav-item--active")
      )
        return;
      thumbSlider.slideshowObj.showItem(
        Util.getIndexInArray(
          thumbSlider.carouselList.getElementsByClassName(
            "thumbslide__nav-item"
          ),
          selectedOption
        )
      );
    });

    window.addEventListener("resize", function (event) {
      if (thumbSlider.resize) return;
      thumbSlider.resize = true;
      window.requestAnimationFrame(resetThumbsResize.bind(thumbSlider));
    });

    new SwipeContent(thumbSlider.carouselList);
    thumbSlider.carouselList.addEventListener("dragStart", function (event) {
      var coordinate = getDragCoordinate(thumbSlider, event);
      thumbSlider.dragStart = coordinate;
      thumbDragEnd(thumbSlider);
    });
    thumbSlider.carouselList.addEventListener("dragging", function (event) {
      if (!thumbSlider.dragStart) return;
      var coordinate = getDragCoordinate(thumbSlider, event);
      if (
        thumbSlider.slideshowObj.animating ||
        Math.abs(coordinate - thumbSlider.dragStart) < 20
      )
        return;
      Util.addClass(thumbSlider.element, "thumbslide__nav-list--dragging");
      thumbSlider.thumbDragging = true;
      Util.addClass(
        thumbSlider.carouselList,
        "thumbslide__nav-list--no-transition"
      );
      var translate = thumbSlider.thumbVertical ? "translateY" : "translateX";
      setTranslate(
        thumbSlider,
        translate +
          "(" +
          (thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart) +
          "px)"
      );
    });
  }

  function thumbDragEnd(thumbSlider) {
    thumbSlider.carouselList.addEventListener("dragEnd", function cb(event) {
      var coordinate = getDragCoordinate(thumbSlider, event);
      thumbSlider.thumbTranslateVal = resetTranslateToRound(
        thumbSlider,
        thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart
      );
      thumbShowNewItems(thumbSlider, false);
      thumbSlider.dragStart = false;
      Util.removeClass(
        thumbSlider.carouselList,
        "thumbslide__nav-list--no-transition"
      );
      thumbSlider.carouselList.removeEventListener("dragEnd", cb);
      setTimeout(function () {
        thumbSlider.thumbDragging = false;
      }, 50);
      Util.removeClass(thumbSlider.element, "thumbslide__nav-list--dragging");
    });
  }

  function getDragCoordinate(thumbSlider, event) {
    return thumbSlider.thumbVertical ? event.detail.y : event.detail.x;
  }

  function resetTranslateToRound(thumbSlider, value) {
    var dimension = getItemDimension(thumbSlider);
    return (
      Math.round(value / (dimension + thumbSlider.itemsMargin)) *
      (dimension + thumbSlider.itemsMargin)
    );
  }

  function resetThumbsResize() {
    var thumbSlider = this;
    if (!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
    else initThumbsVerticalLayout(thumbSlider);
    setThumbsWidth(thumbSlider);
    var dimension = getItemDimension(thumbSlider);

    if (
      (-1 * thumbSlider.thumbTranslateVal) %
        (dimension + thumbSlider.itemsMargin) >
      0
    ) {
      thumbSlider.thumbTranslateVal =
        -1 *
        parseInt(
          (-1 * thumbSlider.thumbTranslateVal) /
            (dimension + thumbSlider.itemsMargin)
        ) *
        (dimension + thumbSlider.itemsMargin);
      thumbShowNewItems(thumbSlider, false);
    }
    thumbSlider.resize = false;
  }

  function thumbShowNewItems(thumbSlider, direction) {
    var dimension = getItemDimension(thumbSlider);
    if (direction == "next")
      thumbSlider.thumbTranslateVal =
        thumbSlider.thumbTranslateVal - thumbSlider.thumbTranslateContainer;
    else if (direction == "prev")
      thumbSlider.thumbTranslateVal =
        thumbSlider.thumbTranslateVal + thumbSlider.thumbTranslateContainer;

    if (
      -1 * thumbSlider.thumbTranslateVal >=
      (thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) *
        (dimension + thumbSlider.itemsMargin)
    )
      thumbSlider.thumbTranslateVal =
        -1 *
        ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) *
          (dimension + thumbSlider.itemsMargin));
    if (thumbSlider.thumbTranslateVal > 0) thumbSlider.thumbTranslateVal = 0;

    var translate = thumbSlider.thumbVertical ? "translateY" : "translateX";
    setTranslate(
      thumbSlider,
      translate + "(" + thumbSlider.thumbTranslateVal + "px)"
    );
    updateThumbControls(thumbSlider);
  }

  function updateVisibleThumb(thumbSlider, index) {
    var selectedThumb = thumbSlider.carouselList.getElementsByClassName(
      "thumbslide__nav-item--active"
    );
    if (selectedThumb.length > 0)
      Util.removeClass(selectedThumb[0], "thumbslide__nav-item--active");
    Util.addClass(
      thumbSlider.thumbItems[index],
      "thumbslide__nav-item--active"
    );

    recursiveUpdateThumb(thumbSlider, index);
  }

  function recursiveUpdateThumb(thumbSlider, index) {
    var dimension = getItemDimension(thumbSlider);
    if (
      (index + 1 - thumbSlider.thumbVisibItemsNb) *
        (dimension + thumbSlider.itemsMargin) +
        thumbSlider.thumbTranslateVal >=
        0 ||
      (index * (dimension + thumbSlider.itemsMargin) +
        thumbSlider.thumbTranslateVal <=
        0 &&
        thumbSlider.thumbTranslateVal < 0)
    ) {
      var increment =
        (index + 1 - thumbSlider.thumbVisibItemsNb) *
          (dimension + thumbSlider.itemsMargin) +
          thumbSlider.thumbTranslateVal >=
        0
          ? 1
          : -1;
      if (
        !thumbSlider.recursiveDirection ||
        thumbSlider.recursiveDirection == increment
      ) {
        thumbSlider.thumbTranslateVal =
          -1 * increment * (dimension + thumbSlider.itemsMargin) +
          thumbSlider.thumbTranslateVal;
        thumbSlider.recursiveDirection = increment;
        recursiveUpdateThumb(thumbSlider, index);
      } else {
        thumbSlider.recursiveDirection = false;
        thumbShowNewItems(thumbSlider, false);
      }
    } else {
      thumbSlider.recursiveDirection = false;
      thumbShowNewItems(thumbSlider, false);
    }
  }

  function updateThumbControls(thumbSlider) {
    var dimension = getItemDimension(thumbSlider);
    Util.toggleClass(
      thumbSlider.carouselListWrapper,
      "thumbslide__nav--scroll-start",
      thumbSlider.thumbTranslateVal != 0
    );
    Util.toggleClass(
      thumbSlider.carouselListWrapper,
      "thumbslide__nav--scroll-end",
      thumbSlider.thumbTranslateVal !=
        -1 *
          ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) *
            (dimension + thumbSlider.itemsMargin)) &&
        thumbSlider.thumbItems.length > thumbSlider.thumbVisibItemsNb
    );
    if (thumbSlider.carouselControls.length == 0) return;
    Util.toggleClass(
      thumbSlider.carouselControls[0],
      "thumbslide__tb-control--disabled",
      thumbSlider.thumbTranslateVal == 0
    );
    Util.toggleClass(
      thumbSlider.carouselControls[1],
      "thumbslide__tb-control--disabled",
      thumbSlider.thumbTranslateVal ==
        -1 *
          ((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb) *
            (dimension + thumbSlider.itemsMargin))
    );
  }

  function getItemDimension(thumbSlider) {
    return thumbSlider.thumbVertical
      ? thumbSlider.itemsHeight
      : thumbSlider.itemsWidth;
  }

  function setTranslate(thumbSlider, translate) {
    thumbSlider.carouselList.style.transform = translate;
    thumbSlider.carouselList.style.msTransform = translate;
  }

  function resetOriginalSize(thumbSlider) {
    if (!Util.cssSupports("color", "var(--var-name)")) return;
    var thumbWidth = parseInt(
      getComputedStyle(thumbSlider.element).getPropertyValue(
        "--thumbslide-thumbnail-auto-size"
      )
    );
    if (thumbWidth == thumbSlider.thumbOriginalWidth) return;
    thumbSlider.thumbOriginalHeight = parseFloat(
      thumbSlider.thumbOriginalHeight *
        (thumbWidth / thumbSlider.thumbOriginalWidth)
    );
    thumbSlider.thumbOriginalWidth = thumbWidth;
  }

  var thumbSlideshows = document.getElementsByClassName("js-thumbslide"),
    flexSupported = Util.cssSupports("align-items", "stretch");
  if (thumbSlideshows.length > 0) {
    for (var i = 0; i < thumbSlideshows.length; i++) {
      (function (i) {
        new ThumbSlideshow(thumbSlideshows[i]);
      })(i);
    }
  }
})();

(function () {
  function initColorSwatches(product) {
    var slideshow = product.getElementsByClassName("js-product-v2__slideshow"),
      colorSwatches = product.getElementsByClassName(
        "js-color-swatches__select"
      );
    if (slideshow.length == 0 || colorSwatches.length == 0) return;

    var slideshowItems =
      slideshow[0].getElementsByClassName("js-slideshow__item");

    colorSwatches[0].addEventListener("change", function (event) {
      selectNewSlideshowItem(
        colorSwatches[0].options[colorSwatches[0].selectedIndex].value,
        slideshow[0],
        slideshowItems
      );
    });
  }

  function selectNewSlideshowItem(value, slideshow, items) {
    var selectedItem = document.getElementById("item-" + value);
    if (!selectedItem) return;
    var event = new CustomEvent("selectNewItem", {
      detail: Util.getIndexInArray(items, selectedItem) + 1,
    });
    slideshow.dispatchEvent(event);
  }

  var productV2 = document.getElementsByClassName("js-product-v2");
  if (productV2.length > 0) {
    for (var i = 0; i < productV2.length; i++) {
      (function (i) {
        initColorSwatches(productV2[i]);
      })(i);
    }
  }
})();
