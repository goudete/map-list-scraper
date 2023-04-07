const puppeteer = require('puppeteer');


async function scrapeList(LIST_URL) {
  try {
    console.log('Launch a new headless browser instance...');
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    console.log('Navigating to list...');
    await page.goto(
      LIST_URL,
      { waitUntil: 'networkidle2' }
    );

    // const 'div.m6QErb.DxyBCb.kA9KIf' = 'div.m6QErb.DxyBCb.kA9KIf';

    // Define a helper function to get the scroll height of the element
    const getScrollHeight = async () => {
      return await page.evaluate(() => {
        const scrollContainer = document.querySelector('div.m6QErb.DxyBCb.kA9KIf');
        return scrollContainer.scrollHeight;
      });
    };

    let previousScrollHeight = await getScrollHeight();

    while (true) {
      // Scroll to the bottom of the element
      await page.evaluate(() => {
        const scrollContainer = document.querySelector('div.m6QErb.DxyBCb.kA9KIf');
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

    const listTitle = await getListTitle(page);
    const ownerAndCount = await getListOwnerandCount(page);
    const places = await getPlaceObjects(page);

    console.log('Close the browser');
    await browser.close();

    return {
      listTitle,
      ownerAndCount,
      places
    };


  } catch (error) {
    console.log('Error in puppeteer:', error);
    process.exit(1);
  }
}

async function getPlaceObjects(page) {
  console.log('Grabbing the place titles...');
  const placeNameSelector = 'h3.kiaEld';
  const placeName = await page.$$eval(placeNameSelector, elements => elements.map(element => element.textContent.trim())
  );

  console.log('Grabbing the place address...');
  const addressSelector = 'span.fKEVAc';
  const addresses = await page.$$eval(addressSelector, elements => elements.map(element => element.textContent.trim())
  );

  const placeObjects = placeName.map((name, index) => {
    return {
      name,
      address: addresses[index]
    };
  });

  console.log('Place Objects: ', placeObjects);
  console.log(`${placeObjects.length} places scraped`);

  return placeObjects;
}

async function getListOwnerandCount(page) {
  console.log('Grabbing list owner and count...');
  const ownerSelector = 'h2.vkU5O[jstcache="180"]';
  const listOwnerAndCount = await page.$$eval(ownerSelector, elements => elements.map(element => element.textContent.trim())
  );
  console.log('listOwnerAndCount: ', listOwnerAndCount);

  return listOwnerAndCount
}

async function getListTitle(page) {
  console.log('Grabbing list title...');
  const titleSelector = 'h1.fontTitleLarge';
  const listTitle = await page.$eval(titleSelector, element => element.textContent.trim());
  console.log('List Title: ', listTitle);

  return listTitle;
}

module.exports = {
  scrapeList
}
