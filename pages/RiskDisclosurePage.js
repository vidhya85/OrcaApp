class RiskDisclosurePage {

    constructor(driver) {
        this.driver = driver;
    }

    get understandButton() {
        return this.driver.$(
            'android=new UiSelector().description("I Understand")'
        );
    }

    async clickIUnderstand() {

        await this.understandButton.waitForDisplayed({
            timeout: 30000
        });

        console.log("I Understand button found");

        await this.understandButton.click();

        console.log("I Understand clicked");
    }
}

module.exports = RiskDisclosurePage;