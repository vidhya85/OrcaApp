const WelcomePage = require("../pages/WelcomePage");
const LoginPage = require("../pages/LoginPage");
const OtpPage = require("../pages/OtpPage");
const RiskDisclosurePage = require("../pages/RiskDisclosurePage");
const DashboardPage = require("../pages/DashboardPage");


class LoginFlow {

    constructor(driver, testData) {

        this.driver = driver;
        this.testData = testData;

        // =========================================
        // Create Login Page Objects
        // =========================================

        this.welcomePage =
            new WelcomePage(driver);

        this.loginPage =
            new LoginPage(driver);

        this.otpPage =
            new OtpPage(driver);

        this.riskDisclosurePage =
            new RiskDisclosurePage(driver);

        this.dashboardPage =
            new DashboardPage(driver);
    }


    // =========================================
    // Ensure User Is Logged In
    // =========================================

    async ensureLoggedIn() {

        // =========================================
        // Check Login State
        // =========================================

        const alreadyLoggedIn =
            await this.dashboardPage.isDisplayed();


        // =========================================
        // ALREADY LOGGED IN
        // =========================================

        if (alreadyLoggedIn) {

            console.log("");
            console.log("=================================");
            console.log("USER ALREADY LOGGED IN");
            console.log("Dashboard detected.");
            console.log("Skipping login and OTP.");
            console.log("=================================");

            return;
        }


        // =========================================
        // NEW LOGIN
        // =========================================

        console.log("");
        console.log("=================================");
        console.log("LOGIN REQUIRED");
        console.log("Dashboard not detected.");
        console.log("Starting login flow.");
        console.log("=================================");


        // -----------------------------------------
        // Welcome Screen
        // -----------------------------------------

        // Uncomment this if the fresh login
        // starts from the Welcome screen.

        // await this.welcomePage.clickLetsEnrich();


        // -----------------------------------------
        // Mobile Number
        // -----------------------------------------

        await this.loginPage.enterMobileNumber(
            this.testData.mobileNumber
        );


        // -----------------------------------------
        // Send OTP
        // -----------------------------------------

        await this.loginPage.clickSendOtp();


        // -----------------------------------------
        // OTP
        // -----------------------------------------

        console.log("");
        console.log("Waiting for OTP...");

        await this.otpPage.waitForOtpEntry();


        // -----------------------------------------
        // Risk Disclosure
        // -----------------------------------------

        await this.riskDisclosurePage
            .clickIUnderstand();


        // -----------------------------------------
        // Wait for Dashboard
        // -----------------------------------------

        console.log("");
        console.log("Waiting for Dashboard...");

        await this.driver.waitUntil(
            async () => {

                return await this.dashboardPage
                    .isDisplayed();

            },
            {
                timeout: 30000,
                interval: 1000,
                timeoutMsg:
                    "Dashboard did not appear after login"
            }
        );


        console.log("");
        console.log("Login successful.");
        console.log("Dashboard loaded.");
    }


    // =========================================
    // Validate Dashboard
    // =========================================

    async validateDashboard() {

        const dashboardDisplayed =
            await this.dashboardPage.isDisplayed();

        if (!dashboardDisplayed) {

            throw new Error(
                "Dashboard should be displayed after login handling"
            );
        }

        console.log(
            "Dashboard validation PASSED"
        );
    }
}


module.exports = LoginFlow;