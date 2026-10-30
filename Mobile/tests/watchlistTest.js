const WatchlistPage =
    require("../pages/WatchlistPage");

const PermissionHandler =
    require("../utils/PermissionHandler");

const UserLoginFlow =
    require("../utils/UserLoginFlow");

const ScreenshotUtils =
    require("../utils/ScreenshotUtils");

const TestReport =
    require("../utils/TestReport");


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

    const testReport =
        new TestReport("Watchlist Test");

    let currentSection = "Unknown";


    try {

        // =========================================
        // Test Start
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("WATCHLIST TEST STARTED");
        console.log("=================================");


        // =========================================
        // Launch ORCA App
        // =========================================

        currentSection = "Launch App";

        await launchApp(driver);


        // =========================================
        // Initialize Page Objects
        // =========================================

        const permissionHandler =
            new PermissionHandler(driver);

        const userLoginFlow =
            new UserLoginFlow(driver);

        const watchlistPage =
            new WatchlistPage(driver);


        // =========================================
        // Login / Session
        // =========================================

        currentSection = "Login";

        console.log("");
        console.log("Checking login/session...");

        await userLoginFlow.login(
            permissionHandler
        );


        // =========================================
        // Open Watchlist
        // =========================================

        currentSection = "Open Watchlist";

        console.log("");
        console.log("Opening Watchlist...");

        await watchlistPage.clickWatchlist();


        // =========================================
        // Validate W1 - W6
        // =========================================

        currentSection = "Validate W1-W6";

        console.log("");
        console.log(
            "Validating Watchlists W1 to W6..."
        );

        await watchlistPage.validateAllWatchlists();


        // =========================================
        // Select W1
        // =========================================

        currentSection = "Select W1";

        console.log("");
        console.log(
            "Returning to W1..."
        );

        await watchlistPage.clickW1();


        // =========================================
        // Select First Available Item
        // =========================================

        currentSection = "Select First W1 Item";

        console.log("");
        console.log(
            "Selecting first available item in W1..."
        );

        await watchlistPage.clickFirstAvailableItem();


        // =========================================
        // Click BUY
        // =========================================

        currentSection = "Click BUY";

        console.log("");
        console.log(
            "Opening BUY screen..."
        );

        await watchlistPage.clickBuy();


        // =========================================
        // Click Final BUY
        // =========================================

        currentSection = "Confirm BUY";

        console.log("");
        console.log(
            "Confirming BUY order..."
        );

        await watchlistPage.clickFinalBuy();


        // =========================================
        // Validate Order Rejection
        // =========================================

        currentSection = "Validate Order Rejection";

        console.log("");
        console.log(
            "Validating order result..."
        );

        const orderValidation =
            await watchlistPage.validateOrderRejected();


        if (!orderValidation) {

            throw new Error(
                "Buy order validation failed."
            );
        }


        // =========================================
        // Test Passed
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("WATCHLIST VALIDATION COMPLETED");
        console.log("=================================");


        testReport.markPassed();

        testReport.saveReport();

        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("WATCHLIST TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error("WATCHLIST TEST FAILED");
        console.error("=================================");


        console.error(
            "Section:",
            currentSection
        );


        console.error(
            "Error:",
            error.message
        );


        console.error(
            error.stack
        );


        // =========================================
        // Add Failure To Test Report
        // =========================================

        try {

            testReport.addFailedFund(
                "Watchlist",
                currentSection,
                error.message
            );


            testReport.markFailed();

            testReport.saveReport();

            testReport.saveHtmlReport();

        } catch (reportError) {

            console.error(
                "Failed to generate test report:",
                reportError.message
            );
        }


        // =========================================
        // Capture Failure Screenshot
        // =========================================

        try {

            const screenshotName =
                `Watchlist_${currentSection}_Failure`;


            await ScreenshotUtils.capture(
                driver,
                screenshotName
            );

        } catch (screenshotError) {

            console.error(
                "Failed to capture screenshot:",
                screenshotError.message
            );
        }


        // =========================================
        // Re-throw Original Test Failure
        // =========================================

        throw error;

    }


    // =========================================
    // Cleanup
    // =========================================

    finally {

        try {

            await closeDriver(driver);

        } catch (closeError) {

            console.error(
                "Failed to close Appium session:",
                closeError.message
            );
        }
    }
}


main();

