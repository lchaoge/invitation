var pagelist = {
    template: `
			<section :class="'swiper-slide swiper-slide'+k" >
				<div class="pagebg" :style="setBgStyle(page.pagebg)" style="width:100%;height:100%;background:#fff;z-index:-888;"></div>
				<div v-for="(ev,key) in page.elements" :index="key" class="item" :class=" k == current ? 'showpage':'nopage'" :style="showoutstyle(ev)">
					<div class="amious" :style="showanim(ev.anim)" style="overflow:hidden;">
						<div v-if="(ev.type==2 || ev.type==5)" class="el-text" :style="showstyle(ev.in.css)" @click="picClick(ev.in.properties)" v-html="showcontent(ev.content)"></div>
						<img v-if="ev.type==4" class="el-bgimg" :style="showimgstyle(ev.in.css)" :src="showimg(ev.src,ev.in.css.width)" @click="picClick(ev.in.properties)"/>
						<div v-if="ev.type=='h'" :class="'svg'+key+'_'+k" data-flag="0" class="el-shape" :style="showstyle(ev.in.css)" v-html="showshape(ev,key+'_'+k)"></div>
						<count-down v-if="ev.type=='countDown'" class="countDown-text" :style="showstyle(ev.in.css)" :start-time="startTime" :end-time="parseInt(ev.in.properties.deadlineTime)" ></count-down>
						<div v-if="ev.type==='m'" style="width:100%;height:100%;position:relative"> 
							<img  :src="'http://api.map.baidu.com/staticimage/v2?ak=WtfAdHwd1tMOCf2dzdRIhNZkSq8V7o5W&width='+(ev.out.css.width*bili1)+'&height='+(ev.out.css.height*bili2)+'&dpiType=ph&markers='+ev.in.properties.lng+','+ev.in.properties.lat+'&markerStyles=l,,0xff0000&center='+ev.in.properties.lng+','+ev.in.properties.lat+'&labels='+ev.in.properties.lng+','+ev.in.properties.lat+'&zoom=12&labelStyles=我在这,1,'+(28*bili1)+',0xffffff,0x1abd9b,1'"/>
							<a style="width:80px;height:30px;line-height:30px;background:#1abd9b;position:absolute;right:10px;bottom:10px;color:#fff;text-align:center;border-radius:3px" @click="goLocation(ev.in.properties)">导 航</a>
						</div>
						<a v-if="ev.type=='phoneCallButton'" :style="showastyle(ev.in.css)" style="display:block;text-align: center" :href="'tel://'+ev.in.properties.tel">
							<i class="fa fa-phone"></i>&nbsp;&nbsp;
							<span>{{ev.content}}</span>
						</a>
						<a v-if="ev.type=='linkButton'" :style="showastyle(ev.in.css)" style="display:block;text-align: center" :href="showHref(ev.in.properties.url)">
							<i class="fa fa-link"></i>&nbsp;&nbsp;
							<span>{{ev.content}}</span>
						</a>
						<div :id="'zan'+ev.in.properties.id" v-if="ev.type=='interActionButton'" :style="showstyle(ev.in.css)" :class="getzannum(ev.in.properties.id,ev.content)" data-flag="0" style="cursor:pointer" @click="submitZan(ev,page)">
							<i class="fa fa-thumbs-up"></i>&nbsp;&nbsp;
							<span>点赞</span>
						</div>
						<div  v-if="ev.type=='i'" style="position:relative;line-height: 36px;" class="inputs">
							<input :id="ev.id" :data-flag="ev.in.properties.require" :style="showform(ev.in.css)" style="position:absolute" v-on:focus="inputfocus" v-on:blur="inputblur">
							<span style="position: relative;pointer-events: none; opacity: 0.7;padding-left:20px;">{{ ev.in.properties.placeholder }}</span>
							<span v-show=" ev.in.properties.require==true " style="position: relative;pointer-events: none; color:red;">*</span>
						</div>
						<div v-if="ev.type=='s'" :style="showform(ev.in.css)" style="padding:0 20px" @click="submitForm(page.id,page.sceneid,ev,$event)"> {{ev.in.properties.str}}</div>
					</div>
				</div>
			</section>`,
    replace:true,
    data :function() {
      return {
        startTime:new Date().getTime()
      }
    },
    components: {
      'count-down': countdown,
      'readme':readme
    },
    props:{
      page:{
        type: Object           
      },
      current:{
        type: Number,
        default :0
      },
      k:{
        type: Number,
        default :0
      },
      bili1:{
        type: Number,
        default :1
      },
      bili2:{
        type: Number,
        default :1
      },
    },
    mounted:function() {

       
               
    },
    methods: {
      requestUrl:function(params, url,isForm,msg){
        $.ajax({
          method: 'post',
          url: url,
          data: params,
          success: function(res){
          var dd = params;
          if (res.code == 200) {
            if (res.status == true) {
                if(isForm){
                   $('.inputs').find('input').val('');
                $('.inputs').find('input').nextAll('span').show();
                  layer.msg(msg);
                }else{
                  layer.msg(res.msg);
                }
            } else {
              layer.msg(res.msg);
            }
          } else {
          }
        }
      });
      },
      //点赞
      submitZan:function(data, sceneData){
        var param = {
          sceneid: sceneData.sceneid,
          pageid: sceneData.id,
          id: data.in.properties.id
        }
        $.ajax({
          method: 'post',
          url: 'http://www.yaoyue365.com/api/scene/scenezan',
          data: param,
          async: false,
          success: function(res){
            if (res.code == 200) {
              if (res.status == true) {
                layer.msg(res.msg,function(){
                    if(res.count>0){
                     $("#zan"+data.in.properties.id).find('span').text(res.count);
                    }
                });                   
              } else {
                layer.msg(res.msg);
              }
            } else {
              layer.msg(res.msg);
            }
          }
        });
      },
      //获取点赞数
      getzannum:function(id,str){
       	var _self = this;
        $(document).ready(function () {  
	        if($("#zan"+id).attr('data-flag')==1){
	          return ;
	        }else{  
	         	$.ajax({
	            method: 'get',
	            url: 'http://www.yaoyue365.com/api/scene/getzancnt',
	            data: {id:id},
	            async: false,
	            success: function(res){              
	              if (res.code == 200) {
	                if (res.status == true) {
	                  if(res.count>0){
	
	                   $("#zan"+id).find('span').text(res.count)
	                   $("#zan"+id).attr('data-flag',1);
	                  }
	                } else {
	                  layer.msg(res.msg);
	                }
	              } else {
	                layer.msg(res.msg);
	              }
	          	}
	        	});
	      	}
        });    
       
      },
      submitForm:function(pageid,sceneid,data,ev){

       
      var flag=true;
      var formParam = {};
      $(ev.target).parent().parent().parent().find('input').each(function(){
        console.log($(this).val())
          if($(this).val()=='' && $(this).data('flag')){
            layer.msg("请补全信息");
            flag = false;
            return;
          }else{
            formParam[$(this).attr('id')]=$(this).val();
          }
          
        });
        //console.log(flag)
        if(flag===false){
          return;
        }
         var param = {
          sceneid:sceneid,
          pageid: pageid,
          formid: data.formid,
          content:formParam
        }
        
         $.ajax({
            method: 'post',
            url: 'http://www.yaoyue365.com/api/scene/sceneform',
            data: param,
            async: false,
            success: function(res){
              
              if (res.code == 200) {
                if (res.status == true) {
                  layer.msg(data.in.properties.ok,{},function(){
                      $('.inputs').find('input').val('');
                      $('.inputs').find('input').nextAll('span').show();
                  });                   
                } else {
                  layer.msg(res.msg,{time:1000},function(){
                      $('.inputs').find('input').val('');
                      $('.inputs').find('input').nextAll('span').show();
                  });  
                }
              } else {
                layer.msg(res.msg);
              }
          }
        });
        
      },
      //提交表单
      submitData:function(data, sceneData,ev){
 
	
        var params = {};
        var formParam = {};
        var values = [];
        params['sceneid'] = sceneData.sceneid
        params['pageid'] = sceneData.id
	
        for (var i = 0; i < data.length; i++) {
          if (data[i].type == 'i') {
	
            if (data[i].in.properties.require === true || data[i].in.properties.require === "1") {
             
              var inputValue =  $(".inputs").children("input#" + data[i].id).val();
              console.log(inputValue)
              if (inputValue == "" || inputValue == undefined) {
                //alert("请补全信息");
		            layer.msg("请补全信息");
                return;
              } else {
                params['formid'] = data[i].formid;
                formParam[data[i].id] = inputValue;
              }
            } else {

            }
          }
          if (data[i].type == 's') {
            params['ok'] = data[i].in.properties.ok;
          }
        }
	
        params['content'] = formParam;
        var param = {
          sceneid: sceneData.sceneid,
          pageid: sceneData.id,
          formid: params['formid'],
          content: params['content']
        }
        this.requestUrl(param, "http://www.yaoyue365.com/api/scene/sceneform",true,params['ok']);
        
      },
      //图片点击事件
      picClick:function(data){
        if (data.hasUrl == 1) {
          if(data.jumpUrl.indexOf("http://")==-1){
                data.jumpUrl="http://"+data.jumpUrl;
            }
          window.open(data.jumpUrl);
        } else if (data.hasUrl == 2) {
	 
          this.scrollIndex = data.jumpPageNumber - 1;
          this.pageStr = data.jumpPageNumber + "/" + _self.vue._data.pagelists.length;
	  
          _self.mySwiper.slideTo(data.jumpPageNumber - 1, 100, true);
        }
      },
      setBgStyle:function(PageBg){
        if (typeof(PageBg) == "undefined") {
          return
        }
        if (typeof(PageBg.backgroundImage) == "undefined") {
             return
          }
        if (PageBg.backgroundImage.length) {
          var style = "background: url(" + PageBg.backgroundImage + ") no-repeat top left / cover;";
           return style
        } else if (PageBg.backgroundColor.length){
          return "background: " + PageBg.backgroundColor;
        }
      },
       showimg:function(src,width){
          var image = /.(png)$/ ;
				  if(image.test(src)){
				 	  return src;
				  }else{
	          if(width=='100%' || typeof width==='undefined'){
					  	ext=7
					  }else{
		          var ext=Math.ceil(width/100);
						  if(ext>9){
						   	ext=9
						  }
			   		}
	            return src+'!'+ext;
	 				}
        },

        showcontent:function(str){
	
	 
            if(typeof str=='undefined'){
	    	return "";
	    }
             str = str.replace(/amp;/g, ''); 

              str = str.replace(/&lt;/g, '<');
              str = str.replace(/&gt;/g, '>');
              str = str.replace(/&quot;/g, "''");  
              str = str.replace(/&#039;/g, "'"); 
              //str = str.replace(/&nbsp;/g, " "); 
              str = str.replace(/\n/g, "<br>");  
	     
              return str;  
        },
       
           inputfocus:function(ev){
        
        $(ev.target).nextAll('span').hide()

      },
      showHref:function(data){
      
	   return "http://"+data.replace("http://","");

      },
      
      //导航
      goLocation:function(data){
        var lng, lat;
        var _self = this;
        var geolocation = new BMap.Geolocation();
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder();
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // 根据坐标得到地址描述
            myGeo.getLocation(r.point, function(result) {
              if (result) {
                var mk = new BMap.Marker(r.point);
                _self.lng = r.point.lng;
                _self.lat = r.point.lat;
                var params = {};
                params.start = {
                  address: result.surroundingPois[0].address,
                  msg:result.addressComponents,
                  lat: r.point.lat,
                  lng: r.point.lng
                };
                params.end = {
                  address: data.address,
                  lat: data.lat,
                  lng: data.lng,
                };
							_self.navication(params);
               
              }
            });
          }
          else {
            alert('failed' + this.getStatus());
          }
        }, {enableHighAccuracy: true})
      },
      navication:function(data){
      	location.href="http://api.map.baidu.com/direction?origin=latlng:" + data.start.lat + "," + data.start.lng + "|name:" + data.start.address + "&destination=" + data.end.address + "&mode=driving&region=" + data.start.msg.province + "&output=html&src=yourCompanyName|yourAppName";
      },
      inputblur:function(ev){

        if ($(ev.target).val() == "") {

          $(ev.target).nextAll('span').show()
        } else {

          $(ev.target).nextAll('span').hide()
        }
      },
      setSpanStyle:function(inCssObj){

        var styles = "";

        for (var item in inCssObj) {

          var value = inCssObj[item];
          if (item === "height") {
            styles += item + ":" + value + "px" + ";";
          } else if (item === "lineHeight" || item === "fontSize") {
            styles += item + ":" + parseInt(value)*this.bili2 + "px;";
          }
        }

        // console.log(styles+"ss")
        return styles;

      },
      
      
        showimgstyle:function(css){
           var cssobj="display:block;";
	  
          for(var o in css){
            if(!isNaN(css[o]) && (o==='width'  )){
                cssobj+=o+':'+(css[o]*this.bili1)+'px;';
            }else if(!isNaN(css[o]) && (o==='left'  )){
                cssobj+=o+':'+(css[o]*this.bili1)+'px;';
            }else if(o==='fontSize' || o==='borderWidth' || o==='borderRadius' ){
                cssobj+=o+':'+parseInt(css[o])*this.bili1+'px;';
            }else if(!isNaN(css[o]) && ( o==='height'  )){
              if(css[o]==1){
							 cssobj+=o+':'+(150*this.bili2)+'px;';
							}else{
							 cssobj+=o+':'+(css[o]*this.bili2)+'px;';
							}
               
            }else if(( o==='letterSpacing' )){
                cssobj+=o+':'+(parseInt(css[o])*this.bili1)+'px;';
               
            }else if(!isNaN(css[o]) && ( o==='top' )){
                cssobj+=o+':'+(css[o]*this.bili2)+'px;';
               
            }else if( o==='padding' ){
                //cssobj+=o+':'+(css[o]*this.bili2)+'px;';
               
            }
            else{
	    
                cssobj+=o+':'+css[o]+";";
            }
            
          }
            
            return cssobj;
        },
        showstyle:function(css){
          var cssobj="";
          for(var o in css){
            if(!isNaN(css[o]) && (o==='width' || o==='left' )){
                cssobj+=o+':'+(css[o]*this.bili1)+'px;';
            }else if(o==='fontSize' || o==='borderWidth' || o==='borderRadius' ){
                cssobj+=o+':'+parseInt(css[o])*this.bili1+'px;';
            }else if(!isNaN(css[o]) && ( o==='height'  )){
              if(css[o]==1){
							  cssobj+=o+':'+(150*this.bili2)+'px;';
							}else{
							  cssobj+=o+':'+(css[o]*this.bili2)+'px;';
							}
               
            }else if(!isNaN(css[o]) && ( o==='top' )){
                cssobj+=o+':'+(css[o]*this.bili2)+'px;';
               
            }else if( o==='padding' ){
                //cssobj+=o+':'+(css[o]*this.bili2)+'px;';
               
            }
            else{
	    
                cssobj+=o+':'+css[o]+";";
            }
            
          }
            
            return cssobj;
        },
	 			showastyle:function(css){
          var cssobj="";
          for(var o in css){
            if(!isNaN(css[o]) && (o==='width' || o==='left' )){
              cssobj+=o+':'+(css[o]*this.bili1)+'px;';
            }else if(o==='fontSize' || o==='borderWidth'  ){
              cssobj+=o+':'+parseInt(css[o])*this.bili1+'px;';
            }else if( o==='borderRadius' ){
              cssobj+=o+':'+parseInt(css[o])/2*this.bili1+'px;';
            }else if(!isNaN(css[o]) && ( o==='height'  )){
							cssobj+=o+':'+(css[o]*this.bili2)+'px;';
							cssobj+='lineHeight:'+(css[o]*this.bili2)+'px;';
            }else if(!isNaN(css[o]) && ( o==='top' )){
              cssobj+=o+':'+(css[o]*this.bili2)+'px;';
            }else if( o==='lineHeight' ){
                //cssobj+=o+':'+(css[o]*this.bili2)+'px;';
            }
            else{
                cssobj+=o+':'+css[o]+";";
            }
          }
          return cssobj;
        },
        showoutstyle:function(ev){
          var cssobj="";
          var css=ev.out.css
          for(var o in css){
            if(!isNaN(css[o]) && (o==='width' || o==='left' )){
              cssobj+=o+':'+(css[o]*this.bili1)+'px;';
            }else if(o==='fontSize' || o==='borderWidth' || o==='borderRadius' ){
              cssobj+=o+':'+parseInt(css[o])*this.bili1+'px;';
            }else if(!isNaN(css[o]) && ( o==='height'  )){
				    	if(css[o]==1 && ev.type=='2'){
							 cssobj+=o+':'+(150*this.bili2)+'px;';
							}else{
							 cssobj+=o+':'+(css[o]*this.bili2)+'px;';
							}
            }else if(!isNaN(css[o]) && (  o==='top' )){
              cssobj+=o+':'+(css[o]*this.bili2)+'px;';
            }else if(o==='lineHeight' &&  css[o]<=2){
                //cssobj+=o+':'+(css[o]*this.bili2)+'px;';
            }else if( o==='padding' ){
                //cssobj+=o+':'+(css[o]*this.bili2)+'px;';
            }else{
                cssobj+=o+':'+css[o]+";";
            }
          }
         if(ev.type=='i' || ev.type=='s'){
            cssobj+='padding:0 20px;'
         }
            
            //console.log(cssobj);
            return cssobj;
        },
        showform:function(css){
           var cssobj="";
          for(var o in css){
          
            if(!isNaN(css[o]) && ( o==='left' )){
                cssobj+=o+':'+(css[o]*this.bili1)+'px;';
                
            }else if(!isNaN(css[o]) && (o==='width' )){
                cssobj+=o+': 100%;';
                
            }else if(o==='fontSize' || o==='borderWidth' ){
                
                cssobj+=o+':'+parseInt(css[o])*this.bili1+'px;';
              
              
            }else if(!isNaN(css[o]) && ( o==='height'  || o==='top' )){
                cssobj+=o+':'+(css[o]*this.bili2)+'px;';
               
            }else if( o==='padding' ){
                cssobj+=o+':0 '+parseInt(css[o])*this.bili2+'px;';
               
            }else if( o==='lineHeight' && isNaN(css[o]) ){
                cssobj+=o+':'+parseInt(css[o])*this.bili2+'px;';
               
            }else{
                cssobj+=o+':'+css[o]+";";
            }
            
          }
            
            return cssobj;
        },
        
        showanim:function(anim){
         
            if(anim.length==0){
                return ;
            }
            var animate="width:100%;height:100%;animation:";
            for(var i in anim){
              
                animate += anim[i].type+' ';
                animate +=anim[i].duration+'s ';
                animate +=' ';
                animate +=anim[i].delay+'s ';
                if(anim[i].count==-1){
                  animate +='infinite ';
                }else{
                  animate +=anim[i].count+' ';
                }
                if(anim.length-1==i){
                    if(i==0){
                       animate +='ease both; ';
                    }else{
                        animate +='normal;';
                    }
                }else{
                    if(i==0){
                      animate +='ease both, ';  
                    }else{
                      animate +='normal, ';
                    }
                    
                }
            }
            return animate;
        },
        showshape:function(b,id){
           $(document).ready(function(){
           if($('.svg'+id).attr('data-flag')==1){
                return;
           }else{
            var c,d;
            var c=document.createElementNS('http://www.w3.org/2000/svg', "svg");
            $.ajax({
                url:b.src,
                type:'get',
                dataType:'xml',
                success:function(res){
                  var d = res.getElementsByTagName("svg"),
                  e = parseFloat($(d).attr("width")==undefined?'100%':$(d).attr("width")),
                  f = parseFloat($(d).attr("height")==undefined?'100%':$(d).attr("width")),
                  g = $(d).find("[fill], [style*='fill']"),
                  h = b.in.properties ? b.in.properties : {};
                  if(b.in.properties.colors){
                    if ($(d).find("path").length > 1) {
                      $(d).find("[fill], [style*='fill']").each(function(i){
                        // console.log($(this).attr('fill'))
                        $(this).attr('fill',h.colors['color' + i])
                      }); 
                    }else{
                      if(h.colors['color0']){
                        $(d).find("[fill], [style*='fill']").attr("fill",h.colors['color0']);
						}else{
							$(d).find("[fill], [style*='fill']").attr("fill",h.colors['color1']);
						}
                    }                      
                  }
                  b.in.properties = h;
                  var viewBoxVal = "0 0 " + e + " " + f;
                  c = d[0];
                  c.id=id;
                  c.setAttribute("viewBox", viewBoxVal);
                  c.setAttribute("preserveAspectRatio", "none");
                  c.setAttribute("width", "100%");
                  c.setAttribute("height", "100%");
                  c.setAttribute("class", "element svg-element");
                  $(".svg"+id).append(c)
                 //console.log(c)
                  //document.getElementById("svg"+id).appendChild(c);
                      
                  $('.svg'+id).attr('data-flag',1)
                }

            });
            
           }
        });
       }
    
    }
};
