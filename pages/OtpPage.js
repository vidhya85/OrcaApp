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

        console.log("OTP field found.");
    }


    // =========================================
    // ENTER OTP
    // =========================================

    async enterOtp(otp) {

        console.log("Entering OTP...");
        console.log("OTP received:", otp);

        await this.otpField.waitForDisplayed({
            timeout: 30000
        });

        await this.otpField.click();

        await this.otpField.clearValue();

        await this.otpField.setValue(otp);

        console.log("OTP entered successfully.");
    }
    
}


module.exports = OtpPage;