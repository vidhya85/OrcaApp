const FundsPage = require("../pages/FundsPage");
const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const UserLoginFlow = require("../utils/UserLoginFlow");
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
        new TestReport(
            "MF Default Amount Add To Cart Test"
        );

    let currentFund = "Unknown";
    let currentSection = "Unknown";

    // Track whether cart was opened during test
    let cartOpened = false;
    let mfPurchasePage;




    try {

        // =========================================
        // Test Start
        // =========================================

        console.log("=================================");
        console.log(
            "MF DEFAULT AMOUNT ADD TO CART TEST STARTED"
        );
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

        const userLoginFlow =
            new UserLoginFlow(driver);

        const fundsPage =
            new FundsPage(driver);

        const fundDetailsPage =
            new FundDetailsPage(driver);

         mfPurchasePage =
            new MFPurchasePage(driver);


        // =========================================
        // Login / Session
        // =========================================

        currentSection = "Login";

        await userLoginFlow.login(
            permissionHandler
        );


        // =========================================
        // Open Mutual Funds
        // =========================================

        currentSection = "Mutual Funds";

        console.log("");
        console.log("Opening Mutual Funds...");

        await fundsPage.clickMutualFunds();

        await driver.pause(2000);


        // =========================================
        // Check Existing Cart
        // =========================================

        currentSection = "Cart Cleanup";

        await mfPurchasePage.checkAndClearCart();


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

        currentFund =
            await fundsPage.clickFirstVisibleFund();


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

            throw new Error(
                "Investment amount is not displayed."
            );
        }


        console.log(
            `Investment amount displayed: ₹${investmentAmount}`
        );


        // =========================================
        // Add Investment To Cart
        // =========================================

        currentSection = "Add To Cart";

        console.log("");
        console.log("Clicking Add To Cart...");

        await mfPurchasePage.clickAddToCart();

        // Give the app time to update the cart
        // and display the success message.
        await driver.pause(1000);


        // =========================================
        // Verify Scheme Added Successfully
        // =========================================

        const schemeAddedDisplayed =
            await mfPurchasePage
                .isSchemeAddedMessageDisplayed();


        if (!schemeAddedDisplayed) {

            throw new Error(
                "Scheme added to cart success message " +
                "was not displayed."
            );
        }


        console.log(
            "Scheme added to cart successfully " +
            "message displayed."
        );


        // =========================================
        // Verify Cart Contains 1 Item
        // =========================================
        //
        // IMPORTANT:
        // Do NOT call getCartCount() here.
        //
        // After Add To Cart, the purchase screen
        // does not expose the same cart count
        // element used by the initial cart check.
        //
        // The working cart icon has:
        // content-desc = "1"
        //
        // Therefore, if this element is displayed,
        // we know the cart contains 1 item.
        //
        // =========================================

        currentSection = "Cart Count Verification";

        console.log("");
        console.log(
            "Verifying cart contains 1 item..."
        );

        try {

            await mfPurchasePage.cartIcon.waitForDisplayed({
                timeout: 10000
            });

        } catch (error) {

            throw new Error(
                "Cart icon with count 1 was not displayed " +
                "after adding the fund."
            );
        }


        const cartCountDescription =
            await mfPurchasePage.cartIcon
                .getAttribute("content-desc");


        console.log(
            `Cart icon content-desc: ${cartCountDescription}`
        );


        if (
            cartCountDescription !== "1"
        ) {

            throw new Error(
                `Expected cart count to be 1 after ` +
                `adding fund, but found: ` +
                `${cartCountDescription}`
            );
        }


        console.log(
            "Cart count verified successfully: 1"
        );


        // =========================================
        // Open Cart
        // =========================================

        currentSection = "Cart";

        console.log("");
        console.log("Opening Cart...");

        await mfPurchasePage.clickCartIcon();


        // Mark cart as opened
        cartOpened = true;


        // =========================================
        // Verify Cart Screen
        // =========================================

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


        // =========================================
        // Verify OTP Authorization Screen
        // =========================================

        currentSection = "OTP Authorization";

        const isOtpDisplayed =
            await mfPurchasePage
                .isOtpAuthorizationScreenDisplayed();


        if (!isOtpDisplayed) {

            throw new Error(
                "OTP authorization screen was not " +
                "displayed after Pay."
            );
        }


        console.log(
            "OTP authorization screen displayed."
        );


        // =========================================
        // Test Validation Completed
        // =========================================

        console.log("");

        console.log("=================================");

        console.log(
            "MF DEFAULT AMOUNT ADD TO CART + " +
            "PAY VALIDATION COMPLETED"
        );

        console.log(
            "================================="
        );


        // =========================================
        // Test Report - Passed
        // =========================================

        testReport.markPassed();

        testReport.saveReport();

        testReport.saveHtmlReport();


        console.log("");

        console.log("=================================");

        console.log(
            "MF DEFAULT AMOUNT ADD TO CART TEST PASSED"
        );

        console.log(
            "================================="
        );

    }


    // =========================================
    // Test Failed
    // =========================================

    catch (error) {

        console.error("");

        console.error(
            "================================="
        );

        console.error(
            "MF DEFAULT AMOUNT ADD TO CART TEST FAILED"
        );

        console.error(
            "================================="
        );


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

        // =========================================
        // Clear Cart After Test
        // =========================================

        if (cartOpened) {

            try {

                console.log("");

                console.log(
                    "Returning to Cart to clear it..."
                );


                // After Pay, we are on
                // OTP Authorization screen.
                // Go back to Cart.

                await driver.back();

                await driver.pause(1000);


                // =========================================
                // Verify Cart Screen
                // =========================================

                const cartDisplayed =
                    await mfPurchasePage
                        .isCartScreenDisplayed()
                        .catch(() => false);


                if (cartDisplayed) {

                    console.log(
                        "Cart screen displayed. " +
                        "Clearing cart..."
                    );


                    // =========================================
                    // Clear Cart
                    // =========================================

                    await mfPurchasePage.clearCart();


                    console.log(
                        "Cart cleared successfully."
                    );

                } else {

                    console.log(
                        "Cart screen was not displayed " +
                        "after going back."
                    );
                }

            } catch (cartError) {

                console.error(
                    "Failed to clear cart:",
                    cartError.message
                );
            }
        }


        // =========================================
        // Close Appium Session
        // =========================================

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