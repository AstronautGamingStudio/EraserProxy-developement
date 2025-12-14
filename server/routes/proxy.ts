import { RequestHandler } from "express";

interface ProxyResponse {
  html?: string;
  status: number;
  error?: string;
}

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      res.status(400).json({ error: "URL parameter is required", status: 400 });
      return;
    }

    let targetUrl = url;
    // Ensure URL has protocol
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      res.status(400).json({ error: "Invalid URL format", status: 400 });
      return;
    }

    // Fetch the target website
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch: ${response.statusText}`,
        status: response.status,
      });
      return;
    }

    const contentType = response.headers.get("content-type") || "";

    // If not HTML, just proxy the content as-is
    if (!contentType.includes("text/html")) {
      const buffer = await response.arrayBuffer();
      res.set("Content-Type", contentType);
      res.send(Buffer.from(buffer));
      return;
    }

    let html = await response.text();

    // Rewrite URLs to go through proxy
    const baseUrl = new URL(targetUrl);
    html = rewriteUrls(html, baseUrl.toString());

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    console.error("Proxy error:", error);
    const statusCode =
      error instanceof Error && "code" in error && error.code === "ENOTFOUND"
        ? 404
        : 500;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(statusCode).json({
      error: `Proxy error: ${errorMessage}`,
      status: statusCode,
    });
  }
};

function rewriteUrls(html: string, baseUrl: string): string {
  const base = new URL(baseUrl);
  const baseOrigin = base.origin;

  // Rewrite protocol-relative URLs to https
  html = html.replace(/href="\/\//g, `href="https://`);
  html = html.replace(/src="\/\//g, `src="https://`);

  // Rewrite relative URLs in href attributes
  html = html.replace(
    /href="(?!(?:https?:|mailto:|#|javascript:|data:))([^"]+)"/g,
    (match, url) => {
      try {
        const fullUrl = new URL(url, base).toString();
        return `href="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
      } catch {
        return match;
      }
    },
  );

  // Rewrite relative URLs in src attributes
  html = html.replace(/src="(?!(?:https?:|data:))([^"]+)"/g, (match, url) => {
    try {
      const fullUrl = new URL(url, base).toString();
      return `src="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
    } catch {
      return match;
    }
  });

  // Rewrite form actions
  html = html.replace(/action="(?!(?:https?:))([^"]+)"/g, (match, url) => {
    try {
      const fullUrl = new URL(url, base).toString();
      return `action="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
    } catch {
      return match;
    }
  });

  // Rewrite URL in CSS background-image
  html = html.replace(
    /background-image:\s*url\(["']?(?!(?:https?:|data:))([^"')\s]+)["']?\)/g,
    (match, url) => {
      try {
        const cleanUrl = url.replace(/["']/g, "");
        const fullUrl = new URL(cleanUrl, base).toString();
        return `background-image: url(/api/proxy?url=${encodeURIComponent(fullUrl)})`;
      } catch {
        return match;
      }
    },
  );

  // Add base tag to ensure relative URLs work
  if (!html.includes("<base ")) {
    const headMatch = html.match(/<head[^>]*>/i);
    if (headMatch) {
      const baseTag = `<base href="${baseUrl}" target="_top">`;
      html = html.replace(headMatch[0], headMatch[0] + baseTag);
    }
  }

  return html;
}

export const handleAsset: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      res.status(400).send("Missing URL parameter");
      return;
    }

    let targetUrl = url;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    if (!response.ok) {
      res.status(response.status).send(`Error: ${response.statusText}`);
      return;
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.set("Content-Type", contentType);
    }

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Asset proxy error:", error);
    res.status(500).send("Failed to fetch asset");
  }
};
