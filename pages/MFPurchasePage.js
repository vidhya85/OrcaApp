class MFPurchasePage {

    constructor(driver) {
        this.driver = driver;
    }


    // =========================================
    // MF Purchase Screen
    // =========================================

    get purchaseAmountField() {
        return this.driver.$(
            'android=new UiSelector()' +
            '.className("android.widget.EditText")'
        );
    }


    get addToCartButton() {
        return this.driver.$('~Add to Cart');
    }


    get continuePurchaseButton() {
        return this.driver.$('~Continue Purchase');
    }

    get cartIcon() {
        return this.driver.$(
            '//android.view.View[@clickable="true" and @content-desc and ' +
            '@bounds="[930,174][1041,284]"]'
        );
    }

    get cartScreen() {
        return this.driver.$('~Mutual Funds Cart');
    }

    get payButton() {
        return this.driver.$(
            'android=new UiSelector().descriptionContains("Pay ₹")'
        );
    }
    // =========================================
    // Get Investment Amount
    // =========================================
    async getInvestmentAmount() {

        await this.purchaseAmountField.waitForDisplayed({
            timeout: 10000
        });

        const amount =
            await this.purchaseAmountField.getAttribute("text");

        console.log(
            `Current investment amount: ₹${amount}`
        );

        return amount;
    }

    // =========================================
    // Enter Investment Amount
    // =========================================

    async enterInvestmentAmount(amount) {

        console.log("");
        console.log(
            `Entering investment amount: ₹${amount}`
        );

        await this.purchaseAmountField.waitForDisplayed({
            timeout: 10000
        });

        // Select amount field
        await this.purchaseAmountField.click();



        await this.purchaseAmountField.clearValue();

        await this.purchaseAmountField.setValue(
            String(amount)
        );

        console.log(
            `Investment amount ₹${amount} entered.`
        );
    }


    // =========================================
    // Add To Cart
    // =========================================

    async clickAddToCart() {

        console.log("");
        console.log("Clicking Add to Cart...");

        await this.addToCartButton.waitForDisplayed({
            timeout: 10000
        });

        await this.addToCartButton.click();

        console.log("Add to Cart clicked.");
    }

    // =========================================
    // Get Cart Count
    // =========================================

    async getCartCount() {
        const cartElements = await this.driver.$$(
            '//android.view.View[@clickable="true" and @content-desc]'
        );

        for (let i = 0; i < cartElements.length; i++) {
            const contentDesc = await cartElements[i].getAttribute("content-desc");

            if (contentDesc && /^\d+$/.test(contentDesc.trim())) {
                const count = parseInt(contentDesc.trim(), 10);

                console.log(`Current cart count: ${count}`);

                return count;
            }
        }

        console.log("Cart is empty. Current cart count: 0");
        return 0;
    }
    // =========================================
    // Click Cart Icon
    // =========================================

    async clickCartIcon() {
        console.log("");
        console.log("Clicking Cart icon...");

        await this.cartIcon.waitForDisplayed({
            timeout: 10000
        });

        const contentDesc =
            await this.cartIcon.getAttribute("content-desc");

        console.log(`Cart count detected: ${contentDesc}`);

        await this.cartIcon.click();

        console.log("Cart icon clicked.");
    }
    // =========================================
    // Cart Screen Displayed
    // =========================================
    async isCartScreenDisplayed() {
        await this.cartScreen.waitForDisplayed({
            timeout: 10000
        });

        return await this.cartScreen.isDisplayed();
    }
    // =========================================
    // Click Pay in Cart Screen
    // =========================================
    async clickPay() {
        console.log("");
        console.log("Clicking Pay...");

        await this.payButton.waitForDisplayed({
            timeout: 10000
        });

        const description =
            await this.payButton.getAttribute("content-desc");

        console.log(`Payment button: ${description}`);

        await this.payButton.click();

        console.log("Pay button clicked.");
    }
    // =========================================
    // Continue Purchase
    // =========================================

    async clickContinuePurchase() {

        console.log("");
        console.log("Clicking Continue Purchase...");

        await this.continuePurchaseButton.waitForDisplayed({
            timeout: 10000
        });

        await this.continuePurchaseButton.click();

        console.log("Continue Purchase clicked.");
    }


    async isOtpAuthorizationScreenDisplayed() {
        const otpScreen = await this.driver.$(
            '~Authorise with OTP'
        );

        await otpScreen.waitForDisplayed({
            timeout: 10000
        });

        return await otpScreen.isDisplayed();
    }
}
module.exports = MFPurchasePage;