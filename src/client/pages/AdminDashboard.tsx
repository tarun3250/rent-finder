import React, { useState } from "react";
import api from "../api/api";
import { useAdminData } from "../hooks/useAdminData";
import { CheckCircle, XCircle, Clock, Users, Building2, TrendingUp, MapPin } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'properties'>('requests');

  const { requests, properties, stats, loading, refetch } = useAdminData();

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    try {
      await api.put(`/requests/${requestId}/status`, { status: newStatus });
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    try {
      await api.post(`/requests/${requestId}/complete`, {
        title: "Verified Property from Request",
        description: "Professionally verified and listed by Admin",
        price: 50000,
        location: "Mumbai",
        bhkType: "2 BHK",
        amenities: JSON.stringify(["Parking", "Security"])
      });
      refetch();
    } catch (error) {
      console.error("Error completing request:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">Admin Console</h2>
        <p className="text-gray-500">Manage platform operations and listing requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Pending Requests', value: requests.filter(r => r.status === 'PENDING').length, icon: Clock, color: 'yellow' },
          { label: 'Total Properties', value: properties.length, icon: Building2, color: 'primary' },
          { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'green' },
          { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'indigo' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 soft-shadow">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-8 border-b border-gray-100 mb-8">
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'requests' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Listing Requests
        </button>
        <button 
          onClick={() => setActiveTab('properties')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'properties' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          All Properties
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : activeTab === 'requests' ? (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 soft-shadow flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{req.address}</h4>
                  <p className="text-sm text-gray-500">Owner: {req.owner?.name} ({req.owner?.email})</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  req.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                  req.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {req.status}
                </span>
                {req.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'IN_PROGRESS')}
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                      title="Assign Agent"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      title="Reject Request"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {req.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => handleCompleteRequest(req.id)}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Complete & List
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map(prop => (
            <div key={prop.id} className="bg-white p-6 rounded-3xl border border-gray-100 soft-shadow flex items-center gap-6">
              <img src={prop.images?.[0]?.imageUrl || `https://picsum.photos/seed/${prop.id}/200/200`} className="w-24 h-24 rounded-2xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{prop.title}</h4>
                <p className="text-sm text-gray-500">{prop.location}</p>
                <p className="text-primary-600 font-bold mt-1">₹{parseFloat(prop.price).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${prop.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {prop.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
