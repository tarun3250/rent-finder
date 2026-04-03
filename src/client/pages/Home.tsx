import React from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, Zap, MapPin, ArrowRight, Star, Heart, Building2, Users, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl lg:text-8xl font-display font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                Find your next <span className="text-primary-600 italic">perfect</span> stay.
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience a smarter way to rent. Verified listings, AI-powered matching, and seamless property management.
              </p>
            </motion.div>

            {/* Centered Search Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-2 rounded-[2rem] shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-6 py-4">
                <Search className="w-5 h-5 text-primary-500" />
                <input 
                  type="text" 
                  placeholder="Where do you want to live?" 
                  className="bg-transparent border-none focus:ring-0 w-full text-lg font-medium placeholder:text-gray-400"
                />
              </div>
              <div className="h-12 w-px bg-gray-200 hidden md:block self-center"></div>
              <div className="flex-1 flex items-center gap-3 px-6 py-4">
                <MapPin className="w-5 h-5 text-primary-500" />
                <select className="bg-transparent border-none focus:ring-0 w-full text-lg font-medium text-gray-600 appearance-none">
                  <option>Any Location</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                  <option>Delhi</option>
                </select>
              </div>
              <button className="bg-primary-600 text-white px-10 py-4 rounded-[1.5rem] font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                Search
              </button>
            </motion.div>

            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['1 BHK', '2 BHK', '3 BHK', 'Villa', 'Studio'].map((tag) => (
                <button key={tag} className="px-5 py-2 bg-white border border-gray-100 rounded-full text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-all soft-shadow">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse delay-700"></div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Listings</h2>
            <p className="text-gray-500">Handpicked properties for exceptional living.</p>
          </div>
          <Link to="/search" className="text-primary-600 font-bold flex items-center gap-2 group">
            View all properties <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <FeaturedCard key={i} id={i.toString()} />
          ))}
        </div>
      </section>

      {/* Assisted Listing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-bold mb-8">
                <Star className="w-4 h-4 fill-primary-400" />
                FOR PROPERTY OWNERS
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                List your property <br />
                <span className="text-primary-400 italic">without the stress.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Can't find time to manage your listing? Our professional agents will visit, verify, and handle everything for you.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-primary-50 transition-all"
              >
                Request Assistance <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StatBox value="500+" label="Verified Listings" />
              <StatBox value="24h" label="Fast Verification" />
              <StatBox value="98%" label="Happy Owners" />
              <StatBox value="10k+" label="Active Tenants" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeaturedCard: React.FC<{ id: string }> = ({ id }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="premium-card group overflow-hidden"
  >
    <div className="relative h-72 overflow-hidden">
      <img
        src={`https://images.unsplash.com/photo-${id === '1' ? '1560518883-ce09059eeffa' : id === '2' ? '1512917774080-9991f1c4c750' : '1522708323590-d24dbb6b0267'}?auto=format&fit=crop&w=800&q=80`}
        alt="Property"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-primary-600" /> Verified
        </span>
        <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
          Featured
        </span>
      </div>
      <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all">
        <Heart className="w-5 h-5" />
      </button>
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">Modern Urban Penthouse</h3>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Bandra West, Mumbai
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600 leading-none">₹85k</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">per month</p>
        </div>
      </div>
      <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Zap className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium">3 BHK</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">4.9</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
    <h4 className="text-4xl font-bold mb-2">{value}</h4>
    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{label}</p>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);
