import config from '../../../../../../config';
import { Providers } from '../../purest';

export const grantConfig = {
  key: config.googleOauthKey,
  secret: config.googleOauthSecret,
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/plus.me',
  ],
};

export async function getProfile(auth) {
  const [, result] = await Providers.google
    .query('plus')
    .select('people/me')
    .auth(auth).request();
  const { displayName: name, emails: [{ value: email }] } = result;
  return { name, email };
}

export default require(__filename);
