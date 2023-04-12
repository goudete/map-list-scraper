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

async function saveToPostgres(places) {
  try {
    const { error } = await supabase
      .from('Places')
      .insert(places);

    console.log('supabase error object: ', error);
  } catch (error) {
    throw (error);
  }
}

module.exports = {
  exportToCsv,
  saveToPostgres
}