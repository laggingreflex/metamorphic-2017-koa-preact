import { prompt, confirm } from 'enquire-simple';
import { User as getUserModel } from '../src/server/db/mongo/models';
import { connect } from '../src/server/db/mongo/utils';

const User = getUserModel();

export default async() => {
  try {
    await connect();
    const email = await prompt('Enter an email:');
    let user = await User.findOne({ email });
    if (user && !await confirm('User with that email exists. Overwrite?')) {
      return process.exit(0);
    }
    const password = await prompt('Enter a password:');
    const isAdmin = await confirm('Is user an admin?');
    user = user || new User({ email });
    await user.storeHash(password);
    if (isAdmin) {
      user.role.admin = true;
    }
    await user.save();
    console.log(user);
    console.log('SUCCESS! User created');
    return process.exit(0);
  } catch (err) {
    console.log('FAILED!');
    console.error(err);
    throw err;
  }
};
