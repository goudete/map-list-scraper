const puppeteer = require('puppeteer');

const LIST_URL = 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3';

(async () => {
  try {
    console.log('Launch a new headless browser instance...');
    const browser = await puppeteer.launch();

    console.log('Open a new page...');
    const page = await browser.newPage();

    console.log('Navigate to a website...');
    await page.goto(
      LIST_URL,
      { waitUntil: 'networkidle2' }
    );

    const scrollContainerSelector = '#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf'

    // Define a helper function to get the scroll height of the element
    const getScrollHeight = async () => {
      return await page.evaluate(() => {
        const scrollContainer = document.querySelector(scrollContainerSelector);
        return scrollContainer.scrollHeight;
      });
    };

    let previousScrollHeight = await getScrollHeight();

    while (true) {
      // Scroll to the bottom of the element
      await page.evaluate(() => {
        const scrollContainer = document.querySelector(scrollContainerSelector);
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });

      // Wait for new results to load
      await page.waitForTimeout(2000);

      // Check if the scroll height has changed (i.e., new results have been loaded)
      const currentScrollHeight = await getScrollHeight();
      console.log('currentScrollHeight:', currentScrollHeight)
      if (currentScrollHeight === previousScrollHeight) {
        break; // No new results, exit the loop
      }
      previousScrollHeight = currentScrollHeight;
    }

    console.log('Grabbing list title...');
    const titleSelector = 'h1.fontTitleLarge';
    const listTitle = await page.$eval(titleSelector, element => element.textContent.trim());
    console.log('List Title: ', listTitle);

    console.log('Grabbing list owner and count...');
    const ownerSelector = 'h2.vkU5O[jstcache="180"]';
    const listOwnerAndCount = await page.$$eval(ownerSelector, elements =>
      elements.map(element => element.textContent.trim())
    );
    console.log('listOwnerAndCount: ', listOwnerAndCount);

    console.log('Grabbing the place titles...');
    const placeNameSelector = 'h3.kiaEld';
    const placeName = await page.$$eval(placeNameSelector, elements =>
      elements.map(element => element.textContent.trim())
    );

    console.log('Grabbing the place address...');
    const addressSelector = 'span.fKEVAc';
    const addresses = await page.$$eval(addressSelector, elements =>
      elements.map(element => element.textContent.trim())
    );

    const placeObjects = placeName.map((name, index) => {
      return {
        name,
        address: addresses[index]
      };
    });

    console.log('Place Objects: ', placeObjects);
    console.log(`${placeObjects.length} places scraped`)

    console.log('Close the browser');
    await browser.close();
    process.exit(0);


  } catch (error) {
    console.log('Oops:', error);
    process.exit(1);
  }
})();