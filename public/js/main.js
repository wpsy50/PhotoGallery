document.addEventListener('DOMContentLoaded', () =>
{
    load_albums();
});

let current_album_id = null;

function load_albums()
{
    fetch('/api/albums')
        .then(response => response.json())
        .then(albums =>
        {
            var grid = document.getElementById('album_grid');
            grid.innerHTML = '';

            albums.forEach(function(album)
            {
                var col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

                col.innerHTML =
                    '<div class="card h-100">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title">' + album.title + '</h5>' +
                            '<p class="card-text text-muted small">' + (album.description || 'No description') + '</p>' +
                            '</div>' +
                    '</div>';

                col.addEventListener('click', function()
                {
                    current_album_id = album.album_id;
                    load_album_photos(current_album_id);
                });

                grid.appendChild(col);
            });
        })
        .catch(function(error)
        {
            var grid = document.getElementById('album_grid');
            grid.innerHTML = '<p class="text-danger">Error loading albums.</p>';
            console.error(error);
        });
}

function load_album_photos(album_id)
{
    current_album_id = album_id;
    const grid = document.getElementById('album_grid');
    grid.innerHTML = '';

    var back = document.createElement('div');
    back.className = 'col-12 mb-3';
    back.innerHTML = '<button class="btn btn-secondary">Back to Albums</button>';
    back.querySelector('button').addEventListener('click', load_albums);
    grid.appendChild(back);

    fetch('/api/albums/' + album_id)
        .then(response => response.json())
        .then(album =>
        {
            const title = document.createElement('div');
            title.className = 'col-12 mb-3';
            title.innerHTML = '<h2>' + album.title + '</h2><p class="text-muted">' + (album.description || 'No description') + '</p>';
            grid.appendChild(title);

            var upload_div = document.createElement('div');
            upload_div.className = 'col-12 mb-3';
            upload_div.innerHTML =
                '<form id="add_photo_form" enctype="multipart/form-data">' +
                    '<input type="file" id="photo_file" required>' +
                    '<input type="text" id="photo_caption" placeholder="Caption">' +
                    '<button type="submit" class="btn btn-primary mt-2">Add Photo</button>' +
                '</form>';
            grid.appendChild(upload_div);

            const upload_form = upload_div.querySelector('form');
            upload_form.addEventListener('submit', function(event)
            {
                event.preventDefault();

                const file_input = document.getElementById("photo_file");
                const caption = document.getElementById("photo_caption").value;
                const form_data = new FormData();
                form_data.append('photo_file', file_input.files[0]);
                form_data.append('caption', caption);
                form_data.append('album_id', album_id);

                fetch('/api/photos',
                {
                    method: 'POST',
                    body: form_data
                })
                .then(response => response.json())
                .then(photo =>
                {
                    upload_form.reset();
                    load_album_photos(album_id);
                })
                .catch(error =>
                {
                    console.error('Error adding photo:', error);
                    alert('Error adding photo.');
                });
            });

            if (!album.photos || album.photos.length === 0)
            {
                const no_photos = document.createElement('div');
                no_photos.className = 'col-12';
                no_photos.innerHTML = '<p>No photos in this album.</p>';
                grid.appendChild(no_photos);
                return;
            }

            album.photos.forEach(photo =>
            {
                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-3';
                col.innerHTML =
                    '<div class="card h-100">' +
                        '<img src="' + photo.url + '" class="card-img-top" alt="' + (photo.caption || 'Photo') + '">' +
                        '<div class="card-body">' +
                            '<p class="card-text">' + (photo.caption || '') + '</p>' +
                        '</div>' +
                    '</div>';
                grid.appendChild(col);
            });
        })
        .catch(error =>
        {
            grid.innerHTML += '<p class="text-danger">Error loading photos.</p>';
            console.error(error);
        });
}

function create_album(event)
{
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    fetch('/api/albums',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    })
    .then(response => response.json())
    .then(album =>
    {
        document.getElementById("create_album_form").reset();
        load_albums();
    })
    .catch(error =>
    {
        console.error('Error creating album:', error);
        alert('Error creating album. Please try again.');
    });
}
