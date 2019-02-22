//轮播插件
(function(){
    "use strict";
    var cuiSwiper=function(param,fn)
    {
        //默认值
        var defaults={
                domStr:"",
                triggerDistance:80,
                width:"",
                height:"200px",
                noop:false,
            },
            that=this,
            contentDom=null,//容器
            wrapDom=null,//移动的容器
            now=0,
            startX=0,
            moveX=0,
            startY=0,
            moveY=0,
            nowX=0,
            count=0,//slide数量
            index=0,//目前展示的slide索引
            ismoving=false,
            beforeNoopDom=null,
            afterNoopDom=null;
        //属性替换
        that.extend=function(def,param){
            for(var x in param)
            {
                if(def.hasOwnProperty(x))
                {
                    def[x]=param[x];
                }
            }
            return def;
        };
        //添加类的公用函数
        that.addClass=function(dom,clsName)
        {
            var nowClsName=dom.className;
            if(nowClsName.indexOf(clsName)===-1)
            {
                dom.className=nowClsName.trim()+" "+clsName;
            }
            return false;

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
        defaults=that.extend(defaults,param);
        //函数绑定
        this.bindEvent=function()
        {
            contentDom.addEventListener("touchstart",function(e)
            {
                startX=e.changedTouches[0].pageX;
                startY=e.changedTouches[0].pageY;
                wrapDom.style.transition=wrapDom.style.webkitTransition="";
            });
            contentDom.addEventListener("touchmove",function(e)
            {
                if(ismoving===false)
                {
                    moveX=e.changedTouches[0].pageX-startX;
                    moveY=e.changedTouches[0].pageY-startY;
                    if(Math.abs(moveX/moveY)>1.5)
                    {
                        if(!defaults.noop)
                        {
                            if(index===0&&moveX>0)
                            {
                                return false;
                            }
                            if(index===(count-1)&&moveX<0)
                            {
                                return false;
                            }
                        }
                        wrapDom.style.transition=wrapDom.style.webkitTransition="";
                        wrapDom.style.marginLeft=(nowX+moveX)+"px";
                    }
                }
            });
            contentDom.addEventListener("touchend",function(e)
            {
                if(!defaults.noop)
                {
                    if(index===0&&moveX>0)
                    {
                        return false;
                    }
                    if(index===(count-1)&&moveX<0)
                    {
                        return false;
                    }
                }
                if(ismoving===false)
                {
                    if(Math.abs(moveX)>defaults.triggerDistance)
                    {
                        moveX>0?(now+=parseInt(defaults.width)):(now-=parseInt(defaults.width));
                        ismoving=true;
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all .3s";
                        wrapDom.style.marginLeft=now+"px";
                        setTimeout(function(){
                            ismoving=false;
                            nowX=parseInt(wrapDom.style.marginLeft);
                            wrapDom.style.transition=wrapDom.style.webkitTransition="";
                            moveX>0?(index--):(index++);
                            that.removeClass(wrapDom.children,"cui-swiper-active");
                            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
                            console.log(index)
                            if(defaults.noop&&index===(count-1)&&moveX<0)
                            {
                                that.preInitStatus();
                            }
                            if(defaults.noop&&index===0&&moveX>0)
                            {
                                that.nextInitStatus();
                            }
                        },500)
                    }
                    else
                    {
                        ismoving=true;
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all .3s";
                        wrapDom.style.marginLeft=nowX+"px";
                        setTimeout(function(){
                            ismoving=false;
                        },500)
                    }
                }
            });
        };
        //开始的初始状态（可循环时）
        that.preInitStatus=function()
        {
            wrapDom.style.marginLeft="-"+defaults.width+"px";
            now=nowX=parseInt("-"+defaults.width);
            index=1;
            that.removeClass(wrapDom.children,"cui-swiper-active");
            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
        };
        //结束的初始状态（可循环时）
        that.nextInitStatus=function()
        {
            wrapDom.style.marginLeft="-"+(defaults.width*(count-2))+"px";
            now=nowX=parseInt("-"+(defaults.width*(count-2)));
            index=count-2;
            that.removeClass(wrapDom.children,"cui-swiper-active");
            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
        };

        //初始化
        that.init=function()
        {
            //获取容器
            contentDom=document.querySelector(defaults.domStr);
            wrapDom=contentDom.children[0];
            //slider的数量
            count=wrapDom.children.length;
            //获取容器的宽度
            if(!defaults.width)
            {
                defaults.width=contentDom.offsetWidth;
            }
            else
            {
                contentDom.style.width=defaults.width;
            }
            //获取容器的高度
            if(!defaults.height)
            {
                defaults.height=contentDom.offsetHeight;
            }
            else
            {
                contentDom.style.height=defaults.height;
            }
            //是否可以循环
            if(defaults.noop)
            {
                wrapDom.appendChild(wrapDom.children[0].cloneNode(true));
                wrapDom.insertBefore(wrapDom.children[count-1].cloneNode(true),wrapDom.children[0]);
                afterNoopDom=wrapDom.children[0];
                beforeNoopDom=wrapDom.children[count-1];
                that.preInitStatus();
                count=wrapDom.children.length;
                that.addClass(wrapDom.children[1],"cui-swiper-active")
            }
            else
            {
                that.addClass(wrapDom.children[0],"cui-swiper-active")
            }
            that.bindEvent();
        };
        that.init();

    };
    window.cuiSwiper=cuiSwiper
})();