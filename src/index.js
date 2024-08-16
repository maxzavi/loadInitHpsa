require('dotenv').config()
const fs = require('fs')
const { convert } = require('./config/convert')
const { savePim } = require('./repository/pimRepository')


const main = async()=>{
    const filepath= process.env.FILE_PATH
    const data = fs.readFileSync(filepath,'utf8')
    const rows = data.split('\n')
    const tags = rows[0].split(';')

    const csv=require('csvtojson')

    const items = await csv({
        noheader:false,
        output: "csv",
        delimiter: ";"
    })
    .fromString(data)
    .then((csvRow)=>{
        const items =[] 
        for (let index = 0; index < csvRow.length; index++) {
            const item =  convert(csvRow[index],tags)
            items.push(item)
         }
         return items
    })

    console.log('Son: ' + items.length)
    let index=1000002

    //console.log(checkFloat("1 Año"))

    await Promise.all(items.map(async (item) => {
        index++;
        item.ItemNumber="HPSA_B_" + index;
        const contents = await savePim(item)
        console.log(item.ItemNumber,  contents)
      }));
}


main()