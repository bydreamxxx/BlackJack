var data_gangList =
    {
        items:
            [
                { key:1,group:[0,0,0,0],priority:1,priority_id:1 },
                { key:2,group:[1,1,1,1],priority:2,priority_id:1 },
                { key:3,group:[2,2,2,2],priority:3,priority_id:1 },
                { key:4,group:[3,3,3,3],priority:4,priority_id:1 },
                { key:5,group:[4,4,4,4],priority:5,priority_id:1 },
                { key:6,group:[5,5,5,5],priority:6,priority_id:1 },
                { key:7,group:[6,6,6,6],priority:7,priority_id:1 },
                { key:8,group:[7,7,7,7],priority:8,priority_id:1 },
                { key:9,group:[8,8,8,8],priority:9,priority_id:1 },
                { key:10,group:[9,9,9,9],priority:10,priority_id:1 },
                { key:11,group:[10,10,10,10],priority:11,priority_id:1 },
                { key:12,group:[11,11,11,11],priority:12,priority_id:1 },
                { key:13,group:[12,12,12,12],priority:13,priority_id:1 },
                { key:14,group:[13,13,13,13],priority:14,priority_id:1 },
                { key:15,group:[14,14,14,14],priority:15,priority_id:1 },
                { key:16,group:[15,15,15,15],priority:16,priority_id:1 },
                { key:17,group:[16,16,16,16],priority:17,priority_id:1 },
                { key:18,group:[17,17,17,17],priority:18,priority_id:1 },
                { key:19,group:[18,18,18,18],priority:19,priority_id:1 },
                { key:20,group:[19,19,19,19],priority:20,priority_id:1 },
                { key:21,group:[20,20,20,20],priority:21,priority_id:1 },
                { key:22,group:[21,21,21,21],priority:22,priority_id:1 },
                { key:23,group:[22,22,22,22],priority:23,priority_id:1 },
                { key:24,group:[23,23,23,23],priority:24,priority_id:1 },
                { key:25,group:[24,24,24,24],priority:25,priority_id:1 },
                { key:26,group:[25,25,25,25],priority:26,priority_id:1 },
                { key:27,group:[26,26,26,26],priority:27,priority_id:1 },
                { key:28,group:[27,27,27,27],priority:28,priority_id:1 },
                { key:29,group:[28,28,28,28],priority:29,priority_id:1 },
                { key:30,group:[29,29,29,29],priority:30,priority_id:1 },
                { key:31,group:[30,30,30,30],priority:31,priority_id:1 },
                { key:32,group:[31,31,31,31],priority:32,priority_id:1 },
                { key:33,group:[32,32,32,32],priority:33,priority_id:1 },
                { key:34,group:[33,33,33,33],priority:34,priority_id:1 },
                { key:35,group:[0,9,18,0],priority:35,priority_id:1 },
                { key:36,group:[0,9,18,9],priority:36,priority_id:1 },
                { key:37,group:[0,9,18,18],priority:37,priority_id:1 },
                { key:38,group:[27,28,29,27],priority:38,priority_id:1 },
                { key:39,group:[27,28,29,28],priority:39,priority_id:1 },
                { key:40,group:[27,28,29,29],priority:40,priority_id:1 },
                { key:41,group:[30,31,32,33],priority:41,priority_id:1 },
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

module.exports=data_gangList;