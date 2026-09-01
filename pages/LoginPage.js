class LoginPage {

    constructor(driver) {
        this.driver = driver;
    }

    // =========================================
    // Mobile Number
    // =========================================

    get mobileNumberField() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(0)'
        );
    }

    get sendOtpButton() {
        return this.driver.$("~Send OTP");
    }


    // =========================================
    // TPIN Screen
    // =========================================

    get enterTPINText() {
        return this.driver.$("~Enter TPIN");
    }

    get tpinField() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
    }

    get secureLoginButton() {
        return this.driver.$("~Secure Login");
    }


    // =========================================
    // Mobile Number Actions
    // =========================================

    async enterMobileNumber(mobileNumber) {

        await this.mobileNumberField.waitForExist({
            timeout: 30000
        });

        await this.mobileNumberField.click();

        await this.mobileNumberField.setValue(
            mobileNumber
        );
    }


    async clickSendOtp() {

        await this.sendOtpButton.waitForExist({
            timeout: 30000
        });

        await this.sendOtpButton.click();
    }


    // =========================================
    // TPIN Actions
    // =========================================

    async waitForTPINScreen() {

        await this.enterTPINText.waitForDisplayed({
            timeout: 30000
        });

        console.log("TPIN screen displayed.");
    }


    async enterTPIN(tpin) {

        await this.tpinField.waitForDisplayed({
            timeout: 30000
        });

        await this.tpinField.click();

        await this.tpinField.setValue(tpin);
    }


    async clickSecureLogin() {

        await this.secureLoginButton.waitForDisplayed({
            timeout: 30000
        });

        await this.secureLoginButton.click();
    }
}


module.exports = LoginPage;