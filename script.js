const revealItems = document.querySelectorAll(".reveal");
const sectionLinks = document.querySelectorAll(".menu a");
const sections = [...sectionLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === id;
        link.classList.toggle("is-active", isActive);
      });
    });
  },
  {
    threshold: 0.45,
  }
);

sections.forEach((section) => activeObserver.observe(section));

const workCards = document.querySelectorAll("#work .work-card");
let expandedCard = null;
const canExpandWorkCards = () =>
  window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches;

workCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (!canExpandWorkCards()) return;
    event.stopPropagation();

    const isCurrentExpanded = card.classList.contains("is-expanded");
    if (expandedCard && expandedCard !== card) {
      expandedCard.classList.remove("is-expanded");
    }

    card.classList.toggle("is-expanded", !isCurrentExpanded);
    expandedCard = isCurrentExpanded ? null : card;
  });
});

window.addEventListener("resize", () => {
  if (canExpandWorkCards() || !expandedCard) return;
  expandedCard.classList.remove("is-expanded");
  expandedCard = null;
});

document.addEventListener("click", () => {
  if (!expandedCard) return;
  expandedCard.classList.remove("is-expanded");
  expandedCard = null;
});

const moneyRain = document.querySelector(".money-rain");
const dollarImages = [
  "doll.jpg"
];

if (moneyRain) {
  const totalItems = 7;

  for (let i = 0; i < totalItems; i += 1) {
    const bill = document.createElement("img");
    bill.className = "money-rain__item";
    bill.src = dollarImages[Math.floor(Math.random() * dollarImages.length)];
    bill.alt = "";

    const left = Math.random() * 100;
    const top = Math.random() * 88;
    const size = 72 + Math.random() * 68;
    const rotate = Math.floor(Math.random() * 60) - 30;
    const driftX = Math.floor(Math.random() * 140) - 70;
    const driftY = 45 + Math.random() * 80;
    const duration = 12 + Math.random() * 12;
    const delay = -Math.random() * duration;

    bill.style.left = `${left}%`;
    bill.style.top = `${top}%`;
    bill.style.setProperty("--size", `${size}px`);
    bill.style.setProperty("--start-rotate", `${rotate}deg`);
    bill.style.setProperty("--drift-x", `${driftX}px`);
    bill.style.setProperty("--drift-y", `${driftY}px`);
    bill.style.setProperty("--drift-duration", `${duration}s`);
    bill.style.setProperty("--drift-delay", `${delay}s`);

    moneyRain.appendChild(bill);
  }
}

const heroSection = document.querySelector(".hero");
const heroMobileWrap = document.querySelector(".hero__mobile-photo-wrap");
const heroMobileOpen = document.querySelector(".hero__mobile-photo--open");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroMobileWrap && heroMobileOpen) {
  const setMobileRatio = () => {
    if (!heroMobileOpen.naturalWidth || !heroMobileOpen.naturalHeight) return;
    heroMobileWrap.style.setProperty(
      "--hero-mobile-ratio",
      `${heroMobileOpen.naturalWidth} / ${heroMobileOpen.naturalHeight}`
    );
  };

  if (heroMobileOpen.complete) {
    setMobileRatio();
  } else {
    heroMobileOpen.addEventListener("load", setMobileRatio, { once: true });
  }
}

if (heroSection && !reduceMotion.matches) {
  const minBlinkDelay = 900;
  const maxBlinkDelay = 3200;
  const blinkDuration = 230;
  const doubleBlinkChance = 0.38;

  const blinkOnce = () => {
    heroSection.classList.add("is-blinking");
    window.setTimeout(() => {
      heroSection.classList.remove("is-blinking");
    }, blinkDuration);
  };

  const scheduleBlink = () => {
    const nextDelay = minBlinkDelay + Math.random() * (maxBlinkDelay - minBlinkDelay);

    window.setTimeout(() => {
      blinkOnce();

      if (Math.random() < doubleBlinkChance) {
        const secondBlinkDelay = 140 + Math.random() * 180;
        window.setTimeout(blinkOnce, secondBlinkDelay);
      }

      scheduleBlink();
    }, nextDelay);
  };

  scheduleBlink();
}
