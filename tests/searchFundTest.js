const FundsPage = require("../pages/FundsPage");
const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const LoginFlow = require("../utils/LoginFlow");
const FundDetailsPage = require("../pages/FundDetailsPage");
const ScreenshotUtils = require("../utils/ScreenshotUtils");
const TestReport = require("../utils/TestReport");


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
        new TestReport("Search Fund Test");

    let currentFund = "Unknown";
    let currentSection = "Unknown";


    try {

        // =========================================
        // Test Start
        // =========================================

        console.log("=================================");
        console.log("SEARCH FUND TEST STARTED");
        console.log("=================================");


        // =========================================
        // Launch ORCA App
        // =========================================

        await launchApp(driver);


        // =========================================
        // Initialize Page Objects
        // =========================================

        const permissionHandler =
            new PermissionHandler(driver);

        const loginFlow =
            new LoginFlow(driver, testData);

        const fundsPage =
            new FundsPage(driver);

        const fundDetailsPage =
            new FundDetailsPage(driver);


        // =========================================
        // Login / Session
        // =========================================

        currentSection = "Login";

        await loginFlow.ensureLoggedIn(
            permissionHandler
        );


        // =========================================
        // Open Mutual Funds
        // =========================================

        currentSection = "Mutual Funds";

        console.log("");
        console.log("Opening Mutual Funds...");

        await fundsPage.clickMutualFunds();


        // =========================================
        // Open Fund Search
        // =========================================

        currentSection = "Fund Search";

        console.log("");
        console.log("Opening Fund Search...");

        await fundsPage.clickSearch();


        // =========================================
        // Search Fund
        // =========================================

        currentSection = "Search";

        console.log("");
        console.log(
            `Searching for: ${testData.fundSearchKeyword}`
        );

        await fundsPage.searchFund(
            testData.fundSearchKeyword
        );


        // =========================================
        // Open First Matching Fund
        // =========================================

        currentSection = "Fund Selection";

        console.log("");
        console.log(
            "Clicking first matching fund..."
        );

        currentFund = await fundsPage.clickFirstVisibleFund();


        // =========================================
        // Validate Fund Details
        // =========================================

        currentSection = "Fund Details";

        console.log("");
        console.log(
            "Validating Fund Details..."
        );

        await fundDetailsPage.validateAllTabs();
        testReport.addPassedFund(currentFund);


        // =========================================
        // Test Passed
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("SEARCH FUND VALIDATION COMPLETED");
        console.log("=================================");


        testReport.markPassed();
        testReport.saveReport();
        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("SEARCH FUND TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {

        console.error("");
        console.error("=================================");
        console.error("SEARCH FUND TEST FAILED");
        console.error("=================================");


        console.error(
            "Fund:",
            currentFund
        );


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
                currentFund,
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
                `${currentFund}_${currentSection}_Failure`;


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

