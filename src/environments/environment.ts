// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { Firebase } from './firebase-credentials';

var firebaseConfig = new Firebase();

export const environment = {
  production: false,
  firebase: {
    apiKey: firebaseConfig.config.apiKey,
    authDomain: firebaseConfig.config.authDomain,
    databaseURL: firebaseConfig.config.databaseURL,
    projectId: firebaseConfig.config.projectId,
    storageBucket: firebaseConfig.config.storageBucket,
    messagingSenderId: firebaseConfig.config.messagingSenderId
  }
};
