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

    // Graph related elements

    get maxReturnsLabel() {
        return this.driver.$(
            "~Max Returns - Annualized"
        );
    }

    get maxReturnsValue() {
        return this.driver.$(
            '//android.view.View[@content-desc="Max Returns - Annualized"]/preceding-sibling::android.view.View[1]'
        );
    }

    get niftyLabel() {
        return this.driver.$(
            "~Nifty"
        );
    }

    get niftyCheckbox() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.CheckBox")'
        );
    }


    // =========================================
    // GRAPH PERIOD BUTTONS
    // =========================================

    get oneMonthButton() {
        return this.driver.$("~1M");
    }

    get sixMonthButton() {
        return this.driver.$("~6M");
    }

    get oneYearButton() {
        return this.driver.$("~1Y");
    }

    get threeYearButton() {
        return this.driver.$("~3Y");
    }

    get fiveYearButton() {
        return this.driver.$("~5Y");
    }

    get maxButton() {
        return this.driver.$("~MAX");
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

    get holdings() {
        return this.driver.$$(
            '//android.widget.ScrollView//android.view.View[@content-desc and contains(@content-desc, "%")]'
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
        // Overview tab
        // -----------------------------------------

        await this.overviewTab.waitForDisplayed({
            timeout: 30000
        });

        console.log("Overview tab displayed.");

        // -----------------------------------------
        // Category
        // -----------------------------------------

        await this.categoryLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log("Category displayed.");

        // -----------------------------------------
        // Riskometer
        // -----------------------------------------

        await this.riskometerLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log("Riskometer displayed.");

        // -----------------------------------------
        // Day Returns
        // -----------------------------------------

        await this.dayReturnsLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log("Day Returns displayed.");

        // -----------------------------------------
        // Minimum Investment
        // -----------------------------------------

        await this.minimumInvestmentLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log("Minimum Investment displayed.");

        // -----------------------------------------
        // Graph Section
        // -----------------------------------------

        console.log("");
        console.log("Validating graph section...");

        await this.maxReturnsLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Max Returns - Annualized displayed."
        );

        // -----------------------------------------
        // Graph Value
        // -----------------------------------------

        const graphValue =
            await this.maxReturnsValue;

        await graphValue.waitForDisplayed({
            timeout: 30000
        });

        const value =
            await graphValue.getAttribute("content-desc");

        assert.ok(
            value,
            "Graph return value should be displayed"
        );

        assert.match(
            value,
            /^\d+(\.\d+)?%$/,
            `Invalid graph return value: ${value}`
        );

        console.log(
            `Graph return value displayed: ${value}`
        );

        // -----------------------------------------
        // NIFTY
        // -----------------------------------------

        await this.niftyLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log("Nifty option displayed.");

        // -----------------------------------------
        // Graph Period Buttons
        // -----------------------------------------

        const periodButtons = [
            { name: "1M", element: this.oneMonthButton },
            { name: "6M", element: this.sixMonthButton },
            { name: "1Y", element: this.oneYearButton },
            { name: "3Y", element: this.threeYearButton },
            { name: "5Y", element: this.fiveYearButton },
            { name: "MAX", element: this.maxButton }
        ];

        for (const period of periodButtons) {

            if (await period.element.isDisplayed()) {

                console.log(`${period.name} displayed.`);

            } else {

                console.log(
                    `${period.name} not available for this fund - skipping.`
                );
            }
        }
        console.log("");
        console.log("OVERVIEW VALIDATION PASSED");
    }


    // =========================================
    // VALIDATE NIFTY GRAPH
    // =========================================

    async validateNiftyGraph() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING NIFTY GRAPH");
        console.log("=================================");

        await this.niftyCheckbox.waitForDisplayed({
            timeout: 30000
        });

        console.log("Nifty checkbox displayed.");

        const beforeState =
            await this.niftyCheckbox.getAttribute("checked");

        console.log(
            "Nifty checked before click:",
            beforeState
        );

        // -----------------------------------------
        // Click Nifty
        // -----------------------------------------

        await this.niftyCheckbox.click();

        console.log("Nifty clicked.");

        await this.driver.pause(1000);

        // -----------------------------------------
        // Validate checkbox state
        // -----------------------------------------

        const afterState =
            await this.niftyCheckbox.getAttribute("checked");

        console.log(
            "Nifty checked after click:",
            afterState
        );

        assert.equal(
            afterState,
            "true",
            "Nifty should be selected after clicking"
        );

        // -----------------------------------------
        // Validate graph section remains visible
        // -----------------------------------------

        await this.maxReturnsLabel.waitForDisplayed({
            timeout: 30000
        });

        const graphValue =
            await this.maxReturnsValue;

        await graphValue.waitForDisplayed({
            timeout: 30000
        });

        const value =
            await graphValue.getAttribute("content-desc");

        assert.ok(
            value,
            "Graph value should remain displayed after selecting Nifty"
        );

        assert.match(
            value,
            /^\d+(\.\d+)?%$/,
            `Invalid graph value after Nifty selection: ${value}`
        );

        console.log(
            `Graph displayed after Nifty selection: ${value}`
        );

        console.log("");
        console.log("NIFTY GRAPH VALIDATION PASSED");
    }


    // =========================================
    // CLICK HOLDINGS
    // =========================================

    async clickHoldings() {

        await this.holdingsTab.waitForDisplayed({
            timeout: 30000
        });

        await this.holdingsTab.click();

        console.log("Holdings tab clicked.");

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
        console.log("VALIDATING HOLDINGS");
        console.log("=================================");

        // -----------------------------------------
        // Validate Holdings section
        // -----------------------------------------

        await this.categoryBasedHoldings.waitForDisplayed({
            timeout: 10000
        });

        console.log("Category Based Holdings displayed.");

        await this.equityTab.waitForDisplayed({
            timeout: 10000
        });

        console.log("Equity tab displayed.");

        await this.debtTab.waitForDisplayed({
            timeout: 10000
        });

        console.log("Debt tab displayed.");

        await this.othersTab.waitForDisplayed({
            timeout: 10000
        });

        console.log("Others tab displayed.");

        // -----------------------------------------
        // Dynamically validate holdings
        // -----------------------------------------

        console.log("");
        console.log("Validating holdings dynamically...");

        const validatedHoldings = new Set();

        let scrollAttempts = 0;
        const maxScrollAttempts = 30;

        while (scrollAttempts < maxScrollAttempts) {

            const holdings = await this.holdings;

            console.log("");
            console.log(
                `Visible holding elements: ${holdings.length}`
            );

            let newHoldingFound = false;

            // -----------------------------------------
            // Validate currently visible holdings
            // -----------------------------------------

            for (const holding of holdings) {

                try {
                    await holding.waitForDisplayed({
                        timeout: 5000
                    });

                    const description =
                        await holding.getAttribute("content-desc");

                    if (!description) {
                        continue;
                    }

                    const cleanDescription =
                        description.trim();

                    if (!validatedHoldings.has(cleanDescription)) {

                        console.log("");
                        console.log(
                            "Holding:",
                            cleanDescription.replace(/\n/g, " | ")
                        );

                        // Validate holding name + percentage
                        const parts =
                            cleanDescription.split("\n");

                        if (parts.length < 2) {
                            throw new Error(
                                `Invalid holding format: ${cleanDescription}`
                            );
                        }

                        const holdingName =
                            parts[0].trim();

                        const percentage =
                            parts[1].trim();

                        if (!holdingName) {
                            throw new Error(
                                "Holding name is empty."
                            );
                        }

                        if (!/^\d+(\.\d+)?%$/.test(percentage)) {
                            throw new Error(
                                `Invalid holding percentage: ${percentage}`
                            );
                        }

                        validatedHoldings.add(
                            cleanDescription
                        );

                        newHoldingFound = true;

                        console.log(
                            "Holding validation PASSED."
                        );
                    }

                } catch (error) {

                    throw new Error(
                        `Holding validation failed: ${error.message}`
                    );
                }
            }

            console.log(
                `Unique holdings validated so far: ${validatedHoldings.size}`
            );

            // -----------------------------------------
            // Scroll to next batch
            // -----------------------------------------

            const canScroll =
                await this.driver.execute(
                    "mobile: scrollGesture",
                    {
                        left: 100,
                        top: 1418,
                        width: 880,
                        height: 900,
                        direction: "down",
                        percent: 0.50
                    }
                );

            await this.driver.pause(1000);

            scrollAttempts++;

            console.log(
                "More holdings available:",
                canScroll
            );

            // -----------------------------------------
            // Stop conditions
            // -----------------------------------------

            if (!canScroll) {
                console.log(
                    "Reached end of Holdings list."
                );
                break;
            }

            if (!newHoldingFound) {
                console.log(
                    "No new holdings detected after scroll."
                );
                break;
            }
        }

        // -----------------------------------------
        // Final validation
        // -----------------------------------------

        if (validatedHoldings.size === 0) {
            throw new Error(
                "No valid holdings were found."
            );
        }

        console.log("");
        console.log(
            `Total unique holdings validated: ${validatedHoldings.size}`
        );

        console.log("");
        console.log("HOLDINGS VALIDATION PASSED");
    }
    // =========================================
    // CLICK SCHEME
    // =========================================

    async clickScheme() {

        await this.schemeTab.waitForDisplayed({
            timeout: 30000
        });

        await this.schemeTab.click();

        console.log("Scheme tab clicked.");

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

        await this.fundManagerSection.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Fund Manager section displayed."
        );

        await this.additionalInformationSection
            .waitForDisplayed({
                timeout: 30000
            });

        console.log(
            "Additional Information displayed."
        );

        await this.addressLabel.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Address displayed."
        );

        console.log("");
        console.log("SCHEME VALIDATION PASSED");
    }


    // =========================================
    // VALIDATE ALL THREE TABS
    // =========================================

    async validateAllTabs() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING ALL FUND DETAIL TABS");
        console.log("=================================");

        // -----------------------------------------
        // Overview
        // -----------------------------------------

        await this.validateOverview();

        // -----------------------------------------
        // Nifty / Graph
        // -----------------------------------------

        await this.validateNiftyGraph();

        // -----------------------------------------
        // Holdings
        // -----------------------------------------

        await this.clickHoldings();

        await this.validateHoldings();

        // -----------------------------------------
        // Scheme
        // -----------------------------------------

        await this.clickScheme();

        await this.validateScheme();

        console.log("");
        console.log("=================================");
        console.log("ALL FUND DETAIL TABS PASSED");
        console.log("=================================");
    }
}


module.exports = FundDetailsPage;