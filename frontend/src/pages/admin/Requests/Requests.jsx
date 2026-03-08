import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import RequestStats from './components/RequestStats';
import RequestFilters from './components/RequestFilters';
import RequestTable from './components/RequestTable';
import RequestDrawer from './components/RequestDrawer';
import CreateRequestModal from './components/CreateRequestModal';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('student');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        type: 'All',
        status: 'All',
        department: 'All'
    });

    // Fetch requests based on active tab
    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/requests?role=${activeTab}`);
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const updateRequestStatus = async (id, newStatus, comment) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, adminComment: comment })
            });

            // Update local state
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: newStatus, adminComment: comment } : req
            ));
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            (req.id && req.id.toLowerCase().includes(filters.search.toLowerCase())) ||
            (req.subject && req.subject.toLowerCase().includes(filters.search.toLowerCase())) ||
            (req.creator && req.creator.name && req.creator.name.toLowerCase().includes(filters.search.toLowerCase()));

        const matchesType = filters.type === 'All' || req.type === filters.type;
        const matchesStatus = filters.status === 'All' || req.status === filters.status;
        const matchesDept = filters.department === 'All' || req.department === filters.department;

        return matchesSearch && matchesType && matchesStatus && matchesDept;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Requests & Approvals</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage student and staff requests</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => setActiveTab('student')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Student Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('teacher')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'teacher' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Teacher Requests
                    </button>
                </div>
            </div>

            {/* Stats */}
            <RequestStats requests={requests} />

            {/* Filters */}
            <RequestFilters filters={filters} setFilters={setFilters} />

            {/* Table */}
            <RequestTable
                requests={filteredRequests}
                onRowClick={setSelectedRequest}
            />

            {/* Drawer */}
            {selectedRequest && (
                <RequestDrawer
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdateStatus={updateRequestStatus}
                />
            )}
        </div>
    );
};

export default Requests;
