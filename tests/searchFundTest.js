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

            "appium:automationName":
                "UiAutomator2",

            "appium:deviceName":
                "emulator-5554",

            "appium:udid":
                "emulator-5554",

            "appium:appPackage":
                "com.enrich.enrichkyc",

            "appium:appActivity":
                "com.enrich.enrichkyc.MainActivity",

            // Keep login/session data
            "appium:noReset": true
        }
    });


    try {

        // =========================================
        // Launch App
        // =========================================

        await driver.activateApp(
            "com.enrich.enrichkyc"
        );

        console.log("Orca app launched.");

        console.log("=================================");
        console.log("SEARCH FUND TEST STARTED");
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

        await permissionHandler
            .handleNotificationPermission();


        // =========================================
        // Check Login State
        // =========================================

        const alreadyLoggedIn =
            await dashboardPage.isDisplayed();


        // =========================================
        // Already Logged In
        // =========================================

        if (alreadyLoggedIn) {

            console.log("");
            console.log(
                "USER ALREADY LOGGED IN"
            );

            console.log(
                "Skipping login and OTP."
            );

        }


        // =========================================
        // New Login
        // =========================================

        else {

            console.log("");
            console.log(
                "LOGIN REQUIRED"
            );

            console.log(
                "Starting login flow."
            );


            // -----------------------------------------
            // Welcome
            // -----------------------------------------

            // Uncomment if required for fresh login
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

            console.log(
                "Waiting for OTP..."
            );

            await otpPage.waitForOtpEntry();


            // -----------------------------------------
            // Risk Disclosure
            // -----------------------------------------

            await riskDisclosurePage
                .clickIUnderstand();


            // -----------------------------------------
            // Wait for Dashboard
            // -----------------------------------------

            await driver.waitUntil(

                async () => {

                    return await dashboardPage
                        .isDisplayed();

                },

                {
                    timeout: 30000,

                    interval: 1000,

                    timeoutMsg:
                        "Dashboard did not appear"
                }
            );

            console.log(
                "Login successful."
            );
        }


        // =========================================
        // Validate Dashboard
        // =========================================

        const dashboardDisplayed =
            await dashboardPage.isDisplayed();

        assert.equal(

            dashboardDisplayed,

            true,

            "Dashboard should be displayed"
        );

        console.log(
            "Dashboard validation PASSED"
        );


        // =========================================
        // Open Mutual Funds
        // =========================================

        console.log("");
        console.log(
            "Opening Mutual Funds..."
        );

        await fundsPage.clickMutualFunds();


        // =========================================
        // Open Search
        // =========================================

        console.log("");
        console.log(
            "Opening Fund Search..."
        );

        await fundsPage.clickSearch();


        // =========================================
        // Search Fund
        // =========================================

        console.log("");

        console.log(
            `Searching for: ${testData.fundSearchKeyword}`
        );

        await fundsPage.searchFund(
            testData.fundSearchKeyword
        );


        // =========================================
        // Click First Visible Fund
        // =========================================

        console.log("");

        console.log(
            "Clicking first visible fund..."
        );

        await fundsPage
            .clickFirstVisibleFund();


        // =========================================
        // Test Passed
        // =========================================

        console.log("");
        console.log("=================================");
        console.log(
            "SEARCH FUND TEST PASSED"
        );
        console.log("=================================");

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error(
            "SEARCH FUND TEST FAILED"
        );
        console.error("=================================");

        console.error(error);

    }


    // =========================================
    // Cleanup
    // =========================================

    finally {

        try {

            await driver.execute(

                "mobile: terminateApp",

                {
                    appId:
                        "com.enrich.enrichkyc"
                }
            );

            console.log(
                "Orca app closed."
            );

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