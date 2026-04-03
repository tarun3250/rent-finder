import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useOwnerData } from "../hooks/useOwnerData";
import { Plus, Building2, MapPin, CheckCircle, Trash2, Upload, TrendingUp, AlertCircle, Eye, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../contexts/ToastContext";

export const OwnerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { properties, loading, refetch } = useOwnerData(profile?.id);
  const { showToast } = useToast();

  const [newProperty, setNewProperty] = useState({ title: '', price: '', location: '', bhkType: '1 BHK', amenities: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch(e) {
      console.error(e);
    }
  };

  const handleUpdateVisit = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      showToast(`Visit request ${status}`, "success");
      fetchBookings();
    } catch(e) {
      showToast("Failed to update", "error");
    }
  };

  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = uploadRes.data.url;
      }
      
      const payload = {
        title: newProperty.title,
        price: parseFloat(newProperty.price),
        location: newProperty.location,
        bhkType: newProperty.bhkType,
        amenities: newProperty.amenities,
        description: newProperty.description,
        images: imageUrl ? [{ url: imageUrl }] : []
      };

      await api.post("/properties", payload);
      setNewProperty({ title: '', price: '', location: '', bhkType: '1 BHK', amenities: '', description: '' });
      setSelectedFile(null);
      showToast("Listing published successfully!", "success");
      refetch();
    } catch (error: any) {
      showToast("Failed to create listing: " + (error.response?.data?.message || "Server Error"), "error");
    } finally {
      setUploading(false);
    }
  };

  const activeProperties = properties.length;
  const verifiedProperties = properties.filter(p => p.verified).length;
  const totalValue = properties.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-12">
        <div className="mb-10">
          <h2 className="text-4xl font-display font-black text-gray-900 tracking-tight">Owner Studio</h2>
          <p className="text-gray-500 font-medium mt-2">Manage your real estate portfolio</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-10">
          {/* Main Portfolio Pane */}
          <div className="flex-1 space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Active Listings', value: activeProperties, icon: Building2, color: 'primary' },
                { label: 'Verified Status', value: `${verifiedProperties}/${activeProperties}`, icon: CheckCircle, color: 'emerald' },
                { label: 'Portfolio Value', value: `₹${(totalValue / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'indigo' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center gap-6">
                  <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Listings Grid */}
            <div>
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-black text-gray-900">Your Properties</h3>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-[2rem]" />)}
                </div>
              ) : properties.length > 0 ? (
                <motion.div 
                  initial="hidden" animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <AnimatePresence>
                    {properties.map(p => (
                      <motion.div 
                        key={p.id}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 overflow-hidden group hover:border-primary-200 transition-all flex flex-col h-full"
                      >
                        <div className="relative h-48">
                          <img src={p.images?.[0]?.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 ${p.verified ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
                              {p.verified ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {p.verified ? 'Verified' : 'Pending Review'}
                            </span>
                          </div>
                          
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                             <div className="flex gap-2">
                               <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
                                 <Eye className="w-4 h-4" />
                               </button>
                               <button className="w-8 h-8 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center hover:bg-rose-500 transition-colors">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                             <p className="text-xl font-black font-display drop-shadow-md">₹{(p.price/1000).toFixed(1)}k</p>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-gray-900 mb-1 truncate">{p.title}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" /> {p.location}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-1">Portfolio Empty</h4>
                  <p className="text-gray-500">Create your first listing using the studio panel on the right.</p>
                </div>
              )}
            </div>

            {/* Visit Requests Feed */}
            {bookings.length > 0 && (
              <div className="pt-10">
                <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Users className="w-6 h-6 text-primary-600" /> Tenant Visit Requests</h3>
                </div>
                <div className="space-y-4">
                  {bookings.map(book => (
                    <div key={book.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center justify-between">
                       <div>
                         <p className="text-xl font-bold font-display text-gray-900">{book.property.title}</p>
                         <p className="text-sm text-gray-500 mb-2">Requested by {book.tenant?.name || 'Tenant'} • {new Date(book.createdAt).toLocaleDateString()}</p>
                         <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-lg ${
                            book.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            book.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {book.status}
                          </span>
                       </div>
                       {book.status === 'PENDING' && (
                         <div className="flex gap-2">
                           <button onClick={() => handleUpdateVisit(book.id, 'APPROVED')} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">Approve</button>
                           <button onClick={() => handleUpdateVisit(book.id, 'REJECTED')} className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-colors">Decline</button>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Persistent Creation Studio Pane */}
          <aside className="xl:w-[450px] flex-shrink-0">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 sticky top-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary-600" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 leading-tight">Create Listing</h2>
                   <p className="text-sm text-gray-500 font-medium">Publish instantly to the network</p>
                 </div>
              </div>

              <form onSubmit={handleAddPropertySubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Headline Title</label>
                  <input required value={newProperty.title} onChange={e => setNewProperty({...newProperty, title: e.target.value})} type="text" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all font-medium text-gray-900" placeholder="e.g. Skyline Luxury Villa" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Rent (₹/mo)</label>
                    <input required value={newProperty.price} onChange={e => setNewProperty({...newProperty, price: e.target.value})} type="number" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all font-medium text-gray-900" placeholder="50000" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Type</label>
                    <select required value={newProperty.bhkType} onChange={e => setNewProperty({...newProperty, bhkType: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all font-medium text-gray-900">
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                    <input required value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} type="text" className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all font-medium text-gray-900" placeholder="Area, City" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Key Amenities</label>
                  <input value={newProperty.amenities} onChange={e => setNewProperty({...newProperty, amenities: e.target.value})} type="text" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all font-medium text-gray-900" placeholder="e.g. Pool, Gym, 24/7 Power" />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cover Photo</label>
                  <label className="flex items-center justify-center w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-primary-50 hover:border-primary-300 transition-all cursor-pointer group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-primary-500" />
                      </div>
                      <span className="font-bold text-sm">{selectedFile ? selectedFile.name : "Tap to upload media"}</span>
                    </div>
                  </label>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={uploading} className="w-full px-8 py-5 bg-gray-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all outline-none focus:ring-4 focus:ring-gray-200">
                    {uploading ? "Publishing..." : "Publish to Network"}
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
