# AllezCine - Website with Layout

## Table of contents

* [Briefing](#briefing)
    - [Entrance](#entrance)
    - [Menu](#menu)
    - [On your mind](#on-your-mind)
    - [Social networks buttons](#the-social-networks-buttons)
    - [Movies section](#movies-section)
    - [Featured movies section](#featured-movies-section)
    - [Section shop movie](#section-shop-movie)
    - [Section contact us](#section-contact-us)
    - [Footer](#footer)
* [Technologies](#technologies)
* [Contributors](#contributors)
* [Preview](#preview)

## Briefing
ou will realize, as a group, a website for renting and selling films. WARNING, this is a **one-page** site!

- [Click here to see the layout](https://raw.githubusercontent.com/becodeorg/Hamilton-promo-3/master/Projects/FrontEnd-AllezCine/layout-one-v2.jpg)
- We also put at your disposal some movie posters, just to save you some time (titles, years and genre are in the names of the pictures.

### Entrance
When entering the site, you must **force the user to indicate his age**.
If he is 18 or older, allow him to enter the site, otherwise redirect him to IMDB. (For this use JS or jQuery for a pop-up).

Once on the site, display anywhere on the site a box for the **warning of cookies**. (we see lately all over the internet). When you click on the [login or register] buttons, display a login form in JS or jQuery in a box. (see the website http://www.commeaucinema.com)
This login form will contain:
- identifier,
- password,
- a [OK] button,
- a [Create an account] button,
- a [stay connected],
- a link [If you have forgotten your password],
- and a link [cancel].

For the register form
- name
- E-mail
- Password
- Confirm password
- General conditions of use [select button]
- Register button

(Difficulty: make the form disappear when you click on CANCEL, on the form or the register button, and vice versa).

### Menu
A **menu** in bootstrap with submenus. (**Hamburger menu for responsive**).

Since it's a onepage, the links in the menu should point to the dedicated sections.

### On your mind
The **jumbotron** of the header must be 100% of the width of the screen in which there is a slide (Cf layout). Make the **slide** work in CSS or JS or jQuery)

### The social networks buttons
The **social network buttons** are in a fixed position. If you click on a button, it must lengthen with an animation (here just use CSS).

### Movies section
Each film must include:
- a poster,
- a title,
- the year of release,
- and the kind.

If you click on the image or title of the film, make appear in a modal (Bootstrap) the trailer youtube of the film, the description, the director, the year of release of the film, the genre, the actors ...

### Featured movies section
Create buttons to filter movies by genre (Jquery or JS).
If you click on the ACTION button for example, only show the action movies, etc.

When you click on the "plus movies" button, show the other hidden movies. Remove the "more movies" button and replace it with the "Less movies" button if you click on "less movies", hide the movies and make the "more movies" button reappear (In jQuery it will be easier, with a toggle for example).

### Section shop movie
Use the two small buttons on the right to scroll the movies from left to right and aim-versa (Jquery, bootstrap, JS choice)

### Section contact us
Create a form and display in a pop-up
the entries of the form when clicking on "Send Message". (No treatment in php, soon promised)

Bonus: put a map in the Contact us section.

### Footer
Make sure that when you click on the small red button with the white arrow, you go up to the header of the site, the little button disappears once the header appears.

CONSTRAINT: create this button in pure JS with createElement (), createTextNode () and company (), display it on the DOM, position it then style it in CSS in the style sheet.

MAKE THE SITE RESPONSIVE (Bootstrap + Media queries)

## Technologies

* [jQuery](http://jquery.com/)
* [jQuery Validate](https://jqueryvalidation.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Font Awesome Icons](https://fontawesome.com/)
* [Json](https://www.json.org/)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [HTML5](https://www.w3.org/html/)
* [CSS3](https://www.w3.org/Style/CSS/)

## Contributors

* [Alexandre](https://github.com/alexandrentougas)
* [Laurent](https://github.com/laurenthu)

## Preview

[https://laurenthu.github.io/AllezCine/shops/](https://laurenthu.github.io/AllezCine/shops/)
