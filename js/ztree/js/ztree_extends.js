function ztree_extends() {
    this.obj = null,
    this.showsearchchild = false,
    this.callback = function () { },
    this.clearcallback = function () { },
    this.width = 180,
    this.height = 400,
    this.zNodes = [],
    this.setting = {
        //check: { enable: true, chkStyle: "checkbox", radioType: "level" },
        view: {
            selectedMulti: false, //是否允许多选
            showIcon: false,
            fontCss: function (treeId, treeNode) { }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function () { }
        }
    }
    ,
    this.init = function (_obj, options) {
		
        var thisobj = this;
        $("#ztree_extends_menuContent").remove();
        var html = "";
        html += '<div id="ztree_extends_menuContent" class="ztree_extends_menuContent" style="display: none; position: absolute;border:1px solid black;max-height:' + thisobj.height + 'px;overflow-x:hidden;overflow-y:auto;;background-color:#FFF;z-index:999996">';
        html += '</div>';
        $("body").append(html);
        _obj.bind("keyup",function () { thisobj.showztree(_obj,options, 0); });
        _obj.bind("focus",function () { thisobj.showztree(_obj,options, 1); });
    },

    this.showztree = function (_obj, options, type) {
		
        var ztreeobj = new ztree_extends();
        ztreeobj.zNodes = options.data;
        ztreeobj.showsearchchild = options.showsearchchild;
        ztreeobj.callback = options.callback ? options.callback : function () { };
        ztreeobj.clearcallback = options.clearcallback ? options.clearcallback : function () { };
		ztreeobj.width=options.width?options.width:180;
		ztreeobj.height=options.height?options.height:400;
        ztreeobj.obj = $(_obj);
        ztreeobj.obj.addClass("tag");
        ztreeobj.showMenu();
    },



    //显示树
    this.showMenu = function () {
        var thisobj = this;
        thisobj.onBodyDown();
        $("#ztree_extends_tree").remove();

        var html = "";
        var ui_width = thisobj.width;
        if (!thisobj.width) ui_width = thisobj.obj.outerWidth() - 12;
        html += '    <ul id="ztree_extends_tree" class="ztree" style="min-width:' + ui_width + 'px; overflow:auto;"></ul>';
        $("#ztree_extends_menuContent").append(html);

        thisobj.setting.callback.onClick = function (e, treeId, treeNode) {
            thisobj.onClickF(e, treeId, treeNode);
        }
        thisobj.setting.view.fontCss = function (treeId, treeNode) {
            if (treeNode.chkDisabled)
                return { color: "gray", "text-decoration": "none", cursor: "default" };

            return { color: "black" };
        };

        //还原zTree的初始数据
        $.fn.zTree.init($("#ztree_extends_tree"), thisobj.setting, thisobj.zNodes);
        var zTree = $.fn.zTree.getZTreeObj("ztree_extends_tree");
        var key = thisobj.obj.val();
        //if (key) {
        var nodes = zTree.getNodes();

        var nodeList = thisobj.getNodesByParamFuzzy(nodes, "name", key);

        if (nodeList.length == 0) {
            nodeList.push({ id: "0", pId: "0", name: "找不到对应的信息", open: false, chkDisabled: true });
        }
        $.fn.zTree.init($("#ztree_extends_tree"), thisobj.setting, nodeList);

        //}
        var cityOffset = thisobj.obj.offset();
        $("#ztree_extends_menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + thisobj.obj.outerHeight() + "px" }).slideDown("fast");

        //添加清空按钮
        $("#ztree_extends_clear").unbind("click");
        $("#ztree_extends_clear").remove();
        var clearObj = $('<div class="ztree_extends_menuContent" id="ztree_extends_clear" style="position: absolute; top:' + cityOffset.top + 'px;left:' + (cityOffset.left + thisobj.obj.outerWidth() - 15) + 'px;color:red;cursor: pointer;font-size:15px;">x</div>');
        $("body").append(clearObj);
        clearObj.bind("click", function () {
            var callbackresult = thisobj.clearcallback();
            callbackresult = (callbackresult == null || callbackresult == undefined || callbackresult == true) ? true : false;
            if (callbackresult) {
                thisobj.setvalue();//清空
                thisobj.obj.focus();
                //$(this).remove();
                //thisobj.hideMenu(false);
            }
        });
    },

    this.getNodesByParamFuzzy = function (nodes, key, value) {
        var thisobj = this;
        if (!nodes || !key) return [];
        result = [];
        value = value.toLowerCase();
        for (var i = 0, l = nodes.length; i < l; i++) {
            var pnode = nodes[i];
            var childrenNodes = pnode.children;
            var parentSelected = false;
            if (typeof pnode[key] == "string" && pnode[key].toLowerCase().indexOf(value) > -1) {
                if (!thisobj.showsearchchild) {
                    pnode.children = null;
                }
                parentSelected = true;
                result.push(pnode);

            }
            if (!thisobj.showsearchchild) {
                result = result.concat(thisobj.getNodesByParamFuzzy(childrenNodes, key, value));
            }
            else if (!parentSelected) {
                result = result.concat(thisobj.getNodesByParamFuzzy(childrenNodes, key, value));
            }
        }
        //console.log(result);
        return result;
    },
    //隐藏树
    this.hideMenu = function (ischeck) {
        $("#ztree_extends_menuContent").fadeOut("fast");
        $("#ztree_extends_menuContent").hide();

        var thisobj = this;

        if (!thisobj.zNodes) return;

        var new_nodes = [{}];

        for (var attrName in thisobj.zNodes[0]) {
            var attrVal = thisobj.obj.attr("p_" + attrName);
            new_nodes[0][attrName] = attrVal ? attrVal : "";
        }
        thisobj.setvalue(new_nodes);
        thisobj = null;

        $("#ztree_extends_clear").remove();
    },

    this.onClickF = function (e, treeId, treeNode) {
        var thisobj = this;
        if (treeNode.chkDisabled) {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("ztree_extends_tree");
        //获得选中的节点
        var nodes = zTree.getSelectedNodes();
        //根据id排序
        nodes.sort(function compare(a, b) { return a.id - b.id; });

        //隐藏zTree
        thisobj.hideMenu(true);
        $("#ztree_extends_clear").remove();

        var callbackresult = false;
        if (thisobj.callback) callbackresult = thisobj.callback(nodes, this.obj);
        callbackresult = (callbackresult == null || callbackresult == undefined || callbackresult == true) ? true : false;
        if (callbackresult) {
            thisobj.setvalue(nodes);
        }
        return false;
    },

    this.setvalue = function (nodes) {
        nodes = nodes ? nodes : [{}];
        var thisobj = this;
        for (var attrName in thisobj.zNodes[0]) {
            var attrStr = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                var attrVal = nodes[i][attrName];
                attrStr += (attrVal ? attrVal : "") + ",";
            }
            if (attrStr.length > 0) attrStr = attrStr.substring(0, attrStr.length - 1);
            thisobj.obj.attr("p_" + attrName, attrStr);
            if (attrName == "name") {
                thisobj.obj.val(attrStr);
            }
        }
    },

    this.setedbodyevent = 0,
    this.onBodyDown = function () {
        var thisobj = this;
        if (ztree_extends.prototype.setedbodyevent == 1) {
            return;
        }
        ztree_extends.prototype.setedbodyevent = 1;
        $('body').on('mousedown', '*', function (event) {
            if ($(this).hasClass('ztree_extends_menuContent') || $(this).hasClass('tag') || $(this).parents('.ztree_extends_menuContent').length > 0) {

            } else {
                thisobj.hideMenu(false);
            }
            event.stopPropagation();
        });
    }
}