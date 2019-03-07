//加载中插件
(function(){
    "use strict";
    var cuiLoading=function(param,fn)
    {
        //获取加载图标的容器字符串
        this.domStr=param.domStr?param.domStr:"";
        if(this.domStr)
        {
            //获取加载图标的容器dom
            this.contentDom=this.domStr?document.querySelector(this.domStr):document.querySelector(".cui-loading-content");
            if(!this.contentDom)
            {
                console.log("没找到容器");
                return false;
            }

            this.type=param.type?param.type:"";
            //初始化
            this.init=function()
            {
                this.addClass(this.contentDom,".cui-loading-content");
                //往容器中添加img标签
                this.contentDom.innerHTML='<img src="https://file.digitaling.com/eImg/uimages/20150908/1441704518179024.gif"><span class="cui-loading-text">加载更多</span>'
                //获取容器中的文本提示标签
                this.textDom=document.querySelector(this.domStr+" .cui-loading-text");
            };
            //添加类的公用函数
            this.addClass=function(dom,clsName)
            {
                var nowClsName=dom.className;
                if(nowClsName.indexOf(clsName)===-1)
                {
                    dom.className=nowClsName+" "+clsName;
                }
                return false;

            };
            //显示加载中的插件
            this.showloading=function()
            {
                this.contentDom.style.display="block"
                this.textDom.innerText="加载中"
            }
            //隐藏加载中的插件
            this.hideloading=function()
            {
                this.contentDom.style.display="none"
            }
            //完成加载的提示
            this.finishloading=function()
            {
                this.textDom.innerText="没有内容了"
            }
            this.init();
        }
        else
        {
            console.log("缺少dom")
        }

    };
    window.cuiLoading=cuiLoading
})();