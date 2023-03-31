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
