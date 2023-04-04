const puppeteer = require('puppeteer');

const LIST_URL = 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3';

(async () => {
  try {
    console.log("Launch a new headless browser instance")
    const browser = await puppeteer.launch();

    console.log("Open a new page")
    const page = await browser.newPage();

    console.log("Navigate to a website")
    await page.goto(
      LIST_URL,
      { waitUntil: 'networkidle2' }
    );

    // console.log("Take a screenshot and save it to the project directory")
    // await page.screenshot({path: 'nyc.png'});

    console.log("Grabbing list title");
    const titleSelector = 'h1.fontTitleLarge';
    const listTitle = await page.$eval(titleSelector, element => element.textContent.trim());
    console.log('List Title: ', listTitle)

    console.log("Grab the text content of all elements with jstcache=\"190\"")
    const placeTitles = await page.$$eval('span[jstcache="190"]', elements =>
      elements.map(element => element.textContent.trim())
    );
    console.log('Place Titles: ', placeTitles)

    console.log("Close the browser")
    await browser.close();
    process.exit(0);

  } catch (error) {
    console.log('Oops:', error);
    process.exit(1);
  }
})();