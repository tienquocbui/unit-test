const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller'); // Ensure the correct import

// Create a new note
router.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = await noteController.create({ title, content });
        res.json({
            message: 'Note created successfully',
            note,
            status: 'success'
        });
    } catch (error) {
        console.error("🚨 Error in POST /notes:", error);
        res.status(error.status || 500).json({
            item: null,
            status: error.status || 500,
            message: error.message || "Something went wrong while creating the note!"
        });
    }
});

// Get all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await noteController.findAll();
        res.json({
            message: 'Notes fetched successfully',
            notes,
            status: 'success'
        });
    } catch (error) {
        console.error("🚨 Error in GET /notes:", error);
        res.status(error.status || 500).json({
            item: null,
            status: error.status || 500,
            message: error.message || "Something went wrong while fetching notes!"
        });
    }
});

// Get a single note
router.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteController.findOne(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({
            message: 'Note fetched successfully',
            note,
            status: 'success'
        });
    } catch (error) {
        console.error("🚨 Error in GET /notes/:id:", error);
        res.status(error.status || 500).json({
            item: null,
            status: error.status || 500,
            message: error.message || "Something went wrong while fetching the note!"
        });
    }
});

// Update a note
router.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await noteController.update(id, { title, content });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ 
            message: 'Note updated successfully', 
            note,
            status: 'success'
        });
    } catch (error) {
        console.error("🚨 Error in PUT /notes/:id:", error);
        res.status(error.status || 500).json({
            item: null,
            status: error.status || 500,
            message: error.message || "Something went wrong while updating the note!"
        });
    }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteController.delete(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully', status: 'success' });
    } catch (error) {
        console.error("🚨 Error in DELETE /notes/:id:", error);
        res.status(error.status || 500).json({
            item: null,
            status: error.status || 500,
            message: error.message || "Something went wrong while deleting the note!"
        });
    }
});

module.exports = router;
