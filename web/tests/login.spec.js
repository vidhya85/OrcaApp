

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const OTPService = require('../../utils/OTPService');

test('ORCA login using selected environment', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const environment = (process.env.TEST_ENV || 'UAT').toUpperCase();

    if (!['UAT', 'PROD'].includes(environment)) {
        throw new Error(`Invalid TEST_ENV: ${environment}`);
    }

    const mobileNumber =
        process.env[`${environment}_MOBILE_NUMBER`];

    const userId =
        process.env[`${environment}_USER_ID`];

    if (!mobileNumber || !userId) {
        throw new Error(
            `Missing ${environment} mobile number or user ID in .env`
        );
    }

    // 1. Open ORCA Trade Mode login
    await loginPage.openTradeLogin();

    // 2. Enter the selected environment's mobile number
    await expect(loginPage.mobileNumberInput).toBeVisible();
    await loginPage.enterMobileNumber(mobileNumber);

    // 3. Capture time before requesting the OTP
    const otpRequestTime = new Date();

    // 4. Request the OTP
    await loginPage.clickContinue();

    // 5. Wait for the OTP field
    await expect(loginPage.otpInput).toBeVisible({
        timeout: 10000
    });

    // 6. Retrieve the new OTP using the existing PostgreSQL service
    const otp = await OTPService.getLatestOTP(
        userId,
        otpRequestTime
    );

    if (!otp) {
        throw new Error('OTP retrieval returned an empty value');
    }

    // 7. Enter OTP and submit
    await loginPage.enterOtp(String(otp));
    await loginPage.clickContinue();

   // Wait for the OTP field to disappear
    await expect(loginPage.otpInput).toBeHidden({
        timeout: 15000
    });

    // Read the TPIN for the selected environment
    const tpin = process.env[`${environment}_TPIN`];

    if (!tpin) {
        throw new Error(
            `${environment}_TPIN is missing from .env`
        );
    }

    // Wait for TPIN field and enter the TPIN
    await expect(loginPage.tpinInput).toBeVisible({
        timeout: 15000
    });

    await loginPage.enterTPIN(tpin);

    console.log(`ORCA ${environment}: TPIN entered`);

    await page.waitForTimeout(1500);

    // Submit TPIN using the Continue button
    await loginPage.clickContinue();
    console.log('TPIN submitted; waiting for next screen');


    // Verify that ORCA Trading Dashboard appears
    await expect(
        page.getByText('Trading Dashboard', { exact: true })
    ).toBeVisible({ timeout: 20000 });

    console.log(
        `ORCA ${environment}: login successful; Trading Dashboard displayed`
    );

});
