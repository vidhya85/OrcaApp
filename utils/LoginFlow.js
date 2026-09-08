
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const LoginPage = require("../pages/LoginPage");
const OtpPage = require("../pages/OtpPage");
const RiskDisclosurePage = require("../pages/RiskDisclosurePage");
const DashboardPage = require("../pages/DashboardPage");


class LoginFlow {

    constructor(driver) {

        this.driver = driver;

        this.loginPage = new LoginPage(driver);
        this.otpPage = new OtpPage(driver);
        this.riskDisclosurePage = new RiskDisclosurePage(driver);
        this.dashboardPage = new DashboardPage(driver);
    }


    // =========================================
    // Ensure User Is Logged In
    // =========================================

    async ensureLoggedIn(permissionHandler) {

        // =========================================
        // Check Existing Session
        // =========================================

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
            process.env.MOBILE_NUMBER
        );


        console.log("Clicking Send OTP...");

        await this.loginPage.clickSendOtp();


        // =========================================
        // OTP
        // =========================================

        console.log("");
        console.log("Waiting for OTP...");

        await this.otpPage.waitForOtpEntry();

        console.log("OTP entry wait completed.");


        // =========================================
        // TPIN
        // =========================================

        console.log("");
        console.log("Waiting for TPIN screen...");

        await this.loginPage.waitForTPINScreen();


        console.log("Entering TPIN...");

        await this.loginPage.enterTPIN(
            process.env.TPIN
        );


        // =========================================
        // Secure Login
        // =========================================

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

            console.log(
                "Risk Disclosure not displayed. Continuing..."
            );
        }


        // =========================================
        // Dashboard
        // =========================================

        await this.waitForDashboard();

        console.log("");
        console.log("Login flow completed.");
    }


    // =========================================
    // Wait For Dashboard
    // =========================================

    async waitForDashboard() {

        console.log("");
        console.log("Waiting for Dashboard...");

        const dashboardDisplayed =
            await this.dashboardPage.isDisplayed();


        if (!dashboardDisplayed) {

            throw new Error(
                "Dashboard was not displayed after login."
            );
        }


        console.log("Dashboard displayed successfully.");
    }
}


module.exports = LoginFlow;

