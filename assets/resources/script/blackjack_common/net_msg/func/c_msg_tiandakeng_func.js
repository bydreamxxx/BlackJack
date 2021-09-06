
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [3600]:{ package_name:'msg', msg_name:'TdkCDeskUserData', name:msg.TdkCDeskUserData, func:handler.on_TdkCDeskUserData, func_name:'on_TdkCDeskUserData', logtag:'[3600:TdkCDeskUserData ]' },
        [3601]:{ package_name:'msg', msg_name:'TdkJoinPlayingDeskRsp', name:msg.TdkJoinPlayingDeskRsp, func:handler.on_TdkJoinPlayingDeskRsp, func_name:'on_TdkJoinPlayingDeskRsp', logtag:'[3601:TdkJoinPlayingDeskRsp ]' },
        [3602]:{ package_name:'msg', msg_name:'TdkTuoGuan', name:msg.TdkTuoGuan, func:handler.on_TdkTuoGuan, func_name:'on_TdkTuoGuan', logtag:'[3602:TdkTuoGuan ]' },
        [3603]:{ package_name:'msg', msg_name:'TdkTuoGuanRsp', name:msg.TdkTuoGuanRsp, func:handler.on_TdkTuoGuanRsp, func_name:'on_TdkTuoGuanRsp', logtag:'[3603:TdkTuoGuanRsp ]' },
        [3604]:{ package_name:'msg', msg_name:'TdkCBet', name:msg.TdkCBet, func:handler.on_TdkCBet, func_name:'on_TdkCBet', logtag:'[3604:TdkCBet ]' },
        [3605]:{ package_name:'msg', msg_name:'TdkCBetRsp', name:msg.TdkCBetRsp, func:handler.on_TdkCBetRsp, func_name:'on_TdkCBetRsp', logtag:'[3605:TdkCBetRsp]' },
        [3606]:{ package_name:'msg', msg_name:'TdkCPoker', name:msg.TdkCPoker, func:handler.on_TdkCPoker, func_name:'on_TdkCPoker', logtag:'[3606:TdkCPoker ]' },
        [3607]:{ package_name:'msg', msg_name:'TdkCHidePoker', name:msg.TdkCHidePoker, func:handler.on_TdkCHidePoker, func_name:'on_TdkCHidePoker', logtag:'[3607:TdkCHidePoker ]' },
        [3608]:{ package_name:'msg', msg_name:'TdkCSendPoker', name:msg.TdkCSendPoker, func:handler.on_TdkCSendPoker, func_name:'on_TdkCSendPoker', logtag:'[3608:TdkCSendPoker ]' },
        [3609]:{ package_name:'msg', msg_name:'TdkCOpenPoker', name:msg.TdkCOpenPoker, func:handler.on_TdkCOpenPoker, func_name:'on_TdkCOpenPoker', logtag:'[3609:TdkCOpenPoker ]' },
        [3610]:{ package_name:'msg', msg_name:'TdkCDeskState', name:msg.TdkCDeskState, func:handler.on_TdkCDeskState, func_name:'on_TdkCDeskState', logtag:'[3610:TdkCDeskState ]' },
        [3611]:{ package_name:'msg', msg_name:'TdkCRoundEnd', name:msg.TdkCRoundEnd, func:handler.on_TdkCRoundEnd, func_name:'on_TdkCRoundEnd', logtag:'[3611:TdkCRoundEnd ]' },
        [3612]:{ package_name:'msg', msg_name:'TdkPlayerFinalResult', name:msg.TdkPlayerFinalResult, func:handler.on_TdkPlayerFinalResult, func_name:'on_TdkPlayerFinalResult', logtag:'[3612:TdkPlayerFinalResult]' },
        [3613]:{ package_name:'msg', msg_name:'TdkFinalResult', name:msg.TdkFinalResult, func:handler.on_TdkFinalResult, func_name:'on_TdkFinalResult', logtag:'[3613:TdkFinalResult]' },
        [3614]:{ package_name:'msg', msg_name:'TdkKanPaiReq', name:msg.TdkKanPaiReq, func:handler.on_TdkKanPaiReq, func_name:'on_TdkKanPaiReq', logtag:'[3614:TdkKanPaiReq ]' },
        [3615]:{ package_name:'msg', msg_name:'TdkKanPaiRsp', name:msg.TdkKanPaiRsp, func:handler.on_TdkKanPaiRsp, func_name:'on_TdkKanPaiRsp', logtag:'[3615:TdkKanPaiRsp ]' },
        [3616]:{ package_name:'msg', msg_name:'TdkWaitNotify', name:msg.TdkWaitNotify, func:handler.on_TdkWaitNotify, func_name:'on_TdkWaitNotify', logtag:'[3616:TdkWaitNotify ]' },

    };
    module.exports = {
        name:"c_msg_tiandakeng_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
