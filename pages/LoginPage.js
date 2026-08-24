class LoginPage {

    constructor(driver) {
        this.driver = driver;
    }

    get mobileNumberField() {
        return this.driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(0)'
        );
    }

    get sendOtpButton() {
        return this.driver.$("~Send OTP");
    }

    async enterMobileNumber(mobileNumber) {

        await this.mobileNumberField.waitForExist({
            timeout: 30000
        });

        await this.mobileNumberField.click();

        await this.mobileNumberField.setValue(mobileNumber);
    }

    async clickSendOtp() {

        await this.sendOtpButton.waitForExist({
            timeout: 30000
        });

        await this.sendOtpButton.click();
    }
}

module.exports = LoginPage;