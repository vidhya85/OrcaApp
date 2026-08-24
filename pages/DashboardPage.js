class DashboardPage {

    constructor(driver) {
        this.driver = driver;
    }

    get mutualFunds() {
        return this.driver.$(
            'android=new UiSelector().descriptionContains("Mutual Funds")'
        );
    }

    async isDisplayed() {

        try {

            await this.mutualFunds.waitForExist({
                timeout: 15000
            });

            console.log("Dashboard detected.");

            return true;

        } catch (error) {

            console.log("Dashboard not detected.");

            return false;
        }
    }
}

module.exports = DashboardPage;