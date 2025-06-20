const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('../models/Project');

dotenv.config();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
    const projects = await Project.find();

    for (let project of projects) {
      const updated = project.pendingRequests.map((id) =>
        typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
      );

      const needsUpdate = updated.some((id, i) => id.toString() !== project.pendingRequests[i].toString());

      if (needsUpdate) {
        project.pendingRequests = updated;
        await project.save();
        console.log(`✅ Fixed project: ${project.name}`);
      }
    }

    console.log('🎉 All pendingRequests fixed to ObjectIds');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
