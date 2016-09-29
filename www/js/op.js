
var Op = {
    captureAudio:function(){
        navigator.device.capture.captureAudio(function(imageURI) {
            $(".takePicture",CreatePage.content).before('<div class="images"><div class="audio icon-mic" v-type="audio" src="'+imageURI[0].fullPath+'"></div></div>');
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
            $(".takePicture",CreatePage.content).before('<div class="images"><div class="img" v-type="img" style="background-image:url(' + src + ')" src="'+src+'"></div></div>');
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
            $(".takePicture",CreatePage.content).before('<div class="images"><div class="img" v-type="img" style="background-image:url(' + src + ')" src="'+src+'"></div></div>');
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
    preview:function(images,index){
        previewPage.init(images,index);
    }
};


var menuControl = function(param){
    var html = "<div class='menuControl fullscream'><div>";
    if(Utils.isArray(param)){
        for (var i = 0; i < param.length; i++) {
            var p = param[i];
            if(p.op&&p.trigger){
                html += "<div>"+p.op+"</div>";
            }else{
                html += "<div class='message'>"+p.message+"</div>";
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
            var tr = param[_target.index()].trigger;
            if(tr){
                tr.call(null);
            }
        }
        close();
    });
    $("body").append(m);
    setTimeout(function() {m.addClass("show");}, 10);
}
