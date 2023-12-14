// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripe: {
    // publishableKey: 'pk_test_0rY5rGJ7GN1xEhCB40mAcWjg',
    // secretKey: 'sk_test_lUp78O7PgN08WC9UgNRhOCnr'
    publishableKey: 'pk_test_51O3SJ0FB3SqN1KH5uGfMm7ZeXQ0zxqyEp9ZvGczymuOFTQRL3auasOVDowuzMu58P9W6Yh0at8AyNQqeIPEKAS0N00ML7a851A',
    secretKey: 'sk_test_51O3SJ0FB3SqN1KH5L7nF9RQkC0FIacFI93mstPgbyQni5blpxjWitWJdhuNQJoZ9x9SeP6ZaAFC4R04RVbbJ030Z00JHHZpy2G'
  },
  api: 'http://172.17.2.194:8028/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
