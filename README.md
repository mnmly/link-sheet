# LinkSheet

Create link sheet that behaves like osx.

![](http://c.mnmly.com/UwgH/link-sheet.gif)

☞ [Demo](http://mnmly.github.io/link-sheet)

### Install

```
component install mnmly/link-sheet
```

*note*: it doesn't include the style like the `demo`, the css comes with it is pretty much plain.

### Usage
```js

var LinkSheet = require('link-sheet');
var message = 'Enter the Internet address (URL) for this link.';
var sheetA = new LinkSheet(message);
var sheetB = new LinkSheet(message, 'http://google.com');

setTimeout(function(){
  // Show sheetA.
  sheetA.show();
}, 500);

sheetA.on('change', function(val){
  var div = document.createElement('div');
  div.textContent = val;
  document.body.appendChild(div);
});

sheetA.on('hide', function(){
  setTimeout(function(){
    // Show sheetB but with duration of 500ms;
    sheetB.duration(500);
    sheetB.show();
  }, 2000);
});

```

### API

  - [LinkSheet()](#linksheet)
  - [LinkSheet.duration()](#linksheetdurationdurationnumber)
  - [LinkSheet.show()](#linksheetshowdurationnumber)
  - [LinkSheet.hide()](#linksheethidedurationnumber)


#### LinkSheet(message:String, url:String)

  Initlaize `LinkSheet` with prompt message and optionally set the initial value for input.

#### LinkSheet.duration(duration:Number)

  Set/get transition duration

#### LinkSheet.show()
  Show sheet

#### LinkSheet.hide()

  Hide sheet


### Events

  - `show`: on sheet is shown
  - `hide`: on sheet is hidden
  - `cancel`: on cancel button is pressed
  - `remove`: on remove link button is pressed
  - `change`: on okay button is pressed


### Lisence

  MIT
