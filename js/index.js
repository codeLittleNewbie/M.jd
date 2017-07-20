/**
 * Created by W-Q on 2017/7/16.
 */
window.onload = function () {
    // 头部导航透明度
    navBarAlpha();

    // banner无线轮播
    autoPlay();

    // 秒杀倒计时
    seckillCountTime();

    // 底部tabBar的切换
    tabBarToggle();
};


/**
 * 头部导航栏设置
 * alpha[0 ,0.8]
 */
function navBarAlpha() {
    // 抽取常量
    var bannerH = 0,
        scrollT = 0,
        head_top = null,
        banner = null;

    // 获取常量
    banner = document.getElementById("jd_banner");
    head_top = document.getElementById("head_top")
    bannerH = banner.offsetHeight;

    // 监听滚动事件
    window.onscroll = function () {
        scrollT = document.body.scrollTop;

        if (bannerH > scrollT) {
            head_top.style.background = "rgba(201, 21, 35, " + (0.8 * scrollT / bannerH) + ")";
        }
    };


}

/**
 * 1.自动轮播
 *  - 设置过渡动画
 *  - 在transitionend中判断越界问题
 *  - 同时更新页码
 * 2.触摸事件
 *  - touchstart
 *      - 记录起始坐标
 *      - 停止定时器
 *  - touchmove
 *      - 更新移动坐标
 *      - 去除过渡动画
 *      - 根据拖拽距离更新ultransform
 *  - touchend
 *      - 判断拖拽方向以及距离
 *      - 整页显示
 *      - 更新临时数据(optional)
 */
function autoPlay() {
    // 抽取常量
    var index = 1,
        ulItem = document.getElementById("bannerUl"),
        olItem = document.getElementById("bannerOl"),
        olLi = olItem.getElementsByTagName("li"),
        imgW = ulItem.children[0].offsetWidth,
        duration = 2000,
        translateX = -index * imgW,
        timer = null;


    timer = setInterval(autoScroll, duration);

    // 自动滚动
    function autoScroll() {

        index++;
        translateX = -index * imgW;

        // 设置过渡动画
        setTransition();
        // 设置需要产生过度动画属性
        setTransformX(translateX)
    }


    // 监听滚动结束事件
    // 在这里判断下标是否越界,并偷偷移动到第一页
    ulItem.addEventListener("transitionend", function () {
        // 判断索引越界问题
        if (index >= 9) {
            index = 1;

        } else if (index <= 0) {
            index = 8;
        }

        // 偷偷的移动回去 -- 不要过渡
        removeTransition();
        translateX = -index * imgW;
        setTransformX(translateX);

        // 让小白点也一起移动
        pageFollow();
    });

    //小白点跟随
    function pageFollow() {
        for (var i = 0; i < olLi.length; i++) {
            olLi[i].className = "";
            if (i == index - 1) {
                olLi[i].className = "current";
            }
        }
    }


    // 设置过渡动画
    function setTransition() {
        // CSS3属性需要做兼容处理
        ulItem.style.transition = "all .3s ease";
        ulItem.style.webkitTransition = "all .3s ease";
    }

    // 移除过渡动画
    function removeTransition() {
        ulItem.style.transition = "none";
        ulItem.style.webkitTransition = "none";
    }

    // 设置需要产生过渡动画的值
    function setTransformX(translateX) {
        ulItem.style.transform = "translateX(" + translateX + "px)";
    }


    /************************ 触摸事件 *************************/

    var touchS = 0,
        touchM = 0,
        distance = 0,
        tempDis = 0;

    // 监听触摸开始事件
    ulItem.addEventListener("touchstart", function (event) {
        // 记录最初触摸点坐标
        touchS = event.touches[0].clientX;

        // 停止定时器
        clearInterval(timer);
    });


    // 监听触摸移动事件
    ulItem.addEventListener("touchmove", function (event) {
        // 记录移动时坐标
        touchM = event.touches[0].clientX;

        // 计算位移距离
        distance = touchM - touchS;

        // 清除系统默认事件
        event.preventDefault();

        // 移动ul
        // 移除过渡效果
        removeTransition();
        tempDis = translateX + distance;
        setTransformX(tempDis);

    });

    // 监听触摸结束事件
    ulItem.addEventListener("touchend", function () {

        // 显示整页
        // 显示上一页
        if (distance > imgW / 2) {
            index--;
            // translateX = -index * imgW;
        }
        // 显示下一页
        else if (distance < -imgW / 2) {
            index++;
            // translateX = -index * imgW;
        }
        // 显示当前页
        else {
            // translateX = -index * imgW;
        }

        // 更新当前translateX值
        // 不需要更新当前位置,如果只是单纯的拖拽,那么必须先更新位置
        // translateX += distance;

        // 设置过渡效果
        translateX = -index * imgW;
        setTransition();
        setTransformX(translateX);

        // 开启定时器
        // 这个时候想到应该把定时器的function抽取出来
        timer = setInterval(autoScroll, duration);


        // 可请可不清optional
        touchM = 0;
        touchS = 0;
        distance = 0;
        tempDis = 0;
    });
}

/**
 * 1.秒杀倒计时
 *  - 开启定时器 (1s)
 *  - 如果为0点场次,那么到第二天8点才开启第二场
 *  - 没2小时一场次,修改em对应的值
 *  - 获取时分秒方式
 *      - hour : 判断分钟与秒钟是否为0,如果为0,那么取值范围会多1
 *          - 比如,1-2-3点 -> 只有两个小时,如果此时为2:00:00,那么久剩下一个小时,需要用3来减去2才能得到1
 *          - 如果不为0:那么2:12:03,那么此时小时为2-2为0,不需要使用3来相减
 */
function seckillCountTime() {
    // 获取标签
    var em = document.getElementsByTagName("em")[0],
        seckill_left = document.getElementById("seckill_left"),
        times = seckill_left.getElementsByTagName("span"),
        curH = 0,
        curM = 0,
        curS = 0,
        duration = 2,
        timer = null,
        curSession = 0;

    var leftH, leftM, leftS;

    /**
     * 17:00:00  01:00:00
     * 17:30:00  00:30:00
     * 17:30:01  00:29:59
     */

    // 开启定时器
    setInterval(function () {

        // 获取当前时间
        timer = new Date();
        curH = timer.getHours();
        curM = timer.getMinutes();
        curS = timer.getSeconds();

        // 如果当前为0点场,那么倒计时为8小时
        if (curH >= 0 && curH < 8) {
            // 0点场
            // 只有当分钟和秒钟都为0时才有可能到达最大小时数
            leftH = (curM == 0 && curS == 0) ? (8 - curH) : (7 - curH);
        } else {

            // 获取对应场次
            curSession = Math.floor(curH / duration) * duration;

            // 计算当前剩余小时
            leftH = (curM == 0 && curS == 0) ? (curSession + duration - curH) : (curSession - 1 + duration - curH);
        }

        // 计算当前分秒
        leftM = (curS == 0) ? (60 - curM) : (59 - curM);
        leftS = (curS == 0) ? 0 : (60 - curS);

        // 设置值
        times[1].innerHTML = leftH;
        times[3].innerHTML = Math.floor(leftM / 10);
        times[4].innerHTML = leftM % 10;
        times[6].innerHTML = Math.floor(leftS / 10);
        times[7].innerHTML = leftS % 10;

        // 设置场次
        em.innerHTML = curSession;

    }, 1000)

}


function tabBarToggle() {
    // 获取标签
    var tab_bar = document.getElementById("tab_bar_ul");
    var liItems = tab_bar.children;


    for (var i=0;i<liItems.length;i++){
        liItems[i].onclick = clickEvent;
    }


    function clickEvent() {
        for (var i=0;i<liItems.length;i++){
            liItems[i].className = ""
        }

        this.className = "cur";
    }
}