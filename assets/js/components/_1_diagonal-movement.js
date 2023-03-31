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
