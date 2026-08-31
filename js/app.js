/* Falcon One Technologies — final site interactions */
document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Count-up statistics when the statistics band enters the viewport.
    const counters = document.querySelectorAll(".count-up");
    const animateCounter = (el) => {
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || "";
        const duration = reduceMotion ? 0 : 1500;
        const start = performance.now();

        if (!duration) {
            el.textContent = `${target}${suffix}`;
            return;
        }

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `${Math.floor(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const stats = document.querySelector(".stats");
    if (stats && counters.length) {
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    counters.forEach(animateCounter);
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(stats);
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

    // WhatsApp is intentionally number-free until Falcon One has an active public WhatsApp number.
    const whatsappButton = document.getElementById("whatsappDirect");
    const WHATSAPP_NUMBER = ""; // Add the active number later, digits only, e.g. 276XXXXXXXXX

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

            // Until a public WhatsApp number is configured, route the user to support.
            window.location.href =
                "mailto:support@falconone.africa?subject=WhatsApp%20Enquiry%20Request";
        });
    }

    // Lightweight pointer tilt for service cards on desktop.
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
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

        sections.forEach(section => navObserver.observe(section));
    }
});
