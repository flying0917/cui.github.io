//加载中插件
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
            }
        },
        that=this,
        domInput=null,
        domLeft=0,
        domTop=0;
        /*默认值*/
        that.defaults=
        {
                domStr:"",
                type:"notempty"
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
        var bindEvent=function()
            {

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
                }
                //获取目标的left
                domLeft=domInput.offsetLeft;
                //获取目标的top
                domTop=domInput.offsetTop;
            }


    };
    window.cuiValidate=cuiValidate;
})();