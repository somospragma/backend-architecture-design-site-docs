function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.webpack) {
    pkg.dependencies.webpack = '5.97.1';
  }
  if (pkg.peerDependencies && pkg.peerDependencies.webpack) {
    pkg.peerDependencies.webpack = '5.97.1';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
