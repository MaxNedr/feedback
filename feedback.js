/*2. Создать модуль сбора отзывов:
    a) модуль может выводить отзывы (пока из json-заглушки);
b) модуль может добавлять отзывы;
c) модуль может одобрять отзывы;
d) модуль может удалять отзывы;*/
'use strict';

function buildFeedback() {
    $('#feedback').empty();
    // Отправляем запрос на получение списка товаров в корзине
    $.ajax({
        url: 'http://localhost:3000/feedback',
        dataType: 'json',
        success: function (feedback) {
            // Создаем ul - элемент
            var $ul = $('<ul />');


            feedback.forEach(function (comment) {
                var $approved = $('<button />').attr('class', 'approved_button');
                $approved.text('Approve');
                var $declined = $('<button />').attr('class', 'declined_button');
                $declined.text('Decline');
                var $li = $('<li />', {text: comment.text, id : comment.id});
                // Добавляем все в dom

                $ul.append($li);
                $li.append($approved);
                $li.append($declined);

            });
            // Добавляем все в dom
            $('#feedback').prepend($ul);

        }
    })
}

function buildTextButton() {
    $('#textButton').empty();
    var $text = $('<textarea />').attr({id: "text", class: "text"});
    var $send = $('<button />').attr({id: "send", class: "send"});
    $send.text('Send');
    $('#textButton').append($text);
    $('#textButton').append($send);
}

(function ($) {
    $(function () {
        buildFeedback();
        buildTextButton();


        $('#send').on('click', function () {
           var $textComment = $('#text').val();
            $.ajax({
                url: 'http://localhost:3000/feedback',
                type: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                data: JSON.stringify({
                   text: $textComment

                }),
                success: function () {
                    // Перерисовываем корзину
                    buildFeedback();
                }
            })

        });
        $('#feedback').on('click', '.approved_button', function (ev) {
            var $textComment = ev.target;
            var $textComm = $(ev.target).parent();

            console.log($textComm);
            $.ajax({
                url: 'http://localhost:3000/approved',
                type: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                data: JSON.stringify({
                    text: $textComm.text()

                }),
                success: function () {

                    $textComment.parentElement.className = "approved";
                }
            })
        });
        $('#feedback').on( 'click', '.declined_button', function (ev) {
            var $textComment = ev.target;
            var $textComm = $(ev.target).parent();

            console.log($textComm);
            $.ajax({
                url: 'http://localhost:3000/declined',
                type: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                data: JSON.stringify({
                    text: $textComm.text()

                }),
                success: function () {

                    $textComment.parentElement.className = "declined";
                }
            })
            })

    });
})(jQuery);