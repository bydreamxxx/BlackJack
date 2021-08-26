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
                { key:35,group:[0,0,0],priority:35,priority_id:1 },
                { key:36,group:[1,1,1],priority:36,priority_id:1 },
                { key:37,group:[2,2,2],priority:37,priority_id:1 },
                { key:38,group:[3,3,3],priority:38,priority_id:1 },
                { key:39,group:[4,4,4],priority:39,priority_id:1 },
                { key:40,group:[5,5,5],priority:40,priority_id:1 },
                { key:41,group:[6,6,6],priority:41,priority_id:1 },
                { key:42,group:[7,7,7],priority:42,priority_id:1 },
                { key:43,group:[8,8,8],priority:43,priority_id:1 },
                { key:44,group:[9,9,9],priority:44,priority_id:1 },
                { key:45,group:[10,10,10],priority:45,priority_id:1 },
                { key:46,group:[11,11,11],priority:46,priority_id:1 },
                { key:47,group:[12,12,12],priority:47,priority_id:1 },
                { key:48,group:[13,13,13],priority:48,priority_id:1 },
                { key:49,group:[14,14,14],priority:49,priority_id:1 },
                { key:50,group:[15,15,15],priority:50,priority_id:1 },
                { key:51,group:[16,16,16],priority:51,priority_id:1 },
                { key:52,group:[17,17,17],priority:52,priority_id:1 },
                { key:53,group:[18,18,18],priority:53,priority_id:1 },
                { key:54,group:[19,19,19],priority:54,priority_id:1 },
                { key:55,group:[20,20,20],priority:55,priority_id:1 },
                { key:56,group:[21,21,21],priority:56,priority_id:1 },
                { key:57,group:[22,22,22],priority:57,priority_id:1 },
                { key:58,group:[23,23,23],priority:58,priority_id:1 },
                { key:59,group:[24,24,24],priority:59,priority_id:1 },
                { key:60,group:[25,25,25],priority:60,priority_id:1 },
                { key:61,group:[26,26,26],priority:61,priority_id:1 },
                { key:62,group:[27,27,27],priority:62,priority_id:1 },
                { key:63,group:[28,28,28],priority:63,priority_id:1 },
                { key:64,group:[29,29,29],priority:64,priority_id:1 },
                { key:65,group:[30,30,30],priority:65,priority_id:1 },
                { key:66,group:[31,31,31],priority:66,priority_id:1 },
                { key:67,group:[32,32,32],priority:67,priority_id:1 },
                { key:68,group:[33,33,33],priority:68,priority_id:1 },
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