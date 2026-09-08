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

    const driver = await createDriver();
    const testReport =
    new TestReport("Equity Funds Test");
    let currentFund = "Unknown";
    let currentSection = "Unknown";

    try {

        console.log("=================================");
        console.log("EQUITY FUNDS TEST STARTED");
        console.log("=================================");

        await launchApp(driver);

        // -----------------------------------------
        // Initialize Page Objects
        // -----------------------------------------

        const permissionHandler =
            new PermissionHandler(driver);

        const loginFlow =
            new LoginFlow(driver, testData);

        const fundsPage =
            new FundsPage(driver);

        const fundDetailsPage =
            new FundDetailsPage(driver);


        // -----------------------------------------
        // Login / Session
        // -----------------------------------------

        await loginFlow.ensureLoggedIn(
            permissionHandler
        );


        // -----------------------------------------
        // Navigate to Equity Funds
        // -----------------------------------------

        await fundsPage.clickMutualFunds();

        await fundsPage.selectEquityFunds();


        // -----------------------------------------
        // Validate Fund Cards
        // -----------------------------------------

        console.log("");
        console.log("Validating Fund Cards...");

        await fundsPage.validateAllFundCards();


        // -----------------------------------------
        // Process All Funds Dynamically
        // -----------------------------------------

        const processedFunds = new Set();

        let scrollAttempts = 0;

        const maxScrollAttempts = 50;


        while (true) {

            const cards =
                await fundsPage.getVisibleFundCards();

            console.log("");
            console.log(
                `Currently visible fund cards: ${cards.length}`
            );

            let newFundFound = false;


            for (let i = 0; i < cards.length; i++) {

                const description =
                    await cards[i].getAttribute(
                        "content-desc"
                    );


                if (!description) {

                    console.log(
                        `Fund Card ${i + 1} has no content description.`
                    );

                    continue;
                }


                const fundName =
                    description
                        .split("\n")[0]
                        .trim();
                currentFund = fundName;


                console.log(
                    `Visible Fund ${i + 1}: ${fundName}`
                );


                // Skip already validated funds

                if (processedFunds.has(fundName)) {

                    console.log(
                        `${fundName} already validated - skipping.`
                    );

                    continue;
                }


                newFundFound = true;


                console.log("");
                console.log("=================================");
                console.log(
                    `VALIDATING FUND: ${fundName}`
                );
                console.log("=================================");


                // -----------------------------------------
                // Open Fund
                // -----------------------------------------

                await fundsPage.openFundByIndex(i);


                // -----------------------------------------
                // Fund Details - Overview
                // -----------------------------------------
                currentSection = "Overview";
                console.log(
                    `Validating Overview - ${fundName}`
                );

                await fundDetailsPage.validateOverview();

                // -----------------------------------------
                // Nifty Graph
                // -----------------------------------------
                currentSection = "Nifty Graph";
                console.log(
                    `Validating Nifty Graph - ${fundName}`
                );
                
                await fundDetailsPage.validateNiftyGraph();


                // -----------------------------------------
                // Holdings
                // -----------------------------------------
                currentSection = "Holdings";
                console.log(
                    `Validating Holdings - ${fundName}`
                );
                
                await fundDetailsPage.clickHoldings();

                await fundDetailsPage.validateHoldings();

                // -----------------------------------------
                // Scheme
                // -----------------------------------------
                currentSection = "Scheme";
                console.log(
                    `Validating Scheme - ${fundName}`
                );
                
                await fundDetailsPage.clickScheme();

                await fundDetailsPage.validateScheme();


                // -----------------------------------------
                // Mark Fund as Processed
                // -----------------------------------------

                processedFunds.add(fundName);

                testReport.addPassedFund(fundName);

                console.log("");
                console.log(
                    `FUND VALIDATION PASSED: ${fundName}`
                );

                // -----------------------------------------
                // Return to Equity Funds
                // -----------------------------------------

                await fundsPage.returnToEquityFunds();


                console.log(
                    `Total funds validated: ${processedFunds.size}`
                );


                // The element references belong to the
                // previous screen, so restart the loop
                // and reacquire the fund cards.

                break;
            }


            // -----------------------------------------
            // New Fund Found
            // -----------------------------------------

            if (newFundFound) {
                continue;
            }


            // -----------------------------------------
            // No New Fund - Scroll
            // -----------------------------------------

            console.log("");
            console.log(
                "No new funds found in current visible area."
            );


            scrollAttempts++;


            if (scrollAttempts > maxScrollAttempts) {

                throw new Error(
                    "Maximum fund list scroll attempts reached."
                );
            }


            console.log(
                `Scroll attempt ${scrollAttempts}`
            );


            const canScroll =
                await fundsPage.scrollFundList();


            // -----------------------------------------
            // End of Fund List
            // -----------------------------------------

            if (!canScroll) {

                console.log("");
                console.log(
                    "Reached the end of Equity Funds list."
                );

                break;
            }
        }


        // -----------------------------------------
        // Final Result
        // -----------------------------------------

        console.log("");
        console.log("=================================");
        console.log("ALL FUNDS VALIDATION COMPLETED");
        console.log("=================================");

        console.log(
            `TOTAL FUNDS VALIDATED: ${processedFunds.size}`
        );

        testReport.markPassed();
        testReport.saveReport();
        testReport.saveHtmlReport();


        console.log("");
        console.log("=================================");
        console.log("EQUITY FUNDS TEST PASSED");
        console.log("=================================");

    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("EQUITY FUNDS TEST FAILED");
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
        // Re-throw Original Test Failure
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