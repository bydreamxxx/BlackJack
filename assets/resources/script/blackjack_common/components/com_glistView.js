
let isSimilarEqualWithNumber = function (a, b) {
    if (Math.abs(a - b) < 0.005) {
        return true;
    }
    return false
}

cc.Class({
    extends: cc.Component,
    properties: {
        itemTemplate:
            {
                default: null,
                type: cc.Node
            }
    },
    // use this for initialization
    onLoad: function () {
        this.direction = this.node.getComponent("cc.ScrollView").horizontal ? 1 : 0;
        this.contentView = cc.find("view/content", this.node);
        // this.contentView.anchorY = 1;
        // this.contentView.anchorX = 0;
        // this.contentView.x = -this.node.width/2;
        // this.contentView.y = this.node.height/2;

        this._needUpdate = true; // 判断是否要调用update函数

        this._dataprovider = null;
        this._offset = null;

        this.itemList = [];

        this.itemTemplate.active = false;

        // 测试 begin 
        // let list = [];
        // let k = 13;
        // while(k>0)
        // {
        //     list.push(k);
        //     k--;
        // }
        // this.setDataProvider( list ,0);
        // 测试 end 
    },
    /**
    * 设置数据源
    * firstShowIndex  第一个显示的索引
    **/
    setDataProvider: function (list, firstShowIndex, eachFunc) {
        this.eachFunc = eachFunc;
        this.itemList.forEach(function (element) { element.parent = null; });

        this.itemList = [];

        if (list == null || list.length < 1) {
            this.contentView.width = this.node.width;
            this.contentView.height = this.node.height;
            this._needUpdate = false;
            return;
        }
        else {
            this._needUpdate = true;
        }
        let contentWidth = this.itemTemplate.width;
        let contentHeight = this.itemTemplate.height;
        let itemNum = 0;
        if (this.direction === 0) {
            contentHeight = list.length * contentHeight;
            if (contentHeight < this.node.height) {
                contentHeight = this.node.height;
                this._needUpdate = false;
                itemNum = list.length;
            } else {
                itemNum = Math.ceil(this.node.height / this.itemTemplate.height) + 2;
            }
        } else {
            contentWidth = list.length * contentWidth;
            if (contentWidth < this.node.width) {
                contentWidth = this.node.width;
                this._needUpdate = false;
                itemNum = list.length;
            } else {
                itemNum = Math.ceil(this.node.width / this.itemTemplate.width) + 2;
            }
        }
        itemNum = itemNum > list.length ? list.length : itemNum;
        this.contentView.width = contentWidth;
        this.contentView.height = contentHeight;

        this._dataprovider = [];
        list.forEach(function (data, index) {
            let obj = {};
            obj.data = data;
            if (this.direction === 0) {
                obj.x = this.itemTemplate.x;
                obj.y = -this.itemTemplate.height * index;
            } else {
                obj.x = this.itemTemplate.width * index;
                obj.y = this.itemTemplate.y;
            }
            this._dataprovider.push(obj);
        }.bind(this));
        // 预先创建多个可用的ItemRenderer
        // cc.log(`创建${itemNum}个ItemRenderer`);
        // cc.log(`dataprovider `,this._dataprovider)
        while (itemNum > 0) {
            let itemRenderer = cc.instantiate(this.itemTemplate);
            itemRenderer.parent = this.contentView;
            itemRenderer.active = true;
            this.itemList.push(itemRenderer);
            --itemNum;
        }
        itemNum = this.itemList.length;

        firstShowIndex = firstShowIndex || 0;
        if (firstShowIndex > (this._dataprovider.length - itemNum)) {
            firstShowIndex = this._dataprovider.length - itemNum - 1;
        }
        if (!this._needUpdate) {
            firstShowIndex = 0;
        }
        for (let i = 0; i < itemNum; i++) {
            this.itemList[i].x = this._dataprovider[i + firstShowIndex].x;
            this.itemList[i].y = this._dataprovider[i + firstShowIndex].y;
            this.setItemData(this.itemList[i], i + firstShowIndex);
            // cc.log("this.itemList.x" + i,this.itemList[i].x )
        }
        // let contentPos = this.node.getComponent("cc.ScrollView").getContentPosition();
        // if (this.direction === 0) {
        //     contentPos.y = this.node.height / 2 + firstShowIndex * this.itemTemplate.height;
        //     this.node.getComponent("cc.ScrollView").setContentPosition(contentPos)
        // } else {
        //     contentPos.x = -this.node.width / 2 - firstShowIndex * this.itemTemplate.width;
        //     this.node.getComponent("cc.ScrollView").setContentPosition(contentPos)
        // }
        this._offset = this.node.getComponent("cc.ScrollView").getScrollOffset();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this._needUpdate) { return; }

        let offset = this.node.getComponent("cc.ScrollView").getScrollOffset();
        let num = this.itemList.length;
        if (this.direction === 0) {
            if (offset.y < 0) {
                return;
            }
            // cc.log("offset",offset);
            if (this._offset == null)
                return;

            let _dOffsety = offset.y - this._offset.y;
            if (_dOffsety > 0) {
                let itemNode = this.itemList[0];
                let _y = itemNode.y + offset.y;
                if (_y > itemNode.height * 2) {
                    // 只移动最上层的itemNode
                    itemNode.y = this.itemList[num - 1].y - itemNode.height;
                    this.itemList.shift();
                    this.itemList.push(itemNode);
                    this.setItemData(itemNode, itemNode["$index"] + num);
                }
            } else if (_dOffsety < 0) {
                let itemNode = this.itemList[num - 1];
                let _dy = -itemNode.y - (this.node.height + offset.y);
                if (_dy > itemNode.height) {
                    itemNode.y = this.itemList[0].y + itemNode.height;
                    this.itemList.pop();
                    this.itemList.unshift(itemNode);
                    this.setItemData(itemNode, itemNode["$index"] - num);
                }
            }
        } else {
            if (offset.x > 0) {
                return;
            }
            // cc.log("offset",offset.x)
            if (this._offset.x > offset.x) // 向左滚动
            {
                let itemNode = this.itemList[0];
                let _x = itemNode.x + offset.x;
                // cc.log("向左滚动",_x)
                if (_x < -itemNode.width * 2) {
                    itemNode.x = this.itemList[num - 1].x + itemNode.width;
                    this.itemList.shift()
                    this.itemList.push(itemNode);
                    this.setItemData(itemNode, itemNode["$index"] + num);
                }
            } else if (this._offset.x < offset.x) // 向右滚动
            {
                let itemNode = this.itemList[num - 1];
                let _x = itemNode.x + offset.x;
                // cc.log("向右滚动",_x)
                if (_x > (this.node.width + itemNode.width)) {
                    itemNode.x = this.itemList[0].x - itemNode.width
                    this.itemList.pop();
                    this.itemList.unshift(itemNode);
                    this.setItemData(itemNode, itemNode["$index"] - num)
                }
            }
        }
        this._offset = offset;
    },
    onDestroy: function () {
        this.itemList = null;
        this._dataprovider = null;
        this._offset = null;
        this.contentView = null;

    },
    // 扩展该方法
    setItemData: function (itemNode, index) {
        itemNode["$index"] = index;
        itemNode.active = (index >= 0 && index < this._dataprovider.length);

        this.eachFunc(itemNode, index);
        //itemNode.getComponentInChildren("cc.Label").string = "h-" + index;
        // cc.log(`itemNode["$index"] ${index}`);
    },

    getCurFirstIndex: function () {
        return this.itemList[0].index;
    }
});
