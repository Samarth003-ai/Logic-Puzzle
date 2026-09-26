import React, { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Create subtle particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
    }));

    // Floating blurred dream Orbs
    const orbs = [
      { x: canvas.width * 0.3, y: canvas.height * 0.3, r: 250, color: "rgba(39, 33, 58, 0.25)", vx: 0.2, vy: 0.1 },
      { x: canvas.width * 0.7, y: canvas.height * 0.7, r: 300, color: "rgba(183, 166, 255, 0.04)", vx: -0.15, vy: -0.2 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint glowing orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > canvas.width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > canvas.height + 100) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(8, 9, 13, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating dust particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(183, 166, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#08090D]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute inset-0 vignette-overlay" />
    </div>
  );
}
