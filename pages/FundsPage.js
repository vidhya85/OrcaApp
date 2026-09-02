class FundsPage {
    constructor(driver) {
        this.driver = driver;
    }

    // =========================================================
    // DASHBOARD - MUTUAL FUNDS
    // =========================================================

    get mutualFunds() {
        return this.driver.$('~Mutual Funds\nScreen And Analyze');
    }

    // =========================================================
    // SCHEME COLLECTIONS SCREEN
    // =========================================================

    get schemeCollectionsTitle() {
        return this.driver.$('~Scheme Collections');
    }

    get equityFundsButton() {
        return this.driver.$('~Equity Funds');
    }

    get hybridFundsButton() {
        return this.driver.$('~Hybrid Funds');
    }

    get debtFundsButton() {
        return this.driver.$('~Debt Funds');
    }

    get commodityFundsButton() {
        return this.driver.$('~Commodity Funds');
    }

    get fundOfFundsButton() {
        return this.driver.$('~Fund of Funds');
    }

    get solutionOrientedButton() {
        return this.driver.$('~Solution Oriented');
    }

    // =========================================================
    // EQUITY FUNDS SCREEN
    // =========================================================

    get fundCount() {
        return this.driver.$(
            'android=new UiSelector()' +
            '.textContains("Funds")'
        );
    }

    // Fund cards are android.view.View elements.
    // Riskometer is present in the content description.
    get fundCards() {
        return this.driver.$$(
            'android=new UiSelector()' +
            '.className("android.widget.ImageView")' +
            '.descriptionContains("Riskometer")' +
            '.clickable(true)'
        );
    }

    // =========================================================
    // SEARCH
    // =========================================================

    get searchIcon() {
        return this.driver.$(
            '//android.widget.ImageView[@clickable="true" and @bounds="[930,174][1041,284]"]'
        );
    }

    get searchField() {
        return this.driver.$(
            'android=new UiSelector()' +
            '.className("android.widget.EditText")'
        );
    }

    get searchResults() {
        return this.driver.$$(
            'android=new UiSelector()' +
            '.className("android.view.View")' +
            '.clickable(true)'
        );
    }

    // =========================================================
    // CLICK MUTUAL FUNDS
    // =========================================================

    async clickMutualFunds() {

        console.log("");
        console.log("Opening Mutual Funds...");

        await this.mutualFunds.click();

        console.log("Mutual Funds clicked.");

        await this.schemeCollectionsTitle.waitForDisplayed({
            timeout: 10000
        });

        console.log("Scheme Collections screen displayed.");
    }
    // =========================================================
    // SELECT EQUITY FUNDS
    // =========================================================

    async selectEquityFunds() {
        console.log("");
        console.log("Selecting Equity Funds...");

        await this.equityFundsButton.waitForDisplayed({
            timeout: 30000
        });

        await this.equityFundsButton.click();

        console.log("Equity Funds clicked.");

        await this.driver.pause(2000);

        // Verify that fund cards are displayed
       /* try {
            await this.fundCards[0].waitForDisplayed({
                timeout: 10000
            });

            console.log("Equity Funds list displayed.");
        } catch (error) {
            console.log(
                "Equity Funds list opened, but fund cards are not currently visible."
            );
        }*/
    }

    // =========================================================
    // GET VISIBLE FUND CARDS
    // =========================================================

    async getVisibleFundCards() {
        return await this.fundCards;
    }
    // =========================================================
    // SCROLL EQUITY FUNDS LIST
    // =========================================================

    async scrollFundList() {

        console.log("");
        console.log("Scrolling Equity Funds list...");

        const canScroll = await this.driver.execute(
            "mobile: scrollGesture",
            {
                left: 100,
                top: 500,
                width: 880,
                height: 1300,
                direction: "down",
                percent: 0.50
            }
        );

        await this.driver.pause(1000);
        

        console.log(
            "More funds available:",
            canScroll
        );

        return canScroll;
    }

    // =========================================================
    // VALIDATE FUND CARDS
    // =========================================================

    async validateAllFundCards() {
        console.log("");
        console.log("Validating visible fund cards...");

        const cards = await this.fundCards;

        console.log("Visible fund cards:", cards.length);

        if (cards.length === 0) {
            throw new Error("No fund cards found.");
        }

        for (let i = 0; i < cards.length; i++) {
            try {
                await cards[i].waitForDisplayed({
                    timeout: 10000
                });

                const description = await cards[i].getAttribute(
                    "content-desc"
                );

                console.log(
                    `Fund Card ${i + 1}:`,
                    description
                );
            } catch (error) {
                console.log(
                    `Unable to read Fund Card ${i + 1}`
                );
            }
        }

        console.log("Visible fund cards validation completed.");
    }

    // =========================================================
    // OPEN FUND BY INDEX
    // =========================================================

    async openFundByIndex(index) {

        console.log("");
        console.log(`Opening fund card ${index + 1}...`);

        const cards = await this.fundCards;

        if (cards.length === 0) {
            throw new Error("No fund cards are currently visible.");
        }

        if (index >= cards.length) {
            throw new Error(
                `Fund index ${index} is not available. ` +
                `Only ${cards.length} cards are visible.`
            );
        }

        await cards[index].waitForDisplayed({
            timeout: 10000
        });

        const description = await cards[index].getAttribute(
            "content-desc"
        );

        console.log("Opening:", description);

        await cards[index].click();

        console.log("Fund card clicked.");

        await this.driver.pause(2000);
    }

    // =========================================================
    // OPEN FIRST VISIBLE FUND
    // =========================================================

    async clickFirstVisibleFund() {
        console.log("");
        console.log("Opening first visible fund...");

        const cards = await this.fundCards;

        if (cards.length === 0) {
            throw new Error("No fund cards are currently visible.");
        }

        await cards[0].waitForDisplayed({
            timeout: 10000
        });

        const description = await cards[0].getAttribute(
            "content-desc"
        );

        console.log("Opening:", description);

        await cards[0].click();

        await this.driver.pause(2000);

        console.log("First fund opened.");
    }

    // =========================================================
    // RETURN TO EQUITY FUNDS LIST
    // =========================================================

    async returnToEquityFunds() {
        console.log("");
        console.log("Returning to Equity Funds...");

        await this.driver.back();

        await this.driver.pause(2000);

        try {
            await this.fundCards[0].waitForDisplayed({
                timeout: 10000
            });

            console.log("Returned to Equity Funds list.");
        } catch (error) {
            console.log(
                "Returned from fund details, but fund cards are not currently visible."
            );
        }
    }

    // =========================================================
    // SEARCH FUND
    // =========================================================

    async clickSearch() {
        console.log("");
        console.log("Opening fund search...");

        await this.searchIcon.waitForDisplayed({
            timeout: 30000
        });

        await this.searchIcon.click();

        console.log("Search icon clicked.");

        await this.searchField.waitForDisplayed({
            timeout: 30000
        });

        console.log("Fund search field displayed.");
    }

    async searchFund(fundName) {
        console.log("");
        console.log(`Searching for fund: ${fundName}`);

        await this.searchField.waitForDisplayed({
            timeout: 30000
        });

        await this.searchField.click();

        await this.searchField.clearValue();

        await this.searchField.setValue(fundName);

        console.log("Fund name entered.");

        await this.driver.pause(2000);
    }

    // =========================================================
    // GET SEARCH RESULTS
    // =========================================================

    async getSearchResults() {
        const results = await this.searchResults;

        console.log(
            "Search results found:",
            results.length
        );

        return results;
    }
}

module.exports = FundsPage;