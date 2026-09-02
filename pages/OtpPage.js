class OtpPage {

    constructor(driver) {
        this.driver = driver;
    }

    // =========================================
    // OTP Field
    // =========================================

    get otpField() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
    }


    // =========================================
    // OTP SCREEN INSPECTION
    // =========================================

    async inspectOtpScreen() {

        console.log("Waiting for OTP screen...");

        await this.driver.pause(5000);

        console.log("");
        console.log("========================================");
        console.log("          OTP SCREEN INSPECTION");
        console.log("========================================");

        const source =
            await this.driver.getPageSource();

        console.log(source);

        console.log("");
        console.log("========================================");
        console.log("       END OTP SCREEN INSPECTION");
        console.log("========================================");
    }


    // =========================================
    // WAIT FOR OTP SCREEN
    // =========================================

    async waitForOtpEntry() {

        console.log("Waiting for OTP screen...");

        await this.otpField.waitForDisplayed({
            timeout: 30000
        });

        console.log("OTP field found");
        console.log("Waiting for manual OTP entry...");

        /*
         * OTP is entered manually.
         *
         * ORCA automatically moves to the TPIN
         * screen after successful OTP verification.
         *
         * Therefore we do NOT read the OTP text
         * attribute and we do NOT wait for the
         * OTP field to disappear.
         *
         * LoginFlow will verify the TPIN screen
         * immediately after this method.
         */

        await this.driver.pause(5000);

        console.log(
            "OTP entry wait completed."
        );
    }
}


module.exports = OtpPage;