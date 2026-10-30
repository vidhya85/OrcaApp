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


    // =========================================
    // Mobile Number Actions
    // =========================================

    async enterMobileNumber(mobileNumber) {

        await this.mobileNumberField.waitForDisplayed({
            timeout: 30000
        });

        await this.mobileNumberField.click();

        await this.mobileNumberField.setValue(
            mobileNumber
        );
    }


    async clickSendOtp() {

        await this.sendOtpButton.waitForDisplayed({
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

        console.log("Entering TPIN...");

        await this.tpinField.waitForDisplayed({
            timeout: 30000
        });

        await this.tpinField.click();

        await this.tpinField.setValue(tpin);

        console.log("TPIN entered.");

        // ORCA automatically processes Secure Login
        // after the complete TPIN is entered.
        console.log("Waiting for ORCA to process Secure Login...");

        /*try {
            await this.driver.hideKeyboard();
            console.log("Keyboard hidden.");
        } catch (error) {
            console.log("Keyboard already hidden.");
        }*/
    }
}


module.exports = LoginPage;