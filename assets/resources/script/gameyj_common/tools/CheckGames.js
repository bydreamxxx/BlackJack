let GameType = cc.dd.Define.GameType

let CheckGames = {
    isMJ(gameId) {
        return this.isOldMJ(gameId) || this.isNewMJ(gameId);
    },

    isUseNeiMengMJConfig(gameId) {
        return this.isChiFengMJ(gameId) || this.isAoHanMJ(gameId) || this.isWuDanMJ(gameId) || this.isPingZhuangMJ(gameId);
    },

    isOldMJ(gameId){
        return this.isJiLinMJ(gameId) || this.isChangChunMJ(gameId) || this.isNongAnMJ(gameId) || this.isFuXinMJ(gameId) || this.isSongYuanMJ(gameId) || this.isXueZhanMJ(gameId) || this.isXueLiuMJ(gameId) || this.isSuiHuaMJ(gameId) || this.isJinZhouMJ(gameId) || this.isHeiShanMJ(gameId) || this.isTuiDaoHuMJ(gameId) || this.isChiFengMJ(gameId) || this.isAoHanMJ(gameId);
    },

    isNewMJ(gameId){
        return this.isFangZhengMJ(gameId) || this.isWuDanMJ(gameId) || this.isPingZhuangMJ(gameId) || this.isBaiChengMJ(gameId) || this.isAChengMJ(gameId) || this.isHeLongMJ(gameId) || this.isJiSuMJ(gameId);
    },

    isJiLinMJ(gameId) {
        return gameId == GameType.JLMJ_FRIEND || gameId == GameType.JLMJ_GOLD || gameId == GameType.JLMJ_MATCH;
    },

    isChangChunMJ(gameId) {
        return gameId == GameType.CCMJ_FRIEND || gameId == GameType.CCMJ_GOLD || gameId == GameType.CCMJ_MATCH;
    },

    isNongAnMJ(gameId) {
        return gameId == GameType.NAMJ_FRIEND || gameId == GameType.NAMJ_GOLD || gameId == GameType.NAMJ_MATCH;
    },

    isFuXinMJ(gameId) {
        return gameId == GameType.FXMJ_FRIEND || gameId == GameType.FXMJ_GOLD || gameId == GameType.FXMJ_MATCH;
    },

    isSongYuanMJ(gameId) {
        return gameId == GameType.SYMJ_FRIEND || gameId == GameType.SYMJ_GOLD || gameId == GameType.SYMJ_MATCH || gameId == GameType.SYMJ_FRIEND_2;
    },

    isXueZhanMJ(gameId) {
        return gameId == GameType.XZMJ_FRIEND || gameId == GameType.XZMJ_GOLD || gameId == GameType.XZMJ_MATCH;
    },

    isXueLiuMJ(gameId) {
        return gameId == GameType.XLMJ_FRIEND || gameId == GameType.XLMJ_GOLD || gameId == GameType.XLMJ_MATCH;
    },

    isSuiHuaMJ(gameId) {
        return gameId == GameType.SHMJ_FRIEND || gameId == GameType.SHMJ_GOLD || gameId == GameType.SHMJ_MATCH;
    },

    isJinZhouMJ(gameId) {
        return gameId == GameType.JZMJ_FRIEND || gameId == GameType.JZMJ_GOLD || gameId == GameType.JZMJ_MATCH;
    },

    isHeiShanMJ(gameId) {
        return gameId == GameType.HSMJ_FRIEND || gameId == GameType.HSMJ_GOLD || gameId == GameType.HSMJ_MATCH;
    },

    isTuiDaoHuMJ(gameId) {
        return gameId == GameType.TDHMJ_FRIEND || gameId == GameType.TDHMJ_GOLD || gameId == GameType.TDHMJ_MATCH;
    },

    isChiFengMJ(gameId) {
        return gameId == GameType.CFMJ_FRIEND || gameId == GameType.CFMJ_GOLD || gameId == GameType.CFMJ_MATCH;
    },

    isAoHanMJ(gameId) {
        return gameId == GameType.AHMJ_FRIEND || gameId == GameType.AHMJ_GOLD || gameId == GameType.AHMJ_MATCH;
    },

    isFangZhengMJ(gameId) {
        return gameId == GameType.FZMJ_FRIEND || gameId == GameType.FZMJ_GOLD || gameId == GameType.FZMJ_MATCH;
    },

    isWuDanMJ(gameId) {
        return gameId == GameType.WDMJ_FRIEND || gameId == GameType.WDMJ_GOLD || gameId == GameType.WDMJ_MATCH;
    },

    isPingZhuangMJ(gameId) {
        return gameId == GameType.PZMJ_FRIEND || gameId == GameType.PZMJ_GOLD || gameId == GameType.PZMJ_MATCH;
    },

    isBaiChengMJ(gameId) {
        return gameId == GameType.BCMJ_FRIEND || gameId == GameType.BCMJ_GOLD || gameId == GameType.BCMJ_MATCH;
    },

    isAChengMJ(gameId) {
        return gameId == GameType.ACMJ_FRIEND || gameId == GameType.ACMJ_GOLD || gameId == GameType.ACMJ_MATCH;
    },

    isHeLongMJ(gameId) {
        return gameId == GameType.HLMJ_FRIEND || gameId == GameType.HLMJ_GOLD || gameId == GameType.HLMJ_MATCH;
    },

    isJiSuMJ(gameId){
        return gameId == GameType.JSMJ_GOLD;
    }
}

module.exports = CheckGames;