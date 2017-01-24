/**
*confirm弹窗插件
接受一个参数对象：
{
message:"确定删除吗？",
time:5,
yes:function(){
},
no:function(){
}
}
*/

; (function ($, window, document, undefined) {
    var pageConfirm = function (opt) {
        this.defaults = {
            message: '确定要删除吗？',
            time: 5,
            yes: function () { },
            no: function () { }
        },
        this.ts = null,
        this.options = $.extend({}, this.defaults, opt);
    }
    pageConfirm.prototype = {
        pageHtml: function () {
            return '<style>*{margin:0px;padding:0px;}'
                  + '.confirmBtn input{'
      + 'width: 56px;'
      + 'height: 25px;'
      + 'cursor: pointer;'
      + 'color:#fff; '
      + 'border:none;'
      + 'text-align:center;'
      + 'background-color:#5580b7;'
      + 'border-radius: 3px;'
  + '}'
+ '.cgConfirm{'
                   + ' background-color: #f3f3f3;'
                   + ' background: -webkit-linear-gradient(top,#F8F8F8 0,#eeeeee 20%);'
                   + ' background: -moz-linear-gradient(top,#F8F8F8 0,#eeeeee 20%);'
                   + ' background: -o-linear-gradient(top,#F8F8F8 0,#eeeeee 20%);'
                   + ' background: linear-gradient(to bottom,#F8F8F8 0,#eeeeee 20%);'
                    + 'background-repeat: repeat-x;'
                   + ' filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#F8F8F8,endColorstr=#eeeeee,GradientType=0);'
                   + ' width:360px;'
                   + ' padding-top:5px;padding-bottom:5px;'
                   + ' border: 1px solid #D3D3D3;'
                + 'z-index:19871101;'
               + ' -moz-box-shadow: 2px 2px 3px #cccccc;'
            + '-webkit-box-shadow: 2px 2px 3px #cccccc;'
            + 'box-shadow: 2px 2px 3px #cccccc;'
        + '}'
   + '</style>'
                + '<div id="cgConfirmMask" style="display:none;background-color:#ccc;z-index:198611;filter:alpha(opacity=40); opacity:0.4;-moz-opacity:0.4;overflow:hidden;position:absolute;top:0;left:0;overflow-y:auto;"></div>'
                + '<div class="cgConfirm"> '
                + '<div class="confirmTitle" style="height:15px;margin:0px 0px 5px 0px;line-height:15px;font-weight:bold;cursor:move">'
    + '<p style="color:#575765;margin-left:5px">提示信息</p>'
    + '</div>'
    + '<div class="confirmMain" style="width:350px;border:1px solid #ccc;background-color:#FFF;margin:0 auto">'
      + '<div class="confirmContent" style="margin-bottom:10px;margin-top:10px;line-height:60px;text-align:center;vertical-align:middle">'
      + this.options.message
            + '</div>'
           + '<div class="confirmBtn" style="text-align:center;margin-bottom:10px">'
           + '<input value="确定" type="button" class="confirmbtnsure"/>&nbsp;&nbsp;<input value="取消" type="button" class="confirmbtncancle"/>'
           + '</div>'
         + '</div>'
            + '</div>';
        },
        showHtml: function () {
            $("body").append(this.pageHtml());
            this.mask();
            this.timer();

        },
        close: function () {
            $('#cgConfirmMask ,.cgConfirm').remove();
        },
        timer: function () {
            var ts = null;
            var that = this;
            if ($('.confirmMain').size() > 0) {
                $('.confirmbtncancle').unbind('click').bind('click', that.options.no);
                if (that.options.time > 0) {
                    $('.confirmbtnsure').css({ 'background-color': '#949494' }).val('确定(' + that.options.time + ')');

                    (function (j) {
                        that.options.time = that.options.time - 1;
                        ts = window.setTimeout(function () { that.timer(that.options.time - 1) }, 1000);
                    })(that.options.time)
                }
                else if (that.options.time == 0) {
                    $('.confirmbtnsure').css({ 'background-color': '#5580b7' }).val('确定');
                    $('.confirmbtnsure').unbind('click').bind('click', that.options.yes);
                    window.clearTimeout(ts);
                }


            }
            else
                window.clearTimeout(ts);

        },
        mask: function () {
            if ($('#cgConfirmMask').size() > 0) {
                var that = this;
                //$('#cgConfirmMask').css({ 'height': $(window).height(), 'width': $(window).width() }).show();

                that.center();
                $(window).resize(function () {
                    that.center();
                });

                this.drag()
            }
        },
        drag: function () {
            $('.confirmTitle').on({
                mousedown: function (e) {
                    var el = $('.cgConfirm');
                    var os = el.offset(); dx = e.pageX - os.left, dy = e.pageY - os.top;
                    $(document).on('mousemove.drag', function (e) { el.offset({ top: e.pageY - dy, left: e.pageX - dx }); });

                },
                mouseup: function (e) { $(document).off('mousemove.drag'); }
            });

        },
        center: function () {
            $('.cgConfirm').css({ 'position': 'absolute', 'top': $(window).height() / 2 - $('.cgConfirm').height(), 'left': $(window).width() / 2 - $('.cgConfirm').width() / 2 });
            $('#cgConfirmMask').css({ 'height': $(document).height(), 'width': $(document).width() }).show();
        }
    }
    $.Confirm2 = {
        confirm: function (options) {
            return new pageConfirm(options);

        },
        show: function (options) {
            this.confirm(options).showHtml()
        },
        close: function () {
            this.confirm().close()
        }

    }
})(jQuery, window, document);