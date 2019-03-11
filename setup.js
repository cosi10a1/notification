var fs = require('fs');
var XLSX = require('xlsx');
var child_process = require('child_process');
// var makeInitialProductsJson = require('./tools/makeInitialProductsJson');

let env = 'dev';
let log_enabled = false;
let store_version = '0.0.1';
let sprint = 31;
let build_number = 1;
let json_version = 3;
let version = '';
let EVENTS = undefined;
let CONSTANTS = undefined;

let firebase_project = {
  dev: 'test',
  qc: 'test',
  staging: 'test',
  production: 'default'
};

let FIREBASE_CONFIG = {
  dev: {
    apiKey: 'AIzaSyBsRGTzAE6Fwt6zuD8xI5HQH2AXSR4WFXI',
    authDomain: 'pos-test.phongvu.vn',
    databaseURL: 'https://nhan-vien-phong-vu-test.firebaseio.com',
    projectId: 'nhan-vien-phong-vu-test',
    storageBucket: 'nhan-vien-phong-vu-test.appspot.com'
  },
  qc: {
    apiKey: 'AIzaSyBsRGTzAE6Fwt6zuD8xI5HQH2AXSR4WFXI',
    authDomain: 'pos-test.phongvu.vn',
    databaseURL: 'https://nhan-vien-phong-vu-test.firebaseio.com',
    projectId: 'nhan-vien-phong-vu-test',
    storageBucket: 'nhan-vien-phong-vu-test.appspot.com'
  },
  staging: {
    apiKey: 'AIzaSyBsRGTzAE6Fwt6zuD8xI5HQH2AXSR4WFXI',
    authDomain: 'pos-test.phongvu.vn',
    databaseURL: 'https://nhan-vien-phong-vu-test.firebaseio.com',
    projectId: 'nhan-vien-phong-vu-test',
    storageBucket: 'nhan-vien-phong-vu-test.appspot.com'
  },
  production: {
    apiKey: 'AIzaSyDdOPK1_e5aeu6Cxcc6cU8aojbvYDCzC_s',
    authDomain: 'pos.phongvu.vn',
    databaseURL: 'https://nhan-vien-phong-vu.firebaseio.com',
    projectId: 'nhan-vien-phong-vu',
    storageBucket: 'nhan-vien-phong-vu.appspot.com',
    messagingSenderId: '695316991329'
  }
};

let HOSTS = {
  sso: {
    dev: 'acc.teko.vn',
    qc: 'acc.teko.vn',
    staging: 'acc.teko.vn',
    production: 'acc.teko.vn'
  },
  offlinesales: {
    dev: 'test.offlinesales.teksvr.com',
    qc: 'qc.offlinesales.teksvr.com',
    staging: 'staging.offlinesales.teksvr.com',
    production: 'offlinesales.teko.vn'
  },
  magento: {
    dev: 'moon.tekshop.vn',
    qc: 'moon.shop.teksvr.com',
    staging: 'stg.shop.teksvr.com',
    production: 'phongvu.vn'
  },
  asia: {
    dev: 'dev.pvis.teko.vn',
    qc: 'test.pvis.teko.vn',
    staging: 'staging.pvis.teko.vn',
    production: 'pvis.teko.vn'
  }
};

let DEPLOY_BAT_TEMPLATE =
  '@echo off\n' +
  'set ALIAS=%1\n' +
  'cd production\n' +
  'firebase use %ALIAS%' +
  '\n';

let DEPLOY_SH_TEMPLATE =
  '#!/bin/sh\n' +
  'ALIAS=%1\n' +
  'cd production\n' +
  'firebase use $ALIAS' +
  '\n';

let BUILD_BAT_TEMPLATE =
  '@echo off\n' +
  'set PLATFORM=%1\n' +
  'set CHANNEL=%2\n' +
  '\n' +
  'if "%PLATFORM%"=="ios" (\n' +
  '    echo exp build:ios --release-channel %CHANNEL%\n' +
  '    call exp build:ios --release-channel %CHANNEL%\n' +
  '    goto end\n' +
  ')\n' +
  'if "%PLATFORM%"=="android" (\n' +
  '    echo exp build:android --release-channel %CHANNEL%\n' +
  '    call exp build:android --release-channel %CHANNEL%\n' +
  '    goto end\n' +
  ')\n' +
  'if "%PLATFORM%"=="" (\n' +
  '    echo exp publish --release-channel %CHANNEL%\n' +
  '    call exp publish --release-channel %CHANNEL%\n' +
  '    goto end\n' +
  ')\n' +
  '\n' +
  ':invalid_platform\n' +
  'echo Invalid platforms! available platforms are `ios` and `android`. Call with empty platform to publish only.\n' +
  '\n' +
  ':end\n';

// functions
function convertEnvToNumber(env) {
  switch (env) {
    case 'dev':
      return 1;
    case 'qc':
      return 2;
    case 'staging':
      return 3;
    case 'production':
      return 4;
    default:
      return 1;
  }
}

function patchJSfile(file, content, exec = false) {
  fs.writeFile(__dirname + file, content, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log('The file ' + __dirname + file + ' was saved!');
    if (exec) {
      if (process.platform === 'win32')
        child_process.exec('cmd /c ' + __dirname + file, function(
          error,
          stdout,
          stderr
        ) {});
      else
        child_process.exec('sh ' + __dirname + file, function(
          error,
          stdout,
          stderr
        ) {});
    }
  });
}

function generateConfig() {
  let configObj = {
    _env_: env,
    _version_: version,
    _store_version_: store_version,
    _logEnabled_: log_enabled,
    _hosts_: {},
    _firebase_config_: FIREBASE_CONFIG[env]
  };
  for (let host in HOSTS) {
    configObj._hosts_[`_${host}_`] = HOSTS[host][env];
  }
  let config_str = 'export default ' + JSON.stringify(configObj, null, 2);
  config_str = config_str.replace(/"_/g, '');
  config_str = config_str.replace(/_"/g, '');
  patchJSfile('/src/config/index.js', config_str);
}

function generateTrackingJSON() {
  let workbook = XLSX.readFile('tracking_document.xlsx');
  let meta = XLSX.utils.sheet_to_json(workbook.Sheets['meta']);
  let evts = XLSX.utils.sheet_to_json(workbook.Sheets['events']);
  TRACKING_VERSION = meta[0].tracking_version;
  CONSTANTS = XLSX.utils.sheet_to_json(workbook.Sheets['constants']);
  EVENTS = {};
  groups = [];
  evts.forEach((entry, index) => {
    if (entry) {
      let params = {};
      let datatypes = {
        '[i]': { type: 'INT', count: 0 },
        '[f]': { type: 'FLOAT', count: 0 },
        '[b]': { type: 'BOOLEAN', count: 0 },
        '[s]': { type: 'VARCHAR', count: 0 },
        '[o]': { type: 'JSON', count: 0 }
      };
      for (let i = 1; i <= 20; i++) {
        if (entry['param_' + i]) {
          let splits = entry['param_' + i].split(' ');
          datatypes[splits[1]].count += 1;
          params[i] = {
            name: splits[0],
            sql_type: datatypes[splits[1]].type,
            sql_column:
              datatypes[splits[1]].type + '_' + datatypes[splits[1]].count
          };
        }
      }
      if (groups.indexOf(entry.group) === -1) {
        groups.push(entry.group);
      }
      EVENTS[entry.name] = {
        id: entry.id,
        group: entry.group,
        status: entry.status,
        description: entry.description,
        params
      };
    }
  });

  patchJSfile(
    '/app/config/tracking.json',
    JSON.stringify(
      {
        meta: {
          store_version: meta[0].store_version,
          sprint: meta[0].sprint,
          build_number: meta[0].build_number,
          tracking_version: meta[0].tracking_version,
          autoparams: meta[0].autoparams.split(','),
          groups
        },
        constants: CONSTANTS,
        events: EVENTS
      },
      null,
      2
    )
  );
}

function generateTrackingConstants() {
  let eventNames = [];
  let paramNames = [];

  for (let event_name in EVENTS) {
    if (!eventNames.find(e => e === event_name)) {
      eventNames.push(event_name);
      for (let key in EVENTS[event_name].params) {
        let p = EVENTS[event_name].params[key];
        if (!paramNames.find(e => e === p.name)) {
          paramNames.push(p.name);
        }
      }
    }
  }

  let constants_str = 'export const TRACK_EVENT = {\n';
  constants_str += eventNames
    .map(e => '\t' + e.toUpperCase() + ": '" + e + "'")
    .join(',\n');
  constants_str += '\n}\n\n';
  constants_str += 'export const TRACK_PARAM = {\n';
  constants_str += paramNames
    .map(e => '\t' + e.toUpperCase() + ": '" + e + "'")
    .join(',\n');
  constants_str += '\n}\n\n';
  constants_str += 'export const TRACK_CONSTANT = {\n';
  constants_str += CONSTANTS.map(
    e => '\t' + e.name.toUpperCase() + ': ' + e.value
  ).join(',\n');
  constants_str += '\n}\n';

  patchJSfile('/app/config/TrackingConstants.js', constants_str);
}

function generateFirebaseRules() {
  let events = {};
  let rules = {
    rules: {
      '.read': 'true',
      '.write': 'true'
    }
  };

  for (let event_name in EVENTS) {
    events[event_name] = {
      '.indexOn': ['timestamp', 'user_id', 'app_version']
    };
  }
  rules.rules[`events`] = { events };
  patchJSfile('/firebaseRules.json', JSON.stringify(rules, null, 4));
}

function generateBuildScript() {
  patchJSfile(
    '/build.bat',
    '@echo off\necho remove --log flag to generate build script!'
  );
  setTimeout(() => {
    if (env === 'production') {
      if (!log_enabled) {
        patchJSfile(
          '/build.bat',
          BUILD_BAT_TEMPLATE.replace('%2', `production${production_channel}`)
        );
      }
    } else {
      patchJSfile('/build.bat', BUILD_BAT_TEMPLATE.replace('%2', env));
    }
  }, 2000);
}

function generateDeployScript() {
  setTimeout(() => {
    if (process.platform === 'win32')
      patchJSfile(
        '/deploy.bat',
        DEPLOY_BAT_TEMPLATE.replace('%1', firebase_project[env]),
        true
      );
    else
      patchJSfile(
        '/deploy.sh',
        DEPLOY_SH_TEMPLATE.replace('%1', firebase_project[env]),
        true
      );
  }, 2000);
}

function main() {
  // setup
  let i = process.argv.findIndex(a => a === '--env');
  if (i !== -1) {
    env = process.argv[i + 1];

    if (
      env !== 'dev' &&
      env !== 'qc' &&
      env !== 'staging' &&
      env !== 'production'
    ) {
      console.log(
        'WARNING - ENVIRONMENT SHOULD BE SET TO dev, test, staging OR production'
      );
      console.log(
        "   Do it by passing '--env dev' or  '--env qc' or '--env staging' or '--env production' to command arguments."
      );
      console.log('   Test environment build is activated.');
      env = 'dev';
    }

    if (env === 'production') {
      console.log(
        "WARNING - Set environment to 'production' will affect LIVE tracking data"
      );
      console.log('   Make sure you understand what you are doing.');
      console.log('   PRODUCTION environment build is activated.');
    }

    if (process.argv.findIndex(a => a === '--log') !== -1) {
      log_enabled = true;
    }

    version = `${store_version}.${sprint}${convertEnvToNumber(
      env
    )}${build_number}`;
    console.log(
      `Build app with: ENVIRONMENT=${env} | BUILD_NUMBER=${build_number} | LOG_ENABLED=${log_enabled}`
    );
    // generateTrackingJSON();
    // generateTrackingConstants();
    // generateFirebaseRules();
    generateConfig();
    // generateBuildScript();
    generateDeployScript();
    return;
  }

  // make data
  //   i = process.argv.findIndex(a => a === '--make');
  //   if (i !== -1) {
  //     let env = process.argv[i + 1];
  //     let usePatch = process.argv[i + 2] === 'patch';
  //     makeInitialProductsJson(usePatch, env);
  //     return;
  //   }
}

main();
