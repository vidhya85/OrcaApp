class OtpPage {

    constructor(driver) {
        this.driver = driver;
    }

    get otpField() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
    }

    /*get continueButton() {
        return this.driver.$("~Continue");
    }*/
   // =========================================
    // TEMPORARY OTP SCREEN INSPECTION
    // =========================================

    async inspectOtpScreen() {

        console.log("Waiting for OTP screen...");

        await this.driver.pause(5000);

        console.log("");
        console.log("========================================");
        console.log("          OTP SCREEN INSPECTION");
        console.log("========================================");

        const source = await this.driver.getPageSource();

        console.log(source);

        console.log("");
        console.log("========================================");
        console.log("       END OTP SCREEN INSPECTION");
        console.log("========================================");
    }
    // =========================================
    // OTP ENTRY
    // =========================================

    async waitForOtpEntry() {

        console.log("Waiting for OTP screen...");

        await this.otpField.waitForExist({
            timeout: 30000
        });

        await this.otpField.waitForDisplayed({
            timeout: 30000
        });

        console.log("OTP field found");
        console.log("Waiting for manual OTP entry...");

        await this.driver.waitUntil(
            async () => {

                try {

                    const otpText =
                        await this.otpField.getAttribute("text");

                    const otpLength =
                        otpText ? otpText.length : 0;

                    console.log("OTP length:", otpLength);

                    return otpLength === 6;

                } catch (error) {

                    return false;
                }
            },
            {
                timeout: 120000,
                interval: 1000,
                timeoutMsg:
                    "OTP was not entered within 2 minutes"
            }
        );

        console.log("6-digit OTP entered");
    }

    /*async clickContinue() {

        await this.continueButton.waitForExist({
            timeout: 30000
        });

        await this.continueButton.waitForDisplayed({
            timeout: 30000
        });

        await this.continueButton.click();

        console.log("Continue clicked");
    }*/
}

module.exports = OtpPage;