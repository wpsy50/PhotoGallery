import express from 'express';
const app = express();
const PORT = 3000

app.use(express.static('public'));
app.use(express.json());

let albums = 
[
  { album_id: 1, user_id: 1, title: 'Concerts', description: 'Live concert photos', created_at: '01-08-2025', last_updated: '24-11-2025' }
];

let photos = 
[
  { photo_id: 1, album_id: 1, user_id: 1, url: 'radiohead.jpg', caption: 'Radiohead in the O2 arena', uploaded_at: '24-11-2025' },
]

app.get('/api/test', (req, res) => 
{
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => 
{
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/api/albums', (req, res) =>
{
  const album_list = albums.map(a => 
    ({
      album_id: a.album_id,
      user_id: a.user_id,
      title: a.title,
      description: a.description,
      created_at: a.created_at,
      last_updated: a.last_updated
    })
  );
  res.json(album_list);
});

app.get('/api/albums/:album_id', (req, res) =>
{
  const album_id = Number(req.params.album_id);
  const album = albums.find(a => a.album_id === album_id);

  if (!album)
  {
    return res.status(404).json({ error: 'Album not found' });
  }

  const album_photos = photos.filter(p => p.album_id === album_id);
  res.json({ ...album, photos: album_photos });
});