const LoginPage = require("../pages/LoginPage");
const OtpPage = require("../pages/OtpPage");
const RiskDisclosurePage = require("../pages/RiskDisclosurePage");
const DashboardPage = require("../pages/DashboardPage");


class LoginFlow {

    constructor(driver, testData) {

        this.driver = driver;
        this.testData = testData;

        this.loginPage = new LoginPage(driver);
        this.otpPage = new OtpPage(driver);
        this.riskDisclosurePage = new RiskDisclosurePage(driver);
        this.dashboardPage = new DashboardPage(driver);
    }


    // =========================================
    // Ensure User Is Logged In
    // =========================================

    async ensureLoggedIn(permissionHandler) {

        // Check whether user is already logged in
        const alreadyLoggedIn =
            await this.dashboardPage.isDisplayed();


        if (alreadyLoggedIn) {

            console.log("");
            console.log("=================================");
            console.log("USER ALREADY LOGGED IN");
            console.log("Dashboard detected.");
            console.log("Skipping permissions and login.");
            console.log("=================================");

            return;
        }


        // =========================================
        // Login Required
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("LOGIN REQUIRED");
        console.log("Dashboard not detected.");
        console.log("Starting login flow.");
        console.log("=================================");


        // =========================================
        // App Permissions
        // =========================================

        if (permissionHandler) {

            console.log("");
            console.log("Handling app permissions...");

            await permissionHandler.handleNotificationPermission();

            await permissionHandler.handlePhoneNumberChooser();
        }


        // =========================================
        // Mobile Number
        // =========================================

        console.log("");
        console.log("Entering mobile number...");

        await this.loginPage.enterMobileNumber(
            this.testData.mobileNumber
        );


        console.log("Clicking Send OTP...");

        await this.loginPage.clickSendOtp();


        // =========================================
        // OTP
        // =========================================

        console.log("");
        console.log("Waiting for OTP...");

        //await this.otpPage.waitForOtpScreen();

        //console.log("OTP field found");

        //console.log("Waiting for manual OTP entry...");

        await this.otpPage.waitForOtpEntry();

        console.log("OTP entry wait completed.");


        // =========================================
        // TPIN
        // =========================================

        console.log("");
        console.log("Waiting for TPIN screen...");

        await this.loginPage.waitForTPINScreen();


        await this.loginPage.enterTPIN(
            this.testData.tpin
        );


        // =========================================
        // Secure Login
        // =========================================
        // ORCA automatically processes Secure Login
        // after the complete TPIN is entered.
        // No automation click is required here.

        console.log("");
        console.log("Waiting for ORCA to process login...");


        // =========================================
        // Risk Disclosure
        // =========================================

        console.log("");
        console.log("Checking for Risk Disclosure...");

        try {

            await this.riskDisclosurePage.understandButton.waitForDisplayed({
                timeout: 10000
            });

            console.log("Risk Disclosure detected.");

            console.log("Clicking I Understand...");

            await this.riskDisclosurePage.clickIUnderstand();

        } catch (error) {

            console.log("Risk Disclosure not displayed.");

            console.log("Continuing to Dashboard...");
        }


        // =========================================
        // Dashboard
        // =========================================

        console.log("");
        console.log("Waiting for Dashboard...");

        await this.dashboardPage.isDisplayed();

        console.log("Login flow completed.");
    }
}


module.exports = LoginFlow;