const { scrapeList } = require('./scrapers/list');
const { scrapePlaces } = require('./scrapers/place');
const { exportToCsv } = require('./utils');

const LIST_URL =
  'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3';

(async () => {
  try {
    const list = await scrapeList(LIST_URL);
    console.log(list)
    const places = await scrapePlaces(list.places);

    exportToCsv(places, LIST_URL);
    process.exit(0);

  } catch (error) {
    console.log('Error', error)
    process.exit(1);
  }
})();