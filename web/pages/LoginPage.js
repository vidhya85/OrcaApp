


class LoginPage {
    constructor(page) {
        this.page = page;

        this.mobileNumberInput = page.locator(
            'input[placeholder="Enter your mobile number"]'
        );

        this.otpInput = page.locator(
            'input[placeholder="Enter 6-digit OTP"]'
        );

        this.continueButton = page.getByRole('button', {
            name: 'Continue',
            exact: true
        });
        this.tpinInput = page.locator(
            'input[placeholder="Enter 6-digit Tpin"]'
        );
    }

    async openTradeLogin() {
        await this.page.goto('https://orca.enrichmoney.in/');

        await this.page.getByText('Trade Mode', {
            exact: true
        }).click();

        await this.page.waitForURL('**/authentication/login');
    }

    async enterMobileNumber(mobileNumber) {
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async enterOtp(otp) {
        await this.otpInput.fill(otp);
    }



    async enterTPIN(tpin) {
        await this.tpinInput.fill(tpin);
    }

}

module.exports = LoginPage;
