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
            var row = document.querySelector('.row.g-4');
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
            var row = document.querySelector('.row.g-4');
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
            var row = document.querySelector('.row.g-4');
            row.innerHTML = '<h2>' + album.title + '</h2>';

            var back = document.createElement('div');
            back.className = 'col-12 mb-3';
            back.innerHTML = '<button class="btn btn-secondary">Back to Albums</button>';
            back.querySelector('button').addEventListener('click', function()
            {
                load_albums();
            });
            row.appendChild(back);

            var title = document.createElement('div');
            title.className = 'col-12';
            title.innerHTML = '<h3 class="mb-4">' + album.title + '</h3>';
            row.appendChild(title);

            if (album.photos.length === 0)
            {
                row.innerHTML += '<p>No photos in this album.</p>';
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

                row.appendChild(col);
            });
        })
        .catch(function(error)
        {
            var row = document.querySelector('.row.g-4');
            row.innerHTML = '<p class="text-danger">Error loading album photos.</p>';
            console.error(error);
        });
}
