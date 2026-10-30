
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

    // Record passed fund
    addPassedFund(fundName) {
        this.funds.push({
            fundName,
            status: "PASSED"
        });
    }

    // Record failed fund
    addFailedFund(fundName, section, error) {
        this.funds.push({
            fundName,
            status: "FAILED",
            failedSection: section,
            error
        });
    }

    // Mark test passed
    markPassed() {
        this.status = "PASSED";
        this.endTime = new Date();
    }

    // Mark test failed
    markFailed() {
        this.status = "FAILED";
        this.endTime = new Date();
    }

    // Get report data
    
    // Get report data
    getReportData() {
        const passedFunds = this.funds.filter(
            fund => fund.status === "PASSED"
        );

        const failedFunds = this.funds.filter(
            fund => fund.status === "FAILED"
        );

        return {
            testName: this.testName,

            userType: (
                process.env.USER_TYPE || "REGISTERED"
            ).toUpperCase(),

            // Controls the integrated report section
            reportGroup: (
                process.env.REPORT_GROUP || "UNCLASSIFIED"
            ).toUpperCase(),

            // Records whether the test ran in PROD or UAT
            environment: (
                process.env.TEST_ENV ||
                process.env.ENV ||
                "UAT"
            ).toUpperCase(),

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


    // Generate user-type-specific report filename
    getReportFileName() {
        const baseName = this.testName
            .toLowerCase()
            .replace(/\btest\b/g, "")
            .trim()
            .replace(/\s+/g, "-");

        const userType = (
            process.env.USER_TYPE || "REGISTERED"
        ).toLowerCase();

        return `${baseName}-${userType}-report`;
    }

    // Save JSON report
    saveReport() {
        const reportDirectory = path.resolve(
            __dirname,
            "../../Reporting/reports/mobile"
        );

        fs.mkdirSync(reportDirectory, { recursive: true });

        const reportFileName = this.getReportFileName();

        const reportPath = path.join(
            reportDirectory,
            `${reportFileName}.json`
        );

        const reportData = this.getReportData();

        fs.writeFileSync(
            reportPath,
            JSON.stringify(reportData, null, 4),
            "utf8"
        );

        console.log(`JSON report saved: ${reportPath}`);

        return reportPath;
    }

    // Generate HTML report
    saveHtmlReport() {
        const reportDirectory = path.resolve(
            __dirname,
            "../../Reporting/reports/mobile"
        );

        fs.mkdirSync(reportDirectory, { recursive: true });

        const reportFileName = this.getReportFileName();

        const reportPath = path.join(
            reportDirectory,
            `${reportFileName}.html`
        );

        const reportData = this.getReportData();

        const statusClass =
            reportData.status === "PASSED"
                ? "passed"
                : reportData.status === "FAILED"
                    ? "failed"
                    : "not-started";

        // Build fund result rows
        const fundRows = reportData.funds.map((fund, index) => {
            const fundStatusClass =
                fund.status === "PASSED" ? "passed" : "failed";

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${this.escapeHtml(fund.fundName)}</td>
                    <td>
                        <span class="status ${fundStatusClass}">
                            ${this.escapeHtml(fund.status)}
                        </span>
                    </td>
                    <td>
                        ${fund.failedSection
                            ? this.escapeHtml(fund.failedSection)
                            : "-"}
                    </td>
                    <td class="error">
                        ${fund.error
                            ? this.escapeHtml(fund.error)
                            : "-"}
                    </td>
                </tr>
            `;
        }).join("");

        // =========================================
        // Find screenshots related to this test
        // =========================================

        const screenshotDirectory = path.resolve(
            __dirname,
            "../../Reporting/Screenshots/Mobile"
        );

        // Relative URL from Reporting/reports/mobile/
        // to Reporting/Screenshots/Mobile/
        const relativeScreenshotDirectory = "../../Screenshots/Mobile";

        function normalizeName(value) {
            return String(value || "")
                .toLowerCase()
                .replace(/\btest\b/g, "")
                .replace(/[^a-z0-9]/g, "");
        }

        let screenshotFiles = [];

        if (fs.existsSync(screenshotDirectory)) {
            screenshotFiles = fs.readdirSync(screenshotDirectory)
                .filter(file => /\.png$/i.test(file));
        }

        // Use the test name, fund names and failed sections
        // to find candidate screenshots.
        const searchNames = [
            reportData.testName,
            ...reportData.funds.flatMap(fund => [
                fund.fundName,
                fund.failedSection
            ])
        ]
            .filter(Boolean)
            .map(normalizeName)
            .filter(name => name.length >= 5);

        const matchingScreenshots = screenshotFiles.filter(file => {
            const normalizedFile = normalizeName(
                path.basename(file, path.extname(file))
            );

            return searchNames.some(name =>
                normalizedFile.includes(name) ||
                name.includes(normalizedFile)
            );
        });

        // Build screenshot thumbnails and full-size links
        const screenshotRows = matchingScreenshots.map(file => {
            const screenshotUrl =
                `${relativeScreenshotDirectory}/${encodeURIComponent(file)}`;

            const safeFileName = this.escapeHtml(file);

            return `
                <div class="screenshot-card">
                    <a href="${screenshotUrl}"
                       target="_blank"
                       rel="noopener noreferrer">
                        <img
                            src="${screenshotUrl}"
                            alt="${safeFileName}"
                            loading="lazy"
                        >
                    </a>

                    <p>${safeFileName}</p>

                    <a href="${screenshotUrl}"
                       target="_blank"
                       rel="noopener noreferrer">
                        View full screenshot
                    </a>
                </div>
            `;
        }).join("");

        // Screenshot section shown in the report
        const screenshotSection = `
            <div class="screenshots-section" id="screenshots">
                <h2>Test Screenshots (${matchingScreenshots.length})</h2>

                ${
                    screenshotRows
                        ? `<div class="screenshots-grid">
                               ${screenshotRows}
                           </div>`
                        : `<p>No matching screenshots were found for this test.</p>`
                }
            </div>
        `;

        // Link to the screenshot section near the top of the report
        const screenshotNavigation = `
            <p class="screenshot-navigation">
                <a href="#screenshots">
                    View Screenshots (${matchingScreenshots.length})
                </a>
            </p>
        `;

        // =========================================
        // HTML report
        // =========================================

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${this.escapeHtml(reportData.testName)}</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
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
            margin-bottom: 20px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax(180px, 1fr)
            );
            gap: 15px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .card h3 {
            margin: 0 0 10px;
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
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .report-info p {
            margin: 8px 0;
        }

        .screenshot-navigation {
            margin: 0 0 25px;
        }

        .screenshot-navigation a,
        .screenshot-card a {
            color: #245bb5;
            text-decoration: none;
        }

        .screenshot-navigation a {
            display: inline-block;
            background: #eaf1ff;
            padding: 10px 15px;
            border-radius: 6px;
            font-weight: bold;
        }

        .screenshot-navigation a:hover,
        .screenshot-card a:hover {
            text-decoration: underline;
        }

        .screenshots-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax(220px, 1fr)
            );
            gap: 18px;
        }

        .screenshot-card {
            border: 1px solid #e5e9ef;
            border-radius: 8px;
            padding: 12px;
            overflow-wrap: anywhere;
        }

        .screenshot-card img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .screenshot-card p {
            font-size: 13px;
            color: #596579;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
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

        @media (max-width: 600px) {
            body {
                padding: 15px;
            }
        }
    </style>
</head>

<body>
<div class="container">

    <h1>${this.escapeHtml(reportData.testName)}</h1>

    <div class="subtitle">
        ORCA Mobile Automation Test Report —
        ${this.escapeHtml(reportData.userType)}
    </div>

    ${screenshotNavigation}

    <div class="summary">
        <div class="card">
            <h3>Overall Status</h3>
            <div>
                <span class="status ${statusClass}">
                    ${this.escapeHtml(reportData.status)}
                </span>
            </div>
        </div>

        <div class="card">
            <h3>Total Funds</h3>
            <div class="value">${reportData.totalFunds}</div>
        </div>

        <div class="card">
            <h3>Passed</h3>
            <div class="value">${reportData.passedFunds}</div>
        </div>

        <div class="card">
            <h3>Failed</h3>
            <div class="value">${reportData.failedFunds}</div>
        </div>
    </div>

    <div class="report-info">
        <p>
            <strong>User Type:</strong>
            ${this.escapeHtml(reportData.userType)}
        </p>

        <p>
            <strong>Start Time:</strong>
            ${this.formatDate(reportData.startTime)}
        </p>

        <p>
            <strong>End Time:</strong>
            ${reportData.endTime
                ? this.formatDate(reportData.endTime)
                : "-"}
        </p>
    </div>

    ${screenshotSection}

    <h2>Fund Test Results</h2>

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
                `<tr>
                    <td colspan="5">No funds processed.</td>
                </tr>`
            }
        </tbody>
    </table>

</div>
</body>
</html>`;

        // Save the individual HTML report
        fs.writeFileSync(reportPath, html, "utf8");

        console.log("");
        console.log(`HTML report saved: ${reportPath}`);
        console.log(
            `Matching screenshots found: ${matchingScreenshots.length}`
        );

        // Refresh the integrated report
        const { execFileSync } = require("child_process");

        const generatorPath = path.join(
            __dirname,
            "GenerateIntegratedReport.js"
        );

        execFileSync(process.execPath, [generatorPath], {
            stdio: "inherit"
        });

        return reportPath;
    }

    // Escape HTML values
    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Format date
    formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString("en-IN");
    }
}

module.exports = TestReport;
