import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      new URL(targetUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch: ${response.statusText}`,
      });
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.send(Buffer.from(buffer));
    }

    let html = await response.text();
    const baseUrl = new URL(targetUrl);
    html = rewriteUrls(html, baseUrl.toString());

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy error',
    });
  }
}

function rewriteUrls(html: string, baseUrl: string): string {
  const base = new URL(baseUrl);

  html = html.replace(/href="\/\//g, `href="https://`);
  html = html.replace(/src="\/\//g, `src="https://`);

  html = html.replace(
    /href="(?!(?:https?:|mailto:|#|javascript:|data:))([^"]+)"/g,
    (match, url) => {
      try {
        const fullUrl = new URL(url, base).toString();
        return `href="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
      } catch {
        return match;
      }
    }
  );

  html = html.replace(/src="(?!(?:https?:|data:))([^"]+)"/g, (match, url) => {
    try {
      const fullUrl = new URL(url, base).toString();
      return `src="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
    } catch {
      return match;
    }
  });

  html = html.replace(/action="(?!(?:https?:))([^"]+)"/g, (match, url) => {
    try {
      const fullUrl = new URL(url, base).toString();
      return `action="/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
    } catch {
      return match;
    }
  });

  if (!html.includes('<base ')) {
    const headMatch = html.match(/<head[^>]*>/i);
    if (headMatch) {
      const baseTag = `<base href="${baseUrl}" target="_top">`;
      html = html.replace(headMatch[0], headMatch[0] + baseTag);
    }
  }

  return html;
}
