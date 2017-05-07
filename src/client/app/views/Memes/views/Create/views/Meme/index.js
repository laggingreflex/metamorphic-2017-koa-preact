import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default ({
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
  form = require('app/components/utils/form'),
  Store = require('app/store/utils/Store').default(),
  meme,
  state,
} = {}) => @Store.observe

class Meme extends Component {

  meme = meme || new Store('memes/create@v1', {
    caption: '',
  });

  state = state || new Store([
    'error',
    'success',
    'loading',
  ]);

  render({

  } = {}, {
    error,
    success,
    loading,
  } = {}) {
    if (!this.meme.isReady) {
      return 'Loading session...';
    }

    return h('div', {}, [
      Error(error),
      Success(success),
      form.form(::this.onsubmit, [
        form.label('caption'),
        form.input('caption', {
          value: this.meme.term,
          oninput: ({ target: { value } }) => {
            this.meme.caption = value;
          }
        }),

        form.button('Create', { loading }),
      ])
    ]);
  }

  async onsubmit() {
    console.log('onsubmit');
  }
};
