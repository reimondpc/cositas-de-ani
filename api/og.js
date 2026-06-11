const SUPABASE_URL = 'https://eodkpelkplrgqxbmkqka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGtwZWxrcGxyZ3F4Ym1rcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDU1MjksImV4cCI6MjA5NDI4MTUyOX0.ZWNwMsCZO6P4VcVUjOB9Zt7-95qoWziYuf21fHo7mRU';

const BOT_RE = /bot|crawler|spider|facebookexternalhit|whatsapp|twitterbot|slack|telegram|discord|embedly|snapchat|pinterest/i;

function esBot(ua) {
  return BOT_RE.test(ua);
}

module.exports = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  let product = null;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    product = data[0] || null;
  } catch (e) {
    // fallback
  }

  if (!product) {
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  const title = `${product.name} - Cositas de Ani`;
  const description = (product.description || 'Mirá este producto en Cositas de Ani').slice(0, 200);
  const rawImages = product.images;
  const image = Array.isArray(rawImages) && rawImages.length > 0
    ? rawImages[0]
    : (typeof rawImages === 'string' ? rawImages : (product.image || ''));
  const url = `https://cositasdeani.shop/producto?id=${id}`;

  // If it's a crawler, return OG tags only (no meta refresh)
  if (esBot(req.headers['user-agent'] || '')) {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Cositas de Ani">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <link rel="canonical" href="${url}">
</head>
<body>
  <script>window.location.href='${url}'</script>
</body>
</html>`;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    });
    return res.end(html);
  }

  // For real users, redirect to the product page
  res.writeHead(302, { Location: `/producto.html?id=${id}` });
  res.end();
};
