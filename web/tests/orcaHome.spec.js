

const { test } = require('@playwright/test');

test('Inspect ORCA Trade Mode login', async ({ page }) => {
    await page.goto('https://orca.enrichmoney.in/');

    await page.getByText('Trade Mode', { exact: true }).click();

    await page.waitForURL('**/authentication/login');

    const inputs = await page.locator('input:visible').evaluateAll(
        elements => elements.map(el => ({
            type: el.type,
            placeholder: el.placeholder,
            name: el.name,
            ariaLabel: el.getAttribute('aria-label')
        }))
    );

    const buttons = await page.locator('button:visible').evaluateAll(
        elements => elements.map(el => ({
            text: el.innerText.trim(),
            type: el.type,
            disabled: el.disabled
        }))
    );

    console.log('INPUT FIELDS:', JSON.stringify(inputs, null, 2));
    console.log('BUTTONS:', JSON.stringify(buttons, null, 2));
});

