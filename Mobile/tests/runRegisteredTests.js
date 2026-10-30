
const { execFileSync } = require("child_process");
const path = require("path");

const tests = [
    "equityFundsTest.js",
    "mfCustomAmountAddtoCartTest.js",
    "mfCustomAmountContinuePurchase.js",
    "mfDefaultAmountAddtoCartTest.js",
    "mfDefaultAmountContinuePurchaseTest.js",
    "mfHoldingsTest.js",
    "searchFundTest.js"
];

// Environment can be selected from the command line.
// Defaults to UAT if TEST_ENV and ENV are not set.
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

console.log(`\nORCA Mobile - Registered Test Suite`);
console.log(`Environment: ${testEnvironment}`);
console.log(`User type  : REGISTERED\n`);

for (const test of tests) {
    const testPath = path.join(__dirname, test);

    console.log("\n========================================");
    console.log(`Running: ${test}`);
    console.log(`Environment: ${testEnvironment}`);
    console.log("========================================\n");

    const startTime = Date.now();

    try {
        execFileSync(process.execPath, [testPath], {
            stdio: "inherit",
            cwd: path.resolve(__dirname, "../.."),
            env: {
                ...process.env,
                TEST_ENV: testEnvironment,
                ENV: testEnvironment,
                USER_TYPE: "REGISTERED",
                REPORT_GROUP: "REGISTERED"
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

const passed = results.filter(r => r.status === "PASSED").length;
const failed = results.filter(r => r.status === "FAILED").length;
const total = results.length;
const passRate = total
    ? ((passed / total) * 100).toFixed(1)
    : "0.0";

console.log("\n========================================");
console.log("ORCA MOBILE TEST EXECUTION SUMMARY");
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
    console.log("ALL REGISTERED TESTS PASSED");
} else {
    console.log(`${failed} TEST(S) FAILED. Check the logs and reports.`);
    process.exitCode = 1;
}

console.log("========================================\n");
