//轮播插件
(function(){
    "use strict";
    var cuiSwiper=function(param,fn)
    {
        //默认值
        var defaults={
                domStr:"",
                triggerDistance:100,//滑动距离触发点
                width:0,
                height:0,
                noop:true,//是否可循环 bool 默认 true
                direction: 'horizontal',//（默认）水平 horizontal， 垂直 vertical   string
                autoplay:0,//自动播放 默认0 不自动播放
                speed:0.5,//滑动速度以秒为单位
                pagination:"",//分页容器选择字符
                change:function(a){
                    console.log("change===="+a)
                },//切换轮播图回调事件
                beforeChange:function(a){
                    console.log("beforChange==="+a);
                }//改变之前要干的事
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
            nowY=0,
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

        if(defaults.pagination)
        {
            var paginationDom=null;
        }
        //函数绑定
        that.bindEvent=function()
        {
            contentDom.addEventListener("touchstart",function(e)
            {
                startX=e.changedTouches[0].pageX;
                startY=e.changedTouches[0].pageY;

                moveX=0;
                moveY=0;
                wrapDom.style.transition=wrapDom.style.webkitTransition="";
            });
            contentDom.addEventListener("touchmove",function(e)
            {
                e.preventDefault();//去掉ios的橡皮筋效果
                if(ismoving===false)
                {
                    moveX=e.changedTouches[0].pageX-startX;
                    moveY=e.changedTouches[0].pageY-startY;


                    if(defaults.direction==="vertical")//垂直
                    {
                        if(Math.abs(moveY/moveX)>1.5)//垂直滑动角度超过45度不干活
                        {
                            if(!defaults.noop)
                            {
                                if(index===0&&moveY>0)
                                {
                                    return false;
                                }
                                if(index===(count-1)&&moveY<0)
                                {
                                    return false;
                                }
                            }
                            wrapDom.style.transition=wrapDom.style.webkitTransition="";
                            wrapDom.style.marginTop=(nowY+moveY)+"px";
                        }
                    }
                    else//水平
                    {
                        if(Math.abs(moveX/moveY)>1.5)//水平滑动角度超过45度不干活
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
                }
            });
            contentDom.addEventListener("touchend",function(e)
            {
                var direct=defaults.direction==="vertical"?moveY:moveX;
                //开始移动
                that.move(direct);
            });
        };
        //移动 (direct >0 )后退  (direct < 0 )前进
        that.move=function(direct)
        {
            if(defaults.direction==="vertical")//垂直
            {
                if(!defaults.noop)
                {
                    if(index===0&&direct>0)
                    {
                        return false;
                    }
                    if(index===(count-1)&&direct<0)
                    {
                        return false;
                    }
                }
                if(ismoving===false)
                {
                    if(Math.abs(direct)>defaults.triggerDistance)
                    {
                        direct>0?(now+=parseInt(defaults.height)):(now-=parseInt(defaults.height));
                        ismoving=true;
                        //触发改变之前要干的事
                        defaults.beforeChange(index);
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all "+defaults.speed+"s";
                        wrapDom.style.marginTop=now+"px";
                        setTimeout(function(){
                            ismoving=false;
                            nowY=parseInt(wrapDom.style.marginTop);
                            wrapDom.style.transition=wrapDom.style.webkitTransition="";
                            direct>0?(index--):(index++);
                            that.removeClass(wrapDom.children,"cui-swiper-active");
                            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
                            if(defaults.noop&&index===(count-1)&&direct<0)
                            {
                                that.preInitStatus();
                            }
                            if(defaults.noop&&index===0&&direct>0)
                            {
                                that.nextInitStatus();
                            }

                            //分页状态
                            if(defaults.pagination&&paginationDom)
                            {
                                that.removeClass(paginationDom.children,"cui-swiper-pagination-acitve");
                                that.addClass(paginationDom.children[index],"cui-swiper-pagination-acitve");
                            }
                            //触发切换轮播图回调事件
                            var nowIndex=defaults.noop?index-1:index;
                            defaults.change(nowIndex);

                        },parseFloat(defaults.speed)*1000)
                    }
                    else //没超过触发点 还原动画
                    {
                        ismoving=true;
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all "+defaults.speed+"s";
                        wrapDom.style.marginTop=nowY+"px";
                        setTimeout(function(){
                            ismoving=false;
                        },parseFloat(defaults.speed)*1000)
                    }
                }
            }
            else
            {
                if(!defaults.noop)
                {
                    if(index===0&&direct>0)
                    {
                        return false;
                    }
                    if(index===(count-1)&&direct<0)
                    {
                        return false;
                    }
                }
                if(ismoving===false)
                {
                    if(Math.abs(direct)>defaults.triggerDistance)
                    {
                        direct>0?(now+=parseInt(defaults.width)):(now-=parseInt(defaults.width));
                        ismoving=true;
                        //触发改变之前要干的事
                        defaults.beforeChange(index);
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all "+defaults.speed+"s";
                        wrapDom.style.marginLeft=now+"px";
                        setTimeout(function(){
                            ismoving=false;
                            nowX=parseInt(wrapDom.style.marginLeft);
                            wrapDom.style.transition=wrapDom.style.webkitTransition="";
                            direct>0?(index--):(index++);
                            that.removeClass(wrapDom.children,"cui-swiper-active");
                            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
                            if(defaults.noop&&index===(count-1)&&direct<0)
                            {
                                that.preInitStatus();
                            }
                            if(defaults.noop&&index===0&&direct>0)
                            {
                                that.nextInitStatus();
                            }

                            //分页状态
                            if(defaults.pagination&&paginationDom)
                            {
                                that.removeClass(paginationDom.children,"cui-swiper-pagination-acitve");
                                that.addClass(paginationDom.children[index],"cui-swiper-pagination-acitve");
                            }
                            //触发切换轮播图回调事件
                            var nowIndex=defaults.noop?index-1:index;
                            defaults.change(nowIndex);
                        },500)
                    }
                    else //没超过触发点 还原动画
                    {
                        ismoving=true;
                        wrapDom.style.transition=wrapDom.style.webkitTransition="all "+defaults.speed+"s";
                        wrapDom.style.marginLeft=nowX+"px";
                        setTimeout(function(){
                            ismoving=false;
                        },500)
                    }
                }
            }
        };
        //开始的初始状态（可循环时）
        that.preInitStatus=function()
        {
            if(defaults.direction==="vertical")
            {
                wrapDom.style.marginTop="-"+defaults.height+"px";
                now=nowY=parseInt("-"+defaults.height);
                console.log(232)
            }
            else
            {
                wrapDom.style.marginLeft="-"+defaults.width+"px";
                now=nowX=parseInt("-"+defaults.width);
            }
            index=1;
            that.removeClass(wrapDom.children,"cui-swiper-active");
            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
        };
        //结束的初始状态（可循环时）
        that.nextInitStatus=function()
        {
            if(defaults.direction==="vertical")
            {
                wrapDom.style.marginTop="-"+(defaults.height*(count-2))+"px";
                now=nowY=parseInt("-"+(defaults.height*(count-2)));
            }
            else
            {
                wrapDom.style.marginLeft="-"+(defaults.width*(count-2))+"px";
                now=nowX=parseInt("-"+(defaults.width*(count-2)));
            }
            index=count-2;
            that.removeClass(wrapDom.children,"cui-swiper-active");
            wrapDom.children[index]?that.addClass(wrapDom.children[index],"cui-swiper-active"):"";
        };

        //定时器
        that.setAutoplay=function()
        {
            var autoplayInterval=null;
            if(defaults.autoplay)
            {
                autoplayInterval=setInterval(function(){
                    if(!defaults.noop&&index===count-1)
                    {
                        clearInterval(autoplayInterval);
                    }
                    that.move(parseInt("-"+(defaults.triggerDistance+1)));
                },parseInt(defaults.autoplay));
            }
        };

        //初始化
        that.init=function()
        {
            //获取容器
            contentDom=document.querySelector(defaults.domStr);
            if(defaults.direction==="vertical")
            {
                that.addClass(contentDom,"cui-swiper-content-v");
            }
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
                contentDom.style.width=defaults.width+"px";
            }
            //获取容器的高度
            if(!defaults.height)
            {
                defaults.height=contentDom.offsetHeight;
            }
            else
            {
                contentDom.style.height=defaults.height+"px";
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
                that.addClass(wrapDom.children[1],"cui-swiper-active");
            }
            else
            {
                that.addClass(wrapDom.children[0],"cui-swiper-active")
            }

            //分页
            if(defaults.pagination)
            {
                var paginationHtmlStr="";
                if(paginationDom=document.querySelector(defaults.pagination))
                {
                    for(var y=0;y<count;y++)
                    {
                        if(defaults.noop)
                        {
                            if(y===0)
                            {
                                paginationHtmlStr+="<span style='display:none;'></span>";
                                continue;
                            }
                            else if(y===1)
                            {
                                paginationHtmlStr+="<span class='cui-swiper-pagination-acitve'></span>";
                                continue;
                            }
                            else if(y===count-1)
                            {
                                paginationHtmlStr+="<span style='display:none;'></span>";
                                continue;
                            }
                        }
                        else
                        {
                            if(y===0)
                            {
                                paginationHtmlStr+="<span class='cui-swiper-pagination-acitve'></span>";
                                continue;
                            }
                        }
                        paginationHtmlStr+="<span></span>";
                    }
                    paginationDom.innerHTML=paginationHtmlStr;
                }
            }
            that.bindEvent();
        };
        that.init();
        that.setAutoplay();

    };
    window.cuiSwiper=cuiSwiper
})();