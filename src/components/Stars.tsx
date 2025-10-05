"use client";

import { useEffect } from "react";

const NUM_STARS = 1000;

export default function Stars() {
  useEffect(() => {
    const starContainer = document.getElementById("stars-container");
    if (!starContainer) return;

    const generateStars = () => {
      starContainer.innerHTML = "";
      const pageHeight = document.documentElement.scrollHeight;

      const colorWeights = [
        { color: "#ffffff", weight: 70 },
        { color: "#a5d1ff", weight: 10 },
        { color: "#99ccff", weight: 10 },
        { color: "#cceeff", weight: 5 },
        { color: "#fff8e7", weight: 3 },
        { color: "#fff1c2", weight: 3 },
        { color: "#ffd1a5", weight: 2 },
        { color: "#ffb380", weight: 2 },
        { color: "#d9ccff", weight: 2 },
        { color: "#c2b3ff", weight: 3 },
      ];

      function pickColor() {
        const total = 100;
        let r = Math.random() * total;
        for (const c of colorWeights) {
          if (r < c.weight) return c.color;
          r -= c.weight;
        }
        return "#ffffff";
      }

      for (let i = 0; i < NUM_STARS; i++) {
        const star = document.createElement("div");
        star.className = "star";

        // position
        star.style.top = `${Math.random() * pageHeight}px`;
        star.style.left = `${Math.random() * 100}vw`;

        // size distribution (more small, rare large)
        let size: number;
        const roll = Math.random();
        if (roll < 0.8) size = Math.random() * 1 + 0.5; // tiny
        else if (roll < 0.95) size = Math.random() * 2 + 1.5; // medium
        else size = Math.random() * 3 + 3; // rare big star
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // glow with radial gradient
        const color = pickColor();
        star.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        star.style.borderRadius = "50%";

        // opacity / brightness
        const brightness = Math.min(1, 0.5 + size / 3);
        star.style.opacity = brightness.toString();

        // twinkle
        const duration = (Math.random() * 3 + 1).toFixed(2); // 1–4s
        const delay = (Math.random() * 5).toFixed(2);
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        // depth layering
        const layer = Math.random();
        if (layer < 0.6) star.classList.add("far");
        else if (layer < 0.9) star.classList.add("mid");
        else star.classList.add("near");

        starContainer.appendChild(star);
      }
    };

    generateStars();
    window.addEventListener("resize", generateStars);

    return () => window.removeEventListener("resize", generateStars);
  }, []);

  return <div id="stars-container" className="stars"></div>;
}
