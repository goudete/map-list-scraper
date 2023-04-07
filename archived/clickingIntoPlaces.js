const puppeteer = require('puppeteer');

const LIST_URL = 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3';


(async () => {
  console.log('Launch a new headless browser instance...');
  const browser = await puppeteer.launch();

  console.log('Open a new page...');
  const page = await browser.newPage();

  console.log('Navigate to the website...');
  await page.goto(LIST_URL, { waitUntil: 'networkidle2' });

  console.log('Get the number of places...');
  const elementCount = await page.$$eval('div.m6QErb', elements => elements.length);
  console.log('number of places: ', elementCount);

  // console.log('Screenshotting place...')
  // await page.screenshot({path: 'place.png'});

  for (let i = 1; i <= elementCount; i++) {
    try {
      console.log(`clicking into place #${i}...`)
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click(`div.m6QErb:nth-child(${i})`),
      ]);

      await page.waitForTimeout(2000);

      // Extract the text from the element with the class 'PYvSYb'
      const extractedDescription = await page.$eval('div.PYvSYb', el => el.textContent.trim());
      console.log(`Extracted Text (${i}):`, extractedDescription);

      console.log('clicking back to list...')
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button.hYBOP.FeXq4d'),
      ]);

      await page.waitForTimeout(2000);
    } catch (error) {
      console.log(`Element #${i} failed`, error)
      process.exit(1);
    }
  }

  console.log('Close the browser...');
  await browser.close();
})();


/*
  Open Questions / Issues:
  - First item in list is not clicked
  - Line 28: page.click(`div.m6QErb:nth-child(${i})`), is failing on second click
    - i think it has something to do with the nth-child not working
*/