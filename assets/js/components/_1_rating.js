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
