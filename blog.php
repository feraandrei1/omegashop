<?php
// Prevent direct access to file
defined('omegashop') or exit;
// Get the 4 most recent added products
$stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p WHERE p.status = 1 ORDER BY p.date_added DESC LIMIT 4');
$stmt->execute();
$recently_added_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<?=template_header('Blog')?>

  <main class="position-relative z-index-1">
    <!-- article -->
    <article class="t-article-v3 padding-bottom-lg" style="padding-bottom: 0px; margin-bottom: -35px;">
      <div class="t-article-v3__hero margin-bottom-lg"
        style="background-image: url('assets/img/article-v3-img-1.jpg');">
        <div class="container max-width-adaptive-sm">
          <div class="t-article-v3__intro-text text-component text-center reveal-fx reveal-fx--translate-up">
            <h1 class="text-xxxl color-inherit">I watched the storm, so beautiful yet terrific</h1>
            <p class="text-sm color-inherit">October 1, 2022 <a href="#comments"></a></p>
          </div>
        </div>
      </div>

      <div class="container max-width-adaptive-sm margin-bottom-xl js-sticky-sharebar-target">
        <div class="text-component line-height-lg text-space-y-md">
          <p class="drop-cap">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, temporibus, aut officia
            minus sequi quae <a href="#0" class="text-bg-fx text-bg-fx--scale-x">molestias beatae</a>, qui ipsa mollitia alias accusamus voluptate ratione
            provident numquam iure quia aliquam tempore possimus consequatur vel. Iure atque enim in? Magnam quis
            cupiditate quia labore quaerat, eligendi nobis, ab similique harum nostrum nulla aliquam dolore adipisci ut.
            Eaque doloremque iure veniam nobis asperiores!</p>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis architecto doloribus perspiciatis.</p>

          <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h2>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, animi. <mark>Praesentium esse magnam sequi
              aut, repellat pariatur beatae quis</mark>. Quidem harum dolores ab velit neque suscipit vitae pariatur,
            perspiciatis voluptatum molestiae facere ad tempora. Non omnis fugiat libero magnam sapiente vel. Optio a,
            enim explicabo totam amet omnis accusantium! Quod.</p>

          <blockquote>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt soluta similique quia.
          </blockquote>

          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat fuga architecto accusamus?</p>

          <hr>

          <div class="text-component__block text-component__block--outset">
            <h3 class="text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae officiis
              similique enim?</h3>
          </div>

          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat hic autem consequatur libero, impedit
            fugiat facere ex! Fugit, cumque minus!</p>

          <figure class="text-component__block">
            <img src="assets/img/article-example-img-2.svg" alt="Image description here">
            <figcaption>Image caption</figcaption>
          </figure>

          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto odit incidunt nobis cumque, assumenda
            quidem ducimus! Architecto, molestias reiciendis tempora pariatur nobis nam quibusdam, nemo repellendus
            rerum rem quam soluta.</p>

          <figure class="text-component__block text-component__block--left">
            <img src="assets/img/article-example-img-2.svg" alt="Image description here">
            <figcaption>Image caption</figcaption>
          </figure>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis incidunt minus vero deserunt illum
            perspiciatis sed sit. Officia, quia at? Nisi dolores quis culpa nulla eveniet? Rem vel numquam ipsa
            voluptatum voluptate illo minima, temporibus atque officia soluta magnam laborum neque alias consequuntur
            enim aliquid consequatur non accusamus exercitationem. Perspiciatis dolorem a commodi alias, ad corporis
            iusto magnam in quae deleniti incidunt facilis voluptatibus. Aliquid reprehenderit, provident, totam
            necessitatibus cumque vel veniam consequuntur maxime iure accusamus explicabo recusandae neque quas?</p>

          <figure class="text-component__block text-component__block--outset text-component__block--right">
            <img src="assets/img/article-example-img-2.svg" alt="Image description here">
            <figcaption>Image caption</figcaption>
          </figure>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod incidunt provident aspernatur quibusdam
            expedita soluta voluptas, sapiente ipsa praesentium eum earum, modi necessitatibus a eveniet quidem
            doloribus, sequi sed tenetur nesciunt consectetur totam asperiores assumenda inventore porro. Enim beatae
            iure ullam consequuntur, quibusdam similique quae doloribus delectus ipsa, cumque odit voluptatem? Natus,
            dolorem quaerat! Magni fugit enim nam quam beatae facilis, consequuntur sunt totam pariatur aperiam sequi
            laboriosam similique dolores aspernatur alias consectetur maxime voluptas, ut tempore. Ipsam vel, id
            repellat maiores non fuga unde modi voluptates nam reiciendis blanditiis. At veniam odit illum porro maiores
            magni quasi deserunt est?</p>

          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos vitae, sequi officia dignissimos laboriosam
            atque esse omnis. Perspiciatis, ratione eius.</p>

          <div class="text-component__block text-component__block--outset">
            <div class="grid gap-xs">
              <figure class="col">
                <img src="assets/img/article-example-img-1.svg" alt="Image description here">
                <figcaption>Image caption</figcaption>
              </figure>

              <figure class="col">
                <img src="assets/img/article-example-img-1.svg" alt="Image description here">
                <figcaption>Image caption</figcaption>
              </figure>
            </div>
          </div>

          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam voluptatem dolore fugiat facilis sint
            quidem obcaecati voluptas ut quae aliquam dolorem omnis, odit nihil! Sint doloremque voluptates laborum illo
            excepturi eligendi asperiores corporis voluptatem iusto? Voluptatem repellendus consectetur exercitationem,
            quisquam corrupti rem reiciendis maiores aspernatur quaerat impedit aliquid minus voluptate, incidunt
            eveniet, et numquam non eligendi! Officiis suscipit ad illo.</p>

          <div class="text-component__block text-component__block--outset">
            <figure class="responsive-iframe">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/_VRyoaNF9sk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </figure>
          </div>
        </div>
      </div>
    </article>
      </section>
    </div>
  </main>

<?=template_footer()?>