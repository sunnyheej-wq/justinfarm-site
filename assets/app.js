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

function initRentalCalc() {
  const calcForm = document.getElementById("rental-calc");
  if (!calcForm) return;

  const monthlyFeeInput = document.getElementById("monthly-fee");
  const contractPeriodSelect = document.getElementById("contract-period");
  const cardDiscountSelect = document.getElementById("card-discount");
  const cashbackInput = document.getElementById("cashback");
  const buyPriceInput = document.getElementById("buy-price");

  const totalRentalEl = document.getElementById("total-rental");
  const totalDiscountEl = document.getElementById("total-discount");
  const diffLabelEl = document.getElementById("diff-label");
  const diffValueEl = document.getElementById("diff-value");

  function formatWon(value) {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  }

  function calculate() {
    const monthlyFee = parseInt(monthlyFeeInput.value) || 0;
    const period = parseInt(contractPeriodSelect.value) || 0;
    const cardDiscount = parseInt(cardDiscountSelect.value) || 0;
    const cashback = parseInt(cashbackInput.value) || 0;
    const buyPrice = parseInt(buyPriceInput.value) || 0;

    const baseRentalTotal = monthlyFee * period;
    const totalCardDiscount = cardDiscount * period;
    const totalDiscountAndGift = totalCardDiscount + cashback;
    const netRentalTotal = Math.max(0, baseRentalTotal - totalDiscountAndGift);

    totalRentalEl.textContent = formatWon(netRentalTotal);
    totalDiscountEl.textContent = formatWon(totalDiscountAndGift);

    const diffVal = netRentalTotal - buyPrice;
    if (diffVal < 0) {
      // Rental is cheaper than buying
      diffLabelEl.textContent = "렌탈이 더 유리:";
      diffLabelEl.className = "text-green";
      diffValueEl.textContent = formatWon(Math.abs(diffVal));
      diffValueEl.className = "text-green";
    } else if (diffVal > 0) {
      // Buying is cheaper than rental
      diffLabelEl.textContent = "일시불 구매가 더 유리:";
      diffLabelEl.className = "text-coral";
      diffValueEl.textContent = formatWon(diffVal);
      diffValueEl.className = "text-coral";
    } else {
      diffLabelEl.textContent = "동일한 조건:";
      diffLabelEl.className = "";
      diffValueEl.textContent = "0원";
      diffValueEl.className = "";
    }
  }

  [monthlyFeeInput, contractPeriodSelect, cardDiscountSelect, cashbackInput, buyPriceInput].forEach((input) => {
    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);
  });

  calculate();
}

markPartnerLinks();
enhanceFaq();
buildBreadcrumbJsonLd();
buildFaqJsonLd();
buildArticleJsonLd();
syncHomeCardImages();
initRentalCalc();

function initQuiz() {
  const quizBody = document.getElementById("quiz-body");
  if (!quizBody) return;

  const steps = {
    1: document.getElementById("quiz-step-1"),
    2: document.getElementById("quiz-step-2"),
    3: document.getElementById("quiz-step-3"),
    result: document.getElementById("quiz-result-step")
  };

  const state = {
    household: "",
    management: "",
    product: ""
  };

  function showStep(stepKey) {
    Object.keys(steps).forEach((key) => {
      if (key === String(stepKey)) {
        steps[key].classList.add("active");
      } else {
        steps[key].classList.remove("active");
      }
    });
  }

  // Bind option clicks
  // Step 1
  steps[1].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.household = btn.getAttribute("data-value");
      showStep(2);
    });
  });

  // Step 2
  steps[2].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.management = btn.getAttribute("data-value");
      showStep(3);
    });
  });

  // Step 3
  steps[3].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.product = btn.getAttribute("data-value");
      renderResult();
      showStep("result");
    });
  });

  // Restart
  const restartBtn = document.getElementById("quiz-restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      state.household = "";
      state.management = "";
      state.product = "";
      showStep(1);
    });
  }

  // Print Result Card
  const printBtn = document.getElementById("quiz-print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      printQuizResult();
    });
  }

  function printQuizResult() {
    const printArea = document.getElementById("quiz-result-print-area");
    if (!printArea) return;

    const hhText = state.household === "single" ? "1인 가구 (자취/원룸)" : state.household === "couple" ? "2인 가구 (신혼/동거)" : "3인 이상 대가족";
    const mgText = state.management === "self" ? "자가관리 (셀프 필터 교체)" : "방문관리 (전문가 주기적 케어)";
    const pdText = state.product === "water" ? "정수기 (직수/온수)" : state.product === "air" ? "공기청정기 (미세먼지 케어)" : "비데 (살균/위생)";

    const dateStr = new Date().toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const adviceContent = document.getElementById("quiz-result-text").innerHTML;
    const guideTitle = document.getElementById("quiz-result-link").textContent;
    const guideUrl = document.getElementById("quiz-result-link").getAttribute("href");

    printArea.innerHTML = `
      <div style="border: 2px solid #0f8a68; padding: 30px; border-radius: 12px; font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; background: #fff;">
        <h1 style="color: #0f8a68; border-bottom: 2px solid #0f8a68; padding-bottom: 12px; margin-top: 0; font-size: 24px; text-align: center;">가전 렌탈 맞춤 자가진단 결과 보고서</h1>
        <p style="text-align: right; font-size: 12px; color: #667485;">진단 일시: ${dateStr}</p>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">1. 진단 고객 선택 항목</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; width: 30%; color: #667485; font-size: 14px;">가구 구성원</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${hhText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; color: #667485; font-size: 14px;">선호 관리형태</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${mgText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; color: #667485; font-size: 14px;">관심 가전품목</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${pdText}</td>
          </tr>
        </table>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">2. 맞춤형 렌탈 가이드 분석</h3>
        <div style="background: #f5f8f7; padding: 20px; border-radius: 8px; border: 1px solid #dce5e2; font-size: 14px; color: #17212b; margin-bottom: 24px;">
          ${adviceContent}
        </div>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">3. 추천 정밀 분석 가이드</h3>
        <p style="font-size: 14px; color: #667485; margin-bottom: 16px;">선택하신 가전렌탈 항목에 대한 합리적 약정 및 수수료 분석이 완료되었습니다. 자세한 비교 내용은 아래 오리지널 가이드에서 더 읽어보실 수 있습니다.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${location.origin}${guideUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #0f8a68; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
            ${guideTitle} 바로가기
          </a>
        </div>
        
        <div style="border-top: 1px dashed #dce5e2; margin-top: 40px; padding-top: 16px; text-align: center; font-size: 11px; color: #667485;">
          본 보고서는 스마트 가전 렌탈 분석 미디어 <strong>렌탈클리어</strong>(justinfarm.com)에서 실시간 연산되었습니다.
        </div>
      </div>
    `;

    window.print();
  }

  function renderResult() {
    const resultTextEl = document.getElementById("quiz-result-text");
    const resultLinkEl = document.getElementById("quiz-result-link");
    if (!resultTextEl || !resultLinkEl) return;

    let advice = "";
    let link = "";
    let title = "";

    const hhText = state.household === "single" ? "1인 가구" : state.household === "couple" ? "2인 가구" : "다인 가구";

    if (state.product === "water") {
      link = "/blog/water-purifier-rental-guide/";
      title = "정수기 렌탈 핵심 가이드";
      if (state.management === "self") {
        advice = `<p><strong>${hhText} 맞춤형 자가관리 정수기 추천:</strong></p>
                  <p>위생과 합리적인 가격을 동시에 잡을 수 있는 필터 셀프 교체식 직수 정수기를 권장합니다. 외부 방문인과의 일정 약속이 번거롭고 바쁜 직장인/1인 가구 라이프스타일에 특히 알맞습니다.</p>
                  <p>자가관리는 필터 교체 주기에 맞추어 택배로 배송된 필터를 돌려서 끼우기만 하면 되어 무척 간편하며, 방문관리에 비해 월 렌탈료를 5,000원~10,000원 정도 추가로 아낄 수 있습니다.</p>`;
      } else {
        advice = `<p><strong>${hhText} 맞춤형 방문관리 정수기 추천:</strong></p>
                  <p>주기적인 코크 소독 및 물길 전면 스팀 살균 케어를 받을 수 있는 방문관리(전문가 케어) 서비스를 권장합니다. 어린 자녀나 노약자가 있는 대가족 가구, 혹은 직접적인 기기 관리가 번거로우신 분들께 적합합니다.</p>
                  <p>4개월 또는 6개월 주기로 본사 케어 매니저가 직접 방문해 위생 상태를 철저히 검증해주므로 항상 안심하고 물을 마실 수 있습니다.</p>`;
      }
    } else if (state.product === "air") {
      link = "/blog/air-purifier-rental-guide/";
      title = "공기청정기 렌탈 핵심 가이드";
      if (state.household === "single") {
        advice = `<p><strong>1인 가구 컴팩트 공기청정기 추천:</strong></p>
                  <p>원룸이나 10평 내외의 오피스텔 거주 시에는 넓은 평수 대비 저렴한 소형 공기청정기를 자가관리 방식으로 선택하는 것이 비용 효율적입니다.</p>
                  <p>필터 먼지 털기 및 단순 교체 작업은 누구나 15초 만에 할 수 있으므로, 고가의 방문 서비스를 추가하는 것보다 자가관리가 훨씬 유리합니다.</p>`;
      } else {
        advice = `<p><strong>다인 가구 프리미엄 대형 공기청정기 추천:</strong></p>
                  <p>거주 면적이 넓고 먼지 발생량이 비교적 많은 2인 이상의 가구에는 거실 및 방 내부 공기 순환을 원활히 처리할 수 있는 15~20평형 이상의 공기청정기가 좋습니다.</p>
                  <p>방문 관리를 통해 주기적으로 프리필터를 물세척하고 활성탄/헤파 필터를 제때 교체해주어 집안 전체의 공기 청정 효율을 최대로 유지하는 편이 유리합니다.</p>`;
      }
    } else if (state.product === "bidet") {
      link = "/blog/bidet-rental-guide/";
      title = "비데 렌탈 핵심 가이드";
      if (state.management === "self") {
        advice = `<p><strong>비데 실속형 자가관리 추천:</strong></p>
                  <p>화장실 청소를 자주 하고 비데 노즐 및 필터 자가 관리가 용이한 생활 습관을 갖고 계신 분들께 적합합니다. IPX5 이상 방수 등급 제품을 골라 자유롭게 물청소를 하며, 정기적으로 노즐을 직접 세척해 렌탈료를 아껴 보세요.</p>`;
      } else {
        advice = `<p><strong>비데 위생형 방문관리 추천:</strong></p>
                  <p>비데는 습한 욕실에 위치하여 곰팡이와 물때, 요석이 생기기 아주 쉬운 가전입니다. 전문가 방문 케어를 신청하시면 제품을 변기에서 완전히 분리해 평소 보이지 않던 틈새까지 고온 스팀으로 살균 소독해 주므로 가장 안심하고 쓸 수 있습니다.</p>`;
      }
    }

    if (state.household === "couple" || state.household === "family") {
      advice += `<div class="quiz-bonus-tip" style="margin-top: 14px; padding: 12px; border-radius: 8px; background: rgba(15, 138, 104, 0.08); border-left: 4px solid var(--green); font-size: 13px;">
                  <strong>💡 카드 활용 팁:</strong> 2인 이상의 가구는 고정 생활 지출(통신비, 가스비, 아파트 관리비 등) 규모가 크기 때문에 렌탈 제휴 신용카드 전월 실적(30만 원)을 맞추기가 매우 수월합니다. 꼭 제휴카드를 매칭해서 월 13,000원~15,000원 이상의 렌탈료 즉시 할인을 챙겨 가세요!
                 </div>`;
    } else {
      advice += `<div class="quiz-bonus-tip" style="margin-top: 14px; padding: 12px; border-radius: 8px; background: rgba(15, 138, 104, 0.08); border-left: 4px solid var(--green); font-size: 13px;">
                  <strong>💡 1인 가구 팁:</strong> 월 고정 소비 금액이 낮아 제휴카드 전월 실적 30만 원 달성이 어렵다면, 통신비 결합 할인 또는 렌탈 기본 프로모션 할인 혜택을 최대로 확보할 수 있는 제품인지 대조해 보시기 바랍니다.
                 </div>`;
    }

    resultTextEl.innerHTML = advice;
    resultLinkEl.setAttribute("href", link);
    resultLinkEl.textContent = `${title} 읽기`;
  }
}

async function renderCardRanking() {
  const gridEl = document.getElementById("card-ranking-grid");
  if (!gridEl) return;

  try {
    const response = await fetch("/data/card-ranking.json");
    if (!response.ok) throw new Error("카드 데이터를 불러오는데 실패했습니다.");
    const cards = await response.json();

    let html = "";
    cards.forEach((card) => {
      const badgeClass = card.rank === 1 ? "" : card.rank === 2 ? "bg-blue" : "bg-grey";
      const highlightClass = card.highlight ? "highlight" : "";
      
      let benefitsHtml = "";
      card.benefits.forEach((b) => {
        benefitsHtml += `<li><strong>${b.spend}:</strong> ${b.discount} (${b.rate})</li>`;
      });

      let featuresHtml = "";
      card.features.forEach((f) => {
        featuresHtml += `<li style="margin-bottom: 6px; padding-left: 14px; position: relative;"><span style="position: absolute; left: 0; color: var(--green);">✓</span>${f}</li>`;
      });

      html += `
        <div class="ranking-card ${highlightClass}">
          <div class="ranking-badge ${badgeClass}">${card.rank}위 · 피킹률 ${card.peakingRate}</div>
          <h3>${card.name}</h3>
          
          <div class="card-section-title" style="font-size: 12px; font-weight: 800; color: var(--green); margin-top: 12px; margin-bottom: 6px;">[실적 구간별 할인 혜택]</div>
          <ul class="card-perks" style="margin-bottom: 12px;">
            ${benefitsHtml}
          </ul>

          <div class="card-section-title" style="font-size: 12px; font-weight: 800; color: var(--ink); margin-top: 12px; margin-bottom: 6px;">[카드 특장점]</div>
          <ul class="card-features-list" style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--muted); line-height: 1.6;">
            ${featuresHtml}
          </ul>
          
          <div class="card-annual-fee" style="font-size: 12px; margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--line); color: var(--muted);">
            <strong>연회비:</strong> ${card.annualFee}
          </div>
          
          <div class="card-tip-box" style="margin-top: 14px; padding: 10px; border-radius: 6px; background: var(--soft); font-size: 11px; line-height: 1.5; color: var(--muted); border-left: 3px solid var(--green);">
            <strong>💡 추천 팁:</strong> ${card.tip}
          </div>
        </div>
      `;
    });

    gridEl.innerHTML = html;
  } catch (error) {
    console.warn("카드 랭킹을 렌더링하지 못했습니다. 기본 정적 데이터를 표시합니다.", error);
  }
}

initQuiz();
renderCardRanking();

