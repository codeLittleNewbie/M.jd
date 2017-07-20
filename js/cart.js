/**
 * Created by W-Q on 2017/7/17.
 */
window.onload = function () {
    // 切换便捷栏
    shortcutToggle();

    // 垃圾箱按钮的点击
    delectBtn();

    // 商品选中的切换
    chooseChecked();
};

/**
 * 垃圾箱按钮的点击
 *  - 垃圾盖打开
 *  - 弹簧效果弹出蒙版
 */
function delectBtn() {
    // 获取标签
    var garbage = document.getElementsByClassName("garbage");
    var mask = document.getElementsByClassName("del_mask")[0];
    var del_message = mask.getElementsByClassName("del_message")[0];

    var garbage_up = document.getElementsByClassName("garbage_up")[0];

    // 记录当前被打开的盖子
    var up = null;

    for (var i = 0; i < garbage.length; i++) {
        // 监听垃圾盖的点击
        Mjd.tap(garbage[i], function (event) {
            // 获取垃圾盖标签
            up = event.target.parentNode.getElementsByClassName("garbage_up")[0];

            // 设置过渡
            up.style.transition = "all .3s ease";
            up.style.transformOrigin = "2px 2px";
            up.style.transform = "rotate(-30deg)";

            // 显示蒙版
            var mask_dis = window.getComputedStyle(mask, null)["display"];

            // 设置弹簧效果
            del_message.className = "del_message springJump";

            if (mask_dis == "none") {
                mask.style.display = "block";
            } else if (mask_dis == "block") {
                mask.style.display = "none";
            }
        })
    }

    // 监听蒙版按钮的点击
    Mjd.tap(del_message, function (event) {
        var btn = event.target;

        // 点击了确定按钮
        if (btn.className == "sure") {

            // 递归调用对比for循环来说在查询量过大的时候可能获取不到值
            // 原因是因为每次递归都要有一块内存空间开辟给函数调用
            // 所以当电脑内存不足时会导致获取不到值,但for循环不会
            // 更新UI,删除商品
            /*(function searchParent(button) {
                // 判断当前选中标签是否为li标签
                if (button.className == "product") {
                    button.remove();
                    return;
                }
                searchParent(button.parentNode);
            })(up);*/



            // for循环的神奇用法
            // 也是遵循for(var i=0;i<lenth;i++){}
            /**
             * - 定义一个变量接收一个参数
             * - 判断条件为当前变量的className不等于products_center_menu
             * - 如果等于products_center_menu那么遍历 结束
             * - 每次element需要有值变化,结合i=i+1;
             *  - element = element.parentNode
             *      - 没遍历一次element就为他的父元素
             *
             *     - 如果遍历到父元素的className为product
             *      - 那么将当前父元素移除
             *          - 跳出循环
             */
            for (var element = up; element.className != "products_center_menu"; element=element.parentNode) {
                if (element.className == "product") {

                    element.remove();
                    break;
                }
            }

        }

        // 点击了取消按钮,移除蒙版
        mask.style.display = "none";

        // 盖上垃圾盖
        up.style.transform = "none";
    })
}


/**
 * 商品选中的切换
 *  - 给所有的span[checked]标签设置点击事件
 *  - 判断当前选中的span是否拥有checked属性,如果存在,那么移除
 *  - 如果不存在,那么设置,在css样式中设置属性选择器[checked],重新设置position属性
 */
function chooseChecked() {
    // 获取元素
    var checked_boxs = document.getElementsByClassName("checked_box");

    // 遍历数据,给所有的checked都添加点击事件
    for (var i = 0; i < checked_boxs.length; i++) {

        // 使用立即调用函数解决索引问题
        (function (index) {
            var checkedBox = checked_boxs[index];
            Mjd.tap(checkedBox, function () {

                // 判断当前选中的span是否存在checked属性
                // 在css样式表中添加一个属性选择器
                // 修改position为0,0即可
                if (checkedBox.hasAttribute("checked")) {
                    checkedBox.removeAttribute("checked");
                } else {
                    checkedBox.setAttribute("checked", "");
                }
            })
        })(i);

    }
}