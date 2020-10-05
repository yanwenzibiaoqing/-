$(function () {
    jbxx();

    var layer = layui.layer

    $("#btn_tc").on("click", function () {
        // 提示退出信息
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储中的 token
            localStorage.removeItem('token')
            //重新跳转到登录页面
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index)
        })
    })
})

//获取基本信息
function jbxx() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg("用户信息获取失败")
            }
            //渲染头像
            touxiang(res.data)
        }
        //没有登录,就不能访问index页面的回调函数
        // ,complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染头像
function touxiang(user) {
    //名称
    var name = user.nickname || user.username;
    //欢迎
    $("#hy").html("欢迎&nbsp;&nbsp;" + name);
    //头像
    if (user.user_pic != null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".touxiang").hide();
    } else {
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".touxiang").html(first).show();
    }
}