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

const sphereForm = document.getElementById("sphere-form");
const sphereModal = document.getElementById("sphere-modal");
const sphereCooldownNote = document.getElementById("sphere-cooldown");

if (sphereForm && sphereModal) {
  const SPHERE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const SPHERE_COOLDOWN_KEY = "sphereFormCooldownUntil";
  const submitButton = sphereForm.querySelector(".sphere-form__submit");
  let sphereSubmitting = false;

  const getCooldownRemaining = () => {
    const until = Number(localStorage.getItem(SPHERE_COOLDOWN_KEY) || 0);
    return Math.max(0, until - Date.now());
  };

  const formatCooldown = (ms) => {
    const totalMinutes = Math.ceil(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) return `${hours} ч ${minutes} мин`;
    if (hours > 0) return `${hours} ч`;
    return `${Math.max(1, minutes)} мин`;
  };

  const applyCooldownState = () => {
    const remaining = getCooldownRemaining();
    const locked = remaining > 0;

    if (submitButton) {
      submitButton.disabled = locked || sphereSubmitting;
      if (!sphereSubmitting) {
        submitButton.textContent = locked ? "Заявка уже отправлена" : "Отправить";
      }
    }

    if (sphereCooldownNote) {
      if (locked) {
        sphereCooldownNote.hidden = false;
        sphereCooldownNote.textContent = `Новую заявку можно отправить через ${formatCooldown(remaining)}.`;
      } else {
        sphereCooldownNote.hidden = true;
        sphereCooldownNote.textContent = "";
      }
    }

    return locked;
  };

  const openModal = () => {
    sphereModal.hidden = false;
    document.body.classList.add("sphere-modal-open");
  };

  const closeModal = () => {
    sphereModal.hidden = true;
    document.body.classList.remove("sphere-modal-open");
  };

  applyCooldownState();

  sphereForm.addEventListener("submit", (event) => {
    if (getCooldownRemaining() > 0) {
      event.preventDefault();
      applyCooldownState();
      openModal();
      return;
    }

    const fields = [...sphereForm.querySelectorAll(".sphere-form__input")];
    let isValid = true;

    fields.forEach((field) => {
      const empty = !field.value.trim();
      field.classList.toggle("is-invalid", empty);
      if (empty) isValid = false;
    });

    if (!isValid) {
      event.preventDefault();
      const firstInvalid = sphereForm.querySelector(".sphere-form__input.is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (sphereSubmitting) {
      event.preventDefault();
      return;
    }

    sphereSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Отправка…";
    }

    localStorage.setItem(SPHERE_COOLDOWN_KEY, String(Date.now() + SPHERE_COOLDOWN_MS));

    window.setTimeout(() => {
      sphereSubmitting = false;
      applyCooldownState();
      openModal();
    }, 500);
  });

  sphereForm.querySelectorAll(".sphere-form__input").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim()) field.classList.remove("is-invalid");
    });
  });

  sphereModal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !sphereModal.hidden) closeModal();
  });
}
