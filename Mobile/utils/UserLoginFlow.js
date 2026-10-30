const LoginFlow =
    require("./LoginFlow");

const GuestLoginFlow =
    require("./GuestLoginFlow");


class UserLoginFlow {

    constructor(driver) {

        this.driver = driver;

        this.loginFlow =
            new LoginFlow(driver);

        this.guestLoginFlow =
            new GuestLoginFlow(driver);
    }


    async login(
        permissionHandler
    ) {

        const userType =
            (process.env.USER_TYPE || "REGISTERED")
                .toUpperCase();


        console.log("");
        console.log("=================================");
        console.log(
            "USER TYPE:",
            userType
        );
        console.log("=================================");


        // =========================================
        // Registered User
        // =========================================

        if (userType === "REGISTERED") {

            await this.loginFlow.ensureLoggedIn(
                permissionHandler
            );


            return {
                userType: "REGISTERED",
                landingPage: "DASHBOARD"
            };
        }


        // =========================================
        // Guest User
        // =========================================

        if (userType === "GUEST") {

            const environment =
                (process.env.ENV || "PROD")
                    .toUpperCase();


            const guestMobileNumber =
                environment === "UAT"
                    ? process.env.UAT_GUEST_MOBILE_NUMBER
                    : process.env.PROD_GUEST_MOBILE_NUMBER;


            if (!guestMobileNumber) {

                throw new Error(
                    `${environment}_GUEST_MOBILE_NUMBER is not configured in .env`
                );
            }


            /*
             * Guest flow needs the LoginPage
             * and OtpPage objects.
             *
             * GuestLoginFlow creates the remaining
             * page objects internally.
             */

            const LoginPage =
                require("../pages/LoginPage");

            const OtpPage =
                require("../pages/OtpPage");


            const loginPage =
                new LoginPage(this.driver);

            const otpPage =
                new OtpPage(this.driver);


            const landingPage =
                await this.guestLoginFlow.loginAsGuest(
                    loginPage,
                    otpPage,
                    guestMobileNumber,
                    permissionHandler
                );


            return {
                userType: "GUEST",
                landingPage: landingPage
            };
        }


        throw new Error(
            `Invalid USER_TYPE: ${userType}. ` +
            `Use REGISTERED or GUEST.`
        );
    }
}


module.exports = UserLoginFlow;