require('dotenv').config()
const fs = require('fs')
const { savePim } = require('./repository/pimRepository')
const { getItemsInput } = require('./repository/inputRepository')


const main = async()=>{
    const itemsInput = await getItemsInput()
    const fileLogOk= process.env.FILE_LOGS+ "LogOk.txt"
    const fileLogErr=process.env.FILE_LOGS+ "LogErr.txt"
    const fileSkuOk= process.env.FILE_LOGS+ "LogSkuOk.txt"
    const fileSkuErr=process.env.FILE_LOGS+ "LogSkuErr.txt"
    fs.writeFile(fileSkuOk, "", err=>{})
    fs.writeFile(fileSkuErr, "", err=>{})
    //Initial value
    let index=process.env.SEQ_INIT

    for (let x = 0; x < itemsInput.length; x++) {
        const element = itemsInput[x];
        await Promise.all(element.map(async ({item, sku}) => {
            if (!item.ItemNumber){
              index++
              item.ItemNumber= process.env.ITEM_PREFIX+ index  
            }
            
            const contents = await savePim(item)
            if (contents.status==200){
                const message = "OK:" + item.ItemNumber + " sku: " + sku + "->" +  JSON.stringify(contents)+ "\n"
                console.log(message)
                fs.appendFile(fileLogOk, message, err=>{})
                fs.appendFile(fileSkuOk, sku + ";" + item.ItemNumber + "\n", err=>{})
    
            }else{
                const message = "Errr: "+ item.ItemNumber + " sku: " + sku + "->" + JSON.stringify(contents) + "\n"
                console.log(message)
                fs.appendFile(fileLogErr, message, err=>{})
                fs.appendFile(fileSkuErr, sku + ";" + item.ItemNumber +";"+ JSON.stringify(contents.message)+ "\n", err=>{})
            }
          }))
    }

}

main()