
function startApp() {
    // Starting Backbone history
    Backbone.history.start();
}

// Instantiating the router and start the application
var appRouter; 

$(document).ready(function() {
    appRouter = new AppRouter();
    startApp(); // Starting the application
   
});
