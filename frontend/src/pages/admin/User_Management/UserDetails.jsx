import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, User, Mail, Phone, MapPin, Calendar,
    BookOpen, Briefcase, GraduationCap, Shield,
    Award, Clock, Building, Bookmark, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setError('User profile not found');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchUserData();
        }
    }, [id, token]);

    const getRoleStyles = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return { gradient: 'from-purple-600 to-indigo-700', icon: <Shield size={24} />, bg: 'bg-purple-50', text: 'text-purple-600', label: 'Administrator' };
            case 'teacher': return { gradient: 'from-blue-600 to-cyan-700', icon: <Briefcase size={24} />, bg: 'bg-blue-50', text: 'text-blue-600', label: 'Faculty Member' };
            case 'student': return { gradient: 'from-green-600 to-emerald-700', icon: <GraduationCap size={24} />, bg: 'bg-green-50', text: 'text-green-600', label: 'Current Scholar' };
            default: return { gradient: 'from-gray-600 to-gray-700', icon: <User size={24} />, bg: 'bg-gray-50', text: 'text-gray-600', label: 'User' };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-16 h-16 border-8 border-gray-100 border-t-green-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">Retriving Academic Profile...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center"
            >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Profile Not Found</h2>
                <p className="text-gray-500 mb-8">{error || "The user you're looking for doesn't exist or was removed."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                >
                    Return to Directory
                </button>
            </motion.div>
        );
    }

    const styles = getRoleStyles(user.role);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto pb-20 px-4 pt-4"
        >
            {/* Header / Nav */}
            <div className="flex items-center gap-6 mb-10">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                    <ArrowLeft size={24} className="text-gray-900" />
                </motion.button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Academic Profile</h1>
                    <p className="text-gray-500 font-medium">Detailed overview for {user.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Essential Card */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative"
                    >
                        <div className={`h-40 bg-gradient-to-br ${styles.gradient} relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                        </div>
                        <div className="px-8 pb-10 relative">
                            <div className="w-32 h-32 rounded-[2rem] border-8 border-white bg-white absolute -top-16 shadow-2xl flex items-center justify-center overflow-hidden z-20">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full ${styles.bg} ${styles.text} flex items-center justify-center font-black text-4xl`}>
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="pt-24">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${styles.bg} ${styles.text} border border-current/10 shadow-sm`}>
                                        {styles.label}
                                    </span>
                                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                                        ID: {user.enrollmentNo || user.employeeId || `UID${user.id}`}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-extrabold text-gray-900 leading-[1.1] mb-2 tracking-tight">
                                    {user.name}
                                </h2>
                                <p className="text-lg text-gray-500 font-semibold">{user.department} Department</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                            <p className="font-bold text-gray-700 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Number</p>
                                            <p className="font-bold text-gray-700">{user.phone || 'Not Shared'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permanent Location</p>
                                            <p className="font-bold text-gray-700 line-clamp-1">{user.address || 'Confidential'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Detailed Info Tags */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Academic Records */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Bookmark size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Academic & Professional</h3>
                            </div>
                            <ExternalLink size={20} className="text-gray-300" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {user.role?.toLowerCase() === 'student' ? (
                                <>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Current Year</p>
                                        <p className="text-xl font-black text-gray-900 italic font-serif ">{user.year} Year / Sem {user.semester}</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Enrollment ID</p>
                                        <p className="text-xl font-black text-gray-900">{user.enrollmentNo || 'PENDING'}</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Batch Section</p>
                                        <p className="text-xl font-black text-gray-900">Section {user.section || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Joining Cohort</p>
                                        <p className="text-xl font-black text-gray-900">{user.joiningYear || 'N/A'}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Faculty Designation</p>
                                        <p className="text-xl font-black text-gray-900 italic font-serif">{user.designation || 'Specialist'}</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Employee Code</p>
                                        <p className="text-xl font-black text-gray-900">{user.employeeId || 'STAFF'}</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Professional Exp.</p>
                                        <p className="text-xl font-black text-gray-900">{user.experience || '0'} Years Active</p>
                                    </div>
                                    <div className="space-y-1 p-6 bg-gray-50/30 rounded-[2rem] border border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Qualification</p>
                                        <p className="text-xl font-black text-gray-900 truncate">{user.qualification || 'Higher Education'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Personal & Compliance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Personal & Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-1 pb-4 border-b border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Birth Date</p>
                                <p className="font-bold text-gray-800">{user.dob || 'Not Disclosed'}</p>
                            </div>
                            <div className="space-y-1 pb-4 border-b border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gender</p>
                                <p className="font-bold text-gray-800">{user.gender || 'Not Specified'}</p>
                            </div>
                            <div className="space-y-1 pb-4 border-b border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">System Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="font-bold text-gray-800">Verified Member</p>
                                </div>
                            </div>
                        </div>

                        {user.role?.toLowerCase() === 'student' && (
                            <div className="mt-12 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guardian Identity</p>
                                    <p className="text-xl font-bold text-gray-900">{user.guardianName || 'Family Record'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guardian Contact</p>
                                    <p className="text-xl font-bold text-gray-900">{user.guardianPhone || 'Emergency Only'}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserDetails;
