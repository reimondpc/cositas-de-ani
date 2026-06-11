const SUPABASE_URL = 'https://eodkpelkplrgqxbmkqka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGtwZWxrcGxyZ3F4Ym1rcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDU1MjksImV4cCI6MjA5NDI4MTUyOX0.ZWNwMsCZO6P4VcVUjOB9Zt7-95qoWziYuf21fHo7mRU';

module.exports = async (req, res) => {
  const id = req.query.id;
  if (!id) { res.writeHead(302, { Location: '/' }); return res.end(); }

  let product = null;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Accept': 'application/json' }
    });
    const data = await r.json();
    product = data[0] || null;
  } catch (_) {}

  if (!product) { res.writeHead(302, { Location: '/' }); return res.end(); }

  const raw = product.images;
  const image = Array.isArray(raw) && raw.length > 0 ? raw[0] : (typeof raw === 'string' ? raw : (product.image || ''));
  const title = `${product.name} - Cositas de Ani`;
  const desc = (product.description || 'Mirá este producto en Cositas de Ani').slice(0, 200);
  const url = `https://cositasdeani.shop/producto?id=${id}`;
  const ogImageUrl = image ? `https://cositasdeani.shop/og-img/${encodeURIComponent(id)}` : '';

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
  res.end(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${product.name}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Cositas de Ani">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <link rel="canonical" href="${url}">
  <style>body{margin:0;background:#1a1a2e;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;text-align:center;padding:20px}div{max-width:500px}h1{font-size:2rem;margin:0 0 8px;color:#d4a853}p{margin:0;opacity:0.8}img{max-width:100%;border-radius:12px;margin-bottom:16px}</style>
</head>
<body>
  <div>
    ${image ? `<img src="${image}" alt="${product.name}">` : ''}
    <h1>${title}</h1>
    <p>${desc}</p>
  </div>
  <script>location.href='/producto.html?id=${encodeURIComponent(id)}'</script>
</body>
</html>`);
};
