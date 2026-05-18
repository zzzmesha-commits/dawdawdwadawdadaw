
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutGrid, 
  Tag, 
  TrendingUp,
  Clock,
  Gift,
  HelpCircle, 
  Info,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Package,
  Truck,
  Box,
  RefreshCw,
  Lock,
  Settings,
  Key,
  Trash2,
  Plus,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { ITEMS, Item } from './data';

// --- Components ---

const Header = ({ 
  user, 
  onLogout, 
  onSettingsClick,
}: { 
  user: { name: string } | null; 
  onLogout: () => void;
  onSettingsClick: () => void;
}) => {
  return (
    <header className="sticky top-0 z-50 bg-surface-card border-b border-surface-border px-4 md:px-8 h-16 flex items-center justify-between shadow-2xl shadow-black/20">
      <div className="flex items-center gap-6 md:gap-10">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-red-900/40">
            <Tag size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">MM2<span className="text-primary">.SHOP</span></span>
        </div>
        <nav className="hidden lg:flex gap-6 h-16 items-center translate-y-[1px]">
          {['Market', 'Knives', 'Guns', 'Sets', 'About'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className={`text-sm font-bold transition-colors relative h-full flex items-center px-1 tracking-wide ${
                link === 'Market' ? 'text-primary' : 'text-text-muted hover:text-white'
              }`}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden sm:block px-3 py-1.5 text-xs font-bold text-text-light hover:text-white transition-colors">USD</button>
        
        <button 
          onClick={onSettingsClick}
          className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Security Settings"
        >
          <Settings size={18} />
        </button>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-border px-3 py-1.5 rounded-xl border border-white/5">
              <User size={14} className="text-text-light" />
              <span className="text-sm font-bold">{user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 hidden xl:block shrink-0">
      <div className="sticky top-24 bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-text-light">Inventory filters</h3>
          <span className="text-[10px] bg-surface-border px-2 py-0.5 rounded font-black text-text-muted">0</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-text-muted">Category</label>
            <div className="space-y-2">
              {['All Skins', 'Knives', 'Guns', 'Sets', 'Effects', 'Radios'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded border-2 border-surface-border group-hover:border-primary transition-all flex items-center justify-center">
                    {cat === 'All Skins' && <div className="w-1.5 h-1.5 bg-primary rounded-sm" />}
                  </div>
                  <span className={`text-[13px] font-bold transition-colors ${cat === 'All Skins' ? 'text-white' : 'text-text-muted group-hover:text-text-main'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-text-muted">Rarity Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { color: 'bg-[#ff00ea]', label: 'Ancient' },
                { color: 'bg-[#ff0000]', label: 'Godly' },
                { color: 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500', label: 'Chroma' },
                { color: 'bg-yellow-400', label: 'Unique' },
                { color: 'bg-orange-500', label: 'Legendary' },
                { color: 'bg-blue-500', label: 'Rare' },
                { color: 'bg-green-500', label: 'Uncommon' },
                { color: 'bg-gray-500', label: 'Common' }
              ].map((r, i) => (
                <div key={i} title={r.label} className={`aspect-square rounded-lg cursor-pointer border-2 border-transparent hover:border-white transition-all shadow-inner ${r.color}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-surface-border">
            <label className="text-[11px] font-black uppercase tracking-wider text-text-muted">Price Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-light">$</span>
                <input type="text" placeholder="Min" className="w-full bg-surface-bg border border-surface-border rounded-xl py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-primary" />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-light">$</span>
                <input type="text" placeholder="Max" className="w-full bg-surface-bg border border-surface-border rounded-xl py-2 pl-6 pr-2 text-xs font-bold outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ItemCard = ({ item, onAddToCart, onGiftClick }: { item: Item; onAddToCart: (item: Item) => void; onGiftClick: (item: Item) => void; key?: string }) => {
  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'ancient': return 'from-[#3c10a1] via-[#1a0a38] to-[#121215]';
      case 'chroma': return 'from-[#ff00ea]/40 via-[#1a0a38] to-[#121215]'; // Aurora effect
      case 'godly': return 'from-[#9b0000] via-[#2a0000] to-[#121215]';
      case 'unique': return 'from-[#8a6500] via-[#2a1d00] to-[#121215]';
      case 'legendary': return 'from-[#9b5100] via-[#2a1500] to-[#121215]';
      case 'rare': return 'from-[#004a9b] via-[#00152a] to-[#121215]';
      case 'uncommon': return 'from-[#006e00] via-[#002a00] to-[#121215]';
      default: return 'from-[#333] via-[#111] to-[#121215]';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'ancient': return 'bg-[#7d12ff]';
      case 'chroma': return 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500';
      case 'godly': return 'bg-[#ff0000]';
      case 'unique': return 'bg-[#ffb400]';
      case 'legendary': return 'bg-[#ff8a00]';
      case 'rare': return 'bg-[#007eff]';
      case 'uncommon': return 'bg-[#00d200]';
      default: return 'bg-[#808080]';
    }
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'overpaid') return 'text-[#ff4d4d]';
    if (status.toLowerCase() === 'stable' || status.toLowerCase() === 'underpaid') return 'text-[#00ff9d]';
    return 'text-text-muted';
  };

  const getDemandColor = (demand: string) => {
    if (demand.includes('High')) return 'text-[#00ff9d]';
    return 'text-text-muted';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#121215] border border-[#1f1f23] rounded-xl overflow-hidden group cursor-pointer flex flex-col hover:border-white/20 transition-all duration-300"
      onClick={() => onAddToCart(item)}
    >
      {/* Top Image Section with Rarity Badge and Gradient Background */}
      <div className={`relative aspect-[16/14] bg-gradient-to-b ${getRarityGradient(item.rarity)} flex items-center justify-center p-6 overflow-hidden`}>
        {/* Chroma specific animated overlay */}
        {item.rarity === 'chroma' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-green-500/10 to-blue-500/10 animate-pulse" />
        )}
        
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-lg z-20 ${getRarityBadge(item.rarity)}`}>
          {item.rarity}
        </div>
        <img 
          src={item.image} 
          alt={item.name} 
          className="max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-700 z-10" 
        />
      </div>

      {/* Item Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <h4 className="text-center font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate">{item.name}</h4>
        
        <div className="space-y-2 pt-2 text-[11px] font-bold">
          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase tracking-wider">Value:</span>
            <span className="text-[#ffb400] font-black">{item.value}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase tracking-wider">Price:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted line-through text-[10px]">${item.originalPrice.toFixed(2)}</span>
              <span className="text-white font-black">${item.price.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase tracking-wider font-bold">Demand:</span>
            <span className={getDemandColor(item.demand)}>{item.demand}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted uppercase tracking-wider font-bold">Status:</span>
            <span className={getStatusColor(item.status)}>{item.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase py-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <ShoppingCart size={12} />
            <span>Buy</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onGiftClick(item);
            }}
            className="flex items-center justify-center gap-2 bg-[#1f1f23] hover:bg-[#2a2a30] text-text-light text-[10px] font-black uppercase py-2.5 rounded-lg transition-all active:scale-95 border border-white/5"
          >
            <Gift size={12} />
            <span>Gift</span>
          </button>
        </div>

        {/* Footer info house */}
        <div className="pt-3 mt-auto border-t border-[#1f1f23] flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-70 transition-opacity">
          <Clock size={10} className="text-text-light" />
          <span className="text-[9px] uppercase font-black tracking-widest text-text-light">Updated {item.updated}</span>
        </div>
      </div>
    </motion.div>
  );
};


const GiftModal = ({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: Item | null }) => {
  const [step, setStep] = useState<'identity' | 'payment' | 'paypal_details' | 'card_details' | 'processing' | 'delivery_processing' | 'success'>('identity');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | null>(null);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default fake data
  const [randomLast4] = useState(() => {
    const saved = localStorage.getItem('mm2_fake_card_last4');
    if (saved) return saved;
    const val = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('mm2_fake_card_last4', val);
    return val;
  });

  const FAKE_CARD = {
    email: 'k*******@gmail.com',
    number: `•••• •••• •••• ${randomLast4}`,
    expiry: '08 / 29',
    cvc: '•••',
    name: 'J******* M*****',
    country: 'United States'
  };

  const maskEmail = (email: string) => {
    if (email.includes('*')) return email; // Already masked
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const maskedUser = user.length > 1 
      ? `${user.charAt(0)}${'*'.repeat(7)}` 
      : `${user.charAt(0)}*******`;
    return `${maskedUser}@${domain}`;
  };

  const maskCardNumber = (number: string) => {
    if (number.includes('•')) return number; // Already masked
    const clean = number.replace(/\s/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4 || randomLast4}`;
  };

  const maskName = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map(part => {
      if (part.length <= 1) return part;
      return `${part.charAt(0)}${'*'.repeat(Math.min(part.length - 1, 10))}`;
    }).join(' ');
  };

  // PayPal simulation states
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalProcessing, setPaypalProcessing] = useState(false);

  // Card simulation states
  const [cardEmail, setCardEmail] = useState(FAKE_CARD.email);
  const [cardNumber, setCardNumber] = useState(FAKE_CARD.number);
  const [cardExpiry, setCardExpiry] = useState(FAKE_CARD.expiry);
  const [cardCvc, setCardCvc] = useState(FAKE_CARD.cvc);
  const [cardName, setCardName] = useState(FAKE_CARD.name);
  const [cardCountry, setCardCountry] = useState(FAKE_CARD.country);
  const [cardProcessing, setCardProcessing] = useState(false);

  // Delivery simulation states
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  const startDeliveryProcess = () => {
    setStep('delivery_processing');
    setDeliveryProgress(0);
    
    const interval = setInterval(() => {
      setDeliveryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 800);
          return 100;
        }
        return prev + (Math.random() * 15 + 5);
      });
    }, 400);
  };

  const fetchProfile = async (retryCount = 0) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setProfile(null);
    try {
      const res = await fetch(`/api/roblox/user/${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      
      if (res.ok) {
        setProfile(data);
      } else {
        if (retryCount < 1 && (res.status === 500 || res.status === 504)) {
          console.log('Retrying profile fetch...');
          return fetchProfile(retryCount + 1);
        }
        setError(data.error || 'User not found');
      }
    } catch (err) {
      if (retryCount < 1) {
        return fetchProfile(retryCount + 1);
      }
      setError('Connection failed. Please try again.');
    } finally {
      if (retryCount === 0 || !loading) {
        setLoading(false);
      }
    }
  };

  const handleFinalize = () => {
    setStep('payment');
  };

  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentMethod('paypal');
    setPaypalProcessing(true);
    setTimeout(() => {
      setPaypalProcessing(false);
      startDeliveryProcess();
    }, 2500);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentMethod('card');
    setCardProcessing(true);
    setTimeout(() => {
      setCardProcessing(false);
      startDeliveryProcess();
    }, 3000);
  };

  const resetModal = () => {
    setStep('identity');
    setPaymentMethod(null);
    setUsername('');
    setProfile(null);
    setError('');
    setPaypalEmail('');
    // Keep card fields filled with original fake data
    setCardEmail(FAKE_CARD.email);
    setCardNumber(FAKE_CARD.number);
    setCardExpiry(FAKE_CARD.expiry);
    setCardCvc(FAKE_CARD.cvc);
    setCardName(FAKE_CARD.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetModal}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#0a0a0c] border border-white/5 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <button onClick={resetModal} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-10 transition-transform hover:rotate-90">
          <X size={20} />
        </button>

        <div className="p-10">
          {/* Progress Header */}
          <div className="flex justify-center gap-2 mb-10">
            {['identity', 'payment', 'success'].map((s, i) => (
              <div 
                key={s} 
                className={`h-1 rounded-full transition-all duration-500 ${
                  (s === 'identity' && step === 'identity') || 
                  (s === 'payment' && (step === 'payment' || step === 'paypal_details' || step === 'card_details' || step === 'processing' || step === 'delivery_processing')) ||
                  (s === 'success' && step === 'success')
                    ? 'w-8 bg-primary' : 'w-4 bg-white/10'
                }`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Recipient Identity</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Phase 01: Verify Recipient</p>
                </div>

                {item && (
                  <div className="bg-[#121215] rounded-3xl p-5 border border-white/5 flex items-center gap-4 group">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center p-2 border border-white/5 group-hover:border-primary/30 transition-colors">
                      <img src={item.image} alt="" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.rarity}</p>
                      <h4 className="text-sm font-black text-white uppercase">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-text-muted italic">{item.value}</p>
                        <span className="text-[10px] text-text-muted line-through opacity-50">${item.originalPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-white font-black">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (profile) setProfile(null);
                          if (error) setError('');
                        }}
                        placeholder="Username or ID"
                        className={`flex-1 bg-black border ${error ? 'border-primary/40' : 'border-white/10'} rounded-2xl p-4 outline-none focus:border-primary transition-all text-white font-bold text-sm shadow-inner`}
                        onKeyDown={(e) => e.key === 'Enter' && fetchProfile()}
                      />
                      <button 
                        onClick={() => fetchProfile()}
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50 min-w-[90px] shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Verify'}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {profile ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/[0.03] border border-primary/10 rounded-[2.5rem] p-6 space-y-6"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-primary/20 rounded-full blur animate-pulse" />
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary ring-4 ring-primary/5 bg-black">
                              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-black text-xl text-white italic tracking-tight">{profile.displayName}</h3>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">@{profile.username}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active</span>
                              </div>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                                <img src="/robux_icon.png" className="w-2.5 opacity-80" alt="" onError={(e) => (e.target as any).src = 'https://tr.rbxcdn.com/f0490b3a985d820892095f9c4bf3006a/420/420/Image/Png'} />
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                  {Math.floor(Math.random() * 5000 + 100).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleFinalize}
                          className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-[0_15px_40px_-10px_rgba(255,18,18,0.4)] hover:bg-primary-hover active:scale-[0.98] transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                        >
                          <Gift size={16} className="group-hover:-translate-y-1 transition-transform" />
                          Initialize Shipment
                        </button>
                      </motion.div>
                    ) : error ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 px-4 bg-primary/5 rounded-2xl border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.2em]"
                      >
                        {error}
                      </motion.div>
                    ) : (
                      <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                        <ShieldCheck size={32} className="text-white/20" />
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Identity Verification Pending</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Payment Gateway</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Phase 02: Transmission Fee</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setStep('paypal_details')}
                    className="w-full group p-6 bg-[#0070ba]/5 border border-[#0070ba]/20 rounded-3xl flex items-center justify-between hover:bg-[#0070ba]/10 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="w-full" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-white uppercase tracking-widest">PayPal Express</p>
                        <p className="text-[10px] font-bold text-[#0070ba] uppercase">Instant Authorization</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/10 group-hover:text-[#0070ba] transition-all" />
                  </button>

                  <button 
                    onClick={() => setStep('card_details')}
                    className="w-full group p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/[0.05] transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <CreditCard size={24} className="text-white/30" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-white uppercase tracking-widest">Credit Interface</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase italic">Decentralized Authorization</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/10 group-hover:text-primary transition-all" />
                  </button>
                </div>

                <button 
                  onClick={() => setStep('identity')}
                  className="w-full text-[10px] font-black text-text-muted uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  Return to Identification
                </button>
              </motion.div>
            )}

            {step === 'card_details' && (
              <motion.div 
                key="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#f6f9fc] rounded-[1.5rem] p-8 text-[#32325d] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#4169e1] opacity-20" />
                  
                  <form onSubmit={handleCardSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold tracking-tight text-[#1a1f36]">Pay with card</h2>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                          <img src="https://i.gzn.jp/img/gsc/payment/visa.png" className="w-[85%]" alt="visa" referrerPolicy="no-referrer" />
                        </div>
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-full" alt="mastercard" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#4f5b76]">Email</label>
                      <input 
                        required
                        type="text"
                        value={cardEmail}
                        onChange={(e) => setCardEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-white border border-[#e6ebf1] rounded-lg p-3 text-sm shadow-sm focus:border-[#4169e1] focus:ring-1 focus:ring-[#4169e1] outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[13px] font-medium text-[#4f5b76]">Payment method</label>
                       <div className="bg-white border border-[#e6ebf1] rounded-lg shadow-sm overflow-hidden">
                          <div className="p-3 bg-[#fcfcfd] border-b border-[#e6ebf1] flex items-center gap-2">
                            <CreditCard size={14} className="text-[#4169e1]" />
                            <span className="text-[12px] font-bold text-[#1a1f36]">Card</span>
                          </div>
                          
                          <div className="p-0">
                            <div className="px-3 py-3 border-b border-[#e6ebf1]">
                              <input 
                                required
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 1234 1234 1234"
                                className="w-full text-sm outline-none bg-transparent placeholder:text-gray-300"
                              />
                            </div>
                            <div className="grid grid-cols-2">
                              <input 
                                required
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM / YY"
                                className="w-full text-sm p-3 outline-none bg-transparent border-r border-[#e6ebf1] placeholder:text-gray-300"
                              />
                              <input 
                                required
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                placeholder="CVC"
                                className="w-full text-sm p-3 outline-none bg-transparent placeholder:text-gray-300"
                              />
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#4f5b76]">Cardholder name</label>
                      <input 
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full name on card"
                        className="w-full bg-white border border-[#e6ebf1] rounded-lg p-3 text-sm shadow-sm focus:border-[#4169e1] outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-[#4f5b76]">Country or region</label>
                      <div className="relative">
                        <select 
                          value={cardCountry}
                          onChange={(e) => setCardCountry(e.target.value)}
                          className="w-full bg-white border border-[#e6ebf1] rounded-lg p-3 text-sm shadow-sm focus:border-[#4169e1] outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option>Philippines</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <input type="checkbox" id="saveInfo" className="w-4 h-4 rounded border-gray-300 text-[#4169e1] focus:ring-[#4169e1]" />
                       <label htmlFor="saveInfo" className="text-[12px] text-gray-500 font-medium">Save my payment information for future purchases</label>
                    </div>

                    <div className="text-[11px] text-gray-400 leading-relaxed font-medium">
                      <p>
                        I agree that I am purchasing a limited license to access the product governed by the <span className="text-[#4169e1] cursor-pointer hover:underline">Terms of License</span>. By submitting payment information you agree to <span className="text-[#4169e1] cursor-pointer hover:underline">Roblox Terms</span> and <span className="text-[#4169e1] cursor-pointer hover:underline">Privacy Policy</span> including the arbitration clause and revocation policy.
                      </p>
                    </div>

                    <button 
                      disabled={cardProcessing}
                      className="w-full py-4 bg-[#4169e1] hover:bg-[#3256d5] text-white font-bold rounded-lg transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-3 shadow-lg shadow-[#4169e1]/20 disabled:opacity-70"
                    >
                      {cardProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span className="tracking-wide">Processing Payment...</span>
                        </>
                      ) : (
                        <span className="text-[15px] font-bold">Pay ${item?.price.toFixed(2)}</span>
                      )}
                    </button>
                    
                    <div className="flex justify-center items-center gap-3 pt-4 border-t border-[#e6ebf1] text-[11px] text-[#8792a2] font-semibold">
                       <div className="flex items-center gap-1">
                          <span className="opacity-70">Powered by</span>
                          <span className="text-[#4f5b76] uppercase tracking-tighter text-[13px] font-black">stripe</span>
                       </div>
                       <div className="h-3 w-px bg-gray-200" />
                       <span className="hover:text-gray-600 cursor-pointer">Legal</span>
                       <span className="hover:text-gray-600 cursor-pointer">Contact</span>
                    </div>
                  </form>
                </div>
                
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full text-[10px] font-black text-text-muted uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  Cancel and Return
                </button>
              </motion.div>
            )}

            {step === 'paypal_details' && (
              <motion.div 
                key="paypal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Confirm Account Link</h2>
                </div>

                <form onSubmit={handlePaypalSubmit} className="space-y-6">
                  <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">PayPal ID / Email</label>
                      <input 
                        required
                        type="email" 
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="slayer@vault.io"
                        className="w-full bg-black border border-white/10 rounded-2xl p-4 outline-none focus:border-[#0070ba] transition-all text-white font-bold"
                      />
                    </div>
                    
                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-text-muted uppercase">Transmission Fee</span>
                      <span className="text-sm font-black text-white italic">{item?.value}</span>
                    </div>
                  </div>

                  <button 
                    disabled={paypalProcessing}
                    className="w-full py-5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-black rounded-2xl shadow-xl shadow-[#0070ba]/20 active:scale-[0.98] transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                  >
                    {paypalProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Authorizing...
                      </>
                    ) : (
                      'Authorize Secure Transfer'
                    )}
                  </button>
                </form>

                <p className="text-[9px] font-bold text-center text-text-muted uppercase tracking-widest opacity-50">
                  Redirecting to external verification node...
                </p>
              </motion.div>
            )}

            {step === 'delivery_processing' && (
              <motion.div 
                key="delivery"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <Loader2 size={80} className="text-primary animate-spin mx-auto relative" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Processing Order</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Finalizing Instant Virtual Delivery</p>
                </div>
                <div className="flex justify-center gap-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={`w-2 h-2 rounded-full bg-primary animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }} />
                   ))}
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="text-center space-y-8 py-10"
              >
                <div className="relative inline-block">
                  <div className="absolute -inset-8 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)] mx-auto">
                    <ShieldCheck size={64} className="text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Transmission Successful</h2>
                  <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.3em]">Payload Dispatched to @{profile?.username}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-left space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span>Receipt Token</span>
                    <span className="text-white font-mono">#TXN-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span>Payment Method</span>
                    <span className="text-white">
                      {paymentMethod === 'card' 
                        ? `Credit Card (${maskEmail(cardEmail)})` 
                        : `PayPal (${maskEmail(paypalEmail)})`}
                    </span>
                  </div>
                  {paymentMethod === 'card' && (
                    <>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                        <span>Cardholder</span>
                        <span className="text-white">{maskName(cardName)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                        <span>Card Details</span>
                        <span className="text-white">{maskCardNumber(cardNumber)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                    <span>Estimated Delivery</span>
                    <span className="font-black italic">2-3 DAYS</span>
                  </div>
                </div>

                <button 
                  onClick={resetModal}
                  className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all text-xs uppercase tracking-[0.3em]"
                >
                  Terminate Connection
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (name: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(input || 'User');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-surface-card border border-surface-border w-full max-w-md rounded-3xl p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Tag size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">MM2<span className="text-primary">.SHOP</span></span>
          </div>
          <h2 className="text-2xl font-black mb-2 text-white">CHOOSE YOUR IDENTITY</h2>
          <p className="text-xs font-bold text-text-light uppercase tracking-widest">Instant access to the underworld</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Slayer Alias</label>
            <input 
              autoFocus
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. GhostFace"
              className="w-full bg-surface-bg border border-surface-border rounded-2xl p-4 outline-none focus:border-primary transition-all text-white font-bold"
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-red-900/40 hover:bg-primary-hover active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
              Auto Log In
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Secure connection established via </span>
              <a href="#" className="text-[10px] font-black text-primary uppercase tracking-wider">Vault v2.4</a>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminLogin = ({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        onLogin();
      } else {
        setError('Unauthorized administrator credentials.');
      }
    } catch (err) {
      setError('Admin verification services offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-primary transition-colors">
           <ArrowLeft size={16} /> Back to Entry
        </button>

        <div className="bg-[#121215] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Admin Interface</h2>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Secure Node 0x0A</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase ml-2 tracking-widest">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase ml-2 tracking-widest">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-primary transition-all shadow-inner"
              />
            </div>

            {error && <p className="text-primary text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

            <button 
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log In System'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [keyType, setKeyType] = useState<'7d' | '30d' | 'lifetime'>('7d');
  const [loading, setLoading] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/admin/keys');
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAddKey = async () => {
    if (!newKey.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKey.trim(), type: keyType })
      });
      if (res.ok) {
        setNewKey('');
        fetchKeys();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/keys/${key}`, { method: 'DELETE' });
      if (res.ok) fetchKeys();
    } catch (err) {}
  };

  const handleResetHWID = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/keys/${key}/reset-hwid`, { method: 'POST' });
      if (res.ok) fetchKeys();
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                <Settings size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Command Center</h1>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Vault Authorization Management</p>
              </div>
           </div>
           <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 bg-surface-border hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              <LogOut size={16} /> Termination
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#121215] border border-white/5 rounded-3xl p-8 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest italic text-primary">Forge New Key</h3>
               <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="KEY-MM2-..."
                      className="flex-1 bg-black border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-primary transition-all text-sm"
                    />
                    <button 
                      onClick={() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                        const segment = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                        setNewKey(`MM2-${segment()}-${segment()}`);
                      }}
                      className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-text-light"
                      title="Generate Random Key"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['7d', '30d', 'lifetime'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setKeyType(t)}
                        className={`py-2 rounded-xl text-[9px] font-bold uppercase transition-all border ${
                          keyType === t ? 'bg-primary/10 border-primary text-primary' : 'bg-black border-white/5 text-text-muted hover:border-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddKey}
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-black rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary-hover shadow-lg shadow-primary/20"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                    Register Key
                  </button>
               </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center">
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active nodes</p>
               <p className="text-3xl font-black text-white italic mt-2">{keys.length}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <div className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-text-muted">Registered Access Keys</h3>
                   <RefreshCw size={14} className="text-text-muted cursor-pointer hover:text-white transition-colors" onClick={fetchKeys} />
                </div>
                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                   {keys.map((k) => (
                     <div key={k.id} className="p-5 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center text-primary">
                              <Key size={16} />
                           </div>
                           <div className="space-y-1">
                              <span className="font-mono text-sm tracking-widest font-bold">{k.id}</span>
                              <div className="flex gap-2 items-center">
                                 <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                   k.type === 'lifetime' ? 'bg-orange-950 text-orange-400' : 'bg-blue-950 text-blue-400'
                                 }`}>{k.type}</span>
                                 <span className="text-[8px] font-black text-text-muted uppercase">
                                   {k.expiryDate ? `Expires: ${new Date(k.expiryDate).toLocaleDateString()}` : 'Perpetual Access'}
                                 </span>
                                 {k.hwid && (
                                   <span className="text-[8px] font-black text-green-500 uppercase flex items-center gap-1">
                                      <Lock size={8} /> HWID Locked
                                   </span>
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {k.hwid && (
                            <button 
                              onClick={() => handleResetHWID(k.id)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-tighter text-text-light transition-all"
                              title="Reset HWID Lock"
                            >
                               Reset HWID
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteKey(k.id)}
                            className="p-2 text-text-muted hover:text-primary transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                        </div>
                     </div>
                   ))}
                   {keys.length === 0 && (
                     <div className="p-10 text-center text-text-muted uppercase text-[10px] font-black italic tracking-widest">
                        No active authorization keys found
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KeyGate = ({ onVerify, onAdminClick }: { onVerify: (key: string, info: any) => void; onAdminClick: () => void }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getHWID = () => {
    let id = localStorage.getItem('mm2_device_hwid');
    if (!id) {
       id = 'HWID-' + Math.random().toString(36).substring(2, 11).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
       localStorage.setItem('mm2_device_hwid', id);
    }
    return id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: key.trim(),
          hwid: getHWID()
        })
      });
      const data = await res.json();
      if (res.ok) {
        onVerify(key.trim(), data.keyInfo);
      } else {
        setError(data.error || 'Invalid access key. Unauthorized access denied.');
      }
    } catch (err) {
      setError('Communication protocol failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] space-y-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(255,18,18,0.5)] rotate-6">
            <Lock size={32} className="text-white" />
          </div>

          <div className="text-center space-y-2 pt-6">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Encrypted Entry</h1>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Vault Access Protocol Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Access Key</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter access sequence..."
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-white font-bold tracking-widest text-sm"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary font-black text-[10px] text-center uppercase tracking-wider"
              >
                {error}
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,18,18,0.4)] transition-all active:scale-[0.98] text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Authorize Access'}
            </button>
          </form>

          <p className="text-center text-[9px] font-bold text-text-muted/40 uppercase tracking-widest leading-relaxed">
            By entering an access key you agree to our automated security protocols. unauthorized attempts are logged.
          </p>
        </div>
        
        <div className="mt-8 text-center space-y-4">
           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Administrator Login?</p>
           <div className="flex justify-center gap-4">
              <button 
                onClick={onAdminClick}
                className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 transition-all text-text-light hover:text-primary shadow-xl"
              >
                 <Settings size={18} />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, keyInfo, onLogout, onGenerateQR, dismissKey, onDismissKeyChange }: { isOpen: boolean; onClose: () => void; keyInfo: any; onLogout: () => void; onGenerateQR: (data: any) => void; dismissKey: string; onDismissKeyChange: (key: string) => void }) => {
  if (!isOpen) return null;

  const [qrInput, setQrInput] = useState('');
  const [avatarUsername, setAvatarUsername] = useState('');
  const [qrAvatar, setQrAvatar] = useState<string | null>(null);
  const [qrError, setQrError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const timeRemaining = keyInfo?.expiryDate ? Math.max(0, keyInfo.expiryDate - Date.now()) : null;
  const daysRemaining = timeRemaining ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : null;

  // Auto-fetch profile when link is put
  useEffect(() => {
    const extractUserInfo = async () => {
      if (!qrInput.includes('roblox.com')) return;
      
      let identifier = '';
      // Regex to extract ID from profile link
      const idMatch = qrInput.match(/users\/(\d+)/i);
      if (idMatch) {
         identifier = idMatch[1];
      } else {
         // Try checking for group or other formats if needed, but users is primary
         return;
      }

      if (identifier) {
        setAvatarUsername(identifier);
        setLoading(true);
        try {
          const res = await fetch(`/api/roblox/user/${identifier}`);
          const data = await res.json();
          if (data.avatarUrl) {
            setQrAvatar(data.avatarUrl);
          }
        } catch (err) {
        } finally {
          setLoading(false);
        }
      }
    };

    extractUserInfo();
  }, [qrInput]);

  const generateQRCode = async () => {
    setQrError('');
    const normalizedInput = qrInput.toLowerCase().trim();
    if (!normalizedInput.includes('roblox.com')) {
      setQrError('Protocol Error: Authorization must start with roblox.com');
      return;
    }

    let identifier = avatarUsername;

    // If identifier is missing, try to extract it again
    if (!identifier) {
      const idMatch = qrInput.match(/users\/(\d+)/i);
      if (idMatch) identifier = idMatch[1];
    }

    if (identifier) {
      setLoading(true);
      try {
        const res = await fetch(`/api/roblox/user/${identifier}`);
        if (!res.ok) throw new Error('Identity verify failed');
        const data = await res.json();
        // Just verify it exists, don't need avatar for QR
      } catch (err) {
        console.error('QR Generate Error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    // Ensure URL has protocol for some scanners
    let finalUrl = qrInput;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }

    onGenerateQR({ url: finalUrl, avatar: null });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121215] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl"
      >
        <div className="p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">System Settings</h2>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">User Node Configuration</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
               <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* License Section */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active License</span>
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                   keyInfo?.type === 'lifetime' ? 'bg-orange-950 text-orange-400' : 'bg-blue-950 text-blue-400'
                 }`}>
                   {keyInfo?.type || 'N/A'}
                 </span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-text-light">
                   <Key size={14} />
                 </div>
                 <span className="font-mono text-sm tracking-widest text-white">{keyInfo?.key || '•••••'}</span>
               </div>
               <div className="pt-2 border-t border-white/5">
                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                   Validity: {keyInfo?.expiryDate ? `${daysRemaining} Days Remaining` : 'Lifetime Authorized'}
                 </p>
               </div>
            </div>

            {/* QR Generator Section */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4">
               <div className="flex items-center gap-2">
                 <QrCode size={14} className="text-primary" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest">MM2 QR Forge</h3>
               </div>
               
               <div className="space-y-3">
                 <div className="space-y-1">
                   <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1">Roblox URL (Auto-Fetches)</label>
                   <input 
                     type="text" 
                     value={qrInput}
                     onChange={(e) => setQrInput(e.target.value)}
                     placeholder="roblox.com/users/12345/profile"
                     className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-primary/50 transition-all"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[8px] font-black text-text-muted uppercase tracking-widest ml-1">Manual Username Override</label>
                   <input 
                     type="text" 
                     value={avatarUsername}
                     onChange={(e) => {
                       setAvatarUsername(e.target.value);
                       setQrAvatar(null);
                     }}
                     placeholder="Username or ID"
                     className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-primary/50 transition-all"
                   />
                 </div>

                 {qrError && <p className="text-primary text-[8px] font-black uppercase tracking-widest">{qrError}</p>}

                 <button 
                   onClick={generateQRCode}
                   disabled={loading}
                   className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                   {loading && <Loader2 size={12} className="animate-spin" />}
                   Generate & Deploy Sync QR
                 </button>
               </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between group">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Device Authorization</p>
                 <p className="text-[11px] font-bold text-green-500 uppercase flex items-center gap-1">
                   <Lock size={10} /> Hardware Synchronized
                 </p>
               </div>
            </div>

            {/* Quick Dismiss Key Section */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
               <div className="flex justify-between items-center">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Dismiss Shortcut</p>
                   <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Clear Forge Screen</p>
                 </div>
                 <button 
                  onClick={() => setIsRecording(true)}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    isRecording 
                      ? 'bg-primary/20 border-primary text-primary animate-pulse' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                 >
                   {isRecording ? 'Press Key...' : (dismissKey || 'None')}
                 </button>
               </div>

               {isRecording && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
                  <div 
                    className="bg-black/90 p-8 rounded-3xl border border-primary/30 flex flex-col items-center gap-4 pointer-events-auto"
                    onKeyDown={(e) => {
                      e.preventDefault();
                      onDismissKeyChange(e.key);
                      setIsRecording(false);
                    }}
                    tabIndex={0}
                    autoFocus
                  >
                    <p className="text-xs font-black text-white uppercase tracking-[0.2em]">Assign New Handle</p>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Press any key to bind dismissal</p>
                  </div>
                </div>
               )}
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-5 bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-text-light hover:text-red-500 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Disconnect from Vault
          </button>

          <p className="text-center text-[8px] font-bold text-text-muted/40 uppercase tracking-[0.2em]">
            Protocol 0x1A-4 // Security Session Managed by MM2.SHOP Remote
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FloatingQR = ({ data, onClose }: { data: { url: string, avatar: string | null }, onClose: () => void }) => {
  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8, x: 100, y: 0 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      className="fixed z-[9999] cursor-move select-none p-3 bg-white rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center border border-black/[0.08]"
      style={{ top: '15%', right: '5%' }}
    >
      <div className="relative p-1 bg-white rounded-2xl">
        <QRCodeCanvas 
          value={data.url}
          size={160}
          level="H"
          marginSize={1}
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [appState, setAppState] = useState<'key_gate' | 'admin_login' | 'admin_dashboard' | 'main_app'>('key_gate');
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeQR, setActiveQR] = useState<{ url: string, avatar: string | null } | null>(null);
  const [dismissKey, setDismissKey] = useState(localStorage.getItem('mm2_dismiss_key') || 'Delete');
  const [selectedGiftItem, setSelectedGiftItem] = useState<Item | null>(null);
  const [balance, setBalance] = useState(12.50);
  const [cart, setCart] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    // Check key verification
    const isVerified = localStorage.getItem('mm2_key_verified');
    const isAdmin = localStorage.getItem('mm2_admin_auth');
    
    const savedKeyInfo = localStorage.getItem('mm2_key_info');
    
    if (savedKeyInfo) {
      setKeyInfo(JSON.parse(savedKeyInfo));
    }

    if (isAdmin === 'true') {
      setAppState('admin_dashboard');
    } else if (isVerified === 'true') {
      setAppState('main_app');
    }

    const savedUser = localStorage.getItem('mm2shop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQR && e.key === dismissKey) {
        setActiveQR(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQR, dismissKey]);

  const handleKeyVerify = (key: string, info: any) => {
    localStorage.setItem('mm2_key_verified', 'true');
    localStorage.setItem('mm2_key_info', JSON.stringify(info));
    setKeyInfo(info);
    setAppState('main_app');
  };

  const handleAdminLogin = () => {
    localStorage.setItem('mm2_admin_auth', 'true');
    setAppState('admin_dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('mm2_admin_auth');
    setAppState('key_gate');
  };

  const handleAppLogout = () => {
    localStorage.removeItem('mm2_key_verified');
    localStorage.removeItem('mm2_key_info');
    setKeyInfo(null);
    setAppState('key_gate');
    setIsSettingsModalOpen(false);
  };

  const handleLogin = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem('mm2shop_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mm2shop_user');
  };

  const handleAddToCart = (item: Item) => {
    setCart([...cart, item]);
    // Optionally alert or just update balance visually for demo
  };

  const handleGiftClick = (item: Item) => {
    setSelectedGiftItem(item);
    setIsGiftModalOpen(true);
  };

  const filteredItems = ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  if (appState === 'key_gate') {
    return <KeyGate onVerify={handleKeyVerify} onAdminClick={() => setAppState('admin_login')} />;
  }

  if (appState === 'admin_login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setAppState('key_gate')} />;
  }

  if (appState === 'admin_dashboard') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-orange-100 selection:text-primary">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 flex gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0 space-y-6">
          {/* Hero Banner Part (Keeping it) */}
          <div className="relative overflow-hidden group rounded-3xl border border-surface-border bg-black">
            <img 
              src="https://images.unsplash.com/photo-1614010224047-ff413aefda06?auto=format&fit=crop&q=80&w=1600" 
              alt="MM2.Shop Hero" 
              className="w-full h-48 md:h-72 object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-bg via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
            <div className="absolute bottom-4 left-6 md:bottom-10 md:left-10 space-y-1 md:space-y-3 max-w-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Vault Access Required</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter italic">
                PREMIUM <br /><span className="text-primary">MURDERER</span> ASSETS
              </h1>
              <div className="flex gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">Prices Stable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop by Category Section */}
          <div className="py-8 space-y-8">
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl animate-bounce">💖</span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">Shop by Category</h2>
              <span className="text-2xl animate-bounce">💖</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Knives', count: 181, img: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fniks-scythe.webp&w=256&q=75' },
                { name: 'Guns', count: 83, img: 'https://www.game.guide/_next/image?url=%2Fimages%2Fmm2%2Fchroma-evergun.webp&w=256&q=75' },
                { name: 'Bundles', count: 60, img: 'https://vignette.wikia.nocookie.net/murdermystery2/images/6/62/Candy.png/revision/latest' },
                { name: 'Pets', count: 40, img: 'https://vignette.wikia.nocookie.net/murdermystery2/images/0/07/Heart_Balloon.png/revision/latest' },
                { name: 'Special Deals', count: 214, img: 'https://vignette.wikia.nocookie.net/murdermystery2/images/c/c8/Chroma_Candleflame.png/revision/latest' }
              ].map(cat => (
                <motion.div
                  key={cat.name}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    const map: Record<string, string> = {
                      'Knives': 'Knife',
                      'Guns': 'Gun',
                      'Bundles': 'Set',
                      'Pets': 'Pet',
                      'Special Deals': 'All'
                    };
                    setCategory(map[cat.name] || 'All');
                  }}
                  className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden group cursor-pointer shadow-xl shadow-black/20"
                >
                  <div className="aspect-[4/5] relative flex items-center justify-center p-4 bg-[#f0f0f5]">
                    {/* Watermark/Background sim */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden flex flex-wrap gap-2 text-[20px] font-black items-center justify-center text-black rotate-12">
                      {Array.from({length: 12}).map((_, i) => <span key={i}>MM2Shop</span>)}
                    </div>
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className="max-w-full max-h-[70%] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" 
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                       <span className="text-[10px] font-black text-black/10 opacity-30">MM2SHOP</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="text-lg font-black text-black">{cat.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 ml-0.5">{cat.count}</span>
                    </div>
                    <div className="text-gray-400 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-300">
                      <TrendingUp size={16} className="rotate-45" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['All Skins', 'Knives', 'Guns', 'Sets', 'Effects', 'Pets'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All Skins' ? 'All' : cat)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  category === (cat === 'All Skins' ? 'All' : cat)
                    ? 'bg-primary text-white shadow-lg shadow-red-900/40' 
                    : 'bg-surface-card border border-surface-border text-text-muted hover:border-primary/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={16} />
              <input 
                type="text" 
                placeholder="Search skins... (e.g. Harvester)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-colors font-bold shadow-xl text-sm"
              />
            </div>
            <select className="bg-surface-card border border-surface-border text-white rounded-2xl px-8 py-3.5 text-xs font-black uppercase tracking-widest outline-none focus:border-primary cursor-pointer shadow-xl">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rarity: Highest First</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} onAddToCart={handleAddToCart} onGiftClick={handleGiftClick} />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-text-light font-medium">No items found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-surface-card border-t border-surface-border px-8 py-10 text-center space-y-6">
        <div className="flex justify-center gap-8">
          {['TOS', 'Privacy', 'Refunds', 'Support'].map(link => (
            <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-text-light hover:text-primary transition-colors">{link}</a>
          ))}
        </div>
        <p className="text-[10px] text-text-light max-w-2xl mx-auto leading-relaxed uppercase tracking-wider font-bold">
          MM2.SHOP IS AN INDEPENDENT MARKETPLACE. WE ARE NOT AFFILIATED WITH, SPONSORED BY, OR ENDORSED BY ROBLOX CORPORATION OR THE DEVELOPERS OF MURDER MYSTERY 2. ALL GAME ASSETS ARE PROPERTY OF THEIR RESPECTIVE OWNERS.
        </p>
        <p className="text-[11px] font-black text-text-muted tracking-widest">© 2026 MM2.SHOP ALL RIGHTS RESERVED</p>
      </footer>

      {/* Consent Popup */}
      <AnimatePresence>
        {showConsent && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-[90] max-w-sm"
          >
            <div className="bg-surface-card border border-surface-border rounded-3xl p-6 shadow-2xl shadow-black h-full">
              <h4 className="font-black text-sm uppercase tracking-widest mb-2 text-white">System Protocol</h4>
              <p className="text-[11px] text-text-light leading-relaxed mb-6 font-bold uppercase tracking-tight">
                MM2.SHOP is an independent exchange. By accessing our platform, you acknowledge our terms of engagement and coordinate with our security modules.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConsent(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted bg-surface-border rounded-xl hover:bg-white/10 transition-colors">
                  Decline
                </button>
                <button onClick={() => setShowConsent(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-primary rounded-xl shadow-lg shadow-red-900/20 hover:bg-primary-hover transition-colors">
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsModalOpen && (
          <SettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            keyInfo={keyInfo}
            onLogout={handleAppLogout}
            onGenerateQR={(data) => {
              setActiveQR(data);
              setIsSettingsModalOpen(false);
            }}
            dismissKey={dismissKey}
            onDismissKeyChange={(key) => {
              setDismissKey(key);
              localStorage.setItem('mm2_dismiss_key', key);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQR && (
          <FloatingQR 
            data={activeQR}
            onClose={() => setActiveQR(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLogin} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGiftModalOpen && (
          <GiftModal 
            isOpen={isGiftModalOpen} 
            onClose={() => setIsGiftModalOpen(false)} 
            item={selectedGiftItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
