var User = cc.Class({

    s_user: null,

    statics: {

        Instance: function () {
            if(!this.s_user){
                this.s_user = new User();
            }
            return this.s_user;
        },

        Destroy: function () {
            if(this.s_user){
                this.s_user = null;
            }
        },

    },

    properties:{

        /**
         * 用户id
         */
        _id: 0,
        id: {
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value;
            }
        },
    },

    requestUserData:function (idList, cb) {
        if(idList.length == 0){
            return;
        }
        var xhr = XMLHttpRequest();
        xhr.onreadystatechange = function () {
            cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respone = xhr.responseText;
                var data = JSON.parse(respone);
                cc.log('respone:', data.Msg);
                cb(data.Msg);
            }else{
                // cb(-1);
            }
        };

        var url = 'http://192.168.2.234:10103/user/userinfo';
        url += '?';
        var param = '';
        var cnt = idList.length;
        idList.forEach(function (id, i) {
            param += ('userid='+id);
            if(i < cnt -1){
                param += '&';
            }
        });
        cc.log('param:', param);
        url += param;

        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

        xhr.timeout = 5000;
        xhr.send();
    },

});

module.exports = User;