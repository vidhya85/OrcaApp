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

    const driver = await createDriver();

    try {

        await launchApp(driver);

        console.log("=================================");
        console.log("EQUITY FUNDS TEST STARTED");
        console.log("=================================");


        // =====================================================
        // INITIALIZE PAGE OBJECTS
        // =====================================================

        const permissionHandler =
            new PermissionHandler(driver);

        const fundsPage =
            new FundsPage(driver);

        const loginFlow =
            new LoginFlow(
                driver,
                testData
            );

        const fundDetailsPage =
            new FundDetailsPage(driver);


        // =====================================================
        // LOGIN
        // =====================================================

        await loginFlow.ensureLoggedIn(
            permissionHandler
        );


        // =====================================================
        // OPEN MUTUAL FUNDS
        // =====================================================

        await fundsPage.clickMutualFunds();


        // =====================================================
        // OPEN EQUITY FUNDS
        // =====================================================

        await fundsPage.selectEquityFunds();


        // =====================================================
        // VALIDATE INITIAL FUND CARDS
        // =====================================================

        console.log("");
        console.log("Validating Fund Cards...");

        await fundsPage.validateAllFundCards();


        // =====================================================
        // TRACK PROCESSED FUNDS
        // =====================================================

        const processedFunds = new Set();

        let scrollAttempts = 0;

        const maxScrollAttempts = 50;


        // =====================================================
        // PROCESS ALL FUNDS
        // =====================================================

        while (true) {

            console.log("");
            console.log("=================================");
            console.log("CHECKING VISIBLE FUND CARDS");
            console.log("=================================");


            const cards =
                await fundsPage.getVisibleFundCards();


            console.log(
                "Currently visible fund cards:",
                cards.length
            );


            let newFundFound = false;


            // =================================================
            // FIND AN UNPROCESSED FUND
            // =================================================

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


                // Fund name is the first line
                // of the content description.

                const fundName =
                    description
                        .split("\n")[0]
                        .trim();


                console.log("");
                console.log(
                    `Visible Fund ${i + 1}: ${fundName}`
                );


                // =================================================
                // SKIP ALREADY PROCESSED FUNDS
                // =================================================

                if (processedFunds.has(fundName)) {

                    console.log(
                        `${fundName} already validated - skipping.`
                    );

                    continue;
                }


                // =================================================
                // NEW FUND FOUND
                // =================================================

                newFundFound = true;


                console.log("");
                console.log("=================================");
                console.log(
                    `VALIDATING FUND: ${fundName}`
                );
                console.log("=================================");


                // =================================================
                // OPEN FUND
                // =================================================

                await fundsPage.openFundByIndex(i);


                // =================================================
                // FUND DETAILS - OVERVIEW
                // =================================================

                console.log("");
                console.log(
                    `Validating Overview - ${fundName}`
                );

                await fundDetailsPage.validateOverview();


                // =================================================
                // NIFTY GRAPH
                // =================================================

                console.log("");
                console.log(
                    `Validating Nifty Graph - ${fundName}`
                );

                await fundDetailsPage.validateNiftyGraph();


                // =================================================
                // HOLDINGS
                // =================================================

                console.log("");
                console.log(
                    `Validating Holdings - ${fundName}`
                );

                await fundDetailsPage.clickHoldings();

                await fundDetailsPage.validateHoldings();


                // =================================================
                // SCHEME
                // =================================================

                console.log("");
                console.log(
                    `Validating Scheme - ${fundName}`
                );

                await fundDetailsPage.clickScheme();

                await fundDetailsPage.validateScheme();


                // =================================================
                // MARK FUND AS PROCESSED
                // =================================================

                processedFunds.add(fundName);


                console.log("");
                console.log(
                    `FUND VALIDATION PASSED: ${fundName}`
                );


                // =================================================
                // RETURN TO EQUITY FUNDS LIST
                // =================================================

                await fundsPage.returnToEquityFunds();


                console.log("");
                console.log(
                    `Total funds validated: ${processedFunds.size}`
                );


                // =================================================
                // IMPORTANT
                // =================================================
                // After returning from Fund Details,
                // reacquire the fund cards.
                //
                // The previous card references may no longer
                // represent the current screen.
                //
                // Therefore break and restart the while loop.

                break;
            }


            // =====================================================
            // IF A NEW FUND WAS FOUND
            // =====================================================
            // Continue from the beginning so that the current
            // visible cards are reacquired.

            if (newFundFound) {

                continue;
            }


            // =====================================================
            // NO NEW FUND IN CURRENT SCREEN
            // =====================================================

            console.log("");
            console.log(
                "No new funds found in current visible area."
            );


            // =====================================================
            // SAFETY LIMIT
            // =====================================================

            scrollAttempts++;

            if (scrollAttempts > maxScrollAttempts) {

                console.log("");
                console.log(
                    "Maximum scroll attempts reached."
                );

                break;
            }


            // =====================================================
            // SCROLL DOWN
            // =====================================================

            console.log("");
            console.log(
                `Scroll attempt ${scrollAttempts}`
            );


            const canScroll =
                await fundsPage.scrollFundList();


            // =====================================================
            // END OF LIST
            // =====================================================

            if (!canScroll) {

                console.log("");
                console.log(
                    "Reached the end of Equity Funds list."
                );

                break;
            }
        }


        // =====================================================
        // FINAL RESULT
        // =====================================================

        console.log("");
        console.log("=================================");
        console.log("ALL FUNDS VALIDATION COMPLETED");
        console.log("=================================");

        console.log(
            `TOTAL FUNDS VALIDATED: ${processedFunds.size}`
        );


        console.log("");
        console.log("=================================");
        console.log("EQUITY FUNDS TEST PASSED");
        console.log("=================================");


    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("EQUITY FUNDS TEST FAILED");
        console.error("=================================");

        console.error(error);


    } finally {

        await closeDriver(driver);
    }
}


main();