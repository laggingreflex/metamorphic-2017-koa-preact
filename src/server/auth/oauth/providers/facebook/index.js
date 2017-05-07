import { Providers } from '../../purest';
import config from '../../../../../../config'

export const grantConfig = {
  key: config.facebookOauthKey,
  secret: config.facebookOauthSecret,
  scope: [
    'https://www.facebookapis.com/auth/userinfo.email',
    'https://www.facebookapis.com/auth/userinfo.profile',
    'https://www.facebookapis.com/auth/plus.me',
  ],
};

export async function getProfile(auth) {
  const [, result] = await Providers.facebook
    .query()
    .get('me')
    .auth(access_token).request();
  const { displayName: name, emails: [{ value: email }] } = result;
  return { name, email };
}

export default require(__filename);
