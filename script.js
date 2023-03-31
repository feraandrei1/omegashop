const searchIcon = document.querySelector(".search i");
const searchInput = document.querySelector(".search input");
searchIcon.onclick = () => {
  searchIcon.style.display = "none";
  searchIcon.parentElement.querySelector("input").style.display = "block";
  searchIcon.parentElement.querySelector("input").focus();
};
searchInput.onkeyup = (event) => {
  if (event.keyCode === 13 && searchInput.value.length > 0) {
    if (rewrite_url) {
      window.location.href = encodeURI(
        base_url + "search/" + searchInput.value
      );
    } else {
      window.location.href = encodeURI(
        base_url + "index.php?page=search&query=" + searchInput.value
      );
    }
  }
};
if (document.querySelector(".product-img-small")) {
  let imgs = document.querySelectorAll(".product-img-small img");
  imgs.forEach((img) => {
    img.onmouseover = () => {
      document.querySelector(".product-img-large img").src = img.src;
      imgs.forEach((i) => i.parentElement.classList.remove("selected"));
      img.parentElement.classList.add("selected");
    };
    img.onclick = () => {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
            <div class="img-modal">
                <div>
                    <a href="#" class="close">&times;</a>
                    <img src="${img.src}" alt="">
                </div>
            </div>
            `
      );
      // document.querySelector(".img-modal div").style.height =
      //   document.querySelector(".img-modal img").height + 80 + "px";
      document.querySelector(".img-modal .close").onclick = (event) => {
        event.preventDefault();
        document.querySelector(".img-modal").remove();
      };
      document.querySelector(".img-modal").onclick = (event) => {
        if (event.target.classList.contains("img-modal"))
          document.querySelector(".img-modal").remove();
      };
    };
  });
}
if (document.querySelector(".product #product-form")) {
  let updatePrice = () => {
    let price = parseFloat(
      document.querySelector(".product .price").dataset.price
    );
    document.querySelectorAll(".product #product-form .option").forEach((e) => {
      if (e.value) {
        let optionPrice =
          e.classList.contains("text") || e.classList.contains("datetime")
            ? e.dataset.price
            : 0.0;
        optionPrice = e.classList.contains("select")
          ? e.options[e.selectedIndex].dataset.price
          : optionPrice;
        optionPrice =
          (e.classList.contains("radio") || e.classList.contains("checkbox")) &&
          e.checked
            ? e.dataset.price
            : optionPrice;
        price =
          (e.classList.contains("select")
            ? e.options[e.selectedIndex].dataset.modifier
            : e.dataset.modifier) == "add"
            ? price + parseFloat(optionPrice)
            : price - parseFloat(optionPrice);
      }
    });
    document.querySelector(".product .price").innerHTML =
      currency_code + (price > 0.0 ? price.toFixed(2) : 0.0);
  };
  document
    .querySelectorAll(".product #product-form .option")
    .forEach((ele) => (ele.onchange = () => updatePrice()));
  updatePrice();
}
if (document.querySelector(".products-form")) {
  let products_form_submit = () => {
    document.querySelector(".products-form");
    if (rewrite_url) {
      window.location.href = encodeURI(
        base_url +
          "products/" +
          document.querySelector(".category select").value +
          "/" +
          document.querySelector(".sortby select").value
      );
    } else {
      window.location.href = encodeURI(
        base_url +
          "index.php?page=products&category=" +
          document.querySelector(".category select").value +
          "&sort=" +
          document.querySelector(".sortby select").value
      );
    }
  };
  document.querySelector(".sortby select").onchange = () =>
    products_form_submit();
  document.querySelector(".category select").onchange = () =>
    products_form_submit();
}
document.querySelector(".responsive-toggle").onclick = (event) => {
  event.preventDefault();
  let nav_display = document.querySelector("header nav").style.display;
  document.querySelector("header nav").style.display =
    nav_display == "block" ? "none" : "block";
};
if (document.querySelector(".cart .ajax-update")) {
  document.querySelectorAll(".cart .ajax-update").forEach((ele) => {
    ele.onchange = () => {
      let formEle = document.querySelector(".cart form");
      let formData = new FormData(formEle);
      formData.append("update", "Update");
      fetch(formEle.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((html) => {
          let doc = new DOMParser().parseFromString(html, "text/html");
          document.querySelector(".total").innerHTML =
            doc.querySelector(".total").innerHTML;
          document.querySelectorAll(".product-total").forEach((e, i) => {
            e.innerHTML = doc.querySelectorAll(".product-total")[i].innerHTML;
          });
        });
    };
  });
}
const checkoutHandler = () => {
  if (document.querySelector(".checkout .ajax-update")) {
    document.querySelectorAll(".checkout .ajax-update").forEach((ele) => {
      ele.onchange = () => {
        let formEle = document.querySelector(".checkout form");
        let formData = new FormData(formEle);
        formData.append("update", "Update");
        fetch(formEle.action, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((html) => {
            let doc = new DOMParser().parseFromString(html, "text/html");
            document.querySelector(".summary").innerHTML =
              doc.querySelector(".summary").innerHTML;
            document.querySelector(".total").innerHTML =
              doc.querySelector(".total").innerHTML;
            document.querySelector(".discount-code .result").innerHTML =
              doc.querySelector(".discount-code .result").innerHTML;
            document.querySelector(".shipping-methods-container").innerHTML =
              doc.querySelector(".shipping-methods-container").innerHTML;
            checkoutHandler();
          });
      };
      if (ele.name == "discount_code") {
        ele.onkeydown = (event) => {
          if (event.key == "Enter") {
            event.preventDefault();
            ele.onchange();
          }
        };
      }
    });
  }
};
checkoutHandler();

//

const element = document.getElementById("product1");
const element2 = document.getElementById("product2");
const element3 = document.getElementById("product3");
const element4 = document.getElementById("product4");

function unhover(element) {
  element.setAttribute("src", "assets/img/product-card-v2-img-4b.jpg");
}

function hover(element) {
  element.setAttribute("src", "assets/img/product-card-v2-img-4bb.jpg");
}

//

function unhoverb(element2) {
  element2.setAttribute("src", "assets/img/product-card-v2-img-2a.jpg");
}

function hoverb(element2) {
  element2.setAttribute("src", "assets/img/product-card-v2-img-2aa.jpg");
}

//

function unhoverc(element3) {
  element3.setAttribute("src", "assets/img/product-card-v2-img-1a.jpg");
}

function hoverc(element3) {
  element3.setAttribute("src", "assets/img/product-card-v2-img-1b.jpg");
}

//

function unhoverd(element4) {
  element4.setAttribute("src", "assets/img/product-card-v2-img-4a.jpg");
}

function hoverd(element4) {
  element4.setAttribute("src", "assets/img/product-card-v2-img-4aa.jpg");
}
