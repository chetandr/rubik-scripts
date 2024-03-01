const fs = require('fs');
const xml2js = require('xml2js');

function convertXmlToJson(xmlFilePath, jsonFilePath) {
    fs.readFile(xmlFilePath, 'utf-8', (err, xmlData) => {
        if (err) {
            console.error('Error reading XML file:', err);
            return;
        }

        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, jsonData) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    return;
                }
                console.log('Conversion completed successfully.');
            });
        });
    });
}

const xmlFilePath = './utf8/AprilSales.xml';
const jsonFilePath = './json/AprilSales.json';
convertXmlToJson(xmlFilePath, jsonFilePath);

