(() => {
    const title = document.querySelector(".ai-title");
    const container = document.querySelector(".ai-container");
    const invitation = document.querySelector(".invitation");
    const rings = gsap.utils.toArray(".scan-ring");
    const status = document.querySelector(".unlock-status");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!title || !container || !status || !window.gsap) return;

    if (window.SplitText) {
        gsap.registerPlugin(SplitText);
    }

    let split = null;
    let chars = [];
    let originalChars = [];
    let hoverTimeline = null;
    let decryptTween = null;
    let active = false;
    let floatingTween = null;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    if (window.SplitText) {
        split = SplitText.create(title, {
            type: "chars",
            charsClass: "char",
        });

        chars = split.chars;

        originalChars = chars.map((char) => char.textContent);
    }

    // state
    gsap.set(
        [
            ".topbar",
            ".bottombar",
            ".eyebrow",
            ".pre-title",
            ".title-ornament",
            ".invitation-copy",
            ".destination",
        ],
        {
            autoAlpha: 0,
            y: 12,
        },
    );

    gsap.set(title, {
        autoAlpha: 0,
    });

    gsap.set(rings, {
        scale: 0.75,
        rotation: -25,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
    });

    // intro

    const intro = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    intro
        .to(".topbar, .bottombar", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
        })

        .to(
            ".eyebrow",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
            },
            "-=0.45",
        )

        .to(
            ".pre-title",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
            },
            "-=0.5",
        )

        .to(
            title,
            {
                autoAlpha: 1,
                duration: 0.9,
            },
            "-=0.4",
        );

    if (chars.length && !reducedMotion) {
        gsap.set(chars, {
            transformOrigin: "50% 100%",
        });

        intro.from(
            chars,
            {
                y: 35,
                rotationX: -45,
                opacity: 0,
                stagger: 0.055,
                duration: 0.9,
                ease: "back.out(1.5)",
            },
            "-=0.75",
        );
    }

    intro
        .to(
            ".title-ornament",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
            },
            "-=0.4",
        )

        .to(
            ".invitation-copy",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
            },
            "-=0.35",
        )

        .to(
            ".destination",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
            },
            "-=0.4",
        );

    // little bg move
    if (!reducedMotion) {
        gsap.to(".painting", {
            scale: 1.08,
            duration: 18,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
    }

    function decryptText() {
        if (!chars.length || reducedMotion) return;

        if (decryptTween) {
            decryptTween.kill();
        }

        const progress = { value: 0 };

        chars.forEach((char, index) => {
            char.textContent =
                letters[Math.floor(Math.random() * letters.length)];

            char.style.opacity = "1";
        });

        decryptTween = gsap.to(progress, {
            value: chars.length,
            duration: 0.85,
            ease: "none",

            onUpdate() {
                const revealed = Math.floor(progress.value);

                chars.forEach((char, index) => {
                    if (index < revealed) {
                        char.textContent = originalChars[index];
                    } else {
                        char.textContent =
                            letters[Math.floor(Math.random() * letters.length)];
                    }
                });
            },

            onComplete() {
                chars.forEach((char, index) => {
                    char.textContent = originalChars[index];
                });
            },
        });
    }

    function activate() {
        if (active) return;

        active = true;
        invitation.classList.add("is-active");

        if (reducedMotion) {
            gsap.to(status, {
                autoAlpha: 1,
                duration: 0.3,
            });

            gsap.to(rings, {
                autoAlpha: 0.65,
                duration: 0.3,
            });

            return;
        }

        decryptText();

        if (hoverTimeline) {
            hoverTimeline.kill();
        }

        if (floatingTween) {
            floatingTween.kill();
        }

        gsap.killTweensOf(rings);
        gsap.killTweensOf(chars);
        gsap.killTweensOf(status);

        hoverTimeline = gsap.timeline();

        hoverTimeline
            .to(
                rings[0],
                {
                    scale: 1.35,
                    rotation: 35,
                    autoAlpha: 0.8,
                    duration: 1.2,
                    ease: "power3.out",
                },
                0,
            )
            .to(
                rings[1],
                {
                    scale: 1.15,
                    rotation: -20,
                    autoAlpha: 0.65,
                    duration: 1,
                    ease: "power3.out",
                },
                0.08,
            );

        if (chars.length) {
            hoverTimeline.fromTo(
                chars,
                {
                    z: -60,
                    rotationX: -45,
                    opacity: 0.25,
                },
                {
                    z: 0,
                    rotationX: 0,
                    opacity: 1,
                    stagger: 0.045,
                    duration: 0.8,
                    ease: "expo.out",
                },
                0,
            );

            floatingTween = gsap.to(chars, {
                y: (index) =>
                    Math.sin(index * 1.2) * 4 + gsap.utils.random(-1, 1),

                duration: 1.8,
                stagger: 0.035,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        hoverTimeline.to(
            status,
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            0.35,
        );
    }

    function deactivate() {
        if (!active) return;

        active = false;
        invitation.classList.remove("is-active");

        if (hoverTimeline) {
            hoverTimeline.kill();
            hoverTimeline = null;
        }

        if (floatingTween) {
            floatingTween.kill();
            floatingTween = null;
        }

        if (decryptTween) {
            decryptTween.kill();
            decryptTween = null;
        }

        gsap.killTweensOf(rings);
        gsap.killTweensOf(chars);
        gsap.killTweensOf(status);

        chars.forEach((char, index) => {
            char.textContent = originalChars[index];
        });

        gsap.to(chars, {
            y: 0,
            z: 0,
            rotationX: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
        });

        gsap.to(rings, {
            scale: 0.75,
            rotation: -25,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power2.out",
            overwrite: true,
        });

        gsap.to(status, {
            autoAlpha: 0,
            y: 10,
            duration: 0.3,
            overwrite: true,
        });
    }

    container.addEventListener("mouseenter", activate);
    container.addEventListener("mouseleave", deactivate);

    container.addEventListener("click", (e) => {
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches)
            return;

        e.preventDefault();

        if (active) {
            deactivate();
        } else {
            activate();
        }
    });

    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");
    container.setAttribute(
        "aria-label",
        "Reveal the invitation to take a stroll",
    );

    container.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            if (active) {
                deactivate();
            } else {
                activate();
            }
        }

        if (e.key === "Escape") {
            deactivate();
        }
    });
})();
