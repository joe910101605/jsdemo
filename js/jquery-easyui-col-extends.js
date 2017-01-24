/*
例:
 var cols1=[
     { field: 'order_id', title: "订单号",sortable:true , width: "105px" },
     { field: 'vin', title: "车架号",sortable:true , width: "130px" },
 ];
 var cols2=[
 { field: 'order_id', title: "订单号",sortable:true , width: "105px" },
 { field: 'vin', title: "车架号",sortable:true , width: "130px" },
 ];
 function resetCallback(cols1,cols2){

 }


 var s = new column_select("aaa111112","selcolbtn",cols1,cols2,resetCallback);//(存cookie的名,按钮id,列集合1,列集合2,回调)
                                                             //s.showChoicer(); //弹出选择框
 var cols =s.getCols();//获取当前列集合
*/

function  column_select(cookiename,selcolbtnid,cols_full1,cols_full2,resetCallback) {
    this.cookiename=cookiename;
    this.selcolbtnid=selcolbtnid;
    this.cols=cols_full1.concat(cols_full2);//full1+
    this.cols_full1 =cols_full1;
    this.cols_full2 =cols_full2;
    this.resetCallback=resetCallback;

    this.getCols=function(){
        //根据cookie中的显示状态生成新的列列表
        var cols_tmp1 = [];
        var cols_tmp2 = [];
        for(var i=0;i<this.cols.length;i++) {
			
            if(this.cols[i]._hide==false) {
				
                for(var j=0;j<this.cols_full1.length;j++) {
                    if(this.cols[i].field==this.cols_full1[j].field){				
						cols_tmp1.push(this.cols_full1[j]);
					}
                }
				
                for(var j=0;j<this.cols_full2.length;j++) {
                    if(this.cols[i].field==this.cols_full2[j].field){
                        cols_tmp2.push(this.cols_full2[j]);
					}
                }
            }
        }
        //返回
        var colsList = {};
        colsList.cols1=cols_tmp1;
        colsList.cols2=cols_tmp2;
        return colsList;
    }
    this.setCols=function (_cols) {
        var cookieCols =eval(_getCookie(this.cookiename));
        //简化
        for(var i=0;i<this.cols.length;i++) {
            var obj = {};
            obj.field=this.cols[i].field;
            obj.title=this.cols[i].title;
            obj._hide=false;
            this.cols[i]=obj;
        }
        //从cookie同步
        if(cookieCols!=undefined) {
            for (var i = 0; i < cookieCols.length; i++) {
                var cookieCol = cookieCols[i];
                for (var j = 0; j < this.cols.length; j++) {
                    var thisCol = this.cols[j];
                    if (cookieCol.field == thisCol.field) {
                        this.cols[j]._hide = cookieCol._hide;
                    }
                }

                for (var j = 0; j < this.cols_full1.length; j++) {
                    var thisCol = this.cols_full1[j];
                    if (cookieCol.field == thisCol.field) {
                        this.cols_full1[j]._hide = cookieCol._hide;
                    }
                }
                for (var j = 0; j < this.cols_full2.length; j++) {
                    var thisCol = this.cols_full2[j];
                    if (cookieCol.field == thisCol.field) {
                        this.cols_full2[j]._hide = cookieCol._hide;
                    }
                }
            }
        }
		
        //回调
        var colsList = this.getCols();
        this.resetCallback(colsList.cols1,colsList.cols2);
    }
    this.save=function(selcolObj) {
        //从页面勾选状态同步到cookie
        var checkboxes = $("#columnChoicerUL").find("li input");
        for (var i=0;i<checkboxes.length;i++)
        {
            var chkbox = $(checkboxes[i]);
            var fieldname = chkbox.attr("fieldname");
            var checked =chkbox.is(":checked");
            for (var i=0;i<selcolObj.cols.length;i++) {
                var col = selcolObj.cols[i];
                if(fieldname==col.field)
                {
                    selcolObj.cols[i]._hide=!checked;
                    break;
                }
            }
        }
        _setCookie(selcolObj.cookiename,JSON.stringify(selcolObj.cols));
        var colsList = selcolObj.getCols();
        selcolObj.resetCallback(colsList.cols1,colsList.cols2);
        //保存完成后关闭
        this.close();
    }
    this.showChoicer=function () {
        var choicerDiv = document.getElementById("columnChoicer");
        if(choicerDiv==undefined)
        {
            var div = "";
            div+='<div id="columnChoicer" style="display:none">';
            div+='   <div style="height:90%;overflow: auto">';
            div+='      <ul id="columnChoicerUL" style="padding: 10px;margin-bottom:30px;">';
            div+='      </ul>';
            div+='  </div>';
            div+='  <div style="height:10%;text-align: center;">';
            div+='      <div style="padding-top:6px;">';
            div+='         <a id="_okbtn" style="display: inline-block; cursor: pointer; background: rgb(81, 147, 204) none repeat scroll 0px 0px; color: rgb(255, 255, 255); border-radius: 4px;padding:6 14;">确定</a><a id="_closebtn" style="margin-left:40px;display: inline-block; cursor: pointer; background: rgb(81, 147, 204) none repeat scroll 0px 0px; color: rgb(255, 255, 255); border-radius: 4px;padding:6 14;">关闭</a>';
            div+='      </div>';
            div+='  </div>';
            div+='</div>';
            document.body.appendChild($(div).get(0));
            choicerDiv = document.getElementById("columnChoicer");

            var selcolObj=this;
            $("#_okbtn").unbind("click").bind("click",function () {
                selcolObj.save(selcolObj);
            });
            $("#_closebtn").unbind("click").bind("click",function () {
                selcolObj.close();
            });
        }

        var ul = $("#columnChoicerUL");
        var lis = "";
        for (var i=0;i<this.cols.length;i++)
        {
            var col = this.cols[i];
            var title=col.title;
            var field=col.field;
            var hide=col._hide;
            lis+="<li style='padding: 10px;border-bottom: 1px solid  #EEEEEE'><input id='box_"+field+"' type='checkbox' fieldname='"+field+"' "+(hide==false?"checked='checked'":"")+"><label for='box_"+field+"' style='padding:10px;'>"+title+"</label></li>";
        }
        ul.html(lis);


        $(choicerDiv).show();
        $(choicerDiv).dialog({
            title: '选择显示列',
            left: ($(document).width() - 250) / 2,
            top: 100,//($(document).scrollTop() + ($(window).height() - 450) / 2),
            width: 350,
            height: 450,
            closed: false,
            cache: false,
            modal: true
        });
    }
    this.close=function () {
        $("#columnChoicer").dialog('close');
    }

    //初始化时需要设置列
    this.setCols();
    //绑定按钮事件
    var obj=this;
    $("body").on("click","#"+this.selcolbtnid,function(){
        obj.showChoicer();
    });
}

function _setCookie(name, value) {
    expires = new Date();
    expires.setTime(expires.getTime() + (1000 * 86400 * 365));
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
}

function _getCookie(name) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        if (aCookie[i].indexOf(name) != -1) {
            var aCrumb = aCookie[i].split("=");
            var getCookie = unescape(aCrumb[1]);
            return getCookie;
        }
    }
}
