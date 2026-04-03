import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useOwnerData } from "../hooks/useOwnerData";
import { Plus, Zap, Building2, MapPin, Clock, CheckCircle, ChevronRight, Edit, Trash2 } from "lucide-react";
import { motion } from "motion/react";

export const OwnerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');

  const { properties, requests, loading, refetch } = useOwnerData(profile?.id);

  const handleRequestAssistance = async () => {
    try {
      await api.post("/requests", {
        address: "New Property Address",
        contactInfo: profile?.email
      });
      refetch();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">Owner Dashboard</h2>
          <p className="text-gray-500">Manage your properties and listing requests</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white border border-gray-100 text-gray-900 font-bold rounded-2xl soft-shadow hover:border-primary-200 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Manually
          </button>
          <button 
            onClick={handleRequestAssistance}
            className="px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center gap-2"
          >
            <Zap className="w-5 h-5" /> Request Assistance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: 'Total Listings', value: properties.length, icon: Building2, color: 'primary' },
          { label: 'Pending Requests', value: requests.filter(r => r.status !== 'COMPLETED').length, icon: Clock, color: 'yellow' },
          { label: 'Active Tenants', value: 0, icon: CheckCircle, color: 'green' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 soft-shadow flex items-center gap-6">
            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-8 border-b border-gray-100 mb-10">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'listings' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          My Listings ({properties.length})
          {activeTab === 'listings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'requests' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Assistance Requests ({requests.length})
          {activeTab === 'requests' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : activeTab === 'listings' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(p => (
            <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden soft-shadow group">
              <div className="relative h-48">
                <img src={p.images?.[0]?.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700`}>
                    {p.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" /> {p.location}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-lg font-bold text-primary-600">₹{parseFloat(p.price).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No properties listed yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 soft-shadow flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{r.address}</h4>
                  <p className="text-sm text-gray-500">Requested on {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    r.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                    r.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No assistance requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
