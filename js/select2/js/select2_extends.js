/*
[{"id":"id","text":"text","title","taitou"},{"id":"id1","text":"text1","title","taitou1"},{"id":"id2","text":"text2","title","taitou2"}]
*/
var select2_extends = {
    setedbodyevent: 0,
    uselect: null,
    defaultdata: [],
    width: null,
    outer_id: "selector_div_id",
    selector_id: "selector_id",
    submit_btn_id: "submit_btn_id",
    url: "",
    delay: 50,
    callback: function () { },


	//options:{url:"", width:"", delay:"", callback:function()}
    init: function (obj, options) {

        var thisobj = this;
        thisobj.url = options.url;
        thisobj.delay = options.delay;
        thisobj.width = options.width;
        thisobj.callback = options.callback ? options.callback : function () { };
		obj.addClass("clickTargetClass");
        obj.bind("click",function () {
            thisobj.bindSelect2Event(this);
        });

        thisobj.setBodyEvent();
    },

    save: function () {
        //取id
        var ids = $("#" + this.selector_id).select2("val");
        //取短名,拼接data
        var curdata = "";
        var txtes = "";
        var data = $("#" + this.selector_id).select2('data');
        for (var i = 0; i < data.length; i++) {
            var dataobj = data[i];
            txtes += dataobj.title + ",";
            var dataobjStr = "{";
            curdata += dataobj.id + ",";
            curdata += dataobj.title + ";";
        }
        //取长名
        var txt1 = "";
        for (var i = 0; i < data.length; i++) { txt1 += data[i].text + ","; }

        this.obj.val(txtes.substring(0, txtes.length - 1));
        this.obj.attr("ids", ids);
        this.obj.attr("data", curdata);
        this.obj.removeAttr("disabled");
        this.callback();
        //this.destroy();
    },


    bindSelect2Event: function (_thisobj) {
        var thisobj = this;
        thisobj.destroy();
        thisobj.obj = $(_thisobj);
        //console.log(thisobj.obj);

        //获取默认已经选中的数据
        var curdata = thisobj.obj.attr("data") ? thisobj.obj.attr("data") : "";
        var newjson = [];
        for (var i = 0; i < curdata.split(';').length ; i++) {
            var curdata_i = curdata.split(';')[i];
            if (curdata_i.split(',').length == 2) {
                var o = {};
                o.id = curdata_i.split(',')[0];
                o.title = curdata_i.split(',')[1];
                newjson.push(o);
            }
        }
        thisobj.defaultdata = newjson;

        //拼接页面
        var html = '';
        html += '<div id="' + thisobj.outer_id + '" style="display:none;position:absolute;font-size:12px;z-index:999996" class="clickTargetClass">';
        html += '   <div style="width:100%;height:100%">';
        html += '       <div style="width:100%;float:left;">';
        html += '           <select id="' + thisobj.selector_id + '" class="select-input2" multiple="multiple" tabindex="9999" style="width: 100%; height: 100%">';
        html += '           </select>';
        html += '       </div>';
        //html += '       <div style="text-align:right;">';
        //html += '           <span id="' + this.submit_btn_id + '" style="cursor:pointer;padding: 0px 4px 0 4px;">X</span>';
        //html += '       </div>';
        html += '   </div>';
        html += '</div>';
        $("body").append(html);
        //绑定提交事件
        $("#" + thisobj.submit_btn_id).bind("click", function () {
            thisobj.destroy();
        });
        //控制弹出位置
        var divwidth = 0;
        if (thisobj.width) {
            divwidth = thisobj.obj.outerWidth() + thisobj.width;
        }
        else {
            divwidth = thisobj.obj.outerWidth();
        }

        $("#" + thisobj.outer_id).css("width", divwidth);
        $("#" + thisobj.outer_id).css("left", thisobj.obj.offset().left);
        $("#" + thisobj.outer_id).css("top", thisobj.obj.offset().top);
        $("#" + thisobj.outer_id).show();
        //绑定select2事件
        thisobj.uselect = $('#' + thisobj.selector_id).select2({
            data: thisobj.defaultdata,
            placeholder: "请输入",
            openOnEnter: true,
            templateSelection: function (item) {
                thisobj.setInputEvent();

                return item.title
            },
            minimumInputLength: 0,
            language: {
                errorLoading: function () {
                    return '结果无法显示.';
                },
                inputTooLong: function (args) {
                    var overChars = args.input.length - args.maximum;

                    var message = '请删除' + overChars + '个字符';

                    return message;
                },
                inputTooShort: function (args) {
                    var remainingChars = args.minimum - args.input.length;
                    var message = '请再输入' + remainingChars + '个字符';
                    return message;
                },
                loadingMore: function () {
                    return '加载中…';
                },
                maximumSelected: function (args) {
                    var message = '你最多只能选择' + args.maximum + '项';

                    return message;
                },
                noResults: function () {
                    return '没有找到相关的项目';
                },
                searching: function () {
                    return '搜索中…';
                }
            },
            Search: {
                searchRemoveChoice: function (decorated, item) {
                    this.trigger('unselect', {
                        data: item
                    });

                    this.$search.val(item.title);
                    this.handleSearch();
                }
            },
            ajax: {
                url: thisobj.url,  // 异步请求地址
                dataType: "json",// 数据类型
                delay: thisobj.delay,
                charset: "utf-8",
                minimumInputLength: 1,
                data: function (params) {  // 请求参数（GET）                    
                    return {
                        name: params.term,
                        curids: thisobj.obj.attr("ids")
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };
                },
                escapeMarkup: function (m) { return m; }   // 字符转义处理
            }
        });
        //打开页面聚焦
        thisobj.uselect.select2('focus');
        //绑定事件
        //////1.实时 2.移出关闭
        thisobj.uselect.on("change", function (e) {
            thisobj.save();
        });  // 选中事件
        //绑定默认值
        var selectedids = [];
        for (var i = 0; i < thisobj.defaultdata.length; i++) {
            selectedids.push(thisobj.defaultdata[i].id);
        }
        thisobj.uselect.val(selectedids).trigger('change');

        thisobj.setInputEvent();
    },

    setInputEvent: function () {
        var thisobj = this;
        setTimeout(function () {
            $('.select2-search__field').focus();
            $('.select2-search__field').on("keydown", function (evt) {
                if (evt.keyCode == 13) {
                    var v = $('.select2-search__field').val();
                    if (!v || v.length == 0)
                        thisobj.destroy();
                }
            });
        }, 100);
    },

    setBodyEvent: function () {

        var thisobj = this;
        if (thisobj.setedbodyevent == 1) {
            return;
        }
        this.setedbodyevent = 1;
        $('body').on('click', '*', function () {
            if ($(this).hasClass('clickTargetClass') || $(this).parents('.clickTargetClass').length > 0) {				
                return;
            } else {
                thisobj.destroy();
            }
        });
    },


    destroy: function () {
        $("#" + this.outer_id).slideUp();
        $("#" + this.outer_id).remove();
		
        //$(".select2-container").remove();
        //$(".select2-dropdown").remove();

    }
}

