'use strict';

(function () {

  function showError() {
    document.querySelector('.img-upload__message--error').classList.remove('hidden');
  }

  window.utils = {
    Pictures: {
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
    },

    KeyCodes: {
      ESC: 27,
      ENTER: 13
    },

    Effects: {
      NONE: 'none',
      CHROME: 'chrome',
      SEPIA: 'sepia',
      MARVIN: 'marvin',
      PHOBOS: 'phobos',
      HEAT: 'heat'
    },

    getRandomValue: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    showError: showError
  };

})();
