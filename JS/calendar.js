/**
 * Created by ranyu on 2016/4/12.
 */
/*
定义几个全局变量，年、月、日*/

var today=new Date();
var toYear=today.getFullYear();
var toMon=today.getMonth()+1;
var tDay=today.getDate();


/*页面进来就加载*/
$(function(){
    clear();
    $("#nian").html(toYear);
    $("#yue").html(toMon);
    //$("#calID"+i).html(toYear);

    drawCalendar(toYear,toMon);
    dateContentAll.showYearContent();

    /*年份递减*/
    $("#nianjian").click(function() {
        dateContentAll.goPrevYear();

    });
    /*年份递加*/
    $("#nianjia").click(function() {
        dateContentAll.goNextYear();

    });

    /*月份递减*/
    $("#yuejian").click(function() {

        dateContentAll.goPrevMonth();
    });

    /*月份递加*/
    $("#yuejia").click(function() {
        dateContentAll.goNextMonth();

    });
});

/*绘制日历主体*/
/*蔡勒（Zeller）公式：w=y+[y/4]+[c/4]-2c+[26(m+1)/10]+d-1
 公式中的符号含义如下，w：星期；c：世纪-1；y：年（两位数）；m：月（m大于等于3，小于等于14，
 即在蔡勒公式中，某年的1、2月要看作上一年的13、14月来计算，比如2003年1月1日要看作2002年的13月1日来计算）；
 d：日；[ ]代表取整，即只要整数部分。(C是世纪数减一，y是年份后两位，M是月份，d是日数。1月和2月要按上一年的13月和 14月来算，这时C和y均按上一年取值。)

*/
function drawCalendar(Y,M){
    var year=Y;
    var month=M;
    calendar(year,month);
}
function calendar(Y,M){     //绘制日历，包括阳历，公历，节日，渲染页面
    /*公历部分*/
    var day=1;
    var year=Y;
    var Month=M;
    if(Month==1){          //蔡勒公式本年一月，二月对应上一年13,14月
        Month=13;
        year=year-1;
    }
    if(Month==2)
    {
        Month=14;
        year=year-1;
    }
    var yearTwo=year%100;   //蔡勒公式计算出某年某月某日对应星期几
    var shiji=Math.floor(year/100);
    var week=((yearTwo+Math.floor(yearTwo/4)+Math.floor(shiji/4)-2*shiji+Math.floor(26*(Month+1)/10))+day-1)%7; //计算某年某月的第一天是星期几

    if(week<0){
        week=week+7;
    }

    var MonthLen=31;//初始化每月31天
    if(M==2){          //判断是否是闰月
        if(yearTwo==0){
            if(year%400==0){
                MonthLen=29;
            }
            else{
                MonthLen=28;
            }
        }
        else{
            if(year%4==0){
                MonthLen=29;
            }
            else{
                MonthLen=28;
            }
        }
    }
    else if(M==4||M==6||M==9||M==11){
        MonthLen=30;
    }

    var jintian=new Date();
    var jinnian=jintian.getFullYear();
    var jinyue=jintian.getMonth()+1;
    var jinri=jintian.getDate();

    var tmp=1; //初始化第一天

    for(var i=week;i<42;i++){        //阳历与农历渲染部分
        if(tmp<=MonthLen){
            if(M!=1){
                var solar=new Date(Y,M-1,tmp);
            }
            else if(Y==1900&&M==1){
                var solar=new Date(Y,M,tmp);
            }
            else{
                var solar=new Date(Y,M-1,tmp);
            }
            var lunar=new Lunar(solar);
            var lunarDate=cDay(lunar.day);
            $("#calID"+i).html(tmp);
            $("#secondCalID"+i).html(lunarDate);

            if(M==1&&tmp==1){                     //判断国际节日
                $("#secondCalID"+i).html("元旦");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==9&&tmp==10){
                $("#secondCalID"+i).html("教师节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==10&&tmp==1){
                $("#secondCalID"+i).html("国庆节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(cMonth(lunar.month)=='正月'&&cDay(lunar.day)=='初一'){
                $("#secondCalID"+i).html("春节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==5&&tmp==1){
                $("#secondCalID"+i).html("国际劳动节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(cMonth(lunar.month)=='五月'&&cDay(lunar.day)=='初五'){
                $("#secondCalID"+i).html("端午节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(cMonth(lunar.month)=='八月'&&cDay(lunar.day)=='十五'){
                $("#secondCalID"+i).html("中秋节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==2&&tmp==14){
                $("#secondCalID"+i).html("情人节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==3&&tmp==8){
                $("#secondCalID"+i).html("妇女节");
                $("#secondCalID"+i).addClass("holiday");
            }
            if(M==8&&tmp==1){
                $("#secondCalID"+i).html("八一建军节");
                $("#secondCalID"+i).addClass("holiday");
            }



            if((Y==jinnian&&M==jinyue)&&tmp==jinri){
                $("#Kobe"+i).addClass("today");
            }

            tmp++;
        }
    }
}

var DownStepSize=5;  //下拉部分步长
var DownClickCountQ=0; //点击次数(前进)
var DownClickCountH=0; //点击次数(后退)
/*全局对象，这是最重要的部分，对日历的操作，包括上一年，下一年，下拉菜单里面选择日期，选择某个节日都封装在这里*/
var dateContentAll={
    currYear : -1,
    currMonth : -1,

    minYear : 1900,
    maxYear : 2049,


    TongJiYear : 0,
    TongJiMonth : 0,

    goPrevYear:function(){
        this.prevYear();
    },
    goNextYear:function(){
        this.nextYear();
    },
    goPrevMonth:function(){
        this.prevMonth();
    },
    goNextMonth:function(){
        this.nextMonth();
    },


    prevYear:function(){
        var year=toYear-1;
        if(year>=this.minYear){
            //alert("ni hao");
            toYear=year;
            this.commit();
        }
        this.cancel();

    },
    prevMonth:function(){
        var month=toMon-1;
        if(month==0){
            var year=toYear-1;
            if(year>=this.minYear){
                month=12;
                toMon=month;
                toYear=year;
            }
            else{
                month=1;
                toMon=month;
            }
        }
        else{
            toMon=month;
        }
        this.commit();
        this.cancel();

    },
    nextYear:function(){
        var year=toYear+1;
        if(year<=this.maxYear){
            toYear=year;
            this.commit();
        }
        this.cancel();
    },
    nextMonth:function(){
        var month=toMon+1;
        if(month==13){
            var year=toYear+1;
            if(year<=this.maxYear){
                month=1;
                toMon=month;
                toYear=year;
            }
            else{
                month=12;
                toMon=month;
            }
        }
        else{
            toMon=month;
        }
        this.commit();
        this.cancel();
    },

    /*下拉菜单部分*/
    showYearContent:function(){         //点击下拉菜单，初始化下拉中的年
        this.currYear=toYear;
        if((this.currYear-2)>=this.minYear && (this.currYear+2)<=this.maxYear){
            var tmp=this.currYear-2;
            var count=5;
                for(var j=0;j<5;j++){
                    if(count-- > 0){
                        $("#headContent"+j).html(tmp++);
                    }
                }
        }

    },
    show:function(){           //显示下拉菜单，并选中当前月年。
        /*$("#SM"+1).css({"color":"red"});*/
        /*var jintian=new Date();
        var jinnian=jintian.getFullYear();
        var jinyue=jintian.getMonth()+1;*/

        this.TongJiYear=toYear;
        this.TongJiMonth=toMon;

        for(var i=0;i<5;i++){
            var tmp=parseInt($("#headContent"+i).html());
            if(toYear==tmp){
                $("#headContent"+i).removeClass("unChoseYear");
                $("#headContent"+i).addClass("choseToYear");
            }
            else{
                $("#headContent"+i).removeClass("choseToYear");
                $("#headContent"+i).addClass("unChoseYear");
            }
        }
        for(var j=1;j<=12;j++){
            if(toMon==j){
                $("#SM"+j).addClass("choseToMonth");
            }
            else{
                $("#SM"+j).removeClass("choseToMonth");
            }
        }

        $("#dateDown").css({display:'block'});

    },
    config:function(){                //确认按钮
        clear();
        $("#nian").html(this.TongJiYear);
        $("#yue").html(this.TongJiMonth);
        drawCalendar(this.TongJiYear,this.TongJiMonth);

        toYear=this.TongJiYear;
        toMon=this.TongJiMonth;

        this.cancel();
    },
    cancel:function(){             //取消按钮
        $("#dateDown").css({display:'none'});
        DownClickCountQ=0;
        DownClickCountH=0;
        this.showYearContent();
    },
    backToToday:function(){        //回到今天
        clear();
        var jintian=new Date();
        var jinnian=jintian.getFullYear();
        var jinyue=jintian.getMonth()+1;
        $("#nian").html(jinnian);
        $("#yue").html(jinyue);
        drawCalendar(jinnian,jinyue);
        toYear=jinnian;
        toMon=jinyue;
        this.cancel();
    },
    houtui:function(){               //下拉中左箭头实现年份的区间选择（一次5个年份）
        this.DownClear();
        DownClickCountH=DownClickCountH+1;
        this.currYear=toYear+DownStepSize*DownClickCountQ-DownStepSize*DownClickCountH;
        if((this.currYear>=this.minYear)){
            if((this.currYear-2)>=this.minYear && (this.currYear+2)<=this.maxYear){
                var tmp=this.currYear-2;
                var count=5;
                for(var j=0;j<5;j++){
                    if(count-- > 0){
                        $("#headContent"+j).html(tmp);
                        tmp=tmp+1;
                    }
                }
            }
            else if((this.currYear-2)<=this.minYear){
                $("#headContent0").html(1900);
                $("#headContent1").html(1901);
                $("#headContent2").html(1902);
                $("#headContent3").html(1903);
                $("#headContent4").html(1904);
            }
        }

    },
    qianjin:function(){                 //下拉中右箭头实现年份的区间选择（一次5个年份）
        this.DownClear();
        DownClickCountQ=DownClickCountQ+1;
        this.currYear=toYear-DownStepSize*DownClickCountH+DownStepSize*DownClickCountQ;
        if((this.currYear)<=this.maxYear){
            if((this.currYear-2)>this.minYear && (this.currYear+2)<this.maxYear){
                var tmp=this.currYear-2;
                var count=5;
                for(var j=0;j<5;j++){
                    if(count-- > 0){
                        $("#headContent"+j).html(tmp);
                        tmp=tmp+1;
                    }
                }
            }
            else if((this.currYear+2)>=this.maxYear){
                $("#headContent0").html(2045);
                $("#headContent1").html(2046);
                $("#headContent2").html(2047);
                $("#headContent3").html(2048);
                $("#headContent4").html(2049);
            }
        }

    },
    setMonth:function(Mon){                 //选中某月后，变红
        this.TongJiMonth=Mon;
        for(var i=1;i<=12;i++){
            if(Mon==i){
                $("#SM"+i).addClass("choseToMonth");
            }
            else{
                $("#SM"+i).removeClass("choseToMonth");
            }
        }

    },
    getYear:function(self){               //选中某年后，变红
        var yu=$(self).html();
        this.TongJiYear=parseInt(yu);
        console.log(yu);
        for(var i=0;i<5;i++){
            var tmp=$("#headContent"+i).html();
            if(yu==tmp){
                console.log(i);
                $("#headContent"+i).removeClass("unChoseYear");
                $("#headContent"+i).addClass("choseToYear");
            }
            else{
                $("#headContent"+i).removeClass("choseToYear");
                $("#headContent"+i).addClass("unChoseYear");
            }
        }
    },
    DownClear:function(){                 //下拉中的清除函数

      for(var i=0;i<5;i++){
          $("#headContent"+i).removeClass("choseToYear");
          $("#headContent"+i).addClass("unChoseYear");
      }
    },

    /*节日部分*/
    holiday:function(M){
        clear();
        $("#nian").html(toYear);
        $("#yue").html(M);
        calendar(toYear,M);
        toMon=M;
    },

    commit:function(){
        clear();
        $("#nian").html(toYear);
        $("#yue").html(toMon);
        calendar(toYear,toMon);
    }
};

/*数据清除，即每次上一年或者上一月等都要先清除之前在日历页面上的数据*/
function clear(){
    for(var i=0;i<42;i++){
        $("#calID"+i).html(" ");
        $("#secondCalID"+i).html(" ");
        $("#Kobe"+i).removeClass("today");
        $("#secondCalID"+i).removeClass("holiday");
    }
}


/*农历相关参数  该部分代码部分来自网上*/
/*从1900年到2049年*/
var   lunarRan=new   Array(
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0);


var   GeStr   =   new   Array('日','一','二','三','四','五','六','七','八','九','十');
var   ShiStr   =   new   Array('初','十','廿','卅','　');


/*农历相关日期计算*/
//  传回农历   y年的总天数
function   lYearDays(y)   {
    var   i,   sum   =   348
    for(i=0x8000;   i>0x8;   i>>=1)   sum   +=   (lunarRan[y-1900]   &   i)?   1:   0
    return(sum+leapDays(y))
}

//   传回农历   y年闰月的天数
function   leapDays(y)   {
    if(leapMonth(y))     return((lunarRan[y-1900]   &   0x10000)?   30:   29)
    else   return(0)
}

//  传回农历   y年闰哪个月（1-12,没闰月传回 0
function   leapMonth(y)   {
    return(lunarRan[y-1900]   &   0xf)
}

//  传回农历   y年m月的总天数
function   monthDays(y,m)   {
    return(   (lunarRan[y-1900]   &   (0x10000>>m))?   30:   29   )
}

//  算出农历,   传入日期物件,   传回农历日期物件
//  阳历到农历的转换，输入为阳历日期，输出为农历几月几日，该物件属性有(.year   .month   .day   .isLeap   .yearCyl   .dayCyl   .monCyl)
function   Lunar(objDate)   {

    var   i,   leap=0,   temp=0;
    var   baseDate   =   new   Date(1900,0,31);
    var   offset       =   (objDate   -   baseDate)/86400000;

    this.dayCyl   =   offset   +   40;
    this.monCyl   =   14;

    for(i=1900;   i<2050   &&   offset>0;   i++)   {
        temp   =   lYearDays(i);
        offset   -=   temp;
        this.monCyl   +=   12;
    }
    if(offset<0)   {
        offset   +=   temp;
        i--;
        this.monCyl   -=   12;
    }

    this.year   =   i;
    this.yearCyl   =   i-1864;

    leap   =   leapMonth(i);   //闰哪个月
    this.isLeap   =   false;

    for(i=1;   i<13   &&   offset>0;   i++)   {
        //闰月
        if(leap>0   &&   i==(leap+1)   &&   this.isLeap==false)
        {   --i;   this.isLeap   =   true;   temp   =   leapDays(this.year);   }
        else
        {   temp   =   monthDays(this.year,   i);   }

        //解除闰月
        if(this.isLeap==true   &&   i==(leap+1))   this.isLeap   =   false;

        offset   -=   temp;
        if(this.isLeap   ==   false)   this.monCyl   ++
    }
    if(offset==0   &&   leap>0   &&   i==leap+1)
        if(this.isLeap)
        {   this.isLeap   =   false;   }
        else
        {   this.isLeap   =   true;   --i;   --this.monCyl;}

    if(offset<0){   offset   +=   temp;   --i;   --this.monCyl;   }

    this.month   =   i;
    this.day   =   offset   +   1;
}
//   中文日期
function   cDay(d){
    var   s;

    switch   (d)   {
        case   10:
            s   =   '初十';   break;
        case   20:
            s   =   '二十';   break;
            break;
        case   30:
            s   =   '三十';   break;
            break;
        default   :
            s   =   ShiStr[Math.floor(d/10)];
            s   +=   GeStr[d%10];
    }
    return(s);
}
//  中文月份
function   cMonth(m){
    var   s;

    switch   (m)   {
        case   1:
            s   =   '正月';   break;
        case   2:
            s   =   '二月';   break;
        case   3:
            s   =   '三月';   break;
        case   4:
            s   =   '四月';   break;
        case   5:
            s   =   '五月';   break;
        case   6:
            s   =   '六月';   break;
        case   7:
            s   =   '七月';   break;
        case   8:
            s   =   '八月';   break;
        case   9:
            s   =   '九月';   break;
        case   10:
            s   =   '十月';   break;
        case   11:
            s   =   '十一月';   break;
        case   12:
            s   =   '腊月';   break;
        default   :
            break;
    }
    return(s);
}

