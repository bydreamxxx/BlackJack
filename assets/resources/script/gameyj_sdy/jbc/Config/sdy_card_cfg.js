
var SdySmallColorCfg = {
    [1]: { frame_name:'hs_4', width:34, height:38 },    //方块
    [2]: { frame_name:'hs_3', width:34, height:38, },   //梅花
    [3]: { frame_name:'hs_1', width:34, height:38, },   //黑桃
    [4]: { frame_name:'hs_2', width:34, height:38, },   //红桃
};

var SdyBigColorCfg = {
    [1]: { frame_name:'hs_4', width:71, height:77, },
    [2]: { frame_name:'hs_3', width:71, height:77, },
    [3]: { frame_name:'hs_1', width:71, height:77, },
    [4]: { frame_name:'hs_2', width:71, height:77, },
};

var SdyBlackValueCfg = {
    [3]:         { frame_name:'pkp_b3',  width:41, height:56 },
    [4]:         { frame_name:'pkp_b4',  width:41, height:56 },
    [5]:         { frame_name:'pkp_b5',  width:41, height:56 },
    [6]:         { frame_name:'pkp_b6',  width:41, height:56 },
    [7]:         { frame_name:'pkp_b7',  width:41, height:56 },
    [8]:         { frame_name:'pkp_b8',  width:41, height:56 },
    [9]:         { frame_name:'pkp_b9',  width:41, height:56 },
    [10]:        { frame_name:'pkp_b10', width:41, height:56 },
    [11]:        { frame_name:'pkp_b11', width:41, height:56 },
    [12]:        { frame_name:'pkp_b12', width:41, height:56 },
    [13]:        { frame_name:'pkp_b13', width:41, height:56 },
    [14]:        { frame_name:'pkp_b14', width:41, height:56 },
    [15]:        { frame_name:'pkp_b16', width:41, height:56 },
};

var SdyRedValueCfg = {
    [3]:         { frame_name:'pkp_r3',  width:41, height:56 },
    [4]:         { frame_name:'pkp_r4',  width:41, height:56 },
    [5]:         { frame_name:'pkp_r5',  width:41, height:56 },
    [6]:         { frame_name:'pkp_r6',  width:41, height:56 },
    [7]:         { frame_name:'pkp_r7',  width:41, height:56 },
    [8]:         { frame_name:'pkp_r8',  width:41, height:56 },
    [9]:         { frame_name:'pkp_r9',  width:41, height:56 },
    [10]:        { frame_name:'pkp_r10', width:41, height:56 },
    [11]:        { frame_name:'pkp_r11', width:41, height:56 },
    [12]:        { frame_name:'pkp_r12', width:41, height:56 },
    [13]:        { frame_name:'pkp_r13', width:41, height:56 },
    [14]:        { frame_name:'pkp_r14', width:41, height:56 },
    [15]:        { frame_name:'pkp_r16', width:41, height:56 },
};

var SdyWangColorCfg = {
  [601]: { frame_name:'pkp_jokerxiao',  width:122, height:167 },
  [602]: { frame_name:'pkp_jokerda',  width:122, height:167 },
};

var SdyWangValueCfg = {
    [601]: { frame_name:'pkp_b17',  width:29, height:164 },
    [602]: { frame_name:'pkp_r17',  width:29, height:164 },
};

var SdyScoreCfg = {
    [5]:  5,
    [10]: 10,
    [13]: 10,
};

//花色排序的值
var SdyColorSortValue = {
    [6]: 100,   //王
    [3]: 4,     //黑桃
    [4]: 3,     //红桃
    [2]: 2,     //梅花
    [1]: 1,     //方片
};


module.exports = {
    SdySmallColorCfg:SdySmallColorCfg,
    SdyBigColorCfg:SdyBigColorCfg,
    SdyBlackValueCfg:SdyBlackValueCfg,
    SdyRedValueCfg:SdyRedValueCfg,
    SdyWangColorCfg:SdyWangColorCfg,
    SdyWangValueCfg:SdyWangValueCfg,
    SdyScoreCfg:SdyScoreCfg,
    SdyColorSortValue:SdyColorSortValue,
};