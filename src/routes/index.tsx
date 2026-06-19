import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raja Nagaraju — Software Engineer & Full Stack Developer" },
      { name: "description", content: "Raja Nagaraju is a software engineer and full stack developer building scalable, high-performance web applications with React, Next.js, Node.js and AWS." },
      { property: "og:title", content: "Raja Nagaraju — Software Engineer & Full Stack Developer" },
      { property: "og:description", content: "Premium portfolio of Raja Nagaraju — full stack engineer building modern digital experiences." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: PortfolioRedirect,
});

function PortfolioRedirect() {
  useEffect(() => {
    window.location.replace("/portfolio.html");
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#050816", color: "#94A3B8",
      display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif",
    }}>
      <noscript>
        <a href="/portfolio.html" style={{ color: "#fff" }}>Open portfolio →</a>
      </noscript>
      Loading portfolio…
    </div>
  );
}
