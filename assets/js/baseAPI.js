$.ajaxPrefilter(function (options) {
    //拼接地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})