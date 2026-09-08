const appConfig = {
    hostname: "127.0.0.1",
    port: 4723,

    capabilities: {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "emulator-5554",
        "appium:appPackage": "com.enrich.enrichkyc",
        "appium:appActivity": "com.enrich.enrichkyc.MainActivity",
        "appium:noReset": true
    }
};

module.exports = appConfig;