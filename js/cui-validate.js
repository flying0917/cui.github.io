//validate表单验证插件
(function(){
    "use strict";
    var cuiValidate=function(param,fn)
    {
        //验证规则
        var REGMAPPING ={
            'notempty': {
                'reg': /\S+/,
                    'tip': '一定要填写'
            },
            'chinese': {
                'reg': /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,
                    'tip': '只能为中文'
            },
            'letter': {
                'reg': /[A-Za-z]+$/,
                    'tip':'只能为英文'
            },
            'num': {
                'reg': /^([+-]?)\d*\.?\d+$/,
                    'tip':'只能为数字'
            },
            'idcard': {
                'reg': /^[1-9]([0-9]{14}|[0-9]{16}([0-9]|[xX]))$/,
                    'tip':'只能为身份证号码'
            },
            'mobile': {
                'reg': /^13[0-9]{9}|15[012356789][0-9]{8}|18[0256789][0-9]{8}|147[0-9]{8}$/,
                    'tip':'只能为手机号码'
            },
            'money': {
                'reg': /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/,
                    'tip': '只能为数额'
            },
            'tel': {
                'reg': /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/,
                    'tip': '只能为电话号码'
            },
            'zipcode': {
                'reg': /^\d{6}$/,
                    'tip': '只能为邮政编号'
            },
            'email': {
                'reg': /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                    'tip': '只能为邮箱'
            },
            'maxlength': {
                'tip': '最对只能输入'
            },
            'minlength': {
                'tip': '必须等于或超过'
            }
        },
        that=this,
        domInput=null,
        popDom=null,
        parentDom=null,
        domLeft=0,
        domTop=0,
        domHeight=0;
        //是否验证通过
        that.isValidate=false;
        /*默认值*/
        that.defaults=
        {
                domStr:"",//容器
                type:"",//类型
                reg:"",//当type为custom时可用
                tip:"",//提示信息
                count:""//当type为minlength 或者maxlength时可以用
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

        //显示提醒
        that.showPopModal=function(msg)
        {
            if(!popDom)
            {
                popDom=document.createElement("div");
                popDom.className="cui-popmodal cui-popmodal-validate cui-popmodal-down cui-popmodal-vertical-left";
                popDom.innerHTML='<div class="cui-popmodal-text">' + msg +'</div>';
                popDom.style.width="150px";
                popDom.style.opacity="0";


                popDom.style.left=domLeft+"px";
                popDom.style.top=domTop+domHeight+"px";
                popDom.style.transform=popDom.style.webkitTransform="translateY(-10px)";
                parentDom.appendChild(popDom);
                setTimeout(function(){
                    popDom.style.transform=popDom.style.webkitTransform="translate(0,0)";
                    popDom.style.opacity="1";
                },200)
            }
        };
        //隐藏提醒
        that.hidePopModal=function()
        {
            if(popDom)
            {
                popDom.style.transform=popDom.style.webkitTransform="translateY(-10px)";
                popDom.style.opacity="0";
                setTimeout(function()
                {
                    popDom.remove();
                    popDom=null;
                },400)
            }

        };
        //验证不通过的视图
        var notValidateView=function(text)
            {
                that.isValidate=false;
                setTimeout(function()
                {
                    that.removeClass(domInput,"cui-validate-success");
                    that.addClass(domInput,"cui-validate-error");
                },400);
                that.showPopModal(text);
            },
            //验证通过的视图
            validateView=function()
            {
                that.isValidate=true;
                setTimeout(function()
                {
                    that.removeClass(domInput,"cui-validate-error");
                    that.addClass(domInput,"cui-validate-success");
                },400);
                that.hidePopModal();
            },
            //绑定函数
            bindEvent=function()
            {
                domInput.addEventListener("change",function()
                {
                    var value=domInput.value;
                    if(!value&&that.defaults.type!=="notempty")//当为空而且类型不为必填时
                    {
                        that.isValidate=true;
                        that.removeClass(domInput,"cui-validate-error");
                        that.removeClass(domInput,"cui-validate-success");
                        that.hidePopModal();
                        return ;
                    }
                    var nowReg=null,
                        text="",
                        lengthOk=true;
                    if(that.defaults.type==="custom")//自定义验证
                    {
                        nowReg=that.defaults.reg;
                        text=that.defaults.tip;
                    }
                    else if((that.defaults.type==="maxlength")&&parseInt(that.defaults.count))//最大字符个数
                    {
                        if(value.length>parseInt(that.defaults.count))
                        {

                            lengthOk=false;
                            text=REGMAPPING[that.defaults.type]["tip"]+that.defaults.count+"个字符"
                        }
                    }
                    else if((that.defaults.type==="minlength")&&parseInt(that.defaults.count))//最小字符个数
                    {
                        if(value.length<=parseInt(that.defaults.count)-1)
                        {
                            lengthOk=false;
                            text=REGMAPPING[that.defaults.type]["tip"]+that.defaults.count+"个字符"
                        }
                    }
                    else//其他可选项验证
                    {
                        nowReg=REGMAPPING[that.defaults.type]["reg"];
                        text=REGMAPPING[that.defaults.type]["tip"];
                    }
                    if(nowReg)
                    {
                        if(!nowReg.test(value))//验证不通过
                        {
                            notValidateView(text);
                        }
                        else//验证通过
                        {
                            validateView();

                        }
                    }
                    else
                    {
                        if(!lengthOk)//验证不通过
                        {
                            notValidateView(text);
                        }
                        else//验证通过
                        {
                            validateView();

                        }
                    }

                })
            },
            init=function()
            {
                //获取目标
                if(that.defaults.domStr&&that.defaults.type)
                {
                    if(typeof that.defaults.domStr==="string")
                    {
                        domInput=document.querySelector(that.defaults.domStr);
                    }
                    else if (typeof that.defaults.domStr==="object")//这里可能埋了个坑
                    {
                        domInput=that.defaults.domStr;
                    }

                    //获取目标的left
                    domLeft=domInput.offsetLeft;
                    //获取目标的top
                    domTop=domInput.offsetTop;
                    //获取目标的height
                    domHeight=domInput.offsetHeight;
                    //获取目标dom的父节点
                    parentDom=domInput.parentNode;

                    bindEvent();
                }
                else
                {
                    console.log("缺少参数");
                }
            };

            init();


    };
    window.cuiValidate=cuiValidate;
})();