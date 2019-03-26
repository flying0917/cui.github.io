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
            cancelBtnDom=null,//取消按钮
            nowDayCount=31;

        /*默认值*/
        that.defaults=
        {
                inputDom:null,//容器
                type:"",//类型
                value:"",//默认值
                maxyear:2019,//当type不为空和等于date dateTime时有用
                minyear:1989,//当type不为空和等于date dateTime时有用
                title:"请选择",
                data:[[

                            {name:"iphone3",value:"1"},
                            {name:"iphone4",value:"2"},
                            {name:"iphone5",value:"3"}
                       ],
                       [
                           {name:"高通",value:"1",children:[
                                                                {name:"高通800"},
                                                                {name:"高通810"},
                                                                {name:"高通820"},
                                                                {name:"高通835"},
                                                                {name:"高通845"}
                                                           ]},
                           {name:"苹果",value:"2",children:[
                                                               {name:"a8"},
                                                               {name:"a9"},
                                                               {name:"a10"},
                                                               {name:"a11"},
                                                               {name:"a12"}
                                                           ]},
                           {name:"德州",value:"3"}
                       ],
                       [
                           "324",
                           "234"
                       ]
                ],
                separate:[],//分隔字符 其的长度等于（列数-1）
                onOk:function(selected)//点击确认回调事件
                {
                    //console.log(selected)
                },
                onShow:function()//当展示picker时回调事件
                {

                },
                onCancel:function()//当点击取消时回调事件
                {

                },
                changeCol:function(colIndex,data)//当改变其中一列时 colIndex 为目前在选的列  data 为目前选中的行数据
                {

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
            //选择月份时更新对应的日
            handleUpdateDayForMonth=function()
            {
                that.defaults.changeCol=function(colIndex,data)
                {
                    if(colIndex===1)
                    {
                        var d=new Date(selectedValueArr[0],data,0).getDate(),
                            dayItemDom=itemsDomArr[colIndex+1];

                            console.log(dayItemDom)

                        if(d!==nowDayCount)
                        {
                            if(d>nowDayCount)
                            {

                                var temHtml="";
                                for(var x=1;x<=d-nowDayCount;x++)
                                {
                                   temHtml+='<div class="cui-picker-item-option">'+(nowDayCount+x)+'</div>'
                                }
                                var nowHtml=dayItemDom.dom.innerHTML;
                                //添加日
                                dayItemDom.dom.innerHTML=nowHtml+temHtml;
                            }
                            else
                            {

                                var offsetCount=nowDayCount-d;
                                //减少日
                                for(var y=1;y<=offsetCount;y++)
                                {
                                    dayItemDom.dom.children[nowDayCount-y].remove();
                                }
                                console.log(dayItemDom.nowHelpY)

                                dayItemDom.nowHelpY=0;
                                dayItemDom.dom.style.webkitTransform='translateY('+dayItemDom.nowHelpY+'px)'

                            }
                            nowDayCount=d;
                        }


                    }
                }
            },
            //处理日期的数据(2018-3-5)
            handleDateData=function()
            {
                var datedata=[];
                for(var dateItem=0;dateItem<3;dateItem++)
                {
                    //年
                    if(dateItem===0)
                    {
                        var yearItemData=[],
                            maxyear=parseInt(that.defaults.maxyear),
                            minyear=parseInt(that.defaults.minyear);
                        for(var yearItem=minyear;yearItem<=maxyear;yearItem++)
                        {
                            yearItemData.push(yearItem);
                        }
                    }
                    //月
                    if(dateItem===1)
                    {
                        var monthItemData=[];
                        for(var monthItem=1;monthItem<13;monthItem++)
                        {
                            monthItem=monthItem<10?"0"+monthItem:monthItem+"";
                            monthItemData.push(monthItem)
                        }
                    }
                    //日
                    if(dateItem===2)
                    {
                        var dayItemData=[];
                        for(var dayItem=1;dayItem<=nowDayCount;dayItem++)
                        {
                            dayItem=dayItem<10?"0"+dayItem:dayItem;
                            dayItemData.push(dayItem)
                        }
                    }
                }
                datedata.push(yearItemData)
                datedata.push(monthItemData)
                datedata.push(dayItemData)
                handleUpdateDayForMonth();
                return datedata;
            },
            //处理时间的数据（19:39）
            handleTimeData=function()
            {
                var timeData=[];
                for(var timeItem=0;timeItem<2;timeItem++)
                {
                    //时
                    var houseItemData=[];
                    for(var houseItem=0;houseItem<=23;houseItem++)
                    {
                        houseItem=houseItem<10?"0"+houseItem:houseItem;
                        houseItemData.push(houseItem);
                    }
                    //分
                    var mintuesItemData=[];
                    for(var mintuesItem=0;mintuesItem<=59;mintuesItem++)
                    {
                        mintuesItem=mintuesItem<10?"0"+mintuesItem:mintuesItem;
                        mintuesItemData.push(mintuesItem);
                    }

                }
                timeData.push(houseItemData);
                timeData.push(mintuesItemData);
                return timeData;
            },
            //处理三级联动（地点）
            handlePlaceData=function()
            {

            },
            //处理日期时间的数据（2018-3-5 19:39）
            handleDateTimeData=function()
            {
                handleUpdateDayForMonth()
                return handleDateData().concat(handleTimeData())
            },

            //根据type给data赋对应的数组
            switchType=function()
            {
                //特定的类型
                var type=that.defaults.type;
                if(that.defaults.type)
                {
                    switch(type)
                    {
                        case 'date':that.defaults.data=handleDateData();break;
                        case 'place':that.defaults.data=handlePlaceData();break;
                        case 'datetime':that.defaults.data=handleDateTimeData();break;
                        case 'time':that.defaults.data=handleTimeData();break;
                    }
                }
            },
            //渲染html
            renderContent=function()
            {
                    switchType();
                    if(that.defaults.data&&that.defaults.data instanceof Array&&that.defaults.data.length)
                    {
                        var itemHtml='',
                            itemArr=[],
                            contentHtml='';
                        //遍历data的一级
                        itemArr=that.defaults.data;

                        //选择状态
                        if(selectedValueArr&&selectedValueArr.length)
                        {
                            valueArr=selectedValueArr;
                        }
                        valueIndexArr=[];

                        for(var x=0;x<itemArr.length;x++)
                        {
                            var optionHtml="",
                                defaultOffseTop="",
                                valueIndex=-1
                            for(var y=0;y<itemArr[x].length;y++)
                            {
                                var cls="";
                                if(typeof itemArr[x][y]==="string"||typeof itemArr[x][y]==="number")
                                {
                                    //默认值视图
                                    if(valueArr)
                                    {
                                        if(valueArr[x]===itemArr[x][y]+"")
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
                                        if(valueArr[x]===itemArr[x][y].value+"")
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
            },
            //input的点击事件
            bindInputClicEvent=function()
            {
                domInput?domInput.addEventListener("click",function()
                {
                    that.showPicker();
                }):"";
            },
            //picker内点击事件
            bindClickEvent=function()
            {
                confirmBtnDom.addEventListener("click",function(e)
                {
                    //获取选中的值
                    var res={
                        array:selectedValueArr,
                        string:handleFormatFromArr(selectedValueArr)
                    }
                    //点击确认之后的回调
                    that.defaults.onOk.call(that,res);
                    if(domInput)
                    {
                        if(domInput.tagName==='INPUT')
                        {
                            domInput.value=res.string
                        }
                    }
                    that.hidePicker();
                });
                cancelBtnDom.addEventListener("click",function()
                {
                    valueIndexArr=[];
                    selectedValueArr=[];
                    that.hidePicker();
                    that.defaults.onCancel();
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
                });
                dom.addEventListener("touchmove",function(e)
                {
                    e.preventDefault();//去掉ios的橡皮筋效果
                    itemsDomArr[index].moveY=e.changedTouches[0].pageY-itemsDomArr[index].startY;

                    itemsDomArr[index].dom.style.webkitTransform="translateY("+parseInt(itemsDomArr[index].nowY+itemsDomArr[index].moveY)+"px)"
                    itemsDomArr[index].nowHelpY=parseInt(itemsDomArr[index].nowY+itemsDomArr[index].moveY)
                });
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
                        //调用列改变时api
                        that.defaults.changeCol.call(that,index,that.defaults.data[index][itemsDomArr[index].index])


                    }
                    itemsDomArr[index].moveY=0;

                })
            },
            init=function()
            {
                if(that.defaults.inputDom)
                {
                    if(typeof that.defaults.inputDom==="string")
                    {
                        domInput=document.querySelector(that.defaults.inputDom);
                    }
                    else if (typeof that.defaults.inputDom==="object"&&that.defaults.inputDom.tagName)//这里可能埋了个坑
                    {
                        domInput=that.defaults.inputDom;
                    }
                    if(domInput)
                    {
                        if(domInput.tagName==='INPUT')
                        {
                            domInput.readOnly=true;
                        }
                    }
                }

                bindInputClicEvent();
                //that.showPicker();
            },
            //（从字符串里面）处理默认值的格式
            handleFormat=function(v)
            {
              var separateArr=that.defaults.separate,
                  value=v;
              if(separateArr&&separateArr instanceof Array&&separateArr.length)
              {
                  separateArr.map(function(item){
                      value=value.replace(item," ")
                  })
              }
              return value;
            },
            //（从数组里面）处理默认值的格式
            handleFormatFromArr=function(vArr)
            {
                var separateArr=that.defaults.separate,
                    valueArr=vArr,
                    result="";
                if(separateArr&&separateArr instanceof Array&&separateArr.length)
                {
                    valueArr.map(function(item,index){
                        var sep="";
                        if(separateArr[index])
                        {
                            sep=separateArr[index];
                        }
                        else
                        {
                            sep=" ";
                        }
                        result+=item+sep;
                    })
                }
                else
                {
                    result=valueArr.join(" ")
                }
                return result.trim();
            },
            getDefault=function()
            {
                if(that.defaults.type||!(that.defaults.separate instanceof Array)||!that.defaults.separate.length)
                {
                    switch (that.defaults.type)
                    {
                        case "date":that.defaults.separate=["-","-"];break;
                        case "datetime":that.defaults.separate=["-","-"," ",":"];break;
                        case "time":that.defaults.separate=[":"];break;
                    }
                }
                //获取默认值
                if(that.defaults.value)
                {
                    valueArr=handleFormat(that.defaults.value.trim()).trim().split(" ");
                }
                else if(domInput)
                {
                    var inputvalue=handleFormat(domInput.value.trim());
                    valueArr=inputvalue?inputvalue.split(" "):null;
                }
            };
        //显示picker
        that.showPicker=function(newParam)
        {

            if(!pickerDom)
            {
                getDefault();
                //新赋值
                newParam?that.extend(that.defaults,newParam):"";
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

                //展示动画
                setTimeout(function(){
                    that.addClass(pickerDom,"cui-picker-active");
                },0)
                //展示后的回调
                that.defaults.onShow.call(that);
            }
        }

        //隐藏picker
        that.hidePicker=function()
        {
            that.removeClass(pickerDom,"cui-picker-active");
            setTimeout(function(){
                //销毁
                pickerDom.remove();
                pickerDom=null;
                itemsDomArr=[];
            },600)
        };

        init();


    };
    window.cuiPicker=cuiPicker;
})();
