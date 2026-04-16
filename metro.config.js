const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// The `promise` package is nested inside react-native/node_modules/ rather
// than hoisted to the top level.  @sentry/react-native imports from
// `promise/setimmediate/done` which Metro can't resolve from Sentry's
// location.  Point the resolver at the nested copy so all imports work.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  promise: path.resolve(__dirname, 'node_modules/react-native/node_modules/promise'),
};

module.exports = config;
