#!/usr/bin/env node
const axios = require('axios');
const cp = require('child_process');
const path = require('path');

const packageName = process.argv[2];
async function shouldStartPackager(port) {
  try {
    const {data} = await axios.get(`http://localhost:${port}/status`);

    if (data === 'packager-status:running') {
      console.log(`Packager already running on port ${port}`);
    } else {
      console.log(`Something else is running on port ${port}!`);
    }

    return false;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return true;
    }

    console.log(`Something else errored on port ${port}`);
    return false;
  }
}

async function startAsNeeded() {
  const metroPath = path.join(
    __dirname,
    'packages',
    packageName,
    'run-metro.command',
  );
  if (await shouldStartPackager(8081)) {
    console.log('Starting up metro on port 8081');
    cp.execSync(`open ${metroPath}`);
  }
}

startAsNeeded();
