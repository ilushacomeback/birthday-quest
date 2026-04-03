import type { QuestStep, QuestStepId } from './types';
import bear from '../../assets/images/bear.jpg'
import call from '../../assets/images/call.jpg';
import fuck from '../../assets/images/fuck.jpg';
import legenda from '../../assets/images/legenda.jpg';
import pasha from '../../assets/images/pasha.jpg';
import see from '../../assets/images/see.jpg';
import sextop from '../../assets/images/sextop.jpg';
import sexy from '../../assets/images/sexy.jpg';
import sexy2 from '../../assets/images/sexy2.jpg';
import sexy3 from '../../assets/images/sexy3.jpg';
import sleep1 from '../../assets/images/sleep1.jpg';
import sleep2 from '../../assets/images/sleep2.jpg';
import sleep3 from '../../assets/images/sleep3.jpg';
import tg from '../../assets/images/tg.jpg';
import together from '../../assets/images/together.jpg';
import toilet from '../../assets/images/toilet.jpg';
import train from '../../assets/images/train.jpg';
import zoya from '../../assets/images/zoya.jpg';
import { INITIAL_STEP_ID } from './constants';

export const questStepsMap: Record<QuestStepId, QuestStep> = {
  [INITIAL_STEP_ID]: {
    id: INITIAL_STEP_ID,
    type: 'default',
    loadingLines: [
      'Инициализация системы...',
      'Сканирование...',
      'Пользователь найден',
      '',
      'Пользователь: Дима',
      'Возраст: 25 лет',
      'Статус: Легенда',
      '',
      'Загрузка воспоминаний...',
    ],
    lines: [
      'Привет, Дима.',
      'Сейчас тебя ждёт маленькое путешествие в светлое прошлое. Погнали?',
    ],
    buttons: [
      {
        label: 'Да',
        nextStepId: 'beer-question',
        sound: 'click',
      },
    ],
  },

  'beer-question': {
    id: 'beer-question',
    type: 'answer',
    lines: [
      'Рад, что ты согласился. У меня есть к тебе вопрос:',
      'Без чего не обходится ни одно путешествие?',
    ],
    hint: 'Это путешествие в светлое прошлое, а что ещё бывает светлым?',
    acceptedAnswers: ['пиво'],
    submitLabel: 'Ответить',
    nextStepId: 'beer-found',
    successSound: 'success',
    errorSound: 'error',
  },

  'beer-found': {
    id: 'beer-found',
    type: 'default',
    lines: [
      'Вот он, настоящий мужчина.',
      'Диагностика показала: 100% свой человек.',
      'Первая точка — холодильник.',
      'Там тебя ждёт то самое “светлое прошлое”.',
    ],
    buttons: [
      {
        label: 'А может ещё по одной?',
        nextStepId: 'car-question',
        sound: 'click',
      },
    ],
  },

  'car-question': {
    id: 'car-question',
    type: 'answer',
    nextStepId: 'car-found',
    lines: [
      'Не торопись, мой дорогой друг.',
      'Некоторые остаются в прошлом слишком надолго, а у нас с тобой ещё есть куда ехать.',
      'Смотрю после одной бутылки ты всё ещё держишься, но куда бы ты точно не сел в таком состоянии?',
      '(Как законопослушный гражданин)',
    ],
    acceptedAnswers: ['машина', 'автомобиль', 'авто'],
    submitLabel: 'Ответить',
    successSound: 'success',
    errorSound: 'error',
  },

  'car-found': {
    id: 'car-found',
    type: 'default',
    lines: [
      'Молодец! Но в нашем путешествии можно всё, так что иди к __LOCATION_CAR__ и заводи малышку.',
    ],
    buttons: [
      {
        label: 'Что-то не заводится',
        nextStepId: 'debt-question',
        sound: 'engine',
      },
    ],
  },

  'debt-question': {
    id: 'debt-question',
    type: 'answer',
    lines: [
      'Ох, и вправду... Наверное бензина нет.',
      'Надо заправиться, но где же взять деньги?',
      'Точно, а помнишь одного друга, который несколько лет не мог вернуть небольшой долг?',
      'Напомни-ка, сколько рублей он был тебе должен?',
    ],
    acceptedAnswers: ['200', '200р', '200 руб', '200 рублей'],
    submitLabel: 'Ответить',
    nextStepId: 'debt-found',
    successSound: 'success',
    errorSound: 'error',
  },

  'debt-found': {
    id: 'debt-found',
    type: 'default',
    lines: [
      'Отлично, нам как раз хватит чутка подзаправиться!',
      'Да-да, он же тебе вернул их..., но ничего страшного, подойди к нему и скажи, что накапали проценты.',
    ],
    buttons: [
      {
        label: 'Заправиться',
        nextStepId: 'engine-start',
        sound: 'engine',
      },
    ],
  },

  'engine-start': {
    id: 'engine-start',
    type: 'default',
    lines: [
      'Уух, с пол тычка заревела.',
      'К Кулибину бы на покраску её и вообще шикардосик был бы.',
      'Ну всё, пора отправляться в путешествие.',
    ],
    buttons: [
      {
        label: 'Газ',
        sound: 'click',
        nextStepId: 'memories',
      },
    ],
  },

  memories: {
    id: 'memories',
    type: 'carousel',
    images: [
      bear,
      call,
      fuck,
      legenda,
      pasha,
      see,
      sextop,
      sexy,
      sexy2,
      sexy3,
      sleep1,
      sleep2,
      sleep3,
      tg,
      together,
      toilet,
      train,
      zoya,
    ],
    captions: [
      'Вот он, ключ к "светлому прошлому"',
      'На созвоне',
      'Светлое прошлое во всей красе',
    ],
    buttons: [
      {
        label: 'Дальше',
        nextStepId: 'carpet-question',
        sound: 'click',
      },
    ],
  },

  'carpet-question': {
    id: 'carpet-question',
    type: 'answer',
    lines: [
      'Ну что, вот мы и чутка окунулись в светлое прошлое.',
      'Было много всего и это было охрененно.',
      'Но самое крутое — что это только начало.',
      'Ах, чуть не забыл, помнишь ту ситуацию с кальяном?',
      'Кажется тебе что-то прожгли, напомнишь?',
    ],
    acceptedAnswers: ['ковер', 'ковёр'],
    submitLabel: 'Ответить',
    nextStepId: 'final',
    successSound: 'success',
    errorSound: 'error',
  },

  final: {
    id: 'final',
    type: 'default',
    lines: [
      'Точно, супер! Загляни-ка в __LOCATION_CARPET__, там тебя ждёт новенький ковёр.',
      'Не совсем тот, который был, но и этот вроде неплох.',
      'А мне уже пора, дорогой друг.',
      'Удачи тебе во всём и чтобы перед тобой все двери были открыты, а ноги раздвинуты!',
    ],
    buttons: [
      {
        label: 'Завершить сканирование',
        sound: 'click',
        nextStepId: 'completed',
      },
    ],
  },
  secret: {
    id: 'secret',
    type: 'secret',
    lines: [
      'Секретный раздел открыт.',
      'Если ты это читаешь — значит дошёл куда надо.',
      'Тут может быть ваша внутренняя шутка, скрытое фото, видео или особое сообщение.',
    ],
  },

  completed: {
    id: 'completed',
    type: 'completed',
  },
};
