'use strict';

(function () {

  var RANDOM_PICTURES_COUNT = 10;

  var load = window.backend.load;
  var showLoadError = window.utils.showLoadError;
  var debounce = window.debounce;
  var getRandomValue = window.utils.getRandomValue;

  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;
  var filtersElement = document.querySelector('.img-filters');
  var buttonFilterPopularElement = filtersElement.querySelector('#filter-popular');
  var buttonFilterNewElement = filtersElement.querySelector('#filter-new');
  var buttonFilterDiscussedElement = filtersElement.querySelector('#filter-discussed');

  function createPicturesId(arr) {
    return arr.map(function (element) {
      return parseInt(element.url.replace(/\D+/g, ''), 10);
    });
  }

  function createPictureElement(pictures, identifiers) {
    var pictureElement = pictureTemplate.cloneNode(true);
    var commentsCount = pictures.comments.length;
    var likesCount = pictures.likes;

    pictureElement.querySelector('.picture__img').src = pictures.url;
    pictureElement.querySelector('.picture__link').dataset.id = identifiers;
    pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
    pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

    return pictureElement;
  }

  function renderPictures(pictures, identifiers) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (picture, index) {
      fragment.appendChild(createPictureElement(picture, identifiers[index]));
    });

    picturesContainerElement.appendChild(fragment);
  }

  function showPictures(pictures) {
    var picturesId = createPicturesId(pictures);
    var pictureContainer = document.querySelector('.pictures');
    renderPictures(pictures, picturesId);
    pictureContainer.classList.remove('hidden');
    filtersElement.classList.remove('img-filters--inactive');
  }

  function removePreviousPictures() {
    var pictures = picturesContainerElement.querySelectorAll('.picture__link');
    Array.prototype.slice.call(pictures);
    pictures.forEach(function (element) {
      element.remove();
    });
  }

  function changeActiveElement(currentButton) {
    var previousButton = document.querySelector('.img-filters__button--active');

    previousButton.classList.remove('img-filters__button--active');
    currentButton.classList.add('img-filters__button--active');
  }

  function filterPopularElement(currentButton, pictures) {
    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(pictures);
  }

  function filterRandomPictures(currentButton, pictures) {
    var copyArr = pictures.slice();
    var newArr = [];

    for (var i = 0; i < RANDOM_PICTURES_COUNT; i++) {
      var randomElementIndex = getRandomValue(0, copyArr.length - 1);
      var randomElement = copyArr[randomElementIndex];
      newArr.push(randomElement);
      copyArr.splice(randomElementIndex, 1);
    }

    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(newArr);
  }

  function filterDiscussedPictures(currentButton, pictures) {
    var copyArr = pictures.slice();

    copyArr.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(copyArr);
  }

  function onLoad(data) {
    window.pictures = data;
    showPictures(window.pictures);
  }

  var onFilterPopularClick = debounce(function (evt) {
    filterPopularElement(evt.target, window.pictures);
  });

  var onFilterNewClick = debounce(function (evt) {
    filterRandomPictures(evt.target, window.pictures);
  });

  var onFilterDiscussedClick = debounce(function (evt) {
    filterDiscussedPictures(evt.target, window.pictures);
  });

  buttonFilterNewElement.addEventListener('click', onFilterNewClick);
  buttonFilterPopularElement.addEventListener('click', onFilterPopularClick);
  buttonFilterDiscussedElement.addEventListener('click', onFilterDiscussedClick);

  load(onLoad, showLoadError);

})();
