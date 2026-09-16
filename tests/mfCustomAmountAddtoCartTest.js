const FundsPage = require("../pages/FundsPage");
const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const LoginFlow = require("../utils/LoginFlow");
const ScreenshotUtils = require("../utils/ScreenshotUtils");
const TestReport = require("../utils/TestReport");
const FundDetailsPage = require("../pages/FundDetailsPage");
const MFPurchasePage = require("../pages/MFPurchasePage");


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
        new TestReport("MF Custom Amount Add To Cart Test");

    let currentFund = "Unknown";
    let currentSection = "Unknown";


    try {

        // =========================================
        // Test Start
        // =========================================

        console.log("=================================");
        console.log("MF CUSTOM AMOUNT ADD TO CART TEST STARTED");
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

        /// =========================================
        // Enter Custom Investment Amount
        // =========================================

        currentSection = "Investment Amount";

        const investmentAmount =
            testData.investmentAmount;

        await mfPurchasePage.enterInvestmentAmount(
            investmentAmount
        );

        // =========================================
        // Validate Entered Investment Amount
        // =========================================

        const enteredAmount =
            await mfPurchasePage.getInvestmentAmount();

        const actualAmount =
            enteredAmount.replace(/,/g, "");

        if (actualAmount !== String(investmentAmount)) {
            throw new Error(
                `Investment amount was not entered correctly. ` +
                `Expected: ${investmentAmount}, ` +
                `Actual: ${enteredAmount}`
            );
        }

        console.log(
            `Investment amount validated: ₹${enteredAmount}`
        );
        // =========================================
        // Add Investment To Cart
        // =========================================

        currentSection = "Add To Cart";

        const cartCountBefore =
            await mfPurchasePage.getCartCount();

        await mfPurchasePage.clickAddToCart();

        await driver.pause(2000);

        /*console.log("");
        console.log("Page source after Add to Cart:");
        console.log(await driver.getPageSource());*/

        const cartCountAfter =
            await mfPurchasePage.getCartCount();

        if (cartCountAfter !== cartCountBefore + 1) {
            throw new Error(
                `Cart count did not increase correctly. ` +
                `Before: ${cartCountBefore}, ` +
                `After: ${cartCountAfter}`
            );
        }

        console.log(
            `Cart count increased from ${cartCountBefore} to ${cartCountAfter}.`
        );


        // =========================================
        // Open Cart
        // =========================================

        currentSection = "Cart";

        console.log("");
        console.log("Opening Cart...");

        await mfPurchasePage.clickCartIcon();

        const cartDisplayed =
            await mfPurchasePage.isCartScreenDisplayed();

        if (!cartDisplayed) {
            throw new Error(
                "Mutual Funds Cart screen was not displayed."
            );
        }

        console.log(
            "Mutual Funds Cart screen displayed."
        );


        // =========================================
        // Pay
        // =========================================

        currentSection = "Payment";

        await mfPurchasePage.clickPay();

        const isOtpDisplayed =
            await mfPurchasePage.isOtpAuthorizationScreenDisplayed();

        if (!isOtpDisplayed) {
            throw new Error(
                "OTP authorization screen was not displayed after Pay."
            );
        }

        console.log(
            "OTP authorization screen displayed."
        );

        console.log("");
        console.log("=================================");
        console.log(
            "MF CUSTOM AMOUNT ADD TO CART + PAY VALIDATION COMPLETED"
        );
        console.log("=================================");



        testReport.markPassed();
        testReport.saveReport();
        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("MF CUSTOM AMOUNT ADD TO CART TEST PASSED");
        console.log("=================================");

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {


        console.error("");
        console.error("=================================");
        console.error("MF CUSTOM AMOUNT ADD TO CART TEST FAILED");
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

