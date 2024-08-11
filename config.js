// config.js
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.iching-throws');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = { loadConfig, saveConfig };