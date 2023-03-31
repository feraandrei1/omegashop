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
