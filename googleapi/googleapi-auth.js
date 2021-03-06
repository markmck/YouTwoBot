
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const { google } = require('googleapis');
const people = google.people('v1');

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, '../oauth2.keys.json');
const tokenPath = path.join(__dirname, '../token.json');

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
function authenticate(scopes) {

  let keys = { redirect_uris: [''] };

  if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
  }

  const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
  );

  return new Promise((resolve, reject) => {
    readExistingToken().then(authToken => {
      oauth2Client.credentials = authToken;
      resolve(oauth2Client);
    }, function (err) {
      getNewToken(oauth2Client, scopes).then((authResult) => { resolve(authResult); });
    })
  });
}

function readExistingToken() {
  return new Promise((resolve, reject) =>
    fs.readFile(tokenPath, (err, tokenData) => {
      //if has error reject, otherwise resolve
      return err || tokenData.length === 0 ? reject(err) : resolve(JSON.parse(tokenData));
    })
  );
}

function getNewToken(oauth2Client, scopes) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });

    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3030')
              .searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const { tokens } = await oauth2Client.getToken(qs.get('code'));
            oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates

            console.log("token from oauth:" + JSON.stringify(tokens));

            fs.writeFile(tokenPath, JSON.stringify(tokens), (err) => {
              if (err) return console.error(err);
              console.log('Token stored to', tokenPath);
            });

            resolve(oauth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3030, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: true }).then(cp => cp.unref());
      });
    destroyer(server);
  });
}


module.exports = authenticate;