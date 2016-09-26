cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
        "id": "cordova-plugin-image-picker.ImagePicker",
        "pluginId": "cordova-plugin-image-picker",
        "clobbers": [
            "plugins.imagePicker"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-image-picker": "1.1.1"
}
// BOTTOM OF METADATA
});