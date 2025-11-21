const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db = require('./db');
const auth = require('./authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- AUTHENTICATION ROUTES ---

// @route   POST api/signup
// @desc    Register a new user
// @access  Public
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let [users] = await db.query('SELECT * FROM `users` WHERE `email` = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userId = uuidv4();
        // Simple avatar generation based on name initials
        const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`;

        await db.query('INSERT INTO `users` (id, name, email, password, avatarUrl) VALUES (?, ?, ?, ?, ?)', [userId, name, email, hashedPassword, avatarUrl]);
        
        const user = { id: userId, name, email, avatarUrl };

        const payload = { user: { id: userId } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let [users] = await db.query('SELECT * FROM `users` WHERE `email` = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        const userResponse = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: userResponse });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- APPLICATION ROUTES (PROTECTED) ---

// @route   GET api/dashboard
// @desc    Get all data needed for the user's dashboard
// @access  Private
app.get('/api/dashboard', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch groups the user is a member of
        const [groupsResult] = await db.query(
            `SELECT g.id, g.name, g.inviteCode FROM \`groups\` g 
             JOIN \`group_members\` gm ON g.id = gm.groupId 
             WHERE gm.userId = ?`,
            [userId]
        );

        // For each group, fetch its members
        const groupsWithMembers = await Promise.all(groupsResult.map(async (group) => {
            const [membersResult] = await db.query(
                `SELECT u.id, u.name, u.email, u.avatarUrl FROM \`users\` u
                 JOIN \`group_members\` gm ON u.id = gm.userId
                 WHERE gm.groupId = ?`,
                [group.id]
            );
            return { ...group, members: membersResult };
        }));

        // --- PLACEHOLDER DATA ---
        // The logic for balance, expenses, and spending data is complex and not yet implemented.
        // We are returning static data for now.
        const dashboardData = {
            balance: {
                total: 150.75,
                youOwe: 25.50,
                youAreOwed: 176.25,
            },
            recentExpenses: [], // Will be populated when expense logic is built
            spendingData: [ // Example static data
                { name: 'Jan', amount: 400 },
                { name: 'Feb', amount: 300 },
                { name: 'Mar', amount: 500 },
                { name: 'Apr', amount: 280 },
                { name: 'May', amount: 450 },
            ],
            groups: groupsWithMembers,
        };

        res.json(dashboardData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/groups
// @desc    Create a new group
// @access  Private
app.post('/api/groups', auth, async (req, res) => {
    const { groupName } = req.body;
    const userId = req.user.id;

    if (!groupName) {
        return res.status(400).json({ msg: 'Please provide a group name.' });
    }

    try {
        const groupId = uuidv4();
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Create the group
        await db.query('INSERT INTO `groups` (id, name, inviteCode) VALUES (?, ?, ?)', [groupId, groupName, inviteCode]);
        
        // Add the creator as the first member
        await db.query('INSERT INTO `group_members` (groupId, userId) VALUES (?, ?)', [groupId, userId]);

        // Fetch the created group and its initial member to return
        const [newGroup] = await db.query('SELECT * FROM `groups` WHERE id = ?', [groupId]);
        const [members] = await db.query('SELECT id, name, email, avatarUrl FROM `users` WHERE id = ?', [userId]);
        
        res.json({ ...newGroup[0], members });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/groups/join
// @desc    Join an existing group with an invite code
// @access  Private
app.post('/api/groups/join', auth, async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) {
        return res.status(400).json({ msg: 'Please provide an invite code.' });
    }

    try {
        const [groups] = await db.query('SELECT * FROM `groups` WHERE inviteCode = ?', [inviteCode]);
        if (groups.length === 0) {
            return res.status(404).json({ msg: 'Group not found with this code.' });
        }
        const group = groups[0];

        const [members] = await db.query('SELECT * FROM `group_members` WHERE groupId = ? AND userId = ?', [group.id, userId]);
        if (members.length > 0) {
            return res.status(400).json({ msg: 'You are already a member of this group.' });
        }

        await db.query('INSERT INTO `group_members` (groupId, userId) VALUES (?, ?)', [group.id, userId]);
        
        res.json({ msg: 'Successfully joined group!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/group/:id
// @desc    Get details for a single group
// @access  Private
app.get('/api/group/:id', auth, async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        // Check if user is a member of the group
        const [membership] = await db.query('SELECT * FROM `group_members` WHERE groupId = ? AND userId = ?', [groupId, userId]);
        if (membership.length === 0) {
            return res.status(403).json({ msg: 'Not authorized to view this group.' });
        }

        const [groups] = await db.query('SELECT * FROM `groups` WHERE id = ?', [groupId]);
        if (groups.length === 0) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        const group = groups[0];

        const [members] = await db.query(
            'SELECT u.id, u.name, u.email, u.avatarUrl FROM `users` u JOIN `group_members` gm ON u.id = gm.userId WHERE gm.groupId = ?',
            [groupId]
        );
        
        // Placeholder for expenses and debts, as this logic is not yet implemented
        const groupDetails = {
            ...group,
            members,
            expenses: [],
            debts: []
        };

        res.json(groupDetails);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));