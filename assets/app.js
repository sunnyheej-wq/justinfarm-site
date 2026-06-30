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
      name: "렌탈통신다이렉트"
    },
    publisher: {
      "@type": "Organization",
      name: "렌탈통신다이렉트"
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
          본 보고서는 스마트 가전 렌탈 분석 미디어 <strong>렌탈통신다이렉트</strong>(justinfarm.com)에서 실시간 연산되었습니다.
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

function initTelecomQuiz() {
  const quizBody = document.getElementById("telecom-quiz-body");
  if (!quizBody) return;

  const steps = {
    1: document.getElementById("telecom-quiz-step-1"),
    2: document.getElementById("telecom-quiz-step-2"),
    3: document.getElementById("telecom-quiz-step-3"),
    result: document.getElementById("telecom-quiz-result-step")
  };

  const state = {
    carrier: "",
    lines: "",
    speed: ""
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

  // Bind clicks
  steps[1].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.carrier = btn.getAttribute("data-value");
      showStep(2);
    });
  });

  steps[2].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lines = btn.getAttribute("data-value");
      showStep(3);
    });
  });

  steps[3].querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.speed = btn.getAttribute("data-value");
      renderResult();
      showStep("result");
    });
  });

  // Restart
  const restartBtn = document.getElementById("telecom-quiz-restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      state.carrier = "";
      state.lines = "";
      state.speed = "";
      showStep(1);
    });
  }

  // Print
  const printBtn = document.getElementById("telecom-quiz-print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      printQuizResult();
    });
  }

  function printQuizResult() {
    const printArea = document.getElementById("telecom-quiz-result-print-area");
    if (!printArea) return;

    const carrierNames = { skt: "SKT (SK텔레콤)", kt: "KT (케이티)", lg: "LG U+ (엘지유플러스)", mvno: "알뜰폰 (결합 없음)" };
    const lineNames = { "1": "1회선 (본인 단독)", "2": "2회선 결합", "3": "3회선 이상 결합" };
    const speedNames = { "100": "100Mbps 실속형", "500": "500Mbps 베이직", "1000": "1Gbps 게이밍/대용량" };

    const crText = carrierNames[state.carrier] || state.carrier;
    const lnText = lineNames[state.lines] || state.lines;
    const spText = speedNames[state.speed] || state.speed;

    const dateStr = new Date().toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const adviceContent = document.getElementById("telecom-quiz-result-text").innerHTML;
    const guideTitle = document.getElementById("telecom-quiz-result-link").textContent;
    const guideUrl = document.getElementById("telecom-quiz-result-link").getAttribute("href");

    printArea.innerHTML = `
      <div style="border: 2px solid #0f8a68; padding: 30px; border-radius: 12px; font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; background: #fff;">
        <h1 style="color: #0f8a68; border-bottom: 2px solid #0f8a68; padding-bottom: 12px; margin-top: 0; font-size: 24px; text-align: center;">인터넷 & TV 통신사 맞춤 자가진단 결과 보고서</h1>
        <p style="text-align: right; font-size: 12px; color: #667485;">진단 일시: ${dateStr}</p>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">1. 진단 고객 선택 항목</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; width: 30%; color: #667485; font-size: 14px;">주요 모바일 통신사</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${crText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; color: #667485; font-size: 14px;">가족 모바일 회선 수</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${lnText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dce5e2;">
            <th style="text-align: left; padding: 10px; color: #667485; font-size: 14px;">필요 인터넷 대역폭</th>
            <td style="padding: 10px; font-weight: bold; color: #17212b; font-size: 14px;">${spText}</td>
          </tr>
        </table>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">2. 맞춤형 결합상품 가이드 분석</h3>
        <div style="background: #f5f8f7; padding: 20px; border-radius: 8px; border: 1px solid #dce5e2; font-size: 14px; color: #17212b; margin-bottom: 24px;">
          ${adviceContent}
        </div>
        
        <h3 style="border-left: 4px solid #0f8a68; padding-left: 10px; color: #17212b; margin-top: 24px;">3. 추천 정밀 분석 가이드</h3>
        <p style="font-size: 14px; color: #667485; margin-bottom: 16px;">인터넷 가입 및 가족 결합 혜택 분석이 완료되었습니다. 자세한 비교 내용은 아래 오리지널 가이드에서 더 읽어보실 수 있습니다.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${location.origin}${guideUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #0f8a68; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
            ${guideTitle} 바로가기
          </a>
        </div>
        
        <div style="border-top: 1px dashed #dce5e2; margin-top: 40px; padding-top: 16px; text-align: center; font-size: 11px; color: #667485;">
          본 보고서는 통신 및 가전 비교 분석 미디어 <strong>렌탈통신다이렉트</strong>(justinfarm.com)에서 실시간 연산되었습니다.
        </div>
      </div>
    `;

    window.print();
  }

  function renderResult() {
    const resultTextEl = document.getElementById("telecom-quiz-result-text");
    const resultLinkEl = document.getElementById("telecom-quiz-result-link");
    if (!resultTextEl || !resultLinkEl) return;

    let advice = "";
    let link = "";
    let title = "";

    if (state.carrier === "skt") {
      link = "/category/sk/";
      title = "SK 인터넷 가이드";
      if (state.lines === "3") {
        advice = `<p><strong>SKT 모바일 3회선 결합 + T 온가족할인 최적 추천:</strong></p>
                  <p>가족들의 SKT 합산 가입 연수가 30년 이상이라면 인터넷 50% + 모바일 30% 할인이 가능한 <strong>T 온가족할인</strong>이 압도적으로 유리합니다. 만약 30년 미만이라면 <strong>요즘가족결합</strong>으로 묶어 인터넷 요금 추가 할인과 모바일 데이터를 공유받으시는 것을 강력히 추천해 드립니다.</p>`;
      } else if (state.lines === "2") {
        advice = `<p><strong>SKT 모바일 2회선 요즘가족결합 추천:</strong></p>
                  <p>가족 2명이 SKT 휴대폰을 사용하고 있다면 요즘가족결합을 통해 인터넷 요금(100M 기준 5,500원, 500M 이상 기준 11,000원 할인)과 모바일 요금 할인을 동시에 받을 수 있습니다. SK Broadband는 기본 요금 및 셋톱박스(Smart3/애플TV)의 가성비가 가장 뛰어나며, 결합 시 매월 요금 감면 혜택이 매우 높습니다.</p>`;
      } else {
        advice = `<p><strong>SKT 1회선 결합 추천:</strong></p>
                  <p>본인 1명만 SKT를 쓰더라도 1회선 모바일 결합 할인을 통해 월 3,300원~4,400원의 인터넷 요금 할인을 적용받을 수 있습니다. 인터넷 속도는 1인 가구 기준 100Mbps(슬림)가 가장 실속 있지만, 실시간 4K 영상 스트리밍이나 재택근무를 하신다면 500Mbps(베이직)를 선택하는 것이 좋습니다.</p>`;
      }
    } else if (state.carrier === "kt") {
      link = "/category/kt/";
      title = "KT 인터넷 가이드";
      advice = `<p><strong>KT 올레 인터넷 품질 최우선 가입 추천:</strong></p>
                <p>가족들이 KT 모바일을 주로 사용하고 계신다면, KT의 <strong>총액 결합할인</strong> 또는 <strong>프리미엄 가족결합</strong>을 매칭하시는 것이 최상의 선택입니다.</p>
                <p>KT는 전국 광케이블(FTTH) 대칭형 보급률이 99% 이상으로 가장 안정적이며 지연 시간(Ping)이 가장 낮아 온라인 게임 매니아 및 실시간 트레이딩 주식 투자자에게 적합합니다. 셋톱박스인 기가지니 3/A AI 비서 인공지능 제어 성능도 타사 대비 매우 우수합니다.</p>`;
    } else if (state.carrier === "lg") {
      link = "/category/lg/";
      title = "LG U+ 가이드";
      advice = `<p><strong>LG U+ 콘텐츠&결합 할인 추천:</strong></p>
                <p>가족이 LG U+ 모바일을 사용하신다면 <strong>참 쉬운 가족결합</strong>을 통해 큰 폭의 할인을 받을 수 있습니다.</p>
                <p>LG U+는 디즈니 플러스(Disney+) 및 넷플릭스 등 글로벌 OTT 연동성이 가장 적극적이며, 셋톱박스 구동 속도가 매우 빠릅니다. 또한 기가인터넷 신청 시 와이파이 공유기 무상 대여 혜택이 기본 포함되어 실속이 큽니다. 알뜰폰(MVNO) 중에서도 LG U+망을 쓰는 다양한 파트너 카드가 결합 할인 대상에 폭넓게 포함됩니다.</p>`;
    } else if (state.carrier === "mvno") {
      link = "/compare/";
      title = "통신 3사 비교표";
      advice = `<p><strong>알뜰폰 사용자 맞춤 가성비 인터넷 추천:</strong></p>
                <p>현재 모바일 결합 할인을 받기 어려운 알뜰폰(MVNO)을 사용 중이시라면, 결합 없이도 인터넷 단독 요금이 가장 저렴한 SK Broadband를 고르시거나, LG U+ 망을 쓰는 알뜰폰 요금제 중 U+ 참 쉬운 가족결합이 연동되는 파트너 요금제(리브엠, 유모바일 등)로 매칭하여 결합 할인을 설계하는 것을 추천합니다. 결합 할인이 아예 불가능하다면 월 기본 요금이 가장 저렴한 실속형 요금제로 3년 약정을 신청하시는 것이 총비용 관점에서 유리합니다.</p>`;
    }

    if (state.speed === "100") {
      advice += `<div class="quiz-bonus-tip" style="margin-top: 14px; padding: 12px; border-radius: 8px; background: rgba(15, 138, 104, 0.08); border-left: 4px solid var(--green); font-size: 13px;">
                  <strong>⚡ 인터넷 100Mbps 팁:</strong> 1인 가구, 단순 웹서핑 및 유튜브 FHD 시청 위주의 환경에 충분히 알맞은 경제적인 상품입니다. 다만 가족 구성원이 2인 이상이거나 스마트홈 기기가 많다면 500M 기가 라이트로 업그레이드하시는 것이 끊김을 방지하는 길입니다.
                 </div>`;
    } else if (state.speed === "500") {
      advice += `<div class="quiz-bonus-tip" style="margin-top: 14px; padding: 12px; border-radius: 8px; background: rgba(15, 138, 104, 0.08); border-left: 4px solid var(--green); font-size: 13px;">
                  <strong>⚡ 인터넷 500Mbps 팁:</strong> 초당 최대 62.5MB 파일 전송 속도를 보장하며, 4K UHD 넷플릭스 멀티 시청, 재택근무 화상 회의, 대용량 스트리밍을 쾌적하고 딜레이 없이 이용할 수 있는 스윗스팟 상품입니다.
                 </div>`;
    } else if (state.speed === "1000") {
      advice += `<div class="quiz-bonus-tip" style="margin-top: 14px; padding: 12px; border-radius: 8px; background: rgba(15, 138, 104, 0.08); border-left: 4px solid var(--green); font-size: 13px;">
                  <strong>⚡ 인터넷 1Gbps 팁:</strong> 초당 최대 125MB급 전송이 가능한 대역폭으로 고사양 스팀 게임 다운로드 시간을 단축하고 싶은 파워 게이머, 실시간 주식 트레이더, 1인 미디어 업로드를 매일 진행하는 크리에이터에게 최선의 속도입니다.
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
initTelecomQuiz();
renderCardRanking();
initBuyingGuide();

// ==========================================================================
// Interactive Buying Guide Data & Controller
// ==========================================================================

function initBuyingGuide() {
  const guideContainer = document.getElementById("buying-guide-container");
  if (!guideContainer) return;

  const buyingGuideData = {
    water: {
      mainTitle: "정수기 렌탈 구매가이드 TOP6",
      subTitle: "2026년 최신 정수기 렌탈 모델들의 약정, 필터 성능, 위생 관리 조건과 월 납입료를 비교했습니다.",
      metaDate: "2026년 6월 19일",
      metaTarget: "정수기 렌탈 6대 브랜드",
      metaCore: "월 렌탈료 50% + 위생 20%",
      criteria: {
        good: "매일 물을 자주 마시며 코크 소독 및 물길 전면 고온 살균 등의 방문 관리 위생 서비스를 안심하고 받고 싶은 가정.",
        warn: "주방 조리대 공간이 너무 협소하거나, 전세/월세 주택이라 싱크대 상판 타공(구멍 뚫기) 작업을 원치 않는 경우 사전 협의가 필요합니다.",
        order: "월 렌탈료 한도 책정 → 자가관리 vs 방문관리 확정 → 냉온수/얼음 탑재 유무 선택 → 제휴 신용카드 연동 설계."
      },
      weights: [
        { label: "월 렌탈료 (가격)", pct: "50%", width: "100%" },
        { label: "위생 및 관리 (케어)", pct: "20%", width: "40%" },
        { label: "브랜드 및 사후서비스", pct: "10%", width: "20%" },
        { label: "부가기능 (얼음/온도)", pct: "10%", width: "20%" },
        { label: "크기 및 공간 활용", pct: "10%", width: "20%" }
      ],
      scenarios: [
        { tag: "1인 가구/자취생", title: "슬림 직수 자가관리", desc: "공간을 적게 차지하는 가로 13~15cm 직수형 모델과 비용이 저렴한 자가관리 정수기가 최적입니다." },
        { tag: "신혼부부/2인", title: "인테리어 직수형", desc: "디자인이 고급스럽고 냉온수 조절이 편리하며 제휴카드 실적을 몰아 할인 받기 좋습니다." },
        { tag: "어린 자녀 가정", title: "고온살균 방문관리형", desc: "아이 분유 온수 조절 및 아토피 예방을 위해 정기 살균과 필터 교체를 해주는 전문가 케어가 필수적입니다." },
        { tag: "얼음/음료 선호", title: "얼음정수기 크기 대조", desc: "얼음 트레이 분리 세척이 가능하고 제빙 용량이 넉넉한 웰메이드 얼음정수기가 알맞습니다." }
      ],
      products: [
        {
          rank: 1,
          name: "LG 퓨리케어 오브제컬렉션 라이트온 직수 정수기",
          price: "월 29,900원",
          score: "99.0",
          tags: ["종합 1위", "실시간 케어"],
          pros: ["13cm 초슬림 디자인으로 좁은 주방 싱크대 공간 극대화", "직수관 고온 자동 살균 및 코크 전기분해 살균 탑재"],
          cons: ["냉수 전용 선택 시 온수 온도 미지원 (냉온수 모델 필수 확인)"],
          specs: { "가로 폭": "13cm", "관리형태": "자가/방문 선택", "온수조절": "온수 3단계 조절", "냉온수": "지원", "필터방식": "맥스컷 필터", "자동살균": "지원" },
          moreSpecs: { "제조사": "LG전자", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 6개월", "크기": "130x490x399mm" },
          scores: { "가격": 92, "위생성": 90, "편의성": 85, "서비스": 80, "크기": 80, "디자인": 88 },
          image: "/assets/photos/lg-puri-water.png",
          link: "/blog/water-purifier-rental-guide/"
        },
        {
          rank: 2,
          name: "코웨이 아이콘 정수기 2",
          price: "월 32,900원",
          score: "97.8",
          tags: ["브랜드 1위", "자가관리 간편"],
          pros: ["가로 18cm 컴팩트 디자인과 다양한 파스텔톤 컬러 구성", "카트리지식 필터로 3초 만에 간편 자가 교체 가능"],
          cons: ["보급형 브랜드 정수기에 비해 월 렌탈료가 2,000~3,000원가량 높음"],
          specs: { "가로 폭": "18cm", "관리형태": "방문/자가 선택", "온수조절": "100도 초고온 온수", "냉온수": "지원", "필터방식": "나노트랩 필터", "자동살균": "지원" },
          moreSpecs: { "제조사": "코웨이", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 4개월", "크기": "180x340x385mm" },
          scores: { "가격": 88, "위생성": 95, "편의성": 90, "서비스": 95, "크기": 88, "디자인": 92 },
          image: "/assets/photos/water-purifier.jpg",
          link: "/blog/water-purifier-rental-guide/"
        },
        {
          rank: 3,
          name: "SK매직 스스로 직수 정수기",
          price: "월 27,900원",
          score: "96.2",
          tags: ["가성비 1위", "자동 살균 우수"],
          pros: ["코크 전해수 살균 및 유로 자동 순환 배수 기능 기본 탑재", "동급 대기업 브랜드 대비 가장 저렴하고 합리적인 렌탈 요금"],
          cons: ["방문관리 주기가 코웨이에 비해 긴 편 (자가관리 권장)"],
          specs: { "가로 폭": "16.5cm", "관리형태": "자가/방문 선택", "온수조절": "온수 3단계 조절", "냉온수": "지원", "필터방식": "복합 블록필터", "자동살균": "자동 전해수" },
          moreSpecs: { "제조사": "SK매직", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 4개월", "크기": "165x490x395mm" },
          scores: { "가격": 94, "위생성": 90, "편의성": 86, "서비스": 85, "크기": 90, "디자인": 85 },
          image: "/assets/photos/lg-refrigerator.jpg",
          link: "/blog/water-purifier-rental-guide/"
        },
        {
          rank: 4,
          name: "쿠쿠 끓인물 직수 정수기",
          price: "월 28,900원",
          score: "95.0",
          tags: ["100도 끓는물", "조리수 활용"],
          pros: ["국내 최초 100도 초고온 끓는물 출수로 간편식 및 젖병 소독 용이", "전기분해 코크 살균 탑재으로 외부 노출 부위 안심 살균"],
          cons: ["끓는물 대기 시간이 일반 직수 정수기보다 수 초간 지연됨"],
          specs: { "가로 폭": "17cm", "관리형태": "자가/방문 선택", "온수조절": "100도 끓는물 지원", "냉온수": "지원", "필터방식": "나노 포지티브 필터", "자동살균": "지원" },
          moreSpecs: { "제조사": "쿠쿠홈시스", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 4개월", "크기": "170x490x390mm" },
          scores: { "가격": 89, "위생성": 88, "편의성": 94, "서비스": 84, "크기": 88, "디자인": 87 },
          image: "/assets/photos/appliance-kitchen.jpg",
          link: "/blog/water-purifier-rental-guide/"
        },
        {
          rank: 5,
          name: "Wells 더원 빌트인 정수기",
          price: "월 38,900원",
          score: "94.1",
          tags: ["공간 혁신", "빌트인 전용"],
          pros: ["주방 대리석 위에 3cm 파우셋만 노출되어 넓은 주방 공간 확보 가능", "180도 회전 파우셋 및 체계적인 방문 위생 살균 케어"],
          cons: ["본체를 싱크대 하단에 매립하므로 싱크대 내부 수납공간이 일부 감소함"],
          specs: { "노출 크기": "직경 3cm", "관리형태": "방문 전용", "온수조절": "지원", "냉온수": "지원", "설치타입": "언더싱크 빌트인", "필터방식": "웰스스케일 커트" },
          moreSpecs: { "제조사": "교원웰스", "소유권이전": "60개월", "의무약정": "60개월 전용", "필터수명": "약 6개월", "본체크기": "190x475x380mm" },
          scores: { "가격": 80, "위생성": 91, "편의성": 92, "서비스": 90, "크기": 98, "디자인": 96 },
          image: "/assets/photos/water-purifier.jpg",
          link: "/blog/water-purifier-rental-guide/"
        },
        {
          rank: 6,
          name: "청호나이스 세니타 얼음정수기",
          price: "월 43,900원",
          score: "93.8",
          tags: ["얼음 대표", "순환 위생살균"],
          pros: ["얼음 제빙부 및 트레이 내부까지 전기분해수로 매일 살균 작동", "역삼투압 필터 탑재로 지하수 지역 및 중금속 잔류 걱정 완벽 해소"],
          cons: ["대형 사이즈로 좁은 싱크대 설치가 불가능하며 월 렌탈료가 매우 높음"],
          specs: { "가로 폭": "29cm", "관리형태": "방문 전용", "얼음기능": "제빙 지원", "냉온수": "지원", "필터방식": "역삼투압 필터", "제빙량": "0.5kg" },
          moreSpecs: { "제조사": "청호나이스", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 6개월", "크기": "290x497x474mm" },
          scores: { "가격": 78, "위생성": 96, "편의성": 95, "서비스": 92, "크기": 70, "디자인": 85 },
          image: "/assets/photos/lg-refrigerator.jpg",
          link: "/blog/water-purifier-rental-guide/"
        }
      ],
      faqs: [
        { q: "정수기 렌탈은 의무약정 기간이 어떻게 되나요?", a: "브랜드별로 다르지만 주로 3년(36개월) 또는 5년(60개월) 의무 약정 기간이 설정됩니다. 약정이 길수록 월 렌탈료는 저렴해지나, 중도 해지 시 남은 기간 렌탈료의 10%가 위약금으로 발생하며 수령한 사은품의 반환 비용이 부과되니 사전에 대조하셔야 합니다." },
        { q: "자가관리형 필터 교체는 정말 쉬운가요?", a: "최근 출시되는 자가관리 제품들은 카트리지 돌려 끼우기 방식으로 설계되어 누구나 10초 만에 공구 없이 필터 교체가 가능합니다. 다만 필터의 주기적 물청소(원수 제거) 및 코크 입구 소독 등 기본 세척은 본인이 직접 챙겨야 합니다." },
        { q: "얼음정수기는 전기요금이 많이 나오나요?", a: "얼음을 계속 얼려 두고 보관해야 하므로 일반 정수기 대비 대기 전력 소모량이 1.5배~2배 정도 많습니다. 전기세 부담을 낮추려면 에너지 효율 1등급 제품이나, 야간 스마트 절전 모드가 탑재된 모델을 고르는 것이 유리합니다." }
      ]
    },
    air: {
      mainTitle: "공기청정기 렌탈 구매가이드 TOP6",
      subTitle: "2026년 미세먼지와 생활 냄새를 가장 효율적으로 잡는 공기청정기 렌탈 모델들을 비교 분석했습니다.",
      metaDate: "2026년 6월 19일",
      metaTarget: "공기청정기 렌탈 5대 브랜드",
      metaCore: "월 렌탈료 45% + 필터 25%",
      criteria: {
        good: "황사, 초미세먼지, 반려동물 털 및 냄새를 완벽히 제거하고 필터 청소/교체 주기를 전문가에게 맡겨 관리받고 싶은 사용자.",
        warn: "실제 거실 평수보다 너무 작은 권장 면적의 공기청정기를 고르면 청정 순환율이 급격히 낮아져 효과가 반감될 수 있습니다.",
        order: "사용할 공간의 실평수 측정 → 극세필터 물세척 등 자가관리 여부 확정 → 필터 유효 등급(H13 이상) 확인 → 제휴카드 매칭."
      },
      weights: [
        { label: "월 렌탈료 (가격)", pct: "45%", width: "90%" },
        { label: "청정 면적 (용량)", pct: "25%", width: "50%" },
        { label: "필터 등급 및 위생", pct: "15%", width: "30%" },
        { label: "정기 케어 서비스", pct: "10%", width: "20%" },
        { label: "소음 및 사용 편의성", pct: "5%", width: "10%" }
      ],
      scenarios: [
        { tag: "원룸 / 1인 가구", title: "소형 자가관리형", desc: "10평 이하 원룸은 슬림형 디자인에 필터만 정기 배송되는 저렴한 모델이 최선입니다." },
        { tag: "반려동물 가정", title: "펫 전용 탈취 필터형", desc: "동물의 털 날림을 잡는 프리필터 커버와 대소변 냄새를 잡는 광촉매 탈취 필터 탑재 모델을 추천합니다." },
        { tag: "아파트 거실형", title: "360도 대형 청정기", desc: "사각지대 없이 집안 전체의 공기를 빠르게 순환시키는 타워형 대형 공기청정기가 유리합니다." },
        { tag: "다양한 방 이동형", title: "무빙휠 탑재 모델", desc: "바퀴가 달려 거실, 공부방, 안방 등으로 필요에 따라 쉽게 굴려서 이동할 수 있는 모델입니다." }
      ],
      products: [
        {
          rank: 1,
          name: "코웨이 노블 공기청정기 30평형",
          price: "월 32,900원",
          score: "99.0",
          tags: ["프리미엄 1위", "디자인 혁신"],
          pros: ["건축학적 아키텍처 디자인으로 거실 인테리어 시각적 가치 상승", "에어매치 필터(반려동물/새집증후군 등) 개인 맞춤형 장착 가능"],
          cons: ["필터 흡입구가 상단 위주라 바닥 틈새 먼지 청정력은 다소 타협"],
          specs: { "청정면적": "30평형", "관리형태": "방문/자가 선택", "디자인": "아키텍처 인테리어", "필터": "에어매치 특화 필터", "에어클린": "더블 에어매칭", "위생": "UV-C 자동살균" },
          moreSpecs: { "제조사": "코웨이", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 12개월", "크기": "320x800x320mm" },
          scores: { "가격": 88, "위생성": 96, "편의성": 94, "서비스": 95, "크기": 88, "디자인": 98 },
          image: "/assets/photos/coway-noble-air.png",
          link: "/blog/air-purifier-rental-guide/"
        },
        {
          rank: 2,
          name: "LG PuriCare 360도 공기청정기 알파",
          price: "월 34,900원",
          score: "97.5",
          tags: ["청정 성능 1위", "클린부스터"],
          pros: ["360도 전 방향 입체 흡입과 9m까지 바람을 날려주는 클린부스터 장착", "인공지능 공기질 분석 센서로 오염 지역 집중 청정 작동"],
          cons: ["기기 무게가 무겁고 직경이 넓어 이동성이 다소 떨어짐"],
          specs: { "청정면적": "30.2평형", "관리형태": "방문/자가 선택", "순환방식": "클린부스터 360도", "필터": "G필터 (탈취/항균)", "센서": "PM 1.0 극미세먼지", "소음": "도서관 수준 저소음" },
          moreSpecs: { "제조사": "LG전자", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 12개월", "크기": "376x1073x376mm" },
          scores: { "가격": 82, "위생성": 95, "편의성": 92, "서비스": 90, "크기": 80, "디자인": 96 },
          image: "/assets/photos/air-purifier.jpg",
          link: "/blog/air-purifier-rental-guide/"
        },
        {
          rank: 3,
          name: "삼성 블루스카이 5500",
          price: "월 19,900원",
          score: "96.0",
          tags: ["극강 가성비", "슬림 벽밀착"],
          pros: ["벽면에 붙여서 배치 가능한 전면 흡입형 설계로 공간 효율성 우수", "전월 카드 할인 매칭 시 사실상 공짜 수준의 월 렌탈 요금 실현"],
          cons: ["원거리 공기 흡입 능력이 원형 타워 모델 대비 다소 밀림"],
          specs: { "청정면적": "18평형", "관리형태": "자가관리 특화", "디자인": "플랫형 벽밀착", "필터": "항균 헤파 필터", "흡입": "3방향 입체 흡입", "디스플레이": "먼지 수치 표기" },
          moreSpecs: { "제조사": "삼성전자", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 6개월~12개월", "크기": "360x783x293mm" },
          scores: { "가격": 98, "위생성": 85, "편의성": 88, "서비스": 82, "크기": 92, "디자인": 84 },
          image: "/assets/photos/lg-tv.jpg",
          link: "/blog/air-purifier-rental-guide/"
        },
        {
          rank: 4,
          name: "SK매직 올클린 공기청정기 Virus Fit",
          price: "월 22,900원",
          score: "95.1",
          tags: ["완전 물세척", "항바이러스"],
          pros: ["팬과 토출구 등 공기가 닿는 모든 부품을 완전히 분리해 물세척 가능", "공기 중의 세균 및 미세 바이러스를 99.9% 억제하는 살균 기능 탑재"],
          cons: ["자가 살균 시 물세척 주기를 꼼꼼히 챙기지 않으면 팬 소음이 증가함"],
          specs: { "청정면적": "20평형", "관리형태": "자가/방문 선택", "세척성": "올워셔블 완전 분리", "필터": "항바이러스 필터", "살균": "UV-C 아크살균", "친환경": "재활용 플라스틱" },
          moreSpecs: { "제조사": "SK매직", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 12개월", "크기": "369x800x369mm" },
          scores: { "가격": 91, "위생성": 92, "편의성": 87, "서비스": 86, "크기": 88, "디자인": 86 },
          image: "/assets/photos/appliance-kitchen.jpg",
          link: "/blog/air-purifier-rental-guide/"
        },
        {
          rank: 5,
          name: "쿠쿠 울트라 12000 공기청정기",
          price: "월 21,900원",
          score: "94.2",
          tags: ["34평형 대용량", "넓은거실 제격"],
          pros: ["저렴한 렌탈료임에도 34평 넓은 면적을 감당하는 대형 팬 탑재", "실시간 미세먼지 수치를 정밀 표기하는 LED 디스플레이 구성"],
          cons: ["대형 모터 특성상 터보 모드 가동 시 풍량 소음이 다소 발생함"],
          specs: { "청정면적": "34.1평형", "관리형태": "자가관리 권장", "센서": "듀얼 초미세먼지 센서", "풍량": "자동/터보 조절", "필터": "토탈 3중 케어필터", "이동성": "바퀴 탑재" },
          moreSpecs: { "제조사": "쿠쿠홈시스", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 12개월", "크기": "396x755x396mm" },
          scores: { "가격": 93, "위생성": 86, "편의성": 89, "서비스": 83, "크기": 75, "디자인": 80 },
          image: "/assets/photos/cost-calc.jpg",
          link: "/blog/air-purifier-rental-guide/"
        },
        {
          rank: 6,
          name: "위닉스 타워 프라임 공기청정기",
          price: "월 18,900원",
          score: "93.5",
          tags: ["알뜰 가성비", "소형이동 편의"],
          pros: ["동급 26평형 중 최저 수준의 렌탈 단가 설정 및 에어케어 탑재", "360도 서라운드 흡입 구조 및 무빙휠 기본 제공으로 이동 편리"],
          cons: ["IoT 모바일 원격 제어 인터페이스가 대기업 대비 단순함"],
          specs: { "청정면적": "26평형", "관리형태": "자가 전용형", "이동성": "무빙휠 기본 제공", "필터": "마이크로 에어케어 필터", "청정": "서라운드 입체 흡입", "에너지": "1등급 인증" },
          moreSpecs: { "제조사": "위닉스", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "필터수명": "약 6개월~12개월", "크기": "390x750x390mm" },
          scores: { "가격": 96, "위생성": 84, "편의성": 85, "서비스": 82, "크기": 84, "디자인": 80 },
          image: "/assets/photos/plant-art.png",
          link: "/blog/air-purifier-rental-guide/"
        }
      ],
      faqs: [
        { q: "공기청정기는 방문관리 서비스가 꼭 필요한가요?", a: "공기청정기는 정수기와 다르게 물이 흐르지 않기 때문에 위생 살균의 난이도가 낮습니다. 자가관리형으로 신청하여 전면 필터망에 낀 큰 먼지를 한 달에 한 번 청소기로 흡입해주고, 1년에 한 번 헤파 필터만 교체해주면 충분하므로 요금을 줄이시려면 자가관리형이 가장 권장됩니다." },
        { q: "공기청정기 필터 등급은 어떤 것을 봐야 하나요?", a: "일반 가정용 초미세먼지 방지 목적이라면 H13 등급의 트루 헤파 필터가 장착되었는지를 대조해 보면 됩니다. 필터의 세부 등급보다는 집안 크기에 맞는 권장 흡입 청정 평형(실면적의 1.3배 이상 평형 추천)이 더 중요한 기준이 됩니다." },
        { q: "반려동물이 있는데 어떤 모델이 좋을까요?", a: "강아지나 고양이의 털 날림을 잡으려면 탈취/헤파 필터 겉면에 별도의 펫 전용 벨크로형 프리필터를 탈부착해 자주 뜯어 교체할 수 있는 펫 전문 패키지 모델(코웨이 펫 필터 또는 LG 펫 모드 탑재 기종)을 고르는 것이 좋습니다." }
      ]
    },
    bidet: {
      mainTitle: "비데 렌탈 구매가이드 TOP6",
      subTitle: "2026년 욕실 방수 기능과 자체 노즐 전해수 살균이 완벽한 가성비 비데 렌탈 모델들을 비교 분석했습니다.",
      metaDate: "2026년 6월 19일",
      metaTarget: "비데 렌탈 4대 브랜드",
      metaCore: "월 렌탈료 45% + 위생 25%",
      criteria: {
        good: "민감한 신체 부위 위생 관리가 철저하고, 화장실 물청소를 자유롭게 하며 노즐 살균 스팀 케어를 정기적으로 맡기고 싶은 사용자.",
        warn: "욕실 변기 근처에 전원 콘센트가 없거나, 샤워기 물이 바로 닿는 환경인데 방수 등급(IPX5 미만)이 낮은 모델을 고르면 고장 나기 쉽습니다.",
        order: "욕실 변기 사이즈 및 콘센트 유무 확인 → IPX5/IPX6 방수 등급 확인 → 방문 살균 관리 주기 선택 → 제휴카드 할인 적용."
      },
      weights: [
        { label: "월 렌탈료 (가격)", pct: "45%", width: "90%" },
        { label: "위생 및 살균력", pct: "25%", width: "50%" },
        { label: "방수 등급 (안전)", pct: "15%", width: "30%" },
        { label: "정기 케어 주기", pct: "10%", width: "20%" },
        { label: "세정 편의 기능", pct: "5%", width: "10%" }
      ],
      scenarios: [
        { tag: "욕실 물청소 선호", title: "IPX6 최고방수형", desc: "샤워기로 시원하게 비데 변좌 주위와 도기 틈새까지 물청소를 할 수 있는 고등급 방수 비데가 필수입니다." },
        { tag: "위생 예민한 가구", title: "전해수 자동살균형", desc: "사용 전후 노즐을 전기분해 살균수로 자동으로 세척하고 도기 내부 항균 기능이 충실한 위생 특화 모델." },
        { tag: "1인/자가관리 가구", title: "노즐 분리 세척형", desc: "방문 코디 없이 노즐 팁을 손쉽게 분리해 직접 물로 씻고 필터 교체도 3초 만에 가능한 자가관리 비데입니다." },
        { tag: "아이 / 민감 신체", title: "부드러운 에어세정형", desc: "자극이 적은 어린이 세정 및 공기 방울을 섞어 부드럽게 세정해 주는 미세 공기방울 탑재 모델입니다." }
      ],
      products: [
        {
          rank: 1,
          name: "코웨이 룰루 더블케어 비데",
          price: "월 21,900원",
          score: "99.0",
          tags: ["종합 1위", "더블 살균"],
          pros: ["도기 벽면과 비데 노즐을 듀얼 전해수로 회전 살균해 최고 위생성 확보", "IPX6 등급의 높은 방수 성능으로 샤워기를 이용한 전면 물청소 지원"],
          cons: ["타사 보급형 비데 대비 월 렌탈 비용이 약 2,000원가량 비쌈"],
          specs: { "방수등급": "IPX6 등급", "관리형태": "방문/자가 선택", "노즐재질": "풀 스테인리스", "살균": "도기/노즐 전해수", "필터": "프리 마이크로필터", "변좌": "온열 변좌 지원" },
          moreSpecs: { "제조사": "코웨이", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1200W", "크기": "412x530x145mm" },
          scores: { "가격": 89, "위생성": 96, "편의성": 93, "서비스": 95, "크기": 88, "디자인": 90 },
          image: "/assets/photos/clean-bidet-bathroom.png",
          link: "/blog/bidet-rental-guide/"
        },
        {
          rank: 2,
          name: "SK매직 풀스텐 항균 비데",
          price: "월 19,900원",
          score: "97.4",
          tags: ["가성비 최고", "풀스텐 노출"],
          pros: ["노즐 팁 뿐만 아니라 노즐 전체를 풀 스테인리스로 제작해 오염 원천 차단", "연간 카드 자동이체 활용 시 5,000원 이하로 실지불 사용 가능한 가격 파괴 모델"],
          cons: ["도기 회전 물 분사 살균 기능은 미지원하며 노즐 중심 살균"],
          specs: { "방수등급": "IPX6 등급", "관리형태": "자가/방문 선택", "노즐재질": "풀 스테인리스 전체", "살균": "노즐 전해수 살균", "세정": "미세 기포 에어세정", "건조": "온풍건조 탑재" },
          moreSpecs: { "제조사": "SK매직", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1150W", "크기": "410x528x140mm" },
          scores: { "가격": 94, "위생성": 91, "편의성": 88, "서비스": 85, "크기": 90, "디자인": 86 },
          image: "/assets/photos/bidet.jpg",
          link: "/blog/bidet-rental-guide/"
        },
        {
          rank: 3,
          name: "쿠쿠 인앤아웃 전기분해 비데",
          price: "월 18,900원",
          score: "96.1",
          tags: ["실속 자가관리", "노즐분리 간편"],
          pros: ["필터 및 이물질 거름망을 전면 배치해 방문 코디 없이 필터 교체가 최고 난이도로 쉬움", "자가관리형 선택 시 비데 렌탈 최고 수준의 저렴한 요금제 매칭"],
          cons: ["변기 사이즈가 특대형 또는 소형일 경우 설치 가능 여부를 사전 검토해야 함"],
          specs: { "방수등급": "IPX5 등급", "관리형태": "자가관리 최적화", "노즐재질": "스테인리스 노즐", "살균": "전기분해 노즐살균", "조작부": "사이드 터치패널", "필터": "자가교체 필터" },
          moreSpecs: { "제조사": "쿠쿠홈시스", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1100W", "크기": "408x525x140mm" },
          scores: { "가격": 95, "위생성": 87, "편의성": 89, "서비스": 82, "크기": 90, "디자인": 85 },
          image: "/assets/photos/bathroom-bidet.jpg",
          link: "/blog/bidet-rental-guide/"
        },
        {
          rank: 4,
          name: "LG 퓨리케어 비데",
          price: "월 23,900원",
          score: "95.0",
          tags: ["안정적 대기업 AS", "스테인리스"],
          pros: ["LG의 전국적인 사후 관리 서비스망 및 방문 교환 스팀 청소 서비스", "IPX5 방수 등급 및 온수 조절 기능이 매우 일정한 가열 컨트롤러 장착"],
          cons: ["의무약정 기간에 따른 월 렌탈 단가가 다소 높게 설계됨"],
          specs: { "방수등급": "IPX5 등급", "관리형태": "방문관리 위주", "노즐재질": "스테인리스 노즐", "살균": "수동 노즐 세척", "온도": "온수 연속 가열", "세정": "어린이 모드 포함" },
          moreSpecs: { "제조사": "LG전자", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1250W", "크기": "415x535x150mm" },
          scores: { "가격": 80, "위생성": 89, "편의성": 92, "서비스": 96, "크기": 86, "디자인": 90 },
          image: "/assets/photos/appliance-kitchen.jpg",
          link: "/blog/bidet-rental-guide/"
        },
        {
          rank: 5,
          name: "콜러노비타 클린 비데",
          price: "월 17,900원",
          score: "94.0",
          tags: ["알뜰 요금", "이중 노즐팁"],
          pros: ["비데 전문 브랜드 노비타의 기본 성능이 탁월한 가성비 우수 비데", "여성 세정과 일반 세정 물길이 분리된 위생적인 이중 노즐 구조"],
          cons: ["필터 자가교체 시 싱크대 하단 급수 연결부 뒤쪽에 있어 좁은 공간은 교체 시 까다로움"],
          specs: { "방수등급": "IPX5 등급", "관리형태": "자가 전용형", "노즐재질": "스테인리스/이중 팁", "살균": "노즐 자동 세척", "변좌": "소프트 개폐 변좌", "절전": "스마트 절전 모드" },
          moreSpecs: { "제조사": "콜러노비타", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1000W", "크기": "400x520x138mm" },
          scores: { "가격": 97, "위생성": 84, "편의성": 85, "서비스": 82, "크기": 91, "디자인": 84 },
          image: "/assets/photos/bidet.jpg",
          link: "/blog/bidet-rental-guide/"
        },
        {
          rank: 6,
          name: "아이젠 의료용 관장 비데",
          price: "월 24,900원",
          score: "93.2",
          tags: ["의료용 특화", "쾌변 관장 기능"],
          pros: ["식약처 인증 관장 기능 탑재으로 시원한 쾌변 배변 활동을 직접적으로 지원", "풀 스테인리스 및 수압 펌프가 내장되어 유독 강한 세정 수압 제공"],
          cons: ["관장 전용 수압 모드 사용 시 신체에 다소 자극이 있을 수 있어 적응 필요"],
          specs: { "방수등급": "IPX5 등급", "관리형태": "방문 추천형", "특수기능": "관장/쾌변 모드", "수압": "가압 펌프 내장", "노즐": "스테인리스 특수노즐", "온도": "직수 연속 온수" },
          moreSpecs: { "제조사": "아이젠", "소유권이전": "60개월", "의무약정": "36개월 / 60개월", "소비전력": "1400W", "크기": "410x530x155mm" },
          scores: { "가격": 76, "위생성": 92, "편의성": 95, "서비스": 88, "크기": 86, "디자인": 80 },
          image: "/assets/photos/bathroom-bidet.jpg",
          link: "/blog/bidet-rental-guide/"
        }
      ],
      faqs: [
        { q: "비데는 꼭 렌탈을 해야 하나요? 일시불 구매가 더 저렴하지 않나요?", a: "기기 값 자체는 일시불로 사서 직접 설치하는 것이 훨씬 저렴합니다. 하지만 비데는 습도가 높은 곳에서 작동하여 곰팡이와 물때가 가장 생기기 쉬우며, 주기적인 필터 교체가 필수입니다. 방문 케어 서비스를 신청하시면 4개월마다 변기를 뜯어서 노즐 고온 스팀 청소 및 소독을 진행하므로 위생에 민감하다면 렌탈 케어가 훨씬 만족도가 큽니다." },
        { q: "욕실 물청소를 자주 하는데 고장나지 않을까요?", a: "물청소를 자주 하신다면 반드시 방수 등급을 확인하셔야 합니다. 본체는 IPX6 등급, 조작 리모컨부는 IPX7 등급 이상의 제품을 선택하면 샤워기 물살을 직접 비데 표면에 쏘아 물청소를 해도 고장 걱정 없이 안전하게 사용할 수 있습니다." },
        { q: "자가관리 시 노즐 청소는 어떻게 하나요?", a: "최신 비데 제품들은 수동 노즐 세척 버튼을 누르면 노즐이 스스로 밖으로 나와 고정됩니다. 이때 버리는 칫솔이나 노즐 세척 전용 솔에 전해수 또는 약한 세제를 묻혀 팁을 가볍게 문질러 닦아주시면 되며, 노즐 팁 자체가 분리형인 기종은 아예 빼서 물로 헹군 뒤 다시 끼우시면 편리합니다." }
      ]
    }
  };

  // State to hold current category & filters
  const state = {
    category: "water",
    searchQuery: ""
  };

  // Get UI elements
  const tabChips = document.querySelectorAll("#guide-tabs .tab-chip");
  const mainTitleEl = document.getElementById("guide-main-title");
  const subTitleEl = document.getElementById("guide-sub-title");
  const metaDateEl = document.getElementById("guide-meta-date");
  const metaTargetEl = document.getElementById("guide-meta-target");
  const metaCoreEl = document.getElementById("guide-meta-core");
  
  const goodDescEl = document.getElementById("criteria-good-desc");
  const warnDescEl = document.getElementById("criteria-warn-desc");
  const orderDescEl = document.getElementById("criteria-order-desc");
  
  const weightContainer = document.getElementById("weight-list-container");
  const scenarioContainer = document.getElementById("scenario-grid-container");
  const productsListContainer = document.getElementById("ranked-products-list");
  const faqContainer = document.getElementById("faq-container");
  const searchInput = document.getElementById("product-search");

  function renderCategory(catKey) {
    const data = buyingGuideData[catKey];
    if (!data) return;

    // Update titles and meta
    mainTitleEl.textContent = data.mainTitle;
    subTitleEl.textContent = data.subTitle;
    metaDateEl.textContent = data.metaDate;
    metaTargetEl.textContent = data.metaTarget;
    metaCoreEl.textContent = data.metaCore;

    // Update selection criteria
    goodDescEl.textContent = data.criteria.good;
    warnDescEl.textContent = data.criteria.warn;
    orderDescEl.textContent = data.criteria.order;

    // Render weights
    let weightHtml = "";
    data.weights.forEach((w) => {
      weightHtml += `
        <div class="weight-row">
          <div class="weight-info">
            <span class="weight-label">${w.label}</span>
            <span class="weight-pct">${w.pct}</span>
          </div>
          <div class="weight-bar-bg">
            <div class="weight-bar-fill" style="width: ${w.width};"></div>
          </div>
        </div>
      `;
    });
    weightContainer.innerHTML = weightHtml;

    // Render scenarios
    let scenarioHtml = "";
    data.scenarios.forEach((s) => {
      scenarioHtml += `
        <article class="scenario-card">
          <span class="scenario-tag">${s.tag}</span>
          <h3 class="scenario-title">${s.title}</h3>
          <p class="scenario-desc">${s.desc}</p>
        </article>
      `;
    });
    scenarioContainer.innerHTML = scenarioHtml;

    // Render FAQs
    let faqHtml = "";
    data.faqs.forEach((faq, index) => {
      const openAttr = index === 0 ? "open" : "";
      faqHtml += `
        <details ${openAttr}>
          <summary>Q. ${faq.q}</summary>
          <p style="margin-top: 10px; color: var(--muted); line-height: 1.6;">${faq.a}</p>
        </details>
      `;
    });
    faqContainer.innerHTML = faqHtml;

    // Filter and Render Products
    renderProducts();
  }

  function renderProducts() {
    const data = buyingGuideData[state.category];
    if (!data) return;

    let filteredProducts = data.products;
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      filteredProducts = data.products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filteredProducts.length === 0) {
      productsListContainer.innerHTML = `
        <div class="empty-cell">
          <p>검색 결과와 일치하는 가전제품이 없습니다. 다른 검색어를 시도해 보세요.</p>
        </div>
      `;
      return;
    }

    let productsHtml = "";
    filteredProducts.forEach((p) => {
      // Tags
      const tagsHtml = p.tags.map(t => `<span class="product-header-tag">${t}</span>`).join("");
      
      // Pros/Cons
      const prosHtml = p.pros.map(pro => `<div class="lens-pro">${pro}</div>`).join("");
      const consHtml = p.cons.map(con => `<div class="lens-con">${con}</div>`).join("");

      // Specs
      let specsHtml = "";
      Object.keys(p.specs).forEach((key) => {
        specsHtml += `
          <div class="spec-item">
            <span class="spec-name">${key}</span>
            <span class="spec-value">${p.specs[key]}</span>
          </div>
        `;
      });

      // More Specs
      let moreSpecsHtml = "";
      Object.keys(p.moreSpecs).forEach((key) => {
        moreSpecsHtml += `
          <div>
            <strong>${key}:</strong> ${p.moreSpecs[key]}
          </div>
        `;
      });

      // Score metrics
      let scoresHtml = "";
      Object.keys(p.scores).forEach((key) => {
        scoresHtml += `
          <div class="score-card">
            <span>${key}</span>
            <b>${p.scores[key]}</b>
          </div>
        `;
      });

      const cardRankClass = p.rank === 1 ? "rank-1" : "";

      productsHtml += `
        <article class="ranked-product-card" id="rank-card-${p.rank}">
          <div class="product-badge-rank ${cardRankClass}">AL PICK ${p.rank}</div>
          <div class="product-image-area">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-content-area">
            <header class="product-header">
              <div class="product-title-block">
                <h3>${p.name}</h3>
                <div class="product-price-info">${p.price} <span style="font-size:12px; font-weight: normal; color:var(--muted);">(약정 요금 기준)</span></div>
                <div class="product-header-tags">${tagsHtml}</div>
              </div>
              <div class="product-score-badge">
                <span>실사용 평점</span>
                <strong>${p.score}</strong>
              </div>
            </header>

            <!-- Pros/Cons Lens -->
            <div class="lens-container">
              <strong class="lens-title">🔎 알뜰픽 렌즈 (장단점 요약)</strong>
              ${prosHtml}
              ${consHtml}
            </div>

            <!-- Key Specs -->
            <div class="specs-summary">
              <span class="specs-title">주요 성능 스펙</span>
              <div class="specs-grid">${specsHtml}</div>
            </div>

            <!-- More Specs (Details) -->
            <details class="details-collapsible">
              <summary>추가 세부 스펙 펼치기</summary>
              <div class="details-content">${moreSpecsHtml}</div>
            </details>

            <!-- Score metrics -->
            <div class="scores-section">
              <span class="scores-title">항목별 평가 점수 (100점 만점)</span>
              <div class="scores-grid">${scoresHtml}</div>
            </div>

            <!-- CTA links -->
            <div class="deals-grid">
              <a href="${partnerUrl}" target="_blank" rel="nofollow sponsored noopener" class="deal-btn primary">
                💬 실시간 렌탈 최저 조건 상담받기
              </a>
              <a href="${p.link}" class="deal-btn secondary">
                🗒️ 상세 분석가이드
              </a>
              <div class="deal-btn muted" style="cursor: not-allowed;">
                🔔 가격 알림 (준비중)
              </div>
            </div>

          </div>
        </article>
      `;
    });

    productsListContainer.innerHTML = productsHtml;
    markPartnerLinks(); // rebind partner links rel
  }

  // Bind tab click events
  tabChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      tabChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.category = chip.getAttribute("data-category");
      renderCategory(state.category);
    });
  });

  // Bind search filtering
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Initial render
  renderCategory("water");
}
