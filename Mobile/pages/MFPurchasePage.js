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


    // =========================================
    // Cart Count
    // =========================================
    //
    // Used mainly for checking the cart BEFORE
    // starting the test.
    //
    // On Scheme Collections screen:
    // bounds = [794,174][904,284]
    //
    // When cart is empty, Appium/WebdriverIO may
    // return the literal string "null" for
    // content-desc.
    //
    // =========================================

    get cartCountElement() {

        return this.driver.$(
            '//android.view.View[' +
            '@clickable="true" and ' +
            '@bounds="[794,174][904,284]"' +
            ']'
        );

    }


    // =========================================
    // Cart Icon
    // =========================================
    //
    // Confirmed working locator when cart
    // contains 1 item.
    //
    // content-desc = "1"
    //
    // =========================================

    get cartIcon() {

        return this.driver.$(
            '//android.view.View[' +
            '@clickable="true" and ' +
            '@content-desc="1"' +
            ']'
        );

    }


    // =========================================
    // Cart Screen
    // =========================================

    get cartScreen() {
        return this.driver.$('~Mutual Funds Cart');
    }


    // =========================================
    // Pay Button
    // =========================================

    get payButton() {

        return this.driver.$(
            'android=new UiSelector().descriptionContains("Pay ₹")'
        );

    }


    // =========================================
    // Cart - Clear Button
    // =========================================

    get clearCartButton() {
        return this.driver.$('~Clear');
    }


    // =========================================
    // Scheme Added Success Message
    // =========================================

    get schemeAddedMessage() {

        return this.driver.$(
            '~Scheme added to cart successfully'
        );

    }

    get noSchemesAvailableMessage() {
        return this.driver.$(
            '~No schemes available in the cart.'
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

        console.log(
            "Add to Cart clicked."
        );
    }


    // =========================================
    // Verify Scheme Added Message
    // =========================================

    async isSchemeAddedMessageDisplayed() {

        try {

            await this.schemeAddedMessage.waitForDisplayed({
                timeout: 5000
            });

            const displayed =
                await this.schemeAddedMessage.isDisplayed();

            console.log(
                `Scheme added success message displayed: ${displayed}`
            );

            return displayed;

        } catch (error) {

            console.log(
                "Scheme added success message was not displayed."
            );

            return false;
        }
    }


    // =========================================
    // Get Cart Count
    // =========================================
    //
    // IMPORTANT:
    // This method is used for INITIAL cart
    // validation / cleanup.
    //
    // After Add To Cart, the purchase screen
    // does not expose this same element, so
    // the test should NOT call getCartCount()
    // immediately after Add To Cart.
    //
    // =========================================

    async getCartCount() {

        try {

            await this.cartCountElement.waitForDisplayed({
                timeout: 5000
            });

            const contentDesc =
                await this.cartCountElement.getAttribute(
                    "content-desc"
                );

            console.log(
                `Cart count content-desc: ${contentDesc}`
            );


            // =========================================
            // Empty Cart
            // =========================================

            if (
                contentDesc === null ||
                contentDesc === undefined ||
                contentDesc.trim() === "" ||
                contentDesc.trim().toLowerCase() === "null"
            ) {

                console.log(
                    "Cart is empty. Current cart count: 0"
                );

                return 0;
            }


            // =========================================
            // Cart Contains Items
            // =========================================

            if (
                /^\d+$/.test(
                    contentDesc.trim()
                )
            ) {

                const count =
                    parseInt(
                        contentDesc.trim(),
                        10
                    );

                console.log(
                    `Current cart count: ${count}`
                );

                return count;
            }


            // =========================================
            // Unexpected Value
            // =========================================

            console.log(
                `Unexpected cart count value: ${contentDesc}`
            );

            return null;

        } catch (error) {

            console.log(
                "Cart count element is not currently available."
            );

            return null;
        }
    }


    // =========================================
    // Check Cart And Clear If Needed
    // =========================================

    async checkAndClearCart() {

        console.log("");
        console.log("Checking Cart...");


        // =========================================
        // Get Current Cart Count
        // =========================================

        const cartCount =
            await this.getCartCount();


        // =========================================
        // Cart Count Not Available
        // =========================================

        if (cartCount === null) {

            throw new Error(
                "Unable to determine cart count before starting test. " +
                "Test stopped to prevent adding a fund to an uncleared cart."
            );
        }


        // =========================================
        // Cart Empty
        // =========================================

        if (cartCount === 0) {

            console.log(
                "Cart is empty. Continuing with test."
            );

            return;
        }


        // =========================================
        // Cart Contains Items
        // =========================================

        console.log(
            `Cart contains ${cartCount} item(s).`
        );

        console.log(
            "Opening Cart to clear existing items..."
        );


        // =========================================
        // Open Cart
        // =========================================

        await this.cartIcon.waitForDisplayed({
            timeout: 10000
        });

        await this.cartIcon.click();

        console.log("");
        console.log("Cart icon clicked.");

        console.log(
            "Waiting for Cart screen to load..."
        );

        await this.driver.pause(3000);


        // =========================================
        // Verify Cart Screen
        // =========================================

        console.log(
            "Checking Cart screen..."
        );

        const cartDisplayed =
            await this.cartScreen
                .isDisplayed()
                .catch(() => false);

        console.log(
            `Cart screen displayed: ${cartDisplayed}`
        );


        if (!cartDisplayed) {

            console.log("");

            console.log(
                "Cart screen not detected after 3 seconds."
            );


            throw new Error(
                "Cart screen did not load after clicking Cart icon."
            );
        }


        // =========================================
        // Confirm Cart Screen
        // =========================================

        const isCartDisplayed =
            await this.cartScreen.isDisplayed();


        if (!isCartDisplayed) {

            throw new Error(
                "Mutual Funds Cart screen was not displayed."
            );
        }


        console.log(
            "Mutual Funds Cart screen displayed."
        );


        // =========================================
        // Clear Cart
        // =========================================

        await this.clearCart();


        // =========================================
        // Verify Cart Is Empty
        // =========================================

        console.log(
            "Waiting for cart to become empty..."
        );

        await this.noSchemesAvailableMessage.waitForDisplayed({
            timeout: 10000
        });

        console.log(
            "Cart is empty. 'No schemes available in the cart.' displayed."
        );


        // =========================================
        // Return To Previous Screen
        // =========================================

        await this.driver.back();

        console.log(
            "Returned from Cart screen."
        );
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

        await this.cartIcon.click();

        console.log(
            "Cart icon clicked."
        );
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
    // Clear Cart
    // =========================================

    async clearCart() {

        console.log("");
        console.log("Clearing cart...");

        await this.clearCartButton.waitForDisplayed({
            timeout: 10000
        });

        await this.clearCartButton.click();

        console.log(
            "Clear button clicked."
        );
    }


    // =========================================
    // Click Pay In Cart Screen
    // =========================================

    async clickPay() {

        console.log("");
        console.log("Clicking Pay...");

        await this.payButton.waitForDisplayed({
            timeout: 10000
        });

        const description =
            await this.payButton
                .getAttribute("content-desc");

        console.log(
            `Payment button: ${description}`
        );

        await this.payButton.click();

        console.log(
            "Pay button clicked."
        );
    }


    // =========================================
    // Continue Purchase
    // =========================================

    async clickContinuePurchase() {

        console.log("");
        console.log(
            "Clicking Continue Purchase..."
        );

        await this.continuePurchaseButton.waitForDisplayed({
            timeout: 10000
        });

        await this.continuePurchaseButton.click();

        console.log(
            "Continue Purchase clicked."
        );
    }


    // =========================================
    // OTP Authorization Screen
    // =========================================

    async isOtpAuthorizationScreenDisplayed() {

        const otpScreen =
            await this.driver.$(
                '~Authorise with OTP'
            );

        await otpScreen.waitForDisplayed({
            timeout: 10000
        });

        return await otpScreen.isDisplayed();
    }
}


module.exports = MFPurchasePage;