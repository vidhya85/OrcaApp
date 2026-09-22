const fs = require("fs");
const path = require("path");
const projectRoot = path.join(__dirname, "..");

class ScreenshotUtils {

    static ensureDirectory() {

        const screenshotDir =
            path.join(projectRoot, "screenshots");
            
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, {
                recursive: true
            });
        }

        return screenshotDir;
    }


    static sanitizeFileName(name) {

        return name
            .replace(/[^a-zA-Z0-9-_]/g, "_")
            .replace(/_+/g, "_");
    }


    static async capture(driver, name) {

        const screenshotDir =
            this.ensureDirectory();

        const fileName =
            `${this.sanitizeFileName(name)}.png`;

        const filePath =
            path.join(screenshotDir, fileName);

        await driver.saveScreenshot(filePath);

        console.log(
            `Screenshot saved: ${filePath}`
        );

        return filePath;
    }
}


module.exports = ScreenshotUtils;