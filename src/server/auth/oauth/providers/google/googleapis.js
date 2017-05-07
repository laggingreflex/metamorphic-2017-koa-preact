import google from 'googleapis';

const OAuth2 = google.auth.OAuth2;
const oauth2 = google.oauth2('v2');

export function getClient(tokens) {
  const client = new OAuth2(
    config.googleOauthKey,
    config.googleOauthSecret,
  );
  client.setCredentials(tokens);
  return client;
}

export const getProfile = (tokens) => new Promise((resolve, reject) => {
  oauth2.userinfo.v2.me.get({
    fields: 'email,name',
    auth: getClient(tokens),
  }, (err, res) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(res);
  });
});

export default require(__filename);
