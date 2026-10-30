class WelcomePage {

    constructor(driver) {
        this.driver = driver;
    }

    get letsEnrichButton() {
        return this.driver.$("~Let's Enrich");
    }

    async clickLetsEnrich() {
        await this.letsEnrichButton.waitForExist({
            timeout: 30000
        });

        await this.letsEnrichButton.click();
    }
}

module.exports = WelcomePage;