import 'font-awesome/css/font-awesome.css';
// import 'material-design-lite/material.css';
// import 'material-design-lite/material.js';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'bulma/css/bulma.css';
import 'toastr/build/toastr.css';
// import 'jquery';
// import 'bootstrap/dist/js/bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
import 'preact-material-components/style.css';
import offline from 'offline-plugin/runtime';
import * as app from 'app';
import './assets/fonts';
import './index.styl';

(async() => {
  document.getElementById('loading').style.display = 'none';
  if (window.onModulesLoaded) {
    if (window.sessionLoaded) {
      await window.sessionLoaded;
    }
    await app.loadSession();
    app.render();
    window.onModulesLoaded();
  } else {
    app.render();
    const { getUpdates } = await app.loadSession();
    await getUpdates();
    if (process.env.NODE_ENV === 'production') {
      offline.install();
    }
  }
})();
