(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function textOf(item) {
        return [
            item.getAttribute("data-title"),
            item.getAttribute("data-genre"),
            item.getAttribute("data-region"),
            item.getAttribute("data-type"),
            item.getAttribute("data-year"),
            item.getAttribute("data-tags")
        ].join(" ").toLowerCase();
    }

    function setupFilters() {
        var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-box]"));
        boxes.forEach(function (box) {
            var input = box.querySelector("[data-filter-input]");
            var scope = box.parentElement || document;
            var list = scope.querySelector("[data-filter-list]");
            var buttons = Array.prototype.slice.call(box.querySelectorAll("[data-filter-value]"));
            var query = "";
            var typeValue = "全部";

            if (!list) {
                return;
            }

            var items = Array.prototype.slice.call(list.querySelectorAll(".movie-item"));

            function apply() {
                var q = query.trim().toLowerCase();
                items.forEach(function (item) {
                    var haystack = textOf(item);
                    var matchesText = !q || haystack.indexOf(q) !== -1;
                    var matchesType = typeValue === "全部" || haystack.indexOf(typeValue.toLowerCase()) !== -1;
                    item.classList.toggle("is-hidden", !(matchesText && matchesType));
                });
            }

            if (input) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get("q") || "";
                if (input.hasAttribute("data-query-input") && q) {
                    input.value = q;
                    query = q;
                }
                input.addEventListener("input", function () {
                    query = input.value;
                    apply();
                });
            }

            buttons.forEach(function (button) {
                if (button.getAttribute("data-filter-value") === "全部") {
                    button.classList.add("is-active");
                }
                button.addEventListener("click", function () {
                    typeValue = button.getAttribute("data-filter-value") || "全部";
                    buttons.forEach(function (current) {
                        current.classList.toggle("is-active", current === button);
                    });
                    apply();
                });
            });

            apply();
        });
    }

    function initPlayer(streamUrl) {
        var video = document.getElementById("moviePlayer");
        var button = document.getElementById("playButton");
        var loaded = false;
        var hlsInstance = null;

        if (!video || !button || !streamUrl) {
            return;
        }

        function load() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            loaded = true;
        }

        function play() {
            load();
            button.classList.add("is-hidden");
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("ended", function () {
            if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
                hlsInstance.stopLoad();
            }
        });
    }

    window.SitePlayer = {
        init: initPlayer
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
