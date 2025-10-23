const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  // remove CRA's module scope restrictions
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => !(plugin instanceof ModuleScopePlugin)
  );

  // ignore sourcemap warnings from problematic libs
  config.ignoreWarnings = [
    {
      module: /pdfmake\.min\.js/, // regex to match the file
    },
  ];

  return config;
};