const { ItemPIM } = require("./itemPim")
const { map } = require("./map")

const convert = (row, tags)=>{
    if(!row) return
    const item = JSON.parse(JSON.stringify(ItemPIM))
    item.ItemDescription=getValueByTag(row,tags,"<Name>")
    item.ItemCategory[0].ItemCatalog="HPSA"
    item.ItemCategory[0].CategoryCode="HPSA_LIN_"+getValueByTag(row,tags,"Línea Promart").substring(0,5)
    sku =getValueByTag(row,tags,"Sku")
    
    map.forEach(mapRow=>{
        let valueAttrib= getValueByTag(row,tags,mapRow[2])
        if (valueAttrib){
            let vattribName = mapRow[0]

            let valueAttribUOM= null
            let vattribNameUOM= null
            
            if (mapRow[3]){
                if (mapRow[3]!=""){
                    valueAttrib = valueAttrib.split(mapRow[3])[mapRow[4]]
                }    
            }
            //UOM
            if (mapRow[5]){
                if (mapRow[5]="1"){
                    valueAttribUOM=valueAttrib.split(" ")[1] 
                    vattribNameUOM=vattribName+ "UEUOM"    
                    valueAttrib=valueAttrib.split(" ")[0] 
                    vattribName="u"+vattribName+ "UE"
                }
            }
            if (valueAttrib){
                addValue(mapRow[1],vattribName, valueAttrib, item)
            }
            if (valueAttribUOM){
                addValue(mapRow[1],vattribNameUOM, valueAttribUOM, item)
            }    
        }
    })

    //add    ["pesoDelMasterpackLogistica","HpsaAtributosLogisticos","Peso Del Masterpack (Logística)","","","1"],
    addValue("HpsaAtributosLogisticos","pesoDelMasterpackLogisticaUEUOM", "kg", item)

    return {item:item, sku:sku}
}

const getValueByTag = (row, tags, tag)=>{
    const index = tags.findIndex(t=> t===tag)
    return row[index]
}

const addValue = (groupName, attribName, attribValue, item)=>{

    //const vattribValue =attribValue
    let valFinal;
    //const valNumber = parseFloat(attribValue)
    if (isFloat(attribValue)){
        valFinal= parseFloat(attribValue)
    }else{
        valFinal=attribValue
    }

    //console.log(valNumber, attribValue, valFinal)

    let attrGroup = item.ItemEffCategory.find(t => Object.keys(t)[0] === groupName)
    if(!attrGroup){
        const attribGroup={}
        attribGroup[groupName]=[]
        item.ItemEffCategory.push(attribGroup)
        attrGroup = item.ItemEffCategory.find(t => Object.keys(t)[0] === groupName)
    }
    if (attrGroup[groupName].length==0){
        attrGroup[groupName].push({})
    }
    attrGroup[groupName][0][attribName]=valFinal
}

function isFloat(n) {
    if( n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n))  )
       return true;
    return false;
 }

module.exports={convert}