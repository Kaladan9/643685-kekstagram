'use strict';

(function () {

  var imgUploadContainerElement = document.querySelector('.img-upload__overlay');
  var hashtagsInputElement = imgUploadContainerElement.querySelector('.text__hashtags');

  function isEmptyHashtag(hashtags) {
    return hashtags.length === 0;
  }

  function isHashtagInInput(hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag[0] === '#';
    });
  }

  function isHasOnlyHash(hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag[0] === '#' && hashtag.length <= 2;
    });
  }

  function isHastagsSeparating(hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag.indexOf('#') === hashtag.lastIndexOf('#');
    });
  }

  function isDublicatesHashtags(hashtags) {
    var hashtagsInfo = hashtags.reduce(function (result, hashtag) {
      result[hashtag] = !result.hasOwnProperty(hashtag);

      return result;
    }, {});

    for (var key in hashtagsInfo) {
      if (hashtagsInfo.hasOwnProperty(key)) {
        if (!hashtagsInfo[key]) {
          return false;
        }
      }
    }

    return true;
  }

  function isValidHashtagsCount(hashtags) {
    return (hashtags.length <= 5);
  }

  function isLongHashtags(hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag.length <= 20;
    });
  }

  function onInputChange() {
    var value = hashtagsInputElement.value.trim();
    var hashtags = value.split(' ').filter(function (hashtag) {
      return hashtag !== '';
    });

    if (isEmptyHashtag(hashtags)) {
      hashtagsInputElement.setCustomValidity('');
    } else if (isHasOnlyHash(hashtags)) {
      hashtagsInputElement.setCustomValidity('Хэш-тег не может состоять только из #');
    } else if (!isHastagsSeparating(hashtags)) {
      hashtagsInputElement.setCustomValidity('Разделите хэш-теги пробелами');
    } else if (!isDublicatesHashtags(hashtags)) {
      hashtagsInputElement.setCustomValidity('Не повторяйте хэш-теги');
    } else if (!isValidHashtagsCount(hashtags)) {
      hashtagsInputElement.setCustomValidity('Нельзя задать больше 5 хэш-тегов');
    } else if (!isLongHashtags(hashtags)) {
      hashtagsInputElement.setCustomValidity('Допустимая длина хэш-тега не более 20 символов');
    } else if (!isHashtagInInput(hashtags)) {
      hashtagsInputElement.setCustomValidity('Начинайте писать хэш-теги с #');
    } else {
      hashtagsInputElement.setCustomValidity('');
    }
  }

  hashtagsInputElement.addEventListener('change', onInputChange);

})();
