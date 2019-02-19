//下拉刷新插件  @todo 王榕 这个可能复杂点 嘻嘻
(function(){
    "use strict";
    cuiPullRefresh=function(param,fn)
    {
        //是否开始
        this.start=false;
        //从手指触到屏幕时的Y坐标
        this.startPageY=0;
        //从手指触到屏幕时的Y坐标
        this.startPageX=0;
        //刷新头的高度
        this.refreshHeaderHeight=50;
        //容器里面的html字符串
        this.contentHtml="";
        //下拉的距离的触发点
        this.triggerDistance=parseInt(param.triggerDistance)?parseInt(param.triggerDistance):200;
        //是否在刷新
        this.isRefreshing=false;
        //下拉时
        this.contentdownIcon=param.contentdownIcon?param.contentdownIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        this.contentdown=param.contentdown?param.contentdown:"下拉刷新";
        //放开时
        this.contentoverIcon=param.contentoverIcon?param.contentoverIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        this.contentover=param.contentover?param.contentover:"松开刷新";
        //刷新时
        this.contentrefreshIcon=param.contentrefreshIcon?param.contentrefreshIcon:"http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        this.contentrefresh=param.contentrefresh?param.contentrefresh:"刷新中";
        //完成刷新时
        this.contentdoneIcon="http://static.oschina.net/uploads/img/201409/26074001_bzCh.gif";
        this.contentdone=param.contentdone?param.contentdone:"完成刷新";
        //触发刷新时的回调
        this.callback=(fn&&typeof fn==="function")?fn:(function(){});
        if(!param.domStr)
        {
            console.log("缺少容器选择字符串");
            return false;
        }
        //获取容器
        this.refresContentDom=param.domStr?document.querySelector(param.domStr):document.querySelector(".cui-refresh-content");
        if(!this.refresContentDom)
        {
            console.log("缺少容器选择字符串");
            return false;
        }
        //初始化
        this.init=function()
        {
            //渲染html
            this.renderContent();
            //绑定事件
            this.bindEvent();
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
        //渲染html
        this.renderContent=function()
        {
            var temHtml="";
            this.addClass(this.refresContentDom,"cui-refresh-content");
            this.contentHtml=this.refresContentDom.innerHTML;
            temHtml='<div class="cui-refresh-wrap" style="-webkit-transform: translateY(0px);\n' +
                '\t\t\t-moz-transform: translateY(0px);\n' +
                '\t\t\t-ms-transform: translateY(0px);\n' +
                '\t\t\t-o-transform: translateY(0px);\n' +
                '\t\t\ttransform: translateY(0px);">' +
                '<div class="cui-refresh-header" style="line-height:'+this.refreshHeaderHeight+'px;height:'+this.refreshHeaderHeight+'px;top:-'+this.refreshHeaderHeight+'px">' +
                '<img src="'+this.contentdownIcon+'">'+
                '<span>'+this.contentdown+'</span>' +
                '</div>'
                +this.contentHtml+
                '</div>';
            this.refresContentDom.innerHTML=temHtml;
            //要拖动的容器
            this.wrapContentDom=this.refresContentDom.children[0];
            //刷新的头
            this.headerContentDom=this.wrapContentDom.children[0];
            //刷新文本提示
            this.headerTextDom=this.headerContentDom.children[1];
            //刷新提示图标
            this.headerImgDom=this.headerContentDom.children[0];
        };
        //绑定事件
        this.bindEvent=function()
        {
            var that=this;
            that.wrapContentDom.addEventListener("touchstart",function(e)
            {
                if(!that.isRefreshing&&that.refresContentDom.scrollTop===0)//当容器的滚动条滚动距离为0和不是在刷新状态时调用
                {
                    that.start=true;//开始
                    that.startPageY=e.changedTouches[0].pageY;//从手指触到屏幕时的Y坐标的赋值
                    that.startPageX=e.changedTouches[0].pageX;//从手指触到屏幕时的X坐标的赋值
                }
            });
            that.wrapContentDom.addEventListener("touchmove",function(e)
            {
                if(!that.isRefreshing&&that.refresContentDom.scrollTop===0)//当容器的滚动条滚动距离为0和不是在刷新状态时调用
                {
                    //手指滑动的Y长度
                    that.offsetTop=e.changedTouches[0].pageY-that.startPageY;
                    //手指滑动的X长度
                    that.offsetLeft=e.changedTouches[0].pageX-that.startPageX;

                    if(that.start&&that.offsetTop>0&&Math.abs(that.offsetTop/that.offsetLeft)>1.5)//下划角度超过45度时不干活
                    {
                        //下拉的动画
                        that.wrapContentDom.style.transform=that.wrapContentDom.style.webkitTransform="translateY("+that.offsetTop+"px)";
                        //是否大于下拉的距离的触发点
                        if(that.offsetTop>that.triggerDistance)
                        {
                            that.headerTextDom.innerText=that.contentover;
                            that.headerImgDom.src=that.contentoverIcon;
                        }
                        else
                        {
                            that.headerTextDom.innerText=that.contentdown;
                            that.headerImgDom.src=that.contentdownIcon;
                        }
                    }
                }
            });
            that.wrapContentDom.addEventListener("touchend",function(e)
            {
                if(!that.isRefreshing&&that.start&&that.offsetTop>-that.refreshHeaderHeight)
                {
                    that.start=false;
                    that.wrapContentDom.style.transition=that.wrapContentDom.style.webkitTransition="all .5s";
                    //是否大于下拉的距离的触发点
                    if(that.offsetTop>that.triggerDistance)
                    {
                        //显示刷新中的动画
                        that.wrapContentDom.style.transform=that.wrapContentDom.style.webkitTransform="translateY("+that.refreshHeaderHeight+"px)";
                        setTimeout(function(){
                            that.wrapContentDom.style.transition=that.wrapContentDom.style.webkitTransition="";
                            //改变状态（正在刷新）
                            that.isRefreshing=true;
                            that.headerTextDom.innerText=that.contentrefresh;
                            that.headerImgDom.src=that.contentrefreshIcon;
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
        this.closeRefresh=function()
        {
            var that=this;
            //改变状态（不在刷新）
            that.isRefreshing=false;
            that.wrapContentDom.style.transition=that.wrapContentDom.style.webkitTransition="all .5s";
            that.wrapContentDom.style.transform=that.wrapContentDom.style.webkitTransform="translateY(0px)";
            setTimeout(function(){
                //清除动画
                that.wrapContentDom.style.transition=that.wrapContentDom.style.webkitTransition="";
            },500)
        };
        //完成刷新回调
        this.refreshDone=function()
        {
            var that=this;
            that.headerTextDom.innerText=that.contentdone;
            that.headerImgDom.src=that.contentdoneIcon;
            setTimeout(function(){
                that.closeRefresh();
            },500);
        };
        this.init();
    }
    window.cuiPullRefresh=cuiPullRefresh
})();