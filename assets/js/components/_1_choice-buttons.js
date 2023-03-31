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
