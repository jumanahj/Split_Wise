import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AnimatedBackground from '../components/AnimatedBackground';
import { HomeIcon, GroupIcon, ProfileIcon, LogoutIcon } from '../components/Icons';

const navItems = [
    { path: '/', name: 'Home', icon: <HomeIcon /> },
    { path: '/groups', name: 'Groups', icon: <GroupIcon /> },
    { path: '/profile', name: 'Profile', icon: <ProfileIcon /> },
];

const Navbar: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="font-bold text-xl">SplitSphere</span>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map(item => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <span className="text-gray-300 mr-4">Hi, {user?.name}</span>
                            <button onClick={handleLogout} title="Logout" className="p-2 rounded-full text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <LogoutIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const MobileBottomNav: React.FC = () => {
    const { logout } = useAuth();
    return (
         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/50 backdrop-blur-lg border-t border-white/10 z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                     <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `flex flex-col items-center justify-center w-full transition-colors ${isActive ? 'text-purple-400' : 'text-gray-400'}`}
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.name}</span>
                    </NavLink>
                ))}
                <button onClick={logout} className="flex flex-col items-center justify-center w-full text-gray-400">
                    <LogoutIcon />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
         </div>
    );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen">
            <AnimatedBackground />
            <div className="relative z-10">
                <Navbar />
                <main className="max-w-7xl mx-auto pb-20 md:pb-0">
                    {children}
                </main>
                <MobileBottomNav />
            </div>
        </div>
    );
};

export default MainLayout;