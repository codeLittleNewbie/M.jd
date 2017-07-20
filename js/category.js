/**
 * Created by W-Q on 2017/7/17.
 */
window.onload = function () {
    // 设置刚刚遗留下来的mainH问题
    getMainH();

    // 点击分类刷新页面


    // 滚动左则分类栏
    scrollCategory();

    // 滚动右侧内容区
    scrollContent();

    // 切换便捷栏
    shortcutToggle();
};


/**
 * 1.获取屏幕高度
 * 2.获取头部高度
 * 3.相减 -> 赋值
 */
function getMainH() {
    // 获取标签
    var header_top = document.getElementsByClassName("jd_header")[0];
    var main = document.getElementsByClassName("jd_main")[0];

    // 获取常量
    var headerH = header_top.offsetHeight;
    var screen = window.screen.height;

    var mainH = screen - headerH;


    // 给main赋值(别忘了单位!)
    main.style.height = mainH + "px";

}


/**
 * 监听用户触摸事件
 */
function scrollCategory() {
    // 获取标签
    var category_box = document.getElementById("jd_category_item_box");
    var category = document.getElementById("jd_category_item");
    var liItem = category.getElementsByTagName("li");

    // 抽取常量
    var category_boxH = category_box.offsetHeight;
    var categoryH = category.offsetHeight;

    // 左边大盒子的高度 - ul的高度 = ul可以下拉的最小Y值
    var bottom_max_Y = category_boxH - categoryH;
    var bufferH = liItem[0].offsetHeight * 3;


    // 设置过渡动画
    function setTransition() {
        category.style.transition = "all .1s ease";
        category.style.webkitTransition = "all .1s ease";
    }

    // 移除过渡动画
    function removeTransition() {
        category.style.transition = "none";
        category.style.webkitTransition = "none";
    }

    // 开始过渡动画
    function transform(transform) {
        category.style.transform = "translateY("+ transform +"px)";
        category.style.webkitTransform = "translateY("+ transform +"px)";
    }

    var touchS,
        touchE,
        changeDis,
        tempDis,
        categoryY = 0;

    // 监听touch事件三步走
    category.addEventListener("touchstart",function () {
        // 记录初始坐标
        touchS = event.touches[0].clientY;
    });

    category.addEventListener("touchmove",function () {
        // 记录最终坐标
        touchE = event.touches[0].clientY;

        // 取消系统默认事件
        event.preventDefault();

        // 获取改变的值
        changeDis = touchE - touchS;

        // 记录需要过渡距离
        tempDis = categoryY + changeDis;

        // 设置过渡动画
        setTransition();

        // 判断当前值是否越界
        if (tempDis > bufferH){
           tempDis = bufferH;
        }
        else if (tempDis < bottom_max_Y - bufferH){
            tempDis = bottom_max_Y - bufferH;
        }

        // 开始过渡动画
        transform(tempDis);

    });

    category.addEventListener("touchend",function () {
        // 更新category位置
        categoryY = tempDis;

        if (categoryY > 0){
            // 重新更新位置
            categoryY = 0;
            // 开始过渡动画
            transform(0);

        }else if (categoryY < bottom_max_Y){
            // 重新更新位置
            categoryY = bottom_max_Y;

            transform(bottom_max_Y);
        }
    });


    /******************** tab事件  ************************/
    var liItems = category.getElementsByTagName("li");
    var selectedIndex = 0;
    // 清除所有的className
    for (var i=0;i<liItems.length;i++){
        if (liItems[i].className == "current"){
            // 记录当前选中的index
            selectedIndex = i;
        }

        // 记录所有li的index
        liItems[i].index = i;
    }



    Mjd.tap(category,function (event) {
        // 正常通过event.target拿到的应该是a标签
        // 但是因为给li添加了一个伪元素,所以当伪元素被点击的时候,那么获取到的target值
        // 就是拥有这个伪元素的标签,所以currentLi为li而不是a标签
        var currentLi = event.target;
        var currentY = 0;

        // 判断当前li是否已经被选中
        if (currentLi.className != "current"){

            // 清除选中的li的类名
            liItems[selectedIndex].className = "";

            // 给当前li添加类名
            currentLi.className = "current";

            // 更新选中索引
            selectedIndex = currentLi.index;
        }

        // 让ul滚动到-index * height位置
        currentY = -currentLi.index * currentLi.offsetHeight;

        if (currentY < bottom_max_Y){
            currentY = bottom_max_Y;
        }


        // 设置过渡
        setTransition();

        // 开启过渡效果
        transform(currentY);

        // 更新ul位置
        categoryY = currentY;


        // 营造main_right刷新的假象(我个人觉得是很low的)
        // 再极端的时间内通过控制display来造成闪一下的错觉
        var main_right = document.getElementById("jd_main_right");

        // 先设置为隐藏
        main_right.style.display = "none";
        setTimeout(function () {
            // 200ms之后显示正常
            main_right.style.display = "block";
        },200)

    })


}


/**
 * 与滚动左侧类别栏做法一致
 */
function scrollContent() {
    // 获取元素
    var mainRight = document.getElementById("jd_main_right");
    var rightBox = document.getElementById("right_box");

    // 抽取常量
    var mainRightH = mainRight.offsetHeight;
    var rightBoxH = rightBox.offsetHeight;

    // 获取顶部最大位移Y值
    // 20 -> padding值
    var top_max_Y = mainRightH - rightBoxH - 20;
    var bufferH = 100;

    // 设置过渡动画
    function setTransition() {
        rightBox.style.transition = "all .1s ease";
        rightBox.style.webkitTransition = "all .1s ease";
    }

    // 移除过渡动画
    function removeTransition() {
        rightBox.style.transition = "none";
        rightBox.style.webkitTransition = "none";
    }

    // 开始过渡动画
    function transform(transform) {
        rightBox.style.transform = "translateY("+ transform +"px)";
        rightBox.style.webkitTransform = "translateY("+ transform +"px)";
    }

    // 三部曲之五变量
    var touchS = 0,
        touchE = 0,
        touchC = 0,
        tempDis = 0,
        translateY = 0;


    // 触摸事件三部曲
    rightBox.addEventListener("touchstart",function (event) {
        // 记录开始坐标
        touchS = event.touches[0].clientY;
    });

    rightBox.addEventListener("touchmove",function (event) {
        // 记录最终值
        touchE = event.touches[0].clientY;


        // 计算出变化值
        tempDis = touchE - touchS;
        tempDis = translateY + tempDis;


        // 判断越界问题
        if (tempDis > bufferH){
           tempDis = bufferH;
        }else if (tempDis < top_max_Y - bufferH){
           tempDis = top_max_Y - bufferH;
        }

        // 设置过渡
        setTransition();

        // 开启过渡效果
        transform(tempDis);


    });

    rightBox.addEventListener("touchend",function (event) {
        // 更新位置
        translateY = tempDis;

        // 设置过渡
        setTransition();

        // 弹簧效果
        if (translateY > 0){
            translateY = 0;


        }else if (translateY < top_max_Y){
            translateY = top_max_Y;
        }

        // 开启过渡效果
        transform(translateY);

    });

}


