class DashboardPage {

    constructor(driver) {
        this.driver = driver;
    }

    // Unique Dashboard element
    get dashboardIdentifier() {
        return this.driver.$(
            'android=new UiSelector().description("Available Balance")'
        );
    }

    async isDisplayed() {

        try {

            await this.dashboardIdentifier.waitForDisplayed({
                timeout: 5000
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