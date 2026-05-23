import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Tag, 
  Loader2, 
  ArrowLeft, 
  LogOut, 
  RefreshCw, 
  User, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Settings, 
  CreditCard 
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { ITEMS, Item } from './data';

export default function App() {
  // Device HWID
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('mm2_device_id');
    if (!id) {
      id = 'HWID-' + Math.random().toString(36).substring(2, 12).toUpperCase();
      localStorage.setItem('mm2_device_id', id);
    }
    return id;
  });

  // App States: 'key_gate' | 'admin_login' | 'admin_dashboard' | 'main_app'
  const [appState, setAppState] = useState<'key_gate' | 'admin_login' | 'admin_dashboard' | 'main_app'>(() => {
    const isVerified = localStorage.getItem('mm2_key_verified') === 'true';
    return isVerified ? 'main_app' : 'key_gate';
  });

  // Key Gate States
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);
  const [verifiedKeyInfo, setVerifiedKeyInfo] = useState<any>(() => {
    const info = localStorage.getItem('mm2_key_info');
    return info ? JSON.parse(info) : null;
  });

  // Admin Login States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Admin Dashboard States
  const [adminKeys, setAdminKeys] = useState<any[]>([]);
  const [newKeyString, setNewKeyString] = useState('');
  const [newKeyType, setNewKeyType] = useState<'7d' | '30d' | 'lifetime'>('7d');

  // Main App State
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');

  // Floating Draggable QR Code State
  const [activeQRData, setActiveQRData] = useState<{ url: string; avatar: string | null } | null>(null);
  const [qrInputURL, setQrInputURL] = useState('');
  const [qrErrorMessage, setQrErrorMessage] = useState('');
  const [qrGeneratingLoader, setQrGeneratingLoader] = useState(false);
  const [dismissKey, setDismissKey] = useState(() => {
    return localStorage.getItem('mm2_dismiss_key') || 'Escape';
  });
  const [isRecordingKey, setIsRecordingKey] = useState(false);

  // Settings Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Gifting/Checkout Modal States
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'buy' | 'gift'>('buy');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalStep, setModalStep] = useState<'identity' | 'payment' | 'paypal_details' | 'card_details' | 'processing' | 'success'>('identity');

  // Checkout Username States
  const [robloxVerifyUsername, setRobloxVerifyUsername] = useState('');
  const [verifiedRobloxProfile, setVerifiedRobloxProfile] = useState<any>(null);
  const [robloxAvatarErr, setRobloxAvatarErr] = useState(false);
  const [robloxVerifyLoading, setRobloxVerifyLoading] = useState(false);
  const [robloxVerifyError, setRobloxVerifyError] = useState('');
  const [mockRobuxBalance, setMockRobuxBalance] = useState(0);

  // Payment Form States
  const [paypalEmail, setPaypalEmail] = useState('joh***@gmail.com');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8824');
  const [cardExpiry, setCardExpiry] = useState('12 / 28');
  const [cardCVV, setCardCVV] = useState('•••');
  const [cardholderName, setCardholderName] = useState('Jo** Sm***');
  const [cardCountry, setCardCountry] = useState('United States');

  // Floating Drag Position
  const [qrPos, setQrPos] = useState({ x: window.innerWidth - 240, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Watch dismiss hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQRData && e.key === dismissKey) {
        setActiveQRData(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQRData, dismissKey]);

  // Handle Drag Events for QR Bubble Window
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - qrPos.x,
      y: e.clientY - qrPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setQrPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Dynamic Item List filtering
  const filteredItems = useMemo(() => {
    return ITEMS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = category === 'All' || item.category === category;
      const priceVal = item.price;
      const matchMin = priceMin === '' || isNaN(priceMin) || priceVal >= priceMin;
      const matchMax = priceMax === '' || isNaN(priceMax) || priceVal <= priceMax;
      return matchSearch && matchCategory && matchMin && matchMax;
    });
  }, [searchQuery, category, priceMin, priceMax]);

  // Navigate category safely
  const setCategoryFromNav = (catLabel: string) => {
    const map: Record<string, string> = {
      'All': 'All',
      'All Skins': 'All',
      'Market': 'All',
      'Knives': 'Knife',
      'Knife': 'Knife',
      'Guns': 'Gun',
      'Gun': 'Gun',
      'Sets': 'Set',
      'Bundles': 'Set',
      'Set': 'Set',
      'Pets': 'Pet',
      'Pet': 'Pet'
    };
    setCategory(map[catLabel] || 'All');
  };

  const isCategoryActive = (catName: string) => {
    if (catName === 'All Skins') return category === 'All';
    if (catName === 'Knives') return category === 'Knife';
    if (catName === 'Guns') return category === 'Gun';
    if (catName === 'Sets') return category === 'Set';
    if (catName === 'Pets') return category === 'Pet';
    return false;
  };

  // Auth Operations
  const verifyKey = async () => {
    if (!keyInput.trim()) {
      setKeyError('Please input a security license key.');
      return;
    }
    setKeyLoading(true);
    setKeyError('');

    try {
      const res = await fetch('/api/auth/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput.trim(), hwid: deviceId })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setVerifiedKeyInfo(data.keyInfo);
        localStorage.setItem('mm2_key_verified', 'true');
        localStorage.setItem('mm2_key_info', JSON.stringify(data.keyInfo));
        setAppState('main_app');
      } else {
        setKeyError(data.error || 'Identity Authorization Rejected.');
      }
    } catch(e) {
      setKeyError('Server transmission mismatch. Verify terminal link.');
    } finally {
      setKeyLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('mm2_key_verified');
    localStorage.removeItem('mm2_key_info');
    setVerifiedKeyInfo(null);
    setAppState('key_gate');
    setActiveQRData(null);
  };

  // Admin Access Operations
  const loginAdmin = async () => {
    if (!adminUser || !adminPass) {
      setAdminError('Provide username and crypt password.');
      return;
    }
    setAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUser, password: adminPass })
      });
      const data = await res.json();
      if (res.ok) {
        setAppState('admin_dashboard');
        fetchAdminKeys();
      } else {
        setAdminError(data.error || 'Invalid credentials.');
      }
    } catch(e) {
      setAdminError('Console authorization handshake failure.');
    } finally {
      setAdminLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminUser('');
    setAdminPass('');
    setAppState('key_gate');
  };

  const fetchAdminKeys = async () => {
    try {
      const res = await fetch('/api/admin/keys');
      const data = await res.json();
      setAdminKeys(data.keys || []);
    } catch(e) {
      console.error('Keys query failed.', e);
    }
  };

  const generateRandomKeyString = () => {
    const hex = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNewKeyString(`MM2-KEY-${hex}`);
  };

  const createLicenseKey = async () => {
    if (!newKeyString.trim()) {
      alert('License key target cannot be empty.');
      return;
    }
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKeyString.toUpperCase().trim(), type: newKeyType })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminKeys(data.keys);
        setNewKeyString('');
      } else {
        alert(data.error || 'Failed to deploy license key.');
      }
    } catch(e) {
      alert('License system update failed.');
    }
  };

  const resetHWID = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/keys/${key}/reset-hwid`, { method: 'POST' });
      if (res.ok) {
        await fetchAdminKeys();
        alert('Hardware identifier reset successfully.');
      }
    } catch(e) {
      console.error('HWID reset transaction failed.', e);
    }
  };

  const deleteKey = async (key: string) => {
    if (!confirm(`Confirm revocation of credential string: ${key}?`)) return;
    try {
      const res = await fetch(`/api/admin/keys/${key}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setAdminKeys(data.keys);
      }
    } catch(e) {
      console.error('Delete key transaction failed.', e);
    }
  };

  // Roblox Identity Validation Inside Checkout Process
  const triggerActionModal = (item: Item, mode: 'buy' | 'gift') => {
    setSelectedItem(item);
    setModalType(mode);
    setIsDetailsModalOpen(true);
    setModalStep('identity');
    setRobloxVerifyUsername('');
    setVerifiedRobloxProfile(null);
    setRobloxVerifyError('');
    setMockRobuxBalance(0);
  };

  const verifyRobloxUser = async () => {
    if (!robloxVerifyUsername.trim()) {
      setRobloxVerifyError('Specify a Roblox identifier.');
      return;
    }
    setRobloxVerifyLoading(true);
    setRobloxVerifyError('');
    setVerifiedRobloxProfile(null);
    setRobloxAvatarErr(false);

    try {
      const res = await fetch(`/api/roblox/user/${encodeURIComponent(robloxVerifyUsername.trim())}`);
      const data = await res.json();
      if (res.ok && data.id) {
        setVerifiedRobloxProfile(data);
        setMockRobuxBalance(Math.floor(Math.random() * 4860) + 120);
        
        // Always maintain the single default censored cardholder name ("Jo** Sm***") and email ("joh***@gmail.com")
        setCardholderName('Jo** Sm***');
        setPaypalEmail('joh***@gmail.com');
      } else {
        setRobloxVerifyError(data.error || 'Roblox identify search rejected.');
      }
    } catch(e) {
      setRobloxVerifyError('Handshake timeout. Roblox gateway experiencing high ping.');
    } finally {
      setRobloxVerifyLoading(false);
    }
  };

  const submitPayPalLink = () => {
    setModalStep('processing');
    setTimeout(() => {
      setModalStep('success');
    }, 3000);
  };

  const submitCreditCard = () => {
    setModalStep('processing');
    setTimeout(() => {
      setModalStep('success');
    }, 3500);
  };

  // Floating Window Actions (Draggable QR Builder)
  const generateQRWindow = async () => {
    if (!qrInputURL.trim()) {
      setQrErrorMessage('Please specify a profile sync URL.');
      return;
    }
    setQrGeneratingLoader(true);
    setQrErrorMessage('');

    let extractId = null;
    const link = qrInputURL.trim();
    const robloxUserMatch = link.match(/\/users\/(\d+)\/profile/i);
    
    if (robloxUserMatch) {
      extractId = robloxUserMatch[1];
    } else if (/^\d+$/.test(link)) {
      extractId = link;
    } else {
      extractId = link;
    }

    try {
      const res = await fetch(`/api/roblox/user/${encodeURIComponent(extractId)}`);
      const data = await res.json();
      setQrGeneratingLoader(false);
      
      let finalUrl = qrInputURL.trim();
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }

      if (res.ok && data.avatarUrl) {
        setActiveQRData({ url: finalUrl, avatar: data.avatarUrl });
        setIsSettingsModalOpen(false);
      } else {
        setActiveQRData({ url: finalUrl, avatar: null });
        setIsSettingsModalOpen(false);
      }
    } catch(e) {
      setQrGeneratingLoader(false);
      let finalUrl = qrInputURL.trim();
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      setActiveQRData({ url: finalUrl, avatar: null });
      setIsSettingsModalOpen(false);
    }
  };

  const startKeyRecording = () => {
    setIsRecordingKey(true);
  };

  const recordDismissKey = (e: React.KeyboardEvent) => {
    e.preventDefault();
    setDismissKey(e.key);
    localStorage.setItem('mm2_dismiss_key', e.key);
    setIsRecordingKey(false);
  };

  const rarities = [
    { label: 'Ancient Rarity', categoryMatch: 'Knife', color: 'bg-[#ff00ea]/80' },
    { label: 'Godly Weapons', categoryMatch: 'Knife', color: 'bg-red-500' },
    { label: 'Chroma Skins', categoryMatch: 'Knife', color: 'bg-amber-400' },
    { label: 'Legendary', categoryMatch: 'Gun', color: 'bg-blue-400' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between select-none">
      
      {/* ============================================== */}
      {/* 1. KEY GATE SCREEN                              */}
      {/* ============================================== */}
      {appState === 'key_gate' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#1f1212_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
          
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto rotate-3 shadow-lg shadow-primary/20">
                <Tag className="text-white w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">MM2<span className="text-primary">.SHOP</span></h2>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Device Authorization Gate</p>
            </div>

            {keyError && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center text-primary text-xs font-bold uppercase tracking-wide">
                {keyError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-light">Enter Verification Key</label>
                <input 
                  type="text" 
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyKey()}
                  placeholder="MM2-XXXX-XXXX" 
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-center font-mono font-black placeholder:text-white/20 select-text outline-none focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="flex gap-2 text-[10px] justify-between text-text-muted">
                <span className="font-semibold uppercase">Free Test: <code className="font-extrabold text-white bg-white/5 px-1.5 py-0.5 rounded">MM2-FREE-TEST</code></span>
                <span className="font-semibold uppercase">Bypass: <code className="font-extrabold text-white bg-white/5 px-1.5 py-0.5 rounded">MM2-ADMIN-BYPASS</code></span>
              </div>

              <button 
                onClick={verifyKey}
                disabled={keyLoading}
                className="w-full py-4.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {keyLoading && <Loader2 className="animate-spin w-4 h-4" />}
                <span>{keyLoading ? 'Authorizing...' : 'Authorize Device'}</span>
              </button>
            </div>

            <div className="pt-6 border-t border-surface-border text-center">
              <button 
                onClick={() => setAppState('admin_login')}
                className="text-[10px] font-black uppercase text-text-light hover:text-white tracking-[0.2em] transition-colors cursor-pointer"
              >
                Access Admin Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* 2. ADMIN LOGIN SCREEN                           */}
      {/* ============================================== */}
      {appState === 'admin_login' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#1f1212_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 space-y-8">
            <button 
              onClick={() => setAppState('key_gate')}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-text-muted hover:text-white tracking-widest cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Admin Authenticator</h2>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Command Authorization</p>
            </div>

            {adminError && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center text-primary text-xs font-bold uppercase tracking-wide">
                {adminError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-light">Credentials Username</label>
                <input 
                  type="text" 
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Username" 
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-bold select-text outline-none focus:border-primary transition-all text-smSB"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-light">Command Password</label>
                <input 
                  type="password" 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loginAdmin()}
                  placeholder="••••••••" 
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-bold select-text outline-none focus:border-primary transition-all text-sm"
                />
              </div>

              <button 
                onClick={loginAdmin}
                disabled={adminLoading}
                className="w-full py-4.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {adminLoading && <Loader2 className="animate-spin w-4 h-4" />}
                <span>{adminLoading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* 3. ADMIN DASHBOARD SCREEN                        */}
      {/* ============================================== */}
      {appState === 'admin_dashboard' && (
        <div className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto space-y-10 relative">
          <div className="flex items-center justify-between pb-6 border-b border-surface-border">
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">MM2 Admin Command</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Access Console</p>
            </div>
            <button 
              onClick={logoutAdmin}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-extrabold uppercase rounded-xl border border-white/10 text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Key Generator */}
            <div className="bg-surface-card border border-surface-border rounded-[2.5rem] p-6 space-y-6 height-fit">
              <div className="space-y-1">
                <h3 className="font-black text-lg uppercase italic text-white tracking-tight leading-none">Generate License Key</h3>
                <p className="text-[9px] font-bold text-text-light uppercase tracking-wider">Deploy a verified access sequence</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-light tracking-widest block">Custom Key String</label>
                  <input 
                    type="text" 
                    value={newKeyString}
                    onChange={(e) => setNewKeyString(e.target.value)}
                    placeholder="E.g. MM2-CUSTOM-KEY" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-black select-text outline-none focus:border-primary text-sm uppercase font-mono"
                  />
                  <div className="text-right">
                    <button 
                      onClick={generateRandomKeyString}
                      className="text-[9px] font-black uppercase text-primary hover:underline tracking-widest cursor-pointer"
                    >
                      Autofill Random
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-light tracking-widest block">Access Expiry Type</label>
                  <select 
                    value={newKeyType}
                    onChange={(e: any) => setNewKeyType(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary text-sm"
                  >
                    <option value="7d">7 Days Verification</option>
                    <option value="30d">30 Days Verification</option>
                    <option value="lifetime">Lifetime License</option>
                  </select>
                </div>

                <button 
                  onClick={createLicenseKey}
                  className="w-full py-4.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-[0.2em] transition-all text-xs cursor-pointer"
                >
                  Publish Access Key
                </button>
              </div>
            </div>

            {/* Right List Panel: All Active Keys */}
            <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-[2.5rem] p-6 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div className="space-y-1">
                  <h3 className="font-black text-lg uppercase italic text-white tracking-tight leading-none">Active Licenses</h3>
                  <p className="text-[9px] font-bold text-text-light uppercase tracking-wider">Live credentials database</p>
                </div>
                <button 
                  onClick={fetchAdminKeys}
                  className="p-2 text-text-light hover:text-white bg-white/5 border border-white/5 rounded-xl text-xs cursor-pointer"
                  title="Force Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border text-[9px] font-black uppercase text-text-light tracking-widest">
                      <th className="pb-3 pl-2">Key Sequence</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Expiration Date</th>
                      <th className="pb-3">Hardware Lock (HWID)</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {adminKeys.map((k) => (
                      <tr key={k.id} className="text-xs hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pl-2 font-mono font-black text-white">{k.id}</td>
                        <td className="py-4">
                          <span 
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              k.type === 'lifetime' ? 'bg-green-500/10 text-green-400 border border-green-500/10' :
                              k.type === '30d' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                              'bg-primary/10 text-primary border border-primary/10'
                            }`}
                          >
                            {k.type}
                          </span>
                        </td>
                        <td className="py-4 text-text-muted">
                          {k.expiryDate ? new Date(k.expiryDate).toLocaleDateString() : 'Lifetime'}
                        </td>
                        <td className="py-4 font-mono text-[10px]">
                          <span 
                            className={`font-black ${
                              k.hwid ? 'text-green-500 bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10' : 'text-text-light bg-white/5 px-2 py-0.5 rounded'
                            }`}
                          >
                            {k.hwid ? k.hwid.slice(0, 10) + '...' : 'No Lock'}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2 space-x-1">
                          <button 
                            onClick={() => resetHWID(k.id)}
                            className="px-2.5 py-1 text-[9px] font-black uppercase bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg transition-all cursor-pointer"
                          >
                            Reset HWID
                          </button>
                          <button 
                            onClick={() => deleteKey(k.id)}
                            className="px-2.5 py-1 text-[9px] font-black uppercase bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                    {adminKeys.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-text-light text-xs font-bold uppercase tracking-widest">
                          No active verification keys found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* 4. MAIN APP / STORE FRONT                       */}
      {/* ============================================== */}
      {appState === 'main_app' && (
        <div className="flex-1 flex flex-col">
          
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 bg-surface-card border-b border-surface-border px-4 md:px-8 h-12 md:h-16 flex items-center justify-between shadow-2xl shadow-black/20">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCategory('All')}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-red-900/40">
                  <Tag className="text-white w-4.5 h-4.5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">MM2<span className="text-primary">.SHOP</span></span>
              </div>
              
              <nav className="hidden lg:flex gap-6 h-16 items-center translate-y-[1px]">
                {['Market', 'Knives', 'Guns', 'Sets', 'About'].map((link) => (
                  <a 
                    key={link}
                    onClick={(e) => { e.preventDefault(); setCategoryFromNav(link); }}
                    href="#" 
                    className={`text-sm font-bold transition-colors relative h-full flex items-center px-1 tracking-wide ${
                      (link === 'Market' && category === 'All') || 
                      (link === 'Knives' && category === 'Knife') ||
                      (link === 'Guns' && category === 'Gun') ||
                      (link === 'Sets' && category === 'Set')
                        ? 'text-primary' : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:block px-3 py-1.5 text-xs font-bold text-text-light cursor-default border border-white/5 rounded-lg bg-black/20">USD (US$)</span>
              
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2.5 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/10 cursor-pointer"
                title="Security Forge Settings"
              >
                <Settings className="w-[18px] h-[18px]" />
              </button>

              <div className="flex items-center gap-4 bg-surface-border px-3 py-1.5 rounded-xl border border-white/5">
                <User className="w-[14px] h-[14px] text-text-light" />
                <span className="text-xs font-bold">{verifiedKeyInfo ? verifiedKeyInfo.key : 'Guest'}</span>
                <span className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse"></span>
              </div>

              <button 
                onClick={logoutUser}
                className="p-2.5 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                title="Disconnect Device"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          </header>

          {/* Main Layout */}
          <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 flex gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 hidden xl:block shrink-0 space-y-6">
              <div className="sticky top-24 bg-surface-card border border-surface-border rounded-[2rem] p-6 shadow-xl shadow-black/20 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#71717a]">Inventory Category</h3>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-black text-primary">{filteredItems.length}</span>
                </div>

                {/* Custom Search View */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Skin Name..." 
                    className="w-full bg-black border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold outline-none focus:border-primary text-white select-text" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-light">Skin Filter</label>
                  <div className="space-y-2">
                    {['All Skins', 'Knives', 'Guns', 'Sets', 'Pets'].map((cat) => (
                      <label 
                        key={cat}
                        onClick={() => setCategoryFromNav(cat)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div 
                          className={`w-4.5 h-4.5 rounded border-2 transition-all flex items-center justify-center ${
                            isCategoryActive(cat) ? 'border-primary' : 'border-surface-border group-hover:border-primary'
                          }`}
                        >
                          {isCategoryActive(cat) && <div className="w-2 h-2 bg-primary rounded-sm transition-all" />}
                        </div>
                        <span 
                          className={`text-xs font-bold transition-colors uppercase tracking-wide ${
                            isCategoryActive(cat) ? 'text-white' : 'text-text-muted group-hover:text-white'
                          }`}
                        >
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarity Colors Panel */}
                <div className="space-y-3 pt-4 border-t border-surface-border">
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-light font-sans block">Weapon Rarity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {rarities.map((r, i) => (
                      <div 
                        key={i}
                        title={r.label} 
                        onClick={() => setCategory(r.categoryMatch)}
                        className={`aspect-square rounded-lg cursor-pointer border-2 border-transparent hover:border-white transition-all shadow-inner ${r.color}`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Price Range Panel */}
                <div className="space-y-3 pt-4 border-t border-surface-border">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#71717a] block">Price Filtering</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-light">$</span>
                      <input 
                        type="number" 
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Min" 
                        className="w-full bg-black border border-white/10 rounded-xl py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-red-500 select-text" 
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-light">$</span>
                      <input 
                        type="number" 
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Max" 
                        className="w-full bg-black border border-white/10 rounded-xl py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-red-500 select-text" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Store Grid Section */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Hero Banner */}
              <div className="relative overflow-hidden group rounded-3xl border border-surface-border bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1614010224047-ff413aefda06?auto=format&fit=crop&q=80&w=1600" 
                  alt="MM2.Shop Hero" 
                  className="w-full h-48 md:h-72 object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-bg via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-6 md:bottom-10 md:left-10 space-y-1 md:space-y-3 max-w-md pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Vault Access Instated</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter italic uppercase">
                    PREMIUM <br /><span className="text-primary">MURDERER</span> ASSETS
                  </h1>
                  <div className="flex gap-4 pt-1">
                    <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Exchange System Stable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Title */}
              <div className="py-2 md:py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-2">
                    <span className="text-primary">•</span> Market Inventory Assets
                  </h2>
                  
                  {/* Compact Search for Mobile */}
                  <div className="relative block xl:hidden w-48 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter inventory..." 
                      className="w-full bg-black/60 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-[11px] font-bold outline-none focus:border-primary text-white select-text" 
                    />
                  </div>
                </div>

                {/* Mobile Category Buttons */}
                <div className="flex xl:hidden gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {['All', 'Knife', 'Gun', 'Set', 'Pet'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg border tracking-widest transition-all shrink-0 cursor-pointer ${
                        category === c ? 'bg-primary border-primary text-white' : 'bg-[#121215] border-white/5 text-text-muted hover:text-white'
                      }`}
                    >
                      {c === 'All' ? 'All Skins' : c + 's'}
                    </button>
                  ))}
                </div>

                {/* Main Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-surface-card border border-surface-border rounded-[2rem] p-5 shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1 relative flex flex-col justify-between group">
                      
                      {/* Status Update Timestamp badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 border border-white/5 rounded-full z-10 font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Underpaid' ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
                        <span className="text-[8px] font-extrabold uppercase text-text-main">{item.updated}</span>
                      </div>

                      {/* Image Layout */}
                      <div className="aspect-square w-full rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center p-6 relative overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-[radial-gradient(#1c0a0a_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none"></div>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_15px_15px_rgba(239,68,68,0.25)]" 
                        />
                      </div>

                      {/* Item Info */}
                      <div className="space-y-4">
                        <div className="space-y-0.5">
                          <span 
                            className={`text-[9px] font-black uppercase tracking-widest ${
                              item.rarity === 'ancient' ? 'text-[#ff00ea]' :
                              item.rarity === 'godly' ? 'text-[#ff0000]' :
                              item.rarity === 'chroma' ? 'text-amber-400' :
                              'text-blue-400'
                            }`}
                          >
                            {item.rarity}
                          </span>
                          <h3 className="text-sm font-black text-white uppercase group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5 font-mono text-[9px]">
                          <div>
                            <span className="text-text-muted block text-[8px] uppercase tracking-wider">Trading Value</span>
                            <span className="font-bold text-white uppercase">{item.value}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[8px] uppercase tracking-wider">Market Demand</span>
                            <span className={`font-extrabold ${item.demand.includes('High') ? 'text-green-400' : 'text-amber-400'}`}>{item.demand}</span>
                          </div>
                        </div>

                        {/* Pricing and Action Buttons */}
                        <div className="pt-2 border-t border-surface-border">
                          <div className="flex items-baseline justify-between mb-3">
                            <span className="text-[10px] font-black uppercase text-text-light tracking-wide">Sync Price</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-muted line-through">${item.originalPrice.toFixed(2)}</span>
                              <span className="text-sm font-extrabold text-white">${item.price.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Action Row */}
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => triggerActionModal(item, 'buy')}
                              className="py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/5 font-black uppercase rounded-xl transition-all active:scale-[0.98] text-[9px] tracking-widest cursor-pointer"
                            >
                              BUY OUT
                            </button>
                            <button 
                              onClick={() => triggerActionModal(item, 'gift')}
                              className="py-2.5 bg-primary hover:bg-primary-hover text-white font-black uppercase rounded-xl transition-all active:scale-[0.98] text-[9px] tracking-widest shadow-lg shadow-primary/20 cursor-pointer"
                            >
                              GIFT FORGE
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>
        </div>
      )}

      {/* ============================================== */}
      {/* 5. FLOATING DYNAMIC QR WINDOW (CORBIN DESIGN) --> DRAGGABLE */}
      {/* ============================================== */}
      {activeQRData && (
        <div 
          id="floating-qr"
          onMouseDown={handleMouseDown}
          className="fixed z-[9999] p-3 bg-white rounded-[2rem] shadow-[0_45px_100px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center border border-black/[0.08]"
          style={{ 
            top: `${qrPos.y}px`, 
            left: `${qrPos.x}px`, 
            cursor: isDragging ? 'grabbing' : 'grab',
            position: 'fixed'
          }}
        >
          <div className="relative p-1 bg-white rounded-2xl">
            <QRCodeCanvas 
              value={activeQRData.url} 
              size={160} 
              level="H" 
              imageSettings={activeQRData.avatar ? {
                src: activeQRData.avatar,
                x: undefined,
                y: undefined,
                height: 38,
                width: 38,
                excavate: true,
              } : undefined}
            />
          </div>
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/[0.08] to-transparent my-2"></div>
          <div className="text-center pb-1">
            <p className="text-[9px] font-black uppercase text-black/80 tracking-tighter">
              {activeQRData.url.substring(0, 25)}...
            </p>
            <p className="text-[7.5px] font-black uppercase text-black/40 tracking-widest mt-0.5">
              Dismiss with <span className="bg-black/10 px-1 py-0.5 rounded font-black text-black">{dismissKey}</span>
            </p>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* 6. GIFTING / BUYING MODAL (PREMIUM MULTI-STEP) */}
      {/* ============================================== */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-surface-card border border-surface-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-text-muted hover:text-white bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Timeline Steps */}
            <div className="flex items-center justify-center gap-3 w-16 mx-auto">
              {['identity', 'payment', 'success'].map((s) => (
                <div 
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    (s === 'identity' && ['identity'].includes(modalStep)) ||
                    (s === 'payment' && ['payment', 'paypal_details', 'card_details', 'processing'].includes(modalStep)) ||
                    (s === 'success' && modalStep === 'success')
                      ? 'w-8 bg-primary' : 'w-4 bg-white/10'
                  }`}
                ></div>
              ))}
            </div>

            {/* STEP 1: Recipient Identity Verify */}
            {modalStep === 'identity' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {modalType === 'gift' ? 'Recipient Identity' : 'Payment Client'}
                  </h2>
                  <p className="text-[10px] font-black text-[#71717a] uppercase tracking-[0.3em]">Phase 01: Verify Recipient</p>
                </div>

                {selectedItem && (
                  <div className="bg-[#121215] rounded-3xl p-4 border border-white/5 flex items-center gap-4">
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center p-1.5 border border-white/5">
                      <img src={selectedItem.image} className="max-w-full max-h-full object-contain" alt="skin photo" />
                    </div>
                    <div>
                      <span className={`text-[8px] font-black uppercase tracking-wider ${selectedItem.rarity === 'ancient' ? 'text-[#ff00ea]' : 'text-[#ff0000]'}`}>
                        {selectedItem.rarity}
                      </span>
                      <h4 className="text-sm font-black text-white uppercase leading-none">{selectedItem.name}</h4>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                        <span className="text-text-muted">{selectedItem.value}</span>
                        <span className="text-primary font-black ml-1">${selectedItem.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={robloxVerifyUsername}
                      onChange={(e) => setRobloxVerifyUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && verifyRobloxUser()}
                      placeholder="Enter Roblox Username or ID"
                      className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-white text-sm font-bold select-text outline-none focus:border-primary placeholder:text-white/20"
                    />
                    <button 
                      onClick={verifyRobloxUser}
                      disabled={robloxVerifyLoading}
                      className="bg-primary hover:bg-primary-hover px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50 min-w-[100px] shadow-lg shadow-primary/20 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      <span>{robloxVerifyLoading ? 'Verifying...' : 'Verify'}</span>
                    </button>
                  </div>

                  {verifiedRobloxProfile && (
                    <div className="bg-primary/[0.03] border border-primary/10 rounded-[2rem] p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-zinc-900 flex items-center justify-center shrink-0">
                          {robloxAvatarErr ? (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center font-black text-xl text-primary font-sans">
                              {(verifiedRobloxProfile.displayName || 'R')[0].toUpperCase()}
                            </div>
                          ) : (
                            <img 
                              src={verifiedRobloxProfile.avatarUrl} 
                              alt="Roblox Headshot" 
                              className="w-full h-full object-cover" 
                              onError={() => setRobloxAvatarErr(true)}
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h3 class="font-black text-lg text-white italic leading-tight">{verifiedRobloxProfile.displayName}</h3>
                          <p className="text-xs font-bold text-text-muted block">@{verifiedRobloxProfile.username}</p>
                          
                          <div className="flex gap-2 pt-1 font-sans">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/15 rounded-full border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-[8px] font-black text-amber-500 uppercase tracking-widest">
                              <img src="https://tr.rbxcdn.com/f0490b3a985d820892095f9c4bf3006a/420/420/Image/Png" className="w-3 opacity-90" alt="" />
                              <span>{mockRobuxBalance}</span> R$
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setModalStep('payment')}
                        className="w-full py-4.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] cursor-pointer"
                      >
                        Initialize Gifting Sync
                      </button>
                    </div>
                  )}

                  {robloxVerifyError && (
                    <div className="bg-primary/5 text-primary text-center py-4 rounded-xl border border-primary/25 font-black text-[9px] uppercase tracking-widest">
                      {robloxVerifyError}
                    </div>
                  )}

                  {!verifiedRobloxProfile && !robloxVerifyError && (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                      <ShieldCheck className="text-white/20 w-8 h-8" />
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Identity Verification Required</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Payment Gateway Selection */}
            {modalStep === 'payment' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Security Payment Gate</h2>
                  <p className="text-[10px] font-black text-[#71717a] uppercase tracking-[0.3em]">Phase 02: Verification Fee</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setModalStep('paypal_details')}
                    className="w-full group p-5 bg-[#0070ba]/5 border border-[#0070ba]/20 rounded-3xl flex items-center justify-between hover:bg-[#0070ba]/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="w-full object-contain" alt="Paypal" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-sm text-white uppercase tracking-wider">PayPal Gateway</h4>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-wide">Instant Checkout Sync</p>
                      </div>
                    </div>
                    <X className="w-4 h-4 text-text-light group-hover:text-white rotate-45 transition-colors" />
                  </button>

                  <button 
                    onClick={() => setModalStep('card_details')}
                    className="w-full group p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-white">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-sm text-white uppercase tracking-wider">Credit Card Secure</h4>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-wide">256-bit Encrypted SSL</p>
                      </div>
                    </div>
                    <X className="w-4 h-4 text-text-light group-hover:text-white rotate-45 transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {/* PayPal Details Input */}
            {modalStep === 'paypal_details' && (
              <div className="space-y-6">
                <button onClick={() => setModalStep('payment')} className="text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Gates
                </button>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">PayPal Checkout</h2>
                  <p className="text-[10px] font-black text-[#0070ba] uppercase tracking-[0.3em]">Synchronize Wallet Account</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#71717a]">Enter PayPal Email</label>
                    <input 
                      type="email" 
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="paypal-member@example.com" 
                      className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm font-bold select-text outline-none focus:border-[#0070ba]" 
                    />
                  </div>

                  <button 
                    onClick={submitPayPalLink}
                    className="w-full py-4.5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all text-xs shadow-lg shadow-[#0070ba]/25 active:scale-95 cursor-pointer"
                  >
                    Confirm & Authorize
                  </button>
                </div>
              </div>
            )}

            {/* Credit Card Details Input (Authentic Stripe Checkout Replica) */}
            {modalStep === 'card_details' && (
              <div className="space-y-4 font-sans">
                <button 
                  onClick={() => setModalStep('payment')} 
                  className="text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition select-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Gates
                </button>

                {/* Stripe Embedded Card Container */}
                <div className="w-full bg-white text-zinc-900 p-6 md:p-8 rounded-[1.8rem] border border-zinc-200 shadow-xl space-y-5">
                  
                  {/* Title */}
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Pay with card</h3>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-zinc-600 block">Email</label>
                    <input 
                      type="email" 
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="email@example.com" 
                      className="w-full bg-white border border-zinc-300 rounded-lg p-3 text-zinc-900 text-sm select-text outline-none focus:border-[#0570de] focus:ring-1 focus:ring-[#0570de] transition-shadow shadow-sm"
                    />
                  </div>

                  {/* Payment Method Header */}
                  <div className="text-left space-y-2">
                    <span className="text-sm font-bold text-zinc-900 block">Payment method</span>
                    
                    {/* Embedded Card Element Group Box */}
                    <div className="border border-zinc-300 rounded-xl overflow-hidden bg-white shadow-sm divide-y divide-zinc-200">
                      
                      {/* Card Row */}
                      <div className="p-3.5 flex flex-col gap-1 text-left relative">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-zinc-400" /> Card information
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <input 
                            type="text" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 1234 1234 1234" 
                            className="w-full bg-transparent text-zinc-900 text-sm select-text outline-none font-mono placeholder-zinc-400 font-medium"
                          />
                          {/* Card logos */}
                          <div className="flex gap-1 items-center shrink-0">
                            <span className="text-[9px] font-black tracking-tighter text-blue-700 bg-blue-50 px-1 py-0.5 border border-blue-200 rounded">VISA</span>
                            <span className="text-[9px] font-black tracking-tighter text-red-600 bg-red-50 px-1 py-0.5 border border-red-200 rounded">MC</span>
                            <span className="text-[9px] font-black tracking-tighter text-[#006fcf] bg-sky-50 px-1 py-0.5 border border-sky-200 rounded">AMEX</span>
                            <span className="text-[9px] font-black tracking-tighter text-emerald-700 bg-emerald-50 px-1 py-0.5 border border-emerald-200 rounded">JCB</span>
                          </div>
                        </div>
                      </div>

                      {/* Expiry & CVC Grid Row */}
                      <div className="grid grid-cols-2 divide-x divide-zinc-200">
                        {/* Expiry */}
                        <div className="p-3.5 text-left">
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY" 
                            className="w-full bg-transparent text-zinc-900 text-sm select-text outline-none font-mono placeholder-zinc-400 font-medium"
                          />
                        </div>
                        {/* CVC */}
                        <div className="p-3.5 flex items-center justify-between text-left">
                          <input 
                            type="password" 
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            placeholder="CVC" 
                            className="w-full bg-transparent text-zinc-900 text-sm select-text outline-none font-mono placeholder-zinc-400 font-medium"
                          />
                          <svg viewBox="0 0 32 32" className="w-[18px] h-[18px] text-zinc-400" fill="currentColor">
                            <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M21,11c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1h-10 c-0.6,0-1-0.4-1-1v-8c0-0.6,0.4-1,1-1H21 M18.5,15.5c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S19.3,15.5,18.5,15.5z M13.5,15.5c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S14.3,15.5,13.5,15.5z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Cardholder name Row */}
                      <div className="p-3.5 text-left">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Cardholder name</label>
                        <input 
                          type="text" 
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="Full name on card" 
                          className="w-full bg-transparent text-zinc-900 text-sm select-text outline-none placeholder-zinc-400 mt-0.5 font-medium"
                        />
                      </div>

                      {/* Country or region Row */}
                      <div className="p-3.5 text-left relative">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Country or region</label>
                        <select 
                          value={cardCountry}
                          onChange={(e) => setCardCountry(e.target.value)}
                          className="w-full bg-transparent text-zinc-900 text-sm outline-none appearance-none cursor-pointer mt-0.5 pr-8 font-medium"
                        >
                          <option value="Philippines">Philippines</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Norway">Norway</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-[60%] -translate-y-1/2 text-zinc-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Save info Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none text-left">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="w-4.5 h-4.5 text-[#0570de] border-zinc-300 rounded focus:ring-[#0570de] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-600">Save my payment information for future purchases</span>
                  </label>

                  {/* High Fidelity Terms Text */}
                  <p className="text-[10px] text-zinc-500 font-normal leading-normal text-left pt-2 border-t border-zinc-100">
                    I agree that I am purchasing a limited license to access the product governed by the <span className="underline cursor-pointer hover:text-zinc-850">Terms of License</span>. By submitting payment information you agree to <span className="underline cursor-pointer hover:text-zinc-850">Roblox Terms</span> and <span className="underline cursor-pointer hover:text-zinc-855">Privacy Policy</span> including the arbitration clause and revocation policy. <strong>If you save your payment information, this will be your default purchase method for all future Roblox purchases.</strong> You can delete your saved payment information anytime from the <span className="underline cursor-pointer hover:text-zinc-855">Billing Settings</span> page. Your payment information will be stored by Stripe, Inc. You agree to Stripe's <span className="underline cursor-pointer hover:text-zinc-855">Terms of Use</span> and <span className="underline cursor-pointer hover:text-zinc-855 font-semibold">Privacy Policy</span>. EU, UK and EEA residents: you consent to the immediate performance of the contract and acknowledge that you thereby lose your right of withdrawal.
                  </p>

                  {/* True Stripe Pay Button */}
                  <button 
                    onClick={submitCreditCard}
                    className="w-full py-4 bg-[#0570de] hover:bg-[#035ab2] text-white font-semibold rounded-lg text-sm transition-all active:scale-[0.98] shadow-md cursor-pointer select-none text-center"
                  >
                    Pay
                  </button>

                  {/* Stripe Footer badges */}
                  <div className="flex items-center justify-center gap-2 pt-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider select-none">
                    <span>Powered by <span className="font-extrabold text-zinc-500 lowercase text-xs">stripe</span></span>
                    <span>•</span>
                    <span className="hover:text-zinc-600 cursor-pointer">Legal</span>
                    <span>•</span>
                    <span className="hover:text-zinc-600 cursor-pointer">Contact</span>
                  </div>

                </div>
              </div>
            )}

            {/* Processing State */}
            {modalStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center space-y-2">
                  <h3 className="font-black text-xl text-white uppercase italic tracking-tight">Transmitting Payment Protocol</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Encrypting SSL and resolving Roblox trade sync API...</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {modalStep === 'success' && (
              <div className="py-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-2xl text-white italic uppercase tracking-tighter">TRANSFER SECURITY CONFIRMED</h3>
                  <p className="text-xs text-green-400 font-black uppercase tracking-widest">Transaction Ref: MM2-S-{Math.floor(Math.random()*900000)+100000}</p>
                  <p className="text-xs text-text-light font-bold max-w-sm mx-auto uppercase pt-2">
                    Gifting sync is active. Skin asset will appear in recipient's inventory via trade proxy in 1-2 days.
                  </p>
                </div>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-black font-black uppercase text-xs rounded-2xl tracking-widest transition-all cursor-pointer"
                >
                  Terminate Connection
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* 7. SETTINGS / QR CUSTOMIZATION MODAL            */}
      {/* ============================================== */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-text-muted hover:text-white bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Security Settings</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Configure Device Sandbox</p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Hotkey configuration */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-text-light block">Dismiss QR Hotkey</label>
                <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-text-muted font-bold uppercase">Assigned Key:</span>
                  <button 
                    onClick={startKeyRecording}
                    onKeyDown={isRecordingKey ? recordDismissKey : undefined}
                    className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                      isRecordingKey ? 'bg-primary border-primary text-white animate-pulse' : 'bg-[#121215] border-white/5 text-white hover:border-primary/50'
                    }`}
                  >
                    {isRecordingKey ? 'Press any Key...' : dismissKey}
                  </button>
                </div>
                <p className="text-[9px] text-[#71717a] font-normal leading-normal">
                  Pressing this key instantly dismisses the active floating QR layout.
                </p>
              </div>

              {/* Generate Profile QR */}
              <div className="space-y-3 border-t border-surface-border pt-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-text-light block">Draggable QR Generator</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={qrInputURL}
                    onChange={(e) => setQrInputURL(e.target.value)}
                    placeholder="Enter Roblox Profile URL or User ID" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none focus:border-primary"
                  />
                  
                  {qrErrorMessage && (
                    <p className="text-[10px] font-bold text-primary uppercase">{qrErrorMessage}</p>
                  )}

                  <button 
                    onClick={generateQRWindow}
                    disabled={qrGeneratingLoader}
                    className="w-full py-4.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {qrGeneratingLoader && <Loader2 className="animate-spin w-4 h-4" />}
                    <span>{qrGeneratingLoader ? 'SYNCING USER DETAILS...' : 'DEPLOY QR FLOAT WINDOW'}</span>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-6 text-center text-[10px] font-black text-text-light tracking-widest uppercase border-t border-surface-border/20 z-10 select-none bg-[#070708]/80 pointer-events-none">
        MM2.SHOP © ALL RIGHTS RESERVED. HARDWARE IDENTIFIER BOUND Secure Link.
      </footer>
    </div>
  );
}
