import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './server/models/lead.model.js';
import Property from './server/models/property.model.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- DB Check ---');
    
    const leadCount = await Lead.countDocuments();
    const propCount = await Property.countDocuments();
    console.log('Leads found:', leadCount);
    console.log('Properties found:', propCount);
    
    const closedLeads = await Lead.find({ status: 'Closed' });
    console.log('Closed Leads found:', closedLeads.length);
    
    if (closedLeads.length > 0) {
      console.log('First closed lead dealValue:', closedLeads[0].dealValue);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkData();
