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
        if (!times) {
            times = Infinity;
        }
        if (!frequency) {
            frequency = 1;
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
            // events[event] = events[event].filter(subscriber => subscriber.context !== context);

            Object.keys(events).filter(eventName => eventName === event ||
                eventName.startsWith(event + '.'))
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
                    if (subscriber.times && subscriber.count % subscriber.frequency === 0) {
                        subscriber.times--;
                        subscriber.handler.call(subscriber.context);
                        subscriber.count++;
                    } else {
                        subscriber.count++;
                    }
                });
            }
            if (event.includes('.')) {
                const index = event.lastIndexOf('.');
                event = event.substring(0, index);
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
