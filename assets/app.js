const partnerUrl = "https://partners.ajl.to/lead/rental?partnerId=Y4Z4HOWT";

function markPartnerLinks() {
  document.querySelectorAll(`a[href="${partnerUrl}"]`).forEach((link) => {
    link.setAttribute("rel", "nofollow sponsored noopener");
    if (!link.target) link.target = "_blank";
  });
}

function enhanceFaq() {
  document.querySelectorAll(".faq details").forEach((item, index) => {
    if (index === 0 && window.innerWidth >= 900) {
      item.open = true;
    }
  });
}

function addJsonLd(data) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function hasJsonLdType(type) {
  return [...document.querySelectorAll('script[type="application/ld+json"]')].some((script) => {
    try {
      const data = JSON.parse(script.textContent);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
      return graph.some((item) => item && item["@type"] === type);
    } catch {
      return false;
    }
  });
}

function buildBreadcrumbJsonLd() {
  if (hasJsonLdType("BreadcrumbList")) return;
  const links = [...document.querySelectorAll(".breadcrumb a")];
  if (!links.length) return;
  const items = links.map((link, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: link.textContent.trim() || "홈",
    item: new URL(link.getAttribute("href"), location.origin).href
  }));
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: document.querySelector("h1")?.textContent.trim() || document.title,
    item: location.href
  });
  addJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  });
}

function buildFaqJsonLd() {
  if (hasJsonLdType("FAQPage")) return;
  const details = [...document.querySelectorAll(".faq details")];
  if (!details.length) return;
  addJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: details.map((item) => ({
      "@type": "Question",
      name: item.querySelector("summary")?.textContent.trim() || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.querySelector("p")?.textContent.trim() || ""
      }
    }))
  });
}

function buildArticleJsonLd() {
  if (hasJsonLdType("Article")) return;
  if (!location.pathname.startsWith("/blog/") || location.pathname === "/blog/") return;
  const image = document.querySelector(".article-image img, main img");
  addJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: document.querySelector("h1")?.textContent.trim() || document.title,
    description: document.querySelector('meta[name="description"]')?.content || "",
    image: image ? new URL(image.getAttribute("src"), location.origin).href : undefined,
    author: {
      "@type": "Organization",
      name: "렌탈클리어"
    },
    publisher: {
      "@type": "Organization",
      name: "렌탈클리어"
    },
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    mainEntityOfPage: location.href,
    inLanguage: "ko-KR"
  });
}

async function syncHomeCardImages() {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  const cards = [...document.querySelectorAll(".product-card[href] img, .article-card[href] img")];
  await Promise.all(cards.map(async (img) => {
    const card = img.closest("a[href]");
    const href = card?.getAttribute("href");
    if (!href || href === "/compare/") return;
    try {
      const url = new URL(href, location.origin);
      const response = await fetch(url.href, { cache: "no-store" });
      if (!response.ok) return;
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const featured = doc.querySelector("main .article-image img, main img");
      const src = featured?.getAttribute("src");
      if (!src) return;
      img.src = new URL(src, url.href).href;
      const alt = featured.getAttribute("alt");
      if (alt) img.alt = alt;
    } catch (error) {
      console.warn("메인 카드 이미지를 불러오지 못했습니다.", error);
    }
  }));
}

markPartnerLinks();
enhanceFaq();
buildBreadcrumbJsonLd();
buildFaqJsonLd();
buildArticleJsonLd();
syncHomeCardImages();
