$(function() {
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  //文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  //添加按钮
  var indexAdd = null
  $('#btnAddCate').on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  //要用委托的方式给表单绑定提交事件
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增失败')
        }
        initArtCateList()
        layer.msg('新增成功')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  //用委托的方式给添加按钮绑定事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function() {
    //修改文章分类
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    //获取对应分类
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        form.val('form-edit', res.data)
      }
    })
  })

  //用委托的方式给修改按钮绑定事件
  $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新失败')
        }
        layer.msg('更新成功')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  //(委托)删除按钮
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // console.log(id);
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})
