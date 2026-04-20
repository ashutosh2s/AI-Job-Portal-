import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';

function FindJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const locationState = useLocation();

    useEffect(() => {
        // Handle search query from Home page
        const queryParams = new URLSearchParams(locationState.search);
        const roleQuery = queryParams.get('role');
        const locQuery = queryParams.get('location');
        if (roleQuery) setSearchTerm(roleQuery);
        if (locQuery) setSearchLocation(locQuery);

        const fetchJobs = async () => {
            try {
                const externalRes = await axios.get("https://remotive.com/api/remote-jobs?limit=50");
                const externalJobs = externalRes.data.jobs || [];

                let localJobs = [];
                try {
                    const localRes = await axios.get(`${JOB_API_END_POINT}/get`);
                    if (localRes.data.success) {
                        localJobs = localRes.data.jobs.map(job => ({
                            id: job._id,
                            title: job.title,
                            company_name: job.companyName || "Local Employer",
                            company_logo: "https://via.placeholder.com/100?text=Local",
                            category: job.jobType || "General",
                            candidate_required_location: job.location || "Remote",
                            url: job.externalUrl || "#",
                            isLocal: true,
                            hasExternalUrl: !!job.externalUrl,
                            jobId: job._id
                        }));
                    }
                } catch (e) {
                    console.log("Failed to fetch local jobs", e);
                }

                setJobs([...localJobs, ...externalJobs]);
            } catch (error) {
                console.log("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [locationState.search]);

    const filteredJobs = jobs.filter(job => {
        const matchesRole = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = job.candidate_required_location.toLowerCase().includes(searchLocation.toLowerCase());
        const matchesCategory = selectedCategory === "All" || job.category.includes(selectedCategory);
        return matchesRole && matchesLocation && matchesCategory;
    });

    const handleApply = async (e, job) => {
        if (job.isLocal && !job.hasExternalUrl) {
            e.preventDefault();
            const user = localStorage.getItem('user');
            if (!user) {
                toast.error("Please login to apply for jobs!");
                return;
            }
            try {
                const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${job.jobId}`, {}, {
                    withCredentials: true
                });
                if (res.data.success) {
                    toast.success(res.data.message || `Successfully applied to ${job.title}!`);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to apply");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff] dark:bg-gray-950 transition-colors">
            {/* Top Search Bar (Sticky) */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-md py-4 mb-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Search Skills / Designation" 
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Location" 
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 font-medium"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 pb-20">
                
                {/* Sidebar Filter - Naukri Style */}
                <aside className="w-full lg:w-64 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-black text-lg mb-4 text-gray-800 dark:text-white">Filters</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Work Mode</label>
                                <select 
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded-lg outline-none font-bold text-sm"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Software">Software</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Quick Links</p>
                                <button onClick={() => {setSearchTerm(""); setSearchLocation("");}} className="text-blue-600 text-sm font-bold hover:underline">Reset Filters</button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Job Listings Column */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center pt-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-bold">Scanning job boards...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mb-4 text-gray-500 font-bold">Showing {filteredJobs.length} jobs</div>
                            {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                <div key={job.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                            <img src={job.company_logo} alt="logo" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition tracking-tight">{job.title}</h2>
                                            <p className="font-bold text-gray-600 dark:text-gray-400">{job.company_name}</p>
                                            <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <span className="flex items-center gap-1">📍 {job.candidate_required_location}</span>
                                                <span className="flex items-center gap-1">💼 {job.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full md:w-auto">
                                        <a 
                                            href={job.url} 
                                            target={(job.hasExternalUrl || !job.isLocal) ? "_blank" : "_self"} 
                                            rel="noreferrer" 
                                            onClick={(e) => handleApply(e, job)}
                                            className="block w-full text-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-black py-3 px-8 rounded-xl hover:bg-blue-600 hover:text-white transition"
                                        >
                                            {(job.hasExternalUrl || !job.isLocal) ? "Apply Now" : "Quick Apply"}
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 text-gray-400 font-black text-2xl">No jobs matching your search criteria.</div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default FindJobs;

