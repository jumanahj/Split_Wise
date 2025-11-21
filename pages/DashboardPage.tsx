import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { DashboardData } from '../types';
import { motion } from 'framer-motion';

import Card from '../components/ui/Card';
import SpendingChart from '../components/SpendingChart';
import { PlusIcon, ChevronRightIcon } from '../components/Icons';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dashboardData = await api.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };


  if (loading || !data) {
    return <div className="flex justify-center items-center h-full p-8 text-gray-400">Loading dashboard...</div>;
  }
  
  return (
    <motion.div 
      className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Balance Summary */}
      <motion.div variants={itemVariants} className="lg:col-span-3">
        <Card>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-gray-400">Total Balance</h2>
                    <p className={`text-4xl font-bold ${data.balance.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${data.balance.total.toFixed(2)}
                    </p>
                </div>
                <div className="flex gap-8 mt-4 md:mt-0 text-center">
                    <div>
                        <h3 className="text-gray-400">You are owed</h3>
                        <p className="text-xl font-semibold text-green-400">${data.balance.youAreOwed.toFixed(2)}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-400">You owe</h3>
                        <p className="text-xl font-semibold text-red-400">${data.balance.youOwe.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Card>
      </motion.div>

      {/* Spending Chart */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <SpendingChart data={data.spendingData} />
      </motion.div>

      {/* Recent Expenses */}
      <motion.div variants={itemVariants}>
        <Card className="h-full">
            <h2 className="text-xl font-bold mb-4 text-white">Recent Expenses</h2>
            <div className="space-y-4">
                {data.recentExpenses.length > 0 ? data.recentExpenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                        <div>
                            <p className="font-semibold">{exp.description}</p>
                            <p className="text-sm text-gray-400">{exp.groupName}</p>
                        </div>
                        <p className="font-bold text-lg">${exp.amount.toFixed(2)}</p>
                    </div>
                )) : <p className="text-gray-400">No recent expenses.</p>}
            </div>
        </Card>
      </motion.div>

      {/* My Groups */}
      <motion.div variants={itemVariants} className="lg:col-span-3">
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">My Groups</h2>
                <Button variant="secondary" onClick={() => navigate('/groups')}>
                    Manage Groups <ChevronRightIcon />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.groups.map(group => (
                    <div key={group.id} onClick={() => navigate(`/group/${group.id}`)} className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{group.name}</h3>
                                <div className="flex -space-x-2 mt-2">
                                    {group.members.slice(0, 3).map(member => (
                                        <img key={member.id} src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full border-2 border-gray-800"/>
                                    ))}
                                    {group.members.length > 3 && (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-gray-800">
                                            +{group.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ChevronRightIcon />
                        </div>
                    </div>
                ))}
                 {data.groups.length === 0 && <p className="text-gray-400 md:col-span-2 lg:col-span-3">You are not part of any groups yet.</p>}
            </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;