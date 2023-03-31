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
