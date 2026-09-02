class PermissionHandler {

    constructor(driver) {
        this.driver = driver;
    }


    // =========================================
    // Notification Permission
    // =========================================

    async handleNotificationPermission() {

        await this.driver.pause(3000);

        const allowButton = await this.driver.$(
            'android=new UiSelector().text("Allow")'
        );

        if (await allowButton.isExisting()) {

            await allowButton.click();

            console.log(
                "Notification permission handled"
            );

        } else {

            console.log(
                "Notification permission not displayed"
            );
        }
    }


    // =========================================
    // Google Phone Number Chooser
    // =========================================

    async handlePhoneNumberChooser() {

        console.log(
            "Checking for phone number chooser..."
        );

        const cancelButton = await this.driver.$(
            'android=new UiSelector().resourceId("com.google.android.gms:id/cancel")'
        );

        try {

            await cancelButton.waitForDisplayed({
                timeout: 5000
            });

            console.log(
                "Phone number chooser displayed."
            );

            await cancelButton.click();

            console.log(
                "Phone number chooser closed."
            );

        } catch (error) {

            console.log(
                "Phone number chooser not displayed."
            );
        }
    }
}


module.exports = PermissionHandler;