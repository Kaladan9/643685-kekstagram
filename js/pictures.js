'use strict';

(function () {

  var Pictures = window.utils.Pictures;
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

  function createPictureElement(pictures, idArr) {
    var pictureElement = pictureTemplate.cloneNode(true);
    var commentsCount = pictures.comments.length;
    var likesCount = pictures.likes;

    pictureElement.querySelector('.picture__img').src = pictures.url;
    pictureElement.querySelector('.picture__link').dataset.id = idArr;
    pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
    pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

    return pictureElement;
  }

  function renderPictures(pictures, idArr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(createPictureElement(pictures[i], idArr[i]));
    }

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

  function filterPopularElement(currentButton, pictures, picturesOption) {
    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(pictures, picturesOption);
  }

  function filterRandomPictures(currentButton, pictures, picturesOption) {
    var copyArr = pictures.slice();
    var newArr = [];

    for (var i = 0; i < 10; i++) {
      var randomElementIndex = getRandomValue(0, copyArr.length - 1);
      var randomElement = copyArr[randomElementIndex];
      newArr.push(randomElement);
      copyArr.splice(randomElementIndex, 1);
    }

    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(newArr, picturesOption);
  }

  function filterDiscussedPictures(currentButton, pictures, picturesOption) {
    var copyArr = pictures.slice();

    copyArr.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    changeActiveElement(currentButton);
    removePreviousPictures();
    showPictures(copyArr, picturesOption);
  }

  function onLoad(data) {
    window.pictures = data;
    showPictures(window.pictures, Pictures);
  }

  var onFilterPopularClick = debounce(function (evt) {
    filterPopularElement(evt.target, window.pictures, Pictures);
  });

  var onFilterNewClick = debounce(function (evt) {
    filterRandomPictures(evt.target, window.pictures, Pictures);
  });

  var onFilterDiscussedClick = debounce(function (evt) {
    filterDiscussedPictures(evt.target, window.pictures, Pictures);
  });

  buttonFilterNewElement.addEventListener('click', onFilterNewClick);
  buttonFilterPopularElement.addEventListener('click', onFilterPopularClick);
  buttonFilterDiscussedElement.addEventListener('click', onFilterDiscussedClick);

  load(onLoad, showLoadError);

})();
