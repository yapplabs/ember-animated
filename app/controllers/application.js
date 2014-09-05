import Ember from "ember";
// BEGIN-SNIPPET modal-setup
import { ModalControllerMixin, launchModal } from "vendor/liquid-fire";

export default Ember.Controller.extend(ModalControllerMixin, {
  // Define one or more query params.
  queryParams: ['hello'],

  // Set default values for them as desired.
  hello: null,

  // Bind the params to your modal component. `withParams` is required
  // and may also be a list. Whenever any withParams have non-default
  // values, the modal will render.
  helloModal: launchModal('hello-modal', {
    withParams: 'hello',
    ariaLabel: 'Welcome Message'
  }),
  // END-SNIPPET

  tableOfContents: function(){
    return [
      { route: "index",   title: "Introduction"},
      { route: "helpers-documentation", title: "Template Helpers",
        children: [
          {route: "helpers-documentation.liquid-outlet", title: "liquid-outlet"},
          {route: "helpers-documentation.liquid-with", title: "liquid-with"},
          {route: "helpers-documentation.liquid-bind", title: "liquid-bind"},
          {route: "helpers-documentation.liquid-if", title: "liquid-if"},
        ]
      },
      { route: 'transition-map', title: 'Transition Map',
        children: [
          {route: 'transition-map.route-constraints', title: 'Matching by route'},
          {route: 'transition-map.model-constraints', title: 'Matching by model'},
          {route: 'transition-map.dom-constraints', title: 'Matching by DOM context'},
          {route: 'transition-map.choosing-transitions', title: 'Choosing transition animations'}
        ]
      },
      { route: 'transitions', title: 'Transitions',
        children: [
          {route: 'transitions.predefined', title: "Predefined transitions"},
          {route: 'transitions.defining', title: 'Defining custom transitions'},
          {route: 'transitions.primitives', title: 'Animation Primitives'}
        ]
      },
      { route: 'modal-documentation', title: 'Modal Dialogs',
        children: [
          {route: 'modal-documentation.modal-controller-mixin', title: 'ModalControllerMixin'},
          {route: 'modal-documentation.launch-modal', title: 'launchModal'},
          {route: 'modal-documentation.component', title: 'Modal Components'}
        ]
      }
    ];
  }.property(),

  flatContents: function(){
    var flattened = [];
    this.get('tableOfContents').forEach(function(entry) {
      flattened.push(entry);
      if (entry.children){
        flattened = flattened.concat(entry.children);
      }
    });
    return flattened;
  }.property('tableOfContents'),


  currentIndex: function(){
    var contents = this.get('flatContents'),
        current = this.get('currentRouteName'),
        bestMatch,
        entry;

    for (var i=0; i<contents.length; i++) {
      entry = contents[i];
      if (entry.route && new RegExp('^' + entry.route.replace(/\./g, '\\.')).test(current)) {
        if (typeof(bestMatch) === 'undefined' || contents[bestMatch].route.length < entry.route.length) {
          bestMatch = i;
        }
      }
    }
    return bestMatch;
  }.property('currentRouteName', 'flatContents'),

  nextTopic: function(){
    var contents = this.get('flatContents'),
        index = this.get('currentIndex');
    if (typeof(index) !== "undefined") {
      return contents[index+1];
    }
  }.property('currentIndex', 'flatContents'),

  prevTopic: function(){
    var contents = this.get('flatContents'),
        index = this.get('currentIndex');
    if (typeof(index) !== "undefined") {
      return contents[index-1];
    }
  }.property('currentIndex', 'flatContents')

});
