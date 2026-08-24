const { remote } = require("webdriverio");

async function main() {

    const driver = await remote({
        hostname: "127.0.0.1",
        port: 4723,
        path: "/",

        capabilities: {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "emulator-5554",
            "appium:udid": "emulator-5554",
            "appium:appPackage": "com.enrich.enrichkyc",
            "appium:appActivity": "com.enrich.enrichkyc.MainActivity"
        }
    });

    console.log("=================================");
    console.log("ORCA APP TEST STARTED");
    console.log("=================================");

    try {

        // =========================================
        // 1. Handle notification permission
        // =========================================

        await driver.pause(3000);

        const allowButton = await driver.$(
            'android=new UiSelector().text("Allow")'
        );

        if (await allowButton.isExisting()) {

            await allowButton.click();

            console.log("Notification permission handled");

        } else {

            console.log("Notification permission not displayed");
        }


        // =========================================
        // 2. Click Let's Enrich
        // =========================================

        const enrichButton = await driver.$("~Let's Enrich");

        await enrichButton.waitForExist({
            timeout: 30000
        });

        console.log("Let's Enrich button found");

        await enrichButton.click();

        console.log("Let's Enrich clicked");


        // =========================================
        // 3. Enter Mobile Number
        // =========================================

        await driver.pause(3000);

        const mobileNumber = await driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(0)'
        );

        await mobileNumber.waitForExist({
            timeout: 30000
        });

        console.log("Mobile number field found");

        await mobileNumber.click();

        // Replace this locally with your test number
        await mobileNumber.setValue("9840336617");

        console.log("Mobile number entered");


        // =========================================
        // 4. Click Send OTP
        // =========================================

        const sendOtpButton = await driver.$("~Send OTP");

        await sendOtpButton.waitForExist({
            timeout: 30000
        });

        console.log("Send OTP button found");

        await sendOtpButton.click();

        console.log("Send OTP clicked");


        // =========================================
        // 5. Wait for OTP
        // =========================================

        await driver.pause(5000);

        console.log("---------------------------------");
        console.log("OTP has been sent.");
        console.log("Enter the OTP manually in the emulator.");
        console.log("---------------------------------");


        // =========================================
        // 6. Find OTP field
        // =========================================

        const otpField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText").instance(0)'
        );

        await otpField.waitForExist({
            timeout: 30000
        });

        console.log("OTP field found");


        // =========================================
        // 7. Wait for manual OTP entry
        // =========================================

        console.log("Waiting for manual OTP entry...");

        await driver.waitUntil(
            async () => {

                try {

                    const otpText = await otpField.getAttribute("text");

                    const otpLength = otpText ? otpText.length : 0;

                    console.log("OTP length:", otpLength);

                    return otpLength === 6;

                } catch (error) {

                    return false;
                }

            },
            {
                timeout: 120000,
                interval: 1000,
                timeoutMsg: "OTP was not entered within 2 minutes"
            }
        );

        console.log("6-digit OTP entered");
        // =========================================
        // 8. Click Continue
        // =========================================

        const continueButton = await driver.$("~Continue");

        await continueButton.waitForExist({
            timeout: 30000
        });

        console.log("Continue button found");

        await continueButton.click();

        console.log("Continue clicked");
        console.log("Waiting for Risk Disclosure screen...");

        await driver.pause(3000);


        // =========================================
        // 9. Click I Understand
        // =========================================

        console.log("Looking for I Understand button...");

        const understandButton = await driver.$(
            'android=new UiSelector().description("I Understand")'
        );

        await understandButton.waitForDisplayed({
            timeout: 30000
        });

        console.log("I Understand button found");

        console.log(
            "I Understand displayed:",
            await understandButton.isDisplayed()
        );

        console.log(
            "I Understand enabled:",
            await understandButton.isEnabled()
        );

        await understandButton.click();

        console.log("I Understand clicked");


        // =========================================
        // 10. Click Explore Funds
        // =========================================

        const exploreFundsButton = await driver.$(
            'android=new UiSelector().descriptionContains("Explore Funds")'
        );

        await exploreFundsButton.waitForExist({
            timeout: 30000
        });

        console.log("Explore Funds button found");

        await exploreFundsButton.click();

        console.log("Explore Funds clicked");


        // =========================================
        // 11. Click Equity Funds
        // =========================================

        const equityFunds = await driver.$("~Equity Funds");

        await equityFunds.waitForExist({
            timeout: 30000
        });

        console.log("Equity Funds option found");

        await equityFunds.click();

        console.log("Equity Funds clicked");


        // =========================================
        // 12. Validate Equity Fund cards
        // =========================================

        await driver.pause(3000);

        console.log("---------------------------------");
        console.log("Validating Equity Fund data...");
        console.log("---------------------------------");


        // Find all visible fund cards.
        // Their content-desc contains "Riskometer".

        const fundCards = await driver.$$(
            'android=new UiSelector().descriptionContains("Riskometer")'
        );


        if (fundCards.length === 0) {

            throw new Error(
                "No Equity Fund cards were displayed"
            );
        }


        console.log(
            `Found ${fundCards.length} fund card(s)`
        );


        // =========================================
        // 13. Validate each fund card
        // =========================================

        for (let i = 0; i < fundCards.length; i++) {

            const card = fundCards[i];

            const fundData =
                await card.getAttribute("content-desc");


            console.log(
                `\nFund Card ${i + 1}:`
            );

            console.log(fundData);


            // -------------------------------------
            // Validate Riskometer
            // -------------------------------------

            if (!fundData.includes("Riskometer")) {

                throw new Error(
                    `Fund Card ${i + 1}: Riskometer is missing`
                );
            }


            // -------------------------------------
            // Validate Min SIP amount
            // -------------------------------------

            if (!fundData.includes("Min SIP amount")) {

                throw new Error(
                    `Fund Card ${i + 1}: Min SIP amount is missing`
                );
            }


            // -------------------------------------
            // Validate 3Y Return
            // -------------------------------------

            if (!fundData.includes("3Y Return")) {

                throw new Error(
                    `Fund Card ${i + 1}: 3Y Return is missing`
                );
            }


            // -------------------------------------
            // Validate SIP amount format
            // -------------------------------------

            const sipPattern =
                /₹\s*[\d,]+(\.\d{2})?/;

            if (!sipPattern.test(fundData)) {

                throw new Error(
                    `Fund Card ${i + 1}: Invalid SIP amount format`
                );
            }


            // -------------------------------------
            // Validate return percentage
            // -------------------------------------

            const returnPattern =
                /\d+(\.\d+)?%/;

            if (!returnPattern.test(fundData)) {

                throw new Error(
                    `Fund Card ${i + 1}: Invalid 3Y Return format`
                );
            }


            console.log(
                `Fund Card ${i + 1}: validation PASSED`
            );
        }


        // =========================================
        // 14. Final result
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("EQUITY FUND DATA VALIDATION PASSED");
        console.log("=================================");


    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("TEST FAILED");
        console.error("=================================");
        console.error(error);


    } finally {

        await driver.deleteSession();

        console.log("Appium session closed");
    }
}


main();