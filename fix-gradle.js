#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fix = !process.argv.includes('break');
const gradlePath = path.join(__dirname, 'node_modules/react-native-code-push/android/codepush.gradle');

const badVersion = `if (config.root) {
            nodeModulesPath = Paths.get(config.root, "/node_modules");
        } else if (project.hasProperty('nodeModulesPath')) {
            nodeModulesPath = project.nodeModulesPath
        } else {
            nodeModulesPath = "../../node_modules";
        }`;

const goodVersion = `if (project.hasProperty('nodeModulesPath')) {
            nodeModulesPath = project.nodeModulesPath
        } else if (config.root) {
            nodeModulesPath = Paths.get(config.root, "/node_modules");
        } else {
            nodeModulesPath = "../../node_modules";
        }`

const originalContents = fs.readFileSync(gradlePath).toString();
let newContents;
if (fix) {
  newContents = originalContents.replace(badVersion, goodVersion);
} else {
  newContents = originalContents.replace(goodVersion, badVersion);
}
if (newContents == originalContents) {
  console.error('nothing changed');
  process.exit(1);
}

fs.writeFileSync(gradlePath, newContents);
