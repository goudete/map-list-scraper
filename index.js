require('dotenv').config();

const { scrapeList } = require('./scrapers/list');
const { scrapePlaces } = require('./scrapers/place');
const { exportToCsv, saveToPostgres, exportToJson } = require('./utils');
const places = require('./localCache/places-thierry-asia.json');

const LISTS = {
  enrique_nyc: 'https://www.google.com/maps/@40.7400281,-73.984887,13z/data=!4m3!11m2!2sJiNXPuDD6wSVJVFfyBXiCYm-A1uBDg!3e3',
  thierry_portugal: 'https://www.google.com/maps/@35.7546683,-18.5052413,6z/data=!3m1!4b1!4m2!11m1!2svDaO4s4tQZ2Od9oMW4_EfQ',
  maya_nyc: 'https://www.google.com/maps/@/data=!3m1!4b1!4m2!11m1!2sS83LeAgUvydq9K0mTyusniadYIMzaw',
  thierry_asia: 'https://www.google.com/maps/@1.3061409,103.899627,12.83z/data=!4m2!11m1!2sK3E0PpPjQP8VFJR0KDwraN33oHcA4Q'
}

const LIST_URL = LISTS['thierry_asia'];

(async () => {
  try {
    const {
      list,
      places
    } = await scrapeList(LIST_URL);

    const placesWithDetails = await scrapePlaces(places);

    exportToJson(placesWithDetails, 'placesWithDetails');
    // save places
    await saveToPostgres(list, placesWithDetails);

    process.exit(0);

  } catch (error) {
    console.log('Error', error)
    process.exit(1);
  }
})();