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
            'android=new UiSelector().descriptionMatches("\\\\d+(\\\\.\\\\d+)?%")'
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

        await this.oneMonthButton.waitForDisplayed({
            timeout: 30000
        });

        await this.sixMonthButton.waitForDisplayed({
            timeout: 30000
        });

        await this.oneYearButton.waitForDisplayed({
            timeout: 30000
        });

        await this.threeYearButton.waitForDisplayed({
            timeout: 30000
        });

        await this.fiveYearButton.waitForDisplayed({
            timeout: 30000
        });

        await this.maxButton.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "All graph period buttons displayed."
        );

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
        console.log("VALIDATING ALL HOLDINGS");
        console.log("=================================");

        await this.categoryBasedHoldings.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Category Based Holdings displayed."
        );

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

        const validatedHoldings = new Set();

        let scrollAttempt = 0;
        let reachedBottom = false;

        const readVisibleHoldings = async () => {

            const allElements =
                await this.driver.$$("*");

            const holdingCandidates = [];

            for (const element of allElements) {

                const contentDesc =
                    await element.getAttribute(
                        "content-desc"
                    );

                if (!contentDesc) {
                    continue;
                }

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


        while (true) {

            scrollAttempt++;

            console.log("");
            console.log(
                `Checking holdings... Attempt ${scrollAttempt}`
            );

            const holdingCandidates =
                await readVisibleHoldings();

            console.log(
                `Holding candidates visible: ${holdingCandidates.length}`
            );

            let newHoldingsFound = 0;

            for (
                const contentDesc of holdingCandidates
            ) {

                const parts =
                    contentDesc
                        .split("\n")
                        .map(value => value.trim())
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

                assert.ok(
                    holdingName.length > 0,
                    "Holding name should not be empty"
                );

                assert.match(
                    percentage,
                    /^\d+(\.\d+)?%$/,
                    `Invalid holding percentage: ${percentage}`
                );

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

            if (reachedBottom) {

                console.log(
                    "Final holdings read completed."
                );

                break;
            }

            console.log("Scrolling down...");

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

            if (canScroll === false) {

                console.log(
                    "Scroll reached the bottom."
                );

                reachedBottom = true;

                continue;
            }

            await this.driver.pause(500);
        }


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