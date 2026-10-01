class HoldingsPage {

    constructor(driver) {
        this.driver = driver;
    }

    // ==================================================
    // PAGE ELEMENTS
    // ==================================================

    get holdingsTitle() {
        return this.driver.$('~Mutual Fund Holdings');
    }

    get holdingsTab() {
        return this.driver.$('~Holdings');
    }

    get investmentDetailsTitle() {
        return this.driver.$('~Investment Details');
    }


    // ==================================================
    // PAGE DISPLAY
    // ==================================================

    async isDisplayed() {

        try {

            await this.holdingsTitle.waitForDisplayed({
                timeout: 10000
            });

            return true;

        } catch (error) {

            return false;
        }
    }


    // ==================================================
    // OPEN HOLDINGS TAB
    // ==================================================

    async clickHoldingsTab() {

        await this.holdingsTab.waitForDisplayed({
            timeout: 30000
        });

        await this.holdingsTab.click();

        await this.holdingsTitle.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Mutual Fund Holdings screen displayed."
        );
    }


    // ==================================================
    // GET HOLDINGS SUMMARY
    // ==================================================

    async getHoldingsSummary() {

        const elements = await this.driver.$$(
            'android=new UiSelector()' +
            '.descriptionMatches(".*")'
        );

        for (const element of elements) {

            const description =
                await element.getAttribute(
                    "content-desc"
                );

            if (
                description &&
                description.includes("Invested") &&
                description.includes("Current Value")
            ) {

                return description;
            }
        }

        throw new Error(
            "Could not find actual Mutual Fund Holdings summary."
        );
    }


    // ==================================================
    // GET HOLDINGS COUNT
    // ==================================================

    async getHoldingsCount() {

        const summary =
            await this.getHoldingsSummary();

        const match =
            summary.match(
                /(\d+)\s+Holdings/i
            );

        if (!match) {

            throw new Error(
                `Could not determine Holdings count from summary: ${summary}`
            );
        }

        const count =
            Number(match[1]);

        console.log("");
        console.log(
            "Holdings count:",
            count
        );

        return count;
    }


    // ==================================================
    // VERIFY HOLDINGS STATE
    // ==================================================

    async verifyHoldingsState() {

        const count =
            await this.getHoldingsCount();

        if (count === 0) {

            console.log(
                "No mutual fund holdings found."
            );

            return "NO_HOLDINGS";
        }

        if (count > 0) {

            console.log(
                `Mutual fund holdings found: ${count}`
            );

            return "HAS_HOLDINGS";
        }

        throw new Error(
            `Invalid Holdings count: ${count}`
        );
    }


    // ==================================================
// GET INDIVIDUAL HOLDINGS
// ==================================================

async getHoldingCards() {

    console.log("");
    console.log(
        "Finding individual mutual fund holdings..."
    );


    /*
     * Get all elements having a content-desc.
     *
     * Do NOT use a highly specific UiSelector here.
     * The holding cards are inside a ScrollView and
     * Appium may expose a different number of matching
     * elements when the selector is evaluated again.
     */

    const elements = await this.driver.$$(
        'android=new UiSelector().descriptionMatches(".*")'
    );


    const holdings = [];


    const ignoredDescriptions = [
        "MF Home",
        "Orders",
        "Holdings",
        "SIP",
        "Redeem",
        "Lumpsum"
    ];


    for (const element of elements) {

        let description;

        try {

            description =
                await element.getAttribute(
                    "content-desc"
                );

        } catch (error) {

            continue;
        }


        if (!description) {
            continue;
        }


        const rawDescription =
            description.trim();


        /*
         * The holding card contains:
         *
         * Fund Name
         * Invested
         * Current
         * Return
         * Return Percentage
         */

        if (
            !rawDescription.includes("Invested") ||
            !rawDescription.includes("Return Percentage")
        ) {

            continue;
        }


        /*
         * First line is the mutual fund name.
         */

        const name =
            rawDescription
                .split(/\r?\n/)[0]
                .trim();


        if (!name) {
            continue;
        }


        /*
         * Ignore navigation buttons.
         */

        if (
            ignoredDescriptions.includes(name)
        ) {

            continue;
        }


        /*
         * Ignore the Holdings summary.
         *
         * Summary contains:
         *
         * Invested
         * Current Value
         * Total Return
         * Total Return Percentage
         * X Holdings
         */

        if (
            rawDescription.includes("Current Value") &&
            rawDescription.includes("Total Return")
        ) {

            continue;
        }


        /*
         * Make sure this is a clickable element.
         */

        let clickable = false;

        try {

            clickable =
                await element.getAttribute(
                    "clickable"
                );

        } catch (error) {

            // Ignore inaccessible attribute
        }


        /*
         * Some Appium versions return boolean,
         * others may return a string.
         */

        if (
            clickable === false ||
            clickable === "false"
        ) {

            continue;
        }


        holdings.push({

            element,

            name,

            rawDescription

        });
    }


    /*
     * Remove duplicate fund names.
     */

    const uniqueHoldings = [];

    const namesSeen = new Set();


    for (
        const holding
        of holdings
    ) {

        if (
            namesSeen.has(
                holding.name
            )
        ) {

            continue;
        }


        namesSeen.add(
            holding.name
        );


        uniqueHoldings.push(
            holding
        );
    }


    console.log("");

    console.log(
        `Potential holding elements found: ${uniqueHoldings.length}`
    );


    if (
        uniqueHoldings.length === 0
    ) {

        throw new Error(
            "No individual mutual fund holding cards found."
        );
    }


    console.log("");


    uniqueHoldings.forEach(
        (holding, index) => {

            console.log(
                `${index + 1}. ${holding.name}`
            );

        }
    );


    return uniqueHoldings;
}
    

    // ==================================================
    // GET ALL CONTENT-DESC VALUES
    // ==================================================

    async getAllContentDescriptions() {

        const elements = await this.driver.$$(
            'android=new UiSelector()' +
            '.descriptionMatches(".*")'
        );


        const values = [];


        for (const element of elements) {

            const description =
                await element.getAttribute(
                    "content-desc"
                );


            if (
                description &&
                description.trim().length > 0
            ) {

                values.push(
                    description
                );
            }
        }


        return values;
    }


    // ==================================================
    // VERIFY LABEL
    // ==================================================

    async verifyLabel(label) {

        const element =
            this.driver.$(`~${label}`);


        try {

            await element.waitForDisplayed({
                timeout: 5000
            });


            console.log(
                `✓ ${label} displayed`
            );


            return true;

        } catch (error) {

            throw new Error(
                `${label} is not displayed.`
            );
        }
    }


    // ==================================================
    // VERIFY VALUE BY POSITION
    // ==================================================

    async verifyValueExists(
    values,
    label,
    validationFunction
) {

    const valuePairs = {

        "Invested": {
            valueIndex: 4
        },

        "Current Value": {
            valueIndex: 5
        },

        "Total Return": {
            valueIndex: 8
        },

        "Total Return Percentage": {
            valueIndex: 9
        },

        "Total Units": {
            valueIndex: 12
        },

        "Avg Buy value": {
            valueIndex: 13
        },

        "Current NAV": {
            valueIndex: 16
        }
    };


    const mapping =
        valuePairs[label];


    if (!mapping) {

        throw new Error(
            `No value mapping defined for ${label}.`
        );
    }


    const value =
        values[mapping.valueIndex];


    if (
        !value ||
        !validationFunction(value)
    ) {

        throw new Error(
            `Invalid or missing value for ${label}.`
        );
    }


    console.log(
        `✓ ${label}: ${value}`
    );


    return value;
}
    // ==================================================
    // VERIFY INVESTMENT DETAILS
    // ==================================================

    async verifyInvestmentDetails(
        holdingName
    ) {

        console.log("");

        console.log(
            "========== VERIFYING INVESTMENT DETAILS =========="
        );


        // =========================================
        // 1. Investment Details title
        // =========================================

        const investmentDetails =
            this.driver.$(
                '~Investment Details'
            );


        await investmentDetails.waitForDisplayed({
            timeout: 30000
        });


        console.log(
            "✓ Investment Details displayed"
        );


        // =========================================
        // 2. Verify Fund Name
        // =========================================

        console.log("");

        console.log(
            "Verifying fund name..."
        );


        const allElements =
            await this.driver.$$(
                'android=new UiSelector().textMatches(".*")'
            );


        let displayedFundName = null;


        for (const element of allElements) {

            try {

                const text =
                    await element.getAttribute(
                        "text"
                    );


                if (!text) {
                    continue;
                }


                const value =
                    text.trim();


                if (
                    value ===
                    holdingName.trim()
                ) {

                    displayedFundName =
                        value;

                    break;
                }

            } catch (error) {

                // Ignore inaccessible elements

            }
        }


        // =========================================
        // Check content-desc if text not found
        // =========================================

        if (!displayedFundName) {

            const descriptionElements =
                await this.driver.$$(
                    'android=new UiSelector()' +
                    '.descriptionMatches(".*")'
                );


            for (
                const element
                of descriptionElements
            ) {

                try {

                    const description =
                        await element.getAttribute(
                            "content-desc"
                        );


                    if (!description) {
                        continue;
                    }


                    const value =
                        description.trim();


                    if (
                        value ===
                        holdingName.trim()
                    ) {

                        displayedFundName =
                            value;

                        break;
                    }

                } catch (error) {

                    // Ignore inaccessible elements

                }
            }
        }


        if (!displayedFundName) {

            console.log("");

            console.log(
                "Fund name not found using text or content-desc."
            );

            console.log(
                "Expected fund name:",
                holdingName
            );


            throw new Error(
                `Fund name was not displayed: ${holdingName}`
            );
        }


        console.log(
            `✓ Fund Name: ${displayedFundName}`
        );


        // =========================================
        // 3. Verify Labels
        // =========================================

        console.log("");

        console.log(
            "Verifying investment labels..."
        );


        const requiredLabels = [

            "Invested",

            "Current Value",

            "Total Return",

            "Total Return Percentage",

            "Total Units",

            "Avg Buy value",

            "Transaction History",

            "Current NAV"

        ];


        const descriptions =
            await this.getAllContentDescriptions();


        for (
            const label
            of requiredLabels
        ) {

            const found =
                descriptions.some(
                    description =>
                        description.trim() ===
                        label
                );


            if (!found) {

                throw new Error(
                    `Required label not displayed: ${label}`
                );
            }


            console.log(
                `✓ ${label}`
            );
        }


        // =========================================
        // 4. Verify Values
        // =========================================

        console.log("");

        console.log(
            "Verifying investment values..."
        );


        /*
         * Currency values can be:
         *
         * ₹2,48,451.55
         *
         * ₹-4,383.04
         *
         * So the negative sign must be allowed
         * before the ₹ symbol.
         */

        const currencyRegex =
            new RegExp(
                "^[₹]-?[0-9,]+[.][0-9]{2}$"
            );

        const percentageRegex =
            new RegExp(
                "^-?[0-9]+([.][0-9]+)?%$"
            );

        const decimalRegex =
            new RegExp(
                "^[0-9]+([.][0-9]+)?$"
            );


        // =========================================
        // Invested
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Invested",

            value =>
                currencyRegex.test(
                    value
                )

        );


        // =========================================
        // Current Value
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Current Value",

            value =>
                currencyRegex.test(
                    value
                )

        );


        // =========================================
        // Total Return
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Total Return",

            value =>
                currencyRegex.test(
                    value
                )

        );


        // =========================================
        // Total Return Percentage
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Total Return Percentage",

            value =>
                percentageRegex.test(
                    value
                )

        );


        // =========================================
        // Total Units
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Total Units",

            value =>
                decimalRegex.test(
                    value
                )

        );


        // =========================================
        // Avg Buy Value
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Avg Buy value",

            value =>
                currencyRegex.test(
                    value
                )

        );


        // =========================================
        // Current NAV
        // =========================================

        await this.verifyValueExists(

            descriptions,

            "Current NAV",

            value =>
                decimalRegex.test(
                    value
                )

        );


        // =========================================
        // 5. Transaction History
        // =========================================

        console.log("");

        console.log(
            "Verifying Transaction History..."
        );


        const purchaseTransactions =
            descriptions.filter(
                description =>
                    description
                        .trim()
                        .startsWith(
                            "Purchase"
                        )
            );


        if (
            purchaseTransactions.length === 0
        ) {

            throw new Error(
                "No Purchase transactions found."
            );
        }


        console.log(
            `✓ Purchase transactions found: ${purchaseTransactions.length}`
        );


        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "Investment Details verification completed."
        );

        console.log(
            "================================="
        );
    }


    // ==================================================
    // RETURN TO HOLDINGS
    // ==================================================

    async goBackToHoldings() {

        console.log("");

        console.log(
            "Returning to Mutual Fund Holdings..."
        );


        await this.driver.back();


        await this.holdingsTitle.waitForDisplayed({
            timeout: 30000
        });


        console.log(
            "Returned to Mutual Fund Holdings."
        );
    }


    // ==================================================
// VERIFY ALL HOLDINGS
// ==================================================

async verifyAllHoldings() {

    const count =
        await this.getHoldingsCount();


    if (count === 0) {

        console.log(
            "No holdings available to verify."
        );

        return "NO_HOLDINGS";
    }


    /*
     * Get the initial list of holdings.
     */

    const holdings =
        await this.getHoldingCards();


    /*
     * The summary count should match the number
     * of individual holdings.
     */

    if (holdings.length !== count) {

        throw new Error(
            `Holdings count mismatch. Summary: ${count}, ` +
            `Individual holdings found: ${holdings.length}`
        );
    }


    console.log("");

    console.log(
        `Verifying ${count} holding(s)...`
    );


    /*
     * Store only the names.
     *
     * We will locate the element again before
     * clicking each holding.
     */

    const holdingNames =
        holdings.map(
            holding => holding.name
        );


    for (
        let i = 0;
        i < holdingNames.length;
        i++
    ) {

        const holdingName =
            holdingNames[i];


        console.log("");

        console.log(
            `========== HOLDING ${i + 1} OF ${count} ==========`
        );


        console.log(
            `Holding: ${holdingName}`
        );


        /*
         * Get the current content-desc elements.
         */

        const currentElements =
            await this.driver.$$(
                'android=new UiSelector().descriptionMatches(".*")'
            );


        let holdingElement = null;


        /*
         * Find the current holding by its
         * exact fund name.
         */

        for (
            const element
            of currentElements
        ) {

            try {

                const description =
                    await element.getAttribute(
                        "content-desc"
                    );


                if (!description) {
                    continue;
                }


                const currentName =
                    description
                        .trim()
                        .split(/\r?\n/)[0]
                        .trim();


                if (
                    currentName ===
                    holdingName
                ) {

                    const hasInvested =
                        description.includes(
                            "Invested"
                        );

                    const hasReturnPercentage =
                        description.includes(
                            "Return Percentage"
                        );


                    if (
                        hasInvested &&
                        hasReturnPercentage
                    ) {

                        holdingElement =
                            element;

                        break;
                    }
                }

            } catch (error) {

                // Ignore inaccessible elements

            }
        }


        if (!holdingElement) {

            throw new Error(
                `Could not find holding on screen: ${holdingName}`
            );
        }


        /*
         * Make sure the element is displayed.
         */

        await holdingElement.waitForDisplayed({
            timeout: 30000
        });


        /*
         * Click the current element.
         */

        await holdingElement.click();


        /*
         * Wait for Investment Details.
         */

        await this.investmentDetailsTitle.waitForDisplayed({
            timeout: 30000
        });


        console.log(
            "Investment Details screen displayed."
        );


        /*
         * Validate the selected holding.
         */

        await this.verifyInvestmentDetails(
            holdingName
        );


        /*
         * Return to Mutual Fund Holdings.
         */

        await this.goBackToHoldings();


        console.log(
            `Holding ${i + 1} verified successfully.`
        );
    }


    console.log("");

    console.log(
        "=============================================="
    );

    console.log(
        "ALL HOLDINGS VERIFIED SUCCESSFULLY"
    );

    console.log(
        "=============================================="
    );


    return "ALL_HOLDINGS_VERIFIED";
}
}


module.exports = HoldingsPage;