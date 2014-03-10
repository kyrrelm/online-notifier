// objektland er mellom to {}
 
// i objektland er = egentlig :
// i objektland er ; egentlig ,
 
// i objektland er
//      function hest() {};
// egentlig
//      hest: function() {},
 
var Events = {
    debug: 0,
    msgError: "Shit went to hell, sawwy",
 
    get: function(callback) {
 
        // Get ICS from server
        Ajaxer.getPlainText({
            url: 'https://online.ntnu.no/events/events.ics',
            success: function(icsString) {
 
                // Do something with icsString
                console.log(icsString);
 
                // do stuff
 
                // Call it back
                callback('hest');
            },
            error: function() {
                console.log('ERROR: ' + this.msgError);
            },
        })
    },
 
}
 
Events.get(function(resultData) {
    console.log('result from callback: ' + resultData);
});
 
 
// 'string'
// "string"
// 1 er int
// 1.1 er float
// true er bool
// {} er objekt
// [] er array
// char finnes ikke (sier vi, lol)