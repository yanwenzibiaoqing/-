$(function() {
  var layer = layui.layer

  //获取DOM
  var $image = $('#image')
  //配置选项
  const options = {
    aspectRatio: 1,//纵横比
    preview: '.img-preview'//指定预览区域
  }

  //裁剪区域
  $image.cropper(options)
  //上传按钮
  $('#btnChooseImage').on('click', function() {
    $('#file').click()
  })

  //绑定change事件
  $('#file').on('change', function(e) {
    //获取选择的文件
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片！')
    }

    var file = e.target.files[0]//拿到选择的文件
    var imgURL = URL.createObjectURL(file)//将文件，转化为路径
    //初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  //确定按钮的点击事件
  $('#btnUpload').on('click', function() {
    //获取裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        //创建一个Canvas画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') //将画布上的内容转化为base64格式的字符串
    //把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      }
    })
  })
})
