const keyFilePath = 'script/gameyj_common/util/key';
var StringFilter = cc.Class({

    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new StringFilter();
            }
            return this._instance;
        },
        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    ctor: function () {
        this.loaded = false;
        this.filterStrList = [];
    },

    loadKey: function () {
        if (!this.loaded) {
            cc.resources.load(keyFilePath, function (err, data) {
                if (err) {
                    cc.error(err.message);
                }
                else {
                    var keyList = data.text.split('|');
                    keyList.forEach(function (key) {
                        this.filterStrList.push(key);
                    }, this);
                    this.loaded = true;
                }
            }.bind(this));
        }
    },

    /**
     * @method 关键字过滤
     * @param originString 原始字符串
     * @return 过滤后字符串
     */
    filter: function (originString) {
        if (this.loaded) {
            var filterString = originString;
            this.filterStrList.forEach(function (filter) {
                var star = '';
                for (var i = 0; i < filter.length; i++) {
                    star += '*';
                }
                var r = new RegExp(filter, 'ig');
                filterString = filterString.replace(r, star);
            }, this);
            return filterString;
        }
    },

});
module.exports = StringFilter;
