//create by wj 2018/06/04
var ArrayCtrl = cc.Class({
    ctor: function(){
        this.m_itemTemp = null;
        this.m_nCol = 1;
        this.m_nRow = -1;
        this.m_nShowCount = 0;
        this.m_creatFunc = function(pUI){return pUI;};
        this.m_uiList = [];
        this.m_firstPos = cc.v2(0, 0);
        this.m_uiNode = null;
    },

    Clear: function(){
        for(var k = 0; k < this.m_uiList.length; k++)
            this.m_uiList[k].removeFromParent();
        this.m_uiList.splice(0, this.m_uiList.length);
    },

    InitWithNode: function(nCol, nRow, uiNode){
        var firtChild = uiNode.getChildByName("first");
        var rightChild = uiNode.getChildByName("right");
        var downChild = uiNode.getChildByName("down");

        var firstPos = cc.v2(firtChild.position);
        var offset = cc.v2(0, 0);
        if(rightChild)
            offset.x = rightChild.x - firstPos.x;
        if(downChild)
            offset.y = downChild.y - firstPos.y;
        
        this.Init(uiNode, offset, firtChild, nCol, nRow, firstPos);

        this.m_itemTemp.setPosition(cc.v2(0, 0));

        this.m_itemTemp.active = false;
        var children = uiNode.children;

        var bFind = false;

        for(var k = 0; k < children.length; k++){
            var v = children[k];
            if(!cc.dd.Utils.isNull(v)){
                if(v.name != 'first' || bFind)
                    v.removeFromParent();
                else
                    bFind = true;
            }
        }

    },

    Init: function(uiNode, offset, itemTemp, nCol, nRow, firstPos){
        this.m_uiNode = uiNode;
        this.m_nCol = nCol;
        this.m_nRow = nRow;
        this.m_offset = offset;
        this.m_firstPos = firstPos;
        this.m_itemTemp = itemTemp;
    },

    size: function(){
        return this.m_uiList.length;
    },

    showCount: function(){
        return this.m_nShowCount
    },

    Div: function(A, B){
        if(B > 0)
            return Math.floor(A / B);
        else
            return 0;
    },

    Mod: function(A, B){
        if(B > 0)
            return A % B;
        else
            return 0;
    },

    resize: function(_Newsize){
        var oldSize = this.size();
        if(_Newsize <= oldSize)
            return;
        if(this.m_nRow > 0 && this.m_nCol > 0){
            var pageItemCount = this.m_nCol * this.m_nRow;
            var pageWidth = 0;
            var page = this.m_uiNode.parent;

            pageWidth = this.m_offset.x * this.m_nCol;

            for(var i = oldSize; i < _Newsize; i++){
                var pChild = cc.instantiate(this.m_itemTemp);
                pChild.active = true;
                var pItem = this.m_creatFunc(pChild);

                var pageIndex = this.Div(i, pageItemCount);
                var itemIndex = this.Mod(i, pageItemCount);

                var x = this.Mod(itemIndex, this.m_nCol);
                var y = this.Div(itemIndex, this.m_nCol);
                var tmpPt = cc.v2(this.m_firstPos.x + pageIndex * pageWidth + this.m_offset.x * x, this.m_firstPos.y + this.m_offset.y * y);
                pItem.setPosition(tmpPt);
                this.m_uiNode.addChild(pItem);
                this.m_uiList[i] = pItem;
            }
        }else{
            for(var i = oldSize; i < _Newsize; i++){
                var pChild = cc.instantiate(this.m_itemTemp);
                pChild.active = true;
                var pItem = this.m_creatFunc(pChild);

                var x = i;
                var y = 0;
                if(this.m_nCol > 0){
                    x = this.Mod(i, this.m_nCol);
                    y = this.Div(i, this.m_nCol);
                }
                var tmpPt = cc.v2(this.m_firstPos.x + this.m_offset.x * x, this.m_firstPos.y + this.m_offset.y * y);
                pItem.setPosition(tmpPt);
                this.m_uiNode.addChild(pItem);
                this.m_uiList[i] = pItem;
            }
        }
    },

    at: function(_pos){
        return this.m_uiList[_pos];
    },

    updateItemEx: function(arrData, uFunc){
        this.m_nShowCount = arrData.length;
        this.resize(this.m_nShowCount);

        var i = 0;
        for(var key = 0; key < arrData.length; key++){
            var uiItem = this.m_uiList[i];
            uiItem.active = true;
            uFunc(arrData[key], uiItem, i, key);
            i += 1;
        }

        for(i = this.m_nShowCount; i  < this.size(); i++){
            var uiItem = this.m_uiList[i];
            uiItem.active = false;
        }
    },

    CreateArrayCtrl: function(nCol, nRow, uiNode){
        this.InitWithNode(nCol, nRow, uiNode);
    },
});

module.exports = {
    ArrayCtrl : ArrayCtrl,
};
