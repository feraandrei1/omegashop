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
