'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = {};

    function subscribe({ event, context, handler, times, frequency }) {
        if (!events[event]) {
            events[event] = [];
        }

        events[event].push({ context, handler, times, frequency, count: 0 });
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {any}
         */
        on: function (event, context, handler) {
            subscribe({ event, context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {any}
         */
        off: function (event, context) {
            console.info(event, context);
            events[event] = events[event].filter(subscriber => subscriber.context !== context);

            // events[event].forEach(eventName => {
            //     if (eventName === event || eventName.startsWith(event + '.')) {
            //         events[event] = events[event].filter(subscriber =>
            //             subscriber.context !== context);
            //     }
            // });
            Object.keys(events).filter(eventName => eventName.startsWith(event + '.'))
                .forEach(e => {
                    events[e] = events[e]
                        .filter(subscriber => subscriber.context !== context);
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {any}
         */
        emit: function emit(event) {
            console.info(event);
            if (events[event]) {
                events[event].forEach(subscriber => {
                    if (subscriber.times === undefined && subscriber.frequency === undefined) {
                        subscriber.handler.call(subscriber.context);
                        subscriber.count++;
                    }
                    if (subscriber.times) {
                        subscriber.times--;
                        subscriber.handler.call(subscriber.context);
                        subscriber.count++;
                    }
                    if (subscriber.frequency && subscriber.count % subscriber.frequency === 0) {
                        subscriber.handler.call(subscriber.context);
                    }
                    if (subscriber.frequency) {
                        subscriber.count++;
                    }
                });
            }
            if (event.includes('.')) {
                event = event.split('.')[0];
                emit(event);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {any}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            subscribe({ event, context, handler, times });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {any}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            subscribe({ event, context, handler, undefined, frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
