import React, { useState } from 'react';
import { Search, Filter, Eye, Clock, ShieldCheck, XCircle, X, Calendar, FileText, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestList = ({ requests }) => {
    const [filter, setFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleDelete = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/${requestId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                window.location.reload(); // Simple refresh to update list
            } else {
                alert('Failed to delete request');
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Network error. Please try again.');
        }
        setOpenDropdown(null);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(search.toLowerCase()) ||
            req.subject.toLowerCase().includes(search.toLowerCase());
        const matchesType = filter === 'All' || req.type === filter;
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const statusColors = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Approved': 'bg-green-50 text-green-600 border-green-100',
        'Rejected': 'bg-red-50 text-red-600 border-red-100'
    };

    const statusIcons = {
        'Pending': <Clock size={16} />,
        'Approved': <ShieldCheck size={16} />,
        'Rejected': <XCircle size={16} />
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="All">All Types</option>
                            <option value="Leave">Leave</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Bonafide Certificate">Bonafide</option>
                            <option value="Other">Other</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search ID or Subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type / Subject</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No requests found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{req.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{req.subject}</span>
                                                <span className="text-xs text-gray-500">{req.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {statusIcons[req.status]}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1"
                                                >
                                                    <Eye size={14} /> View
                                                </button>

                                                {/* Three-dot menu */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === req.id ? null : req.id)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <MoreVertical size={16} className="text-gray-500" />
                                                    </button>

                                                    {openDropdown === req.id && (
                                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                            <button
                                                                onClick={() => handleDelete(req.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedRequest(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedRequest.type}</h2>
                                    <p className="text-sm text-gray-500">Request ID: {selectedRequest.id}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {/* Status Banner */}
                                <div className={`p-4 rounded-lg flex items-center gap-3 ${statusColors[selectedRequest.status]} border`}>
                                    {statusIcons[selectedRequest.status]}
                                    <span className="font-medium">Status: {selectedRequest.status}</span>
                                </div>

                                {/* Details */}
                                <div>
                                    <label className="text-xs text-gray-500">Subject</label>
                                    <p className="font-medium text-gray-900 mt-1">{selectedRequest.subject}</p>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500">Description</label>
                                    <p className="text-gray-700 text-sm leading-relaxed mt-1">{selectedRequest.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Date Submitted</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Type</label>
                                        <p className="text-sm font-medium mt-1">{selectedRequest.type}</p>
                                    </div>
                                </div>

                                {/* Admin Comment */}
                                {selectedRequest.adminComment && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h4 className="text-sm font-bold text-gray-900 mb-2">Admin Comment</h4>
                                        <p className="text-gray-600 text-sm italic">"{selectedRequest.adminComment}"</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RequestList;
