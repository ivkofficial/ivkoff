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

    bill.style.left = `${left}%`;
    bill.style.top = `${top}%`;
    bill.style.setProperty("--size", `${size}px`);
    bill.style.setProperty("--start-rotate", `${rotate}deg`);

    moneyRain.appendChild(bill);
  }
}
