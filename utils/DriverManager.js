const { remote } = require("webdriverio");

const appConfig = require("../config/appConfig.js");

const APP_PACKAGE =
    appConfig.capabilities["appium:appPackage"];


// =========================================
// CREATE APPIUM DRIVER
// =========================================

async function createDriver() {

    console.log("");
    console.log("Creating Appium session...");

    const driver = await remote({

        ...appConfig,

        logLevel: "error"
    });

    console.log(
        "Appium session created."
    );

    return driver;
}


// =========================================
// LAUNCH ORCA APP
// =========================================

async function launchApp(driver) {

    await driver.activateApp(
        APP_PACKAGE
    );

    console.log(
        "Orca app launched."
    );
}


// =========================================
// CLOSE APPIUM DRIVER
// =========================================

async function closeDriver(driver) {

    if (!driver) {
        return;
    }


    // -----------------------------------------
    // Close Orca App
    // -----------------------------------------

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


    // -----------------------------------------
    // Close Appium Session
    // -----------------------------------------

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


// =========================================
// EXPORT DRIVER FUNCTIONS
// =========================================

module.exports = {
    createDriver,
    launchApp,
    closeDriver
};