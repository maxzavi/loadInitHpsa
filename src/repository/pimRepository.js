const axios = require('axios')

const savePim = async (itemPim) => {

    const path = process.env.PIM_API_URL + '/fscmRestApi/resources/11.13.18.05/itemsV2';
    const auth = {
        username: process.env.PIM_API_USERNAME,
        password: process.env.PIM_API_PASSWORD
    }
    return await axios.post(path, itemPim, { auth })
        .then(res => {
            //console.log('OK')
            return { status: 200, message: { "ItemId": res.data.ItemId} }
        })
        .catch(err => {
            //console.log(err);
            
            console.log(JSON.stringify(itemPim))
            console.log(err.response.status)
            console.log(err.response.data)
            
            
            
            return { status: err.response.status, message: err.response.data };
        });
}

module.exports={savePim}