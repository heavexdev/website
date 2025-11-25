// Reveal suave ao rolar a página
const animated = document.querySelectorAll("[data-animate], [data-animate-delay]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delayAttr = entry.target.getAttribute("data-animate-delay");
        const delay = delayAttr ? parseInt(delayAttr, 10) : 0;

        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

animated.forEach((el) => observer.observe(el));


// Carousel – HighTech minimal (serviços 5+5)
(function () {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const items = Array.from(document.querySelectorAll(".carousel-item"));
  const prev = document.querySelector(".carousel-control.prev");
  const next = document.querySelector(".carousel-control.next");
  const dotsWrap = document.querySelector(".carousel-dots");
  const viewport = document.querySelector(".carousel-viewport");

  let index = 0;
  const total = items.length;
  const autoplay = true;
  const autoplayDelay = 5000;
  let timer = null;

  // Cria dots
  dotsWrap.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("button");
    d.className = "carousel-dot";
    d.type = "button";
    d.setAttribute("aria-label", "Ir para o slide " + (i + 1));
    d.setAttribute("role", "tab");
    d.setAttribute("aria-selected", i === 0 ? "true" : "false");
    if (i === 0) d.classList.add("active");
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  }
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    items.forEach((it, i) => it.setAttribute("aria-hidden", i !== index));
  }

  function prevSlide() {
    index = (index - 1 + total) % total;
    update();
    resetTimer();
  }

  function nextSlide() {
    index = (index + 1) % total;
    update();
    resetTimer();
  }

  function goTo(i) {
    index = (i + total) % total;
    update();
    resetTimer();
  }

  if (prev) prev.addEventListener("click", prevSlide);
  if (next) next.addEventListener("click", nextSlide);

  function startTimer() {
    if (autoplay && !timer) {
      timer = setInterval(() => {
        nextSlide();
      }, autoplayDelay);
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  // Swipe em dispositivos touch
  let startX = 0,
    dx = 0,
    isDown = false;

  if (viewport) {
    viewport.addEventListener("touchstart", (e) => {
      stopTimer();
      startX = e.touches[0].clientX;
      isDown = true;
    });

    viewport.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      dx = e.touches[0].clientX - startX;
      track.style.transform =
        "translateX(" +
        ((-index * 100) + (dx / viewport.offsetWidth) * 100) +
        "%)";
    });

    viewport.addEventListener("touchend", () => {
      isDown = false;
      if (Math.abs(dx) > 40) {
        if (dx > 0) prevSlide();
        else nextSlide();
      } else {
        update();
      }
      dx = 0;
      resetTimer();
    });

    viewport.addEventListener("mouseenter", stopTimer);
    viewport.addEventListener("mouseleave", startTimer);
  }

  // Teclas de seta
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  update();
  startTimer();
})();
