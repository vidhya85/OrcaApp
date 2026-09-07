const fs = require("fs");
const path = require("path");

class TestReport {

    constructor(testName) {

        this.testName = testName;

        this.startTime = new Date();

        this.endTime = null;

        this.status = "NOT_STARTED";

        this.funds = [];
    }


    // -----------------------------------------
    // Record a passed fund
    // -----------------------------------------

    addPassedFund(fundName) {

        this.funds.push({
            fundName: fundName,
            status: "PASSED"
        });
    }


    // -----------------------------------------
    // Record a failed fund
    // -----------------------------------------

    addFailedFund(fundName, section, error) {

        this.funds.push({
            fundName: fundName,
            status: "FAILED",
            failedSection: section,
            error: error
        });
    }


    // -----------------------------------------
    // Mark complete
    // -----------------------------------------

    markPassed() {

        this.status = "PASSED";
        this.endTime = new Date();
    }


    // -----------------------------------------
    // Mark failed
    // -----------------------------------------

    markFailed() {

        this.status = "FAILED";
        this.endTime = new Date();
    }


    // -----------------------------------------
    // Generate report data
    // -----------------------------------------

    getReportData() {

        const passedFunds =
            this.funds.filter(
                fund => fund.status === "PASSED"
            );

        const failedFunds =
            this.funds.filter(
                fund => fund.status === "FAILED"
            );


        return {

            testName: this.testName,

            status: this.status,

            startTime: this.startTime.toISOString(),

            endTime: this.endTime
                ? this.endTime.toISOString()
                : null,

            totalFunds: this.funds.length,

            passedFunds: passedFunds.length,

            failedFunds: failedFunds.length,

            funds: this.funds
        };
    }


    // -----------------------------------------
    // Save JSON report
    // -----------------------------------------

    saveReport() {

        const reportDirectory =
            path.join(
                process.cwd(),
                "reports"
            );


        if (!fs.existsSync(reportDirectory)) {

            fs.mkdirSync(
                reportDirectory,
                {
                    recursive: true
                }
            );
        }


        const reportPath =
            path.join(
                reportDirectory,
                "equity-funds-report.json"
            );


        const reportData =
            this.getReportData();


        fs.writeFileSync(
            reportPath,
            JSON.stringify(
                reportData,
                null,
                4
            )
        );


        console.log("");
        console.log(
            `Test report saved: ${reportPath}`
        );


        return reportPath;
    }
}


module.exports = TestReport;