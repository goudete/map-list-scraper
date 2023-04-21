const { ExportToCsv } = require('export-to-csv');
const fs = require('fs')
const supabase = require('./clients/supabase');

function exportToCsv(places, url) {
  const CSV_OPTIONS = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: `Google List: ${url}`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(CSV_OPTIONS);
  const csvData = csvExporter.generateCsv(places, true);

  fs.writeFileSync('list.csv', csvData)
}

async function saveToPostgres(list, places) {
  try {
    // insert to Lists table
    const { data: listData, error: listError } = await supabase
      .from('Lists')
      .insert(list)
      .select();
    const { id: listId } = listData[0];

    // insert to Places table
    const { data: placesData, error: placesError } = await supabase
      .from('Places')
      .insert(places)
      .select();

    const listPlaces = placesData.map(place => ({
      list_id: listId,
      place_id: place.id
    }));

    // insert to List_Place table
    const { data: listPlaceData, error: listPlaceError } = await supabase
      .from('List_Places')
      .insert(listPlaces);

  } catch (error) {
    throw (error);
  }
}

module.exports = {
  exportToCsv,
  saveToPostgres
}