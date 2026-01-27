import express from 'express';
import fs from 'fs';
const app = express();
const PORT = 3000
const ALBUMS_PATH = './data/albums.json';
const PHOTOS_PATH = './data/photos.json';

app.use(express.static('public'));
app.use(express.json());

let albums = [];
let photos = [];

app.get('/api/test', (request, result) => 
{
    result.json({ message: 'Server is working!' });
});

try
{
    const data = fs.readFileSync(ALBUMS_PATH, 'utf-8');
    albums = JSON.parse(data);
}
catch (error)
{
    console.error('Error reading albums data:', error);
}

app.listen(PORT, () => 
{
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/api/albums', (request, result) =>
{
    const album_list = albums.map(a => 
        ({
            album_id: a.album_id,
            title: a.title,
            description: a.description,
            created_at: a.created_at,
            last_updated: a.last_updated
        })
    );
    result.json(album_list);
});

app.get('/api/albums/:album_id', (request, result) =>
{
    const album_id = Number(request.params.album_id);
    const album = albums.find(a => a.album_id === album_id);

    if (!album)
    {
        return result.status(404).json({ error: 'Album not found' });
    }

    const album_photos = photos.filter(p => p.album_id === album_id);
    result.json({ ...album, photos: album_photos });
});

app.post('/api/albums', (request, result) =>
{
    const { title, description } = request.body;

    if (!title)
    {
        return result.status(400).json({ error: 'Title is required' });
    }

    const new_album = 
    {
        album_id: albums.length + 1,
        title,
        description: description || '',
        created_at: new Date().toISOString().split('T')[0],
        last_updated: new Date().toISOString().split('T')[0]
    };

      albums.push(new_album);
      fs.writeFileSync(ALBUMS_PATH, JSON.stringify(albums, null, 2));
      result.json(new_album);
});

app.get('/api/photos', (request, result) =>
{
    const photo_list = photos.map(p =>
    ({
        photo_id: p.photo_id,
        album_id: p.album_id,
        caption: p.caption,
        url: p.url,
        uploaded_at: p.uploaded_at
    }));
    result.json(photo_list);
});

app.get('/api/photos/:photo_id', (request, result) =>
{
    const photo_id = Number(request.params.photo_id);
    const photo = photos.find(p => p.photo_id === photo_id);

    if (!photo)
    {
        return result.status(404).json({ error: 'Photo not found' });
    }

    result.json(photo);
});

app.post('/api/photos', (request, result) =>
{
    const { album_id, url, caption } = request.body;

    if (!album_id || !url)
    {
        return result.status(400).json({ error: 'Album ID and URL are required' });
    }

    const albumExists = albums.some(a => a.album_id === album_id);
    if (!albumExists)
    {
        return result.status(400).json({ error: 'Album does not exist' });
    }

    const new_photo =
    {
        photo_id: photos.length + 1,
        album_id,
        url,
        caption: caption || '',
        uploaded_at: new Date().toISOString().split('T')[0]
    };

    photos.push(new_photo);
    result.json(new_photo);
});