var data_xiyou_bet =
{
    items:
    [
      { key:3,name:"齐天大圣",type:"0",pay:"24,9001;48,990;72,9;99,0",weight:1216,index:"18",divide:"24,1500;48,3000;72,4500;99,6000" },
      { key:1,name:"猪八戒",type:"10,2",pay:"6",weight:5200,index:"1;19;23",divide:"" },
      { key:2,name:"唐三藏",type:"10,2",pay:"8",weight:3900,index:"2;20;24",divide:"" },
      { key:6,name:"紫霞仙子",type:"10,2",pay:"8",weight:3900,index:"3;21;25",divide:"" },
      { key:7,name:"至尊宝",type:"10,2",pay:"12",weight:2600,index:"4;22;26",divide:"" },
      { key:5,name:"春三十娘",type:"11,2",pay:"6",weight:5200,index:"9;13;17",divide:"" },
      { key:4,name:"白晶晶",type:"11,2",pay:"8",weight:3900,index:"8;12;16",divide:"" },
      { key:9,name:"铁扇公主",type:"11,2",pay:"8",weight:3900,index:"7;11;15",divide:"" },
      { key:8,name:"牛魔王",type:"11,2",pay:"12",weight:2600,index:"6;10;14",divide:"" },
      { key:301,name:"猪八戒",type:"10,2",pay:"6",weight:5200,index:"1;19;23",divide:"" },
      { key:302,name:"唐三藏",type:"10,2",pay:"8",weight:3900,index:"2;20;24",divide:"" },
      { key:306,name:"紫霞仙子",type:"10,2",pay:"8",weight:3900,index:"3;21;25",divide:"" },
      { key:307,name:"至尊宝",type:"10,2",pay:"12",weight:2600,index:"4;22;26",divide:"" },
      { key:305,name:"春三十娘",type:"11,2",pay:"6",weight:5200,index:"9;13;17",divide:"" },
      { key:304,name:"白晶晶",type:"11,2",pay:"8",weight:3900,index:"8;12;16",divide:"" },
      { key:309,name:"铁扇公主",type:"11,2",pay:"8",weight:3900,index:"7;11;15",divide:"" },
      { key:308,name:"牛魔王",type:"11,2",pay:"12",weight:2600,index:"6;10;14",divide:"" }
    ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function(filter){
        var result = null;
        for(var i=0; i<this.items.length; ++i){
            if(filter(this.items[i])){
                result = this.items[i];
                return result;
            }
        }
        return result;
    },

    /**
     * 查找第一个符合filter的list
     * @param filter
     * @returns {*}
     */
    getItemList: function(filter){
        var list = [];
        this.items.forEach(function (item) {
            if(filter(item)){
                list.push(item);
            }
        });
        return list;
    },
};

module.exports=data_xiyou_bet;