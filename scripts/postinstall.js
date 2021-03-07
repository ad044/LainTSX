// https://github.com/pmndrs/react-spring/issues/1078
// thanks to https://github.com/pmndrs/react-spring/issues/1078#issuecomment-677528907

const replace = require("replace-in-file");

const removeAllSideEffectsFalseFromReactSpringPackages = async () => {
  try {
    const results = await replace({
      files: "node_modules/@react-spring/*/package.json",
      from: `"sideEffects": false`,
      to: `"sideEffects": true`,
    });

    // console.log(results); // uncomment to log changed files
  } catch (e) {
    console.log(
      'error while trying to remove string "sideEffects:false" from react-spring packages',
      e
    );
  }
};

removeAllSideEffectsFalseFromReactSpringPackages();
