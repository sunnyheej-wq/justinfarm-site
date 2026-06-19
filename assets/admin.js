const ADMIN_PASSWORD = "psilove02@";
const STORAGE_KEY = "justinfarmPosts";
const SESSION_KEY = "justinfarmAdminAuthed";

const categories = [
  "상품군별 핵심 비교",
  "최신 렌탈 가이드",
  "TV 렌탈",
  "냉장고 렌탈",
  "김치냉장고",
  "공기청정기",
  "정수기",
  "비데",
  "세탁기·건조기",
  "식기세척기",
  "인덕션",
  "매트리스",
  "반려동물 가전",
  "이전 설치",
  "계약 가이드",
  "관리 가이드",
  "해지 비용",
  "제휴카드 활용법",
  "렌탈 금융 분석",
  "신규 라이프 렌탈"
];

const availableImages = [
  { path: "/assets/photos/water-purifier.jpg", label: "정수기 제품 사진" },
  { path: "/assets/photos/air-purifier.jpg", label: "공기청정기 제품 사진" },
  { path: "/assets/photos/bidet.jpg", label: "비데 제품 사진" },
  { path: "/assets/photos/bathroom-bidet.jpg", label: "욕실 비데 설치 사진" },
  { path: "/assets/photos/lg-tv.jpg", label: "LG TV 제품 사진" },
  { path: "/assets/photos/samsung-fridge.jpg", label: "삼성 냉장고 제품 사진" },
  { path: "/assets/photos/lg-refrigerator.jpg", label: "LG 냉장고 제품 사진" },
  { path: "/assets/photos/appliance-kitchen.jpg", label: "주방 생활가전 사진" },
  { path: "/assets/photos/install-repair.jpg", label: "설치 관리 사진" },
  { path: "/assets/photos/cost-calc.jpg", label: "계약 비용 계산 사진" }
];

const seedPosts = [
  post("compare-main", "가전렌탈 상품군별 비교", "compare", "상품군별 핵심 비교", "page", "/compare/", "/assets/photos/appliance-kitchen.jpg", "정수기, 공기청정기, 비데, 매트리스, TV, 냉장고 렌탈을 상품군별 핵심 기준으로 비교합니다."),
  post("water-purifier-rental-guide", "정수기 렌탈 고르는 법", "water-purifier-rental-guide", "상품군별 핵심 비교", "comparison", "/blog/water-purifier-rental-guide/", "/assets/photos/water-purifier.jpg", "정수기 렌탈 전 직수형, 얼음정수기, 자가관리, 방문관리, 필터 교체 주기, 설치 조건, 총 납입액을 비교하는 실전 가이드입니다."),
  post("air-purifier-rental-guide", "공기청정기 렌탈 전 평형대 확인법", "air-purifier-rental-guide", "상품군별 핵심 비교", "comparison", "/blog/air-purifier-rental-guide/", "/assets/photos/air-purifier.jpg", "공기청정기 렌탈 전 사용 면적, 필터 등급, 펫 기능, 방문 케어 주기, 필터 교체 비용을 비교하는 방법입니다."),
  post("bidet-rental-guide", "비데 렌탈은 위생 케어가 핵심", "bidet-rental-guide", "상품군별 핵심 비교", "comparison", "/blog/bidet-rental-guide/", "/assets/photos/bathroom-bidet.jpg", "비데 렌탈 전 노즐 세척, 방수 등급, 온수 방식, 설치 환경, 방문 케어 주기, 약정 조건을 확인하는 방법입니다."),
  post("rental-contract-checklist", "가전렌탈 계약 전 확인할 7가지", "rental-contract-checklist", "최신 렌탈 가이드", "latest", "/blog/rental-contract-checklist/", "/assets/photos/cost-calc.jpg", "가전렌탈 계약 전 월 렌탈료, 총 납입액, 약정, 중도해지, 소유권 이전, 케어 주기, 사은품 조건을 확인하는 체크리스트입니다."),
  post("rental-installation-guide", "가전렌탈 설치 전 준비 체크리스트", "rental-installation-guide", "최신 렌탈 가이드", "latest", "/blog/rental-installation-guide/", "/assets/photos/install-repair.jpg", "정수기, 비데, 공기청정기, 매트리스 등 가전렌탈 설치 전 전원, 급수, 배수, 공간, 기존 제품 철거 여부를 확인하는 방법입니다."),
  post("rental-cancellation-fee-guide", "렌탈 중도해지 비용 계산 가이드", "rental-cancellation-fee-guide", "최신 렌탈 가이드", "latest", "/blog/rental-cancellation-fee-guide/", "/assets/photos/cost-calc.jpg", "가전렌탈 중도해지 시 잔여 렌탈료, 할인 반환, 설치비, 사은품 반환 조건을 확인하는 방법입니다."),
  post("rental-vs-buy-guide", "렌탈이 유리한 경우와 구매가 유리한 경우", "rental-vs-buy-guide", "계약 가이드", "guide", "/blog/rental-vs-buy-guide/", "/assets/photos/cost-calc.jpg", "가전제품 렌탈과 구매를 총 납입액, 초기 비용, 관리 서비스, AS, 소유권, 중도해지 조건 기준으로 비교합니다."),
  post("rental-maintenance-cycle", "방문관리와 자가관리 주기 비교", "rental-maintenance-cycle", "관리 가이드", "guide", "/blog/rental-maintenance-cycle/", "/assets/photos/install-repair.jpg", "정수기, 공기청정기, 비데 등 가전렌탈에서 방문관리와 자가관리의 차이, 필터 교체 주기, 관리 편의성을 비교합니다."),
  post("samsung-lg-tv-rental-guide", "삼성 LG TV 렌탈 고르는 법", "samsung-lg-tv-rental-guide", "TV 렌탈", "guide", "/blog/samsung-lg-tv-rental-guide/", "/assets/photos/lg-tv.jpg", "삼성 LG TV 렌탈을 화면 크기, 패널, 설치 공간, 약정, AS, 총 납입액 기준으로 비교하는 가이드입니다."),
  post("samsung-lg-refrigerator-rental-guide", "삼성 LG 냉장고 렌탈 선택 기준", "samsung-lg-refrigerator-rental-guide", "냉장고 렌탈", "guide", "/blog/samsung-lg-refrigerator-rental-guide/", "/assets/photos/samsung-fridge.jpg", "삼성 LG 냉장고 렌탈을 용량, 설치 공간, 에너지 소비, AS, 소유권 이전 기준으로 비교합니다."),
  post("kimchi-refrigerator-rental-guide", "김치냉장고 렌탈 뚜껑형 스탠드형 비교", "kimchi-refrigerator-rental-guide", "김치냉장고", "guide", "/blog/kimchi-refrigerator-rental-guide/", "/assets/photos/lg-refrigerator.jpg", "김치냉장고 렌탈을 뚜껑형, 스탠드형, 저장 용량, 계절 사용량, 설치 공간 기준으로 비교합니다."),
  post("lg-samsung-air-purifier-rental-guide", "삼성 LG 공기청정기 렌탈 상황별 선택법", "lg-samsung-air-purifier-rental-guide", "공기청정기", "guide", "/blog/lg-samsung-air-purifier-rental-guide/", "/assets/photos/air-purifier.jpg", "삼성 LG 공기청정기 렌탈을 평형, 필터, 펫 기능, 방별 사용 기준으로 비교하는 가이드입니다."),
  post("washer-dryer-rental-guide", "세탁기 건조기 렌탈 전 확인할 기준", "washer-dryer-rental-guide", "세탁기·건조기", "guide", "/blog/washer-dryer-rental-guide/", "/assets/photos/install-repair.jpg", "세탁기 건조기 렌탈을 설치 공간, 배수, 용량, 전기식 건조 방식, 이전 설치 기준으로 정리했습니다."),
  post("dishwasher-rental-guide", "식기세척기 렌탈 설치 전 판단 기준", "dishwasher-rental-guide", "식기세척기", "guide", "/blog/dishwasher-rental-guide/", "/assets/photos/appliance-kitchen.jpg", "식기세척기 렌탈을 6인용, 12인용, 빌트인, 프리스탠딩, 급수 배수 조건 기준으로 정리했습니다."),
  post("induction-range-rental-guide", "인덕션 전기레인지 렌탈 전 체크리스트", "induction-range-rental-guide", "인덕션", "guide", "/blog/induction-range-rental-guide/", "/assets/photos/appliance-kitchen.jpg", "인덕션 렌탈을 전기 증설, 화구 수, 상판 크기, 냄비 호환, 설치 방식 기준으로 비교합니다."),
  post("mattress-rental-guide", "매트리스 렌탈 케어 서비스 선택 기준", "mattress-rental-guide", "매트리스", "guide", "/blog/mattress-rental-guide/", "/assets/photos/cost-calc.jpg", "매트리스 렌탈을 경도, 사이즈, 케어 주기, 위생 관리, 구매 대비 총비용 기준으로 비교합니다."),
  post("pet-household-appliance-rental-guide", "반려동물 가정 생활가전 렌탈 기준", "pet-household-appliance-rental-guide", "반려동물 가전", "guide", "/blog/pet-household-appliance-rental-guide/", "/assets/photos/air-purifier.jpg", "반려동물 가정에서 공기청정기, 건조기, 청소기 렌탈을 털, 냄새, 필터, 관리 주기 기준으로 비교합니다."),
  post("moving-home-rental-transfer-guide", "이사 예정 가전렌탈 이전 설치 가이드", "moving-home-rental-transfer-guide", "이전 설치", "guide", "/blog/moving-home-rental-transfer-guide/", "/assets/photos/install-repair.jpg", "이사를 앞둔 사용자가 렌탈 가전 이전 설치, 해지, 재약정, 설치비를 비교하는 방법입니다."),
  post("card-discount-guide", "렌탈 제휴카드 할인 극대화 가이드", "card-discount-guide", "제휴카드 활용법", "latest", "/blog/card-discount-guide/", "/assets/photos/appliance-kitchen.jpg", "카드사 전월 실적 제외 항목, 실적 채우기 팁, 피킹 스윗스팟을 수학적으로 분석한 실전 가이드."),
  post("rental-vs-lease-finance", "가전 렌탈 vs 할부 vs 리스 금융 비교", "rental-vs-lease-finance", "렌탈 금융 분석", "latest", "/blog/rental-vs-lease-finance/", "/assets/photos/cost-calc.jpg", "렌탈, 카드 할부 구매, 리스의 실질 이자율 차이와 신용도 영향 및 장단점을 비교 분석합니다."),
  post("plant-art-rental-guide", "반려식물 및 그림 구독 렌탈 시장 가이드", "plant-art-rental-guide", "신규 라이프 렌탈", "latest", "/blog/plant-art-rental-guide/", "/assets/photos/plant-art.png", "플랜테리어와 미술품 그림 렌탈 서비스의 가격 조건, 관리 주기 및 법인 혜택을 다룬 아티클입니다.")
];

let posts = loadPosts();
let activeStatus = "published";
let editingId = null;
let lastEditorRange = null;
let draggedImageFigure = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function post(id, title, slug, category, type, sourcePath, image, description) {
  return {
    id,
    title,
    slug,
    category,
    type,
    status: "published",
    sourcePath,
    image,
    description,
    summary: "기존 발행 글을 관리자에서 수정할 수 있도록 불러온 항목입니다. 수정 버튼을 누르면 실제 페이지의 본문을 읽어 편집모드에 채웁니다.",
    body: "",
    faqs: [],
    updatedAt: "2026-05-22",
    scheduledAt: ""
  };
}

function loadPosts() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  const savedList = Array.isArray(saved) ? saved : [];
  const byId = new Map(seedPosts.map((item) => [item.id, item]));
  savedList.forEach((item) => byId.set(item.id, normalizePost({ ...byId.get(item.id), ...item })));
  return [...byId.values()].map(normalizePost);
}

function normalizePost(item) {
  return {
    ...item,
    type: item.type || "guide",
    status: item.status || "published",
    scheduledAt: item.scheduledAt || "",
    updatedAt: item.updatedAt || new Date().toISOString().slice(0, 10),
    faqs: Array.isArray(item.faqs) ? item.faqs : []
  };
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts, null, 2));
}

function upsertPost(post) {
  const index = posts.findIndex((item) => item.id === editingId || item.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.unshift(post);
}

function getBodyEditor() {
  return $("[data-body-editor]");
}

function createImageDeleteButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "remove-image-button";
  button.textContent = "삭제";
  return button;
}

function createImageHandle() {
  const handle = document.createElement("span");
  handle.className = "image-drag-handle";
  handle.textContent = "이동";
  return handle;
}

function prepareEditableFigure(figure) {
  figure.classList.add("editable-image");
  figure.draggable = true;
  figure.setAttribute("contenteditable", "false");
  if (!figure.querySelector(".image-drag-handle")) figure.appendChild(createImageHandle());
  if (!figure.querySelector(".remove-image-button")) figure.appendChild(createImageDeleteButton());
  return figure;
}

function decorateBodyImages(container) {
  if (!container) return;
  const images = [...container.querySelectorAll("img")];
  images.forEach((img) => {
    const existing = img.closest("figure.editable-image");
    if (existing) {
      prepareEditableFigure(existing);
      return;
    }
    const figure = document.createElement("figure");
    const clone = img.cloneNode(true);
    figure.appendChild(clone);
    prepareEditableFigure(figure);
    img.replaceWith(figure);
  });
}

function serializeBodyHtml() {
  const editor = getBodyEditor();
  if (!editor) return "";
  const clone = editor.cloneNode(true);
  clone.querySelectorAll(".remove-image-button").forEach((button) => button.remove());
  clone.querySelectorAll("figure.editable-image").forEach((figure) => {
    const img = figure.querySelector("img");
    if (img) {
      figure.replaceWith(img);
    } else {
      figure.remove();
    }
  });
  return clone.innerHTML.trim();
}

function extractFirstImage(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.querySelector("img")?.getAttribute("src") || "";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function setFeaturedImage(src = "", manual = false) {
  const form = $("[data-editor-form]");
  const input = $("[data-featured-image-value]");
  const preview = $("[data-featured-image-preview]");
  if (form) form.dataset.featuredImageManual = manual ? "true" : "false";
  if (input) input.value = src;
  if (!preview) return;
  preview.innerHTML = src
    ? `<img src="${escapeAttr(src)}" alt="대표 이미지 미리보기">`
    : `<span>대표 이미지가 지정되지 않았습니다.</span>`;
}

function insertImageHtml(src, alt = "") {
  const editor = getBodyEditor();
  if (!editor) return;
  editor.focus();
  const selection = window.getSelection();
  if (!selection) return;
  let range = selection.rangeCount ? selection.getRangeAt(0) : null;
  if (!range || !editor.contains(range.commonAncestorContainer)) {
    range = lastEditorRange?.cloneRange() || document.createRange();
    if (!lastEditorRange || !editor.contains(range.commonAncestorContainer)) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
  }
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  figure.appendChild(img);
  prepareEditableFigure(figure);
  range.deleteContents();
  range.insertNode(figure);
  const paragraph = document.createElement("p");
  paragraph.innerHTML = "<br>";
  figure.after(paragraph);
  selection.collapse(paragraph, 0);
  lastEditorRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
}

function rememberEditorRange() {
  const editor = getBodyEditor();
  const selection = window.getSelection();
  if (!editor || !selection || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (editor.contains(range.commonAncestorContainer)) lastEditorRange = range.cloneRange();
}

function moveDraggedImage(event) {
  const editor = getBodyEditor();
  if (!editor || !draggedImageFigure) return;
  event.preventDefault();
  const targetFigure = event.target.closest?.("figure.editable-image");
  if (targetFigure && targetFigure !== draggedImageFigure) {
    const rect = targetFigure.getBoundingClientRect();
    const insertAfter = event.clientY > rect.top + rect.height / 2;
    targetFigure[insertAfter ? "after" : "before"](draggedImageFigure);
  } else {
    editor.appendChild(draggedImageFigure);
  }
  draggedImageFigure.classList.remove("dragging");
  draggedImageFigure = null;
  syncEditorBody();
}

function syncEditorBody() {
  const body = serializeBodyHtml();
  const hidden = $("[name='body']");
  if (hidden) hidden.value = body;
  return body;
}

function handleEditorPaste(event) {
  const editor = getBodyEditor();
  if (!editor) return;
  const items = [...event.clipboardData.items];
  const imageItems = items.filter((item) => item.type.startsWith("image/"));
  if (!imageItems.length) return;
  event.preventDefault();
  imageItems.forEach((item) => {
    const file = item.getAsFile();
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      insertImageHtml(loadEvent.target.result, file.name || "이미지");
      if (!$("[data-featured-image-value]").value) setFeaturedImage(loadEvent.target.result, false);
      syncEditorBody();
    };
    reader.readAsDataURL(file);
  });
}

function formatBodyHtml(body) {
  if (!body) return "";
  const trimmed = body.trim();
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) return trimmed;
  return markdownToHtml(body);
}

function getFeaturedImage(post) {
  return post.image || extractFirstImage(post.body) || "/assets/photos/appliance-kitchen.jpg";
}

function requireAuth() {
  const authed = sessionStorage.getItem(SESSION_KEY) === "true";
  $("[data-login]").hidden = authed;
  $("[data-admin-app]").hidden = !authed;
  $("[data-login]").style.display = authed ? "none" : "grid";
  $("[data-admin-app]").style.display = authed ? "block" : "none";
  document.body.classList.toggle("admin-authed", authed);
  if (authed) {
    history.replaceState(null, "", `${location.pathname}#posts`);
    window.scrollTo(0, 0);
    render();
  }
}

function initAuth() {
  $("[data-login-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      $("[data-login-error]").hidden = true;
      requireAuth();
      return;
    }
    $("[data-login-error]").hidden = false;
  });
  $("[data-logout]").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    requireAuth();
  });
}

function populateSelects() {
  const categoryOptions = ["전체", ...categories].map((item) => `<option value="${item}">${item}</option>`).join("");
  $("[data-category-filter]").innerHTML = categoryOptions;
  $("[data-bulk-category]").innerHTML = `<option value="">카테고리 선택</option>${categories.map((item) => `<option>${item}</option>`).join("")}`;
  $("[data-editor-category]").innerHTML = categories.map((item) => `<option>${item}</option>`).join("");
}

function filteredPosts() {
  const keyword = ($("[data-search]").value || "").trim().toLowerCase();
  const category = $("[data-category-filter]").value;
  return posts.filter((post) => {
    const statusMatch = post.status === activeStatus;
    const categoryMatch = !category || category === "전체" || post.category === category;
    const keywordMatch = !keyword || `${post.title} ${post.body} ${post.description} ${post.category}`.toLowerCase().includes(keyword);
    return statusMatch && categoryMatch && keywordMatch;
  });
}

function renderCounts() {
  ["published", "scheduled", "draft"].forEach((status) => {
    $(`[data-count="${status}"]`).textContent = posts.filter((post) => post.status === status).length;
  });
  $("[data-total-count]").textContent = posts.length;
}

function renderRows() {
  const pageSize = Number($("[data-page-size]").value || 30);
  const list = filteredPosts().slice(0, pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredPosts().length / pageSize));
  $("[data-page-label]").textContent = `1/${totalPages} 페이지`;
  $("[data-post-rows]").innerHTML = list.map((post) => `
    <tr>
      <td><input type="checkbox" data-row-check value="${post.id}"></td>
      <td><strong>${escapeHtml(post.title)}</strong><br><span class="small">${post.sourcePath || `/blog/${post.slug}/`}</span></td>
      <td><span class="status-pill ${post.status}">${statusLabel(post.status)}</span></td>
      <td>${escapeHtml(post.category)}</td>
      <td>${typeLabel(post.type)}</td>
      <td>${post.scheduledAt || "-"}</td>
      <td>${post.updatedAt}</td>
      <td class="row-actions">
        <button class="secondary" type="button" data-edit="${post.id}">수정</button>
        <button class="secondary" type="button" data-duplicate="${post.id}">복제</button>
        <button class="secondary" type="button" data-download="${post.id}">HTML</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8" class="empty-cell">조건에 맞는 글이 없습니다.</td></tr>`;
}

function statusLabel(status) {
  return { published: "발행됨", scheduled: "예약됨", draft: "임시저장" }[status] || status;
}

function typeLabel(type) {
  return { guide: "가이드", comparison: "비교", latest: "최신", page: "페이지" }[type] || type;
}

function render() {
  renderCounts();
  renderRows();
  $$("[data-status]").forEach((button) => button.classList.toggle("active", button.dataset.status === activeStatus));
}

function selectedIds() {
  return $$("[data-row-check]:checked").map((input) => input.value);
}

async function openEditor(post = null) {
  editingId = post?.id || null;
  const hydrated = post?.sourcePath && !post.body ? await hydratePost(post) : post;
  const form = $("[data-editor-form]");
  form.reset();
  const data = hydrated || {
    id: "",
    title: "",
    slug: "",
    category: categories[0],
    type: "guide",
    status: "draft",
    image: "/assets/photos/appliance-kitchen.jpg",
    description: "",
    summary: "",
    body: "",
    scheduledAt: "",
    sourcePath: "",
    faqs: [["", ""], ["", ""], ["", ""]]
  };
  const fields = form.elements;
  form.dataset.featuredImageManual = "false";
  $("[data-editor-title]").textContent = post ? "글 수정" : "새 글 작성";
  $("[data-editor-source]").textContent = data.sourcePath ? `원본 경로: ${data.sourcePath}` : "새 글은 HTML 내보내기 후 배포 파일에 추가할 수 있습니다.";
  fields.id.value = data.id;
  fields.title.value = data.title;
  fields.slug.value = data.slug;
  fields.category.value = data.category;
  fields.type.value = data.type || "guide";
  fields.status.value = data.status;
  fields.scheduledAt.value = data.scheduledAt || "";
  setFeaturedImage(data.image || "", false);
  fields.description.value = data.description || "";
  fields.summary.value = data.summary || "";
  fields.sourcePath.value = data.sourcePath || "";
  fields.faq1q.value = data.faqs?.[0]?.[0] || "";
  fields.faq1a.value = data.faqs?.[0]?.[1] || "";
  fields.faq2q.value = data.faqs?.[1]?.[0] || "";
  fields.faq2a.value = data.faqs?.[1]?.[1] || "";
  fields.faq3q.value = data.faqs?.[2]?.[0] || "";
  fields.faq3a.value = data.faqs?.[2]?.[1] || "";
  const bodyEditor = getBodyEditor();
  const bodyHtml = data.body || "";
  bodyEditor.innerHTML = bodyHtml;
  decorateBodyImages(bodyEditor);
  syncEditorBody();
  lastEditorRange = null;
  setPublishNote("");
  showEditor(true);
}

async function hydratePost(post) {
  try {
    const response = await fetch(post.sourcePath, { cache: "no-store" });
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const main = doc.querySelector("main");
    const title = doc.querySelector("h1")?.textContent.trim() || post.title;
    const description = doc.querySelector('meta[name="description"]')?.content || post.description;
    const image = doc.querySelector("main img")?.getAttribute("src") || post.image;
    const summary = doc.querySelector(".evidence-box p")?.textContent.trim() || post.summary;
    const faqs = [...doc.querySelectorAll(".faq details")].slice(0, 3).map((item) => [
      item.querySelector("summary")?.textContent.trim() || "",
      item.querySelector("p")?.textContent.trim() || ""
    ]).filter(([q, a]) => q && a);
    const body = main ? extractBodyHtml(main) : post.body;
    const hydrated = normalizePost({ ...post, title, description, image, summary, body, faqs, bodyLoaded: true });
    posts = posts.map((item) => item.id === post.id ? hydrated : item);
    savePosts();
    return hydrated;
  } catch (error) {
    console.warn("원본 글을 불러오지 못했습니다.", error);
    return post;
  }
}

function extractBodyHtml(main) {
  const skipSelectors = ".breadcrumb,.meta,.article-image,.evidence-box,.faq,.cta-banner,script";
  const clone = main.cloneNode(true);
  [...clone.querySelectorAll(skipSelectors)].forEach((node) => node.remove());
  return clone.innerHTML.trim();
}

function mainToMarkdown(main) {
  const skipSelectors = ".breadcrumb,.meta,.article-image,.evidence-box,.faq,.cta-banner,script";
  const nodes = [...main.querySelectorAll("h2,h3,p,ul,ol,table,figure")].filter((node) => !node.closest(skipSelectors));
  return nodes.map((node) => {
    if (node.matches("h2")) return `## ${clean(node.textContent)}`;
    if (node.matches("h3")) return `### ${clean(node.textContent)}`;
    if (node.matches("ul,ol")) return [...node.querySelectorAll("li")].map((li) => `- ${clean(li.textContent)}`).join("\n");
    if (node.matches("table")) return tableToMarkdown(node);
    if (node.matches("figure")) {
      const img = node.querySelector("img");
      if (!img) return "";
      return `![${img.getAttribute("alt") || "렌탈 관련 이미지"}](${img.getAttribute("src")})`;
    }
    return clean(node.textContent);
  }).filter(Boolean).join("\n\n");
}

function tableToMarkdown(table) {
  const rows = [...table.querySelectorAll("tr")].map((tr) => [...tr.children].map((cell) => clean(cell.textContent)));
  if (!rows.length) return "";
  const header = rows[0];
  const divider = header.map(() => "---");
  return [header, divider, ...rows.slice(1)].map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function readEditor(statusOverride = null) {
  const form = $("[data-editor-form]");
  const data = new FormData(form);
  const title = data.get("title").trim();
  const slug = slugify(data.get("slug").trim() || title);
  const bodyHtml = syncEditorBody();
  const imageValue = data.get("image").trim();
  const firstBodyImage = extractFirstImage(bodyHtml);
  const imageWasSetManually = form.dataset.featuredImageManual === "true";
  return normalizePost({
    id: data.get("id") || slug,
    title,
    slug,
    category: data.get("category"),
    type: data.get("type"),
    status: statusOverride || data.get("status"),
    scheduledAt: data.get("scheduledAt"),
    sourcePath: data.get("sourcePath"),
    image: imageWasSetManually ? (imageValue || firstBodyImage) : (firstBodyImage || imageValue),
    description: data.get("description").trim(),
    summary: data.get("summary").trim(),
    body: bodyHtml,
    faqs: [
      [data.get("faq1q").trim(), data.get("faq1a").trim()],
      [data.get("faq2q").trim(), data.get("faq2a").trim()],
      [data.get("faq3q").trim(), data.get("faq3a").trim()]
    ].filter(([q, a]) => q && a),
    updatedAt: new Date().toISOString().slice(0, 10)
  });
}

function saveEditor(statusOverride = null, options = {}) {
  const { persist = true } = options;
  const post = readEditor(statusOverride);
  upsertPost(post);
  if (persist) {
    try {
      savePosts();
    } catch (error) {
      setPublishNote("이미지가 커서 브라우저 임시 저장은 건너뛰었습니다. 저장 후 발행을 누르면 공개 사이트에는 반영됩니다.");
      console.warn("브라우저 임시 저장 실패", error);
      return post;
    }
  }
  render();
  setPublishNote("브라우저에 저장되었습니다. 공개 사이트에 반영하려면 저장 후 발행을 눌러 주세요.");
  return post;
}

function postOutputPath(post) {
  const sourcePath = (post.sourcePath || "").trim();
  if (sourcePath) {
    const clean = sourcePath.replace(/^\/+|\/+$/g, "");
    if (!clean) return "index.html";
    return clean.endsWith(".html") ? clean : `${clean}/index.html`;
  }
  if (post.slug === "compare") return "compare/index.html";
  return `blog/${post.slug}/index.html`;
}

async function publishPost(post) {
  const response = await fetch("/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: postOutputPath(post),
      html: postToHtml(post),
      message: `Publish ${post.title}`
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "자동 발행에 실패했습니다.");
  }
  return result;
}

function showEditor(open) {
  $$("[data-list-panel]").forEach((panel) => panel.hidden = open);
  $("[data-editor-panel]").hidden = !open;
  window.scrollTo(0, 0);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}

function markdownToHtml(text) {
  return text.split(/\n{2,}/).map((block) => {
    if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
    if (block.startsWith("### ")) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
    if (block.startsWith("![")) {
      const match = block.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (!match) return `<p>${escapeHtml(block)}</p>`;
      return `<figure class="article-image"><img src="${escapeAttr(match[2])}" alt="${escapeAttr(match[1])}" width="1200" height="675" loading="lazy" decoding="async"><figcaption>${escapeHtml(match[1])}</figcaption></figure>`;
    }
    if (block.startsWith("| ")) return markdownTableToHtml(block);
    if (block.startsWith("- ")) return `<ul>${block.split("\n").map((line) => `<li>${escapeHtml(line.replace(/^- /, ""))}</li>`).join("")}</ul>`;
    return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
  }).join("\n");
}

function markdownTableToHtml(block) {
  const rows = block.split("\n").filter((line) => !/^\|\s*-/.test(line)).map((line) => line.split("|").slice(1, -1).map((cell) => escapeHtml(cell.trim())));
  if (!rows.length) return "";
  return `<div class="compare-table"><table><thead><tr>${rows[0].map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function htmlHasImageSrc(html, src) {
  if (!html || !src) return false;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.querySelectorAll("img")].some((img) => img.getAttribute("src") === src);
}

function postToHtml(post) {
  const faqHtml = post.faqs.map(([q, a], index) => `<details ${index === 0 ? "open" : ""}><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("");
  const canonicalSlug = post.slug === "compare" ? "compare" : `blog/${post.slug}`;
  const featuredImage = getFeaturedImage(post);
  const featuredAlreadyInBody = htmlHasImageSrc(post.body, featuredImage);
  const featuredFigure = featuredAlreadyInBody ? "" : `<figure class="article-image"><img src="${escapeAttr(featuredImage)}" alt="${escapeAttr(post.title)} 대표 이미지" width="1200" height="675" loading="eager" decoding="async"><figcaption>${escapeHtml(post.title)} 판단 기준을 정리한 대표 이미지 <span class="image-credit">사진: 공개 라이선스/스톡 이미지, 편집: 렌탈클리어</span></figcaption></figure>`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(post.title)} | 렌탈클리어</title>
    <meta name="description" content="${escapeAttr(post.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="https://justinfarm.com/${canonicalSlug}/">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <nav class="nav">
        <a class="brand" href="/"><span class="brand-mark">R</span>렌탈클리어</a>
        <div class="nav-links">
          <a href="/compare/">렌탈 비교</a>
          <a href="/blog/">가이드</a>
          <a href="/about/">소개</a>
          <a href="/contact/">문의</a>
          <a class="nav-cta" href="https://partners.ajl.to/lead/rental?partnerId=Y4Z4HOWT" target="_blank" rel="nofollow sponsored noopener">조건 확인</a>
        </div>
      </nav>
    </header>
    <main class="article">
      <p class="breadcrumb"><a href="/">홈</a> / <a href="/blog/">가이드</a></p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="meta">${escapeHtml(post.category)} · ${post.updatedAt}</p>
      ${featuredFigure}
      <div class="evidence-box"><h2>먼저 결론</h2><p>${escapeHtml(post.summary)}</p></div>
      ${post.body}
      <section class="faq"><h2>자주 묻는 질문</h2>${faqHtml}</section>
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <div>렌탈클리어 · 생활가전 렌탈 정보 블로그<br><span class="small">일부 링크는 제휴 링크이며, 상담 및 계약은 제휴사를 통해 진행됩니다. 렌탈 조건은 상품과 시점에 따라 달라질 수 있습니다.</span></div>
        <div class="footer-links">
          <a href="/about/">소개</a>
          <a href="/contact/">문의</a>
          <a href="/privacy/">개인정보처리방침</a>
          <a href="/terms/">이용약관</a>
          <a href="/editorial-policy/">편집 정책</a>
        </div>
      </div>
    </footer>
    <script src="/assets/app.js"></script>
  </body>
</html>`;
}

function insertBodyImage() {
  const body = $("[name='body']");
  const image = $("[data-inline-image]").value;
  const alt = $("[data-inline-alt]").value.trim() || availableImages.find((item) => item.path === image)?.label || "렌탈 관련 이미지";
  const snippet = `\n\n![${alt}](${image})\n\n`;
  const start = body.selectionStart;
  const end = body.selectionEnd;
  body.value = `${body.value.slice(0, start)}${snippet}${body.value.slice(end)}`;
  body.focus();
  body.selectionStart = body.selectionEnd = start + snippet.length;
}

function removeBodyImage() {
  const body = $("[name='body']");
  const start = body.selectionStart;
  const end = body.selectionEnd;
  if (start !== end && /!\[.*?\]\(.*?\)/s.test(body.value.slice(start, end))) {
    body.value = body.value.slice(0, start) + body.value.slice(end);
    return;
  }
  const before = body.value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const afterIndex = body.value.indexOf("\n", start);
  const after = afterIndex === -1 ? body.value.length : afterIndex;
  const line = body.value.slice(before, after);
  if (/!\[.*?\]\(.*?\)/.test(line)) body.value = body.value.slice(0, before) + body.value.slice(after + 1);
}

function download(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  $$("[data-status]").forEach((button) => button.addEventListener("click", () => {
    activeStatus = button.dataset.status;
    showEditor(false);
    $$("[data-list-panel]").forEach((panel) => panel.hidden = false);
    render();
  }));
  ["[data-apply]", "[data-refresh]"].forEach((selector) => $(selector).addEventListener("click", render));
  $("[data-reset]").addEventListener("click", () => {
    $("[data-search]").value = "";
    $("[data-category-filter]").value = "전체";
    $("[data-page-size]").value = "30";
    render();
  });
  $("[data-new-post]").addEventListener("click", () => openEditor());
  $("[data-close-editor]").addEventListener("click", () => showEditor(false));
  const bodyEditor = getBodyEditor();
  if (bodyEditor) {
    bodyEditor.addEventListener("input", syncEditorBody);
    bodyEditor.addEventListener("paste", handleEditorPaste);
    bodyEditor.addEventListener("keyup", rememberEditorRange);
    bodyEditor.addEventListener("mouseup", rememberEditorRange);
    bodyEditor.addEventListener("focus", rememberEditorRange);
    bodyEditor.addEventListener("dragstart", (event) => {
      const figure = event.target.closest?.("figure.editable-image");
      if (!figure) return;
      draggedImageFigure = figure;
      figure.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "image");
    });
    bodyEditor.addEventListener("dragover", (event) => {
      if (!draggedImageFigure) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    bodyEditor.addEventListener("drop", moveDraggedImage);
    bodyEditor.addEventListener("dragend", () => {
      draggedImageFigure?.classList.remove("dragging");
      draggedImageFigure = null;
    });
    bodyEditor.addEventListener("click", (event) => {
      if (!event.target.matches(".remove-image-button")) return;
      event.target.closest("figure.editable-image")?.remove();
      syncEditorBody();
    });
  }
  $("[data-set-featured-image]").addEventListener("click", (event) => {
    event.preventDefault();
    $("[data-featured-image-file]").click();
  });
  $("[data-featured-image-file]").addEventListener("change", async (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) setFeaturedImage(await readFileAsDataUrl(file), true);
    event.currentTarget.value = "";
  });
  $("[data-use-first-body-image]").addEventListener("click", (event) => {
    event.preventDefault();
    const image = extractFirstImage(syncEditorBody());
    if (!image) {
      alert("본문에 이미지가 없습니다.");
      return;
    }
    setFeaturedImage(image, true);
  });
  $("[data-clear-featured-image]").addEventListener("click", (event) => {
    event.preventDefault();
    setFeaturedImage("", false);
  });
  $("[data-insert-image]").addEventListener("click", (event) => {
    event.preventDefault();
    $("[data-image-file-input]").click();
  });
  $("[data-image-file-input]").addEventListener("change", (event) => {
    const files = [...event.currentTarget.files];
    files.forEach((file) => {
      readFileAsDataUrl(file).then((src) => {
        insertImageHtml(src, file.name || "이미지");
        if (!$("[data-featured-image-value]").value) setFeaturedImage(src, false);
        syncEditorBody();
      });
    });
    event.currentTarget.value = "";
  });
  $("[data-editor-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      saveEditor();
    } catch (error) {
      setPublishNote(error.message || "저장하지 못했습니다.");
      alert(error.message || "저장하지 못했습니다.");
      return;
    }
    alert("저장되었습니다. 공개 사이트 반영은 저장 후 발행을 눌러야 합니다.");
  });
  $("[data-save-publish]").addEventListener("click", async (event) => {
    event.preventDefault();
    const post = saveEditor("published", { persist: false });
    setPublishNote("GitHub에 자동 발행 중입니다. 잠시만 기다려 주세요.");
    try {
      const result = await publishPost(post);
      setPublishNote(`자동 발행 완료: ${result.path}. Cloudflare 배포가 곧 반영됩니다.`);
      alert("자동 발행이 완료되었습니다. 잠시 후 홈페이지에 반영됩니다.");
    } catch (error) {
      setPublishNote(`${error.message} HTML 다운로드로 수동 반영할 수도 있습니다.`);
      alert(error.message);
    }
  });
  $("[data-preview-post]").addEventListener("click", () => {
    const html = postToHtml(readEditor());
    const preview = window.open("", "_blank");
    preview.document.write(html);
    preview.document.close();
  });
  $("[data-download-post]").addEventListener("click", () => {
    const post = readEditor();
    download(`${post.slug}.html`, postToHtml(post), "text/html");
  });
  $("[data-export-json]").addEventListener("click", () => download("justinfarm-posts.json", JSON.stringify(posts, null, 2), "application/json"));
  $("[data-export-html]").addEventListener("click", () => {
    const targets = posts.filter((post) => selectedIds().includes(post.id));
    const target = targets[0] || filteredPosts()[0] || posts[0];
    if (target) download(`${target.slug}.html`, postToHtml(target), "text/html");
  });
  $("[data-publish-selected]").addEventListener("click", () => {
    const ids = selectedIds();
    posts = posts.map((post) => ids.includes(post.id) ? { ...post, status: "published", updatedAt: new Date().toISOString().slice(0, 10) } : post);
    savePosts();
    render();
  });
  $("[data-delete-selected]").addEventListener("click", () => {
    const ids = selectedIds();
    posts = posts.filter((post) => !ids.includes(post.id));
    savePosts();
    render();
  });
  $("[data-bulk-change]").addEventListener("click", () => {
    const category = $("[data-bulk-category]").value;
    if (!category) return;
    const ids = selectedIds();
    posts = posts.map((post) => ids.includes(post.id) ? { ...post, category } : post);
    savePosts();
    render();
  });
  $("[data-schedule]").addEventListener("click", () => {
    const start = new Date($("[data-schedule-start]").value || Date.now());
    const gap = Number($("[data-schedule-gap]").value || 30);
    const count = Number($("[data-schedule-count]").value || 1);
    let changed = 0;
    posts = posts.map((post) => {
      if (post.status !== "draft" || changed >= count) return post;
      const scheduled = new Date(start.getTime() + changed * gap * 60000);
      changed += 1;
      return { ...post, status: "scheduled", scheduledAt: scheduled.toISOString().slice(0, 16) };
    });
    savePosts();
    activeStatus = "scheduled";
    render();
  });
  $("[data-check-all]").addEventListener("change", (event) => {
    $$("[data-row-check]").forEach((checkbox) => checkbox.checked = event.target.checked);
  });
  document.addEventListener("click", async (event) => {
    const editId = event.target.dataset.edit;
    const duplicateId = event.target.dataset.duplicate;
    const downloadId = event.target.dataset.download;
    if (editId) await openEditor(posts.find((post) => post.id === editId));
    if (duplicateId) {
      const source = posts.find((post) => post.id === duplicateId);
      await openEditor({ ...source, id: "", title: `${source.title} 복사본`, slug: `${source.slug}-copy`, status: "draft", sourcePath: "" });
    }
    if (downloadId) {
      const post = posts.find((item) => item.id === downloadId);
      download(`${post.slug}.html`, postToHtml(post), "text/html");
    }
  });
}

function setPublishNote(message) {
  const note = $("[data-publish-note]");
  if (note) note.textContent = message;
}

function clean(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttr(value = "") {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

populateSelects();
initAuth();
bindEvents();
requireAuth();
