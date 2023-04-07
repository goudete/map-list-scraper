const { ExportToCsv } = require('export-to-csv');
const fs = require('fs')

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

module.exports = {
  exportToCsv
}