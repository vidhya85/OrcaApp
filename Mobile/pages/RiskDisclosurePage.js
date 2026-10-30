class RiskDisclosurePage {

    constructor(driver) {
        this.driver = driver;
    }

    // =========================================
    // I Understand Button
    // =========================================

    get understandButton() {
        return this.driver.$("~I Understand");
    }


    // =========================================
    // Wait For Risk Disclosure
    // =========================================

    async waitForRiskDisclosure() {

        await this.understandButton.waitForDisplayed({
            timeout: 30000
        });

        console.log(
            "Risk Disclosure screen displayed."
        );
    }


    // =========================================
    // Click I Understand
    // =========================================

    async clickIUnderstand() {

        await this.waitForRiskDisclosure();

        console.log(
            "I Understand button found."
        );

        await this.understandButton.click();

        console.log(
            "I Understand clicked."
        );
    }
}


module.exports = RiskDisclosurePage;