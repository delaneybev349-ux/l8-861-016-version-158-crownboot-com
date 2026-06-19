(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var video = document.getElementById("movie-player");
    var shell = document.querySelector("[data-player]");
    var button = document.querySelector("[data-player-start]");
    if (!video || !shell || !Array.isArray(movieVideoSources) || movieVideoSources.length === 0) {
      return;
    }

    var hls = null;
    var loaded = false;
    var sourceIndex = 0;

    function destroyHls() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    }

    function bindSource(index) {
      sourceIndex = index % movieVideoSources.length;
      var src = movieVideoSources[sourceIndex];
      destroyHls();
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            bindSource(sourceIndex + 1);
          }
        });
      } else {
        video.src = src;
      }
      loaded = true;
    }

    function begin() {
      if (!loaded) {
        bindSource(0);
      }
      shell.classList.add("is-started");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          shell.classList.remove("is-started");
        });
      }
    }

    button.addEventListener("click", begin);
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        begin();
      }
    });
    video.addEventListener("play", function () {
      shell.classList.add("is-started");
    });
    video.addEventListener("pause", function () {
      if (video.currentTime === 0) {
        shell.classList.remove("is-started");
      }
    });
    video.addEventListener("error", function () {
      bindSource(sourceIndex + 1);
    });
  });
})();
