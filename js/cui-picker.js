//validate表单验证插件
(function(){
    "use strict";
    var cuiPicker=function(param,fn)
    {
        var that=this,
            domInput=null,
            pickerDom=null,
            initTop=0,
            itemOptionHeight=0,
            valueArr=null,//默认值数组
            valueIndexArr=[],//默认值的索引
            selectedValueArr=[],//已经选择的值
            itemsDomArr=[],//选择列表数组
            confirmBtnDom=null,//确认按钮
            cancelBtnDom=null;//取消按钮
        /*默认值*/
        that.defaults=
        {
                domStr:"",//容器
                type:"",//类型
                value:"",//默认值
                title:"请选择ssss",
                data:[[

                            {name:"iphone3",value:"1"},
                            {name:"iphone4",value:"2"},
                            {name:"iphone5",value:"3"}
                       ],
                       [
                           {name:"高通",value:"1"},
                           {name:"mtk",value:"2"},
                           {name:"德州",value:"3"}
                       ],
                       [
                           "324",
                           "234"
                       ]
                ],
                selectOk:function(selected)
                {
                    console.log(selected)
                }
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


        var
            //计算动画
            calcOffseTop=function(contentHeight,itemHeight,Y)
            {
                var count=0,
                    resultY=0;
                count=Math.floor(Y/itemHeight);
                resultY=count*itemHeight;
                if(resultY<=-(contentHeight-itemHeight))
                {
                    resultY=-(contentHeight-itemHeight);
                }
                if(resultY>=0)
                {
                    resultY=0;
                }
                return resultY
            },
            //渲染html
            renderContent=function()
            {
                //特定的类型
                if(that.defaults.type)
                {

                }
                //自定义
                else
                {
                    if(that.defaults.data&&that.defaults.data instanceof Array&&that.defaults.data.length)
                    {
                        var itemHtml='',
                            itemArr=[],
                            contentHtml='';
                        //遍历data的一级
                        itemArr=that.defaults.data;
                        for(var x=0;x<itemArr.length;x++)
                        {
                            var optionHtml="",
                                defaultOffseTop="",
                                valueIndex=-1

                            for(var y=0;y<itemArr[x].length;y++)
                            {
                                var cls="";
                                if(typeof itemArr[x][y]==="string")
                                {
                                    //默认值视图
                                    if(valueArr)
                                    {
                                        if(valueArr[x]===itemArr[x][y])
                                        {
                                            cls="cui-picker-item-option-active";
                                            //默认值滑动高度
                                            defaultOffseTop=50*y;
                                            //添加默认的索引
                                            valueIndex=y;
                                        }


                                    }

                                    optionHtml+='<div class="cui-picker-item-option '+cls+'" data-value="'+itemArr[x][y]+'">'+itemArr[x][y]+'</div>'
                                }
                                else
                                {
                                    //默认值视图
                                    if(valueArr)
                                    {
                                        if(valueArr[x]===itemArr[x][y].value)
                                        {
                                            cls="cui-picker-item-option-active";
                                            //默认值滑动高度
                                            defaultOffseTop=50*y;
                                            //添加默认的索引
                                            valueIndex=y;
                                        }


                                    }

                                    optionHtml+='<div  class="cui-picker-item-option '+cls+'" data-value="'+itemArr[x][y].value+'">'+itemArr[x][y].name+'</div>'
                                }
                            }

                            valueIndexArr.push(valueIndex);


                            itemHtml+=  '\t\t\t\t\t<div class="cui-picker-item-list">\n'+
                                            '\t\t\t\t\t<div style="-webkit-transform: translateY(-'+defaultOffseTop+'px)" class="cui-picker-item-select">\n'
                                                            +optionHtml+
                                            '\t\t\t\t\t</div>\n' +
                                            '\t\t\t\t\t<div class="cui-picker-item-selected"></div>\n'+
                                        '\t\t\t\t\t</div>\n';

                        }
                        contentHtml='\t<div class="cui-picker-shelter">\n' +
                                    '\t\t<div class="cui-picker-content">\n' +
                                    '\t\t\t<div class="cui-picker-header">\n' +
                                    '\t\t\t\t<div class="cui-picker-header-left">取消</div>\n' +
                                    '\t\t\t\t<div class="cui-picker-header-title">'+that.defaults.title+'</div>\n' +
                                    '\t\t\t\t<div class="cui-picker-header-right">确认</div>\n' +
                                    '\t\t\t</div>\n' +
                                    '\t\t\t<div class="cui-picker-item">\n'
                                            +itemHtml+
                                    '\t\t\t</div>\n' +
                                    '\t\t</div>\n' +
                                    '\t</div>\n' ;
                        //创建picker容器
                        pickerDom=document.createElement("div");
                        pickerDom.className="cui-picker";
                        pickerDom.innerHTML=contentHtml;
                        document.body.appendChild(pickerDom);
                    }
                    else
                    {
                        console.log("缺少data或data格式错误")
                    }
                }
            },
            bindClickEvent=function()
            {
                confirmBtnDom.addEventListener("click",function(e)
                {
                    //获取选中的值
                    var res={
                        array:selectedValueArr,
                        string:selectedValueArr.join(" "),
                        object:{}
                    }

                    that.defaults.selectOk(res)
                });
            },
            //触控事件
            bindTouchEvent=function(index,dom)
            {
                dom.addEventListener("touchstart",function(e)
                {
                    itemsDomArr[index].dom.style.transition="";
                    itemsDomArr[index].startY=e.changedTouches[0].pageY;
                    itemsDomArr[index].nowY=itemsDomArr[index].nowHelpY
                    itemsDomArr[index].timeInterval=setInterval(function(){
                        itemsDomArr[index].time++
                    },10)
                })
                dom.addEventListener("touchmove",function(e)
                {
                    itemsDomArr[index].moveY=e.changedTouches[0].pageY-itemsDomArr[index].startY;

                    itemsDomArr[index].dom.style.webkitTransform="translateY("+parseInt(itemsDomArr[index].nowY+itemsDomArr[index].moveY)+"px)"
                    itemsDomArr[index].nowHelpY=parseInt(itemsDomArr[index].nowY+itemsDomArr[index].moveY)
                })
                dom.addEventListener("touchend",function(e)
                {
                    clearInterval(itemsDomArr[index].timeInterval);
                    itemsDomArr[index].direction=itemsDomArr[index].moveY;
                    itemsDomArr[index].speed=itemsDomArr[index].direction/itemsDomArr[index].time;

                    var continueMoveY=0;


                    itemsDomArr[index].startY=0;
                    itemsDomArr[index].time=0;
                    itemsDomArr[index].nowY=itemsDomArr[index].nowHelpY;


                    itemsDomArr[index].dom.style.transition="all .5s";
                    if(itemsDomArr[index].moveY)
                    {
                        //根据速度 添加缓冲
                        continueMoveY=+(parseInt(itemsDomArr[index].speed)*8);
                        //缓冲移动距离
                        var shouldY=calcOffseTop(itemsDomArr[index].dom.offsetHeight,itemOptionHeight,itemsDomArr[index].nowY+continueMoveY);
                        //目前选择索引
                        itemsDomArr[index].index=Math.abs(shouldY/itemOptionHeight);
                        //动起来
                        itemsDomArr[index].dom.style.webkitTransform="translateY("+parseInt(shouldY)+"px)";
                        //选择的高亮
                        that.removeClass(itemsDomArr[index].dom.children,"cui-picker-item-option-active");

                        that.addClass(itemsDomArr[index].dom.children[itemsDomArr[index].index],"cui-picker-item-option-active");
                        itemsDomArr[index].nowHelpY=shouldY;

                        //给要返回的结果数组赋值（已经选中的值）
                        itemsDomArr[index].value=selectedValueArr[index]=itemsDomArr[index].dom.children[itemsDomArr[index].index].dataset["value"];

                    }
                    itemsDomArr[index].moveY=0;
                    console.log(selectedValueArr)

                })
            },
            init=function()
            {
                //获取目标
                if(that.defaults.domStr)
                {
                    if(typeof that.defaults.domStr==="string")
                    {
                        domInput=document.querySelector(that.defaults.domStr);
                    }
                    else if (typeof that.defaults.domStr==="object")//这里可能埋了个坑
                    {
                        domInput=that.defaults.domStr;
                    }
                    //获取默认值
                    if(that.defaults.value)
                    {
                        valueArr=that.defaults.value.trim().split(" ");
                    }
                    else if(domInput)
                    {

                        var inputvalue=domInput.value;

                        valueArr=inputvalue?inputvalue.split(" "):null;
                    }
                    renderContent();
                    var itemsContentDom=pickerDom.children[0].children[0].children[1].children;
                    //获取初始top
                    initTop=itemsContentDom[0].children[1].offsetTop;
                    itemOptionHeight=itemsContentDom[0].children[0].children[0].offsetHeight;
                    //获取item dom
                    for(var j=0;j<itemsContentDom.length;j++)
                    {
                        itemsContentDom[j].children[0].style.top=initTop+"px";
                        var value=valueArr?valueArr[j]:itemsContentDom[j].children[0].children[0].dataset['value'];
                        //给要返回的结果数组赋值（已经选中的值）
                        selectedValueArr[j]=value;
                        itemsDomArr.push(
                            {
                                dom:itemsContentDom[j].children[0],
                                startY:0,
                                moveY:0,
                                nowY:0,
                                selectedTop:initTop,
                                speed:0,
                                time:0,
                                timeInterval:null,
                                direction:0,
                                nowHelpY:valueIndexArr[j]!==-1?parseInt("-"+valueIndexArr[j])*50:0,
                                index:0,
                                value:value
                            });
                        bindTouchEvent(j,itemsContentDom[j]);
                    }


                    //获取确认按钮
                    var headerDom=pickerDom.children[0].children[0].children[0];
                    confirmBtnDom=headerDom.children[2];
                    //获取取消按钮
                    cancelBtnDom=headerDom.children[0];
                    bindClickEvent();
                }
                else
                {
                    console.log("缺少参数");
                }
            };

            init();


    };
    window.cuiPicker=cuiPicker;
})();