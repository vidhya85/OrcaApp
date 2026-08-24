class PermissionHandler {

    constructor(driver) {
        this.driver = driver;
    }

    async handleNotificationPermission() {

        await this.driver.pause(3000);

        const allowButton = await this.driver.$(
            'android=new UiSelector().text("Allow")'
        );

        if (await allowButton.isExisting()) {

            await allowButton.click();

            console.log("Notification permission handled");

        } else {

            console.log("Notification permission not displayed");
        }
    }
}

module.exports = PermissionHandler;