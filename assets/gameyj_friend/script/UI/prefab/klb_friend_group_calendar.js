var hall_audio_mgr = require('hall_audio_mgr').Instance();

const WEEKDAYS = [
    '周日',
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六'
]

cc.Class({
    extends: cc.Component,

    properties: {
        year: cc.Label,
        month: cc.Label,
        days: [cc.Toggle],
        daysLabel: [cc.Label],

        calendar: cc.Label,

        NOT_THIS_MONTH: cc.Color,
        THIS_MONTH: cc.Color,
        CHOOSE_DAY: cc.Color,

        prevYear: cc.Node,
        nextYear: cc.Node,

        prevMonth: cc.Node,
        nextMonth: cc.Node,

        layout: cc.Layout,
    },

    onLoad(){
        this.layout.spacingY = 18;

        for(let i = 0; i < this.days.length; i++){
            this.days[i].node.on('click', this.onClickToggle.bind(this), this);
            if(i > 34){
                this.days[i].node.active = false;
            }
        }

        this.layout.updateLayout();
    },

    show(date, endFunc){
        this.endFunc = endFunc;

        this.myDays = date;

        this.currentYear = this.myDays.getFullYear();
        this.currentMonth = this.myDays.getMonth() + 1;

        this.realDate = new Date();
        this.realYear = this.realDate.getFullYear();
        this.realMonth = this.realDate.getMonth() + 1;

        this.calendar.string = this.myDays.format("yyyy年MM月dd日") + "  " + WEEKDAYS[this.myDays.getDay()];

        this.setCalendarUI();
    },

    /**
     * 设置toggle激活状态
     * @param toggle
     * @param enable
     */
    setEnableToggle: function (toggle, enable) {
        // 按钮颜色
        if (this.isEnableToggle(toggle) !== enable) {
            toggle.interactable = enable;
            // toggle.enableAutoGrayEffect = !toggle.enableAutoGrayEffect;
        }

        // 文字颜色
        var color = null;
        if (enable) {
            if (this.isCheckedToggle(toggle)) {
                color = this.CHOOSE_DAY;
            } else {
                color = this.THIS_MONTH;
            }
        } else {
            color = this.NOT_THIS_MONTH;
        }
        this.setToggleColor(toggle, color);
    },

    /**
     * toggle是否激活
     * @param toggle
     */
    isEnableToggle: function (toggle) {
        return toggle.interactable;
    },

    /**
     * 初始化toggle文字颜色
     * @param target {array | toggle}
     */
    initToggleColor: function (target) {
        if (typeof (target) == "object") {
            if (target instanceof Array) {
                for (var i = 0; i < target.length; ++i) {
                    var toggle = target[i];
                    this.initToggleColor(toggle);
                }
            } else {
                if (this.isEnableToggle(target)) {
                    this.setToggleColor(target, this.THIS_MONTH);
                }else{
                    this.setToggleColor(target, this.NOT_THIS_MONTH);
                }
            }
        }
    },

    /**
     * 设置toggle颜色
     * @param toggle
     * @param color
     */
    setToggleColor: function (toggle, color) {
        toggle.node.getChildByName("day").color = color;
    },

    /**
     * 设置toggle选中状态
     * @param toggle
     * @param checked
     */
    setCheckedToggle: function (toggle, checked) {
        if (this.isCheckedToggle(toggle) !== checked) {
            if (checked) {
                toggle.check();
            } else {
                toggle.uncheck();
            }
        }
        if (checked) {
            this.setToggleColor(toggle, this.CHOOSE_DAY);
        } else {
            this.setToggleColor(toggle, this.THIS_MONTH);
        }
    },

    /**
     * toggle是否选中
     * @param toggle
     */
    isCheckedToggle: function (toggle) {
        return toggle.isChecked;
    },

    /**
     * 关闭界面
     */
    onclose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickPrev(event, customEventData){
        if(customEventData == 'year'){
            this.currentYear--;
            if(this.currentYear <= 2019){
                this.currentYear = 2019;
            }
        }else{
            this.currentMonth--;

            if(this.currentMonth <= 0){
                this.currentYear--;
                if(this.currentYear <= 2019){
                    this.currentYear = 2019
                }

                this.currentMonth = 12;
            }
        }

        this.setCalendarUI();
    },

    onClickNext(event, customEventData){
        if(customEventData == 'year'){
            this.currentYear++;
            if(this.currentYear >= this.realYear){
                this.currentYear = this.realYear;

                if(this.currentMonth >= this.realMonth){
                    this.currentMonth = this.realMonth
                }
            }
        }else{
            this.currentMonth++;

            if(this.currentMonth > 12){
                this.currentYear++;
                if(this.currentYear >= this.realYear){
                    this.currentYear = this.realYear;
                }

                this.currentMonth = 1;
            }
        }

        this.setCalendarUI();
    },

    onClickDays(event, customEventData){
        if(event.isChecked){
            this.initToggleColor(this.days);
            this.setToggleColor(event, this.CHOOSE_DAY);

            let chooseDate = new Date(this.currentYear, this.currentMonth - 1, event.tagname)
            this.calendar.string = chooseDate.format("yyyy年MM月dd日") + "  " + WEEKDAYS[chooseDate.getDay()];
        }
    },

    onClickToggle(event){
        hall_audio_mgr.com_btn_click();
        if(this.endFunc){
            this.endFunc(new Date(this.currentYear, this.currentMonth - 1, event.detail.tagname));
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    getMonthDays(month, year){
        if(month < 1){
            month = 12;
            year--;
        }else if(month > 12){
            month = 1;
            year++;
        }
        switch(month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 2:
                if(year % 4 == 0){
                    return 29;
                }else{
                    return 28;
                }
            default:
                return 30;
        }
    },

    checkButtonState(){
        if(this.currentYear < this.realYear){
            this.nextMonth.active = true;
        }else if(this.currentYear == this.realYear){
            this.nextMonth.active = this.currentMonth < this.realMonth;
        }else{
            this.nextMonth.active = false;
        }
        this.prevMonth.active = !(this.currentYear == 2019 && this.currentMonth == 1);

        this.nextYear.active = this.currentYear < this.realYear;
        this.prevYear.active = this.currentYear > 2019;
    },

    setCalendarUI(){
        this.checkButtonState();

        this.year.string = this.currentYear + '年';
        this.month.string = this.currentMonth + '月';

        // this.initToggleColor(this.days);

        //获取每个月第一天是星期几
        let firstWeekDay = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
        let lastMonthDays = this.getMonthDays(this.currentMonth - 1, this.currentYear);
        let monthDays = this.getMonthDays(this.currentMonth, this.currentYear);

        let sixrow = false;
        for(let i = 0; i < this.days.length; i++){
            this.setCheckedToggle(this.days[i], false);

            if(i < firstWeekDay){
                this.setEnableToggle(this.days[i], false);
                this.daysLabel[i].string = String(lastMonthDays - firstWeekDay + 1 + i);
                this.days[i].tagname = lastMonthDays - firstWeekDay + 1 + i;
            }else if(i > firstWeekDay - 1 + monthDays){
                this.setEnableToggle(this.days[i], false);
                this.daysLabel[i].string = String(i - firstWeekDay + 1 - monthDays);
                this.days[i].tagname = i - firstWeekDay + 1 - monthDays;
            }else{
                this.setEnableToggle(this.days[i], true);
                this.daysLabel[i].string = String(i - firstWeekDay + 1);
                this.days[i].tagname = i - firstWeekDay + 1;

                if(this.myDays.getDate() == i - firstWeekDay + 1 && this.myDays.getFullYear() == this.currentYear && this.myDays.getMonth() + 1 == this.currentMonth){
                    this.setCheckedToggle(this.days[i], true);
                }

                if(i > 34){
                    sixrow = true;
                }
            }
        }

        if(sixrow){
            this.layout.spacingY = 7;
        }else{
            this.layout.spacingY = 18;
        }

        for(let i = 35; i < this.days.length; i++){
            this.days[i].node.active = sixrow;
        }

        this.layout.updateLayout();
    }
});
