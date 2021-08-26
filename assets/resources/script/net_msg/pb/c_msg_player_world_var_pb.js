let nested_variant_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.value = this.value;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.nested_variant_data = nested_variant_data;

let msg_variant_data_set_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.variantType = this.variantType;
        content.infoListList = this.infoListList;

        return content;
    },
    setVariantType(variantType){
        this.variantType = variantType;
    },
    setInfoListList(infoListList){
        this.infoListList = infoListList;
    },

});

module.exports.msg_variant_data_set_2c = msg_variant_data_set_2c;

