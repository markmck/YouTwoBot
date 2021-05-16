// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const { google } = require('googleapis');
const path = require('path');
const authenticate = require('./googleapi-auth');

// a very simple example of getting data from a playlist
function createPlaylist(playlistTitle) {

  authenticate(
    ['https://www.googleapis.com/auth/youtube']
  ).then(async (authResult) => {

    google.options({ authResult });
    const youtube = google.youtube({ version: 'v3', auth: authResult, });

    // the first query will return data with an etag
    const res = await insertPlaylist(playlistTitle, youtube).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
    },
      function (err) { console.error("Execute error", err); });
  });

}

async function insertPlaylist(title, youtube) {
  return youtube.playlists.insert({
    "part": [
      "snippet,status"
    ],
    "resource": {
      "snippet": {
        "title": title,
        "description": "This is a sample playlist description.",
        "tags": [
          "sample playlist",
          "API call"
        ],
        "defaultLanguage": "en"
      },
      "status": {
        "privacyStatus": "private"
      }
    }
  })
}

if (module === require.main) {
  createPlaylist().catch(console.error);
}
module.exports = createPlaylist;
