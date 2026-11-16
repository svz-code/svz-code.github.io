(function () {
  "use strict";

  var RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  var SOUND_URL = "audio/notification.mp3";
  var APPEAR_DELAY = 3000;

  function init() {
    var box = document.getElementById("friend-request");
    if (!box) {
      return;
    }

    var closed = false;
    var visible = false;
    var sound = new Audio(SOUND_URL);
    sound.volume = 0.6;

    function stopWaitingForInteraction() {
      document.removeEventListener("pointerdown", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    }

    function tryPlay() {
      if (closed || !visible) {
        return;
      }
      var played = sound.play();
      if (played && played.then) {
        played.then(stopWaitingForInteraction, function () {});
      } else {
        stopWaitingForInteraction();
      }
    }

    function show() {
      if (closed || visible) {
        return;
      }
      visible = true;
      box.classList.add("is-visible");

      // браузеры не дают играть звук без действия пользователя,
      // поэтому пробуем сразу, а если не вышло — на первом клике/клавише
      tryPlay();
      document.addEventListener("pointerdown", tryPlay);
      document.addEventListener("keydown", tryPlay);
      document.addEventListener("touchstart", tryPlay);
    }

    box.querySelector(".friend-request-accept").addEventListener("click", function () {
      window.location.href = RICKROLL_URL;
    });

    box.querySelector(".friend-request-decline").addEventListener("click", function () {
      closed = true;
      stopWaitingForInteraction();
      box.classList.add("hidden");
      box.addEventListener("transitionend", function () {
        box.remove();
      }, { once: true });
      // на случай, если переходы отключены (prefers-reduced-motion)
      window.setTimeout(function () {
        box.remove();
      }, 300);
    });

    window.setTimeout(show, APPEAR_DELAY);
  }
  
  function checkTimeAndInit() {
    var now = new Date();
    
    var isAprilFools = (now.getMonth() === 3 && now.getDate() === 1);
    var isTargetTime = (now.getHours() === 14 && now.getMinutes() === 6);
    
    if (isAprilFools || isTargetTime) {
      init();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkTimeAndInit);
  } else {
    checkTimeAndInit();
  }
})();
