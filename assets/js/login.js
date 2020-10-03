$(function () {
    //注册按钮
    $('#denglu').on("click", function () {
        $(".denglu").hide()
        $(".zhuce").show()
    })
    //登录按钮
    $('#zhuce').on("click", function () {
        $(".zhuce").hide()
        $(".denglu").show()
    })
    //获取form
    var form = layui.form;
    //自定义校验规则
    form.verify({
        //密码规则
        mima: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //确认密码规则
        queren: function (value) {
            var pwd = $('.zhuce [name=password]').val();
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })
    //登录事件
    $("#denglu_bd").submit(function (e) {
        e.preventDefault();//阻止默认提交事件
        $.ajax({
            url: "/api/login",
            method: "POST",
            //serialize()可以快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("登录失败");
                }
                layer.msg("登录成功");
                //本地储存token值
                localStorage.setItem("token", res.token);
                //跳转至主页
                // console.log(res.token);
                location.href = "/index.html";
            }
        })

    })
    //注册事件
    var layer = layui.layer;
    $("#zhuce_bd").submit(function (e) {
        e.preventDefault();//阻止默认提交事件
        var data = { username: $('.zhuce [name=username]').val(), password: $('.zhuce [name=password]').val() };
        $.post("/api/reguser", data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message);
                // console.log(res.message);
            }
            layer.msg("注册成功并跳转至登录界面");
            // console.log("注册成功");
            $(".zhuce").hide()
            $(".denglu").show()
        })
    })
})