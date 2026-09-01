// EDITE APENAS ESTA CONSTANTE quando tiver o WhatsApp oficial.
// Use o formato internacional, somente números: 55 + DDD + número.
const WHATSAPP_NUMBER = "5594991559540";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site da SEL Marabá e gostaria de orientação sobre documentação veicular.";

function getWhatsappMessage(link) {
  const service = link.dataset.whatsappService;
  if (!service) return WHATSAPP_MESSAGE;
  return `Olá! Vim pelo site da SEL Marabá e gostaria de orientação sobre ${service}.`;
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetPagePosition() {
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

resetPagePosition();
window.addEventListener("pageshow", () => window.requestAnimationFrame(resetPagePosition));

const whatsappLinks = document.querySelectorAll(".js-whatsapp");
const toast = document.querySelector(".toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 4200);
}

whatsappLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!WHATSAPP_NUMBER) {
      return;
    }
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getWhatsappMessage(link))}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
});

document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#" || !hash.startsWith("#")) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  });
});

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
const menuLinks = [...menu.querySelectorAll("a")];
let lastFocusedElement = null;

function closeMenu() {
  const wasOpen = menu.classList.contains("open");
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
  if (wasOpen && lastFocusedElement) lastFocusedElement.focus();
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  if (!isOpen) lastFocusedElement = document.activeElement;
  menu.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  document.body.classList.toggle("menu-open", !isOpen);
  if (!isOpen) menuLinks[0].focus();
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  if (event.key !== "Tab" || !menu.classList.contains("open")) return;
  const focusable = [menuButton, ...menuLinks];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && menu.classList.contains("open")) closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = [...document.querySelectorAll(".reveal")];
const preloader = document.querySelector(".preloader");

function removePreloader() {
  if (!preloader || !preloader.isConnected) return;
  preloader.classList.add("is-hidden");
  window.setTimeout(() => preloader.remove(), 650);
}

// Rede de segurança: o preloader jamais deve impedir o acesso ao conteúdo.
window.setTimeout(removePreloader, 4000);

function showAllContent() {
  revealElements.forEach((element) => element.classList.add("visible"));
}

function startFallbackReveals() {
  if (!("IntersectionObserver" in window)) {
    showAllContent();
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

function startGsapAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    removePreloader();
    startFallbackReveals();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-active");

  if (reducedMotion.matches) {
    removePreloader();
    showAllContent();
    gsap.set(".hero-image", { clearProps: "transform" });
    return;
  }

  const heroTimeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  heroTimeline
    .fromTo(".hero-image", { scale: 1.07 }, { scale: 1, duration: 1.6 })
    .fromTo(".site-header", { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.55, clearProps: "transform" }, 0.12)
    .fromTo(
      [".hero .eyebrow", ".hero h1", ".hero-text", ".hero-actions", ".hero-meta"],
      { autoAlpha: 0, y: 28, clipPath: "inset(0 0 18% 0)" },
      { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.72, stagger: 0.09 },
      0.18
    );

  if (document.querySelector(".scroll-cue")) {
    heroTimeline.fromTo(".scroll-cue", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, 0.72);
  }

  if (preloader) {
    const loaderTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    loaderTimeline
      .fromTo(".preloader-mark", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42 })
      .fromTo(".preloader-mark > span", { scale: 0.35, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.32, ease: "back.out(2)" }, 0.18)
      .fromTo(".preloader-track i", { scaleX: 0 }, { scaleX: 1, duration: 0.72, ease: "power2.inOut" }, 0.2)
      .to(".preloader-inner", { autoAlpha: 0, y: -18, duration: 0.25 }, 0.82)
      .to(preloader, {
        yPercent: -100,
        duration: 0.62,
        ease: "power4.inOut",
        onComplete: () => {
          preloader.remove();
          heroTimeline.play(0);
        }
      }, 0.92);
  } else {
    heroTimeline.play(0);
  }

  function revealGroup(trigger, targets, from, options = {}) {
    const items = gsap.utils.toArray(targets);
    if (!items.length) return;
    gsap.fromTo(items, from, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0 0 0% 0)",
      duration: options.duration || 0.72,
      stagger: options.stagger || 0,
      ease: options.ease || "power3.out",
      onComplete: () => items.forEach((item) => item.classList.add("visible")),
      scrollTrigger: { trigger, start: options.start || "top 80%", once: true }
    });
  }

  revealGroup(".services", ".services .section-head", { autoAlpha: 0, y: 28, clipPath: "inset(0 0 20% 0)" });
  revealGroup(".service-grid", ".service-card", { autoAlpha: 0, y: 48, scale: 0.97 }, { stagger: 0.075, start: "top 84%" });
  revealGroup(".fleet", ".fleet-visual", { autoAlpha: 0, x: -48, clipPath: "inset(0 18% 0 0)" }, { duration: 0.85 });
  revealGroup(".fleet", ".fleet-copy", { autoAlpha: 0, y: 38 }, { start: "top 68%" });
  revealGroup(".heritage", ".heritage .year", { autoAlpha: 0, x: -70 }, { duration: 0.9 });
  revealGroup(".heritage", ".heritage-copy", { autoAlpha: 0, y: 34 }, { start: "top 68%" });
  revealGroup(".process", ".process .section-head", { autoAlpha: 0, y: 26 });
  revealGroup(".steps", ".steps > li", { autoAlpha: 0, y: 44 }, { stagger: 0.11, start: "top 84%" });
  revealGroup(".process", ".process-note", { autoAlpha: 0, y: 16 }, { start: "top 64%" });
  revealGroup(".trust", ".trust-intro", { autoAlpha: 0, x: -34 });
  revealGroup(".faq", ".faq-intro", { autoAlpha: 0, x: -34 });
  revealGroup(".faq", ".accordion", { autoAlpha: 0, y: 34 }, { start: "top 72%" });
  revealGroup(".final-cta", ".final-cta .container", { autoAlpha: 0, y: 38, clipPath: "inset(12% 0 12% 0)" });

  gsap.fromTo(".route-lines span", { scaleX: 0, autoAlpha: 0 }, {
    scaleX: 1,
    autoAlpha: 1,
    duration: 0.75,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".fleet-visual", start: "top 72%", once: true }
  });

  gsap.to(".fleet-badge", {
    rotate: 4,
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
      trigger: ".fleet",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.to(".heritage .year", {
    xPercent: 4,
    ease: "none",
    scrollTrigger: {
      trigger: ".heritage",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.9
    }
  });

  const trustStep = window.innerWidth <= 600 ? 12 : 28;
  const trustTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: ".trust", start: "top 70%", once: true }
  });
  trustTimeline
    .fromTo(".trust-benefit", {
      autoAlpha: 0,
      x: (index) => 18 + index * trustStep,
      y: (index) => 22 + index * 12
    }, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.78,
      stagger: 0.17,
      ease: "back.out(1.15)"
    })
    .fromTo(".trust-number", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.17 }, 0.12)
    .fromTo(".trust-benefit > div", { autoAlpha: 0, x: 22 }, { autoAlpha: 1, x: 0, duration: 0.58, stagger: 0.17 }, 0.16)
    .fromTo(".trust-benefit", { "--line-scale": 0 }, { "--line-scale": 1, duration: 0.72, stagger: 0.17 }, 0.08);

  gsap.fromTo(".trust-year", { xPercent: 7 }, {
    xPercent: -4,
    ease: "none",
    scrollTrigger: { trigger: ".trust", start: "top bottom", end: "bottom top", scrub: 0.9 }
  });
}

startGsapAnimations();
document.getElementById("year").textContent = new Date().getFullYear();
