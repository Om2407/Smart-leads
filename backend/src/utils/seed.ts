import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Lead from '../models/Lead';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads');
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin123',
    role: 'admin',
  });

  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@demo.com',
    password: 'Sales123',
    role: 'sales',
  });

  const statuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
  const sources = ['Website', 'Instagram', 'Referral'] as const;
  const names = ['Rahul Sharma', 'Priya Singh', 'Amit Patel', 'Sneha Gupta', 'Vikram Joshi',
    'Anjali Mehta', 'Rohan Verma', 'Kavita Nair', 'Suresh Kumar', 'Pooja Yadav',
    'Arjun Reddy', 'Meena Pillai', 'Deepak Malhotra', 'Ritu Bhandari', 'Sanjay Kapoor'];

  const leads = names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    notes: i % 3 === 0 ? `Interested in premium plan. Follow up on ${new Date(Date.now() + i * 86400000).toLocaleDateString()}` : undefined,
    createdBy: i % 3 === 0 ? sales._id : admin._id,
  }));

  await Lead.insertMany(leads);

  console.log('✅ Seed complete!');
  console.log('Admin: admin@demo.com / Admin123');
  console.log('Sales: sales@demo.com / Sales123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
