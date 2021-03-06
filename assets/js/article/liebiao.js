$(function () {
    // 弹层对象
    var layer = layui.layer
    // 表单对象
    var form = layui.form
    /* ****（1）数据列表************************** */
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义查询参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    // 封装一个函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                // 渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用函数，渲染分页按钮
                renderPage(res.total)
            }
        })
    }
    /* ****（2）数据列表筛选功能********************************* */
    // 1-渲染分类信息到下拉列表
    initCate()
    // 封装一个函数，获取分类信息
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 渲染分类信息到，下拉列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 手动渲染表单
                form.render()
            }
        })
    }
    // 2-筛选功能（老一套）
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 收集数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 修改参数对象
        q.cate_id = cate_id;
        q.state = state
        // 调接口
        initTable()
    })
    /* *****（3）数据列表分页功能************************** */
    // 1-展示分页页码按钮（根据总的条数、每页显示的条数）
    function renderPage(total) {
        console.log(total);
        layui.laypage.render({
            elem: 'pageBox',
            count: total, // 总的条数
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 当前页的页码
            limits: [2, 4, 6, 8, 10],
            layout: ['count', 'limit', 'page', 'prev', 'next', 'skip'],
            /* 
              首次渲染分页按钮时，调用jump回调
              单击分页按钮时，也调用jump回调
            */
            jump: function (obj, first) {
                if (first === true) {
                    return
                }
                /* 
                  obj 分页的所有选项值
                    obj.curr 当前的页码值
                  first 是否首次
                      true 首次渲染时调用了jump
                      undefined 单击了页码按钮时调用了jump
                */
                console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                initTable()
            }
        })
    }
    // 2-单击分页按钮，切换数据
    // (1) 单击事件中获取点击的页码值；（2）修改参数对象q；（3）重新调接口
    // 3-自定义分页页码UI结构

    // ---------------------------------------
    // 1-给“删除按钮”绑定单击事件（委托）
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取文章的id
        var id = $(this).attr('data-id')
        // 是否确认删除
        layer.confirm('确定要删除此文章吗?', { icon: 3, title: '提示' }, function (index) {
            //调接口
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    /* 
                      小bug，如果当前页数据只有一条，被删除之后，上一页的数据没有获取到
                      原因：重新获取数据时，没有对页码进行减1操作
                      解决思路：
                          判断当前被删除的数据， 是否是当前页的最后一条（判断删除按钮的个数）
                    */
                    if (len === 1) {
                        // q.pagenum--;
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})
