/*2. Создать модуль сбора отзывов:
    a) модуль может выводить отзывы (пока из json-заглушки);
b) модуль может добавлять отзывы;
c) модуль может одобрять отзывы;
d) модуль может удалять отзывы;*/
'use strict';

function buildFeedback() {
    $('#feedback').empty();
    // Отправляем запрос на получение списка
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
                var $delete = $('<button />').attr('class', 'delete_button');
                $delete.text('Delete');
                var $li = $('<li />', {text: comment.text, id: comment.id});
                // Добавляем все в dom
                $ul.append($li);
                $li.append($approved);
                $li.append($declined);
                if (comment.status == "approve") {
                    $li.addClass("approved")
                } else if (comment.status == "decline") {
                    $li.addClass("declined");
                    $li.append($delete)
                }
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
                    $('#text').val("");
                    // Перерисовываем
                    buildFeedback();
                }
            })

        });
        $('#feedback').on('click', '.approved_button', function (ev) {

            var id = $(ev.target).parent().attr('id');
            $.ajax({
                url: 'http://localhost:3000/feedback/' + id,
                type: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                data: JSON.stringify({
                    status: "approve"

                }),
                success: function () {

                    buildFeedback();
                }
            })
        });
        $('#feedback').on('click', '.declined_button', function (ev) {

            var id = $(ev.target).parent().attr('id');
            $.ajax({
                url: 'http://localhost:3000/feedback/' + id,
                type: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                data: JSON.stringify({
                    status: "decline"

                }),
                success: function () {

                    buildFeedback();

                }
            })
        });
        $('#feedback').on('click', '.delete_button', function (ev) {
            var id = $(ev.target).parent().attr('id');
            $.ajax({
                url: 'http://localhost:3000/feedback/' + id,
                type: 'DELETE',
                success: function () {
                    // Перерисовываем корзины
                    buildFeedback();
                }
            })
        })
    });
})(jQuery);