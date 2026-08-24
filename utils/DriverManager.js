const { remote } = require("webdriverio");

const APP_PACKAGE = "com.enrich.enrichkyc";
const APP_ACTIVITY = "com.enrich.enrichkyc.MainActivity";

async function createDriver() {

    const driver = await remote({

        hostname: "127.0.0.1",
        port: 4723,
        path: "/",

        logLevel: "error",

        capabilities: {

            platformName: "Android",

            "appium:automationName":
                "UiAutomator2",

            "appium:deviceName":
                "emulator-5554",

            "appium:udid":
                "emulator-5554",

            "appium:appPackage":
                APP_PACKAGE,

            "appium:appActivity":
                APP_ACTIVITY,

            // Keep login/session data
            "appium:noReset": true
        }
    });

    return driver;
}


async function launchApp(driver) {

    await driver.activateApp(
        APP_PACKAGE
    );

    console.log(
        "Orca app launched."
    );
}


async function closeDriver(driver) {

    if (!driver) {
        return;
    }

    try {

        await driver.execute(
            "mobile: terminateApp",
            {
                appId: APP_PACKAGE
            }
        );

        console.log(
            "Orca app closed."
        );

    } catch (error) {

        console.log(
            "Could not close Orca app."
        );
    }


    try {

        await driver.deleteSession();

        console.log(
            "Appium session closed."
        );

    } catch (error) {

        console.log(
            "Appium session was already closed."
        );
    }
}


module.exports = {
    createDriver,
    launchApp,
    closeDriver
};