/* eslint-disable no-irregular-whitespace, max-len */

const phd = ' кандидат филологических наук',
      drhabil = ' доктор филологических наук',
      rfellow = ' научный сотрудник',
      ruslang = ' Института русского языка им. В. В. Виноградова РАН',
      inslav = ' Института славяноведения РАН';

const afanasieva = `Татьяна Афанасьева,${ drhabil }, профессор кафедры` +
        ' русского языка Санкт-Петербургского государственного университета',
      davydenkova = 'Мария Давыденкова, член рабочей группы по подготовке' +
        ' «Большого словаря церковнославянского языка Нового времени»',
      dobrovolskij = 'Иван Добровольский,' + rfellow + ruslang,
      gippius = 'Алексей Гиппиус, член-корреспондент РАН,' +
        ' главный' + rfellow + inslav,
      grishchenko = 'Александр Грищенко,' + phd + ',' +
        ' доцент кафедры русского языка Московского педагогического' +
        ' государственного университета, профессор кафедры общего языкознания' +
        ' и славистики Православного Свято-Тихоновского гуманитарного' +
        ' университета, старший' + rfellow + ' отдела славянского языкознания' +
        inslav + ', ведущий' + rfellow +
        ' Российской государственной библиотеки' +
        ' (сектор изучения особо ценных фондов ЦИПР)',
      jurjeva = 'Ирина Юрьева,' + phd + ', старший' + rfellow + ruslang,
      kagarlickij = 'Юрий Кагарлицкий,' + phd + ', старший' + rfellow + ruslang,
      kravetsky = 'Александр Кравецкий,' + phd + ', ведущий' + rfellow + ruslang,
      meerson = 'Ольга Меерсон, профессор Джорджтаунского университета',
      pentk = 'Татьяна Пентковская,' + drhabil + ', профессор кафедры' +
        ' русского языка филологического факультета МГУ им. М. В. Ломоносова',
      pletneva = 'Александра Плетнева,' + phd + ', старший' + rfellow + ruslang,
      plyakin = 'Максим Плякин, священник, клирик Саратовской епархии',
      pichxadze = 'Анна Пичхадзе,' + drhabil + ', главный' + rfellow + ruslang,
      ramazanova = 'Джамиля Рамазанова, кандидат исторических наук,' +
        ' заведующая научно-исследовательским отделом редких книг' +
        ' (Музеем книги) Российской государственной библиотеки',
      rozhdestvenskaya = 'Татьяна Рождественская,' + drhabil +
        ', профессор кафедры русского языка' +
        ' Санкт-Петербургского госудраственного университета',
      sedakova = 'Ольга Седакова,' + phd + ', старший' + rfellow +
        ' Института истории мировой культуры МГУ',
      shmelev = 'Алексей Шмелёв,' + drhabil + ', главный' + rfellow + ruslang,
      sichinava = 'Дмитрий Сичинава,' + phd + ', старший' + rfellow + ruslang,
      temchin = 'Сергей Темчин, хабилитированный доктор гуманитарных наук,' +
        ' главный' + rfellow + ' и руководитель Центра изучения письменного' +
        ' наследия Института литовского языка, профессор',
      uspenskij = 'Фёдор Успенский,' + drhabil + ', член-корреспондент РАН,' +
        ' и. о. директора' + ruslang,
      verner = 'Инна Вернер,' + phd + ', старший' + rfellow + inslav;

export const videos = [

  { id: 'IIhvlp37o4g',
    title: 'Следы русского языка в церковнославянском',
    speaker: dobrovolskij, legend: '' },

  { id: 'axxGvaQPokI',
    title: 'Имянаречение в допетровской Руси',
    speaker: uspenskij, legend: '' },

  { id: '3IxiCqD9f6E',
    title: 'Передача церковнославянского текста средствами гражданской графики',
    speaker: shmelev, legend: '' },

  { id: 'Pnk9rxLorks',
    title: 'Сдвиги в использовании церковнославянских элементов в русской речи: проблемы нормы',
    speaker: shmelev, legend: '' },

  { id: 'OzVFT03Yto0',
    title: 'Судьба слов «мир» и «смирение»: роль церковнославянского переводчика',
    speaker: shmelev, legend: '' },

  { id: '0Y1OrlrYtNI',
    title: 'Старославянский язык и письменность',
    speaker: temchin, legend: '' },

  { id: 'TOSWJanpomo',
    title: 'Происхождение глаголицы',
    speaker: temchin, legend: '' },

  { id: 'Zv1AFOmD-to',
    title: 'Происхождение названия «глаголица»',
    speaker: temchin, legend: '' },

  { id: 'PDYahA9eSxk',
    title: 'Кирилло-Мефодиевское богослужение',
    speaker: temchin, legend: '' },

  { id: 'WN6ZgruS5Qc',
    title: 'Древнейшие переводы с греческого языка на церковнославянский',
    speaker: pichxadze, legend: '' },

  { id: 'O2p43uisEaM', title: 'Древнерусские летописи',
    speaker: jurjeva, legend: '' },

  { id: '0HucodtzjlE',
    title: 'Как читать летописные тексты',
    speaker: jurjeva, legend: '' },

  { id: '2QCEzrR0znI',
    title: 'Лексика древнерусской разновидности церковнославянского языка',
    speaker: pichxadze, legend: '' },

  { id: 'uPD7YlzTrKo',
    title: 'Что такое древнерусский язык',
    speaker: rozhdestvenskaya, legend: '' },

  { id: 'acFV5IrZ09s',
    title: 'Берестяные грамоты и языковая ситуация Древнего Новгорода',
    speaker: gippius, legend: '' },

  { id: 'Z5fZ50Gz77w',
    title: 'Литургические тексты в берестяных грамотах',
    speaker: gippius, legend: '' },

  { id: 'Siwt_yJ56RA',
    title: 'Церковнославянский язык на Руси в конце XIV века',
    speaker: afanasieva, legend: '' },

  { id: 'j8XftR_mYR8',
    title: 'Славяно-еврейские контакты и переводы средневековой Руси',
    speaker: grishchenko, legend: '' },

  { id: '4Kj9sAaR2uw',
    title: 'Какие стурлаби украла Рахиль у Лавана?',
    speaker: grishchenko, legend: '' },

  { id: 'HMEYoq7iJcQ',
    title: 'Восточнославянская письменность Великого княжества Литовского',
    speaker: temchin, legend: '' },

  { id: 'VOXta0aqEP8',
    title: 'Церковнославянский язык в Речи Посполитой',
    speaker: temchin, legend: '' },

  { id: 'R-OdPYwh3Ww',
    title: 'Библейские переводы Максима Грека',
    speaker: verner, legend: '' },

  { id: 'am-YJUp7RsU',
    title: 'Церковнославянский язык ученой элиты: переводы книжного круга Чудова монастыря',
    speaker: pentk, legend: '' },

  { id: 'F5xCf7zbo58',
    title: 'Церковнославянское книгопечатание',
    speaker: ramazanova, legend: '' },

  { id: '39pJIrn9-q8',
    title: 'Учебная литература на церковнославянском языке',
    speaker: ramazanova, legend: '' },

  { id: 'W3-hs6062WI', title: 'Азбучная реформа Петра I', speaker: kagarlickij,
    legend: '' },

  { id: 'HFW-qowkNtY', title: 'Простой русский или книжный славянский?',
    speaker: kagarlickij, legend: '' },

  { id: 'ZTHAepS2EcQ', title: 'Кто прав: Н.М.Карамзин или А.С.Шишков?',
    speaker: kagarlickij, legend: '' },

  { id: '1xAHu2Bo5_M', title: 'Церковнославянская грамотность XVIII–XIX веков',
    speaker: pletneva, legend: '' },

  { id: 'Ta5MproN5qo',
    title: 'История славянской Библии на Руси',
    speaker: pichxadze, legend: '' },

  { id: 'V9eng-FHatM',
    title: 'Геннадиевская Библия',
    speaker: verner, legend: '' },

  { id: 'kFLMEqnIxlc',
    title: 'Церковнославянская Библия в XIX–XXI веке',
    speaker: kravetsky, legend: '' },

  { id: '33fLDQMBHzo', title: 'Лубочная письменность и церковнославянский язык',
    speaker: pletneva, legend: '' },

  { id: 'URJTs_a1YHs',
    title: 'Редактирование богослужебных книг в XX веке',
    speaker: kravetsky, legend: '' },

  { id: '2i4nee62Vx4', title: 'Церковные службы, написанные в новейшее время',
    speaker: plyakin, legend: '' },

  { id: 'h11RhKwWLQk',
    title: 'Гимнографическое творчество в СССР, Зарубежье и постсоветской России',
    speaker: plyakin, legend: '' },

  { id: 'TPs3NSVdsD8', title: 'Службы неканонизированным историческим личностям',
    speaker: plyakin, legend: '' },

  { id: 'zDRRSVplgXM',
    title: 'Споры о богослужебном языке',
    speaker: kravetsky, legend: '' },

  { id: '15iD7I5GdsE',
    title: 'Перевод с церковнославянского: стилистические трудности',
    speaker: davydenkova, legend: '' },

  { id: '70cebbmBcIY',
    title: 'Перевод с церковнославянского: порядок слов',
    speaker: davydenkova, legend: '' },

  { id: 'WEawhCf-9VA', title: 'Поэтика богослужебных песнопений',
    speaker: sedakova, legend: '' },

  { id: 'BZn5wLp_BsI', title: 'Церковнославянская лексика: ошибки понимания',
    speaker: sedakova, legend: '' },

  { id: 'p89yVMIYX4Y',
    title: 'Церковнославянский текст в восприятии человека Нового времени',
    speaker: meerson, legend: '' },

  { id: 'G3P2iKGRypU',
    title: 'Разработка исторических и церковнославянских корпусов: трудности и решения',
    speaker: sichinava, legend: '' },

  { id: '-TIm45mVN2Y',
    title: 'Лингвистический корпус и исследование церковнославянской книжности',
    speaker: sichinava, legend: '' },
];
