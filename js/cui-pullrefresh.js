//下拉刷新插件  @todo 王榕 这个可能复杂点 嘻嘻
(function(){
    "use strict";
    var cuiPullRefresh=function(param,fn)
    {
        //是否开始
        var start=false,
        //从手指触到屏幕时的Y坐标
        startPageY=0,
        //从手指触到屏幕时的Y坐标
        startPageX=0,
        //刷新头的高度
        refreshHeaderHeight=50,
        //容器里面的html字符串
        contentHtml="",
        //是否在刷新
        isRefreshing=false,
        //cuiPUllRefresh
        that=this,
        refresContentDom,
        //要拖动的容器
        wrapContentDom,
        //刷新的头
        headerContentDom,
        //刷新文本提示
        headerTextDom,
        //刷新提示图标
        headerImgDom,
            //手指滑动的Y长度
        offsetTop,
        //手指滑动的X长度
        offsetLeft;
        //下拉的距离的触发点
        that.triggerDistance=parseInt(param.triggerDistance)?parseInt(param.triggerDistance):200;
        //下拉时
        that.contentdownIcon=param.contentdownIcon?param.contentdownIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        that.contentdown=param.contentdown?param.contentdown:"下拉刷新";
        //放开时
        that.contentoverIcon=param.contentoverIcon?param.contentoverIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        that.contentover=param.contentover?param.contentover:"松开刷新";
        //刷新时
        that.contentrefreshIcon=param.contentrefreshIcon?param.contentrefreshIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        that.contentrefresh=param.contentrefresh?param.contentrefresh:"刷新中";
        //完成刷新时
        that.contentdoneIcon="http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        that.contentdone=param.contentdone?param.contentdone:"完成刷新";
        //触发刷新时的回调
        that.callback=(fn&&typeof fn==="function")?fn:(function(){});
        if(!param.domStr)
        {
            console.log("缺少容器选择字符串");
            return false;
        }
        //获取容器
        if(typeof param.domStr==="string")
        {
            refresContentDom=param.domStr?document.querySelector(param.domStr):document.querySelector(".cui-refresh-content");
        }
        else if(typeof param.domStr==="object")
        {
            refresContentDom=param.domStr;
        }
        if(!refresContentDom)
        {
            console.log("缺少容器选择字符串");
            return false;
        }
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
        //渲染html
        var renderContent=function()
        {
            var temHtml="";
            that.addClass(refresContentDom,"cui-refresh-content");
            contentHtml=refresContentDom.innerHTML;
            temHtml='<div class="cui-refresh-wrap" style="-webkit-transform: translateY(0px);\n' +
                '\t\t\t-moz-transform: translateY(0px);\n' +
                '\t\t\t-ms-transform: translateY(0px);\n' +
                '\t\t\t-o-transform: translateY(0px);\n' +
                '\t\t\ttransform: translateY(0px);">' +
                '<div class="cui-refresh-header" style="line-height:'+refreshHeaderHeight+'px;height:'+refreshHeaderHeight+'px;top:-'+refreshHeaderHeight+'px">' +
                '<img src="'+that.contentdownIcon+'">'+
                '<span>'+that.contentdown+'</span>' +
                '</div>'
                +contentHtml+
                '</div>';
            refresContentDom.innerHTML=temHtml;
            //要拖动的容器
            wrapContentDom=refresContentDom.children[0];
            //刷新的头
            headerContentDom=wrapContentDom.children[0];
            //刷新文本提示
            headerTextDom=headerContentDom.children[1];
            //刷新提示图标
            headerImgDom=headerContentDom.children[0];
        };
        //绑定事件
        var bindEvent=function()
        {
            wrapContentDom.addEventListener("touchstart",function(e)
            {
                if(!isRefreshing&&refresContentDom.scrollTop===0)//当容器的滚动条滚动距离为0和不是在刷新状态时调用
                {
                    start=true;//开始
                    startPageY=e.changedTouches[0].pageY;//从手指触到屏幕时的Y坐标的赋值
                    startPageX=e.changedTouches[0].pageX;//从手指触到屏幕时的X坐标的赋值
                }
            });
            wrapContentDom.addEventListener("touchmove",function(e)
            {
                if(!isRefreshing&&refresContentDom.scrollTop===0)//当容器的滚动条滚动距离为0和不是在刷新状态时调用
                {
                    //手指滑动的Y长度
                    offsetTop=e.changedTouches[0].pageY-startPageY;
                    //手指滑动的X长度
                    offsetLeft=e.changedTouches[0].pageX-startPageX;

                    if(start&&offsetTop>0&&Math.abs(offsetTop/offsetLeft)>1.5)//下划角度超过45度时不干活
                    {
                        wrapContentDom.style.backgroundColor="yellow"
                        e.preventDefault();//去掉ios的橡皮筋效果
                        //下拉的动画
                        wrapContentDom.style.transform=wrapContentDom.style.webkitTransform="translateY("+offsetTop+"px)";
                        //是否大于下拉的距离的触发点
                        if(offsetTop>that.triggerDistance)
                        {
                            wrapContentDom.style.transform=wrapContentDom.style.webkitTransform="translateY("+that.triggerDistance+"px)";
                            headerTextDom.innerText=that.contentover;
                            headerImgDom.src=that.contentoverIcon;
                        }
                        else
                        {
                            headerTextDom.innerText=that.contentdown;
                            headerImgDom.src=that.contentdownIcon;
                        }
                    }
                }
            });
            wrapContentDom.addEventListener("touchend",function(e)
            {
                if(!isRefreshing&&start&&offsetTop>-refreshHeaderHeight)
                {
                    start=false;
                    wrapContentDom.style.transition=wrapContentDom.style.webkitTransition="all .5s";
                    //是否大于下拉的距离的触发点
                    if(offsetTop>=that.triggerDistance)
                    {
                        //显示刷新中的动画
                        wrapContentDom.style.transform=wrapContentDom.style.webkitTransform="translateY("+refreshHeaderHeight+"px)";
                        setTimeout(function(){
                            wrapContentDom.style.transition=wrapContentDom.style.webkitTransition="";
                            //改变状态（正在刷新）
                            isRefreshing=true;
                            headerTextDom.innerText=that.contentrefresh;
                            headerImgDom.src=that.contentrefreshIcon;
                            //开始回调
                            that.callback();
                        },500)

                    }
                    else
                    {
                        //还有到触发点，收起刷新动画
                        that.closeRefresh();
                    }
                }
            });
        };
        //收起刷新的动画
        that.closeRefresh=function()
        {
            //改变状态（不在刷新）
            isRefreshing=false;
            wrapContentDom.style.transition=wrapContentDom.style.webkitTransition="all .5s";
            wrapContentDom.style.transform=wrapContentDom.style.webkitTransform="translateY(0px)";
            setTimeout(function(){
                //清除动画
                wrapContentDom.style.transition=wrapContentDom.style.webkitTransition="";
            },500)
        };
        //完成刷新回调
        that.refreshDone=function()
        {
            headerTextDom.innerText=that.contentdone;
            headerImgDom.src=that.contentdoneIcon;
            setTimeout(function(){
                that.closeRefresh();
            },500);
        };
        //初始化
        var init=function()
        {
            //渲染html
            renderContent();
            //绑定事件
            bindEvent();
        };
        init();
    }
    window.cuiPullRefresh=cuiPullRefresh
})();
