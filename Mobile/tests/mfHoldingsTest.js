const {
    createDriver,
    launchApp,
    closeDriver
} = require("../utils/DriverManager");

const UserLoginFlow =
    require("../utils/UserLoginFlow");

const PermissionHandler =
    require("../utils/PermissionHandler");

const FundsPage =
    require("../pages/FundsPage");

const HoldingsPage =
    require("../pages/HoldingsPage");

const TestReport =
    require("../utils/TestReport");

const ScreenshotUtils =
    require("../utils/ScreenshotUtils");


async function main() {

    const driver = await createDriver();

    const testReport =
        new TestReport("MF Holdings Test");

    let currentSection = "Login";
    let currentFund = "Mutual Fund Holdings";

    try {

        console.log("");
        console.log("=================================");
        console.log("MF HOLDINGS TEST STARTED");
        console.log("=================================");


        // -----------------------------------------
        // Launch App
        // -----------------------------------------

        await launchApp(driver);


        // -----------------------------------------
        // Initialize Page Objects
        // -----------------------------------------

        const permissionHandler =
            new PermissionHandler(driver);

        const userLoginFlow =
            new UserLoginFlow(driver);

        const fundsPage =
            new FundsPage(driver);

        const holdingsPage =
            new HoldingsPage(driver);


        // -----------------------------------------
        // Login / Existing Session
        // -----------------------------------------

        currentSection = "Login";

        const loginResult =
            await userLoginFlow.login(permissionHandler);

        const userType =
            loginResult.userType;

        const landingPage =
            loginResult.landingPage;


        console.log("");
        console.log("User Type:", userType);
        console.log("Landing Page:", landingPage);


        // -----------------------------------------
        // Navigate to Mutual Funds
        // -----------------------------------------

        currentSection = "Mutual Funds";

        if (landingPage === "DASHBOARD") {

            console.log("");
            console.log(
                `${userType} user - Opening Mutual Funds...`
            );

            await fundsPage.clickMutualFunds();

        } else if (landingPage === "MUTUAL_FUNDS") {

            console.log("");
            console.log(
                `${userType} user - Already on Mutual Funds page.`
            );

        } else {

            throw new Error(
                `Unknown landing page: ${landingPage}`
            );

        }


        // -----------------------------------------
        // Open Mutual Fund Holdings
        // -----------------------------------------

        currentSection = "Holdings";

        console.log("");
        console.log("=================================");
        console.log("OPENING MUTUAL FUND HOLDINGS");
        console.log("=================================");

        await holdingsPage.clickHoldingsTab();



        // -----------------------------------------
        // Validate Holdings
        // -----------------------------------------

        console.log("");
        console.log("=================================");
        console.log("VALIDATING MUTUAL FUND HOLDINGS");
        console.log("=================================");

        await holdingsPage.verifyAllHoldings();


        // -----------------------------------------
        // Test Passed
        // -----------------------------------------

        testReport.addPassedFund(
            "Mutual Fund Holdings"
        );

        testReport.markPassed();

        testReport.saveReport();

        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("MF HOLDINGS TEST PASSED");
        console.log("=================================");


    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("MF HOLDINGS TEST FAILED");
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


        // -----------------------------------------
        // Add Failure To Test Report
        // -----------------------------------------

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


        // -----------------------------------------
        // Capture Failure Screenshot
        // -----------------------------------------

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


        // -----------------------------------------
        // Re-throw Original Error
        // -----------------------------------------

        throw error;


    } finally {

        // -----------------------------------------
        // Safe Appium Session Cleanup
        // -----------------------------------------

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