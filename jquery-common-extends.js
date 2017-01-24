/*依赖js css
	<script type="text/javascript" src="js/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="js/easyui/jquery.easyui.min.js"></script>
    <link href="js/easyui/themes/icon.css" rel="stylesheet"/>
    <link href="js/easyui/themes/color.css" rel="stylesheet"/>
    <link href="js/easyui/themes/gray/easyui.css" rel="stylesheet"/>
*/
(function($, undef){
	function _alert(message,type){
		//layer.alert(message, {icon: 6});	
		_msg("",message,type);
	}
	function _msg(title,message,type){
		var typeStr = null;
		switch(type){
			case 1:typeStr="error";break;
			case 2:typeStr="info";break;
			case 3:typeStr="question";break;
			case 4:typeStr="warning";break;			
		}		
		$.messager.alert("",message,typeStr);
	}
	function _error(message)	{
		//layer.alert(message, {icon: 5});	
		_msg("错误提醒",message,1);
	}
	function _confirm(msg,title,fun){
		$.messager.confirm(title,msg,fun);//function(r){if(r){alert();}}
	}
	function _loading(message){
		message=message||"正在处理，请稍候...";
		 $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height(),"z-index":999998}).appendTo("body");   
		$("<div class=\"datagrid-mask-msg\"></div>").html(message).appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2,"z-index":999999});   
	}
	function _loadend(){
		$(".datagrid-mask").remove();   
		$(".datagrid-mask-msg").remove();        
	}
	function _dialog(_title,_url,_width){
        if(!_width)_width=300;
        var dlg = $('#dlg');
        if(dlg){
            dlg.remove();
            $("<div id='dlg'></div>").appendTo($("body"));
        }

        $('#dlg').dialog({
            title: _title,
            iconCls:"icon-edit",
            minWidth:_width,
            align : 'center',
             top: ($(document).scrollTop() + $(window).height()  / 4),
            modal: true,
            href: _url,
			zIndex:999997,
            onClose: function () {
                _main.closedialog();
            },
        });
        $('#dlg').show();
    }
    function _closedialog() {
        $("#dlg").dialog('destroy');
        $("#dlg").remove();
    }
	/*<script type="text/javascript" src="js/confrim2.js"></script>*/
	function _confirm2(msg){
		$.Confirm2.show({
                                message:'确认该PR单办理完结?完结后该PR单将不能再使用。',
                                yes: function () {
									$.alert("abc");
                                    $.Confirm2.close();
                                },
                                no: function () { $.Confirm2.close() }
                            });	
	}
	
	function _clearMoney(num) {
        if (num == "0" || num == "0.00") return "";
        return num.replace(/\,|[a-z]|[A-Z]/g, "");
    }
    function _outputMoney(num, isNum, hasPoint) {
        if (isNum) {
            var point = num.indexOf(".");
            if (point > -1) {
                return num.substring(0, point) + "";
            }
        }

        num = num.replace(/\,|[a-z]|[A-Z]/g, "");

        if (isNaN(num) || num == "") {
            return "";
        }
        num = Math.round(num * 100) / 100;
        if (num < 0) {
            return "-" + _outputDollars((Math.floor(Math.abs(num) - 0) + ''), hasPoint) + _outputCents(Math.abs(num) - 0);
        } else {
            return _outputDollars((Math.floor(num - 0) + ''), hasPoint) + _outputCents(num - 0);
        }
    }
    function _outputDollars(num, hasPoint) {
        if (num.length <= 3) {
            return num == "" ? "0" : num;
        } else {
            var mod = num.length % 3;
            var output = mod == 0 ? "" : (num.substring(0, mod));
            for (var i = 0; i < Math.floor(num.length / 3) ; i++) {
                if (mod == 0 && i == 0) {
                    output += num.substring((mod + 3 * i), (mod + 3 * i + 3));
                } else {
                    output += (hasPoint ? "," : "") + num.substring((mod + 3 * i), (mod + 3 * i + 3));
                }
            }
            return output;
        }
    }
    function _outputCents(amount) {
        amount = Math.round((amount - Math.floor(amount)) * 100);
        return amount < 10 ? ".0" + amount : ("." + amount);
    }
	
	
	function _formatDate(date,fmt) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
	$.extend(
		{
			alert:_alert,
			error:_error,
			confirm:_confirm,
			loading:_loading,
			loadend:_loadend,
			dialog:_dialog,
			closedialog:_closedialog,
			confirm2:_confirm2,
			formatMoney:_outputMoney,
			formatDate:_formatDate
		}
	);
	
	/*<script type="text/javascript" src="js/jquery-easyui-col-extends.js"></script>*/
	function _datagrid_selcol(method,_options){
		var thisobj= this;
		if(method=="query")
		{
            $(thisobj).datagrid('load', _options.queryParams);
			return;
		}
		var options={
                url: _options.url,				
				method:"get",
                singleSelect: true,//是否单选
                pagination: true,//分页控件
                //rownumbers: true,//行号
                fitColumns: true,
                pageSize: 15,
                pageList: [10, 15, 20, 30, 40, 50],//可以设置每页记录条数的列表
                loadMsg: '数据加载中请稍后……',
                queryParams:_options.queryParams,
                showFooter: true,
                onLoadSuccess: function (data) {
                    //    $('#listtb').datagrid('appendRow', { order_id: '<b>合计：</b>',  rebate_price: data.rebate_price_sum });
                },
                frozenColumns: [_options.frozenColumns],
                columns: [_options.columns]
        }
		
		
		var frozenColumns=options.frozenColumns[0];
		var columns=options.columns[0];
		var datagrid_selcol_btn_id=_options.datagrid_selcol_btn_id||"datagrid_selcol_btn";
		var identifier = _options.identifier;
		
		new column_select(identifier, datagrid_selcol_btn_id, frozenColumns, columns, function(col1,col2){			
			options.frozenColumns=[col1];
			options.columns=[col2];
			$(thisobj).datagrid(options);
			 //设置分页控件
            var p = $(thisobj).datagrid('getPager');
            $(p).pagination({
                pageSize: 15,//每页显示的记录条数，默认为10
                pageList: [10, 15, 20, 30, 40, 50],//可以设置每页记录条数的列表
                beforePageText: '第',//页数文本框前显示的汉字
                afterPageText: '页    共 {pages} 页',
                displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
            });
		});
	}
	
	/*
	<script type="text/javascript" src="js\select2\js\select2.full.js"></script>
	<script type="text/javascript" src="js\select2\js\select2_extends.js"></script>
    <link href="js\select2\css\select2.full.css" rel="stylesheet" />
	*/
	function _select_user(options){
		var thisobj = this;
		options=options||{url:"", width:"", delay:"", callback:function(){}};		
		select2_extends.init(thisobj, options);
	}
	/*	
    <script src="js/ztree/js/jquery.ztree.all.min.js"></script>
    <script src="js/ztree/js/ztree_extends.js"></script>
    <link href="css/ztree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
	*/
	function _select_tree(options){
		var thisobj=this;
		switch(options.method)
		{
			case "init":
				new ztree_extends().init(thisobj, options);
			break;
			case "getvalue":
				return thisobj.attr("p_"+options.attrname);
			break;
		}
		
	}
	
	
	/*
	<script src="js/uploadify/jquery.uploadify.js"></script>
    <link href="js/uploadify/uploadify.css" rel="stylesheet" />
	*/
	function _upload(options) {//在这里我列出了常用的参数和注释，更多的请直接看jquery.uploadify.js
			var thisobj = this;
	        thisobj.uploadify({
                swf: 'js/uploadify/uploadify.swf',//上传的Flash，不用管，路径对就行
                uploader: options.uploader, //Post文件到指定的处理文件
                auto: false,
                buttonImage: '/js/uploadify/uploadify-upload.png',
                buttonText: options.buttonText,//浏览按钮的Text,
                fileObjName:"uploadFile",
                cancelImage: '/js/uploadify/uploadify-cancel.png',//取消按钮的图片地址
                fileTypeDesc: options.fileTypeDesc,//需过滤文件类型
                fileTypeExts: options.fileTypeExts,//需过滤文件类型的提示
                multi: true,//是否允许多文件上传
                width: 100,
                fileSizeLimit: 20 * 1024,
                uploadLimit: 999,//同时上传多小个文件
                queueSizeLimit: 999,//队列允许的文件总数
                removeCompleted: false,//当上传成功后是否将该Item删除
                onSelect: function (file) {
                    $('#uploadify').uploadifyUpload('*');
                },//选择文件时触发事件
                onSelectError: function (file, errorCode, errorMsg) { },//选择文件有误触发事件
                onUploadComplete: function (file) { },//上传成功触发事件
                onUploadError: function (file, errorCode, errorMsg) {
                    //document.write(errorMsg);
                },//上传失败触发事件
                onUploadProgress: function (file, fileBytesLoaded, fileTotalBytes) { },//上传中触发事件
                onUploadStart: function (file) { },//上传开始触发事件
                onUploadSuccess: options.onUploadSuccess,  //当单个文件上传成功后激发的事件
                onQueueComplete: function (event, response, status) {
                }//所有文件上传成功后激发的事件
            });
        }


	function _select_multi(){
		this.attr("multiple",'multiple');
		this.select2({
                                tags: true,
                                maximumSelectionLength: 5,
                                tokenSeparators: [',', ' ']
                            });
	}
	function _select(){
		this.select2({
        minimumResultsForSearch: -1
    });		
	}
	
	$.fn.datagrid_selcol=_datagrid_selcol;
	$.fn.select_user=_select_user;
	$.fn.select_tree=_select_tree;
	$.fn.upload=_upload;
	$.fn.select_multi=_select_multi;
	$.fn.select=_select;
	
	function init(){
		initDate();
		initMoney();
	}
	/*<script type="text/javascript" src="js/My97DatePicker/WdatePicker.js"></script>*/
	function initDate () {
        $("body").on("click",".date",function () {
            WdatePicker();
        });
    }
    function initMoney() {
		$("input[class='money'],input[class='num']").css("text-align","right");
        $("body").on("focus","input[class='money']",function () {
            var num = $(this).val();
            $(this).val($.formatMoney(num));
        });
        $("body").on("blur","input[class='money'],input[class='num']",function () {
            $(this).val($.formatMoney($(this).val(), $(this).hasClass("num"), $(this).hasClass("money")));
        });
        $(".money").each(function () {
            var html = $(this).html();
            $(this).html($.formatMoney(html, false, true));

            var val = $(this).val();
            $(this).val($.formatMoney(val, false, true));
        });
    }
	$(function(){
		init();
	});	
})(jQuery);