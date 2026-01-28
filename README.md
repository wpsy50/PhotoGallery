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

**Status Codes**

200 for expected result

### GET /api/albums/:album_id
**Description:** Retrieves details of a specific album, including its photos

**Parameters** 

album_id, Type: int, Description: ID of the album to retrieve

**Example Response**

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

**Status Codes**

200 for album found

404 for album not found

### POST /api/albums
**Description:** Creates a new album

**Parameters**

title, required, Type: string, Description: Displayed name of the album

description, non-required, Type: string, Description: Additional information about the album displayed when opened

**Request**

    {
        "title": "New Album",
        "description": "Album description"
    }

**Status Codes**

200 for valid parameters given

400 for title missing

### GET /api/photos
**Description:** Displays all photos

**Example Response** 

    {
        "photo_id": 1,
        "album_id": 1,
        "url": "/data/uploads/test.png",
        "caption": "Test photo",
        "uploaded_at":"2006-11-15"
    }

**Status Codes**

200 for expected result

### GET /api/photos/:photo_id
**Description:** Retrieves details of a specific photo

**Parameters**

photo_id, Type: int, Description: ID of the photo to retreive

**Example Response**

    {
        "photo_id": 1,
        "album_id": 1,
        "url": "/data/uploads/test.png",
        "caption": "Test photo",
        "uploaded_at":"2006-11-15"
    }

**Status Codes**

200 for photo found

404 for photo not found

### POST /api/photos
**Description:** Uploads a new photo and assigns it to an album

**Parameters**

photo_file, required, Type: file. Description: The photo file to be uploaded

album_id, required, Type: int, Description: The ID of the album the photo is to be added to

caption, non-required, Type: string, Description: The title displayed alongside the photo

**Request**

    {
        "photo_id": 1,
        "album_id": 1,
        "url": "/data/uploads/test.png",
        "caption": "Test photo",
        "uploaded_at":"2006-11-15"
    }

**Status Codes**

200 for photo upload successful

400 for missing file or album_id

### DELETE /api/photos/:photo_id
**Description:** Deletes a photo from the server

**Parameters**

photo_id, Type: int, Description: ID of the photo to be deleted

**Status Codes**

200 for photo deleted successful
404 for invalid photo_id

