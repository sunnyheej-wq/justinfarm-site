const DEFAULT_OWNER = "sunnyheej-wq";
const DEFAULT_REPO = "justinfarm-site";
const DEFAULT_BRANCH = "main";

export async function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestPost(context) {
  try {
    return await handlePublish(context);
  } catch (error) {
    return json({
      error: "자동 발행 서버 오류가 발생했습니다.",
      message: error?.message || String(error)
    }, 500);
  }
}

async function handlePublish(context) {
  const env = context.env || {};
  const githubToken = env.GITHUB_TOKEN;

  if (!githubToken) {
    return json({
      error: "Cloudflare 환경변수 GITHUB_TOKEN이 필요합니다."
    }, 500);
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: "요청 내용을 읽을 수 없습니다." }, 400);
  }

  const path = normalizePath(payload.path);
  const html = String(payload.html || "");
  if (!path || !html) {
    return json({ error: "저장할 경로와 HTML 내용이 필요합니다." }, 400);
  }

  const owner = env.GITHUB_OWNER || DEFAULT_OWNER;
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const branch = env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponentPath(path)}`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${githubToken}`,
    "Content-Type": "application/json",
    "User-Agent": "justinfarm-publisher",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  let sha = null;
  const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  if (current.ok) {
    const data = await current.json();
    sha = data.sha;
  } else if (current.status !== 404) {
    return json({ error: "GitHub의 기존 파일 정보를 확인하지 못했습니다." }, 502);
  }

  const commit = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: payload.message || `Publish ${path}`,
      content: toBase64(html),
      branch,
      sha
    })
  });

  const result = await commit.json().catch(() => ({}));
  if (!commit.ok) {
    return json({
      error: result.message || "GitHub에 저장하지 못했습니다.",
      details: result
    }, commit.status);
  }

  return json({
    ok: true,
    path,
    commit: result.commit?.sha,
    htmlUrl: result.content?.html_url
  });
}

function normalizePath(value) {
  let path = String(value || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path) return "";
  if (path.endsWith("/")) path += "index.html";
  if (!path.endsWith(".html")) path += "/index.html";
  if (path.includes("..") || path.startsWith("_") || path.startsWith(".")) return "";
  return path;
}

function encodeURIComponentPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function toBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
