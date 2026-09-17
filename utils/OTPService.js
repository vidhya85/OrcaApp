const { Client } = require("pg");
const { db } = require("../config/env");

class OTPService {

    static async getLatestOTP(userId, afterTime) {

    const client = new Client(db);

    try {

        await client.connect();

        const query = `
            SELECT otp, created_date_time
            FROM users.user_context_login_audit
            WHERE user_id = $1
              AND created_date_time > $2
              AND otp IS NOT NULL
            ORDER BY created_date_time DESC
            LIMIT 1;
        `;

        const maxWaitTime = 30000;
        const pollInterval = 1000;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {

            const result = await client.query(
                query,
                [userId, afterTime]
            );

            if (result.rows.length > 0) {

                console.log(
                    "New OTP record found in PostgreSQL."
                );

                return result.rows[0].otp;
            }

            console.log(
                "New OTP not available yet. Checking again..."
            );

            await new Promise(resolve =>
                setTimeout(resolve, pollInterval)
            );
        }

        throw new Error(
            `New OTP was not found within ${maxWaitTime / 1000} seconds for user: ${userId}`
        );

    } finally {

        await client.end();
    }
}
}

module.exports = OTPService;

