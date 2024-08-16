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
            const {item,sku} =  convert(csvRow[index],tags)
            items.push({item:item, sku:sku})
         }
         return items
    })

    console.log('Son: ' + items.length)
    //Initial value
    let index=process.env.SEQ_INIT

    await Promise.all(items.map(async ({item, sku}) => {
        index++;
        item.ItemNumber= process.env.ITEM_PREFIX+ index;
        const contents = await savePim(item)
        if (contents.status==200){
            const message = "OK:" + item.ItemNumber + " sku: " + sku + "->" +  JSON.stringify(contents)+ "\n"
            console.log(message)
            fs.appendFile('LogOk.txt', message, err=>{})

        }else{
            const message = "Errr: "+ item.ItemNumber + " sku: " + sku + "->" + JSON.stringify(contents) + "\n"
            console.log(message)
            fs.appendFile('LogErr.txt', message, err=>{})
        }
      }))
}

main()