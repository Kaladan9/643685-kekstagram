'use strict';

(function () {

  var URL_SAVE = 'https://js.dump.academy/kekstagram';
  var URL_LOAD = URL_SAVE + '/data';

  function addXHR(timeout, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = timeout;
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Неверный запрос');
          break;
        case 404:
          onError('Ничего не найдено');
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Подключение не выполнилось за ' + xhr.timeout + 'мс');
    });

    return xhr;
  }

  function load(onLoad, onError) {
    var xhr = addXHR(10000, onLoad, onError);

    xhr.open('GET', URL_LOAD);
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = addXHR(10000, onLoad, onError);

    xhr.open('POST', URL_SAVE);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };

})();
