
/* Model */

var Feed = Backbone.Model.extend({
  defaults: {
    title: 'Default title',
    description: 'Default description',
    image: 'img.jpg'
  }
});


/* Collection */

var FeedsCollection = Backbone.JFeed.Collection.extend({
  
  model: Feed,

  initialize: function(models, options) {
    this.options = options;
  },

});


/* View */

var FeedView = Backbone.View.extend({
  tagName: 'div',
  className: 'feedItem',
  template: _.template($('#feed-template').html()),

  render: function() {

    this.$el.html(this.template(this.model.attributes));
    
    return this;
  },

});

var FeedsListView = Backbone.View.extend({

  el: '#bb-gallery',

  initialize: function() {
    this.collection = new FeedsCollection([], {feedUrl: this.options.feedUrl});

    this.listenTo(this.collection, 'reset', this.render);
    this.collection.fetch();
  },

  render: function() {

    this.$el.empty();

    this.collection.each(this.renderFeed, this);

    /*Create Gallery*/
    this.createGallery();

    return this;
  },

  renderFeed: function(item) {
    var feedView = new FeedView( {model: item} );
    this.$el.append(feedView.render().el);
  },

  createGallery: function() {
    this.$el.jGallery({
      browserHistory: false
    });
  }

});


/* Router */

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'showIndex',
    'feeds/:id': 'showFeeds'
  },

  showIndex: function() {
    console.log ('This is index route');
  },

  showFeeds: function(id) {
    console.log ('This is feeds route: ' + id);
    
    /* Create App view instanse */
    new FeedsListView( {feedUrl: this.getFeedUrl(id)} );
  },

  getFeedUrl: function(id) {
    return 'proxy.php?url=https://www.flickr.com/services/feeds/photos_public.gne?id=' + id + '&lang=en-us&format=atom';
  }

});


/* Starting App */

new AppRouter();
Backbone.history.start();