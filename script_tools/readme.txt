公众号
账号：
密码：

APPID：
AppSecret：
EncodingAESKey：

ssh账号：
ssh密码：

操作方式:
cd ../data/assert
rsync --delete-before -av ./web-mobile-temp/ ./web-mobile/
unzip web-mobile.zip -d ./web-mobile/
chmod 777 ./web-mobile

分享链接：
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92e3c6930a07a7a2&redirect_uri=http%3A%2F%2Fxlqp.yuejiegame.cn%2F&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect

打包机部署
1、修改CocosDashboard\resources.editors\Creator\2.4.2\resources\static\_prelude.js
全部替换为
(function e(t, n, r) {
    function s(o, u, npmPkgName) {
        if (!n[o]) {
            if (!t[o]) {
                var b = o;
                if (o.includes("./")) {
                    //内部代码
                    b = o.split("/");
                    b = b[b.length - 1];
                } else {
                    //npm包代码
                }
                if (!t[b]) {
                    var a = "function" == typeof __require && __require;
                    if (!u && a) return a(b, !0);
                    if (i) return i(b, !0);
                    throw new Error("Cannot find module '" + o + "'");
                }
                o = b;
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];
                //判断是不是npm包，是就传包名
                return s(n || e, undefined, !e.includes("./") ? e : undefined);
            }, f, f.exports, e, t, n, r);
        }
        //判断是不是npm包，是就用包名作为key存一下模块引用
        if (npmPkgName && n[o] && !n[npmPkgName]) {
            n[npmPkgName] = n[o];
        }
        return n[o].exports;
    }
    var i = "function" == typeof __require && __require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})

2、安装AndroidStudio，并安装SDK，通过SDK管理器安装NDKr19
3、安装Nodejs、JDK8（不是JRE）