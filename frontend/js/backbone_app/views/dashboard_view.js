var DashboardView = Backbone.View.extend({
        
    // Initialization function
    initialize: function() {
        this.loadTemplate();
    },
    loadTemplate: function() {
        var self = this;
        // Fetch the template HTML from an external file
        $.get('html/dashboard.html', function(data) {
            var templateHtml = $("<div>").html(data).find('#home-template').html();
            if (templateHtml) {
                self.template = _.template(templateHtml);
                self.render();                
            } else {
                console.error('Template content not found.');
            }
            
        }).fail(function() {
            console.error('Failed to load the dashboard template.');
        });
    },

    // Render the template content
    render: function() {
        if (this.template) {
            this.$el.html(this.template());
            // Initialize any sliders or interactive components here
            this.initializeSwiper();
        } else {
            console.error('Template not loaded yet.');
        }
        return this;
    },

    // Initialize Swiper
    initializeSwiper: function() {
        new Swiper('.swiper', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination'
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            }
        });
    }
});
