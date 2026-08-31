/* Falcon One Technologies — premium site interactions */
document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * LIVE COUNT-UP STATISTICS
     * The numeric statistics reset to zero and animate to their real limits
     * whenever the statistics section enters the viewport. This makes the
     * counters visibly count up instead of appearing as static numbers.
     */
    const counters = document.querySelectorAll(".count-up");

    const animateCounter = (el) => {
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || "";

        if (el._countAnimationFrame) {
            cancelAnimationFrame(el._countAnimationFrame);
        }

        if (reduceMotion) {
            el.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1800;
        const start = performance.now();

        el.textContent = `0${suffix}`;

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * eased);

            el.textContent = `${currentValue}${suffix}`;

            if (progress < 1) {
                el._countAnimationFrame = requestAnimationFrame(update);
            } else {
                el.textContent = `${target}${suffix}`;
                el._countAnimationFrame = null;
            }
        };

        el._countAnimationFrame = requestAnimationFrame(update);
    };

    const stats = document.querySelector(".stats");

    if (stats && counters.length) {
        if ("IntersectionObserver" in window && !reduceMotion) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        counters.forEach((counter, index) => {
                            window.setTimeout(() => animateCounter(counter), index * 120);
                        });
                    }
                });
            }, {
                threshold: 0.35
            });

            statsObserver.observe(stats);
        } else {
            counters.forEach(animateCounter);
        }
    }

    // Subtle reveal animations.
    const revealItems = document.querySelectorAll(
        ".reveal-card, .about-container > div, .resources-grid .resource-card, .industries-grid span"
    );

    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    // WhatsApp remains number-free until Falcon One has an active public WhatsApp number.
    const whatsappButton = document.getElementById("whatsappDirect");
    const WHATSAPP_NUMBER = "";

    if (whatsappButton) {
        whatsappButton.addEventListener("click", () => {
            if (WHATSAPP_NUMBER.trim()) {
                const message = encodeURIComponent(
                    "Hi Falcon One Technologies, I’d like to speak to someone about your services."
                );

                window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
                    "_blank",
                    "noopener,noreferrer"
                );
                return;
            }

            window.location.href =
                "mailto:support@falconone.africa?subject=WhatsApp%20Enquiry%20Request";
        });
    }

    // Lightweight 3D pointer tilt for service cards on desktop.
    if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
        document.querySelectorAll("[data-tilt]").forEach(card => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 3;
                const rotateX = (0.5 - y) * 3;

                card.style.transform =
                    `translateY(-9px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    // Service CTAs carry the selected service into the enquiry form.
    document.querySelectorAll(".service-link[data-service]").forEach(link => {
        link.addEventListener("click", () => {
            const service = link.dataset.service;
            const select = document.getElementById("service");

            if (select) {
                const option = Array.from(select.options).find(
                    opt => opt.text.trim() === service.trim()
                );

                if (option) select.value = option.value;
            }
        });
    });

    // Keep navigation state useful while scrolling through the one-page site.
    const navLinks = Array.from(document.querySelectorAll(".main-nav a"));

    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove("active"));

                    const active = navLinks.find(
                        link => link.getAttribute("href") === `#${entry.target.id}`
                    );

                    if (active) active.classList.add("active");
                }
            });
        }, {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        });

        sections.forEach(section => navObserver.observe(section));
    }
});
