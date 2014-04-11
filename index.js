/**
 * Module dependencies
 */

var isURL = require('is-url');
var query = require('query');
var domify = require('domify');
var prefix = require('prefix');
var events = require('events');
var keycode = require('keycode');
var classes = require('classes');
var Emitter = require('emitter');
var template = require('./template');

/**
 * Cache the property name
 */

var transitionDuration = prefix('transition-duration');

/**
 * Expose `LinkSheet`
 */

module.exports = LinkSheet;

/**
 * Initlaize `LinkSheet`
 *
 * @param {String} message prompt message
 * @param {String} url url to preset
 */

function LinkSheet(message, url) {

  if(!this instanceof LinkSheet) return new LinkSheet(message, url);

  this.el = domify(this.template);
  this.modal = document.createElement('div');

  this.modal.className = 'ui-sheet-modal';
  this.modal.appendChild(this.el);

  this.input = query('textarea', this.el);
  this.message = query('.ui-prompt', this.el);
  this.buttonOK = query('.action-ok', this.el);
  this.buttonRemove = query('.action-remove-link', this.el);

  this.buttonOK.disabled = true;
  this.buttonRemove.disabled = true;

  this.message.textContent = message;
  this.classes = classes(this.el);
  this._duration = 300;

  if(url) this.value(url);
  this.bind();
}

/**
 * Install `Emitter`
 */

Emitter(LinkSheet.prototype);

/**
 * Template to use
 */

LinkSheet.prototype.template = template;

/**
 * Bind events
 */

LinkSheet.prototype.bind = function() {
  this.events = events(this.el, this);

  this.events.bind('click .action-ok', 'onokay');
  this.events.bind('click .action-cancel', 'oncancel');
  this.events.bind('click .action-remove-link', 'onremove');

  this.inputEvents = events(this.input, this);
  this.inputEvents.bind('keyup');
  this.inputEvents.bind('keydown');
}; 

/**
 * Unbind events
 */

LinkSheet.prototype.unbind = function() {
  this.events.unbind();
  this.inputEvents.unbind();
  this.winEvents && this.winEvents.unbind();

  this.events = null;
  this.inputEvents = null;
  this.winEvents = null;
};

/**
 * Set value (url) to input field
 * 
 * @param {String} v
 */

LinkSheet.prototype.value = function(v) {
  this.input.value = v;
  this.onkeyup();
  this.buttonRemove.disabled = false;
};

/**
 * Set transition duration
 * @param {Number} duration duration in ms
 */

LinkSheet.prototype.duration = function(duration){
  if(arguments.length) {
    return this._duration;
  } else {
    this._duration = duration;
  }
};

/**
 * onkeyup handler for input field
 * and check if the input value is valid url or not
 *
 * @param {Event} e
 */

LinkSheet.prototype.onkeyup = function(e) {
  var isValid = isURL(this.input.value);
  if(isValid) {
    this.buttonOK.disabled = false;
  } else {
    this.buttonOK.disabled = true;
  }
};

/**
 * Keydown handler to prevent line break and also save if valid.
 * 
 * @param {Event} e
 */

LinkSheet.prototype.onkeydown = function(e) {
  if('enter' === keycode(e.keyCode)) {
    e.preventDefault();
    if(!this.buttonOK.disabled) {
      this.input.blur(); 
      this.onokay();
    }
  }
};

/**
 * When cancel button is clicked
 */

LinkSheet.prototype.oncancel = function(e) {
  this.emit('cancel');
  this.hide();
};

/**
 * When okay button is clicked
 */

LinkSheet.prototype.onokay = function(e){
  this.emit('change', this.input.value);
  this.hide();
};

/**
 * When remove button is clicked
 */

LinkSheet.prototype.onremove = function(){
  this.input.value = '';
  this.emit('remove');
  this.hide();
};

/**
 * When esc is pressed
 * @param {Event} e
 */

LinkSheet.prototype.onescape = function(e){
  if('esc' === keycode(e.keyCode)) this.oncancel();
};

/**
 * Show sheet
 */

LinkSheet.prototype.show = function(){
  document.body.appendChild(this.modal);

  this.el.style[transitionDuration] = this._duration + 'ms';
  this.el.clientWidth; // Force redraw
  this.classes.add('show');
  this.input.focus();
  this.winEvents = events(window, this);
  this.winEvents.bind('keyup', 'onescape');
  this.emit('show');
};

/**
 * Hide sheet
 */

LinkSheet.prototype.hide = function(){
  var self = this;

  this.el.style[transitionDuration] = this._duration + 'ms';
  this.el.clientWidth; // Force redraw

  this.classes.remove('show');
  this.winEvents.unbind('keyup');
  this.winEvents = null;

  setTimeout(function(){
    document.body.removeChild(self.modal);
    self.emit('hide');
  }, this._duration);
};
