class WatchlistPage {

    constructor(driver) {
        this.driver = driver;
    }

    // ============================================================
    // WATCHLIST
    // ============================================================

    get watchlist() {
        return this.driver.$('~Watchlist');
    }

    get editWatchlists() {
        return this.driver.$('~Edit Watchlists');
    }

    get addGroup() {
        return this.driver.$('~Add Group');
    }

    // ============================================================
    // OPEN WATCHLIST
    // ============================================================

    async clickWatchlist() {

        await this.watchlist.waitForDisplayed({
            timeout: 10000,
            interval: 1000
        });

        await this.watchlist.click();

        console.log("Watchlist clicked.");

        await this.driver.pause(1000);
    }

    // ============================================================
    // CLICK WATCHLIST W1 - W6
    // ============================================================

    async clickWatchlistByName(watchlistName) {

        const watchlist = this.driver.$(
            `//*[@content-desc="${watchlistName.toLowerCase()}"]`
        );

        await watchlist.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        await watchlist.click();

        console.log(
            `${watchlistName.toUpperCase()} clicked.`
        );

        await this.driver.pause(1000);
    }

    // ============================================================
    // VALIDATE CURRENT WATCHLIST
    // ============================================================

    async validateCurrentWatchlist(watchlistName) {

        console.log("");
        console.log("==============================================");
        console.log(
            `VALIDATING ${watchlistName.toUpperCase()}`
        );
        console.log("==============================================");

        // --------------------------------------------------------
        // Find Default group dynamically
        // --------------------------------------------------------

        const defaultGroup = this.driver.$(
            '//*[starts-with(@content-desc,"Default group")]'
        );

        let description = null;

        try {

            await defaultGroup.waitForDisplayed({
                timeout: 5000,
                interval: 300
            });

            description = await defaultGroup.getAttribute(
                "content-desc"
            );

        } catch (error) {

            console.log(
                `Default group not found in ${watchlistName.toUpperCase()}.`
            );

            return {
                count: 0,
                items: [],
                valid: true
            };
        }

        // --------------------------------------------------------
        // Default group not found
        // --------------------------------------------------------

        if (!description) {

            console.log(
                `Default group not found in ${watchlistName.toUpperCase()} after waiting.`
            );

            console.log(
                `${watchlistName.toUpperCase()} may be empty.`
            );

            return {
                count: 0,
                items: [],
                valid: true
            };
        }

        // --------------------------------------------------------
        // Get displayed count
        // --------------------------------------------------------

        const countMatch = description.match(
            /Default group \((\d+)\)/
        );

        const displayedCount = countMatch
            ? parseInt(countMatch[1], 10)
            : 0;

        console.log("");
        console.log(
            `Default group count: ${displayedCount}`
        );

        // --------------------------------------------------------
        // If count is 0
        // --------------------------------------------------------

        if (displayedCount === 0) {

            console.log(
                `${watchlistName.toUpperCase()} has 0 items.`
            );

            console.log(
                "Moving to next watchlist."
            );

            console.log(
                "=============================================="
            );

            return {
                count: 0,
                items: [],
                valid: true
            };
        }

        // --------------------------------------------------------
        // Get item information
        // --------------------------------------------------------

        const lines = description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const itemLines = lines.slice(1);

        console.log("");
        console.log(
            `${watchlistName.toUpperCase()} has ${displayedCount} item(s).`
        );

        console.log("");
        console.log("Items/content displayed:");

        itemLines.forEach((line, index) => {

            console.log(
                `${index + 1}. ${line}`
            );

        });

        console.log("");

        console.log(
            `PASS: ${watchlistName.toUpperCase()} contains data.`
        );

        console.log(
            "=============================================="
        );

        return {
            count: displayedCount,
            items: itemLines,
            valid: true
        };
    }

    // ============================================================
    // VALIDATE W1 - W6
    // ============================================================

    async validateAllWatchlists() {

        console.log("");
        console.log("==============================================");
        console.log("      VALIDATING WATCHLISTS W1 - W6");
        console.log("==============================================");

        const watchlists = [
            "w1",
            "w2",
            "w3",
            "w4",
            "w5",
            "w6"
        ];

        const results = [];

        for (const watchlist of watchlists) {

            // ----------------------------------------------------
            // W1 is already selected automatically
            // ----------------------------------------------------

            if (watchlist !== "w1") {

                await this.clickWatchlistByName(
                    watchlist
                );

            } else {

                console.log(
                    "W1 is already selected. Waiting for items to load..."
                );

                await this.driver.pause(2000);
            }

            // ----------------------------------------------------
            // Validate current watchlist
            // ----------------------------------------------------

            const result =
                await this.validateCurrentWatchlist(
                    watchlist
                );

            results.push({
                watchlist: watchlist,
                count: result.count,
                valid: result.valid
            });

            // ----------------------------------------------------
            // Empty watchlist
            // ----------------------------------------------------

            if (result.count === 0) {

                console.log(
                    `${watchlist.toUpperCase()} is empty.`
                );

                console.log(
                    "Continuing to next watchlist..."
                );

                continue;
            }

            // ----------------------------------------------------
            // Watchlist contains items
            // ----------------------------------------------------

            console.log(
                `${watchlist.toUpperCase()} has ${result.count} item(s).`
            );
        }

        console.log("");
        console.log("==============================================");
        console.log("       W1 - W6 VALIDATION COMPLETED");
        console.log("==============================================");

        results.forEach(result => {

            console.log(
                `${result.watchlist.toUpperCase()} : ${result.count} item(s)`
            );

        });

        console.log(
            "=============================================="
        );

        return results;
    }

    // ============================================================
    // CLICK W1
    // ============================================================

    async clickW1() {

        const w1 = this.driver.$(
            '//*[@content-desc="w1"]'
        );

        await w1.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        await w1.click();

        console.log("W1 clicked.");

        await this.driver.pause(1000);
    }

    // ============================================================
    // SELECT FIRST AVAILABLE ITEM IN W1
    // ============================================================


async clickFirstAvailableItem() {

    console.log("");
    console.log("Selecting first available item in W1...");

    /*
     * Stock rows have:
     *   clickable="true"
     *   content-desc containing "NSE"
     *   content-desc containing "₹"
     *
     * We deliberately do NOT depend on the Default group
     * parent-child hierarchy because Appium is not resolving
     * that hierarchy consistently.
     */

    const stockItems = await this.driver.$$(
        '//*[@clickable="true" and ' +
        'contains(@content-desc,"NSE") and ' +
        'contains(@content-desc,"₹")]'
    );

    console.log(
        `Found ${stockItems.length} stock item(s).`
    );

    if (stockItems.length === 0) {
        throw new Error(
            "No stock items found in W1."
        );
    }

    const firstItem = stockItems[0];

    await firstItem.waitForDisplayed({
        timeout: 10000,
        interval: 500
    });

    const itemDetails =
        await firstItem.getAttribute("content-desc");

    console.log("");
    console.log("First available W1 item:");

    if (itemDetails) {
        console.log(itemDetails);
    } else {
        console.log(
            "WARNING: Stock content-desc is null."
        );
    }

    await firstItem.click();

    await this.driver.pause(2000);

    console.log(
        "First available W1 item clicked."
    );
}


    // ============================================================
    // CLICK BUY ON STOCK DETAILS
    // ============================================================

    async clickBuy() {

        console.log("");
        console.log(
            "Clicking BUY..."
        );

        const buyButton = this.driver.$(
            '~BUY'
        );

        await buyButton.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        await buyButton.click();

        await this.driver.pause(1500);

        console.log(
            "BUY clicked."
        );
    }

    // ============================================================
    // CLICK FINAL BUY BUTTON
    // ============================================================

    async clickFinalBuy() {

        console.log("");
        console.log(
            "Clicking final BUY button..."
        );

        const buyButton = this.driver.$(
            '~BUY'
        );

        await buyButton.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        await buyButton.click();

        await this.driver.pause(2000);

        console.log(
            "Final BUY button clicked."
        );
    }

    // ============================================================
    // VALIDATE ORDER REJECTION
    // ============================================================

    async validateOrderRejected() {

        console.log("");
        console.log(
            "Validating order status..."
        );

        // --------------------------------------------------------
        // Validate REJECTED status
        // --------------------------------------------------------

        const rejected = this.driver.$(
            '~REJECTED'
        );

        await rejected.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        const status =
            await rejected.getAttribute(
                "content-desc"
            );

        console.log(
            `Order Status: ${status}`
        );

        if (status !== "REJECTED") {

            throw new Error(
                `Expected order status REJECTED but found ${status}`
            );
        }

        console.log(
            "PASS: Order status is REJECTED."
        );

        // --------------------------------------------------------
        // Validate rejection reason
        // --------------------------------------------------------

        const rejectionReason =
            this.driver.$(
                '//*[contains(@content-desc,"Rejection Reason:")]'
            );

        await rejectionReason.waitForDisplayed({
            timeout: 10000,
            interval: 500
        });

        const reason =
            await rejectionReason.getAttribute(
                "content-desc"
            );

        console.log("");
        console.log(
            `Rejection Reason: ${reason}`
        );

        if (!reason.includes("Margin Shortfall")) {

            throw new Error(
                `Expected Margin Shortfall rejection but found: ${reason}`
            );
        }

        console.log(
            "PASS: Rejection reason is Margin Shortfall."
        );

        console.log("");
        console.log(
            "=============================================="
        );

        console.log(
            "FINAL BUY ORDER VALIDATION: PASS"
        );

        console.log(
            "=============================================="
        );

        return true;
    }
}

module.exports = WatchlistPage;
