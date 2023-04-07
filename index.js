const { scrapeList } = require('./scrapers/list');
const { scrapePlaces } = require('./scrapers/place');
const { exportToCsv } = require('./utils');

const LISTS = {
  enrique_nyc: 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3',
  thierry_portugal: 'https://www.google.com/maps/@35.7546683,-18.5052413,6z/data=!3m1!4b1!4m2!11m1!2svDaO4s4tQZ2Od9oMW4_EfQ',
}
const LIST_URL = LISTS['thierry_portugal'];

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