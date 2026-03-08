import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, GraduationCap, Mail, Phone,
    Calendar, User, Briefcase, Filter, MapPin, Award
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const DepartmentDetails = () => {
    const { deptName } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('department', deptName);
            if (selectedYear !== 'All') {
                const yearMap = { '1st Year': '1', '2nd Year': '2', '3rd Year': '3', '4th Year': '4' };
                params.append('year', yearMap[selectedYear] || selectedYear);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/students?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/teachers?department=${encodeURIComponent(deptName)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTeachers(data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudents();
        } else {
            fetchTeachers();
        }
    }, [deptName, selectedYear, activeTab]);

    const displayData = activeTab === 'students' ? students : teachers;
    const filteredData = displayData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.enrollmentNo && item.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.employeeId && item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-90"
                    >
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider rounded-full">
                                {activeTab} Directory
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mt-1 tracking-tight">
                            {deptName} <span className="text-gray-400 font-medium font-serif italic block md:inline">Faculty</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-100 shadow-inner">
                    {['students', 'teachers'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-white text-green-600 shadow-lg'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-active"
                                    className="absolute inset-0 bg-white rounded-xl -z-10 shadow-md"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/20 flex flex-col lg:flex-row gap-6 justify-between items-center px-6">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {activeTab === 'students' ? (
                        <div className="flex flex-wrap gap-2">
                            <div className="p-2 bg-gray-50 rounded-xl mr-2">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedYear === year
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500 px-2 lg:border-r border-gray-100 pr-6">
                            <Award size={20} className="text-purple-500" />
                            Registered Faculty Members
                        </div>
                    )}
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab} by name or ID...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white transition-all text-gray-900 font-semibold"
                    />
                </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-32 space-y-4"
                    >
                        <div className="w-16 h-16 border-8 border-green-50 border-t-green-600 rounded-full animate-spin" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm animate-pulse">Syncing directory...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredData.length === 0 ? (
                            <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                                <div className="mx-auto w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center mb-6">
                                    {activeTab === 'students' ? <GraduationCap size={48} className="text-gray-200" /> : <User size={48} className="text-gray-200" />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No records found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            filteredData.map(item => (
                                <motion.div
                                    key={item.id}
                                    variants={cardVariants}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-white rounded-[2.5rem] border border-gray-100 p-2 shadow-sm hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-300 group"
                                >
                                    <div className="bg-gray-50/50 rounded-[2rem] p-6 h-full border border-gray-50/50 transition-colors group-hover:bg-white group-hover:border-green-100">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="relative">
                                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl shadow-lg transform -rotate-3 transition-transform group-hover:rotate-6 ${activeTab === 'students'
                                                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-100'
                                                    : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-100'
                                                    }`}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md border border-gray-50">
                                                    {activeTab === 'students' ? <GraduationCap size={16} className="text-green-600" /> : <User size={16} className="text-purple-600" />}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${activeTab === 'students' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                                                    }`}>
                                                    {activeTab === 'students' ? `SY: ${item.year}` : 'Senior Staff'}
                                                </span>
                                                <span className="text-[10px] text-gray-300 font-mono tracking-tighter">
                                                    ID: {item.enrollmentNo || item.employeeId || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {activeTab === 'students' ? 'Current Scholar' : item.designation}
                                        </p>

                                        <div className="mt-8 space-y-3">
                                            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl group-hover:bg-gray-50/50 transition-colors">
                                                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Mail size={16} />
                                                </div>
                                                <a href={`mailto:${item.email}`} className="text-sm font-bold text-gray-600 truncate hover:text-green-600">
                                                    {item.email}
                                                </a>
                                            </div>

                                            {activeTab === 'students' ? (
                                                <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl group-hover:bg-gray-50/50 transition-colors">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-600">
                                                        Semester {item.semester} <span className="text-gray-300 px-2">|</span> Section {item.section || 'Unassigned'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4 p-3 bg-white/50 rounded-2xl group-hover:bg-gray-50/50 transition-colors">
                                                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <Award size={16} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-600">
                                                        {item.qualification} <span className="text-gray-300 px-2">|</span> {item.experience} Yrs exp
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/admin/users/${item.id}`)}
                                            className={`w-full mt-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${activeTab === 'students'
                                                ? 'bg-green-600 text-white shadow-green-100 hover:bg-green-700'
                                                : 'bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700'
                                                }`}
                                        >
                                            View Academic Profile
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DepartmentDetails;
