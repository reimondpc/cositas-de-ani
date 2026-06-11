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

  const productPage = `/producto.html?id=${id}`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' });
  res.end(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Cositas de Ani">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${image}">
  <link rel="canonical" href="${url}">
  <script>location.href='${productPage}'</script>
</head>
<body></body>
</html>`);
};
