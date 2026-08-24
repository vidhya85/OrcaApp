class FundsPage {

    constructor(driver) {
        this.driver = driver;
    }

    // =========================================
    // Dashboard - Already Logged In
    // =========================================

    get mutualFunds() {
        return this.driver.$(
            '~Mutual Funds\nScreen And Analyze'
        );
    }

    // =========================================
    // New Login Flow
    // =========================================

    get exploreFundsButton() {
        return this.driver.$(
            'android=new UiSelector().descriptionContains("Explore Funds")'
        );
    }

    // =========================================
    // Equity Funds
    // =========================================

    get equityFundsButton() {
        return this.driver.$(
            '~Equity Funds'
        );
    }

    // =========================================
    // Search Icon
    // =========================================

    get searchIcon() {
        return this.driver.$(
            'android=new UiSelector()' +
            '.className("android.widget.ImageView")' +
            '.instance(3)'
        );
    }

    // =========================================
    // Search Field
    // =========================================

    get searchField() {
        return this.driver.$(
            '//android.widget.EditText[@hint="Search Funds..."]'
        );
    }

    // =========================================
    // Search Results
    // =========================================

    get searchResults() {
        return this.driver.$$(
            '//android.widget.ScrollView' +
            '//android.widget.ImageView[@clickable="true"]'
        );
    }

    // =========================================
    // Fund Cards - Equity Funds
    // =========================================

    get fundCards() {
        return this.driver.$$(
            'android=new UiSelector()' +
            '.className("android.widget.ImageView")' +
            '.descriptionContains("Riskometer")'
        );
    }

    // =========================================
    // Click Mutual Funds
    // =========================================

    async clickMutualFunds() {

        await this.mutualFunds.waitForDisplayed({
            timeout: 30000
        });

        await this.mutualFunds.click();

        console.log("Mutual Funds clicked");
    }

    // =========================================
    // Click Explore Funds
    // =========================================

    async clickExploreFunds() {

        await this.exploreFundsButton.waitForDisplayed({
            timeout: 30000
        });

        await this.exploreFundsButton.click();

        console.log("Explore Funds clicked");
    }

    // =========================================
    // Select Equity Funds
    // =========================================

    async selectEquityFunds() {

        await this.equityFundsButton.waitForDisplayed({
            timeout: 30000
        });

        await this.equityFundsButton.click();

        console.log("Equity Funds clicked");
    }

    // =========================================
    // Click Search
    // =========================================

    async clickSearch() {

        await this.searchIcon.waitForDisplayed({
            timeout: 30000
        });

        await this.searchIcon.click();

        console.log("Search icon clicked");
    }

    // =========================================
    // Search Fund
    // =========================================

    async searchFund(keyword) {

        await this.searchField.waitForDisplayed({
            timeout: 30000
        });

        await this.searchField.click();

        await this.searchField.clearValue();

        await this.searchField.setValue(keyword);

        console.log(
            `Searching for fund: ${keyword}`
        );
    }

    // =========================================
    // Click First Visible Fund
    // =========================================

    async clickFirstVisibleFund() {

        await this.driver.waitUntil(
            async () => {

                const results =
                    await this.searchResults;

                return results.length > 0;

            },
            {
                timeout: 30000,
                interval: 1000,
                timeoutMsg:
                    "No fund search results were displayed"
            }
        );

        const results =
            await this.searchResults;

        console.log(
            `Search results found: ${results.length}`
        );

        const firstFund =
            results[0];

        const fundData =
            await firstFund.getAttribute(
                "content-desc"
            );

        console.log("");
        console.log("First visible fund:");
        console.log(fundData);

        await firstFund.click();

        console.log(
            "First visible fund clicked"
        );
    }

    // =========================================
    // Validate Single Fund Card
    // =========================================

    validateFundData(fundData, index) {

        if (!fundData) {

            throw new Error(
                `Fund Card ${index}: content-desc is empty`
            );
        }

        console.log(`\nFund Card ${index}:`);
        console.log(fundData);

        // -----------------------------------------
        // Validate Riskometer
        // -----------------------------------------

        if (!fundData.includes("Riskometer")) {

            throw new Error(
                `Fund Card ${index}: Riskometer is missing`
            );
        }

        // -----------------------------------------
        // Validate Min SIP Amount
        // -----------------------------------------

        if (!fundData.includes("Min SIP amount")) {

            throw new Error(
                `Fund Card ${index}: Min SIP amount is missing`
            );
        }

        // -----------------------------------------
        // Validate 3Y Return
        // -----------------------------------------

        if (!fundData.includes("3Y Return")) {

            throw new Error(
                `Fund Card ${index}: 3Y Return is missing`
            );
        }

        // -----------------------------------------
        // Validate SIP Amount
        // -----------------------------------------

        const sipPattern =
            /₹\s*[\d,]+(\.\d{2})?/;

        if (!sipPattern.test(fundData)) {

            throw new Error(
                `Fund Card ${index}: Invalid SIP amount`
            );
        }

        // -----------------------------------------
        // Validate 3Y Return
        // -----------------------------------------

        const returnPattern =
            /\d+(\.\d+)?%/;

        const noReturnAvailable =
            fundData.includes("3Y Return\n-");

        if (
            !returnPattern.test(fundData) &&
            !noReturnAvailable
        ) {

            throw new Error(
                `Fund Card ${index}: Invalid 3Y Return`
            );
        }

        console.log(
            `Fund Card ${index}: validation PASSED`
        );
    }

    // =========================================
    // Validate All Equity Fund Cards
    // =========================================

    async validateAllFundCards() {

        console.log("");
        console.log("=================================");
        console.log("VALIDATING ALL EQUITY FUND CARDS");
        console.log("=================================");

        const validatedFunds =
            new Set();

        let scrollCount = 0;

        const maxScrolls = 20;

        while (
            scrollCount < maxScrolls
        ) {

            // -----------------------------------------
            // Wait for Fund Cards
            // -----------------------------------------

            await this.driver.waitUntil(
                async () => {

                    const cards =
                        await this.fundCards;

                    return cards.length > 0;

                },
                {
                    timeout: 30000,
                    interval: 1000,
                    timeoutMsg:
                        "Equity Fund cards did not load"
                }
            );

            // -----------------------------------------
            // Get Visible Cards
            // -----------------------------------------

            const cards =
                await this.fundCards;

            console.log("");
            console.log(
                `Visible fund cards: ${cards.length}`
            );

            // -----------------------------------------
            // Validate Visible Cards
            // -----------------------------------------

            for (
                let i = 0;
                i < cards.length;
                i++
            ) {

                const fundData =
                    await cards[i].getAttribute(
                        "content-desc"
                    );

                if (!fundData) {
                    continue;
                }

                const fundKey =
                    fundData.trim();

                // -----------------------------------------
                // Skip Already Validated Fund
                // -----------------------------------------

                if (
                    validatedFunds.has(
                        fundKey
                    )
                ) {
                    continue;
                }

                const fundNumber =
                    validatedFunds.size + 1;

                this.validateFundData(
                    fundData,
                    fundNumber
                );

                validatedFunds.add(
                    fundKey
                );
            }

            // -----------------------------------------
            // Scroll Down
            // -----------------------------------------

            console.log("");
            console.log(
                `Scrolling down... Attempt ${scrollCount + 1}`
            );

            const canScrollMore =
                await this.driver.execute(
                    "mobile: scrollGesture",
                    {
                        left: 100,
                        top: 300,
                        width: 850,
                        height: 1200,
                        direction: "down",
                        percent: 0.80
                    }
                );

            await this.driver.pause(
                1000
            );

            scrollCount++;

            console.log(
                "More content available:",
                canScrollMore
            );

            // -----------------------------------------
            // Reached Bottom
            // -----------------------------------------

            if (!canScrollMore) {

                console.log(
                    "Reached the bottom of the Equity Funds list."
                );

                break;
            }
        }

        // =========================================
        // Final Validation
        // =========================================

        if (
            validatedFunds.size === 0
        ) {

            throw new Error(
                "No Equity Fund cards were validated"
            );
        }

        console.log("");
        console.log("=================================");
        console.log(
            `TOTAL UNIQUE FUNDS VALIDATED: ${validatedFunds.size}`
        );
        console.log(
            "ALL EQUITY FUND CARDS VALIDATED"
        );
        console.log("=================================");
    }
}

module.exports = FundsPage;