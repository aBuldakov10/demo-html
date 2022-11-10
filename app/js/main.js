document.addEventListener('DOMContentLoaded', () => {
  /*** Add file ***/
  const addFileBtn = document.querySelector('.js-form-file-btn');
  const addFileTxt = document.querySelector('.form-file__title');

  if (addFileBtn) {
    addFileBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const thisParent = this.closest('.form-file');
      const thisInputFileField = thisParent.querySelector('.form-file__input');

      thisInputFileField.click();

      thisInputFileField.addEventListener('change', () => {
        const countFiles = thisInputFileField.files.length;
        let addFileBtnString = '';

        if (countFiles >= 1) {
          addFileBtnString = `Добавлено ${countFiles} файла(ов)`;
        } else {
          addFileBtnString = 'добавить файл';
        }

        addFileTxt.innerHTML = addFileBtnString;
      });
    });
  }

  /*** Accordion ***/
  $('.js-switch').on('click', function () {
    $(this).next().slideToggle(200);
    $(this).toggleClass('active');
  });

  /*** Tabs ***/
  $('.js-tabs .tabs__navigation-link').on('click', function (e) {
    e.preventDefault();

    let thisAnchor = $(this).attr('href'),
      thisTarget = $(thisAnchor);

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('.tabs__content-item').hide();
    thisTarget.show();
  });
});
