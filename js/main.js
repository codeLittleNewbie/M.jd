/**
 * 自己写的js脚本
 * Created by W-Q on 2017/7/14.
 */
// 将全局对象放在这里
// 多出会用到
window.Mjd = {};

/**
 * 给tap添加一个方法
 * 判断当前是否为点击事件
 */

Mjd.tap = function (obj, callback) {
    if (typeof obj != "object") {
        console.log(obj + "is not a object");
        return;
    }

    var duration = 300,
        isMove = false,
        beginTime = 0,
        endTime = 0;

    obj.addEventListener("touchstart", function () {
        // 获取当前事件
        beginTime = new Date();
        isMove = false;
    });

    obj.addEventListener("touchmove", function () {
        event.preventDefault();
        isMove = true;
    });

    obj.addEventListener("touchend", function (event) {
        endTime = new Date();
        // 通识复合条件,那么执行回调函数,并把event传出
        // 通过event.target可以获取被点击的元素
        if (isMove == false && endTime - beginTime < duration) {


            // 执行回调
            callback(event);


        }
    })


};


/**
 * 为什么写在了这个地方,因为在购物车那边也要使用这个方法
 */
function shortcutToggle() {
    // 1.拿到标签
    var header = document.getElementsByClassName('jd_header')[0];
    var tap_box = header.getElementsByClassName('icon_shortcut')[0];
    var shortcutBox = header.getElementsByClassName('shortcut')[0];


    // 2.给tap_box添加tap
    Mjd.tap(tap_box, function (e) {
        // 3.拿到当前 shortcutBox.style.display

        // 注意点 : 想要获取css样式表中的样式不能直接通过style来获取
        // - window.getComputedStyle(dom,null)["styleName"];
        // - document.currentStyle.styleName
        var cur_display = window.getComputedStyle(shortcutBox, null)["display"];
        if (cur_display == 'none') {
            shortcutBox.style.display = 'table';
        } else if (cur_display == 'table') {
            shortcutBox.style.display = 'none';
        }
    });
}