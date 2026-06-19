(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function initNavigation() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var active = 0;
        var timer = null;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === active);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === active);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(Number(dot.getAttribute("data-slide")) || 0);
                start();
            });
        });
        start();
    }

    function initSearch() {
        var input = document.querySelector("[data-card-search]");
        if (!input) {
            return;
        }
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-item"));
        input.addEventListener("input", function () {
            var query = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
            });
        });
    }

    function initFilters() {
        var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        if (!chips.length) {
            return;
        }
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                var filter = chip.getAttribute("data-filter") || "all";
                chips.forEach(function (item) {
                    item.classList.toggle("is-active", item === chip);
                });
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-genre") || "").toLowerCase();
                    card.classList.toggle("is-hidden-card", filter !== "all" && haystack.indexOf(filter.toLowerCase()) === -1);
                });
            });
        });
    }

    function attachPlayer(root) {
        var video = root.querySelector("video");
        var button = root.querySelector(".play-button");
        var overlay = root.querySelector(".play-overlay");
        var url = root.getAttribute("data-play-url");
        if (!video || !button || !url) {
            return;
        }
        function begin() {
            root.classList.add("is-playing");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }
        function load() {
            if (root.getAttribute("data-ready") === "1") {
                begin();
                return;
            }
            root.setAttribute("data-ready", "1");
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                video.addEventListener("loadedmetadata", begin, { once: true });
                video.load();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, begin);
                root._hls = hls;
                return;
            }
            video.src = url;
            video.addEventListener("loadedmetadata", begin, { once: true });
            video.load();
        }
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            load();
        });
        if (overlay) {
            overlay.addEventListener("click", load);
        }
        video.addEventListener("play", function () {
            root.classList.add("is-playing");
        });
    }

    function initPlayers() {
        Array.prototype.slice.call(document.querySelectorAll(".movie-player")).forEach(attachPlayer);
    }

    ready(function () {
        initNavigation();
        initHero();
        initSearch();
        initFilters();
        initPlayers();
    });
})();
