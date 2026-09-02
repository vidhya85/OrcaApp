const FundsPage = require("../pages/FundsPage");

const testData = require("../config/testData");
const PermissionHandler = require("../utils/PermissionHandler");
const LoginFlow = require("../utils/LoginFlow");
const FundDetailsPage = require("../pages/FundDetailsPage");

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
        // Login / Already Logged In
        // =========================================

        await loginFlow.ensureLoggedIn(
            permissionHandler
        );


        // =========================================
        // Open Mutual Funds
        // =========================================

        await fundsPage.clickMutualFunds();

        // =========================================
        // Select Equity Funds
        // =========================================

        await fundsPage.selectEquityFunds();


        // =========================================
        // Validate All Equity Fund Cards
        // =========================================

        console.log("");
        console.log("Validating Fund Cards...");

        await fundsPage.validateAllFundCards();


                // =========================================
        // Fund Details - Validate All Visible Funds
        // =========================================

        const fundDetailsPage =
            new FundDetailsPage(driver);

        //const visibleFunds =
        //    await fundsPage.getVisibleFundCards();

        const fundCount =(await fundsPage.getVisibleFundCards()).length;

        console.log("");
        console.log("=================================");
        console.log(`TOTAL VISIBLE FUNDS: ${fundCount}`);
        console.log("=================================");


        for (let i = 0; i < fundCount; i++) {

            console.log("");
            console.log("=================================");
            console.log(`VALIDATING FUND ${i + 1} OF ${fundCount}`);
            console.log("=================================");


            // Open fund
            await fundsPage.openFundByIndex(i);


            // Validate Overview
            await fundDetailsPage.validateOverview();


            // Validate Nifty Graph
            await fundDetailsPage.validateNiftyGraph();


            // Open Holdings
            await fundDetailsPage.clickHoldings();


            // Validate Holdings
            await fundDetailsPage.validateHoldings();


            // Open Scheme
            await fundDetailsPage.clickScheme();


            // Validate Scheme
            await fundDetailsPage.validateScheme();


            // Return to Equity Funds
            await fundsPage.returnToEquityFunds();


            console.log("");
            console.log(`FUND ${i + 1} VALIDATION PASSED`);
        }


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