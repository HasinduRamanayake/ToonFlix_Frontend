// This function will be called when the document is ready
function startApp() {
    // Start Backbone history
    Backbone.history.start();
}

// Instantiate the router and start the application
var appRouter; // Declare the router at a scope accessible throughout your application

$(document).ready(function() {
    appRouter = new AppRouter(); // Instantiate the router
    console.log(appRouter);
    startApp(); // Start the app
   
});
