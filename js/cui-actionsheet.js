//actionsheet插件
(function(){
    "use strict";
    var cuiActionsheet=function(param)
    {
        var that=this,
            contentDom=null;
        /*默认值*/
        that.defaults=
        {
            buttons:[{text:"拍照"},{text:"相册"},{text:"文件"}],//按钮
            title:"请选择",//标题
            beforeShow:function(){
                console.log(1)

            },
            //展示之前调用
            afterShow:function(){
                console.log(2)
            },
            //展示之后调用
            selectOk:function(index)
            {
                console.log(index)
            },
            shelterclose:false,//是否点击遮挡层关闭
            autoclose:false //是否自动关闭
        };
        //删除类的公用函数
        that.removeClass=function(dom,clsName)
        {
            var reg=new RegExp(clsName,"g");
            if(dom.length)
            {
                for(var x=0;x<dom.length;x++)
                {
                    var itemClsName=dom[x].className;
                    itemClsName=itemClsName.replace(reg,"");
                    dom[x].className=itemClsName;
                }
                return false;
            }
            else
            {
                var nowClsName=dom.className;
                nowClsName=nowClsName.replace(reg,"");
                dom.className=nowClsName;
                return false;
            }

        };
        //添加类的公用函数
        that.addClass=function(dom,clsName)
        {
            var nowClsName=dom.className;
            if(nowClsName.indexOf(clsName)===-1)
            {
                dom.className=nowClsName+" "+clsName;
            }
            return false;

        };
        //属性替换
        that.extend=function(def,param){
            for(var x in param)
            {
                if(def.hasOwnProperty(x))
                {
                    def[x]=param[x];
                }
            }
        };
        that.extend(that.defaults,param);
        //渲染content
        var renderContent=function()
        {
            var btnHtml="";
            for(var x=0;x<that.defaults.buttons.length;x++)
            {
                btnHtml+='<div class="cui-actionsheet-btn" data-index="'+x+'">'+that.defaults.buttons[x].text+'</div>';
            }
            contentDom=document.createElement("div");
            contentDom.className="cui-actionsheet";
            var temHtml='\t<div class="cui-actionsheet-shelter">\n' +
                        '\t\t<div class="cui-actionsheet-select">\n' +
                        '\t\t\t<div class="cui-actionsheet-option">\n' +
                        '\t\t\t\t<div class="cui-actionsheet-btn cui-actionsheet-title">'+that.defaults.title+'</div>\n'
                                 +btnHtml+
                        '\t\t\t</div>\n' +
                        '\t\t\t<div class="cui-actionsheet-cancel">取消</div>\n' +
                        '\n' +
                        '\t\t</div>\n' +
                        '\t</div>\n';
            contentDom.innerHTML=temHtml;

            document.body.appendChild(contentDom);

            bindEvent();
        },
        bindEvent=function()
        {
            if(contentDom)
            {
                //委托事件
                contentDom.addEventListener("click",function(e)
                {
                    var target=e.target,
                        targetClass=target.className;
                    if(targetClass)
                    {
                        //点击取消事件
                        if(targetClass==="cui-actionsheet-cancel")
                        {
                            that.hideACtionSheet();
                        }
                        //点击按钮事件
                        if(targetClass==="cui-actionsheet-btn")
                        {
                            var index=target.dataset["index"];
                            that.defaults.selectOk(parseInt(index))
                            if(that.defaults.autoclose)
                            {
                                that.hideACtionSheet();
                            }
                        }
                        //点击遮挡层事件
                        if(targetClass==="cui-actionsheet-shelter")
                        {
                            if(that.defaults.shelterclose)
                            {
                                that.hideACtionSheet();
                            }
                        }
                    }
                });
            }
        };
        //显示
        that.showActionSheet=function(newparams)
        {
            if(!contentDom)
            {
                that.extend(that.defaults,newparams);
                //显示之前调用
                that.defaults.beforeShow();
                //开始生成html
                renderContent();
                setTimeout(function(){
                    //展示动画
                    that.addClass(contentDom,"cui-actionsheet-active");
                    //展示之后调用
                    that.defaults.afterShow();
                },0)
            }
        };
        //隐藏
        that.hideACtionSheet=function()
        {
            if(contentDom)
            {
                //隐藏动画
                that.removeClass(contentDom,"cui-actionsheet-active");
                setTimeout(function(){
                    //删掉dom
                    contentDom.remove();
                    contentDom=null;
                },500)
            }
        };

    };
    window.cuiActionsheet=cuiActionsheet;
})();
