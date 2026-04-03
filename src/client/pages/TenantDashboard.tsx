import React, { useState } from "react";
import { useProperties, useRecommendations } from "../hooks/useProperties";
import { useAuth } from "../contexts/AuthContext";
import { Search, MapPin, Star, Heart, Zap, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
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
      showToast("Booking Request Sent Successfully!", "success");
    } catch (e: any) {
      showToast("Failed to book: " + (e.response?.data?.message || e.message), "error");
    }
  };

  const { properties, loading, refetch } = useProperties({
    budget,
    location: searchQuery,
    bhk
  });

  const { recommendations, loading: recLoading } = useRecommendations(profile);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = p.price <= budget;
    const matchesBhk = bhk ? p.bhkType === bhk : true;
    return matchesSearch && matchesBudget && matchesBhk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-80 space-y-10">
          <div className="sticky top-32">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Filters</h2>
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveTab('discover')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-xl border ${
                  activeTab === 'discover' ? "bg-primary-600 text-white shadow-lg shadow-primary-200 border-primary-600" : "bg-white text-gray-500 hover:border-primary-200"
                }`}
              >
                Discover
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-xl border ${
                  activeTab === 'bookings' ? "bg-primary-600 text-white shadow-lg shadow-primary-200 border-primary-600" : "bg-white text-gray-500 hover:border-primary-200"
                }`}
              >
                My Visits
              </button>
            </div>
            
            {activeTab === 'discover' && (
            <div className="space-y-8">
              {/* Search */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Area, building..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 soft-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Budget</label>
                  <span className="text-lg font-bold text-primary-600">₹{budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>

              {/* BHK */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['1 BHK', '2 BHK', '3 BHK', 'Villa'].map(n => (
                    <button
                      key={n}
                      onClick={() => setBhk(bhk === n ? null : n)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        bhk === n 
                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100" 
                        : "bg-white border-gray-100 text-gray-600 hover:border-primary-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-16">
          {activeTab === 'bookings' ? (
            <section>
              <h3 className="text-3xl font-display font-bold text-gray-900 mb-10">My Visit Requests</h3>
              {loadingBookings ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-gray-50 rounded-[2.5rem] animate-pulse" />)}
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map(book => (
                    <div key={book.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 soft-shadow flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <img src={book.property.images?.[0]?.imageUrl || `https://picsum.photos/seed/${book.property.id}/200/200`} className="w-24 h-24 rounded-2xl object-cover" alt=""/>
                         <div>
                            <h4 className="text-xl font-bold font-display text-gray-900 mb-1">{book.property.title}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4"/> {book.property.location}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                          book.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          book.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {book.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-3 font-bold uppercase tracking-widest">Requested {new Date(book.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white border border-gray-100 rounded-[2.5rem]">
                   <p className="text-gray-500 font-medium">No visit requests yet. Start discovering properties!</p>
                </div>
              )}
            </section>
          ) : (
            <>
          {/* Recommendations Banner */}
          {recommendations.length > 0 && (
            <section className="bg-primary-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Top Matches for You</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((p) => (
                    <PropertyCard key={p.id} property={p} isRecommended dark onBook={() => handleBook(p.id)} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Results Grid */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-display font-bold text-gray-900">
                {filteredProperties.length} Properties <span className="text-gray-400 font-normal text-xl ml-2">found</span>
              </h3>
              <button onClick={() => refetch()} className="text-primary-600 font-bold">Refresh</button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} onBook={() => handleBook(p.id)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">No properties found</h4>
                <p className="text-gray-500">Try adjusting your filters or search area.</p>
              </div>
            )}
          </section>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{ property: any; isRecommended?: boolean; dark?: boolean; onBook?: () => void }> = ({ property, isRecommended, dark, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`rounded-[2.5rem] overflow-hidden transition-all duration-300 ${
        dark 
        ? "bg-white/10 backdrop-blur-md border border-white/20 text-white" 
        : "bg-white border border-gray-100 soft-shadow hover:shadow-2xl"
      }`}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images?.[0]?.imageUrl || `https://picsum.photos/seed/${property.id}/600/400`}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-primary-600" /> Verified
          </span>
          {isRecommended && (
            <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              {property.matchScore}% Match
            </span>
          )}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onBook?.(); }}
          className={`absolute top-5 right-5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${
          dark ? "bg-white text-primary-600 hover:bg-gray-100 shadow-xl" : "bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-primary-300"
        }`}>
          Schedule Visit
        </button>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h4 className={`text-xl font-bold truncate mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{property.title}</h4>
            <p className={`text-sm flex items-center gap-1 ${dark ? "text-primary-200" : "text-gray-500"}`}>
              <MapPin className="w-4 h-4" /> {property.location}
            </p>
          </div>
          <div className="text-right ml-4">
            <p className={`text-2xl font-bold leading-none ${dark ? "text-white" : "text-primary-600"}`}>₹{(property.price / 1000).toFixed(1)}k</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${dark ? "text-primary-300" : "text-gray-400"}`}>per month</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-6 pt-6 border-t ${dark ? "border-white/10" : "border-gray-50"}`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${dark ? "text-primary-300" : "text-primary-400"}`} />
            <span className="text-sm font-bold">{property.bhkType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold">4.8</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
