import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/apiService';
import { GroupDetails, Expense } from '../types';
import { useAuth } from '../App';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, CloseIcon } from '../components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

// AddExpenseModal component defined in the same file to keep it self-contained.
interface AddExpenseModalProps {
    groupId: string;
    onClose: () => void;
    onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ groupId, onClose, onExpenseAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !user) return;
        setLoading(true);
        // This is a placeholder as backend logic is not complete
        console.log("Adding expense (placeholder)...", { groupId, description, amount: parseFloat(amount), userId: user.id });
        await api.addExpense(groupId, description, parseFloat(amount), user.id);
        // In a real app, you would await the API call and then update state
        alert("Note: Adding expenses is not fully implemented on the backend yet.");
        setLoading(false);
        onExpenseAdded();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Add New Expense</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Description</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required min="0.01" step="0.01"/>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Expense'}
                    </Button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const GroupDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGroupDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const details = await api.getGroupDetails(id);
            setGroupDetails(details);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    const handleSettleUp = async (expense: Expense) => {
        if(!user) return;
        alert("Note: Settling debts is not fully implemented on the backend yet.");
        // This is a placeholder as backend logic is not complete
        await api.settleDebt(expense.id, user.id);
        fetchGroupDetails();
    }

    if (loading || !groupDetails) {
        return <div className="flex justify-center items-center h-full p-8 text-gray-400">Loading group details...</div>;
    }

    return (
        <motion.div 
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold">{groupDetails.name}</h1>
                    <div className="flex items-center -space-x-2 mt-2">
                        {groupDetails.members.map(member => (
                            <img key={member.id} src={member.avatarUrl} title={member.name} className="w-10 h-10 rounded-full border-2 border-gray-900" />
                        ))}
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">
                    Add Expense <PlusIcon />
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expense List */}
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Expenses</h2>
                         {groupDetails.expenses.length === 0 && <p className="text-gray-400">No expenses yet. Add one to get started!</p>}
                        <div className="space-y-4">
                            {/* Expense items will be mapped here once backend is ready */}
                        </div>
                    </Card>
                </div>

                {/* Debts Summary */}
                <div>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Who Owes Whom</h2>
                        <div className="space-y-3">
                           <p className="text-gray-400">All settled up!</p>
                           {/* Debt items will be mapped here once backend is ready */}
                        </div>
                    </Card>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && <AddExpenseModal groupId={id!} onClose={() => setIsModalOpen(false)} onExpenseAdded={() => { setIsModalOpen(false); fetchGroupDetails(); }} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default GroupDetailPage;