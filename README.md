# Griddle

> Griddle is a web application that provides a unified dashboard of text, images, and videos that encourages people to thoughtfully consider and develop their ideas before posting anything on social media.

<br>

[![griddle-screenshot-desktop](https://user-images.githubusercontent.com/19500679/37472755-35022454-2843-11e8-8050-0cf940c2067e.png)]()

---

## Table of Contents
- [Setup](#setup)
- [Features](#features)
- [Libraries/APIs](#external)
- [Todos](#todos)
- [Contributors](#contributors)
- [License](#license)

---
## Setup

> As easy as can be — built with vanilla JavaScript. Simply clone the repo and view the contents of the folder titled public.


## Features

* Add a variety of card types including text, images, videos, and lists
* Available card actions
  - drag/ rearrange
  - edit
  - delete
  - post to Twitter/ Facebook (plain text only)
* Speech Recognition to populate text cards
* Card filtering by type
* Database storage via Firebase
* Responsive mobile-ready CSS Grid Layout

## External
> LIbraries and APIs used within the application
* [Firebase](https://firebase.google.com/)
* [Draggable JS](https://github.com/Shopify/draggable)
* [Materialize CSS](http://materializecss.com/)
* [jQuery (depedence for Materialize)](https://jquery.com/)
* [Annyang Speech recognition](https://github.com/TalAter/annyang)
* [Codebird (Twitter API)](https://github.com/jublonet/codebird-js)
* [Facebook JS SDK](https://developers.facebook.com/docs/javascript)

## Todos
* Resizable cards with css: grid-auto-flow: dense
* Combine multiple elements from different card types into a single card
* In-card editor
* Improve UI and adding/editing card in mobile
* Add sign in authentication
* Fix bug that drags elements when clicking card action buttons
* Upload local images

## Contributors

| <a href="https://github.com/jamesnmcdowell" target="_blank">**James McDowell**</a> | <a href="https://github.com/rcackerley" target="_blank">**Robby Ackerley**</a> | <a href="https://github.com/illiaChaban" target="_blank">**Illia Chaban**</a> |
| :---: |:---:| :---:|
| [![](https://avatars2.githubusercontent.com/u/19500679?&s=300)](https://github.com/jamesnmcdowell)    | [![](https://avatars3.githubusercontent.com/u/20142674?&s=300)](https://github.com/rcackerley) | [![FVCproductions](https://avatars1.githubusercontent.com/u/34459770?=&s=300)](https://github.com/illiaChaban)  |
| <a href="https://github.com/jamesnmcdowell" target="_blank">`github.com/jamesnmcdowell`</a> | <a href="https://github.com/rcackerley" target="_blank">`github.com/rcackerley`</a> | <a href="https://github.com/illiaChaban" target="_blank">`github.com/illiaChaban`</a> |

- You can just grab their GitHub profile image URL
- You should probably resize their picture using `?s=200` at the end of the image URL.

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](https://github.com/jamesnmcdowell/griddle/blob/master/LICENSE)**
