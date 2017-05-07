export default ({
  Store = require('app/store/utils/Store').default(),
  initial = window.profileStore || {},
} = {}) => new class Profile extends Store {
  constructor(
    namespace = 'Profile/v1',
  ) {
    super(namespace, initial);
  }
}();
