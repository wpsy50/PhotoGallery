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

