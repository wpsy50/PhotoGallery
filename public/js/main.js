document.addEventListener('DOMContentLoaded', () =>
{
    load_albums();
});

let current_album_id = null;

function load_albums()
{
    fetch('/api/albums')
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Server error:');
            }
            return response.json();
        })
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
            const retry = confirm('Error loading albums. Retry?');
            if (retry)
            {
                load_albums();
            }
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
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Server error:');
            }
            return response.json();
        })
        .then(album =>
        {
            const title = document.createElement('div');
            title.className = 'col-12 mb-3';
            title.innerHTML = '<h2>' + album.title + '</h2><p class="text-muted">' + (album.description || 'No description') + '</p>';
            grid.appendChild(title);

            var sort_div = document.createElement('div');
            sort_div.className = 'col-12 mb-3';
            sort_div.innerHTML =
                '<div class="card">' +
                    '<div class="card-body">' +
                        '<label>Sort by: </label>' +
                        '<select id="sort_photos_select" class="form-select d-inline-block w-auto ms-2">' +
                            '<option value="newest">Newest First</option>' +
                            '<option value="oldest">Oldest First</option>' +
                            '<option value="a_to_z">A-Z</option>' +
                            '<option value="z_to_a">Z-A</option>' +
                        '</select>' +
                    '</div>' +
                '</div>';
            grid.appendChild(sort_div);

            const sort_select = document.getElementById('sort_photos_select');
            sort_select.addEventListener('change', function()
            {
                sort_and_display_photos(album.photos, sort_select.value);
            });

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
                .then(response =>
                {
                    if (!response.ok)
                    {
                        throw new Error('Server error:');
                    }
                    return response.json();
                })
                .then(photo =>
                {
                    upload_form.reset();
                    load_album_photos(album_id);
                })
                .catch(function(error)
                {
                    const retry = confirm('Error loading albums. Retry?');
                    if (retry)
                    {
                        load_albums();
                    }
                });
            });

            sort_and_display_photos(album.photos, 'newest');
        })
        .catch(error =>
        {
            const retry = confirm('Error loading albums. Retry?');
            if (retry)
            {
                load_albums();
            }
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
    .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Server error:');
            }
            return response.json();
        })
    .then(album =>
    {
        document.getElementById("create_album_form").reset();
        load_albums();
    })
    .catch(error =>
    {
        const retry = confirm('Error loading albums. Retry?');
        if (retry)
        {
            load_albums();
        }
    });
}

function sort_and_display_photos(photos, sort_type)
{
    const grid = document.getElementById('album_grid');
    var existing_photos = grid.querySelectorAll('.col-12.col-sm-6.col-md-4.col-lg-3.mb-3');
    existing_photos.forEach(photo => photo.remove());

    if(!photos || photos.length === 0)
    {
        const no_photos = document.createElement('div');
        no_photos.className = 'col-12';
        no_photos.innerHTML = '<p>No photos in this album.</p>';
        grid.appendChild(no_photos);
        return;
    }

    if (sort_type === 'newest')
    {
        photos.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
    }
    else if (sort_type === 'oldest')
    {
        photos.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
    }
    else if (sort_type === 'a_to_z')
    {
        photos.sort((a, b) => a.caption.localeCompare(b.caption));
    }
    else if (sort_type === 'z_to_a')
    {
        photos.sort((a, b) => b.caption.localeCompare(a.caption));
    }

    photos.forEach(photo =>
    {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-3';
        col.innerHTML =
            '<div class="card h-100">' +
                '<img src="' + photo.url + '" class="card-img-top" alt="' + (photo.caption || 'Photo') + '">' +
                '<div class="card-body">' +
                    '<p class="card-text">' + (photo.caption || '') + '</p>' +
                    '<button type="button" onclick="delete_photo(' + photo.photo_id + ')">✖</button>' +
                '</div>' +
            '</div>';
        grid.appendChild(col);
    });
}

function delete_photo(photo_id)
{
    if (!confirm('Are you sure you want to delete this photo?'))
    {
        return;
    }

    fetch('/api/photos/' + photo_id,
    {
        method: 'DELETE'
    })
    .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Server error:');
            }
            return response.json();
        })
    .then(data =>
    {
        if (current_album_id)
        {
            load_album_photos(current_album_id);
        }
    })
    .catch(error =>
    {
        const retry = confirm('Error loading albums. Retry?');
        if (retry)
        {
            load_albums();
        }
    });
}