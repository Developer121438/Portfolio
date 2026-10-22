const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

// Highlight the active navigation link

const navLinks2 = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
  const header = document.querySelector(".site-header");

  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  // Detection point: below the header, adjusted to viewport height
  const detectionPoint =
    headerHeight + (window.innerHeight - headerHeight) * 0.3;

  let currentSection = sections[0]?.id || "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= detectionPoint && rect.bottom > detectionPoint) {
      currentSection = section.id;
    }
  });

  // Ensure the final section becomes active at the bottom
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;

  if (atBottom && sections.length > 0) {
    currentSection = sections[sections.length - 1].id;
  }

  navLinks2.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
window.addEventListener("load", updateActiveLink);

// Typing animation for the hero heading and role

const typingElements = [
  document.querySelector(".hero-content h1"),
  document.querySelector(".hero-content .role"),
];

function typeText(element, speed = 75) {
  if (!element) return Promise.resolve();

  // Respect users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }

  // Collect text nodes while preserving nested elements and their styling
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.textContent.length > 0) {
      textNodes.push({
        node: node,
        text: node.textContent,
      });
    }
  }

  // Hide the original text before typing
  textNodes.forEach((item) => {
    item.node.textContent = "";
  });

  element.classList.add("typing-active");

  let delay = 0;

  // Type each character in order
  return textNodes
    .reduce((promise, item) => {
      return promise.then(async () => {
        for (const character of item.text) {
          await new Promise((resolve) => setTimeout(resolve, speed));
          item.node.textContent += character;
        }
      });
    }, Promise.resolve())
    .then(() => {
      element.classList.remove("typing-active");
    });
}

// Type the name first, then the role
async function startTypingAnimation() {
  // Hide all typing elements before starting
  typingElements.forEach((element) => {
    element.style.visibility = "hidden";
  });

  for (const element of typingElements) {
    // Show only the element currently being typed
    element.style.visibility = "visible";

    await typeText(element, 100);

    // Brief pause after each element finishes
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

window.addEventListener("load", startTypingAnimation);
