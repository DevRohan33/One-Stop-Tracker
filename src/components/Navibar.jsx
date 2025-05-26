import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronDown,
  Home,
  Info
} from 'lucide-react';
import { supabase } from '../lib/superbaseClient';

const Navbar = ({ parameters = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(window.location.pathname);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for existing session when component mounts
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || 'User'
        });
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || 'User'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: Home,
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: Info,
    },
  ];

  const profileMenuItems = [
    { name: 'Your Profile', href: '#', icon: User },
    { name: 'Settings', href: '#', icon: Settings },
    { 
      name: 'Sign out', 
      href: '#', 
      icon: LogOut,
      onClick: async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }
    },
  ];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = parameters.filter(param => 
        param.name.toLowerCase().includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (paramId) => {
    navigate(`/parameter-chart/${paramId}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className={`fixed inset-0 bg-black/20 transition-opacity duration-300 z-40 ${
        (isOpen || isSearchFocused) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      } lg:hidden`} onClick={() => {
        setIsOpen(false);
        setIsSearchFocused(false);
      }} />
      
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/10 backdrop-blur-md border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-white font-bold text-2xl">
                  UniTrax
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === item.href
                          ? 'text-white bg-white/10' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search parameters..."
                    className="w-64 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  <Search className="absolute right-3 w-5 h-5 text-gray-300" />
                </div>
                
                {/* Search Results Dropdown */}
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute mt-1 w-full bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 max-h-96 overflow-y-auto">
                    {searchResults.map(param => (
                      <div
                        key={param.id}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex justify-between items-center"
                        onClick={() => handleResultClick(param.id)}
                      >
                        <div>
                          <p className="text-white font-medium">{param.name}</p>
                          <p className="text-gray-400 text-sm">{param.unit}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Search Button */}
              <button 
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                onClick={() => setIsSearchFocused(true)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile Dropdown - Hidden on mobile */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ${
                  isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">{user?.name || 'User'}</div>
                        <div className="text-sm opacity-90">{user?.email || 'Loading...'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={item.onClick}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 bg-gray-800 border-t border-gray-700">
            {/* User Info in Mobile Menu */}
            {user && (
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-xs text-gray-300">{user.email}</div>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      activeTab === item.href
                        ? 'text-white bg-gray-700' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Profile Links */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      if (item.onClick) item.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div className={`lg:hidden fixed inset-0 bg-gray-900/95 z-50 transition-all duration-300 flex flex-col ${
          isSearchFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="p-4 flex items-center">
            <button 
              className="mr-2 text-white"
              onClick={() => setIsSearchFocused(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search parameters..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Mobile Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery.length > 0 ? (
              searchResults.length > 0 ? (
                searchResults.map(param => (
                  <div
                    key={param.id}
                    className="px-4 py-3 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => handleResultClick(param.id)}
                  >
                    <p className="text-white font-medium">{param.name}</p>
                    <p className="text-gray-400 text-sm">{param.unit}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No results found for "{searchQuery}"
                </div>
              )
            ) : (
              <div className="text-center text-gray-400 py-8">
                Search for parameters by name
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;