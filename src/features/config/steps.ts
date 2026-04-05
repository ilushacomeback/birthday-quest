import type { QuestStep, QuestStepId } from './types';
import bear from '../../assets/images/bear.jpg';
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
    nextStepId: 'beer-question',
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
        label: 'Нет',
        nextStepId: 'joke',
        sound: 'error',
        variant: 'error',
      },
      {
        label: 'Да',
        nextStepId: 'beer-question',
        sound: 'click',
        variant: 'default',
      },
    ],
  },

  joke: {
    id: 'joke',
    type: 'default',
    noBackBtn: true,
    lines: ['Хм, не ожидал от тебя такого.', 'Теперь у тебя не будет выбора.'],
    nextStepId: 'beer-question',
    buttons: [
      {
        label: 'Начать путешествие',
        nextStepId: 'beer-question',
        sound: 'click',
        variant: 'default',
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
    acceptedAnswers: [
      'пиво',
      'без пива',
      'пивасик',
      'без пивасика',
      'белый медведь',
      'без белого медведя',
    ],
    submitLabel: 'Ответить',
    nextStepId: 'beer-found',
    prevStepId: INITIAL_STEP_ID,
    successSound: 'success',
    errorSound: 'error',
  },

  'beer-found': {
    id: 'beer-found',
    type: 'default',
    prevStepId: 'beer-question',
    nextStepId: 'car-question',
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
        variant: 'default',
      },
    ],
  },

  'car-question': {
    id: 'car-question',
    type: 'answer',
    prevStepId: 'beer-found',
    nextStepId: 'car-found',
    lines: [
      'Не торопись, мой дорогой друг.',
      'Некоторые остаются в прошлом слишком надолго, а у нас с тобой ещё есть куда ехать.',
      'Смотрю после одной бутылки ты всё ещё держишься, но куда бы ты точно не сел в таком состоянии?',
    ],
    hint: 'Куда нельзя садиться в пьяном состоянии?',
    acceptedAnswers: [
      'машина',
      'в машину',
      'автомобиль',
      'в автомобиль',
      'авто',
      'в авто',
      'четырка',
      'в четырку',
      'чепырка',
      'в чепырку',
    ],
    submitLabel: 'Ответить',
    successSound: 'success',
    errorSound: 'error',
  },

  'car-found': {
    id: 'car-found',
    type: 'default',
    prevStepId: 'car-question',
    nextStepId: 'debt-question',
    lines: [
      'Молодец! Но в нашем путешествии можно всё, так что иди в гараж (шкаф, верхняя полка) и заводи малышку.',
    ],
    buttons: [
      {
        label: 'Завести',
        nextStepId: 'debt-question',
        sound: 'failedEngine',
        variant: 'default',
      },
    ],
  },

  'debt-question': {
    id: 'debt-question',
    type: 'answer',
    prevStepId: 'car-found',
    lines: [
      'Ох, что-то не заводится... Наверное бензина нет.',
      'Надо заправиться, но где же взять деньги?',
      'Точно, а помнишь одного друга, который несколько лет не мог вернуть небольшой долг?',
      'Напомни-ка, сколько рублей он был тебе должен?',
    ],
    acceptedAnswers: [
      '200',
      '200р',
      '200 р',
      '200 руб',
      '200 рублей',
      'двести',
      'двести рублей',
    ],
    submitLabel: 'Ответить',
    hint: 'Неужели забыл?... Начинается с 2..',
    nextStepId: 'debt-found',
    successSound: 'success',
    errorSound: 'error',
  },

  'debt-found': {
    id: 'debt-found',
    type: 'default',
    prevStepId: 'debt-question',
    nextStepId: 'engine-start',
    lines: [
      'Отлично, нам как раз хватит чутка подзаправиться!',
      'Да-да, он же тебе вернул их..., но ничего страшного, подойди к нему и скажи, что накапали проценты.',
    ],
    buttons: [
      {
        label: 'Заправиться',
        nextStepId: 'engine-start',
        sound: 'engine',
        variant: 'default',
      },
    ],
  },

  'engine-start': {
    id: 'engine-start',
    type: 'default',
    prevStepId: 'debt-found',
    nextStepId: 'memories',
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
        variant: 'default',
      },
    ],
  },

  memories: {
    id: 'memories',
    type: 'carousel',
    prevStepId: 'engine-start',
    nextStepId: 'carpet-question',
    images: [
      {
        src: see,
        description: 'Указывает путь к "светлому прошлому"',
      },
      {
        src: bear,
        description: 'Вот и то самое "светлое прошлое"',
      },
      {
        src: call,
        description: 'Не геи *Алина прости что ты обрезалась :(',
      },
      {
        src: fuck,
        description: 'По приколу вставил',
      },
      {
        src: legenda,
        description: 'Тут Дима голый кст',
      },
      {
        src: pasha,
        description: 'По девочкам ходили наверное',
      },
      {
        src: sextop,
        description: 'Илья попал в эскорт к Диме',
      },
      {
        src: sexy,
        description: 'Красуемся',
      },
      {
        src: sexy2,
        description: 'Дима заигрывает',
      },
      {
        src: sexy3,
        description: 'Стоим на панели у трёхи',
      },
      {
        src: sleep1,
        description: 'Спим у Ильи',
      },
      {
        src: sleep2,
        description: 'Дима в опасности',
      },
      {
        src: sleep3,
        description: 'Любим поспать',
      },
      {
        src: tg,
        description: 'Всем сердечко',
      },
      {
        src: together,
        description: 'Их было четверо, четыре пацана',
      },
      {
        src: toilet,
        description: 'Покакали',
      },
      {
        src: train,
        description: 'Дима спиздил Илью в Курск',
      },
      {
        src: zoya,
        description: 'Стоим с Зойкой',
      },
    ],
    buttons: [
      {
        label: 'Дальше',
        nextStepId: 'carpet-question',
        sound: 'click',
        variant: 'default',
      },
    ],
  },

  'carpet-question': {
    id: 'carpet-question',
    prevStepId: 'memories',
    type: 'answer',
    lines: [
      'Ну что, вот мы и чутка окунулись в светлое прошлое.',
      'Было много всего и это было охрененно.',
      'Но самое крутое — что это только начало.',
      'Ах, чуть не забыл, помнишь ту ситуацию с кальяном?',
      'Кажется тебе что-то прожгли, напомнишь?',
    ],
    hint: 'Что-то длинное, на полу лежит обычно, раньше еще на стены вешали',
    acceptedAnswers: ['ковер', 'кавер', 'ковёр', 'коврик', 'палас'],
    submitLabel: 'Ответить',
    nextStepId: 'final',
    successSound: 'success',
    errorSound: 'error',
  },

  final: {
    id: 'final',
    type: 'default',
    prevStepId: 'carpet-question',
    nextStepId: 'completed',
    lines: [
      'Точно, супер! Загляни-ка в стиральную машинку, там тебя ждёт новенький ковёр.',
      'Не совсем тот, который был, но и этот вроде неплох.',
      'А мне уже пора, дорогой друг.',
      'Удачи тебе во всём и чтобы перед тобой все двери были открыты, а ноги раздвинуты!',
    ],
    buttons: [
      {
        label: 'Завершить сканирование',
        sound: 'click',
        nextStepId: 'completed',
        variant: 'default',
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
