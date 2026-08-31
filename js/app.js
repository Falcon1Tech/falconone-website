document.addEventListener("DOMContentLoaded", () => {
    // Smoothly activate the visible navigation item.
    const navLinks = [...document.querySelectorAll(".main-nav a")];
    const sections = [...document.querySelectorAll("main section[id], .hero[id]")];

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                ));
            });
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // Count statistics when they enter the viewport.
    const counters = document.querySelectorAll(".count-up");

    const animateCounter = (el) => {
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || "";
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(tick);
    };

    const statsPanel = document.querySelector(".stats-panel");

    if (statsPanel && "IntersectionObserver" in window) {
        let started = false;
        const counterObserver = new IntersectionObserver((entries) => {
            if (!started && entries[0].isIntersecting) {
                started = true;
                counters.forEach(animateCounter);
                counterObserver.disconnect();
            }
        }, { threshold: 0.35 });

        counterObserver.observe(statsPanel);
    } else {
        counters.forEach(animateCounter);
    }

    // WhatsApp is intentionally not wired to a public number yet.
    // When the official WhatsApp number is ready, replace this handler
    // with the approved wa.me link without changing the page layout.
    document.querySelectorAll("[data-whatsapp-pending]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const note = document.querySelector(".enquiry-note");
            if (note) {
                note.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            const message = document.createElement("div");
            message.setAttribute("role", "status");
            message.textContent = "WhatsApp Direct is ready to be activated once Falcon One's official WhatsApp number is available. Email support is available now.";
            message.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100% - 30px);padding:12px 16px;border-radius:9px;background:#06172f;color:#fff;border:1px solid rgba(63,155,255,.45);box-shadow:0 12px 30px rgba(0,0,0,.25);font:700 12px Arial,sans-serif;text-align:center;";
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 4200);
        });
    });
});
