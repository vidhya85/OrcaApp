
const fs = require("fs");
const path = require("path");

// Location of individual Mobile JSON and HTML reports
const sourceReportDirectory = path.resolve(
    __dirname,
    "../../Reporting/reports/mobile"
);

// Destination of the integrated report
const outputDirectory = path.resolve(
    __dirname,
    "../../Reporting/reports/integrated/mobile"
);

const outputPath = path.join(outputDirectory, "index.html");

// Create directories if they do not exist
if (!fs.existsSync(sourceReportDirectory)) {
    fs.mkdirSync(sourceReportDirectory, { recursive: true });
}

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Escape HTML values safely
const escapeHtml = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Determine user type from report data or filename.
// UNCLASSIFIED reportGroup takes priority over userType.
function getUserType(report) {
    const reportGroup = String(report.reportGroup || "")
        .trim()
        .toUpperCase();

    if (reportGroup === "UNCLASSIFIED") {
        return "UNCLASSIFIED";
    }

    const explicitType = String(report.userType || "")
        .trim()
        .toUpperCase();

    if (explicitType === "REGISTERED" || explicitType === "GUEST") {
        return explicitType;
    }

    const fileName = String(report.jsonFile || "").toLowerCase();

    if (/-registered-report\.json$/.test(fileName)) {
        return "REGISTERED";
    }

    if (/-guest-report\.json$/.test(fileName)) {
        return "GUEST";
    }

    return "UNCLASSIFIED";
}

// Build a stable key for each test and user type.
function getReportKey(report) {
    const testName = String(report.testName || report.jsonFile)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    return `${testName}::${getUserType(report)}`;
}

// Use the execution end time, falling back to start time.
function getExecutionTime(report) {
    const timestamp = new Date(
        report.endTime || report.startTime || 0
    ).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

// Read all JSON reports.
const jsonFiles = fs.readdirSync(sourceReportDirectory)
    .filter(file => file.toLowerCase().endsWith(".json"));

const reports = [];

for (const file of jsonFiles) {
    try {
        const data = JSON.parse(
            fs.readFileSync(
                path.join(sourceReportDirectory, file),
                "utf8"
            )
        );

        reports.push({
            ...data,
            jsonFile: file,
            htmlFile: file.replace(/\.json$/i, ".html")
        });
    } catch (error) {
        console.error(`Unable to read report ${file}:`, error.message);
    }
}

// Keep only the latest report for each test and user type.
const latestReports = new Map();

for (const report of reports) {
    const key = getReportKey(report);
    const existing = latestReports.get(key);

    if (
        !existing ||
        getExecutionTime(report) >= getExecutionTime(existing)
    ) {
        latestReports.set(key, report);
    }
}

const displayedReports = [...latestReports.values()];

// Delete older JSON files and their matching HTML files.
// Only delete files that were successfully read as JSON reports.
const latestJsonFiles = new Set(
    displayedReports.map(report => report.jsonFile)
);

for (const report of reports) {
    if (!latestJsonFiles.has(report.jsonFile)) {
        const oldJsonPath = path.join(
            sourceReportDirectory,
            report.jsonFile
        );

        const oldHtmlPath = path.join(
            sourceReportDirectory,
            report.htmlFile
        );

        if (fs.existsSync(oldJsonPath)) {
            fs.unlinkSync(oldJsonPath);
            console.log(`Deleted older JSON: ${report.jsonFile}`);
        }

        if (fs.existsSync(oldHtmlPath)) {
            fs.unlinkSync(oldHtmlPath);
            console.log(`Deleted older HTML: ${report.htmlFile}`);
        }
    }
}

// Separate the latest reports by user type.
const registeredReports = displayedReports.filter(
    report => getUserType(report) === "REGISTERED"
);

const guestReports = displayedReports.filter(
    report => getUserType(report) === "GUEST"
);

const unclassifiedReports = displayedReports.filter(
    report => getUserType(report) === "UNCLASSIFIED"
);

// Calculate summary statistics.
function getSummary(reportList) {
    const total = reportList.length;

    const passed = reportList.filter(
        report => String(report.status || "").toUpperCase() === "PASSED"
    ).length;

    const failed = reportList.filter(
        report => String(report.status || "").toUpperCase() === "FAILED"
    ).length;

    const other = total - passed - failed;

    const passRate = total
        ? ((passed / total) * 100).toFixed(1)
        : "0.0";

    return {
        total,
        passed,
        failed,
        other,
        passRate
    };
}

const overallSummary = getSummary(displayedReports);
const registeredSummary = getSummary(registeredReports);
const guestSummary = getSummary(guestReports);
const unclassifiedSummary = getSummary(unclassifiedReports);

// Find the latest execution date for a section.
function getLatestExecutionDate(reportList) {
    const dates = reportList
        .map(report => report.endTime || report.startTime)
        .filter(Boolean)
        .map(date => new Date(date))
        .filter(date => !Number.isNaN(date.getTime()));

    if (dates.length === 0) {
        return "No execution date available";
    }

    const latestDate = new Date(
        Math.max(...dates.map(date => date.getTime()))
    );

    return latestDate.toLocaleString("en-IN");
}

// Build individual test result rows.
function buildRows(reportList) {
    return reportList.map(report => {
        const status = String(
            report.status || "NOT RECORDED"
        ).toUpperCase();

        const statusClass =
            status === "PASSED" ? "passed" :
            status === "FAILED" ? "failed" : "other";

        const detailsPath = path.join(
            sourceReportDirectory,
            report.htmlFile
        );

        const detailsExist = fs.existsSync(detailsPath);

        const relativeReportPath = path.relative(
            outputDirectory,
            detailsPath
        ).split(path.sep).join("/");

        const reportLink = detailsExist
            ? `<a href="${encodeURI(relativeReportPath)}">View details</a>`
            : "Detailed report unavailable";

        const executionDate = report.endTime || report.startTime;

        const legacyDate = getUserType(report) === "UNCLASSIFIED"
            ? `<div class="legacy-date">
                   Executed: ${escapeHtml(
                       executionDate
                           ? new Date(executionDate).toLocaleString("en-IN")
                           : "Date unavailable"
                   )}
               </div>`
            : "";

        return `
            <tr>
                <td>
                    ${escapeHtml(report.testName || report.jsonFile)}
                    ${legacyDate}
                </td>
                <td>
                    <span class="status ${statusClass}">
                        ${escapeHtml(status)}
                    </span>
                </td>
                <td>${report.totalFunds ?? 0}</td>
                <td>${report.passedFunds ?? 0}</td>
                <td>${report.failedFunds ?? 0}</td>
                <td>${reportLink}</td>
            </tr>`;
    }).join("");
}

// Build a separate table for each report group.
function buildSection(title, reportList, summary) {
    const rows = buildRows(reportList);

    return `
        <div class="section">
            <h2>
                ${escapeHtml(title)}
                <span class="heading-date">
                    — Latest execution:
                    ${escapeHtml(getLatestExecutionDate(reportList))}
                </span>
            </h2>

            <div class="section-summary">
                <span>Total reports: <strong>${summary.total}</strong></span>
                <span>Passed: <strong class="green">${summary.passed}</strong></span>
                <span>Failed: <strong class="red">${summary.failed}</strong></span>
                <span>Other: <strong>${summary.other}</strong></span>
                <span>Pass rate: <strong class="blue">${summary.passRate}%</strong></span>
            </div>

            <p>
                Each row represents the latest saved execution for a test
                and user type. Fund counts show the fund validations recorded,
                where available.
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Test scenario</th>
                        <th>Result</th>
                        <th>Total funds</th>
                        <th>Passed funds</th>
                        <th>Failed funds</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || `
                        <tr>
                            <td colspan="6">No reports found for this section.</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>`;
}

// Generate integrated HTML.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ORCA Mobile Test Execution Report</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background: #f4f6f9;
            color: #263238;
        }

        header {
            background: #17365d;
            color: white;
            padding: 28px 5%;
        }

        header h1 {
            margin: 0 0 8px;
        }

        header p {
            margin: 0;
            color: #e2eaf4;
        }

        main {
            max-width: 1200px;
            margin: 28px auto;
            padding: 0 20px;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 16px;
            margin: 22px 0;
        }

        .card {
            background: white;
            padding: 22px;
            border-radius: 10px;
            box-shadow: 0 2px 8px #0000000d;
        }

        .card-label {
            color: #596579;
            font-size: 14px;
        }

        .value {
            font-size: 32px;
            font-weight: bold;
            margin-top: 10px;
        }

        .green {
            color: #16834a;
        }

        .red {
            color: #c62828;
        }

        .blue {
            color: #245bb5;
        }

        .section {
            background: white;
            border-radius: 10px;
            padding: 22px;
            margin-top: 24px;
            overflow-x: auto;
            box-shadow: 0 2px 8px #0000000d;
        }

        .section h2 {
            margin-top: 0;
        }

        .heading-date {
            font-size: 14px;
            font-weight: normal;
            color: #596579;
            margin-left: 8px;
        }

        .legacy-date {
            font-size: 12px;
            color: #697586;
            margin-top: 6px;
        }

        .section-summary {
            display: flex;
            flex-wrap: wrap;
            gap: 12px 22px;
            padding: 14px;
            background: #f4f6f9;
            border-radius: 8px;
            margin: 16px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 650px;
        }

        th, td {
            padding: 14px 12px;
            border-bottom: 1px solid #e5e9ef;
            text-align: left;
        }

        th {
            background: #f0f3f8;
        }

        .status {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }

        .passed {
            background: #e2f5e9;
            color: #16753b;
        }

        .failed {
            background: #fde8e7;
            color: #b42318;
        }

        .other {
            background: #edf0f4;
            color: #596579;
        }

        a {
            color: #245bb5;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        footer {
            color: #697586;
            font-size: 12px;
            padding: 25px 0;
            text-align: center;
        }

        @media (max-width: 600px) {
            header {
                padding: 22px;
            }

            main {
                padding: 0 12px;
            }

            .section {
                padding: 16px;
            }
        }
    </style>
</head>

<body>
    <header>
        <h1>ORCA Mobile Test Execution Report</h1>
        <p>
            A summary of automated tests executed against the ORCA Mobile
            application, separated by user type.
        </p>
    </header>

    <main>
        <h2>Overall Execution Summary</h2>

        <p>
            Total saved reports:
            <strong>${overallSummary.total}</strong>
        </p>

        <div class="cards">
            <div class="card">
                <div class="card-label">Total test reports</div>
                <div class="value">${overallSummary.total}</div>
            </div>

            <div class="card">
                <div class="card-label">Passed</div>
                <div class="value green">${overallSummary.passed}</div>
            </div>

            <div class="card">
                <div class="card-label">Failed</div>
                <div class="value red">${overallSummary.failed}</div>
            </div>

            <div class="card">
                <div class="card-label">Other</div>
                <div class="value">${overallSummary.other}</div>
            </div>

            <div class="card">
                <div class="card-label">Pass rate</div>
                <div class="value blue">${overallSummary.passRate}%</div>
            </div>
        </div>

        ${buildSection(
            "Registered User Test Results",
            registeredReports,
            registeredSummary
        )}

        ${buildSection(
            "Guest User Test Results",
            guestReports,
            guestSummary
        )}

        ${
            unclassifiedReports.length
                ? buildSection(
                    "Unclassified / Legacy Reports",
                    unclassifiedReports,
                    unclassifiedSummary
                )
                : ""
        }

        <footer>
            Generated: ${new Date().toLocaleString()} |
            ORCA Mobile Automation
        </footer>
    </main>
</body>
</html>`;

fs.writeFileSync(outputPath, html, "utf8");

console.log(`Mobile integrated report generated: ${outputPath}`);
console.log(`Registered reports: ${registeredSummary.total}`);
console.log(`Guest reports: ${guestSummary.total}`);
console.log(`Unclassified reports: ${unclassifiedSummary.total}`);
console.log(`Total latest reports: ${displayedReports.length}`);

