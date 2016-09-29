
var Request = {
    list(page){
        page = page||1;
        return $.getJSON("http://www.ch-un.com/done/daily.php",{type:"list",pageNo:page});
    },
    post(data){
        data = Data.dispose(data);
        data.updateAt = moment(data.updateAt).format("f");
        data.type = "insert";
        return $.post("http://www.ch-un.com/done/daily.php",data).then(function(result){
            if(result.status==200){
                Data.updateStatus(data);
            }
        });
    }, 
    getAddress:function(){
        var param = {};
        if(D.from=="google"){
            param.latlng = D.geo.position.googleLocation;
            param.key = "AIzaSyDGhyoBqeg9Wa9VTNziyg7CwC02E18skTs";
            param.language = "zh-CN";
            param.result_type = "intersection|country|locality|sublocality|neighborhood|premise|natural_feature|airport|point_of_interest"
            var url = "https://maps.googleapis.com/maps/api/geocode/json";
            console.log(url);
            console.log($.param(param));
            return $.getJSON(url,param);
        }else{
            param.location = D.geo.position.location;
            param.key = "1037b86d660b8e05b03d4a0a5fe8e1b5";
            param.radius = 500;
            param.types = "10|11|12|13|150500|150300|150200|150104|150106";
            var url = "http://restapi.amap.com/v3/geocode/regeo";
            return $.getJSON(url,param);
        }
    },
    getPOI:function(){
        var param = {};
        if(D.from=="google"){
            param.location = D.geo.position.googleLocation;
            param.key = "AIzaSyDGhyoBqeg9Wa9VTNziyg7CwC02E18skTs";
            param.types = "establishment";
            param.language = "zh-CN";
            param.rankby = "distance";
            var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
            return $.getJSON(url,param);
        }else{
            param.location = D.geo.position.location;
            param.key = "1037b86d660b8e05b03d4a0a5fe8e1b5";
            param.radius = 500;
            param.types = "10|11|12|13|150500|150300|150200|150104|150106";
            param.sortrule = "distance";
            var url = "http://restapi.amap.com/v3/place/around";
            return $.getJSON(url,param);
        }
    },
    getToken(){
        return $.get("http://www.ch-un.com/upload_token.php");
    },
    uploadPhoto(token,srcs,callback) {
        var count = srcs.length;
        var urls = [];
        var fail = function(result) {
            count--;
            console.log(result);
        }
        var ft = new FileTransfer();
        for (var i = srcs.length - 1; i >= 0; i--) {
            var src = srcs[i];
            if(src.isPosed){
                urls.push(src);
                continue;
            }
            var picUrl = src.src;
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=picUrl.substr(picUrl.lastIndexOf('/')+1);
            var params = new Object();
            params.token = token;
            options.params = params;
            ft.upload(picUrl, encodeURI("http://upload.qiniu.com/"), function(result) {
                urls.push({src:"http://7xpm14.com1.z0.glb.clouddn.com/"+JSON.parse(result.response).key,type:src.type,isPosed:true,oldUrl:picUrl});
                count--;
                if(count==0){
                    // alert(urls[0]);
                    callback.call(null,urls);
                    // alert("上传成功");
                }
                console.log(JSON.stringify(result.response));
            }, fail, options);
        }
         
    },
    postData(param){
        if(param.urls.length==0){
            Request.post(param);
            return;
        }
        Request.getToken().then(function(result){
            Request.uploadPhoto(result,param.urls,function(urls){
                param.urls = urls;
                Data.update(param);
                Request.post(param);
            });
        });
    }
}