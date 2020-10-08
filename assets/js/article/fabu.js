$(function () {
    //表单对象
    var form = layui.form;
    //弹层对象
    var layer = layui.layer;
    //渲染页面
    xuanran()
    //获取页面分类信息
    function xuanran() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                //渲染下拉列表
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //手动渲染表单
                form.render()
            }
        })
    }
    //初始化图片裁剪器
    var $image = $('#image');
    //裁剪选项
    var options = {
        //纵横比
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    }
    //初始化裁剪区域
    $image.cropper(options)
    //切换裁剪区的图片
    //点击选择封面按钮触发被隐藏的上传按钮的事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    //当选择了新图片时更换裁剪区的图片(onchange事件)
    //给隐藏起来的上传文件按钮添加onchange事件
    $('#coverFile').on('change', function (e) {
        //获取被选中的图片文件
        //文件列表(伪数组)
        var files = this.files;
        if (files.length === 0) {
            return
        }
        //重新渲染裁剪区域(更换图片)
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')//销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //发布文章
    //文章状态(用一个全局变量储存这个状态)
    var art_state = '已发布';
    //单击草稿按钮,文章状态要更换成草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    // 2-给表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 收集表单数据（FormData对象）
        var fd = new FormData(this) // 收集到title、cate_id、content
        // 收集文章状态（追加）
        fd.append('state', art_state)
        // 收集裁剪的图片---先裁剪，后收集
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 把裁剪完成的图片，追加到fd中
                fd.append('cover_img', blob)
                // 调接口
                publishArticle(fd)
            })

    })
    // 封装一个调接口的函数
    function publishArticle(fd) {
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // 判断
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg(res.message, function () {
                    // 提示框自动关闭时调用这个回调函数
                    // 跳转到文章列表页
                    location.href = 'liebiao.html'
                })

            }
        })
    }
})