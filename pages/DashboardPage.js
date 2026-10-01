class DashboardPage {

    constructor(driver) {
        this.driver = driver;
    }


    // =========================================
    // Dashboard Identifier
    // =========================================

    get dashboardIdentifier() {

        return this.driver.$(
            '~Products'
        );
    }


    // =========================================
    // Mutual Funds Card
    // =========================================

    get mutualFundsCard() {

        return this.driver.$(
            '~Mutual Funds\nScreen And Analyze'
        );
    }


    // =========================================
    // Check Dashboard
    // =========================================

    async isDisplayed(timeout = 30000) {

        try {

            await this.dashboardIdentifier
                .waitForDisplayed({
                    timeout: timeout,
                    interval: 1000
                });

            console.log(
                "Dashboard detected."
            );

            return true;

        } catch (error) {

            console.log(
                `Dashboard not detected after ${timeout / 1000} seconds.`
            );

            return false;
        }
    }
}


module.exports = DashboardPage;