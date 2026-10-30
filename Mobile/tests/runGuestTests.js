
const { execFileSync } = require("child_process");
const path = require("path");

const tests = [
    // "equityFundsTest.js",
    "mfCustomAmountAddtoCartTest.js",
    "mfCustomAmountContinuePurchase.js",
    "mfDefaultAmountAddtoCartTest.js",
    "mfDefaultAmountContinuePurchaseTest.js",
    "mfHoldingsTest.js",
    "searchFundTest.js"
];

// Select environment: PROD or UAT (default: UAT)
const testEnvironment = (
    process.env.TEST_ENV ||
    process.env.ENV ||
    "UAT"
).toUpperCase();

if (!["PROD", "UAT"].includes(testEnvironment)) {
    console.error(
        `Invalid TEST_ENV: ${testEnvironment}. Use PROD or UAT.`
    );
    process.exit(1);
}

const results = [];

console.log("\nORCA MOBILE - GUEST TEST SUITE");
console.log(`Environment: ${testEnvironment}`);
console.log("User type: GUEST\n");

for (const test of tests) {
    const testPath = path.join(__dirname, test);

    console.log("\n========================================");
    console.log(`Running Guest Test: ${test}`);
    console.log(`Environment: ${testEnvironment}`);
    console.log("========================================\n");

    const startTime = Date.now();

    try {
        execFileSync(process.execPath, [testPath], {
            cwd: path.resolve(__dirname, "../.."),
            stdio: "inherit",
            env: {
                ...process.env,
                TEST_ENV: testEnvironment,
                ENV: testEnvironment,
                USER_TYPE: "GUEST",
                REPORT_GROUP: "GUEST"
            }
        });

        results.push({
            test,
            status: "PASSED",
            duration: ((Date.now() - startTime) / 1000).toFixed(1)
        });

        console.log(`\nPASSED: ${test}\n`);

    } catch (error) {
        results.push({
            test,
            status: "FAILED",
            duration: ((Date.now() - startTime) / 1000).toFixed(1)
        });

        console.log(`\nFAILED: ${test}`);
        console.log("Continuing with the next test...\n");
    }
}

const total = results.length;
const passed = results.filter(r => r.status === "PASSED").length;
const failed = results.filter(r => r.status === "FAILED").length;
const passRate = total
    ? ((passed / total) * 100).toFixed(1)
    : "0.0";

console.log("\n========================================");
console.log("ORCA MOBILE GUEST TEST SUMMARY");
console.log("========================================");
console.log(`Environment : ${testEnvironment}`);
console.log(`Total tests : ${total}`);
console.log(`Passed      : ${passed}`);
console.log(`Failed      : ${failed}`);
console.log(`Pass rate   : ${passRate}%`);
console.log("\nIndividual results:");

for (const result of results) {
    console.log(
        `${result.status.padEnd(6)} | ${result.duration}s | ${result.test}`
    );
}

console.log("\n========================================");

if (failed === 0) {
    console.log("ALL GUEST TESTS PASSED");
} else {
    console.log(`${failed} GUEST TEST(S) FAILED.`);
    process.exitCode = 1;
}

console.log("========================================\n");
