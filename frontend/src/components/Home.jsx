import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState({ role: "", location: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/find-jobs?role=${search.role}&location=${search.location}`);
    };

    const categories = [
        { name: "Remote", icon: "🌐", count: "2.4k+" },
        { name: "MNC", icon: "🏢", count: "1.8k+" },
        { name: "Software", icon: "💻", count: "5.2k+" },
        { name: "Marketing", icon: "📈", count: "1.2k+" },
        { name: "Data Science", icon: "📊", count: "900+" },
        { name: "Banking", icon: "🏦", count: "600+" },
    ];

    return (
        <main className="min-h-screen bg-[#f8f9ff] dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
            
            {/* Hero Section - Naukri Style */}
            <div className="bg-white dark:bg-gray-900 pt-20 pb-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Find your dream job <span className="text-blue-600">now</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 font-medium">
                        5 lakh+ jobs for you to explore
                    </p>

                    {/* Advanced Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-gray-100 dark:border-gray-700">
                        <div className="flex-1 flex items-center px-6 gap-3 w-full border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                            <span className="text-xl">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Enter skills / designations / companies" 
                                className="w-full py-4 bg-transparent outline-none font-medium placeholder:text-gray-400"
                                value={search.role}
                                onChange={(e) => setSearch({ ...search, role: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-6 gap-3 w-full">
                            <span className="text-xl">📍</span>
                            <input 
                                type="text" 
                                placeholder="Enter location" 
                                className="w-full py-4 bg-transparent outline-none font-medium placeholder:text-gray-400"
                                value={search.location}
                                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg whitespace-nowrap">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Popular Categories */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">Trending on <span className="text-blue-600">JobPortal</span></h2>
                    <Link to="/find-jobs" className="text-blue-600 font-bold hover:underline">View All ➔</Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-blue-200 transition cursor-pointer text-center group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{cat.name}</h3>
                            <p className="text-xs text-gray-400 font-bold">{cat.count} Jobs</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Call to Action */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 text-white">
                        <h2 className="text-3xl font-black mb-4">Let AI build your <br/> next career move.</h2>
                        <p className="text-blue-100 font-medium mb-8 max-w-sm">Get an ATS score and personalized job recommendations using our Gemini AI engine.</p>
                        <Link to="/ai-analyzer" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-black hover:bg-blue-50 transition shadow-xl">
                            Try AI Analyzer ✨
                        </Link>
                    </div>
                    <div className="mt-10 md:mt-0 flex items-center gap-4 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                            <div className="text-center font-black text-4xl mb-2">98%</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold">Matching Accuracy</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Companies Section */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <h2 className="text-2xl font-black mb-8 text-gray-800 dark:text-white">Top Companies Hiring</h2>
                <div className="flex flex-wrap gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-8" alt="Google" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-8" alt="Microsoft" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-8" alt="Amazon" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-8" alt="IBM" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" className="h-8" alt="Netflix" />
                </div>
            </section>

        </main>
    );
}

export default Home;

