#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const packageJson = require("../package.json");

const scripts = `"start": "cross-env NODE_ENV=development webpack serve --config configs/webpack/webpack.config.ts --mode development --progress",
    "build": "cross-env NODE_ENV=production webpack --config configs/webpack/webpack.config.ts --mode production --progress --profile",
    "prelint": "yarn tsc",
    "lint": "yarn lint:js && yarn lint:css",
    "lint:js": "eslint . --ext .ts,.tsx",
    "lint:css": "stylelint \\"./src/**/*.scss\\"",
    "storybook": "start-storybook -p 6006 -c ./configs/storybook",
    "build-storybook": "build-storybook -c ./configs/storybook"`;

const getDeps = (deps) =>
  Object.entries(deps)
    .map((dep) => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, " ")
    .replace(/^/g, "")
    .replace(/fs-extra[^\s]+/g, "");

console.log("Initializing project..");

exec(
  `mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(`Everything was fine, then it wasn't:
    ${initErr}`);
      return;
    }

    const packageJSON = `${process.argv[2]}/package.json`;
    fs.readFile(packageJSON, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace(
          '"test": "echo \\"Error: no test specified\\" && exit 1"',
          scripts
        )
        .replace('"main": "index.js"', '"main": "index.tsx"')
        .replace('"author": ""', '"author": "Roman Malyuzhinets"');
      fs.writeFile(packageJSON, data, (err2) => err2 || true);
    });

    const filesToCopy = [
      "tsconfig.json",
      ".stylelintrc",
      ".eslintrc.js",
      ".eslintignore",
      "src/index.tsx",
      "src/types/global.d.ts",
      "src/app/App.tsx",
      "src/app/styles/index.scss",
      "src/app/styles/index.scss",
      "public/index.html",
      "configs/eslint-ts/index.js",
      "configs/jest/setupTests.ts",
      "configs/webpack/types.ts",
      "configs/webpack/webpack.config.ts",
    ];

    // Promise.all(filesToCopy.map((file) => {
    //   fs.ensureFile(`${process.argv[2]}/${file}`, err => {
    //     // console.log(err)
    //   })
    // }))

    for (let i = 0; i < filesToCopy.length; i += 1) {
      fs.ensureFile(`${process.argv[2]}/${filesToCopy[i]}`, err => {
        console.log(err)
      })

      // fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
      //   fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`),
      // );
      console.log('cycle')
    }


    https.get(
      "https://raw.githubusercontent.com/janglz/cra-clean-template/master/.gitignore",
      (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (data) => {
          body += data;
        });
        res.on("end", () => {
          fs.writeFile(
            `${process.argv[2]}/.gitignore`,
            body,
            { encoding: "utf-8" },
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    );

    console.log('yarn init -- done\n');

    // installing dependencies
    console.log("Installing deps -- it might take a few minutes..");
    const devDeps = getDeps(packageJson.devDependencies);
    const deps = getDeps(packageJson.dependencies);
    exec(
      `cd ./${process.argv[2]} && git init && node -v && yarn -v && yarn add ${devDeps} -D && yarn add ${deps}`,
      (npmErr, npmStdout, npmStderr) => {
        if (npmErr) {
          console.error(`Some error while installing dependencies
          ${npmErr}
          ${npmStderr}`);
          return;
        }
        console.log('stdOut', npmStdout);
        console.log("Dependencies installed");

        console.log("Copying additional files..");
        // copy additional source files
        Promise.all([
          fs.copy(path.join(__dirname, "../src"), `${process.argv[2]}/src`),
          fs.copy(path.join(__dirname, "../tsconfig.json"), `${process.argv[2]}/tsconfig.json`),
          fs.copy(path.join(__dirname, "../public"), `${process.argv[2]}/public`),
          fs.copy(path.join(__dirname, "../.stylelintrc"), `${process.argv[2]}/.stylelintrc`),
          fs.copy(path.join(__dirname, "../.eslintrc.js"), `${process.argv[2]}/.eslintrc.js`),
          fs.copy(path.join(__dirname, "../.eslintignore"), `${process.argv[2]}/.eslintignore`),
          fs.copy(path.join(__dirname, "../configs"), `${process.argv[2]}/configs`),
          // "tsconfig.json",
          // ".stylelintrc",
          // ".eslintrc.js",
          // ".eslintignore",
          // "src/index.tsx",
          // "src/types/global.d.ts",
          // "src/app/App.tsx",
          // "src/app/styles/index.scss",
          // "src/app/styles/index.scss",
          // "public/index.html",
          // "configs/eslint-ts/index.js",
          // "configs/jest/setupTests.ts",
          // "configs/webpack/types.ts",
          // "configs/webpack/webpack.config.ts",
        ])
          .then(() =>
            console.log(
              `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${process.argv[2]}\nyarn start`
            )
          )
          .catch((err) => console.error(err));
      }
    );
  }
);