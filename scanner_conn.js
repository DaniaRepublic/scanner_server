// connector for barcode scanner
const HID = require('node-hid');

class ScannerConn {
    constructor(vid, pid) {
        this.vid = vid;
        this.pid = pid;
    }
    
    device = null;
    get device() {
        return this.device;
    }
    
    connect() {
        var vid = this.vid;
        var pid = this.pid;
        if (!vid || !pid) {
            return null;
        }
        var devices = HID.devices();
        var deviceInfo = devices.find( function(d) {
            return d.vendorId===vid && d.productId===pid;
        });
        if( deviceInfo ) {
            this.device = new HID.HID( deviceInfo.path );
        }
    }
}

module.exports = { ScannerConn }