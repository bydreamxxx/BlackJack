/**
 * 程序入口
 * 注意：Script文件夾下不能再有A开头文件名的文件，否则入口将失效
 */
cc.log("程序启动");

//悦界游戏命名空间
var dd = cc.dd = {};

//第三方库
dd._ = require('lodash');
dd.dumper = require('dumper').dumper;
dd.obj2string = require('dumper').obj2string;
dd.copy = require('copy-to');
dd.dclone = require('deep-clone');
dd.protobufjs = require('protobufjs');