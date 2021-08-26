/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

//var common_client_pb = require('common_client_pb');
goog.exportSymbol('proto.yjprotogo.tdk_enum_betrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_deskendtype', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_deskstatus', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_disdesicionrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_fantirsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_foldrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_joindeskrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_joinroomrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_kprsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_leavedeskrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_passrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_protoId', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_qijiaorsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_radyrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_reqdisdeskrsp', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_roomtype', null, global);
goog.exportSymbol('proto.yjprotogo.tdk_enum_userdisdesicion', null, global);
/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_protoId = {
  TDK_PID_HEATBEAT: 0,
  TDK_PID_TDKCREATEDESKREQ: 1,
  TDK_PID_TDKJOINDESKREQ: 2,
  TDK_PID_TDKJOINROOMREQ: 3,
  TDK_PID_TDKLEAVEDESKREQ: 4,
  TDK_PID_TDKLEAVEROOMREQ: 5,
  TDK_PID_TDKDISSOLVEDESKREQ: 6,
  TDK_PID_TDKDISDESKDESICIONREQ: 7,
  TDK_PID_TDKBETREQ: 8,
  TDK_PID_TDKQIJIAOREQ: 9,
  TDK_PID_TDKFANTIREQ: 10,
  TDK_PID_TDKFOLDREQ: 11,
  TDK_PID_TDKUSERREADYREQ: 12,
  TDK_PID_TDKCREATEDESKRSP: 13,
  TDK_PID_TDKJOINDESKRSP: 14,
  TDK_PID_TDKJOINROOMRSP: 15,
  TDK_PID_TDKLEAVEDESKRSP: 16,
  TDK_PID_TDKLEAVEROOMRSP: 17,
  TDK_PID_TDKDISSOLVEDESKUSERRSP: 18,
  TDK_PID_TDKDISDESKDESICIONRSP: 19,
  TDK_PID_TDKBETRSP: 20,
  TDK_PID_TDKQIJIAORSP: 21,
  TDK_PID_TDKFANTIRSP: 22,
  TDK_PID_TDKFOLDRSP: 23,
  TDK_PID_TDKUSERREADYRSP: 24,
  TDK_PID_TDKSTARTBETRSP: 25,
  TDK_PID_TTDKRETURNDESKRSP: 26,
  TDK_PID_TDKSENDPOKERRSP: 27,
  TDK_PID_TDKROUNDENDRSP: 28,
  TDK_PID_TDKPASS: 29,
  TDK_PID_TDKPASSRSP: 30,
  TDK_PID_TDKFKAIPAI: 31,
  TDK_PID_TDKFKAIPAIRSP: 32,
  TDK_PID_TDKDISDESKRESULT: 33,
  TDK_PID_TDKENTERGAME: 34,
  TDK_PID_TDKENTERGAMERSP: 35,
  TDK_PID_TDKZHANJI: 36,
  TDK_PID_TDKZHANJIRSP: 37,
  TDK_PID_TDKMATCHREQ: 38,
  TDK_PID_TDKJOINPLAYINGDESKRSP: 39,
  TDK_PID_TDKCKAIPAI: 40,
  TDK_PID_TDKCKAIPAIRSP: 41,
  TDK_PID_TDKCKAIPAIHANDPOKERRSP: 42,
  TDK_PID_TDKCRETURNDESK: 43,
  TDK_PID_TDKMATCHADDUSERRSP: 44,
  TDK_PID_TDKALLUSERPOKERRSP: 45,
  TDK_PID_TDKCOMREQMSG: 46,
  TDK_PID_TDKCOMBCMSG: 47,
  TDK_PID_TDKCOMUSEITEM: 48,
  TDK_PID_TDKCOMUSEITEMRSP: 49
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_deskstatus = {
  DESKSTATUS_IDLE: 0,
  DESKSTATUS_WAITINGJOIN: 1,
  DESKSTATUS_GAMING_BET: 2,
  DESKSTATUS_GAMING_QIJIAO: 3,
  DESKSTATUS_GAMING_FANTI: 4,
  DESKSTATUS_GAMING_BET_GEN: 5,
  DESKSTATUS_GAMING_QIJIAO_GEN: 6,
  DESKSTATUS_GAMING_FANTI_GEN: 7,
  DESKSTATUS_WAITINGFORREADY: 8,
  DESKSTATUS_GAMING_LANGUO: 9,
  DESKSTATUS_GAMING_END: 10,
  DESKSTATUS_GAMING_KAIPAI: 11,
  DESKSTATUS_GAMING_SENDALLPOKER: 12,
  DESKSTATUS_GAMING_SCORECMP: 13,
  DESKSTATUS_ZHANJI: 14,
  DESKSTATUS_GAMING_KPBET: 15,
  DESKSTATUS_GAMING_KPBET_GEN: 16,
  DESKSTATUS_GAMING_KPQIJIAO: 17,
  DESKSTATUS_GAMING_KPQIJIAO_GEN: 18,
  DESKSTATUS_GAMING_KPFANTI: 19,
  DESKSTATUS_GAMING_KPFANTI_GEN: 20,
  DESKSTATUS_GAMING_KPALLIN: 21,
  DESKSTATUS_GAMING_KPALLIN_GEN: 22,
  DESKSTATUS_GAMING_KP_KP: 23,
  DESKSTATUS_GAMING_ALLIN: 24,
  DESKSTATUS_GAMING_ALLINGEN: 25
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_radyrsp = {
  DESKREADYRSP_SUCCESS: 0,
  DESKREADYRSP_DESKSTATUSERROR: 1
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_disdesicionrsp = {
  DESKDISDESICIONRSP_SUCCESS: 0,
  DESKDISDESICIONRSP_DECIDED: 1,
  DESKDISDESICIONRSP_STATEERROR: 2
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_userdisdesicion = {
  USERDISDESK_NOTDECIDE: 0,
  USERDISDESK_YES: 1,
  USERDISDESK_NO: 2
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_betrsp = {
  DESKBETRSP_SUCCESS: 0,
  DESKBETRSP_NOTACTUSER: 1,
  DESKBETRSP_BETNUMERROR: 2,
  DESKBETRSP_NOTINOPERATIONQUEUE: 3,
  DESKBETRSP_DESKSTATEERROR: 4,
  DESKBETRSP_CANNOTALLIN: 5,
  DESKBETRSP_DESKSTATEDD: 6
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_qijiaorsp = {
  DESKQIJIAORSP_SUCCESS: 0,
  DESKQIJIAORSP_NOTACTUSER: 1,
  DESKQIJIAORSP_DESKSTATEERROR: 2,
  DESKQIJIAORSP_CANNOTALLIN: 3,
  DESKQIJIAORSP_DISDECIDING: 4,
  DESKQIJIAORSP_BETNUMERROR: 5
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_fantirsp = {
  DESKFANTIRSP_SUCCESS: 0,
  DESKFANTIRSP_DESKSTATEERROR: 1,
  DESKFANTIRSP_NOTACTUSER: 2,
  DESKFANTIRSP_BETNUMERROR: 3,
  DESKFANTIRSP_CANNOTALLIN: 4,
  DESKFANTIRSP_DISDECIDING: 5
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_passrsp = {
  DESKPASSRSP_SUCCESS: 0,
  DESKPASSRSP_NOTACTUSER: 1,
  DESKPASSRSP_DESKSTATEERRPR: 2
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_foldrsp = {
  DESKFOLDRSP_SUCCESS: 0,
  DESKFOLDRSP_NOTACTUSER: 1,
  DESKFOLDRSP_DESKSTATEERROR: 2,
  DESKFOLDRSP_DISDECIDING: 3
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_deskendtype = {
  ROUNDENDTYPE_WIN: 0,
  ROUNDENDTYPE_LANGUO: 1
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_reqdisdeskrsp = {
  DESKREQDISDESKRSP_SUCCESS: 0,
  DESKREQDISDESKRSP_STATEERROR: 1,
  DESKREQDISDESKRSP_DISING: 2,
  DESKREQDISDESKRSP_NOTOWNER: 3
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_joinroomrsp = {
  DESKJOINROOMRSP_FAIL: -1,
  DESKJOINROOMRSP_SUCCESS: 0,
  DESSKJOINROOMRSP_DW: 1,
  DESSKJOINROOMRSP_DG: 2
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_kprsp = {
  KPRSP_SUCCESS: 0,
  KPRSP_NOTACTUSER: 1,
  KPRSP_DSERROR: 2,
  KPRSP_BETNUMERROR: 3,
  KPRSP_ONLYKAI: 4
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_joindeskrsp = {
  JOINDESKRSP_USERERROR: 0,
  JOINDESKRSP_NOTINDESK: 1,
  JOINDESKRSP_NODESK: 2,
  JOINDESKRSP_FULL: 3
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_leavedeskrsp = {
  LEAVEDESKTYPE_OFFLINE: 0,
  LEAVEDESKTYPE_LEAVE: 1
};

/**
 * @enum {number}
 */
proto.yjprotogo.tdk_enum_roomtype = {
  TDKROOMFRIEND: 0,
  TDKROOMNORMAL: 1,
  TDKROOMELITE: 2,
  TDKROOMKING: 3
};

goog.object.extend(exports, proto.yjprotogo);
