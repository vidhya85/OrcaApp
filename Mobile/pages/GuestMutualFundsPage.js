class GuestMutualFundsPage {

    constructor(driver) {
        this.driver = driver;
    }

    get activatedMessage() {
        return this.driver.$('~Activated!');
    }

    get continueToKYC() {
        return this.driver.$('~Continue to KYC');
    }

    get exploreFunds() {
        return this.driver.$('~   Explore Funds');
    }

    async waitForPage() {

        console.log("");
        console.log(
            "Waiting for Mutual Funds Activated screen..."
        );

        await this.activatedMessage.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Mutual Funds Activated screen displayed."
        );
    }

    async clickExploreFunds() {

        console.log(
            "Clicking Explore Funds..."
        );

        await this.exploreFunds.waitForDisplayed({
            timeout: 30000
        });

        await this.exploreFunds.click();

        console.log(
            "Explore Funds clicked."
        );
    }
}

module.exports = GuestMutualFundsPage;