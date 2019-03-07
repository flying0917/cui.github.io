//滚动到底部插件
(function(){
    "use strict";
    var cuiScroll=function(dom,fn)
    {
        var callback=fn,
            that=this;
        that.dom=null;
        if(typeof dom==="string")
        {
            that.dom=document.querySelector(dom)
        }
        else if(typeof dom==="object")
        {
            that.dom=dom;
        }
        else
        {
            return false;
        }
        that.dom.addEventListener("scroll",function(e){
            var that=e.target;
            if (timeout) {
                clearTimeout(timeout);
            }
            //节流
            timeout=setTimeout(function(){
                var scrollTop=that.scrollTop;
                var scrollHeight=that.scrollHeight;
                var windowHeight=that.offsetHeight;
                if(windowHeight+scrollTop>=scrollHeight)
                {
                    //回调
                    callback();
                }
            },100);

        });
    };
    window.cuiScroll=cuiScroll;
})();