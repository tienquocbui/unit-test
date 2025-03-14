const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const mongoose = require('mongoose');
const Note = require('../models/note.model');
require('dotenv').config({ path: '.env.test' });

const { expect } = chai;
chai.use(chaiHttp);

describe('Notes API', () => {
    let testNoteId;

    // use it to run before all the tests hmm
    before(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Note.deleteMany({});
    });

    // run after
    after(async () => {
        await Note.deleteMany({});
        await mongoose.connection.close();
    });

    // test note
    describe('POST /notes', () => {
        it('it should create a new note', (done) => {
            const newNote = { title: 'Test Note', content: 'This is just a test content hehe.' };
            chai.request(server)
            .post('/notes')
            .send(newNote)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('note');
                expect(res.body.note).to.have.property('_id');
                expect(res.body.note.title).to.equal(newNote.title);
                expect(res.body.note.content).to.equal(newNote.content);
                testNoteId = res.body.note._id;
                done();
            });
        });

        it('should return error for missing title or content', (done) => {
            const incompleteNote = { title: '' };
        
            chai.request(server)
            .post('/notes')
            .send(incompleteNote)
            .end((err, res) => {
                console.log("🚨 Debugging Response (POST /notes):", res.body); // Debugging
                expect(res).to.have.status(400);  
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include('Title and content');
                done();
            });
        });
    });

    // test fetching all the notes
    describe('GET /notes', () => {
        it('should retrieve all notes', (done) => {
            chai.request(server)
            .get('/notes')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('notes').that.is.an('array');
                done();
            });
        });
    });

    // test to fetching a single note
    describe('GET /notes/:id', () => {
        it('should retrieve a specific note by ID', (done) => {
            chai.request(server)
            .get(`/notes/${testNoteId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('note');
                expect(res.body.note._id).to.equal(testNoteId);
                done();
            });
        });

        it('should return 404 for an invalid note ID', (done) => {
            chai.request(server)
            .get('/notes/605c72d295d28c4c2e4a1c2f') // Non-existent ID
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('Note not found');
                done();
            });
        });
    });

    // test updating a note
    
    describe('PUT /notes/:id', () => {
        it('should update an existing note', (done) => {
            const updatedNote = { title: 'Updated Title', content: 'Updated Content' };
            chai.request(server)
            .put(`/notes/${testNoteId}`)
            .send(updatedNote)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('note');
                expect(res.body.note).to.have.property('title').that.equals(updatedNote.title);
                expect(res.body.note).to.have.property('content').that.equals(updatedNote.content);
                done();
            });
        });

        it('should return error for missing title or content', (done) => {
            const incompleteNote = { title: '' };  // Missing content
            chai.request(server)
            .post('/notes')
            .send(incompleteNote)
            .end((err, res) => {
                console.log(res.body); 
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message'); 
                expect(res.body.message).to.include('Title and content');
                done();
            });
        });
    });

    // test deleting a note
    describe('DELETE /notes/:id', () => {
        it('should delete a note', (done) => {
            chai.request(server)
            .delete(`/notes/${testNoteId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Note deleted successfully');
                done();
            });
        });

        it('should return 404 if note does not exist', (done) => {
            const fakeNoteId = new mongoose.Types.ObjectId();
            chai.request(server)
            .delete(`/notes/${fakeNoteId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('Note not found');
                done();
            });
        });
    });
});
    

