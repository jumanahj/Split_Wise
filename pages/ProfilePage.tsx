import React from 'react';
import Card from '../components/ui/Card';
import { useAuth } from '../App';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="p-4 md:p-8 flex justify-center items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="w-full max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
          />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
          
          <div className="mt-8 border-t border-white/10 w-full pt-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <p className="text-gray-500">More settings and profile customization options will be available here in a future update.</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;