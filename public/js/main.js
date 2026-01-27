document.addEventListener('DOMContentLoaded', () =>
{
    load_albums();
});

function load_albums()
{
    fetch('/api/albums')
        .then(function(response)
        {
            return response.json();
        })
        .then(function(albums)
        {
            var row = document.getElementById('album_grid');
            row.innerHTML = '';

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
                    load_album_photos(album.album_id);
                });

                row.appendChild(col);
            });
        })
        .catch(function(error)
        {
            var row = document.getElementById('album_grid');
            row.innerHTML = '<p class="text-danger">Error loading albums.</p>';
            console.error(error);
        });
}

function load_album_photos(album_id)
{
    fetch('/api/albums/' + album_id)
        .then(function(response)
        {
            return response.json();
        })
        .then(function(album)
        {
            var grid = document.getElementById('album_grid');
            grid.innerHTML = '';

            var back = document.createElement('div');
            back.className = 'col-12 mb-3';
            back.innerHTML = '<button class="btn btn-secondary">Back to Albums</button>';
            back.querySelector('button').addEventListener('click', function()
            {
                load_albums();
            });
            grid.appendChild(back);

            var title = document.createElement('div');
            title.className = 'col-12 mb-3';
            title.innerHTML = '<h3>' + album.title + '</h3>';
            grid.appendChild(title);

            if (album.photos.length === 0)
            {
                var no_photos = document.createElement('div');
                no_photos.className = 'col-12';
                no_photos.innerHTML = '<p>No photos in this album.</p>';
                grid.appendChild(no_photos);
                return;
            }

            album.photos.forEach(function(photo)
            {
                var col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

                col.innerHTML =
                    '<div class="card h-100">' +
                        '<img src="' + photo.url + '" class="card-img-top" alt="">' +
                        '<div class="card-body">' +
                            '<p class="card-text text-muted small">' + (photo.caption || '') + '</p>' +
                        '</div>' +
                    '</div>';

                grid.appendChild(col);
            });
        })
        .catch(function(error)
        {
            var grid = document.getElementById('album_grid');
            grid.innerHTML = '<p class="text-danger">Error loading album photos.</p>';
            console.error(error);
        });
}

document.getElementById('create_album_form').addEventListener("submit", create_album);

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
