const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

//Anslut till Mongodb
mongoose.connect("").then(()=> {
    console.log("Connected to MongoDV");
}).catch((error)=> {
    console.log("Error connecting to database: " + error);
});

const Experience = mongoose.model('Experience', experienceSchema);

//Schema

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: false }
  });


  app.post('/api/experiences', async (req, res) => {
    try {
      const { company, role, duration, description } = req.body;
      if (!company || !role || !duration) {
        return res.status(400).json({ error: 'Obligatoriska fält måste fyllas i.' });
      }
      const newExperience = new Experience({ company, role, duration, description });
      const saved = await newExperience.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await Experience.find();
      res.json(experiences);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  app.get('/api/experiences/:id', async (req, res) => {
    try {
      const experience = await Experience.findById(req.params.id);
      if (!experience) return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.put('/api/experiences/:id', async (req, res) => {
    try {
      const { company, role, duration, description } = req.body;
      const updated = await Experience.findByIdAndUpdate(
        req.params.id,
        { company, role, duration, description },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/experiences/:id', async (req, res) => {
    try {
      const deleted = await Experience.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Erfarenhet hittades inte.' });
      res.json({ message: 'Erfarenhet borttagen.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  