const assert = require("node:assert/strict");


class FundDetailsPage {

    constructor(driver) {

        this.driver = driver;
    }


    // =========================================
    // MAIN FUND DETAIL TABS
    // =========================================

    get overviewTab() {

        return this.driver.$(
            "~Overview\nTab 1 of 3"
        );
    }


    get holdingsTab() {

        return this.driver.$(
            "~Holdings\nTab 2 of 3"
        );
    }


    get schemeTab() {

        return this.driver.$(
            "~Scheme\nTab 3 of 3"
        );
    }


    // =========================================
    // OVERVIEW ELEMENTS
    // =========================================

    get categoryLabel() {

        return this.driver.$(
            "~Category"
        );
    }


    get riskometerLabel() {

        return this.driver.$(
            "~Riskometer"
        );
    }


    get dayReturnsLabel() {

        return this.driver.$(
            "~Day Returns"
        );
    }


    get minimumInvestmentLabel() {

        return this.driver.$(
            "~Minimum Investment"
        );
    }


    // =========================================
    // HOLDINGS ELEMENTS
    // =========================================

    get categoryBasedHoldings() {

        return this.driver.$(
            "~Category Based Holdings"
        );
    }


    get equityTab() {

        return this.driver.$(
            "~Equity\nTab 1 of 3"
        );
    }


    get debtTab() {

        return this.driver.$(
            "~Debt\nTab 2 of 3"
        );
    }


    get othersTab() {

        return this.driver.$(
            "~Others\nTab 3 of 3"
        );
    }


    // =========================================
    // SCHEME ELEMENTS
    // =========================================

    get fundManagerSection() {

        return this.driver.$(
            "~Fund Manager"
        );
    }


    get additionalInformationSection() {

        return this.driver.$(
            "~Additional Information"
        );
    }


    get addressLabel() {

        return this.driver.$(
            "~Address"
        );
    }


    // =========================================
    // VALIDATE OVERVIEW
    // =========================================

    async validateOverview() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING OVERVIEW");
        console.log("=================================");


        // -----------------------------------------
        // Overview Tab
        // -----------------------------------------

        await this.overviewTab.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Overview tab displayed."
        );


        // -----------------------------------------
        // Category
        // -----------------------------------------

        await this.categoryLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Category displayed."
        );


        // -----------------------------------------
        // Riskometer
        // -----------------------------------------

        await this.riskometerLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Riskometer displayed."
        );


        // -----------------------------------------
        // Day Returns
        // -----------------------------------------

        await this.dayReturnsLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Day Returns displayed."
        );


        // -----------------------------------------
        // Minimum Investment
        // -----------------------------------------

        await this.minimumInvestmentLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Minimum Investment displayed."
        );


        console.log("");
        console.log(
            "OVERVIEW VALIDATION PASSED"
        );
    }


    // =========================================
    // CLICK HOLDINGS
    // =========================================

    async clickHoldings() {

        await this.holdingsTab.waitForDisplayed({
            timeout: 30000
        });


        await this.holdingsTab.click();


        console.log(
            "Holdings tab clicked."
        );


        await this.categoryBasedHoldings.waitForDisplayed({
            timeout: 30000
        });


        console.log(
            "Holdings section displayed."
        );
    }


    // =========================================
    // VALIDATE ALL HOLDINGS
    // =========================================

    async validateHoldings() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING ALL HOLDINGS");
        console.log("=================================");


        // =========================================
        // Category Based Holdings
        // =========================================

        await this.categoryBasedHoldings.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Category Based Holdings displayed."
        );


        // =========================================
        // Equity / Debt / Others Tabs
        // =========================================

        await this.equityTab.waitForDisplayed({
            timeout: 30000
        });

        await this.debtTab.waitForDisplayed({
            timeout: 30000
        });

        await this.othersTab.waitForDisplayed({
            timeout: 30000
        });

        console.log("Equity tab displayed.");
        console.log("Debt tab displayed.");
        console.log("Others tab displayed.");


        // =========================================
        // Track Validated Holdings
        // =========================================

        const validatedHoldings = new Set();

        let scrollAttempt = 0;
        let reachedBottom = false;


        // =========================================
        // Helper - Read Current Holdings
        // =========================================

        const readVisibleHoldings = async () => {

            const allElements =
                await this.driver.$$("//*");

            const holdingCandidates = [];


            for (const element of allElements) {

                const contentDesc =
                    await element.getAttribute(
                        "content-desc"
                    );


                if (!contentDesc) {
                    continue;
                }


                /*
                 * Real holding:
                 *
                 * Company Name
                 * 4.56%
                 *
                 * Category:
                 *
                 * Equity (89.28%)
                 *
                 * The newline before the percentage
                 * identifies an individual holding.
                 */

                if (
                    /\n\s*\d+(\.\d+)?%\s*$/.test(
                        contentDesc
                    )
                ) {

                    holdingCandidates.push(
                        contentDesc
                    );
                }
            }


            return holdingCandidates;
        };


        // =========================================
        // Main Validation Loop
        // =========================================

        while (true) {

            scrollAttempt++;

            console.log("");
            console.log(
                `Checking holdings... Attempt ${scrollAttempt}`
            );


            // =========================================
            // Read Current Holdings
            // =========================================

            const holdingCandidates =
                await readVisibleHoldings();


            console.log(
                `Holding candidates visible: ${holdingCandidates.length}`
            );


            let newHoldingsFound = 0;


            // =========================================
            // Validate Current Holdings
            // =========================================

            for (
                const contentDesc of holdingCandidates
            ) {

                const parts =
                    contentDesc
                        .split("\n")
                        .map(
                            value => value.trim()
                        )
                        .filter(Boolean);


                if (parts.length < 2) {
                    continue;
                }


                const holdingName =
                    parts
                        .slice(0, -1)
                        .join(" ")
                        .trim();


                const percentage =
                    parts[parts.length - 1];


                // =========================================
                // Validate Name
                // =========================================

                assert.ok(
                    holdingName.length > 0,
                    "Holding name should not be empty"
                );


                // =========================================
                // Validate Percentage
                // =========================================

                assert.match(
                    percentage,
                    /^\d+(\.\d+)?%$/,
                    `Invalid holding percentage: ${percentage}`
                );


                // =========================================
                // Unique Holding
                // =========================================

                const holdingKey =
                    `${holdingName}|${percentage}`;


                if (
                    validatedHoldings.has(
                        holdingKey
                    )
                ) {

                    continue;
                }


                validatedHoldings.add(
                    holdingKey
                );

                newHoldingsFound++;


                console.log("");

                console.log(
                    `Holding ${validatedHoldings.size}:`
                );

                console.log(
                    `Name: ${holdingName}`
                );

                console.log(
                    `Percentage: ${percentage}`
                );

                console.log(
                    "Validation PASSED"
                );
            }


            console.log("");

            console.log(
                `New holdings found: ${newHoldingsFound}`
            );


            // =========================================
            // If We Already Reached Bottom
            // =========================================

            if (reachedBottom) {

                console.log(
                    "Final holdings read completed."
                );

                break;
            }


            // =========================================
            // Scroll
            // =========================================

            console.log(
                "Scrolling down..."
            );


            const canScroll =
                await this.driver.execute(
                    "mobile: scrollGesture",
                    {
                        left: 100,
                        top: 450,
                        width: 900,
                        height: 1100,
                        direction: "down",
                        percent: 0.75
                    }
                );


            console.log(
                `More content available: ${canScroll}`
            );


            // =========================================
            // Bottom Reached
            // =========================================

            if (canScroll === false) {

                console.log("");
                console.log(
                    "Scroll reached the bottom."
                );


                /*
                 * IMPORTANT:
                 *
                 * Do not exit immediately.
                 *
                 * The final scroll can expose the last
                 * few holdings. We perform another loop
                 * iteration to read them.
                 */

                reachedBottom = true;

                continue;
            }


            // =========================================
            // Allow UI To Update
            // =========================================

            await this.driver.pause(500);
        }


        // =========================================
        // Final Validation
        // =========================================

        if (
            validatedHoldings.size === 0
        ) {

            throw new Error(
                "No valid holdings were found."
            );
        }


        console.log("");
        console.log("=================================");
        console.log(
            `TOTAL HOLDINGS VALIDATED: ${validatedHoldings.size}`
        );
        console.log("=================================");

        console.log(
            "ALL HOLDINGS VALIDATION PASSED"
        );
    }
    // =========================================
    // CLICK SCHEME
    // =========================================

    async clickScheme() {

        await this.schemeTab.waitForDisplayed({
            timeout: 30000
        });


        await this.schemeTab.click();


        console.log(
            "Scheme tab clicked."
        );


        await this.fundManagerSection.waitForDisplayed({
            timeout: 30000
        });


        console.log(
            "Scheme details displayed."
        );
    }


    // =========================================
    // VALIDATE SCHEME
    // =========================================

    async validateScheme() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING SCHEME");
        console.log("=================================");


        // =========================================
        // Fund Manager
        // =========================================

        await this.fundManagerSection.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Fund Manager section displayed."
        );


        // =========================================
        // Additional Information
        // =========================================

        await this.additionalInformationSection
            .waitForDisplayed({
                timeout: 30000
            });

        console.log(
            "Additional Information displayed."
        );


        // =========================================
        // Address
        // =========================================

        await this.addressLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Address displayed."
        );


        // =========================================
        // Read Scheme Data Dynamically
        // =========================================

        const schemeElements =
            await this.driver.$$(
                'android=new UiSelector().className("android.view.View")'
            );


        const descriptions = [];


        for (const element of schemeElements) {

            const description =
                await element.getAttribute(
                    "content-desc"
                );


            if (description) {

                descriptions.push(
                    description.trim()
                );
            }
        }


        // =========================================
        // Validate Manager Data
        // =========================================

        const managerData =
            descriptions.filter(
                value =>
                    value &&
                    value !== "Fund Manager" &&
                    value !== "Additional Information" &&
                    value !== "Address"
            );


        if (
            managerData.length === 0
        ) {

            throw new Error(
                "No Scheme details were found."
            );
        }


        console.log(
            "Fund Manager details found."
        );


        // =========================================
        // Validate One-Time Investment
        // =========================================

        const oneTimeOption =
            descriptions.some(
                value =>
                    /in One-time$/i.test(value)
            );


        // =========================================
        // Validate SIP Investment
        // =========================================

        const sipOption =
            descriptions.some(
                value =>
                    /in SIP$/i.test(value)
            );


        assert.equal(
            oneTimeOption,
            true,
            "One-time investment option should be displayed"
        );


        assert.equal(
            sipOption,
            true,
            "SIP investment option should be displayed"
        );


        console.log(
            "One-time investment option displayed."
        );


        console.log(
            "SIP investment option displayed."
        );


        console.log("");

        console.log(
            "SCHEME VALIDATION PASSED"
        );
    }


    // =========================================
    // VALIDATE ALL THREE TABS
    // =========================================

    async validateAllTabs() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING ALL FUND DETAIL TABS");
        console.log("=================================");


        // =========================================
        // OVERVIEW
        // =========================================

        await this.validateOverview();


        // =========================================
        // HOLDINGS
        // =========================================

        await this.clickHoldings();

        await this.validateHoldings();


        // =========================================
        // SCHEME
        // =========================================

        await this.clickScheme();

        await this.validateScheme();


        // =========================================
        // ALL TABS PASSED
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("ALL FUND DETAIL TABS PASSED");
        console.log("=================================");
    }
}


module.exports = FundDetailsPage;