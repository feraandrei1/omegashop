(function () {
  var Tab = function (element) {
    this.element = element;
    this.tabList = this.element.getElementsByClassName("js-tabs__controls")[0];
    this.listItems = this.tabList.getElementsByTagName("li");
    this.triggers = this.tabList.getElementsByTagName("a");
    this.panelsList = this.element.getElementsByClassName("js-tabs__panels")[0];
    this.panels = Util.getChildrenByClassName(
      this.panelsList,
      "js-tabs__panel"
    );
    this.hideClass = "is-hidden";
    this.customShowClass = this.element.getAttribute("data-show-panel-class")
      ? this.element.getAttribute("data-show-panel-class")
      : false;
    this.initTab();
  };

  Tab.prototype.initTab = function () {
    this.tabList.setAttribute("role", "tablist");
    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == 0,
        panelId = this.panels[i].getAttribute("id");
      this.listItems[i].setAttribute("role", "presentation");
      Util.setAttributes(this.triggers[i], {
        role: "tab",
        "aria-selected": bool,
        "aria-controls": panelId,
        id: "tab-" + panelId,
      });
      Util.addClass(this.triggers[i], "js-tabs__trigger");
      Util.setAttributes(this.panels[i], {
        role: "tabpanel",
        "aria-labelledby": "tab-" + panelId,
      });
      Util.toggleClass(this.panels[i], this.hideClass, !bool);

      if (!bool) this.triggers[i].setAttribute("tabindex", "-1");
    }

    this.initTabEvents();
  };

  Tab.prototype.initTabEvents = function () {
    var self = this;

    this.tabList.addEventListener("click", function (event) {
      if (event.target.closest(".js-tabs__trigger"))
        self.triggerTab(event.target.closest(".js-tabs__trigger"), event);
    });

    this.tabList.addEventListener("keydown", function (event) {
      if (!event.target.closest(".js-tabs__trigger")) return;
      if (
        (event.keyCode && event.keyCode == 39) ||
        (event.key && event.key == "ArrowRight")
      ) {
        self.selectNewTab("next");
      } else if (
        (event.keyCode && event.keyCode == 37) ||
        (event.key && event.key == "ArrowLeft")
      ) {
        self.selectNewTab("prev");
      }
    });
  };

  Tab.prototype.selectNewTab = function (direction) {
    var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
      index = Util.getIndexInArray(this.triggers, selectedTab);
    index = direction == "next" ? index + 1 : index - 1;

    if (index < 0) index = this.listItems.length - 1;
    if (index >= this.listItems.length) index = 0;
    this.triggerTab(this.triggers[index]);
    this.triggers[index].focus();
  };

  Tab.prototype.triggerTab = function (tabTrigger, event) {
    var self = this;
    event && event.preventDefault();
    var index = Util.getIndexInArray(this.triggers, tabTrigger);

    if (this.triggers[index].getAttribute("aria-selected") == "true") return;

    for (var i = 0; i < this.triggers.length; i++) {
      var bool = i == index;
      Util.toggleClass(this.panels[i], this.hideClass, !bool);
      if (this.customShowClass)
        Util.toggleClass(this.panels[i], this.customShowClass, bool);
      this.triggers[i].setAttribute("aria-selected", bool);
      bool
        ? this.triggers[i].setAttribute("tabindex", "0")
        : this.triggers[i].setAttribute("tabindex", "-1");
    }
  };

  var tabs = document.getElementsByClassName("js-tabs");
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      (function (i) {
        new Tab(tabs[i]);
      })(i);
    }
  }
})();
