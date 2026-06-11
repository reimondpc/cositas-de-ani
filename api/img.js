const sharp = require('sharp');
const SUPABASE_URL = 'https://eodkpelkplrgqxbmkqka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGtwZWxrcGxyZ3F4Ym1rcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDU1MjksImV4cCI6MjA5NDI4MTUyOX0.ZWNwMsCZO6P4VcVUjOB9Zt7-95qoWziYuf21fHo7mRU';

module.exports = async (req, res) => {
  const id = req.query.id;
  if (!id) { res.writeHead(404); return res.end(); }

  let product = null;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Accept': 'application/json' }
    });
    const data = await r.json();
    product = data[0] || null;
  } catch (_) {}

  if (!product) { res.writeHead(404); return res.end(); }

  const raw = product.images;
  const imageUrl = Array.isArray(raw) && raw.length > 0 ? raw[0] : (typeof raw === 'string' ? raw : (product.image || ''));

  if (!imageUrl) { res.writeHead(404); return res.end(); }

  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) { res.writeHead(502); return res.end(); }

    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const resized = await sharp(buffer)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': resized.length,
      'Cache-Control': 'public, max-age=86400, immutable',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(resized);
  } catch (_) {
    res.writeHead(502);
    res.end();
  }
};
