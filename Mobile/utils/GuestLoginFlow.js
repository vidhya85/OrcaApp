const OTPService =
    require("./OTPService");

const RiskDisclosurePage =
    require("../pages/RiskDisclosurePage");

const GuestMutualFundsPage =
    require("../pages/GuestMutualFundsPage");

const FundsPage =
    require("../pages/FundsPage");

const DashboardPage =
    require("../pages/DashboardPage");

const WelcomePage =
    require("../pages/WelcomePage");


class GuestLoginFlow {

    constructor(driver) {
        this.driver = driver;

        this.riskDisclosurePage =
            new RiskDisclosurePage(driver);

        this.guestMutualFundsPage =
            new GuestMutualFundsPage(driver);

        this.fundsPage =
            new FundsPage(driver);

        this.dashboardPage =
            new DashboardPage(driver);

        this.welcomePage =
            new WelcomePage(driver);
    }


    async loginAsGuest(
        loginPage,
        otpPage,
        customerContextId,
        permissionHandler
    ) {

        console.log("");
        console.log("=================================");
        console.log("GUEST LOGIN");
        console.log("=================================");


        // ============================================================
        // 1. CHECK EXISTING GUEST SESSION
        // ============================================================

        console.log("");
        console.log("Checking for existing guest session...");

        const dashboardDisplayed =
            await this.dashboardPage.isDisplayed();


        if (dashboardDisplayed) {

            console.log("");
            console.log("Guest is already logged in.");
            console.log("Guest landed on Dashboard.");
            console.log("");

            console.log("=================================");
            console.log("GUEST LOGIN COMPLETED");
            console.log("=================================");

            return "DASHBOARD";
        }


        console.log("Dashboard not detected.");
        console.log("Checking if guest is already on Mutual Funds...");


        try {

            await this.fundsPage
                .schemeCollectionsTitle
                .waitForDisplayed({
                    timeout: 5000
                });


            console.log("");
            console.log("Guest is already logged in.");
            console.log("Guest is already on Mutual Funds page.");
            console.log("");

            console.log("=================================");
            console.log("GUEST LOGIN COMPLETED");
            console.log("=================================");

            return "MUTUAL_FUNDS";

        } catch (error) {

            console.log(
                "Guest is not already on Mutual Funds page."
            );
        }



        // ============================================================
        // 2. HANDLE NOTIFICATION PERMISSION
        // ============================================================

        if (permissionHandler) {

            console.log("");
            console.log("Handling app permissions...");

            await permissionHandler
                .handleNotificationPermission();

        }



        // ============================================================
        // 3. CHECK LET'S ENRICH SCREEN
        // ============================================================

        console.log("");
        console.log("Checking for Let's Enrich screen...");


        try {

            await this.welcomePage
                .letsEnrichButton
                .waitForDisplayed({
                    timeout: 10000
                });


            console.log(
                "Let's Enrich screen detected."
            );

            console.log(
                "Clicking Let's Enrich..."
            );


            await this.welcomePage
                .clickLetsEnrich();


            console.log(
                "Let's Enrich clicked."
            );


            await this.driver.pause(2000);


        } catch (error) {

            console.log(
                "Let's Enrich screen not detected. Continuing..."
            );

        }



        // ============================================================
        // 4. PHONE NUMBER CHOOSER
        // ============================================================

        if (permissionHandler) {

            console.log("");
            console.log(
                "Checking for phone number chooser..."
            );

            await permissionHandler
                .handlePhoneNumberChooser();

        }



        // ============================================================
        // 5. ENTER GUEST MOBILE NUMBER
        // ============================================================

        console.log("");
        console.log(
            "Entering guest mobile number..."
        );


        await loginPage
            .enterMobileNumber(customerContextId);



        // ============================================================
        // 6. CAPTURE TIME BEFORE REQUESTING OTP
        // ============================================================

        const otpRequestTime =
            new Date();



        // ============================================================
        // 7. REQUEST OTP
        // ============================================================

        console.log(
            "Requesting guest OTP..."
        );


        await loginPage
            .clickSendOtp();



        // ============================================================
        // 8. WAIT FOR OTP SCREEN
        // ============================================================

        await otpPage
            .waitForOtpEntry();


        console.log(
            "Guest OTP screen displayed."
        );



        // ============================================================
        // 9. GET NEW OTP FROM POSTGRESQL
        // ============================================================

        console.log("");
        console.log(
            "Waiting for guest OTP from PostgreSQL..."
        );


        const otp =
            await OTPService.getGuestOTP(
                customerContextId,
                otpRequestTime
            );


        console.log(
            "Guest OTP retrieved successfully."
        );



        // ============================================================
        // 10. ENTER OTP
        // ============================================================

        console.log(
            "Entering guest OTP..."
        );


        await otpPage
            .enterOtp(otp);


        console.log(
            "Guest OTP entered successfully."
        );



        // ============================================================
        // 11. RISK DISCLOSURE
        // ============================================================

        await this.riskDisclosurePage
            .clickIUnderstand();


        console.log(
            "Risk Disclosure accepted."
        );



        // ============================================================
        // 12. CHECK GUEST LANDING SCREEN
        // ============================================================

        console.log("");
        console.log(
            "Checking guest landing screen..."
        );


        const dashboardAfterLogin =
            await this.dashboardPage.isDisplayed();



        // ============================================================
        // 13. GUEST LANDED ON DASHBOARD
        // ============================================================

        if (dashboardAfterLogin) {

            console.log("");
            console.log(
                "Guest landed on Dashboard."
            );

            console.log(
                "Returning landing page: DASHBOARD"
            );

            console.log("");

            console.log("=================================");
            console.log("GUEST LOGIN COMPLETED");
            console.log("=================================");

            return "DASHBOARD";
        }



        // ============================================================
        // 14. GUEST LANDED ON MUTUAL FUNDS ACTIVATED SCREEN
        // ============================================================

        console.log("");
        console.log(
            "Dashboard not detected."
        );

        console.log(
            "Checking Mutual Funds Activated screen..."
        );


        await this.guestMutualFundsPage
            .waitForPage();


        console.log(
            "Mutual Funds Activated screen displayed."
        );



        // ============================================================
        // 15. CLICK EXPLORE FUNDS
        // ============================================================

        // 13. Explore Funds

        await this.guestMutualFundsPage
            .clickExploreFunds();

        console.log("Explore Funds clicked.");


        // 14. Wait for Dashboard

        console.log("");
        console.log("Waiting for Dashboard after Explore Funds...");

        await this.driver.pause(3000);

        const dashboardAfterExplore =
            await this.dashboardPage.isDisplayed();

        if (!dashboardAfterExplore) {

            throw new Error(
                "Dashboard was not displayed after Explore Funds."
            );
        }

        console.log("Guest returned to Dashboard.");

        console.log("");
        console.log("=================================");
        console.log("GUEST LOGIN COMPLETED");
        console.log("=================================");

        return "DASHBOARD";
    }
}

module.exports = GuestLoginFlow;