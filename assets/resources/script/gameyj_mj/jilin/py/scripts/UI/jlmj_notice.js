/**
 * Created by Mac_Li on 2017/8/14.
 */

var s_jlmj_not = null;
var jlmj_notice = cc.Class({

    statics:{
        getInstance: function () {
            if(!s_jlmj_not){
                s_jlmj_not = new jlmj_notice();
                s_jlmj_not.obseverList= new Array();
            }
            return s_jlmj_not;
        },

        Destroy: function () {
            if(s_jlmj_not){
                s_jlmj_not = null;
            }
        },
    },
    addNoticeObsever:function (event, callback) {
        var len = this.obseverList.length;
        for(var i=0; i<len; ++i)
        {
            if(this.obseverList[i].ID == event)
            {
                this.obseverList[i].call = callback;
                break;
            }
        }
        if(len==this.obseverList.length)
        {
            this.obseverList.push({ID:event, call:callback});
        }
    },

    notification:function (event, data) {
        for(var i=0; i<this.obseverList.length; ++i)
        {
            if(this.obseverList[i].ID == event)
            {
                this.obseverList[i].call(data);
                break;
            }
        }
    },
    removeObsever:function (event) {
        for(var i=0; i<this.obseverList.length; ++i)
        {
            if(this.obseverList[i].ID == event)
            {
                this.obseverList.splice(i,1);
                break;
            }
        }
    }

});
module.exports = jlmj_notice;