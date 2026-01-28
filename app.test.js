const request = require('supertest');
const app = require('./server.js');
const fs = require('fs');

beforeEach(() =>
{
    const test_albums = [
        {
            album_id: 1,
            title: 'Test Album',
            description: 'This is a test album',
            created_at: '15-11-2006',
            last_updated: '15-11-2006'
        }
    ];
    const test_photos = [
        {
            photo_id: 1,
            album_id: 1,
            caption: 'Test Photo',
            url: '/data/uploads/test_photo.jpg',
            uploaded_at: '15-11-2006'
        }
    ];

    fs.writeFileSync('./data/tests/test_albums.json', JSON.stringify(test_albums, null, 2));
    fs.writeFileSync('./data/tests/test_photos.json', JSON.stringify(test_photos, null, 2));
});

describe('Photo Gallery API expected inputs', () =>
{
    test('GET /api/test should return server status', () =>
    {
        return request(app)
        .get('/api/test')
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('GET /api/albums should return list of albums', () =>
    {
        return request(app)
        .get('/api/albums')
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('GET /api/albums/:album_id should return album details', () =>
    {
        return request(app)
        .get('/api/albums/1')
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('POST /api/albums should create a new album', () =>
    {
        return request(app)
        .post('/api/albums')
        .send({ title: 'New Album', description: 'Album Description' })
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('GET /api/photos should return list of photos', () =>
    {
        return request(app)
        .get('/api/photos')
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('GET /api/photos/:photo_id should return photo details', () =>
    {
        return request(app)
        .get('/api/photos/1')
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('POST /api/photos should upload a new photo', () =>
    {
        return request(app)
        .post('/api/photos')
        .attach('photo_file', 'data/tests/test_uploads/test.jpg')
        .field('caption', 'Test Photo')
        .field('album_id', 2)
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('DELETE /api/photos/:photo_id should delete a photo', () =>
    {
        return request(app)
        .delete('/api/photos/2')
        .expect(200)
        .expect('Content-Type', /json/);
    });
});

describe('Photo Gallery API error handling', () =>
{
    test('GET /api/albums/:album_id returns 404 for non-existent album', () =>
    {
        return request(app)
        .get('/api/albums/999')
        .expect(404)
        .expect('Content-Type', /json/);
    });
    test('POST /api/albums with missing title should return 400', () =>
    {
        return request(app)
        .post('/api/albums')
        .send({ description: 'No title provided' })
        .expect(400)
        .expect('Content-Type', /json/);
    });
    test('GET /api/photos/:photo_id returns 404 for non-existent photo', () =>
    {
        return request(app)
        .get('/api/photos/999')
        .expect(404)
        .expect('Content-Type', /json/);
    });
    test('POST /api/photos with missing fields should return 400', () =>
    {
        return request(app)
        .post('/api/photos')
        .attach('photo_file', 'data/tests/test_uploads/test.jpg')
        .expect(400)
        .expect('Content-Type', /json/);
    });
    test('DELETE /api/photos/:photo_id for non-existent photo should return 404', () =>
    {
        return request(app)
        .delete('/api/photos/999')
        .expect(404)
        .expect('Content-Type', /json/);
    });
});