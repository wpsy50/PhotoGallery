# Photo Gallery API Documentation

## Albums

### GET /api/albums
**Description:** Retrives a list of all albums.

**Example response**

    {
        "album_id": 1,
        "title": "Test Album",
        "description": "This is a test album",
        "created_at": "2006-11-15",
        "last_updated": "2006-11-15"
    }

**Status codes:**
200 for expected result

### GET /api/albums/:album_id
**Description:** Retrieves details of a specific album, including its photos

**Parameters** 

album_id, Type: int, Description: ID of the album to retrieve

**Example response**

    {
        "album_id": 1,
        "title": "Test Album",
        "description": "This is a test album",
        "created_at": "2006-11-15",
        "last_updated": "2006-11-15",
        "photos": 
        [
            {
                "photo_id": 1,
                "album_id": 1,
                "url": "/data/uploads/test.png",
                "caption": "Test photo",
                "uploaded_at":"2006-11-15"
            }
        ]
    }



