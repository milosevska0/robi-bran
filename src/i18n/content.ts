// Fixed interface texts (menu, buttons, form labels) in Macedonian (mk) and Albanian (sq).
// The owner's content (contact, products, gallery, page texts) is NOT here:
// it is edited in the admin panel (/uredi) and lives in src/data/*.json.

export type Lang = 'mk' | 'sq';

export const routes = {
  home: { mk: '/', sq: '/sq/' },
  about: { mk: '/za-nas/', sq: '/sq/rreth-nesh/' },
  products: { mk: '/proizvodi/', sq: '/sq/produkte/' },
  gallery: { mk: '/galerija/', sq: '/sq/galeria/' },
  contact: { mk: '/kontakt/', sq: '/sq/kontakt/' },
  blog: { mk: '/blog/', sq: '/sq/blog/' },
} as const;

export type PageKey = keyof typeof routes | 'product' | 'post';
export type Alt = { mk: string; sq: string };

// Location on the map (not editable in the admin panel)
export const business = {
  lat: 42.037271759,
  lng: 21.1309699589,
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=42.037271759,21.1309699589',
  mapsEmbed: 'https://maps.google.com/maps?q=42.037271759,21.1309699589&z=15&output=embed',
  founded: '2006',
};

export const t = {
  "mk": {
    "brand": "Пилана Роби Бран",
    "nav": {
      "home": "Почетна",
      "about": "За нас",
      "products": "Производи",
      "gallery": "Галерија",
      "contact": "Контакт"
    },
    "menuOpen": "Отвори мени",
    "menuClose": "Затвори мени",
    "mainMenu": "Главно мени",
    "footerMenu": "Мени во подножје",
    "langName": "Македонски",
    "call": "Јавете се",
    "callForPrice": "Јавете се за цена",
    "contactUs": "Контактирајте нѐ",
    "writeUs": "Пишете ни",
    "more": "Повеќе",
    "openMaps": "Отвори во Google Maps",
    "openMapsShort": "Отвори мапа",
    "followFb": "Следете нѐ на Facebook",
    "mapTitle": "Локација на Пилана Роби Бран на Google мапа",
    "rights": "Сите права задржани.",
    "latinLine": "Pilana Robi Bran – pilana vo Tetovo, s. Tudence",
    "blog": {"title": "Блог – Пилана Роби Бран, Тетово", "heading": "Блог", "description": "Совети и објаснувања за буковата граѓа и А1 пелетот од Пилана Роби Бран, Тетово.", "readMore": "Прочитајте", "back": "Сите написи", "empty": "Наскоро."},
    "home": {
      "seeProducts": "Погледнете ги производите",
      "readAbout": "Прочитајте повеќе за нас",
      "galleryAll": "Цела галерија"
    },
    "otherProducts": "Други производи",
    "galleryPage": {
      "filterLabel": "Филтер на фотографии",
      "filters": {
        "all": "Сите",
        "grada": "Граѓа",
        "pelet": "Пелет",
        "pilana": "Пилана"
      }
    },
    "contactPage": {
      "name": "Име и презиме",
      "reply": "Е-пошта или телефон",
      "message": "Порака",
      "messagePlaceholder": "На пр. ми требаат букови штици 3 m, 50 комади",
      "send": "Испрати порака",
      "sending": "Се испраќа…",
      "sent": "Пораката е испратена. Ќе ви одговориме наскоро.",
      "error": "Пораката не е испратена. Обидете се повторно или јавете се на {телефон}.",
      "subject": "Нова порака од pilanatetovo.mk"
    },
    "breadcrumbHome": "Почетна",
    "notice": "Известување"
  },
  "sq": {
    "brand": "Sharra Robi Bran",
    "nav": {
      "home": "Ballina",
      "about": "Rreth nesh",
      "products": "Produkte",
      "gallery": "Galeria",
      "contact": "Kontakt"
    },
    "menuOpen": "Hap menynë",
    "menuClose": "Mbyll menynë",
    "mainMenu": "Menyja kryesore",
    "footerMenu": "Menyja në fund",
    "langName": "Shqip",
    "call": "Na telefononi",
    "callForPrice": "Telefononi për çmim",
    "contactUs": "Na kontaktoni",
    "writeUs": "Na shkruani",
    "more": "Më shumë",
    "openMaps": "Hap në Google Maps",
    "openMapsShort": "Hap hartën",
    "followFb": "Na ndiqni në Facebook",
    "mapTitle": "Vendndodhja e Sharrës Robi Bran në Google Maps",
    "rights": "Të gjitha të drejtat e rezervuara.",
    "latinLine": "Sharra Robi Bran – sharrë në Tetovë, fsh. Tudencë",
    "blog": {"title": "Blog – Sharra Robi Bran, Tetovë", "heading": "Blog", "description": "Këshilla dhe shpjegime për lëndën e ahut dhe peletin A1 nga Sharra Robi Bran, Tetovë.", "readMore": "Lexoni", "back": "Të gjithë artikujt", "empty": "Së shpejti."},
    "home": {
      "seeProducts": "Shikoni produktet",
      "readAbout": "Lexoni më shumë për ne",
      "galleryAll": "E gjithë galeria"
    },
    "otherProducts": "Produkte të tjera",
    "galleryPage": {
      "filterLabel": "Filtri i fotografive",
      "filters": {
        "all": "Të gjitha",
        "grada": "Lëndë",
        "pelet": "Pelet",
        "pilana": "Sharra"
      }
    },
    "contactPage": {
      "name": "Emri dhe mbiemri",
      "reply": "E-mail ose telefon",
      "message": "Mesazhi",
      "messagePlaceholder": "P.sh. më duhen dërrasa ahu 3 m, 50 copë",
      "send": "Dërgo mesazhin",
      "sending": "Po dërgohet…",
      "sent": "Mesazhi u dërgua. Do t’ju përgjigjemi së shpejti.",
      "error": "Mesazhi nuk u dërgua. Provoni përsëri ose telefononi në {телефон}.",
      "subject": "Mesazh i ri nga pilanatetovo.mk"
    },
    "breadcrumbHome": "Ballina",
    "notice": "Njoftim"
  }
};

export type Dict = (typeof t)['mk'];
