const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb+srv://kojoben29:Ost0UIZdvRIEDMRJ@cluster0.7ajsk.mongodb.net/neurohealth?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'kojoben29@gmail.com';
        const passwordPlain = '12345678';
        const fullName = 'Dr. Kojoben';
        const role = 'doctor';

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(passwordPlain, salt);

        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: email },
            {
                $set: {
                    passwordHash: passwordHash,
                    role: role,
                    fullName: fullName
                }
            },
            { upsert: true }
        );

        console.log('User update result:', result);
        console.log(`User ${email} is now a DOCTOR with password ${passwordPlain}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err);
        process.exit(1);
    }
}

seed();
