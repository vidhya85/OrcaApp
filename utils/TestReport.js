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


    // =========================================
    // Record Passed Fund
    // =========================================

    addPassedFund(fundName) {

        this.funds.push({
            fundName: fundName,
            status: "PASSED"
        });
    }


    // =========================================
    // Record Failed Fund
    // =========================================

    addFailedFund(fundName, section, error) {

        this.funds.push({
            fundName: fundName,
            status: "FAILED",
            failedSection: section,
            error: error
        });
    }


    // =========================================
    // Mark Test Passed
    // =========================================

    markPassed() {

        this.status = "PASSED";

        this.endTime = new Date();
    }


    // =========================================
    // Mark Test Failed
    // =========================================

    markFailed() {

        this.status = "FAILED";

        this.endTime = new Date();
    }


    // =========================================
    // Get Report Data
    // =========================================

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

            startTime:
                this.startTime.toISOString(),

            endTime:
                this.endTime
                    ? this.endTime.toISOString()
                    : null,

            totalFunds:
                this.funds.length,

            passedFunds:
                passedFunds.length,

            failedFunds:
                failedFunds.length,

            funds:
                this.funds
        };
    }
    // ========================================= 
    // Generate Report File Name 
    // =========================================
    getReportFileName() {
        return this.testName
            .toLowerCase()
            .replace(/\btest\b/g, "")
            .trim()
            .replace(/\s+/g, "-") + "-report";

    }
    // =========================================
    // Save JSON Report
    // =========================================

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


        const reportFileName = this.getReportFileName();

        const reportPath =
            path.join(
                reportDirectory,
                `${reportFileName}.json`
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
            `JSON report saved: ${reportPath}`
        );


        return reportPath;
    }


    // =========================================
    // Generate HTML Report
    // =========================================

    saveHtmlReport() {

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


        const reportFileName = this.getReportFileName();

        const reportPath =
            path.join(
                reportDirectory,
                `${reportFileName}.html`
            );


        const reportData =
            this.getReportData();


        const statusClass =
            reportData.status === "PASSED"
                ? "passed"
                : reportData.status === "FAILED"
                    ? "failed"
                    : "not-started";


        const fundRows =
            reportData.funds.map(
                (fund, index) => {

                    const fundStatusClass =
                        fund.status === "PASSED"
                            ? "passed"
                            : "failed";


                    return `
                        <tr>
                            <td>${index + 1}</td>

                            <td>
                                ${this.escapeHtml(
                                    fund.fundName
                                )}
                            </td>

                            <td>
                                <span class="status ${fundStatusClass}">
                                    ${fund.status}
                                </span>
                            </td>

                            <td>
                                ${
                                    fund.failedSection
                                        ? this.escapeHtml(
                                            fund.failedSection
                                        )
                                        : "-"
                                }
                            </td>

                            <td>
                                ${
                                    fund.error
                                        ? this.escapeHtml(
                                            fund.error
                                        )
                                        : "-"
                                }
                            </td>
                        </tr>
                    `;
                }
            ).join("");


        const html = `
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${this.escapeHtml(reportData.testName)}
    </title>


    <style>

        body {

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            margin: 0;

            padding: 30px;

            background: #f5f6f8;

            color: #222;
        }


        .container {

            max-width: 1200px;

            margin: auto;
        }


        h1 {

            margin-bottom: 5px;
        }


        .subtitle {

            color: #666;

            margin-bottom: 30px;
        }


        .summary {

            display: grid;

            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        180px,
                        1fr
                    )
                );

            gap: 15px;

            margin-bottom: 30px;
        }


        .card {

            background: white;

            padding: 20px;

            border-radius: 8px;

            box-shadow:
                0 2px 8px
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );
        }


        .card h3 {

            margin: 0 0 10px 0;

            font-size: 14px;

            color: #666;
        }


        .card .value {

            font-size: 28px;

            font-weight: bold;
        }


        .status {

            display: inline-block;

            padding: 5px 10px;

            border-radius: 12px;

            font-size: 12px;

            font-weight: bold;
        }


        .passed {

            background: #d4edda;

            color: #155724;
        }


        .failed {

            background: #f8d7da;

            color: #721c24;
        }


        .not-started {

            background: #e2e3e5;

            color: #383d41;
        }


        .report-info {

            background: white;

            padding: 20px;

            border-radius: 8px;

            margin-bottom: 30px;

            box-shadow:
                0 2px 8px
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );
        }


        .report-info p {

            margin: 8px 0;
        }


        table {

            width: 100%;

            border-collapse: collapse;

            background: white;

            box-shadow:
                0 2px 8px
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );
        }


        th,
        td {

            padding: 12px;

            text-align: left;

            border-bottom:
                1px solid #ddd;

            vertical-align: top;
        }


        th {

            background: #f0f1f3;
        }


        tr:hover {

            background: #f9f9f9;
        }


        .error {

            max-width: 400px;

            word-break: break-word;
        }

    </style>

</head>


<body>

<div class="container">

    <h1>
        ${this.escapeHtml(reportData.testName)}
    </h1>

    <div class="subtitle">
        ORCA Mobile Automation Test Report
    </div>


    <div class="summary">

        <div class="card">

            <h3>Overall Status</h3>

            <div>
                <span class="status ${statusClass}">
                    ${reportData.status}
                </span>
            </div>

        </div>


        <div class="card">

            <h3>Total Funds</h3>

            <div class="value">
                ${reportData.totalFunds}
            </div>

        </div>


        <div class="card">

            <h3>Passed</h3>

            <div class="value">
                ${reportData.passedFunds}
            </div>

        </div>


        <div class="card">

            <h3>Failed</h3>

            <div class="value">
                ${reportData.failedFunds}
            </div>

        </div>

    </div>


    <div class="report-info">

        <p>
            <strong>Start Time:</strong>
            ${this.formatDate(reportData.startTime)}
        </p>

        <p>
            <strong>End Time:</strong>
            ${
                reportData.endTime
                    ? this.formatDate(
                        reportData.endTime
                    )
                    : "-"
            }
        </p>

    </div>


    <table>

        <thead>

            <tr>

                <th>#</th>

                <th>Fund Name</th>

                <th>Status</th>

                <th>Failed Section</th>

                <th>Error</th>

            </tr>

        </thead>


        <tbody>

            ${
                fundRows ||
                `
                    <tr>
                        <td colspan="5">
                            No funds processed.
                        </td>
                    </tr>
                `
            }

        </tbody>

    </table>

</div>

</body>

</html>
`;


        fs.writeFileSync(
            reportPath,
            html
        );


        console.log("");

        console.log(
            `HTML report saved: ${reportPath}`
        );


        return reportPath;
    }


    // =========================================
    // Escape HTML
    // =========================================

    escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =========================================
    // Format Date
    // =========================================

    formatDate(value) {

        if (!value) {

            return "-";
        }


        return new Date(value)
            .toLocaleString();
    }
}


module.exports = TestReport;