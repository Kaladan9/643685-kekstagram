'use strict';

var Pictures = {
  COMMENTS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  DESCRIPTIONS: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ],
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 1,
  MAX_COMMENTS: 3
};

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function getRandomArrValue(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createCommentsArr(comments, minComments, maxComments) {
  var count = getRandomValue(minComments, maxComments);
  var unusedComments = comments.slice();
  var resArr = [];

  for (var i = 0; i < count; i++) {
    var commentIndex = getRandomArrIndex(unusedComments);
    resArr.push(unusedComments[commentIndex]);
    unusedComments.splice(commentIndex, 1);
  }
  return resArr;
}

function createPicturesList(pictureOption) {
  var pictures = [];

  for (var i = 0; i < pictureOption.COUNT; i++) {
    pictures.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomValue(pictureOption.MIN_LIKES, pictureOption.MAX_LIKES),
      comments: createCommentsArr(pictureOption.COMMENTS, pictureOption.MIN_COMMENTS, pictureOption.MAX_COMMENTS),
      description: getRandomArrValue(pictureOption.DESCRIPTIONS)
    });
  }
  return pictures;
}

function createPictures(pictures) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var pictureElement = pictureTemplate.cloneNode(true);
  var commentsCount = pictures.comments.length.toString();
  var likesCount = pictures.likes.toString();

  pictureElement.querySelector('.picture__img').src = pictures.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = likesCount;
  pictureElement.querySelector('.picture__stat--comments').textContent = commentsCount;

  return pictureElement;
}

function renderPictures(pictures, picturesCount) {
  var similarListElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picturesCount; i++) {
    fragment.appendChild(createPictures(pictures[i]));
  }
  similarListElement.appendChild(fragment);
}

function showPictures(picturesOption) {
  var pictures = createPicturesList(picturesOption);
  var pictureContainer = document.querySelector('.pictures');

  renderPictures(pictures, picturesOption.COUNT);
  pictureContainer.classList.remove('hidden');
}

function getRandomAvatarUrl(min, max) {
  return 'img/avatar-' + getRandomValue(min, max) + '.svg';
}

function removeVanillaComments() {
  var comments = document.querySelector('.social__comments');

  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
  }
}

function getComments(count, comments) {
  var similarListElement = document.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var newElement = document.createElement('li');
    newElement.className = 'social__comment social__comment--text';
    newElement.innerHTML =
      '<img class="social__picture" src=' + getRandomAvatarUrl(1, 6) +
      ' alt="Аватар комментатора фотографии" width="35" height="35">'
      + comments[i];

    fragment.appendChild(newElement);
  }
  similarListElement.appendChild(fragment);
}

function showBigPicture(picturesOption) {
  var pictures = createPicturesList(picturesOption);
  var bigPicture = document.querySelector('.big-picture');
  var commentsCount = pictures[0].comments.length.toString();

  bigPicture.querySelector('.big-picture__img > img').setAttribute('src', pictures[0].url);
  bigPicture.querySelector('.likes-count').textContent = pictures[0].likes;
  bigPicture.querySelector('.comments-count').textContent = commentsCount;
  bigPicture.querySelector('.social__caption').textContent = pictures[0].description;

  removeVanillaComments();
  getComments(commentsCount, pictures[0].comments);

  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.social__comment-loadmore').classList.add('hidden');
}

showPictures(Pictures);
showBigPicture(Pictures);


