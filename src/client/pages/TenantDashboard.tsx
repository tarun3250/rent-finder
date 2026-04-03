import React, { useState, useMemo } from "react";
import { useProperties, useRecommendations } from "../hooks/useProperties";
import { useAuth } from "../contexts/AuthContext";
import { Search, MapPin, Star, Zap, ShieldCheck, Home, Filter, SlidersHorizontal, Map as MapIcon, ChevronDown, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../contexts/ToastContext";

export const TenantDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState(150000);
  const [bhk, setBhk] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'bookings'>('discover');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await import('../api/api').then(m => m.default.get('/bookings/my-bookings'));
      setBookings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleBook = async (propertyId: string) => {
    try {
      await import('../api/api').then(m => m.default.post(`/bookings/${propertyId}`));
      showToast("Visit scheduled successfully! Owner has been notified.", "success");
    } catch (e: any) {
      showToast("Booking failed: " + (e.response?.data?.message || e.message), "error");
    }
  };

  const { properties, loading, refetch } = useProperties({
    budget,
    location: searchQuery,
    bhk
  });

  const { recommendations } = useRecommendations(profile);

  // Compute filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchLoc = p.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBud = p.price <= budget;
      const matchBhk = bhk ? p.bhkType === bhk : true;
      return matchLoc && matchBud && matchBhk;
    });
  }, [properties, searchQuery, budget, bhk]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-12">
        {/* Navigation / Tab Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-3xl soft-shadow mb-8 z-20 relative">
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('discover')}
              className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'discover' 
                ? "bg-primary-600 text-white shadow-xl shadow-primary-200" 
                : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Search className="w-5 h-5" /> Explore Spaces
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'bookings' 
                ? "bg-primary-600 text-white shadow-xl shadow-primary-200" 
                : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5" /> My Visits
            </button>
          </div>
          
          {activeTab === 'discover' && (
            <div className="mt-4 md:mt-0 flex items-center gap-4 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-1"><MapIcon className="w-4 h-4" /> Map View Unavailable</span>
            </div>
          )}
        </div>

        {activeTab === 'bookings' ? (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-4xl font-display font-black text-gray-900 mb-8 tracking-tight">Your Scheduled Visits</h3>
            {loadingBookings ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map(book => (
                  <div key={book.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center justify-between group hover:border-primary-200 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0">
                         <img src={book.property.images?.[0]?.imageUrl || `https://picsum.photos/seed/${book.property.id}/400/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt=""/>
                       </div>
                       <div>
                          <h4 className="text-2xl font-bold font-display text-gray-900 mb-2">{book.property.title}</h4>
                          <p className="text-gray-500 flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-primary-500"/> {book.property.location}</p>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{book.property.bhkType}</span>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm ${
                        book.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        book.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {book.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-4 font-bold uppercase tracking-widest">Requested {new Date(book.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white border border-gray-100 rounded-[3rem] shadow-xl shadow-gray-200/50">
                 <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="w-10 h-10 text-gray-300" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900">No visit requests yet</h3>
                 <p className="text-gray-500 mt-2">Start discovering properties to schedule viewings!</p>
              </div>
            )}
          </motion.section>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Massive OLX-Style Sticky Filter Sidebar */}
            <aside className="xl:w-[380px] flex-shrink-0">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 sticky top-8 border border-gray-100 z-10">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                  <SlidersHorizontal className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                </div>
                
                <div className="space-y-10">
                  {/* Search Input */}
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-900 flex justify-between">
                      Location / Keywords <span className="text-gray-400 font-normal">Any</span>
                    </label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="e.g. Koramangala or Penthouse"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary-500 focus:bg-white transition-all text-gray-900 font-medium placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="space-y-6">
                   <label className="text-sm font-black text-gray-900 flex justify-between">
                      Maximum Rent <span className="text-primary-600">₹{budget.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="300000"
                      step="5000"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-500 transition-all"
                    />
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>₹5k</span>
                      <span>₹150k</span>
                      <span>₹300k+</span>
                    </div>
                  </div>

                  {/* BHK Pills */}
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-900">Property Configuration</label>
                    <div className="flex flex-wrap gap-3">
                      {['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Villa', 'Studio'].map(n => (
                        <button
                          key={n}
                          onClick={() => setBhk(bhk === n ? null : n)}
                          className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                            bhk === n 
                            ? "bg-primary-50 border-primary-600 text-primary-700 shadow-sm" 
                            : "bg-white border-slate-100 text-slate-600 hover:border-primary-200 hover:bg-slate-50"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities (Mocked expansion) */}
                  <div className="pt-6 border-t border-gray-100">
                     <button className="flex items-center justify-between w-full text-sm font-black text-gray-900">
                       More Amenities <ChevronDown className="w-5 h-5 text-gray-400" />
                     </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Feed */}
            <div className="flex-1 min-w-0">
              
              {/* Hot Recommendations */}
              <AnimatePresence>
                {recommendations.length > 0 && searchQuery === "" && (
                  <motion.section 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-12"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Flame className="w-6 h-6 text-rose-500" />
                      <h3 className="text-2xl font-black text-gray-900">Hot Matches For You</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.slice(0,3).map((p) => (
                        <PremiumCard key={`rec-${p.id}`} property={p} isRecommended onBook={() => handleBook(p.id)} />
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Feed Header */}
              <div className="flex justify-between items-end mb-8 mt-4">
                <div>
                  <h1 className="text-4xl font-display font-black text-gray-900 tracking-tight">Available Homes</h1>
                  <p className="text-gray-500 font-medium mt-2">Showing {filteredProperties.length} stunning properties</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-500">
                  Sort by: <span className="text-gray-900 border-b border-gray-900 pb-0.5 cursor-pointer">Relevance</span>
                </div>
              </div>

              {/* Results Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[480px] bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-4">
                       <div className="w-full h-64 bg-slate-100 rounded-[1.5rem] animate-pulse mb-6" />
                       <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4 animate-pulse" />
                       <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8"
                >
                  {filteredProperties.map((p) => (
                    <motion.div key={p.id} variants={cardVariants}>
                      <PremiumCard property={p} onBook={() => handleBook(p.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 m-4"
                >
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10 text-slate-300" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">No exact matches</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">We couldn't find properties matching your exact filters. Try broadening your budget or location.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setBudget(300000); setBhk(null);}}
                    className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted Premium Card for OLX-Killer vibe
const PremiumCard: React.FC<{ property: any; isRecommended?: boolean; onBook: () => void }> = ({ property, isRecommended, onBook }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2">
      <div className="relative h-64 p-3">
        <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
          <img
            src={property.images?.[0]?.imageUrl || `https://picsum.photos/seed/${property.id}/600/400`}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified
            </span>
          </div>

          {isRecommended && (
            <div className="absolute top-4 right-4">
               <span className="px-3 py-1.5 bg-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center gap-1">
                 <Flame className="w-4 h-4" /> Hot
               </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div className="text-white drop-shadow-md">
                <p className="text-2xl font-black font-display leading-none">₹{(property.price / 1000).toFixed(1)}k <span className="text-sm font-medium text-white/80">/mo</span></p>
             </div>
             <button className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all">
                <Heart className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-bold font-display text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{property.title}</h4>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mb-6">
            <MapPin className="w-4 h-4 text-gray-400" /> {property.location}
          </p>
          
          <div className="flex items-center gap-4 py-4 border-y border-gray-50 mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Config</span>
              <span className="text-sm font-bold flex items-center gap-1 text-gray-900"><Zap className="w-4 h-4 text-amber-500" /> {property.bhkType}</span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Rating</span>
              <span className="text-sm font-bold flex items-center gap-1 text-gray-900"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.8</span>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onBook(); }}
          className="w-full py-4 bg-gray-900 hover:bg-primary-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
        >
          Schedule Visit
        </button>
      </div>
    </div>
  );
};
