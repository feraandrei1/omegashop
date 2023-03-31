(function () {
  var Filter = function (opts) {
    this.options = Util.extend(Filter.defaults, opts);
    this.element = this.options.element;
    this.elementId = this.element.getAttribute("id");
    this.items = this.element.querySelectorAll(".js-filter__item");
    this.controllers = document.querySelectorAll(
      '[aria-controls="' + this.elementId + '"]'
    );
    this.fallbackMessage = document.querySelector(
      '[data-fallback-gallery-id="' + this.elementId + '"]'
    );
    this.filterString = [];
    this.sortingString = "";

    this.filterList = [];
    this.sortingList = [];

    this.itemsGrid = [];
    this.itemsInitPosition = [];
    this.itemsIterPosition = [];
    this.itemsFinalPosition = [];

    this.animateOff =
      this.element.getAttribute("data-filter-animation") == "off";

    this.resizingId = false;

    this.accelerateStyle =
      "will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;";

    this.animating = false;
    this.reanimate = false;

    initFilter(this);
  };

  function initFilter(filter) {
    resetFilterSortArray(filter, true, true);
    createGridInfo(filter);
    initItemsOrder(filter);

    for (var i = 0; i < filter.controllers.length; i++) {
      filter.filterString[i] = "";

      (function (i) {
        filter.controllers[i].addEventListener("change", function (event) {
          if (event.target.tagName.toLowerCase() == "select") {
            !event.target.getAttribute("data-filter")
              ? setSortingString(
                  filter,
                  event.target.value,
                  event.target.options[event.target.selectedIndex]
                )
              : setFilterString(filter, i, "select");
          } else if (
            event.target.tagName.toLowerCase() == "input" &&
            (event.target.getAttribute("type") == "radio" ||
              event.target.getAttribute("type") == "checkbox")
          ) {
            !event.target.getAttribute("data-filter")
              ? setSortingString(
                  filter,
                  event.target.getAttribute("data-sort"),
                  event.target
                )
              : setFilterString(filter, i, "input");
          } else {
            !filter.controllers[i].getAttribute("data-filter")
              ? setSortingString(
                  filter,
                  filter.controllers[i].getAttribute("data-sort"),
                  filter.controllers[i]
                )
              : setFilterString(filter, i, "custom");
          }

          updateFilterArray(filter);
        });

        filter.controllers[i].addEventListener("click", function (event) {
          var filterEl = event.target.closest("[data-filter]");
          var sortEl = event.target.closest("[data-sort]");
          if (!filterEl && !sortEl) return;
          if (
            filterEl &&
            (filterEl.tagName.toLowerCase() == "input" ||
              filterEl.tagName.toLowerCase() == "select")
          )
            return;
          if (
            sortEl &&
            (sortEl.tagName.toLowerCase() == "input" ||
              sortEl.tagName.toLowerCase() == "select")
          )
            return;
          if (sortEl && Util.hasClass(sortEl, "js-filter__custom-control"))
            return;
          if (filterEl && Util.hasClass(filterEl, "js-filter__custom-control"))
            return;

          event.preventDefault();
          resetControllersList(filter, i, filterEl, sortEl);
          sortEl
            ? setSortingString(filter, sortEl.getAttribute("data-sort"), sortEl)
            : setFilterString(filter, i, "button");
          updateFilterArray(filter);
        });

        filter.controllers[i].addEventListener("input", function (event) {
          if (
            event.target.tagName.toLowerCase() == "input" &&
            (event.target.getAttribute("type") == "search" ||
              event.target.getAttribute("type") == "text")
          ) {
            setFilterString(filter, i, "custom");
            updateFilterArray(filter);
          }
        });
      })(i);
    }

    window.addEventListener("resize", function () {
      clearTimeout(filter.resizingId);
      filter.resizingId = setTimeout(function () {
        createGridInfo(filter);
      }, 300);
    });

    checkInitialFiltering(filter);

    filter.element.addEventListener("update-filter-results", function (event) {
      for (var i = 0; i < filter.controllers.length; i++)
        filter.filterString[i] = "";
      filter.sortingString = "";
      checkInitialFiltering(filter);
    });
  }

  function checkInitialFiltering(filter) {
    for (var i = 0; i < filter.controllers.length; i++) {
      var selectedButton =
        filter.controllers[i].getElementsByClassName("js-filter-selected");
      if (selectedButton.length > 0) {
        var sort = selectedButton[0].getAttribute("data-sort");
        sort
          ? setSortingString(
              filter,
              selectedButton[0].getAttribute("data-sort"),
              selectedButton[0]
            )
          : setFilterString(filter, i, "button");
        continue;
      }

      var selectedInput =
        filter.controllers[i].querySelectorAll("input:checked");
      if (selectedInput.length > 0) {
        var sort = selectedInput[0].getAttribute("data-sort");
        sort
          ? setSortingString(filter, sort, selectedInput[0])
          : setFilterString(filter, i, "input");
        continue;
      }

      if (filter.controllers[i].tagName.toLowerCase() == "select") {
        var sort = filter.controllers[i].getAttribute("data-sort");
        sort
          ? setSortingString(
              filter,
              filter.controllers[i].value,
              filter.controllers[i].options[filter.controllers[i].selectedIndex]
            )
          : setFilterString(filter, i, "select");
        continue;
      }

      var radioInput = filter.controllers[i].querySelector(
          'input[type="radio"]'
        ),
        checkboxInput = filter.controllers[i].querySelector(
          'input[type="checkbox"]'
        );
      if (!radioInput && !checkboxInput) {
        var sort = filter.controllers[i].getAttribute("data-sort");
        var filterString = filter.controllers[i].getAttribute("data-filter");
        if (sort) setSortingString(filter, sort, filter.controllers[i]);
        else if (filterString) setFilterString(filter, i, "custom");
      }
    }

    updateFilterArray(filter);
  }

  function setSortingString(filter, value, item) {
    var order = item.getAttribute("data-sort-order") ? "desc" : "asc";
    var type = item.getAttribute("data-sort-number") ? "number" : "string";
    filter.sortingString = value + ":" + order + ":" + type;
  }

  function setFilterString(filter, index, type) {
    if (type == "input") {
      var checkedInputs =
        filter.controllers[index].querySelectorAll("input:checked");
      filter.filterString[index] = "";
      for (var i = 0; i < checkedInputs.length; i++) {
        filter.filterString[index] =
          filter.filterString[index] +
          checkedInputs[i].getAttribute("data-filter") +
          ":";
      }
    } else if (type == "select") {
      if (filter.controllers[index].multiple) {
        filter.filterString[index] = getMultipleSelectValues(
          filter.controllers[index]
        );
      } else {
        filter.filterString[index] = filter.controllers[index].value;
      }
    } else if (type == "button") {
      var selectedButtons = filter.controllers[index].querySelectorAll(
        ".js-filter-selected"
      );
      filter.filterString[index] = "";
      for (var i = 0; i < selectedButtons.length; i++) {
        filter.filterString[index] =
          filter.filterString[index] +
          selectedButtons[i].getAttribute("data-filter") +
          ":";
      }
    } else if (type == "custom") {
      filter.filterString[index] =
        filter.controllers[index].getAttribute("data-filter");
    }
  }

  function resetControllersList(filter, index, target1, target2) {
    var multi = filter.controllers[index].getAttribute("data-filter-checkbox"),
      customClass = filter.controllers[index].getAttribute(
        "data-selected-class"
      );

    customClass = customClass
      ? "js-filter-selected " + customClass
      : "js-filter-selected";
    if (multi == "true") {
      target1
        ? Util.toggleClass(
            target1,
            customClass,
            !Util.hasClass(target1, "js-filter-selected")
          )
        : Util.toggleClass(
            target2,
            customClass,
            !Util.hasClass(target2, "js-filter-selected")
          );
    } else {
      var selectedOption = filter.controllers[index].querySelector(
        ".js-filter-selected"
      );
      if (selectedOption) Util.removeClass(selectedOption, customClass);
      target1
        ? Util.addClass(target1, customClass)
        : Util.addClass(target2, customClass);
    }
  }

  function updateFilterArray(filter) {
    if (filter.animating) {
      filter.reanimate = true;
      return;
    }
    filter.animating = true;
    filter.reanimate = false;
    createGridInfo(filter);
    sortingGallery(filter);
    filteringGallery(filter);
    resetFallbackMessage(filter, true);
    if (reducedMotion || filter.animateOff) {
      resetItems(filter);
    } else {
      updateItemsAttributes(filter);
    }
  }

  function sortingGallery(filter) {
    var sortOptions = filter.sortingString.split(":");
    if (sortOptions[0] == "" || sortOptions[0] == "*") {
      restoreSortOrder(filter);
    } else {
      if (filter.options[sortOptions[0]]) {
        filter.sortingList = filter.options[sortOptions[0]](filter.sortingList);
      } else {
        filter.sortingList.sort(function (left, right) {
          var leftVal = left[0].getAttribute("data-sort-" + sortOptions[0]),
            rightVal = right[0].getAttribute("data-sort-" + sortOptions[0]);
          if (sortOptions[2] == "number") {
            leftVal = parseFloat(leftVal);
            rightVal = parseFloat(rightVal);
          }
          if (sortOptions[1] == "desc") return leftVal <= rightVal ? 1 : -1;
          else return leftVal >= rightVal ? 1 : -1;
        });
      }
    }
  }

  function filteringGallery(filter) {
    resetFilterSortArray(filter, true, false);

    for (var i = 0; i < filter.filterString.length; i++) {
      if (
        filter.filterString[i] != "" &&
        filter.filterString[i] != "*" &&
        filter.filterString[i] != " "
      ) {
        singleFilterGallery(filter, filter.filterString[i].split(":"));
      }
    }
  }

  function singleFilterGallery(filter, subfilter) {
    if (!subfilter || subfilter == "" || subfilter == "*") return;

    var customFilterArray = [];
    for (var j = 0; j < subfilter.length; j++) {
      if (filter.options[subfilter[j]]) {
        customFilterArray[subfilter[j]] = filter.options[subfilter[j]](
          filter.items
        );
      }
    }

    for (var i = 0; i < filter.items.length; i++) {
      var filterValues = filter.items[i].getAttribute("data-filter").split(" ");
      var present = false;
      for (var j = 0; j < subfilter.length; j++) {
        if (
          filter.options[subfilter[j]] &&
          customFilterArray[subfilter[j]][i]
        ) {
          present = true;
          break;
        } else if (
          subfilter[j] == "*" ||
          filterValues.indexOf(subfilter[j]) > -1
        ) {
          present = true;
          break;
        }
      }
      filter.filterList[i] = !present ? false : filter.filterList[i];
    }
  }

  function updateItemsAttributes(filter) {
    storeOffset(filter, filter.itemsInitPosition);

    filter.element.setAttribute(
      "style",
      "height: " +
        parseFloat(filter.element.offsetHeight) +
        "px; width: " +
        parseFloat(filter.element.offsetWidth) +
        "px;"
    );

    for (var i = 0; i < filter.items.length; i++) {
      if (Util.hasClass(filter.items[i], "fe6-hide") && filter.filterList[i]) {
        filter.items[i].setAttribute("data-scale", "on");
        filter.items[i].setAttribute(
          "style",
          filter.accelerateStyle + "transform: scale(0.5); opacity: 0;"
        );
        Util.removeClass(filter.items[i], "fe6-hide");
      }
    }

    storeOffset(filter, filter.itemsIterPosition);

    for (var i = 0; i < filter.items.length; i++) {
      if (filter.items[i].getAttribute("data-scale") != "on") {
        filter.items[i].setAttribute(
          "style",
          filter.accelerateStyle +
            "transform: translateX(" +
            parseInt(
              filter.itemsInitPosition[i][0] - filter.itemsIterPosition[i][0]
            ) +
            "px) translateY(" +
            parseInt(
              filter.itemsInitPosition[i][1] - filter.itemsIterPosition[i][1]
            ) +
            "px);"
        );
      }
    }

    animateItems(filter);
  }

  function animateItems(filter) {
    var transitionValue =
      "transform " +
      filter.options.duration +
      "ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity " +
      filter.options.duration +
      "ms";

    var j = 0;
    for (var i = 0; i < filter.sortingList.length; i++) {
      var item = filter.items[filter.sortingList[i][1]];

      if (
        Util.hasClass(item, "fe6-hide") ||
        !filter.filterList[filter.sortingList[i][1]]
      ) {
        filter.itemsFinalPosition[filter.sortingList[i][1]] =
          filter.itemsIterPosition[filter.sortingList[i][1]];
        if (item.getAttribute("data-scale") == "on") j = j + 1;
      } else {
        filter.itemsFinalPosition[filter.sortingList[i][1]] = [
          filter.itemsGrid[j][0],
          filter.itemsGrid[j][1],
        ];
        j = j + 1;
      }
    }

    setTimeout(function () {
      for (var i = 0; i < filter.items.length; i++) {
        if (
          filter.filterList[i] &&
          filter.items[i].getAttribute("data-scale") == "on"
        ) {
          filter.items[i].setAttribute(
            "style",
            filter.accelerateStyle +
              "transition: " +
              transitionValue +
              "; transform: translateX(" +
              parseInt(
                filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0]
              ) +
              "px) translateY(" +
              parseInt(
                filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1]
              ) +
              "px) scale(1); opacity: 1;"
          );
        } else if (filter.filterList[i]) {
          filter.items[i].setAttribute(
            "style",
            filter.accelerateStyle +
              "transition: " +
              transitionValue +
              "; transform: translateX(" +
              parseInt(
                filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0]
              ) +
              "px) translateY(" +
              parseInt(
                filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1]
              ) +
              "px);"
          );
        } else {
          filter.items[i].setAttribute(
            "style",
            filter.accelerateStyle +
              "transition: " +
              transitionValue +
              "; transform: scale(0.5); opacity: 0;"
          );
        }
      }
    }, 50);

    setTimeout(function () {
      resetItems(filter);
    }, filter.options.duration + 100);
  }

  function resetItems(filter) {
    for (var i = 0; i < filter.items.length; i++) {
      filter.items[i].removeAttribute("style");
      Util.toggleClass(filter.items[i], "fe6-hide", !filter.filterList[i]);
      filter.items[i].removeAttribute("data-scale");
    }

    for (var i = 0; i < filter.items.length; i++) {
      filter.element.appendChild(filter.items[filter.sortingList[i][1]]);
    }

    filter.items = [];
    filter.items = filter.element.querySelectorAll(".js-filter__item");
    resetFilterSortArray(filter, false, true);
    filter.element.removeAttribute("style");
    filter.animating = false;
    if (filter.reanimate) {
      updateFilterArray(filter);
    }

    resetFallbackMessage(filter, false);

    filter.element.dispatchEvent(new CustomEvent("filter-selection-updated"));
  }

  function resetFilterSortArray(filter, filtering, sorting) {
    for (var i = 0; i < filter.items.length; i++) {
      if (filtering) filter.filterList[i] = true;
      if (sorting) filter.sortingList[i] = [filter.items[i], i];
    }
  }

  function createGridInfo(filter) {
    var containerWidth = parseFloat(
        window.getComputedStyle(filter.element).getPropertyValue("width")
      ),
      itemStyle,
      itemWidth,
      itemHeight,
      marginX,
      marginY,
      colNumber;

    for (var i = 0; i < filter.items.length; i++) {
      if (!Util.hasClass(filter.items[i], "fe6-hide")) {
        (itemStyle = window.getComputedStyle(filter.items[i])),
          (itemWidth = parseFloat(itemStyle.getPropertyValue("width"))),
          (itemHeight = parseFloat(itemStyle.getPropertyValue("height"))),
          (marginX =
            parseFloat(itemStyle.getPropertyValue("margin-left")) +
            parseFloat(itemStyle.getPropertyValue("margin-right"))),
          (marginY =
            parseFloat(itemStyle.getPropertyValue("margin-bottom")) +
            parseFloat(itemStyle.getPropertyValue("margin-top")));
        if (marginX == 0 && marginY == 0) {
          var margins = resetMarginValues(filter);
          marginX = margins[0];
          marginY = margins[1];
        }
        var colNumber = parseInt(
          (containerWidth + marginX) / (itemWidth + marginX)
        );
        filter.itemsGrid[0] = [
          filter.items[i].offsetLeft,
          filter.items[i].offsetTop,
        ];
        break;
      }
    }

    for (var i = 1; i < filter.items.length; i++) {
      var x = i < colNumber ? i : i % colNumber,
        y = i < colNumber ? 0 : Math.floor(i / colNumber);
      filter.itemsGrid[i] = [
        filter.itemsGrid[0][0] + x * (itemWidth + marginX),
        filter.itemsGrid[0][1] + y * (itemHeight + marginY),
      ];
    }
  }

  function storeOffset(filter, array) {
    for (var i = 0; i < filter.items.length; i++) {
      array[i] = [filter.items[i].offsetLeft, filter.items[i].offsetTop];
    }
  }

  function initItemsOrder(filter) {
    for (var i = 0; i < filter.items.length; i++) {
      filter.items[i].setAttribute("data-init-sort-order", i);
    }
  }

  function restoreSortOrder(filter) {
    for (var i = 0; i < filter.items.length; i++) {
      filter.sortingList[
        parseInt(filter.items[i].getAttribute("data-init-sort-order"))
      ] = [filter.items[i], i];
    }
  }

  function resetFallbackMessage(filter, bool) {
    if (!filter.fallbackMessage) return;
    var show = true;
    for (var i = 0; i < filter.filterList.length; i++) {
      if (filter.filterList[i]) {
        show = false;
        break;
      }
    }
    if (bool) {
      if (!show) Util.addClass(filter.fallbackMessage, "fe6-hide");
      return;
    }
    Util.toggleClass(filter.fallbackMessage, "fe6-hide", !show);
  }

  function getMultipleSelectValues(multipleSelect) {
    var options = multipleSelect.options,
      value = "";
    for (var i = 0; i < options.length; i++) {
      if (options[i].selected) {
        if (value != "") value = value + ":";
        value = value + options[i].value;
      }
    }
    return value;
  }

  function resetMarginValues(filter) {
    var gapX = getComputedStyle(filter.element).getPropertyValue("--gap-x"),
      gapY = getComputedStyle(filter.element).getPropertyValue("--gap-y"),
      gap = getComputedStyle(filter.element).getPropertyValue("--gap"),
      gridGap = [0, 0];

    var newDiv = document.createElement("div"),
      cssText = "position: absolute; opacity: 0; width: 0px; height: 0px";
    if (gapX && gapY) {
      cssText =
        "position: absolute; opacity: 0; width: " + gapX + "; height: " + gapY;
    } else if (gap) {
      cssText =
        "position: absolute; opacity: 0; width: " + gap + "; height: " + gap;
    } else if (gapX) {
      cssText =
        "position: absolute; opacity: 0; width: " + gapX + "; height: 0px";
    } else if (gapY) {
      cssText = "position: absolute; opacity: 0; width: 0px; height: " + gapY;
    } else {
      gapX = getGridGap(filter, "columns", filter.element.offsetWidth);
      gapY = getGridGap(filter, "rows", filter.element.offsetHeight);
      if (isNaN(gapY)) gapY = gapX;
      cssText =
        "position: absolute; opacity: 0; width: " + gapX + "; height: " + gapY;
    }
    newDiv.style.cssText = cssText;
    filter.element.appendChild(newDiv);
    var boundingRect = newDiv.getBoundingClientRect();
    gridGap = [boundingRect.width, boundingRect.height];
    filter.element.removeChild(newDiv);
    return gridGap;
  }

  function getGridGap(filter, direction, containerSize) {
    var computedStyle = getComputedStyle(filter.element),
      template = computedStyle.getPropertyValue("grid-template-" + direction);

    var arrayEl = template.split(" "),
      gap =
        (containerSize - parseFloat(arrayEl[0]) * arrayEl.length) /
        (arrayEl.length - 1);
    return gap + "px";
  }

  Filter.defaults = {
    element: false,
    duration: 400,
  };

  window.Filter = Filter;

  var filterGallery = document.getElementsByClassName("js-filter"),
    reducedMotion = Util.osHasReducedMotion();
  if (filterGallery.length > 0) {
    for (var i = 0; i < filterGallery.length; i++) {
      var duration = filterGallery[i].getAttribute("data-filter-duration");
      if (!duration) duration = Filter.defaults.duration;
      new Filter({ element: filterGallery[i], duration: duration });
    }
  }
})();
