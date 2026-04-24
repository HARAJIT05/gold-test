import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Save, UploadCloud } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { HeroSlide, GoldRateSlideConfig, DEFAULT_GOLD_SLIDE_CONFIG } from "../../hooks/useGoldRate";
import { logAdminAction } from "../../lib/audit";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [rates, setRates] = useState({
    rate22k: 0,
    rate24k: 0,
    logoUrl: "",
    homeConfig: {
      heroSlides: [] as HeroSlide[],
      heroImage: "",
      tickerText: "",
      goldRateSlides: { ...DEFAULT_GOLD_SLIDE_CONFIG } as GoldRateSlideConfig,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchRates() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'goldRate')
          .single();
          
        if (data) {
          setRates({
            rate22k: data.rate22k || 0,
            rate24k: data.rate24k || 0,
            logoUrl: data.logoUrl || "",
            homeConfig: {
              heroSlides: data.homeConfig?.heroSlides || [],
              heroImage: data.homeConfig?.heroImage || "",
              tickerText: data.homeConfig?.tickerText || "",
              goldRateSlides: { ...DEFAULT_GOLD_SLIDE_CONFIG, ...(data.homeConfig?.goldRateSlides || {}) },
            }
          });
        }
      } catch (err) {
        console.error("Failed to load rates", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'goldRate',
          rate22k: Number(rates.rate22k),
          rate24k: Number(rates.rate24k),
          logoUrl: rates.logoUrl,
          homeConfig: rates.homeConfig,
          lastUpdated: Date.now()
        }, { onConflict: 'id' });
        
      if (error) throw error;
      
      if (user?.email) {
        await logAdminAction(
          user.email,
          'UPDATE_SETTINGS',
          `Updated global settings.`
        );
      }

      setMsg({ text: "Settings updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMsg({ text: "Failed to update settings. Check permissions.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setMsg({ text: "Uploading logo...", type: "" });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
            throw new Error("The 'assets' bucket does not exist. Please create a public bucket named 'assets' in your Supabase dashboard.");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setRates({ ...rates, logoUrl: publicUrl });
      setMsg({ text: "Logo uploaded! Click 'Update System' to save.", type: "success" });
    } catch (err: any) {
      console.error("Upload error:", err);
      setMsg({ text: err.message || "Failed to upload logo.", type: "error" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSlideImageUpload = async (e: ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setMsg({ text: "Uploading image...", type: "" });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `slide-${slideIndex}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);
      
      setRates(prev => {
        const newSlides = [...(prev.homeConfig.heroSlides || [])];
        if (newSlides[slideIndex]) {
          newSlides[slideIndex].image = publicUrl;
        }
        return {
          ...prev,
          homeConfig: { ...prev.homeConfig, heroSlides: newSlides }
        };
      });
      setMsg({ text: "Image uploaded! Click 'Update System' to save changes.", type: "success" });
    } catch (err: any) {
      console.error(err);
      setMsg({ text: "Failed to upload image.", type: "error" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setRates(prev => {
      const newSlides = [...(prev.homeConfig.heroSlides || [])];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, homeConfig: { ...prev.homeConfig, heroSlides: newSlides } };
    });
  };

  const addSlide = () => {
    setRates(prev => {
      const newSlides = [...(prev.homeConfig.heroSlides || [])];
      if (newSlides.length >= 4) {
        setMsg({ text: "Maximum 4 slides allowed.", type: "error" });
        return prev;
      }
      newSlides.push({
        id: Date.now(),
        image: "",
        badge: "Artisanal Manufacturing",
        heading: "New Slide Heading",
        subheading: "Slide description",
        ctaText: "Click Here",
        ctaLink: "/"
      });
      return { ...prev, homeConfig: { ...prev.homeConfig, heroSlides: newSlides } };
    });
  };

  const removeSlide = (index: number) => {
    setRates(prev => {
      const newSlides = [...(prev.homeConfig.heroSlides || [])];
      newSlides.splice(index, 1);
      return { ...prev, homeConfig: { ...prev.homeConfig, heroSlides: newSlides } };
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="bg-navy-900 p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            Global Settings Editor
          </h2>
          {msg.text && (
            <span className={`text-sm px-3 py-1 rounded font-medium ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </span>
          )}
        </div>

        {loading ? (
           <div className="flex py-10"><Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" /></div>
        ) : (
          <div className="space-y-6">
            {/* Ticker text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Top Scrolling Ticker Text</label>
              <input
                type="text"
                value={rates.homeConfig.tickerText || ""}
                onChange={(e) =>
                  setRates(prev => ({
                    ...prev,
                    homeConfig: { ...prev.homeConfig, tickerText: e.target.value }
                  }))
                }
                placeholder="e.g. Welcome to NABA Gold Karigar · Est. 1992"
                className="w-full px-4 py-3 border border-white/10 bg-navy-800 text-white rounded-md shadow-sm outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">This text scrolls across the top bar of the website. Leave blank to use the default message.</p>
            </div>

            {/* Hero Section Image */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-bold text-lg text-white mb-1">Hero Section Image</h3>
              <p className="text-xs text-gray-400 mb-4">This is the large full-screen image shown at the top of the homepage. It is <strong className="text-white">separate</strong> from the carousel slides.</p>
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={rates.homeConfig.heroImage || ""}
                    placeholder="https://example.com/hero.jpg"
                    onChange={(e) => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, heroImage: e.target.value } }))}
                    className="w-full px-4 py-3 border border-white/10 bg-navy-800 text-white rounded-md shadow-sm outline-none focus:ring-2 focus:ring-gold-400 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">or</span>
                    <label className={`flex items-center gap-2 px-4 py-2 bg-navy-800 border border-white/10 rounded-md cursor-pointer hover:bg-navy-700 transition-colors text-sm font-medium text-gray-300 ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {uploadingLogo ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingLogo(true);
                          setMsg({ text: "Uploading hero image...", type: "" });
                          try {
                            const ext = file.name.split('.').pop();
                            const path = `hero-${Date.now()}.${ext}`;
                            const { error: upErr } = await supabase.storage.from('assets').upload(path, file);
                            if (upErr) throw upErr;
                            const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(path);
                            setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, heroImage: publicUrl } }));
                            setMsg({ text: "Hero image uploaded! Click 'Update System' to save.", type: "success" });
                          } catch (err: any) {
                            setMsg({ text: err.message || "Upload failed.", type: "error" });
                          } finally {
                            setUploadingLogo(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                {rates.homeConfig.heroImage && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-28 h-16 rounded-md bg-navy-900 border border-white/10 overflow-hidden flex-shrink-0">
                      <img src={rates.homeConfig.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, heroImage: "" } }))} className="text-xs text-red-500 hover:text-red-400 font-medium">Remove</button>
                  </div>
                )}
              </div>
            </div>

            {/* Gold Rate Slides */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-bold text-lg text-white mb-1">Gold Rate Carousel Slides</h3>
              <p className="text-xs text-gray-400 mb-4">Two special slides showing live gold rates appear at the end of the hero carousel. Set override rate to 0 to show live market price.</p>

              <div className="grid sm:grid-cols-2 gap-6 mb-5">
                {/* 22K Override */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">22K Override Rate (₹/gram)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={rates.rate22k || ""}
                      onChange={(e) => setRates(prev => ({ ...prev, rate22k: Number(e.target.value) || 0 }))}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-white/10 bg-navy-800 text-white rounded-md outline-none focus:ring-2 focus:ring-gold-400 font-mono text-lg"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Leave 0 to show live API rate.</p>
                </div>

                {/* 24K Override */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">24K Override Rate (₹/gram)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={rates.rate24k || ""}
                      onChange={(e) => setRates(prev => ({ ...prev, rate24k: Number(e.target.value) || 0 }))}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-white/10 bg-navy-800 text-white rounded-md outline-none focus:ring-2 focus:ring-gold-400 font-mono text-lg"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Leave 0 to show live API rate.</p>
                </div>
              </div>

              {/* Toggles + text config */}
              <div className="space-y-5">
                {/* 22K Slide */}
                <div className="bg-navy-800 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">22K Gold Slide</h4>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs text-gray-400">Show</span>
                      <div
                        onClick={() =>
                          setRates(prev => ({
                            ...prev,
                            homeConfig: {
                              ...prev.homeConfig,
                              goldRateSlides: {
                                ...prev.homeConfig.goldRateSlides,
                                show22k: !prev.homeConfig.goldRateSlides.show22k,
                              }
                            }
                          }))
                        }
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                          rates.homeConfig.goldRateSlides.show22k ? 'bg-gold-400' : 'bg-white/20'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          rates.homeConfig.goldRateSlides.show22k ? 'left-5' : 'left-0.5'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Badge Label</label>
                      <input type="text"
                        value={rates.homeConfig.goldRateSlides.badge22k}
                        onChange={(e) => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, goldRateSlides: { ...prev.homeConfig.goldRateSlides, badge22k: e.target.value } } }))}
                        className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                        placeholder="Live Market Rate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Subheading</label>
                      <input type="text"
                        value={rates.homeConfig.goldRateSlides.sub22k}
                        onChange={(e) => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, goldRateSlides: { ...prev.homeConfig.goldRateSlides, sub22k: e.target.value } } }))}
                        className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                        placeholder="Today's 22K gold rate, updated live."
                      />
                    </div>
                  </div>
                </div>

                {/* 24K Slide */}
                <div className="bg-navy-800 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">24K Gold Slide</h4>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs text-gray-400">Show</span>
                      <div
                        onClick={() =>
                          setRates(prev => ({
                            ...prev,
                            homeConfig: {
                              ...prev.homeConfig,
                              goldRateSlides: {
                                ...prev.homeConfig.goldRateSlides,
                                show24k: !prev.homeConfig.goldRateSlides.show24k,
                              }
                            }
                          }))
                        }
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                          rates.homeConfig.goldRateSlides.show24k ? 'bg-gold-400' : 'bg-white/20'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          rates.homeConfig.goldRateSlides.show24k ? 'left-5' : 'left-0.5'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Badge Label</label>
                      <input type="text"
                        value={rates.homeConfig.goldRateSlides.badge24k}
                        onChange={(e) => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, goldRateSlides: { ...prev.homeConfig.goldRateSlides, badge24k: e.target.value } } }))}
                        className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                        placeholder="Live Market Rate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Subheading</label>
                      <input type="text"
                        value={rates.homeConfig.goldRateSlides.sub24k}
                        onChange={(e) => setRates(prev => ({ ...prev, homeConfig: { ...prev.homeConfig, goldRateSlides: { ...prev.homeConfig.goldRateSlides, sub24k: e.target.value } } }))}
                        className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                        placeholder="Today's 24K gold rate, updated live."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Brand Logo Image</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-3">
                  <input 
                    type="text"
                    value={rates.logoUrl || ""}
                    placeholder="https://example.com/logo.png"
                    onChange={(e) => setRates({...rates, logoUrl: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">or</span>
                    <label className={`flex items-center gap-2 px-4 py-2 bg-navy-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium text-gray-300 ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {uploadingLogo ? 'Uploading...' : 'Upload Local Image'}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                    </label>
                  </div>
                </div>
                {rates.logoUrl && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-md bg-navy-900 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-1">
                      <img src={rates.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                    <button onClick={() => setRates({...rates, logoUrl: ""})} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove Logo</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">Provide a direct URL or upload an image securely to Supabase. Note: Requires a public 'assets' bucket. Leave blank to use the default 'GK' badge.</p>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">Hero Carousel Management</h3>
                <button 
                  onClick={addSlide}
                  disabled={(rates.homeConfig.heroSlides || []).length >= 4}
                  className="text-xs bg-gold-400 hover:bg-gold-500 text-white px-3 py-1.5 rounded disabled:opacity-50"
                >
                  + Add Slide
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-4">Manage up to 4 slides for the homepage hero section.</p>
              
              <div className="space-y-6">
                {(rates.homeConfig.heroSlides || []).map((slide, index) => (
                  <div key={slide.id || index} className="bg-navy-800 p-4 rounded-xl border border-white/5 relative">
                    <div className="absolute top-4 right-4">
                      <button onClick={() => removeSlide(index)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase">Remove</button>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-3">Slide {index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Badge Text</label>
                          <input
                            type="text"
                            value={slide.badge || ''}
                            onChange={(e) => updateSlide(index, 'badge', e.target.value)}
                            className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                            placeholder="e.g. Artisanal Manufacturing"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">Small label shown above the heading.</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Heading</label>
                          <input 
                            type="text" 
                            value={slide.heading} 
                            onChange={(e) => updateSlide(index, 'heading', e.target.value)}
                            className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Subheading</label>
                          <textarea 
                            value={slide.subheading} 
                            onChange={(e) => updateSlide(index, 'subheading', e.target.value)}
                            rows={2}
                            className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">CTA Text</label>
                            <input 
                              type="text" 
                              value={slide.ctaText} 
                              onChange={(e) => updateSlide(index, 'ctaText', e.target.value)}
                              className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">CTA Link</label>
                            <input 
                              type="text" 
                              value={slide.ctaLink} 
                              onChange={(e) => updateSlide(index, 'ctaLink', e.target.value)}
                              className="w-full bg-navy-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Background Image</label>
                        <div className="space-y-2">
                           {slide.image ? (
                             <div className="relative h-32 rounded overflow-hidden border border-white/10">
                               <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium backdrop-blur-sm">
                                    Replace Image
                                    <input type="file" accept="image/*" onChange={(e) => handleSlideImageUpload(e, index)} className="hidden" disabled={uploadingLogo} />
                                 </label>
                               </div>
                             </div>
                           ) : (
                             <div className="h-32 bg-navy-900 rounded border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500">
                               <UploadCloud className="w-6 h-6 mb-2" />
                               <label className="cursor-pointer text-gold-400 hover:text-gold-300 text-xs font-medium">
                                  Upload Image
                                  <input type="file" accept="image/*" onChange={(e) => handleSlideImageUpload(e, index)} className="hidden" disabled={uploadingLogo} />
                               </label>
                             </div>
                           )}
                           <input 
                             type="text"
                             value={slide.image}
                             onChange={(e) => updateSlide(index, 'image', e.target.value)}
                             placeholder="Or paste image URL here..."
                             className="w-full bg-navy-900 border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(rates.homeConfig.heroSlides || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                    No slides added. Click "+ Add Slide" to get started.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving || loading || uploadingLogo}
            className="flex items-center gap-2 bg-navy-900 text-white px-6 py-2 rounded-md hover:bg-navy-800 transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update System Settings
          </button>
        </div>
      </div>
    </div>
  );
}
