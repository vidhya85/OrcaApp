const { execSync } = require("child_process");

const tests = [
    //"tests/equityFundsTest.js",
    "tests/mfCustomAmountAddtoCartTest.js",
    "tests/mfCustomAmountContinuePurchase.js",
    "tests/mfDefaultAmountAddtoCartTest.js",
    "tests/mfDefaultAmountContinuePurchaseTest.js",
    "tests/mfHoldingsTest.js",
    "tests/searchFundTest.js"
];

for (const test of tests) {

    console.log("\n========================================");
    console.log(`Running: ${test}`);
    console.log("========================================\n");

    try {

        execSync(
            `ENV=PROD USER_TYPE=GUEST node ${test}`,
            {
                stdio: "inherit"
            }
        );

        console.log(`\nPASSED: ${test}\n`);

    } catch (error) {

        console.log(`\nFAILED: ${test}\n`);

        process.exit(1);
    }
}

console.log("\n========================================");
console.log("ALL GUEST TESTS PASSED");
console.log("========================================\n");