<?php
// Prevent direct access to file
defined('omegashop') or exit;
// Get the 4 most recent added products
$stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p WHERE p.status = 1 ORDER BY p.date_added DESC LIMIT 4');
$stmt->execute();
$recently_added_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<?php
  require_once "db.php";

  if(isset($_SESSION['user_id'])!="") {
    header("Location: dashboard.php");
  }

    if (isset($_POST['email'])) {
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        if(!filter_var($email,FILTER_VALIDATE_EMAIL)) {
            $email_error = "Please Enter Valid Email ID";
        }
        if (!$error) {
            if(mysqli_query($conn, "INSERT INTO subscribers(email) VALUES('" . $email . "')")) {
             header("location: index.php");
             exit();
            } else {
               echo "Error: " . $sql . "" . mysqli_error($conn);
            }
        }
        mysqli_close($conn);
    }
?>

<?=template_header('Home')?>

  <section class="feature-v9 margin-bottom-xxl" data-theme="dark-1">
    <div class="grid">
      <div class="feature-v9__block col-6@md" style="background-image: url('assets/img/feature-v9-img-1.jpg');">
        <div class="feature-v9__content text-component text-center max-width-xxxs">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxxl color-inherit">Women</h2>
            <p class="opacity-90%">Find everything you need for your beauty</p>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Women</a></p>
          </div>
        </div>
      </div>

      <div class="feature-v9__block col-6@md" style="background-image: url('assets/img/feature-v9-img-2.jpg');">
        <div class="feature-v9__content text-component text-center max-width-xxxs">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxxl color-inherit">Men</h2>
            <p class="opacity-90%">Keeping you up with the new trend
            </p>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Men</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- latest products -->
  <section class="position-relative z-index-1 margin-bottom-xxl">
    <div class="container max-width-adaptive-md margin-bottom-xl" style="margin-bottom: 120px; margin-top: -10px;">
      <div class="grid gap-sm">
        <div class="margin-bottom-md@lg">
          <h1 class="text-xxxxl text-uppercase">Latest Products</h1>
        </div>

        <div class="offset-4@lg">
          <p class="line-height-lg color-contrast-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
            ipsam id deleniti quo dolorum placeat, hic dolores animi molestias similique ratione, aut, cupiditate
            praesentium.</p>
          <p class="margin-top-md"><a class="btn btn--subtle" href="index.php?page=products">View all</a></p>
        </div>
      </div>
    </div>

  <section class="gallery-v2 margin-bottom-xxl">
    <div class="container max-width-adaptive-lg clearfix">
      <ul class="gallery-v2__grid grid gap-sm">
        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&amp;id=smart-watch" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="uploads/watch.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <a href="index.php?page=product&amp;id=smart-watch" class="prod-card-v2__img-link" aria-label="Description of the link">
              <h2 class="text-md font-primary"><a href="index.php?page=product&amp;id=smart-watch" class="product-card-v2__title">Watch</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$29.99</span>
              </div>
            </div>
          </div>
        </li>

        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&amp;id=3" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="uploads/headphones.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&amp;id=3" class="product-card-v2__title">Headphones</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$19.99</span>
              </div>
            </div>
          </div>
        </li>

        <li class="gallery-v2__item col-6@sm col-3@lg" id="muye" >
          <div class="prod-card-v2">
            <a href="index.php?page=product&amp;id=smart-watch" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="uploads/watch.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&amp;id=smart-watch" class="product-card-v2__title">Watch</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$29.99</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
  </section>

  <!-- sticky hero -->
  <section class="sticky-hero sticky-hero--overlay-layer margin-bottom-xxl js-sticky-hero" data-theme="dark-1">
    <div class="sticky-hero__media" style="background-image:url(assets/img/sticky-hero-img-1.jpg)" aria-hidden="true">
    </div>

    <div class="sticky-hero__content">
      <div>
        <div class="container max-width-xs text-component text-center text-space-y-xl">
          <h1 class="text-xxxl">How a simple idea changed my life</h1>
          <p class="margin-top-md"><a class="btn btn--contrast" style="border: none !important;" href="index.php?page=blog">Read our Story</a></p>
        </div>
      </div>
    </div>
  </section>

  <!-- offset gallery -->
  <section class="gallery-v2 margin-bottom-xxl">
    <div class="container max-width-adaptive-lg clearfix">
      <div class="margin-bottom-xl clearfix">
        <div class="grid gap-sm">
          <div class="col-6@lg offset-3@lg">
            <div class="text-component line-height-lg" style="margin-top: 80px; margin-bottom: -70px;">
              <h1 class="text-xxxl">Art & Clothing</h1>

              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sed tenetur rem quam nihil dolorum
                expedita maxime nisi recusandae sequi magni culpa fuga accusamus eveniet fugiat ipsum ab consequuntur.
              </p>

              <p class="text-right"><a class="btn btn--subtle" href="index.php?page=products">Shop Now</a></p>
            </div>
          </div>
        </div>
      </div>

      <ul class="gallery-v2__grid grid gap-sm">
        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&id=7" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="assets/img/product-card-v2-img-1a.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&id=7" class="product-card-v2__title">Brown Coat</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$89.99</span>
              </div>
            </div>
          </div>
        </li>

        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&id=6" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="assets/img/product-card-v2-img-2a.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&id=6" class="product-card-v2__title">Blue Jeans</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$79.99</span>
              </div>
            </div>
          </div>
        </li>

        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&id=8" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="assets/img/product-card-v2-img-4a.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&id=8" class="product-card-v2__title">Unisex Shoes</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$49.99</span>
              </div>
            </div>
          </div>
        </li>

        <li class="gallery-v2__item col-6@sm col-3@lg">
          <div class="prod-card-v2">
            <a href="index.php?page=product&id=9" class="prod-card-v2__img-link" aria-label="Description of the link">
              <figure class="aspect-ratio-4:5">
                <img src="assets/img/product-card-v2-img-5a.jpg" loading="lazy" alt="Product preview image">
              </figure>
            </a>

            <div class="padding-sm text-center">
              <h2 class="text-md font-primary"><a href="index.php?page=product&id=9" class="product-card-v2__title">Boots</a></h2>

              <div class="margin-top-xxxs">
                <span class="prod-card-v2__price">$69.99</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <!-- categories -->
  <section class="position-relative z-index-1 margin-bottom-xxl">
    <div class="container max-width-xs margin-bottom-xl">
      <div class="text-component text-center">
        <h1 class="text-xxxl">Browse Categories</h1>
        <p class="color-contrast-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid itaque,
          cupiditate dicta quo vero praesentium ipsam.</p>
      </div>
    </div>

    <div class="container max-width-adaptive-md">
      <div class="grid gap-sm">
        <div>
          <div class="banner overflow-hidden">
            <a href="index.php?page=products" class="text-decoration-none" aria-label="Shop Now">
              <div class="grid flex-row-reverse@md">
                <div class="col-6@md overflow-hidden" aria-hidden="true">
                  <div class="banner__figure width-100%" style="background-image: url(assets/img/banner-img-1.jpg);">
                  </div>
                </div>

                <div class="col-6@md">
                  <div class="text-component text-space-y-md height-100% flex flex-column padding-md padding-lg@md" style="text-align: left;">
                    <h2>Clothing</h2>
                    <p class="margin-top-sm margin-top-lg@md"><span class="banner__link"><i>Shop Now</i></span></p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div>
          <div class="banner overflow-hidden">
            <a href="index.php?page=products" class="text-decoration-none" aria-label="Shop Now">
              <div class="grid flex-row-reverse@md">
                <div class="col-6@md overflow-hidden" aria-hidden="true">
                  <div class="banner__figure width-100%" style="background-image: url(assets/img/banner-img-2.jpg);">
                  </div>
                </div>

                <div class="col-6@md">
                  <div class="text-component text-space-y-md height-100% flex flex-column padding-md padding-lg@md" style="text-align: left;">
                    <h2>Home</h2>
                    <p class="margin-top-sm margin-top-lg@md"><span class="banner__link"><i>Shop Now</i></span></p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- newsletter -->
  <section class="position-relative z-index-1 padding-y-xxl" data-theme="dark-1">
    <div class="container max-width-adaptive-lg position-relative z-index-2">
      <div class="bg-light inner-glow padding-lg padding-y-xl@md shadow-lg">
        <div class="grid gap-md gap-lg@lg items-center">
          <div class="col-6@md">
            <div class="text-component">
              <h2>Subscribe</h2>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit ipsum quo nihil ipsam sapiente</p>
            </div>
          </div>

          <div class="col-6@md">
            <form class="margin-bottom-sm" name="signup" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
              <div class="flex flex-column flex-row@md gap-xxxs">
                <input aria-label="Email" class="form-control flex-grow" name="email" type="email" placeholder="Your Email">
                <input type="submit" class="btn btn--primary"></input>
              </div>
            </form>

            <ul class="flex flex-wrap gap-md justify-end@md text-sm">
              <li class="inline-flex items-center">
                <svg aria-hidden="true" class="icon margin-right-xxs" viewBox="0 0 16 16">
                  <title>check-single</title>
                  <polyline points="1 9.5 5.5 14 15 1.5" fill="none" stroke="currentColor" stroke-linecap="square"
                    stroke-width="1"></polyline>
                </svg>
                <span>Cancel anytime</span>
              </li>

              <li class="inline-flex items-center">
                <svg aria-hidden="true" class="icon margin-right-xxs" viewBox="0 0 16 16">
                  <title>check-single</title>
                  <polyline points="1 9.5 5.5 14 15 1.5" fill="none" stroke="currentColor" stroke-linecap="square"
                    stroke-width="1"></polyline>
                </svg>
                <span>7-day trial</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <figure class="bg-decoration-v2 z-index-1 blend-overlay" aria-hidden="true">
      <svg class="bg-decoration-v2__svg color-contrast-higher opacity-40%" viewBox="0 0 1920 450" fill="none">
        <g stroke="currentColor" stroke-width="2">
          <rect x="1286" y="-2" width="140" height="140" />
          <rect x="1426" y="-2" width="140" height="140" />
          <rect x="1566" y="-2" width="140" height="140" />
          <rect x="1426" y="138" width="140" height="140" />
          <rect x="1566" y="138" width="140" height="140" />
          <rect x="1426" y="278" width="140" height="140" />
          <circle cx="1426" cy="138" r="70" />
          <circle cx="1286" cy="278" r="70" />
          <path
            d="M1286 68C1295.19 68 1304.3 66.1894 1312.79 62.6716C1321.28 59.1537 1329 53.9976 1335.5 47.4975C1342 40.9974 1347.15 33.2806 1350.67 24.7878C1354.19 16.295 1356 7.19253 1356 -2H1286L1286 68Z" />
          <path
            d="M1496 -2.00001C1496 7.19253 1497.81 16.295 1501.33 24.7878C1504.85 33.2806 1510 40.9974 1516.5 47.4975C1523 53.9976 1530.72 59.1537 1539.21 62.6716C1547.7 66.1894 1556.81 68 1566 68C1575.19 68 1584.3 66.1894 1592.79 62.6716C1601.28 59.1537 1609 53.9976 1615.5 47.4975C1622 40.9974 1627.15 33.2806 1630.67 24.7878C1634.19 16.295 1636 7.19253 1636 -2H1566L1496 -2.00001Z" />
          <circle cx="1566" cy="278" r="70" />
        </g>
      </svg>
    </figure>
  </section>

  <!-- 4 info points -->
  <section class="position-relative z-index-1 padding-y-xxl">
    <div class="container max-width-adaptive-lg">
      <ul class="grid gap-lg" id="car">
        <li class="col-6@sm col-3@md">
          <div class="text-component text-center text-sm@md">
            <svg class="icon icon--lg color-contrast-medium" viewBox="0 0 48 48" aria-hidden="true">
              <g fill="none" stroke-width="2" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                stroke-linejoin="miter">
                <line x1="31" y1="38" x2="17" y2="38"></line>
                <polyline points="29 13 40 13 46 24 46 37.999 41 38"></polyline>
                <polyline points="7 38 2 38 2 5 29 5 29 28"></polyline>
                <circle cx="36" cy="38" r="5" stroke="var(--color-contrast-high)"></circle>
                <circle cx="12" cy="38" r="5" stroke="var(--color-contrast-high)"></circle>
                <polyline points="34 18 34 24 40 24" stroke="var(--color-contrast-high)"></polyline>
              </g>
            </svg>
            <h4 class="font-primary font-medium">Free Delivery</h4>
            <p class="color-contrast-medium">Free shipping for orders over $50</p>
          </div>
        </li>

        <li class="col-6@sm col-3@md">
          <div class="text-component text-center text-sm@md">
            <svg class="icon icon--lg color-contrast-medium" viewBox="0 0 48 48" aria-hidden="true">
              <g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor" fill="none"
                stroke-miterlimit="10">
                <line x1="24" y1="11" x2="24" y2="37" stroke="var(--color-contrast-high)"></line>
                <path
                  d="M30,15.41c-2.912-1.6-12.085-2.8-12.085,2.719,0,6.6,11.648,4.271,11.648,10.095s-7.571,5.387-12.813,3.493"
                  stroke="var(--color-contrast-high)"></path>
                <polygon points="41.85 41.85 34.5 42.9 35.55 35.55 41.85 41.85" stroke-linecap="butt"></polygon>
                <polygon points="12.45 12.45 13.5 5.1 6.15 6.15 12.45 12.45" stroke-linecap="butt"></polygon>
                <path d="M38.849,38.849A21,21,0,0,0,24,3" stroke-linecap="butt"></path>
                <path d="M9.151,9.151A21,21,0,0,0,24,45" stroke-linecap="butt"></path>
              </g>
            </svg>
            <h4 class="font-primary font-medium">Refunds</h4>
            <p class="color-contrast-medium">30 days money back guarantee</p>
          </div>
        </li>

        <li class="col-6@sm col-3@md">
          <div class="text-component text-center text-sm@md">
            <svg class="icon icon--lg color-contrast-medium" viewBox="0 0 48 48" aria-hidden="true">
              <g fill="none" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor">
                <polygon points=" 46,2 22,2 22,23 31,16 46,16 " stroke="var(--color-contrast-high)"></polygon>
                <path
                  d="M20,43.672 c0-1.208-0.529-2.357-1.476-3.108C17.078,39.416,14.57,38,11,38s-6.078,1.416-7.524,2.564C2.529,41.315,2,42.464,2,43.672V46h18 V43.672z">
                </path>
                <circle cx="11" cy="28" r="5"></circle>
                <path
                  d="M46,43.672 c0-1.208-0.529-2.357-1.476-3.108C43.078,39.416,40.57,38,37,38s-6.078,1.416-7.524,2.564C28.529,41.315,28,42.464,28,43.672V46h18 V43.672z">
                </path>
                <circle cx="37" cy="28" r="5"></circle>
              </g>
            </svg>
            <h4 class="font-primary font-medium">Refer a Friend</h4>
            <p class="color-contrast-medium">Earn a 10% commission</p>
          </div>
        </li>

        <li class="col-6@sm col-3@md">
          <div class="text-component text-center text-sm@md">
            <svg class="icon icon--lg color-contrast-medium" viewBox="0 0 48 48" aria-hidden="true">
              <g fill="none" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor">
                <polyline points="19 9 3 9 3 45 39 45 39 29"></polyline>
                <polygon points="23 32 13 35 16 25 38 3 45 10 23 32" stroke="var(--color-contrast-high)"></polygon>
              </g>
            </svg>
            <h4 class="font-primary font-medium">Get Help Buying</h4>
            <p class="color-contrast-medium">Have a question? <a class="color-contrast-high" href="index.php?page=form">Contact Us</a>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>

</div>

<?=template_footer()?>