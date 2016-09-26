
var Op = {
    captureAudio:function(){
        navigator.device.capture.captureAudio(function(imageURI) {
            $(".create .takePicture").before('<div class="images"><div class="audio icon-mic" v-type="audio" src="'+imageURI[0].fullPath+'"></div></div>');
        }, function(){}, {limit: 2});
    },
    getPicture: function() {
        // window.imagePicker.getPictures(
        //     function(results) {
        //         for (var i = 0; i < results.length; i++) {
        //             $(".create .takePicture").before('<div class="images"><div class="img" style="background-image:url(' + results[i] + ')"></div></div>');
        //         }
        //     }, function (error) {
        //         console.log('Error: ' + error);
        //     }
        // );
        navigator.camera.getPicture(function(imageURI) {
            var src = imageURI;
            $(".create .takePicture").before('<div class="images"><div class="img" v-type="img" style="background-image:url(' + src + ')" src="'+src+'"></div></div>');
        }, function(message) {
            // navigator.notification.alert("拍照失败，原因：" + message, null, "警告");
        }, {
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM ,
            destinationType:Camera.DestinationType.FILE_URI,
            encodingType:Camera.EncodingType.JPEG,
            mediaType:Camera.MediaType.PICTURE,
            correctOrientation:true,
            quality: 50,
            targetWidth:768, //图片输出宽度
            targetHeight:1280 //图片输出高度
        });
    },
    takePicture: function() {
        navigator.camera.getPicture(function(imageURI) {
            var src = imageURI;
            $(".create .takePicture").before('<div class="images"><div class="img" v-type="img" style="background-image:url(' + src + ')" src="'+src+'"></div></div>');
        }, function(message) {
            // navigator.notification.alert("拍照失败，原因：" + message, null, "警告");
        }, {
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType:Camera.EncodingType.JPEG,
            mediaType:Camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            correctOrientation:true,
            quality: 50,
            targetWidth:768, //图片输出宽度
            targetHeight:1280 //图片输出高度
        });
    },
    getLocations:function() {
        if (!D.geo.location) {
            return false;
        }
        $(".listloadding").show();
        $(".locationList").empty();

        Address.getPOI(function(locations){
            var html = "";
            for(var i = 0; i < locations.length; i++){
                var loc = locations[i];
                html += '<li>';
                html += '<p class="word">'+loc.title+'</p>';
                if(loc.description)html += '<p class="font12 gray1">'+loc.description+'</p>';
                html += '</li>';
            }
            $(".locationList").append(html);
            $(".listloadding").hide();
            $(".locationList li").on("click",function(){
                var l = $(".word",this).text();
                D.geo.address = l;
                $(".location-desc").text(l);
                $(".locationSection").removeClass("show");
            });
        });
        return true;
    },
    getGeolocation:function() {
        D.geo = {};
        $(".location-desc").text("正在加载地址");
        navigator.geolocation.getCurrentPosition(function(position) {
            var coords = D.coords = GPS.gcj_encrypt(position.coords.latitude,position.coords.longitude);
            // var coords = D.coords = GPS.gcj_encrypt(100.015907,9.517026);
            position.location = (coords.lon) + "," + (coords.lat);
            position.googleLocation = (coords.lat) + "," + (coords.lon);
            D.geo = position;
            // console.log(position.googleLocation);
            $(".location-desc").text("已获取坐标");
            Address.getAddress(function(l){
                D.geo.address = l;
                $(".location-desc").text(l);
            });
        }, function(error) {
        }, { maximumAge: 3000, timeout: 100000, enableHighAccuracy: true });
    },
    refreshView:function(){
        $(".app .list>div").not(":first").remove();

        Data.list(function(data){
            var html = "";
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                var m = moment(data[i].updateAt);
                html += '<div><div class="calarder"><span class="date">'+m.date()+'</span>&nbsp;&nbsp;<span class="month">'+m.month()+'月</span></div>';
                if(d.urls.length==0){
                    html += '<div class="images empty"><div>空</div></div>';
                }else{
                    html += '<div class="images"><div class="img" style="background-image:url('+d.urls[0].src+')"></div></div>';
                }
                html += '<div class="content"><div class="word">'+d.content+'</div><div class="desc">'+d.address+'</div></div></div>';
            }
            $(".app .list").append(html);
        });
    }
};


var menuControl = function(param){
    var html = "<div class='menuControl fullscream'><div>";
    if(Utils.isArray(param)){
        for (var i = 0; i < param.length; i++) {
            var p = param[i];
            if(p.op&&p.trigger){
                html += "<div>"+p.op+"</div>";
            }
        }
    }
    html += "</div></div>";
    var m = $(html);
    var close = function(){
        m.removeClass("show");
        setTimeout(function() {m.remove()}, 300);
    }
    m.on("click",function(event){
        if(!m.is(event.target)){
            var _target = $(event.target);
            param[_target.index()].trigger.call(null);
        }
        close();
    });
    $("body").append(m);
    setTimeout(function() {m.addClass("show");}, 10);
}
