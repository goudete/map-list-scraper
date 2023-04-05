const puppeteer = require('puppeteer');

const LIST_URL = 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3';


(async () => {
  console.log('Launch a new headless browser instance...');
  const browser = await puppeteer.launch();
  
  console.log('Open a new page...');
  const page = await browser.newPage();
  
  console.log('Navigate to a website...');
  await page.goto(LIST_URL, {waitUntil: 'networkidle2'});

  console.log('Get the number of elements with the class \'m6QErb\'...');
  
  const elementCount = await page.$$eval('div.m6QErb', elements => elements.length);
  console.log('elementCount: ', elementCount);

  for (let i = 0; i < elementCount; i++) {
    try {
      // Click the i-th element with the class 'm6QErb'
      await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle2'}),
        page.click(`div.m6QErb:nth-child(${i + 1})`),
      ]);
  
      // Extract the text from the element with the class 'PYvSYb'
      const extractedText = await page.$eval('div.PYvSYb', el => el.textContent.trim());
      console.log(`Extracted Text (${i + 1}):`, extractedText);
  
      // Click the back button with the class 'bDDiq' to return to the original page
      await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle2'}),
        page.click('div.fKm1Mb'),
      ]);
      
    } catch (error) {
      console.log(`Element #${i} failed`, error)
    }
  }

  // Close the browser
  await browser.close();
})();