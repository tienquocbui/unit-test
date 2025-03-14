const Note = require('../models/note.model');

const noteController = {
    create: async (noteObj) => {
        if (!noteObj || !noteObj.title || !noteObj.content) {
            return Promise.reject({ status: 400, message: 'Title and content are required' });
        }
        try {
            const note = new Note({ title: noteObj.title, content: noteObj.content });
            return await note.save();
        } catch (error) {
            return Promise.reject({ status: 500, message: 'Database error', error });
        }
    },

    findAll: async () => {
        try {
            return await Note.find();
        } catch (error) {
            return Promise.reject({ status: 500, message: 'Database error', error });
        }
    },

    findOne: async (id) => {
        if (!id) return Promise.reject({ status: 400, message: 'Note ID is required' });
        try {
            return await Note.findById(id);
        } catch (error) {
            return Promise.reject({ status: 500, message: 'Database error', error });
        }
    },

    update: async (id, noteObj) => {
        if (!id) return Promise.reject({ status: 400, message: 'Note ID is required' });
        if (!noteObj || !noteObj.title || !noteObj.content) {
            return Promise.reject({ status: 400, message: 'Title and content are required' });
        }
        try {
            return await Note.findByIdAndUpdate(id, noteObj, { new: true });
        } catch (error) {
            return Promise.reject({ status: 500, message: 'Database error', error });
        }
    },

    delete: async (id) => {
        if (!id) return Promise.reject({ status: 400, message: 'Note ID is required' });
        try {
            return await Note.findByIdAndDelete(id);
        } catch (error) {
            return Promise.reject({ status: 500, message: 'Database error', error });
        }
    }
};

module.exports = noteController;
