//popmodal插件
(function(){
    "use strict";
    var cuiPopmodal=function(param,fn)
    {
        var that=this,
            domContent=null,
            parentDom=null,
            popDom=null,
            closeTransform="translateY(-10px)",
            domWidth=0,
            domHeight=0,
            popWidth=0,
            popHeight=0,
            offsetTop=0,
            offsetLeft=0;
        that.defaults={
            domStr:"",
            direction:"left",
            msg:"哈哈哈哈哈，快下班了 哈哈哈哈哈，快下班了哈哈哈哈哈，快下班了哈哈哈哈哈，快下班了哈哈哈哈哈，快下班了哈哈哈哈哈，快下班了",
            event:"click",//触发popmodal展示的事件
            width:150,

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
        that.showPopModal=function(params)
        {
            if(params&&Object.prototype.toString.call(params)==="[object Object]")
            {
                that.extend(that.defaults,params);
            }
            popDom=document.createElement("div");
            popDom.className="cui-popmodal cui-popmodal-"+that.defaults.direction;
            popDom.innerHTML='<div class="cui-popmodal-text">' + that.defaults.msg +'</div>';
            popDom.style.width=that.defaults.width+"px";
            popDom.style.opacity="0";
            //popDom.style.transform=popDom.style.webkitTransform="translate(0,0)";
            parentDom.appendChild(popDom);
            popHeight=popDom.offsetHeight;
            popWidth=popDom.offsetWidth;
            //计算top 和 left
            calcTopLeft();
            setTimeout(function(){
                popDom.style.transform=popDom.style.webkitTransform="translate(0,0)";
                popDom.style.opacity="1";
            },100)
        };
        that.hidePopMoal=function()
        {
            popDom.style.transform=popDom.style.webkitTransform=closeTransform;
            popDom.style.opacity="0";
            setTimeout(function()
            {
                popDom.remove();
                popDom=null;
            },400)

        };
        var calcTopLeft=function()
        {
            var top,left;
            if(that.defaults.direction==="down")
            {
                closeTransform="translateY(-10px)";
                top=offsetTop+domHeight;
                left=offsetLeft;
            }
            else if(that.defaults.direction==="up")
            {
                closeTransform="translateY(10px)";
                top=offsetTop-popHeight;
                left=offsetLeft;
            }
            else if(that.defaults.direction==="right")
            {
                closeTransform="translateX(-10px)";
                top=offsetTop;
                left=offsetLeft+domWidth;
            }
            else if(that.defaults.direction==="left")
            {
                closeTransform="translateX(10px)";
                top=offsetTop;
                left=offsetLeft-popWidth;
            }
            popDom.style.top=top+"px";
            popDom.style.left=left+"px";
            popDom.style.transform=popDom.style.webkitTransform=closeTransform;

        };
        var bindEvent=function()
        {
            if(that.defaults.event)
            {
                domContent.addEventListener(that.defaults.event,function()
                {
                    if(popDom)
                    {
                        that.hidePopMoal();
                    }
                    else
                    {
                        that.showPopModal();
                    }

                })
            }
        };
        var init=function()
        {
            //获取target容器
            if(that.defaults.domStr)
            {
                if(typeof that.defaults.domStr==="string")
                {
                    domContent=document.querySelector(that.defaults.domStr);
                }
                else if (typeof that.defaults.domStr==="object")
                {
                    domContent=that.defaults.domStr;
                }

            }
            //获取参数
            domHeight=domContent.offsetHeight;
            domWidth=domContent.offsetWidth;
            offsetLeft=domContent.offsetLeft;
            offsetTop=domContent.offsetTop;
            //获取目标dom的父节点
            parentDom=domContent.parentNode;
            bindEvent();

        }
        init();
    };
    window.cuiPopmodal=cuiPopmodal;
})();