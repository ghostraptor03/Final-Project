const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build')); 

const port = 8081;
app.listen(port, () => console.log(`Server listening on port ${port}`));

// Get the question
app.get("/api/question", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const questions = await db.collection("questions").aggregate([{ $sample: { size: 1 } }]).toArray();
        res.json(questions[0]);
    } catch (error) {
        console.error("Error retrieving question:", error);
        res.status(500).send("Error retrieving question: " + error.message);
    }
});

// Check the answer
app.post("/api/answer", async (req, res) => {
    const { questionId, answer } = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const question = await db.collection("questions").findOne({ id: questionId });
        const isCorrect = question && question.answer === answer;
        res.json({ correct: isCorrect });
    } catch (error) {
        console.error("Error validating answer:", error);
        res.status(500).send("Error validating answer: " + error.message);
    }
});
