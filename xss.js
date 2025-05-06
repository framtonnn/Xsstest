const puppeteer = require('puppeteer');

(async () => {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error('Usage: node xss-check.js <url>');
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Listen for alert dialogs (XSS payloads often trigger alert)
  page.on('dialog', async dialog => {
    console.log(`Alert detected: ${dialog.message()}`);
    await dialog.dismiss();
    await browser.close();
    process.exit(0); // Exit with success if alert detected
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  // Wait some time to catch any delayed alerts
  await page.waitForTimeout(5000);

  console.log('No alert detected.');
  await browser.close();
  process.exit(1); // Exit with failure if no alert
})();
