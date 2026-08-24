const FundsPage = require("../pages/FundsPage");

const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const LoginFlow = require("../utils/LoginFlow");

const {
    createDriver,
    launchApp,
    closeDriver
} = require("../utils/DriverManager");


async function main() {

    // =========================================
    // Create Appium Driver
    // =========================================

    const driver = await createDriver();


    try {

        // =========================================
        // Launch Orca App
        // =========================================

        await launchApp(driver);

        console.log("=================================");
        console.log("EQUITY FUNDS TEST STARTED");
        console.log("=================================");


        // =========================================
        // Create Page Objects / Utilities
        // =========================================

        const permissionHandler =
            new PermissionHandler(driver);

        const fundsPage =
            new FundsPage(driver);

        const loginFlow =
            new LoginFlow(
                driver,
                testData
            );


        // =========================================
        // Handle Notification Permission
        // =========================================

        await permissionHandler
            .handleNotificationPermission();


        // =========================================
        // Login / Already Logged In
        // =========================================

        await loginFlow.ensureLoggedIn();


        // =========================================
        // Validate Dashboard
        // =========================================

        await loginFlow.validateDashboard();


        // =========================================
        // Open Mutual Funds
        // =========================================

        console.log("");
        console.log("Opening Mutual Funds...");

        await fundsPage.clickMutualFunds();


        // =========================================
        // Select Equity Funds
        // =========================================

        console.log("");
        console.log("Opening Equity Funds...");

        await fundsPage.selectEquityFunds();


        // =========================================
        // Validate All Equity Fund Cards
        // =========================================

        console.log("");
        console.log("Validating Fund Cards...");

        await fundsPage.validateAllFundCards();


        // =========================================
        // TEST PASSED
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("EQUITY FUNDS TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // TEST FAILED
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error("EQUITY FUNDS TEST FAILED");
        console.error("=================================");

        console.error(error);

    }


    // =========================================
    // CLEANUP
    // =========================================

    finally {

        await closeDriver(driver);

    }
}


main();