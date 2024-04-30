const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'secoms319';

app.get('/api/question', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('questions');
        const question = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
        
        if (question.length) {
            res.json(question[0]);
        } else {
            res.status(404).json({ message: 'No questions found' });
        }
    } catch (error) {
        console.error('Failed to retrieve data:', error);
        res.status(500).json({ message: 'Failed to retrieve data' });
    } finally {
        await client.close();
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
