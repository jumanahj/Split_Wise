import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, ChevronRightIcon, CloseIcon } from '../components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/apiService';
import { useAuth } from '../App';
import { Group } from '../types';

// CreateGroupModal component
interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onGroupCreated }) => {
    const [step, setStep] = useState(1); // 1 for form, 2 for success
    const [groupName, setGroupName] = useState('');
    const [createdGroup, setCreatedGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName) return;
        setLoading(true);
        const newGroup = await api.createGroup(groupName);
        setCreatedGroup(newGroup);
        setLoading(false);
        setStep(2);
    };
    
    const handleCopy = () => {
        if(!createdGroup) return;
        navigator.clipboard.writeText(createdGroup.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    
    const handleDone = () => {
        onGroupCreated();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{step === 1 ? 'Create New Group' : 'Group Created!'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                </div>
                
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                         <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Group Name</label>
                                <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Group'}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <p className="text-gray-300 mb-4">Share this code with others to invite them to <span className="font-bold text-white">{createdGroup?.name}</span>.</p>
                            <div className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg p-4 flex items-center justify-between mb-6">
                                <span className="text-2xl font-mono tracking-widest text-teal-300">{createdGroup?.inviteCode}</span>
                                <Button variant="secondary" onClick={handleCopy}>
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                            <Button onClick={handleDone} className="w-full">Done</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

const GroupsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUserGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
        const data = await api.getDashboardData(); // This endpoint conveniently returns the user's groups
        setUserGroups(data.groups);
    } catch(err) {
        console.error("Failed to fetch groups", err);
    } finally {
        setLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    fetchUserGroups();
  }, [fetchUserGroups]);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !user) return;
    setJoinLoading(true);
    setJoinError(null);
    try {
        await api.joinGroup(joinCode);
        setJoinCode('');
        fetchUserGroups();
    } catch(err) {
        setJoinError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
        setJoinLoading(false);
    }
  };
  
  const onGroupCreated = () => {
      setIsCreateModalOpen(false);
      fetchUserGroups();
  }

  return (
    <motion.div
      className="p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row gap-6">
           <div className="flex-1 bg-gray-700/50 p-6 rounded-lg text-center flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-3">Create a New Group</h2>
            <p className="text-gray-400 mb-4 h-12 flex-grow">Start a new group to share expenses with friends or family.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Group <PlusIcon />
            </Button>
          </div>

          <div className="flex-1 bg-gray-700/50 p-6 rounded-lg text-center flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-3">Join an Existing Group</h2>
            <p className="text-gray-400 mb-4 h-12 flex-grow">Have an invite code? Join a group and start splitting bills.</p>
            <form onSubmit={handleJoinGroup} className="flex justify-center w-full max-w-sm">
              <input 
                type="text" 
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter group code" 
                className="bg-gray-900/50 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                maxLength={6}
              />
              <Button type="submit" className="rounded-l-none" disabled={joinLoading}>
                {joinLoading ? '...' : 'Join'}
              </Button>
            </form>
            {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
          </div>
        </div>
      </Card>
      
      <h2 className="text-2xl font-bold max-w-4xl mx-auto mb-4">Your Groups</h2>
      {loadingGroups ? (
        <p className="text-center text-gray-400">Loading your groups...</p>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {userGroups.length > 0 ? userGroups.map(group => (
                <motion.div key={group.id} whileHover={{ y: -5 }}>
                    <Card onClick={() => navigate(`/group/${group.id}`)} className="h-full cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg mb-2">{group.name}</h3>
                                <div className="flex -space-x-2">
                                    {group.members.slice(0, 4).map(member => (
                                        <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-gray-800"/>
                                    ))}
                                    {group.members.length > 4 && (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-gray-800">
                                            +{group.members.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ChevronRightIcon />
                        </div>
                    </Card>
                </motion.div>
            )) : <p className="text-gray-400 max-w-4xl mx-auto">You're not in any groups yet. Create one or join one to get started!</p>}
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && <CreateGroupModal onClose={() => setIsCreateModalOpen(false)} onGroupCreated={onGroupCreated} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default GroupsPage;