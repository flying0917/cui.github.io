//dialog插件
(function(){
    "use strict";
    var cuiDialog=function(param,fn)
    {
        var that=this,
            contentDom=null,
            isMove=false;

        /*默认值*/
        that.defaults=
        {
            title:"标题",
            msg:"你确定要关闭么？",
            type:"confrim", //类型 confirm 确认  ，alert
            placeholder:"",
            styleType:"",//三星样式 anycall
            duration:1000,
            onSuccess:function(){},
            onCancel:function(){}
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

        var renderAlert=function(titleHtml)
            {
                var temHtml="";
                temHtml='<div class="cui-dialog-shelter"></div>\n' +
                    '\t<div class="cui-dialog-content">\n' +
                    titleHtml+
                    '\t\t<div class="cui-dialog-detail">'+that.defaults.msg+'</div>\n' +
                    '\t\t<div class="cui-dialog-btn">\n' +
                    '\t\t\t<div class="cui-dialog-btn-item cui-dialog-confirm">确认</div>\n' +
                    '\t\t</div>\n' +
                    '\t</div>'
                return temHtml;
            },
            renderConfirm=function(titleHtml)
            {
                var temHtml="";
                temHtml='<div class="cui-dialog-shelter"></div>\n' +
                        '\t<div class="cui-dialog-content">\n' +
                        titleHtml +
                        '\t\t<div class="cui-dialog-detail">'+that.defaults.msg+'</div>\n' +
                        '\t\t<div class="cui-dialog-btn">\n' +
                        '\t\t\t<div class="cui-dialog-btn-item cui-dialog-cancel">取消</div>\n' +
                        '\t\t\t<div class="cui-dialog-btn-item cui-dialog-confirm">确认</div>\n' +
                        '\t\t</div>\n' +
                        '\t</div>'
                return temHtml;
            },
            renderPrompt=function(titleHtml)
            {
                var temHtml="",
                    placeholder=that.defaults.placeholder?that.defaults.placeholder:"";
                temHtml='<div class="cui-dialog-shelter"></div>\n' +
                    '\t<div class="cui-dialog-content">\n' +
                    titleHtml +
                    '\t\t<div class="cui-dialog-detail"><span>'+that.defaults.msg+'</span>'+
                            '<input type="text" placeholder="'+placeholder+'">'+
                        '</div>\n' +
                    '\t\t<div class="cui-dialog-btn">\n' +
                    '\t\t\t<div class="cui-dialog-btn-item cui-dialog-cancel">取消</div>\n' +
                    '\t\t\t<div class="cui-dialog-btn-item cui-dialog-confirm">确认</div>\n' +
                    '\t\t</div>\n' +
                    '\t</div>'
                return temHtml;
            },
            renderToast=function()
            {
                contentDom.className="cui-dialog-toast";
                return that.defaults.msg?that.defaults.msg:" ";
            },
            renderContent=function()
            {
                if(!contentDom)
                {
                    var temHtml="",
                        titleHtml=""
                    contentDom=document.createElement("div");
                    contentDom.className="cui-dialog";
                    if(that.defaults.styleType==="anycall")
                    {
                        contentDom.className="cui-dialog cui-dialog-anycall";
                    }

                    if(that.defaults.title)
                    {
                        titleHtml='<div class="cui-dialog-title">'+that.defaults.title+'</div>';
                    }
                    switch(that.defaults.type)
                    {
                        case 'alert':temHtml=renderAlert(titleHtml);break;
                        case 'confirm':temHtml=renderConfirm(titleHtml);break;
                        case 'prompt':temHtml=renderPrompt(titleHtml);break;
                        case 'toast':temHtml=renderToast();break;
                    }

                    contentDom.innerHTML=temHtml;
                    document.body.appendChild(contentDom);
                    bindEvent();
                }
            },
            onCancel=function()
            {
              that.defaults.onCancel();
              that.hide();
            },
            onSuccess=function()
            {
                var value="";
                if(that.defaults.type==="prompt")
                {
                    var inputDom=contentDom.children[1].children[1].children[1];
                    value=inputDom.value;
                }
                that.defaults.onSuccess(value);
                that.hide();
            },
            bindEvent=function()
            {
                contentDom.addEventListener("click",function(e)
                {
                    var targetCls=e.target.className;
                    console.log(targetCls)
                    switch(targetCls)
                    {
                        case "cui-dialog-btn-item cui-dialog-cancel":onCancel();break;
                        case "cui-dialog-btn-item cui-dialog-confirm":onSuccess();break;
                    }
                })
            };
        that.show=function()
        {
            if(!isMove)
            {
                isMove=true;
                var newparam=arguments.length>0?arguments[0]:{};
                that.extend(that.defaults,newparam);
                renderContent();
                setTimeout(function(){
                    that.addClass(contentDom,"cui-dialog-active");
                    if(that.defaults.type==="toast"&&that.defaults.duration)
                    {
                        setTimeout(function(){
                            that.hide();
                        },parseInt(that.defaults.duration)?parseInt(that.defaults.duration):1000);
                    }
                },100)
            }
        }

        that.hide=function()
        {

            that.removeClass(contentDom,"cui-dialog-active");
            setTimeout(function()
            {
                contentDom.remove();
                contentDom=null;
                isMove=false;
            },750)
        }
    };
    window.cuiDialog=cuiDialog;
})();
