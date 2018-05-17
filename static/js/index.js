layui.define(['layer', 'form', 'element', 'flow','upload'], function(exports) {
    var layer = layui.layer,
        element = layui.element(),
        flow = layui.flow,
        form = layui.form();
    
    $.ajaxSetup({
        type: "post",
        dataType: "json"
    });
    flow.lazyimg();
    element.on('tab(img)', function(data) {
        flow.lazyimg();
    });
    
    var scene = {
        login: function(obj) {
            layer.open({
                title: false,
                type: 2,
                shadeClose:true,
                closeBtn:false,
                content: "/user/login/index.html",
                area: ['300px','250px'],
            });
        },
        qrcode: function(obj) {
            var text=$(obj).data('url')
                ,sceneid=$(obj).data('vid');
            var qrcodeid='qrcode'+sceneid;
            var csss=new QRCode(qrcodeid, {  
                text : text,   
                width: 148,
                height: 148,
                colorDark : '#222222',
                colorLight : '#f3f3f3',
                correctLevel : QRCode.CorrectLevel.H
            });           
            $(obj).find('.mask').show(); 
        },
        close:function(obj) {
            var sceneid=$(obj).data('vid');
            var _name=$(obj).data('name');           
            $(obj).find("#"+_name+sceneid).empty();
            $(obj).find('.mask').hide(); 
        },
        stick:function(obj) {
            var id = $(obj).data('id');
            var type = $(obj).data('type');
            $.ajax({
                url: "/index/ppt/bslzd.html?t="+$.now(),
                type: 'POST',
                data : {id:id,type:type},
                success: function(info){
                    if (info.code === 1) {
                        layer.msg(info.msg,{time:1000},function(){
                            window.location.reload();
                        });
                    }else{
                      layer.msg(info.msg,{time:2000});  
                    }
                    
                }
            });
        },
       
        delete:function(obj) {
            var ids = [];
            $(".bsldel input").each(function(){
                if($(this).is(':checked')){
                    ids.push(parseInt($(this).val()));
                }
            });
            if(ids == ''){
                layer.msg('请选择要删除的内容');return false;
            }
            layer.confirm('确认删除?', function(index){
                $.ajax({
                    url: "/dbg.php/index/ppt/bsldel.html?t="+$.now(),
                    type: 'POST',
                    data : {ids:ids,type:1},
                    success: function(info){
                        if (info.code === 1) {
                            layer.msg(info.msg,{time:1000},function(){
                                window.location.reload();
                            });
                        }else{
                          layer.msg(info.msg,{time:2000});  
                        }
                    }
                });
            });  
        },
        download:function(obj) {
            var id=$(obj).data('vid');                     
            var loading = layer.load(1, {time: 10*1000,shade: [0.5,'#000']});
            $.ajax({
                   type: "POST",
                   async:false,
                   url: "/index/ppt/checkOrd_ajax.html?t="+$.now(),
                   data : {id:id,ordertype:2},
                   success: function(data){
                        if(data.status==1){                    
                            window.location.href="/publish.html?goodsid="+id;                   
                        }else if(data.status==2){                    
                            scene['login']();                  
                        }else if(data.status==5){                    
                            window.location.href=data.url;                    
                        }else{
                            layer.msg(data.msg,{time:2000});
                        }   
                   }
            });

           layer.close(loading); 
        },
        xiajia:function(obj) {
            var id=$(obj).data('vid');

            if($(obj).is(':checked')) {
                var is_show = 0;
            }else{
                var is_show = 1;
            }
            $.ajax({
                url: "/index/ppt/ajaxshow.html?t="+$.now(),
                type: 'POST',
                async:false,
                data : {id:id,is_show:is_show},
                success: function(data){
                  layer.msg(data.msg,{time:1000});
                }
            });            
        },
        createscene:function(obj) {
            var id=$(obj).data('vid');
	    var type=$(obj).data('type');

            layer.confirm('确定使用该模板吗？', {
                  btn: ['立即使用','取消']
                }, function(){
                    $.ajax({
                        url: '/dbg.php/user/scene/create.html',                       
                        data: {
                            type:type,
                            id: id
                        },
                        success: function(info) {
                            if (info.code === 200) {
                                setTimeout(function() {
                                    location.href = "/edit.html?sceneid="+info.id;
                                }, 1000);
                            };
                            layer.msg(info.msg);
                        }
                    });
            });
            
        },
        copyscene:function(obj) {
            var id=$(obj).data('vid');

            layer.confirm('确定使用该模板吗？', {
                  btn: ['立即使用','取消']
                }, function(){
                    $.ajax({
                        url: '/user/scene/copyd.html',                       
                        data: {
                            id: id
                        },
                        success: function(info) {
                            if (info.code === 200) {
                                setTimeout(function() {
                                    location.href = "/works.html";
                                }, 1000);
                            };
                            layer.msg(info.msg);
                        }
                    });
            });
            
        },
        extra_data(input,data){
            var item=[];
            $.each(data,function(k,v){
                item.push('<input type="hidden" name="'+k+'" value="'+v+'">');
            })
            $(input).after(item.join(''));
        },
        tabs:function(obj) {
            var id=$(obj).data('vid');
            var type=$(obj).data('type');
            $('.li'+type).removeClass("on");
            $(obj).addClass("on");
            $('.tab'+type).addClass("none");
            $("#"+id).removeClass("none");
        },
        priview:function(obj){
            var id=$(obj).data('id');
            var url='http://www.chuanying520.com/home/home/work_detail/'+id+'/2.html';
            $.ajax({
                url: url,
                type: 'post',
                
                success: function (info) {
                    console.log(info)
                    if (info.error === false) {
                        
                        layer.open({
                            title: false,
                            type: 1,
                            shadeClose:true,
                            closeBtn:false,
                            content: info.data,
                            success:function(){
                                var thumb_index=2
                                var thumb_li_len = $(".thumb-list ul li").length;
                                var thumb_ul_width = 186 * thumb_li_len;
                                thumb_width = thumb_ul_width > 940 ? 940 : thumb_ul_width + 10;
                                $(".thumb-list ul").width(thumb_ul_width);
                                $(".thumb-list").width(thumb_width);
                                $(".arrow-right").click(function() {
                                    if (thumb_index === thumb_li_len - 3) {
                                        thumb_index = 2
                                    } else {
                                        thumb_index++
                                    }
                                    set_pre_thumb_index(thumb_index)
                                });
                                $(".arrow-left").click(function() {
                                    if (thumb_index === 2) {
                                        thumb_index = thumb_li_len - 3
                                    } else {
                                        thumb_index--
                                    }
                                    set_pre_thumb_index(thumb_index)
                                });
                                if (thumb_li_len > 5) {
                                    setTimeout(function() {
                                        $(".arrow-right").trigger('click');
                                        thumb_timer = setInterval(function() {
                                            $(".arrow-right").trigger('click')
                                        }, 2000)
                                    }, 100)
                                }
                            }
                        });
                    }else{
                       layer.msg(info.data); 
                    }
                    
                    
                }
            });

        }
        
    };
    /**
     * 通用表单提交(AJAX方式)
     */
    form.on('submit(*)', function (data) {
        $.ajax({
            url: data.form.action,
            type: data.form.method,
            data: $(data.form).serialize(),
            success: function (info) {
                if (info.code === 1) {
                    setTimeout(function () {
                        location.href = info.url;
                    }, 1000);
                }
                layer.msg(info.msg);
            }
        });

        return false;
    });

    //通用点击
    $(".cy-click").on('click', function() {
        var name = $(this).data('name');       
        scene[name](this);
    });
    //通用点击
    $(".cy-mouse").on('mouseenter', function() {
        var name = $(this).data('name');         
        scene[name](this);
    }).on('mouseleave', function() {                
        scene['close'](this);
    });

    layui.upload({
        url: "/index/ppt/upload",
        type: 'image',
        ext: 'jpg|png|gif|bmp',
        before:function(input){
            var id = $(input).data('id');
            var data={"id":id};
            scene['extra_data'](input,data);
        },
        success: function (info) {
            console.log(info)
            if (info.error === 0) {
                
                layer.msg(info.msg,{time:1000},function(){
                    //window.location.reload();
                    $('#img'+info.id).attr('src',info.url);
                });
            }else{

              layer.msg(info.msg,{time:2000});  
            }
        }
    });
    
    exports('index', {});
});