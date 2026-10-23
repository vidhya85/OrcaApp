
const { defineConfig } = require('@playwright/test');
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    reporter: 'list',
    use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }
});
