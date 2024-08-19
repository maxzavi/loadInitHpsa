const axios = require('axios')
const fs = require('fs')

const fileJsonErr=process.env.FILE_LOGS+ "LogJsonErr.txt"

const savePim = async (itemPim) => {

    const path = process.env.PIM_API_URL + '/fscmRestApi/resources/11.13.18.05/itemsV2'
    const auth = {
        username: process.env.PIM_API_USERNAME,
        password: process.env.PIM_API_PASSWORD
    }
    return await axios.post(path, itemPim, { auth })
        .then(res => {
            return { status: 200, message: { "ItemId": res.data.ItemId} }
        })
        .catch(err => {
            fs.appendFile(fileJsonErr, JSON.stringify(itemPim) + "\n", err=>{})
            console.log(JSON.stringify(itemPim))
            if(err.response){
                return { status: err.response.status, message: err.response.data.replace("\n"," ").replace("\r"," ") }
            }else{
                console.log(err)
                return { status: 500, message: "Unexpected error!!!" }
            }
        });
}

module.exports={savePim}