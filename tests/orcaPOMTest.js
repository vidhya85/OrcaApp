const { remote } = require("webdriverio");
const assert = require("node:assert/strict");

const WelcomePage = require("../pages/WelcomePage");
const LoginPage = require("../pages/LoginPage");
const OtpPage = require("../pages/OtpPage");
const RiskDisclosurePage = require("../pages/RiskDisclosurePage");
const FundsPage = require("../pages/FundsPage");
const DashboardPage = require("../pages/DashboardPage");

const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");

async function main() {

    const driver = await remote({
        hostname: "127.0.0.1",
        port: 4723,
        path: "/",
        logLevel: "error",

        capabilities: {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "emulator-5554",
            "appium:udid": "emulator-5554",
            "appium:appPackage": "com.enrich.enrichkyc",
            "appium:appActivity": "com.enrich.enrichkyc.MainActivity",

            // Keep session/login data
            "appium:noReset": true
        }
    });


    try {
        await driver.activateApp("com.enrich.enrichkyc");

        console.log("Orca app launched.");

        console.log("=================================");
        console.log("ORCA POM TEST STARTED");
        console.log("=================================");


        // =========================================
        // Create Page Objects
        // =========================================

        const permissionHandler =
            new PermissionHandler(driver);

        const welcomePage =
            new WelcomePage(driver);

        const loginPage =
            new LoginPage(driver);

        const otpPage =
            new OtpPage(driver);

        const riskDisclosurePage =
            new RiskDisclosurePage(driver);

        const fundsPage =
            new FundsPage(driver);

        const dashboardPage =
            new DashboardPage(driver);


        // =========================================
        // Handle Notification Permission
        // =========================================

        await permissionHandler.handleNotificationPermission();


        // =========================================
        // Check Login State
        // =========================================

        const alreadyLoggedIn =
            await dashboardPage.isDisplayed();


        // =========================================
        // ALREADY LOGGED IN
        // =========================================

        if (alreadyLoggedIn) {

            console.log("");
            console.log("=================================");
            console.log("USER ALREADY LOGGED IN");
            console.log("Dashboard detected.");
            console.log("Skipping login and OTP.");
            console.log("=================================");

        }


        // =========================================
        // NEW LOGIN
        // =========================================

        else {

            console.log("");
            console.log("=================================");
            console.log("LOGIN REQUIRED");
            console.log("Dashboard not detected.");
            console.log("Starting login flow.");
            console.log("=================================");


            // -----------------------------------------
            // Welcome Screen
            // -----------------------------------------

            // await welcomePage.clickLetsEnrich();


            // -----------------------------------------
            // Mobile Number
            // -----------------------------------------

            await loginPage.enterMobileNumber(
                testData.mobileNumber
            );


            // -----------------------------------------
            // Send OTP
            // -----------------------------------------

            await loginPage.clickSendOtp();


            // -----------------------------------------
            // OTP
            // -----------------------------------------

            console.log("");
            console.log("Waiting for OTP...");

            await otpPage.waitForOtpEntry();


            // -----------------------------------------
            // Risk Disclosure
            // -----------------------------------------

            await riskDisclosurePage.clickIUnderstand();


            // -----------------------------------------
            // Wait for Dashboard
            // -----------------------------------------

            console.log("");
            console.log("Waiting for Dashboard...");

            await driver.waitUntil(
                async () => {

                    return await dashboardPage.isDisplayed();

                },
                {
                    timeout: 30000,
                    interval: 1000,
                    timeoutMsg:
                        "Dashboard did not appear after login"
                }
            );

            console.log("Login successful.");
            console.log("Dashboard loaded.");
        }
        // =========================================
        // VALIDATE DASHBOARD
        // =========================================

        const dashboardDisplayed =
            await dashboardPage.isDisplayed();

        assert.equal(
            dashboardDisplayed,
            true,
            "Dashboard should be displayed after login handling"
        );

        console.log("Dashboard validation PASSED");

        // =========================================
        // Mutual Funds
        // =========================================

        console.log("");
        console.log("Opening Mutual Funds...");

        await fundsPage.clickMutualFunds();


        // =========================================
        // Equity Funds
        // =========================================

        console.log("");
        console.log("Opening Equity Funds...");

        await fundsPage.selectEquityFunds();


        // =========================================
        // Validate Fund Cards
        // =========================================

        console.log("");
        console.log("Validating Fund Cards...");

        //await fundsPage.validateFundCards();
        await fundsPage.validateAllFundCards();


        // =========================================
        // TEST PASSED
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("ORCA POM TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // TEST FAILED
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error("POM TEST FAILED");
        console.error("=================================");

        console.error(error);

    }


    // =========================================
    // CLEANUP
    // =========================================

    finally {

        try {

            await driver.execute(
                "mobile: terminateApp",
                {
                    appId: "com.enrich.enrichkyc"
                }
            );

            console.log("Orca app closed.");

        }

        catch (error) {

            console.log(
                "Could not close Orca app."
            );

        }


        try {

            await driver.deleteSession();

            console.log(
                "Appium session closed"
            );

        }

        catch (error) {

            console.log(
                "Appium session was already closed."
            );

        }

    }
}

main();