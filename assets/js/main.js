const title = document.querySelector(".ai-title");
const container = document.querySelector(".ai-container");
const ring = document.querySelector(".scan-ring");
const status = document.querySelector(".unlock-status");

const split = SplitText.create(title, {
    type: "chars",
});

const chars = split.chars;

const originalText = title.innerText;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%@*&";

const originalChars = chars.map((c) => c.textContent);

function decryptText() {
    let frame = { value: 0 };

    gsap.to(frame, {
        value: chars.length,
        duration: 1,
        ease: "none",

        onUpdate() {
            chars.forEach((char, index) => {
                if (index < frame.value) {
                    char.textContent = originalChars[index];
                } else {
                    char.textContent = letters[Math.floor(Math.random() * letters.length)];
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

container.addEventListener("mouseenter", () => {
    decryptText();

    const tl = gsap.timeline();

    tl.to(ring, {
        scale: 1.6,
        rotation: 180,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
    })

        .fromTo(
            chars,
            {
                opacity: 0,
                z: -300,
                rotationX: -90,
            },
            {
                opacity: 1,
                z: 0,
                rotationX: 0,
                stagger: 0.03,
                duration: 1,
                ease: "expo.out",
            },
            0
        )

        .to(
            chars,
            {
                y: (i) => gsap.utils.random(-10, 10),
                z: (i) => gsap.utils.random(-50, 50),
                repeat: -1,
                yoyo: true,
                duration: 2,
                stagger: 0.02,
            },
            0.8
        )

        .to(
            status,
            {
                opacity: 1,
                y: -10,
                duration: 0.5,
            },
            0.6
        );
});

container.addEventListener("mouseleave", () => {
    gsap.killTweensOf(chars);

    gsap.to(chars, {
        y: 0,
        z: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "expo.out",
    });

    gsap.to(ring, {
        scale: 1,
        rotation: 0,
        opacity: 0.4,
        duration: 0.8,
    });

    gsap.to(status, {
        opacity: 0,
        y: 0,
        duration: 0.4,
    });
});
