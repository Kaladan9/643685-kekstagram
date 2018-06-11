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
  MAX_COMMENTS: 3,
  MIN_AVATAR_NUM: 1,
  MAX_AVATAR_NUM: 6
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
  var commentsCount = pictures.comments.length;
  var likesCount = pictures.likes;

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

function renderComments(count, comments, picturesOption) {
  var similarListElement = document.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var liElement = document.createElement('li');
    liElement.className = 'social__comment';

    var imgElement = document.createElement('img');
    imgElement.className = 'social__picture';
    imgElement.src = 'img/avatar-'
      + getRandomValue(picturesOption.MIN_AVATAR_NUM, picturesOption.MAX_AVATAR_NUM)
      + '.svg';
    imgElement.alt = 'Аватар комментатора фотографии';
    imgElement.width = '35';
    imgElement.height = '35';

    var pElement = document.createElement('p');
    pElement.className = 'social__text';
    pElement.textContent = comments[i];

    liElement.appendChild(imgElement);
    liElement.appendChild(pElement);
    fragment.appendChild(liElement);
  }
  similarListElement.appendChild(fragment);
}

function showPictures(pictures, picturesOption) {
  var pictureContainer = document.querySelector('.pictures');

  renderPictures(pictures, picturesOption.COUNT);
  pictureContainer.classList.remove('hidden');
}

function showPopup(pictures, picturesOption) {
  var bigPictureElement = document.querySelector('.big-picture');
  var commentsCount = pictures[0].comments.length;
  var commentsElement = document.querySelector('.social__comments');

  bigPictureElement.querySelector('.big-picture__img > img').src = pictures[0].url;
  bigPictureElement.querySelector('.likes-count').textContent = pictures[0].likes;
  bigPictureElement.querySelector('.comments-count').textContent = commentsCount;
  bigPictureElement.querySelector('.social__caption').textContent = pictures[0].description;

  commentsElement.innerHTML = '';
  renderComments(commentsCount, pictures[0].comments, picturesOption);

  bigPictureElement.classList.remove('hidden');
  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.social__loadmore').classList.add('visually-hidden');
}

function showMainPage(picturesOption) {
  var pictures = createPicturesList(picturesOption);

  showPictures(pictures, picturesOption);
  showPopup(pictures, picturesOption);
}

showMainPage(Pictures);


