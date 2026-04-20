import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import { USER_API_END_POINT } from '../utils/constant';

function Navbar() {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });
            if (res.data.success) {
                localStorage.removeItem("user");
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-all shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/home" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                        J
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                        Job<span className="text-blue-600">Portal</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-10 font-bold text-[13px] text-gray-500 dark:text-gray-400">
                    <Link to="/home" className="hover:text-blue-600 transition tracking-wide uppercase">Home</Link>
                    <Link to="/find-jobs" className="hover:text-blue-600 transition tracking-wide uppercase">Find Jobs</Link>
                    {user?.role === 'recruiter' && (
                        <>
                            <Link to="/post-job" className="hover:text-blue-600 transition tracking-wide uppercase">Post Jobs</Link>
                            <Link to="/admin" className="hover:text-blue-600 transition tracking-wide uppercase">Admin Hub</Link>
                        </>
                    )}
                    <Link to="/ai-analyzer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition tracking-wide uppercase">
                        <span>AI Specialist</span>
                        <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">NEW</span>
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="hidden sm:block text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition">
                                My Profile
                            </Link>
                            <button 
                                onClick={logoutHandler}
                                className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold px-6 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition text-sm shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-gray-500 hover:text-blue-600 font-bold text-sm px-4 py-2 transition">Login</Link>
                            <Link to="/" className="bg-blue-600 text-white font-bold px-7 py-3 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none text-sm tracking-tight">
                                Register Now
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
