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
    this.labelContent = "";
    if (this.label) this.labelContent = ", " + this.label.textContent;

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

    Util.addClass(select.select, "ca8-hide");
    if (select.arrowIcon.length > 0) select.arrowIcon[0].style.display = "none";

    select.minWidth = parseInt(
      getComputedStyle(select.dropdown).getPropertyValue("min-width")
    );

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
    if (select.minWidth < triggerBoundingRect.width) {
      select.dropdown.setAttribute(
        "style",
        "max-height: " +
          maxHeight +
          "px; min-width: " +
          triggerBoundingRect.width +
          "px;"
      );
    } else {
      select.dropdown.setAttribute("style", "max-height: " + maxHeight + "px;");
    }
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
    select.select.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  }

  function updateTriggerAria(select) {
    select.trigger.setAttribute(
      "aria-label",
      select.options[select.select.selectedIndex].innerHTML +
        select.labelContent
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
      select.labelContent;

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
        '<p class="ca8-sr-only" id="' +
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
          : ' aria-selected="false"',
        disabled = options[i].hasAttribute("disabled") ? " disabled" : "";
      list =
        list +
        '<li><button type="button" class="js-select__item select__item select__item--option" role="option" data-value="' +
        options[i].value +
        '" ' +
        selected +
        disabled +
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
