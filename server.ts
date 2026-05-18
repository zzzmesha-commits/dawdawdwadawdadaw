import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // Improved Key Storage with metadata
  interface AccessKey {
    id: string;
    type: '7d' | '30d' | 'lifetime';
    expiryDate: number | null;
    hwid: string | null;
    createdAt: number;
  }

  let activeKeys: Record<string, AccessKey> = {
    'MM2-FREE-TEST': { 
      id: 'MM2-FREE-TEST', 
      type: '7d', 
      expiryDate: Date.now() + 7 * 24 * 60 * 60 * 1000, 
      hwid: null, 
      createdAt: Date.now() 
    },
    'MM2-ADMIN-BYPASS': { 
      id: 'MM2-ADMIN-BYPASS', 
      type: 'lifetime', 
      expiryDate: null, 
      hwid: null, 
      createdAt: Date.now() 
    }
  };

  const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password123'
  };

  // API - Auth - Verify Key
  app.post('/api/auth/verify-key', (req, res) => {
    const { key, hwid } = req.body;
    const keyData = activeKeys[key];

    if (!keyData) {
      return res.status(401).json({ success: false, error: 'Authorization sequence not found' });
    }

    // Check Expiration
    if (keyData.expiryDate && Date.now() > keyData.expiryDate) {
      return res.status(401).json({ success: false, error: 'Key has expired' });
    }

    // HWID Check/Bind
    if (!keyData.hwid) {
      // First time use: Bind HWID
      keyData.hwid = hwid;
      return res.json({ 
        success: true, 
        message: 'Device authorization bound',
        keyInfo: { type: keyData.type, expiryDate: keyData.expiryDate, key: keyData.id }
      });
    } else if (keyData.hwid !== hwid) {
      // Wrong HWID
      return res.status(401).json({ success: false, error: 'HWID mismatch: Key locked to another device' });
    }

    res.json({ 
      success: true,
      keyInfo: { type: keyData.type, expiryDate: keyData.expiryDate, key: keyData.id }
    });
  });

  // API - Auth - Admin Login
  app.post('/api/auth/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      res.json({ success: true, token: 'fake-admin-jwt' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });

  // API - Admin - Manage Keys
  app.get('/api/admin/keys', (req, res) => {
    res.json({ keys: Object.values(activeKeys) });
  });

  app.post('/api/admin/keys', (req, res) => {
    const { key, type } = req.body;
    if (key && key.length > 3) {
      const durationMap = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        'lifetime': null
      };

      const duration = durationMap[type as keyof typeof durationMap] ?? durationMap['7d'];
      
      activeKeys[key] = {
        id: key,
        type: type as any,
        expiryDate: duration ? Date.now() + duration : null,
        hwid: null,
        createdAt: Date.now()
      };
      res.json({ success: true, keys: Object.values(activeKeys) });
    } else {
      res.status(400).json({ error: 'Invalid key format' });
    }
  });

  app.post('/api/admin/keys/:key/reset-hwid', (req, res) => {
    const { key } = req.params;
    if (activeKeys[key]) {
      activeKeys[key].hwid = null;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  });

  app.delete('/api/admin/keys/:key', (req, res) => {
    const { key } = req.params;
    delete activeKeys[key];
    res.json({ success: true, keys: Object.values(activeKeys) });
  });

  // API Proxy for Roblox to avoid CORS
  app.get('/api/roblox/user/:username', async (req, res) => {
    const fetchWithTimeout = async (url: string, options: any = {}, timeout = 12000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ...options.headers,
          }
        });
        clearTimeout(id);
        return response;
      } catch (e) {
        clearTimeout(id);
        throw e;
      }
    };

    try {
      const { username } = req.params;
      const cleanUsername = username.trim();
      console.log(`[Roblox Lookup] Initializing search for: ${cleanUsername}`);
      
      let userId = null;
      let confirmedName = cleanUsername;

      // Pattern 1: Check if input is a direct User ID
      if (/^\d+$/.test(cleanUsername)) {
        userId = cleanUsername;
        console.log(`[Roblox Lookup] Detected ID format: ${userId}`);
      } else {
        // Pattern 2: Search via Official Search (v1/users/search)
        try {
          console.log(`[Roblox Lookup] Attempting keyword search fallback...`);
          // Use a shorter timeout and more specific check
          const searchRes = await fetchWithTimeout(`https://users.roproxy.com/v1/users/search?keyword=${encodeURIComponent(cleanUsername)}&limit=10`);
          if (searchRes.ok) {
            const searchData = await searchRes.json() as any;
            if (searchData.data && searchData.data.length > 0) {
              // Priority 1: Exact name match
              const exactMatch = searchData.data.find((u: any) => 
                u.name.toLowerCase() === cleanUsername.toLowerCase()
              );
              // Priority 2: Exact display name match
              const displayMatch = searchData.data.find((u: any) => 
                u.displayName.toLowerCase() === cleanUsername.toLowerCase()
              );
              
              const match = exactMatch || displayMatch || searchData.data[0];
              userId = match.id;
              confirmedName = match.name;
              console.log(`[Roblox Lookup] Match found via search: ${confirmedName} (${userId})`);
            }
          }
        } catch (searchError) {
          console.warn('[Roblox Lookup] Search endpoint failed.');
        }

        // Pattern 3: Try Users API direct by username (v1/usernames/users) - This is usually the most reliable
        if (!userId) {
          try {
            console.log(`[Roblox Lookup] Attempting direct username lookup...`);
            const exactResponse = await fetchWithTimeout(`https://users.roproxy.com/v1/usernames/users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ usernames: [cleanUsername], excludeBannedUsers: false })
            });
            if (exactResponse.ok) {
              const exactData = await exactResponse.json() as any;
              if (exactData.data && exactData.data.length > 0) {
                userId = exactData.data[0].id;
                confirmedName = exactData.data[0].name;
                console.log(`[Roblox Lookup] Exact match found: ${confirmedName} (${userId})`);
              }
            }
          } catch (e) {
            console.warn('[Roblox Lookup] Exact lookup failed.');
          }
        }

        // Pattern 4: User ID check (in case they pasted an ID but it wasn't caught by the digits-only check)
        if (!userId && /^\d+$/.test(cleanUsername)) {
            userId = cleanUsername;
        }
      }

      if (!userId) {
        // Final broad fallback search
        try {
           const globalRes = await fetchWithTimeout(`https://users.roproxy.com/v1/users/search?keyword=${encodeURIComponent(cleanUsername)}&limit=1`);
           const globalData = await globalRes.json() as any;
           if (globalData.data?.[0]) {
             userId = globalData.data[0].id;
             confirmedName = globalData.data[0].name;
           }
        } catch(err) {}
      }

      if (!userId) {
        return res.status(404).json({ error: 'Identity not found. Verify spelling or User ID.' });
      }

      // Step 2 & 3: Detailed Data Retrieval
      try {
        const [detailRes, thumbRes] = await Promise.allSettled([
          fetchWithTimeout(`https://users.roproxy.com/v1/users/${userId}`),
          fetchWithTimeout(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`)
        ]);

        const detailData = detailRes.status === 'fulfilled' && detailRes.value.ok ? await detailRes.value.json() : null;
        const thumbData = thumbRes.status === 'fulfilled' && thumbRes.value.ok ? await thumbRes.value.json() : null;
        
        const avatarUrl = thumbData?.data?.[0]?.imageUrl || 'https://tr.rbxcdn.com/38c6ed8c63602551cfecd7b864b61af3/150/150/AvatarHeadshot/Png';

        res.json({
          id: userId,
          username: detailData?.name || confirmedName,
          displayName: detailData?.displayName || confirmedName,
          avatarUrl: avatarUrl
        });
      } catch (e) {
        console.warn('[Roblox Lookup] Final details fetch failed, returning base data.');
        res.json({
          id: userId,
          username: confirmedName,
          displayName: confirmedName,
          avatarUrl: 'https://tr.rbxcdn.com/38c6ed8c63602551cfecd7b864b61af3/150/150/AvatarHeadshot/Png'
        });
      }
    } catch (error) {
      console.error('Roblox API Fatal Error:', error);
      res.status(503).json({ error: 'Roblox services are currently slow. Please try again.' });
    }
  });

  // Keep the search endpoint for future use if needed, but the user wants the original gifting system
  app.get('/api/roblox/search/:keyword', async (req, res) => {
    try {
      const { keyword } = req.params;
      
      // Step 1: Search for users
      const searchResponse = await fetch(`https://users.roproxy.com/v1/users/search?keyword=${keyword}&limit=5`);
      const searchData = await searchResponse.json() as any;

      if (!searchData.data || searchData.data.length === 0) {
        return res.json({ users: [] });
      }

      const users = searchData.data;
      const userIds = users.map((u: any) => u.id);

      // Step 2: Get thumbnails for all found users
      const thumbResponse = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=150x150&format=Png&isCircular=false`);
      const thumbData = await thumbResponse.json() as any;
      
      const results = users.map((u: any) => {
        const thumb = thumbData.data?.find((t: any) => t.targetId === u.id);
        return {
          id: u.id,
          username: u.name,
          displayName: u.displayName,
          avatarUrl: thumb?.imageUrl || ''
        };
      });

      res.json({ users: results });
    } catch (error) {
      console.error('Roblox Search Error:', error);
      res.status(500).json({ error: 'Failed to search Roblox profiles' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
