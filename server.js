require('dotenv').config(); 

const express = require('express');
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');


const app = express();

const uri = process.env.MONGO_URI;
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

app.use(cors());
app.use(express.json()); 


async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db('weirdiful');
    const experiencesCollection = db.collection('experiences');

    // GET all experiences
    app.get('/api/experiences', async (req, res) => {
      try {
        const experiences = await experiencesCollection.find().toArray();
        res.json(experiences);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET one experience
    app.get('/api/experiences/:id', async (req, res) => {
      try {
        const experience = await experiencesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!experience) return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
        res.json(experience);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST new experience
    app.post('/api/experiences', async (req, res) => {
      try {
        const { company, role, duration, description } = req.body;
        if (!company || !role || !duration) {
          return res.status(400).json({ error: 'Obligatoriska fält saknas.' });
        }
        const result = await experiencesCollection.insertOne({ company, role, duration, description });
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // PUT update experience
    app.put('/api/experiences/:id', async (req, res) => {
      try {
        const { company, role, duration, description } = req.body;
        const result = await experiencesCollection.findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: { company, role, duration, description } },
          { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
        res.json(result.value);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE experience
    app.delete('/api/experiences/:id', async (req, res) => {
      try {
        const result = await experiencesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
        }
        res.json({ message: 'Erfarenhet borttagen.' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

startServer();