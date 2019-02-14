import "./styles.scss";

import $ from "jquery";

$(document).ready(function() {
  document.getElementById("app").innerHTML = `
    <div class="demo">
      <header class="demo__header"><span>Car Tinder</span></header>
      <div class="demo__content">
        <div class="demo__card-cont">
          <div class="demo__card">
            <div class="demo__card__top brown">
              <div class="demo__card__img">
                <img
                  src="https://source.unsplash.com/random/230x310?toyota"
                />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
          <div class="demo__card">
            <div class="demo__card__top lime">
              <div class="demo__card__img">
                <img
                  src="https://source.unsplash.com/random/230x310?lexus"
                />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
          <div class="demo__card">
            <div class="demo__card__top cyan">
              <div class="demo__card__img">
                <img
                  src="https://source.unsplash.com/random/230x310?honda"
                />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
          <div class="demo__card">
            <div class="demo__card__top indigo">
              <div class="demo__card__img">
                <img
                  src="https://source.unsplash.com/random/230x310?coupe vehicle"
                />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
          <div class="demo__card">
            <div class="demo__card__top blue">
              <div class="demo__card__img">
                <img src="https://source.unsplash.com/random/230x310?sedan" />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
          <div class="demo__card">
            <div class="demo__card__top purple">
              <div class="demo__card__img">
                <img
                  src="https://source.unsplash.com/random/230x310?suv vehicle"
                />
              </div>
              <p class="demo__card__name"></p>
            </div>
            <div class="demo__card__btm">
              <p class="demo__card__we">Whatever</p>
            </div>
            <div class="demo__card__choice m--reject"></div>
            <div class="demo__card__choice m--like"></div>
            <div class="demo__card__drag"></div>
          </div>
        </div>
        <p class="demo__tip">Swipe left or right</p>
      </div>
    </div>
`;

  var animating = false;
  var cardsCounter = 0;
  var numOfCards = 6;
  var decisionVal = 80;
  var pullDeltaX = 0;
  var deg = 0;
  var $card, $cardReject, $cardLike;

  function pullChange() {
    animating = true;
    deg = pullDeltaX / 10;
    $card.css(
      "transform",
      "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)"
    );

    var opacity = pullDeltaX / 100;
    var rejectOpacity = opacity >= 0 ? 0 : Math.abs(opacity);
    var likeOpacity = opacity <= 0 ? 0 : opacity;
    $cardReject.css("opacity", rejectOpacity);
    $cardLike.css("opacity", likeOpacity);
  }

  function release() {
    var img_container = $($card).find(".demo__card__img:first");
    var img_element = $($card).find("img:first");
    var img_src = img_element.attr("src");
    img_src = img_src.split(",", 1);
    img_src = img_src + ",cars" + new Date().getTime();

    if (pullDeltaX >= decisionVal) {
      img_element.attr("src", img_src);
      $card.addClass("to-right");
    } else if (pullDeltaX <= -decisionVal) {
      img_element.attr("src", img_src);
      $card.addClass("to-left");
    }

    if (Math.abs(pullDeltaX) >= decisionVal) {
      $card.addClass("inactive");

      setTimeout(function() {
        $card.addClass("below").removeClass("inactive to-left to-right");
        cardsCounter++;
        if (cardsCounter === numOfCards) {
          cardsCounter = 0;
          $(".demo__card").removeClass("below");
        }
      }, 300);
    }

    if (Math.abs(pullDeltaX) < decisionVal) {
      $card.addClass("reset");
    }

    setTimeout(function() {
      $card
        .attr("style", "")
        .removeClass("reset")
        .find(".demo__card__choice")
        .attr("style", "");

      pullDeltaX = 0;
      animating = false;
    }, 300);
  }

  $(document).on("mousedown touchstart", ".demo__card:not(.inactive)", function(
    e
  ) {
    if (animating) return;

    $card = $(this);
    $cardReject = $(".demo__card__choice.m--reject", $card);
    $cardLike = $(".demo__card__choice.m--like", $card);
    var startX = e.pageX || e.originalEvent.touches[0].pageX;

    $(document).on("mousemove touchmove", function(e) {
      var x = e.pageX || e.originalEvent.touches[0].pageX;
      pullDeltaX = x - startX;
      if (!pullDeltaX) return;
      pullChange();
    });

    $(document).on("mouseup touchend", function() {
      $(document).off("mousemove touchmove mouseup touchend");
      if (!pullDeltaX) return; // prevents from rapid click events
      release();
    });
  });
});
