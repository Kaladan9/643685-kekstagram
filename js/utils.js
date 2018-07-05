'use strict';

(function () {

  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function showSendError() {
    var messageErrorElement = document.querySelector('.img-upload__message--error');
    messageErrorElement.classList.remove('hidden');
    messageErrorElement.style.zIndex = '200';
  }

  function showLoadError() {
    document.querySelector('.pictures__upload--error').classList.remove('hidden');
  }

  window.utils = {
    Pictures: {
      MIN_AVATAR_NUM: 1,
      MAX_AVATAR_NUM: 6
    },

    KeyCodes: {
      ESC: 27,
      ENTER: 13
    },

    getRandomValue: getRandomValue,
    showSendError: showSendError,
    showLoadError: showLoadError
  };

})();
