const FundsPage = require("../pages/FundsPage");
const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const LoginFlow = require("../utils/LoginFlow");
const ScreenshotUtils = require("../utils/ScreenshotUtils");
const TestReport = require("../utils/TestReport");
const FundDetailsPage = require("../pages/FundDetailsPage");
const MFPurchasePage =require("../pages/MFPurchasePage");


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
        new TestReport("MF Default Amount Continue Purchase Test");

    let currentFund = "Unknown";
    let currentSection = "Unknown";


    try {

        // =========================================
        // Test Start
        // =========================================

        console.log("=================================");
        console.log("MF DEFAULT AMOUNT CONTINUE PURCHASE TEST STARTED");
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

        const mfPurchasePage =
            new MFPurchasePage(driver);

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
        // Select Investment Type
        // =========================================

        currentSection = "Investment Type";

        console.log("");
        console.log(
            `Selecting investment type: ${testData.investmentType}`
        );

        await fundDetailsPage.selectInvestmentType(
            testData.investmentType
        );

        // =========================================
        // Read Investment Amount
        // =========================================

        currentSection = "Investment Amount";

        const investmentAmount =
            await mfPurchasePage.getInvestmentAmount();

        if (!investmentAmount) {
            throw new Error("Investment amount is not displayed.");
        }

        console.log(
            `Investment amount displayed: ₹${investmentAmount}`
        );
        // =========================================
        // Continue Purchase
        // =========================================

        currentSection = "Continue Purchase";

        await mfPurchasePage.clickContinuePurchase();

        // =========================================
        // Validate Purchase Payment Screen
        // =========================================

        currentSection = "Purchase Payment Screen";

        const otpScreenDisplayed =
            await mfPurchasePage.isOtpAuthorizationScreenDisplayed();

        if (!otpScreenDisplayed) {
            throw new Error(
                "OTP authorization screen was not displayed."
            );
        }

        console.log(
            "OTP authorization screen displayed."
        );
        // =========================================
        // Test Passed
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("MF DEFAULT AMOUNT CONTINUE PURCHASE VALIDATION COMPLETED");
        console.log("=================================");


        testReport.markPassed();
        testReport.saveReport();
        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("MF DEFAULT AMOUNT CONTINUE PURCHASE TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {


        console.error("");
        console.error("=================================");
        console.error("MF DEFAULT AMOUNT CONTINUE PURCHASE TEST FAILED");
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

