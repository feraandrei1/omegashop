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

  var gallery = document.getElementById("adv-filter-gallery");
  if (gallery) {
    new Filter({
      element: gallery,
      priceRange: function (items) {
        var filteredArray = [],
          minVal = document.getElementById("slider-min-value").value,
          maxVal = document.getElementById("slider-max-value").value;
        for (var i = 0; i < items.length; i++) {
          var price = parseInt(items[i].getAttribute("data-price"));
          filteredArray[i] = price >= minVal && price <= maxVal;
        }
        return filteredArray;
      },
      indexValue: function (items) {
        var filteredArray = [],
          value = document.getElementById("index-value").value;
        for (var i = 0; i < items.length; i++) {
          var index = parseInt(items[i].getAttribute("data-sort-index"));
          filteredArray[i] = index >= value;
        }
        return filteredArray;
      },
      searchInput: function (items) {
        var filteredArray = [],
          value = document.getElementById("search-products").value;
        for (var i = 0; i < items.length; i++) {
          var searchFilter = items[i].getAttribute("data-search");
          filteredArray[i] =
            searchFilter == "" ||
            searchFilter.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }
        return filteredArray;
      },
    });
  }
})();
