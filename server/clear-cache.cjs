const mongoose = require('mongoose');

const uri = "mongodb+srv://saurav20242025:Sau%40123...@cluster0.ztupgl3.mongodb.net/NeuroSpark";

const courseSchema = new mongoose.Schema({
    structure: [{
        status: String,
        content: mongoose.Schema.Types.Mixed
    }]
}, { strict: false });

const Course = mongoose.model('Course', courseSchema);

async function clearCache() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");

        const courses = await Course.find({});
        let updatedCount = 0;

        for (const course of courses) {
            let modified = false;
            for (const mod of course.structure) {
                if (mod.content) {
                    const originalStatus = mod.status;
                    mod.content = undefined;
                    mod.status = 'pending';
                    modified = true;
                }
            }
            if (modified) {
                course.markModified('structure');
                await course.save();
                updatedCount++;
            }
        }
        console.log(`Successfully cleared cache for ${updatedCount} courses. They will regenerate using the new prompt upon request.`);
    } catch (e) {
        console.error("Error clearing cache:", e);
    } finally {
        await mongoose.disconnect();
    }
}

clearCache();
