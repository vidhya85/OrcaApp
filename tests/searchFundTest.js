const FundsPage = require("../pages/FundsPage");
const FundDetailsPage = require("../pages/FundDetailsPage");

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
        console.log("SEARCH FUND TEST STARTED");
        console.log("=================================");


        // =========================================
        // Create Page Objects / Utilities
        // =========================================

        const permissionHandler =
            new PermissionHandler(driver);

        const fundsPage =
            new FundsPage(driver);

        const fundDetailsPage =
            new FundDetailsPage(driver);

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
        // Open Fund Search
        // =========================================

        console.log("");
        console.log("Opening Fund Search...");

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
        // Click First Matching Fund
        // =========================================

        console.log("");
        console.log(
            "Clicking first matching fund..."
        );

        await fundsPage.clickFirstVisibleFund(
            testData.fundSearchKeyword
        );


        // =========================================
        // Validate Fund Details
        // =========================================

        console.log("");
        console.log(
            "Validating Fund Details..."
        );

        await fundDetailsPage.validateAllTabs();


        // =========================================
        // TEST PASSED
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("SEARCH FUND TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // TEST FAILED
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error("SEARCH FUND TEST FAILED");
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