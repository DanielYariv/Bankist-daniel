'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});
//same as above but with regular for loop
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1'); //its Id SO WE PUT #

btnScrollTo.addEventListener('click', function (e) {
  // const s1coordinates = section1.getBoundingClientRect();

  //scrolling
  // window.scrollTo(
  //   s1coordinates.left + window.pageXOffset,
  //   s1coordinates.top + window.pageYOffset
  // );

  // another way . better one:
  // window.scrollTo({
  //   left: s1coordinates.left + window.pageXOffset,
  //   top: s1coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // new way works only on new browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation

//option 1 not recommended
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//option 2 event delegation
//1.add event listener to common parent element
//2.determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching startegy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //gueard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(function (tab) {
    tab.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function (content) {
    content.classList.remove('operations__content--active');
  });

  //activete tab
  clicked.classList.add('operations__tab--active');

  //active content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) e.preventDefault();
  {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(function (el) {
      if (el !== link) return (el.style.opacity = opacity);
    });
    logo.style.opacity = opacity;
  }
};

const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//sticky navigation old way
// const initialCordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (this.window.scrollY > initialCordinates.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//sticky navigation : interesection obserever API

const header = document.querySelector('.header');
const stickyNavigate = function (entries, obserever) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserve = new IntersectionObserver(stickyNavigate, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObserve.observe(header);

//reveal sections using interesection obserever API
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, obserever) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  obserever.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, obserever) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  obserever.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(function (img) {
  return imgObserver.observe(img);
});

//slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currendSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
// const slider = document.querySelector('.slider');
// slider.style.overflow = 'visible'; //מראה לנו גם קצת מהתמונות הבאות

//functions
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  });
};

const goToSlide = function (slide) {
  slides.forEach(function (s, i) {
    return (s.style.transform = `translateX(${100 * (i - slide)}%)`);
    //0% , 100%,200%,300%
  });
};

//go to slide

//next slide
const nextSlide = function () {
  if (currendSlide === maxSlide - 1) currendSlide = 0;
  else currendSlide++;
  goToSlide(currendSlide);
  activateDot(currendSlide);
};

//preview slide
const previewSlide = function () {
  if (currendSlide === 0) currendSlide = maxSlide - 1;
  else currendSlide--;
  goToSlide(currendSlide);
  activateDot(currendSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};

init();

//event handlers
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previewSlide);

document.addEventListener('keydown', function (e) {
  // console.log(e);
  if (e.key === 'ArrowLeft') {
    previewSlide();
  }
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // console.log('Dot');
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
/////////////////////////////////////////////////////////////
// //selecting elements
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// document.getElementsByClassName('btn');

// // creating and inserting elements
// //insertAdjacentHTML();
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent =
//   'we use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'we use cookied for improved functionality and analytics.<button class ="btn btn--close--cookie">Got it!</button';
// header.prepend(message);
// header.append(message);
