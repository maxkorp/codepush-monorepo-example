const blacklist = require('metro-config/src/defaults/blacklist');
const getWorkspaces = require('get-yarn-workspaces');
const path = require('path');

function getConfig(from, options = {}) {
  const workspaces = getWorkspaces(from);

  function getProjectRoots() {
    return workspaces.concat([
      options.nodeModules || path.resolve(from, '..', '..', 'node_modules'),
      path.join(__dirname, 'node_modules'),
      // There is some sort of React-Native issue causing android to not
      // properly find stuff in a package (it can route
      // `assets/../shared-mobile/stuff.file` but not
      // `shared-mobile/stuff.file`), so we let it try to resolve out
      // of `packages` as well.
      path.join(__dirname, '..'),
      // As above, except it's including `node_modules`,
      // so we need to let it resolve out of the root
      path.join(__dirname, '../..'),
    ]);
  }

  const config = {
    watchFolders: getProjectRoots(),
    resolver: {
      blacklistRE: blacklist(
        workspaces.map(
          workspacePath =>
            `/${workspacePath.replace(
              /\//g,
              '[/\\\\]',
            )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`,
        ),
      ),
      extraNodeModules: {
        '@babel/runtime': path.resolve(from, 'node_modules/@babel/runtime'),
        'react-native': path.resolve(from, 'node_modules/react-native'),
      },
    },
  };
  return config;
}

module.exports = getConfig(__dirname);
