(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector('.nav-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                var isOpen = mobileNav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(isOpen));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
                dot.setAttribute('aria-pressed', String(dotIndex === current));
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        filterScopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var category = scope.querySelector('[data-filter-category]');
            var year = scope.querySelector('[data-filter-year]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .ranking-row'));
            var empty = scope.querySelector('[data-empty-state]');

            function normalize(value) {
                return String(value || '').trim().toLowerCase();
            }

            function runFilter() {
                var query = normalize(input && input.value);
                var cat = normalize(category && category.value);
                var selectedYear = normalize(year && year.value);
                var shown = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-category'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].join(' '));
                    var cardCategory = normalize(card.getAttribute('data-category'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var matched = (!query || haystack.indexOf(query) !== -1) &&
                        (!cat || cardCategory === cat) &&
                        (!selectedYear || cardYear === selectedYear);
                    card.hidden = !matched;
                    if (matched) {
                        shown += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', shown === 0);
                }
            }

            [input, category, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', runFilter);
                    control.addEventListener('change', runFilter);
                }
            });
        });
    });
})();
