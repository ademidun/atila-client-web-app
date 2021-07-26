// If you make any changes here, notify in the Github repo and update backend as well
import { CONTACT_TAGS } from './Contact';
import { INDUSTRIES } from './Industries';
import { OCCUPATIONS } from './Occupations';
import { CONTACT_TYPES } from './Contact';
// https://github.com/ademidun/atila-django/blob/master/helpers/constants.py
export const AUTOCOMPLETE_KEY_LIST = [
    'eligible_schools',
    'eligible_programs',
    'ethnicity',
    'heritage',
    'religion',
    'citizenship',
    'language',
    'activities',
    'sports',
    'disability',
];
export const FILTER_TYPES = [
    'major',
    'post_secondary_school',
    'ethnicity',
    'city',
    'province',
    'country',
    'heritage',
    'religion',
    'eligible_schools',
    'eligible_programs',
    'citizenship',
    'activities',
    'sports',
    'disability',
    'language',
];
export const SORT_TYPES = [
    'relevance_new',
    // 'relevance',
    'deadline',
    'surprise_me',
    // 'only_automated',
    // 'currently_open'
];

export const MAJORS_LIST = [
    'Accounting',
    'African Studies',
    'Agriculture',
    'Agro-Environmental Sciences',
    'Anatomy',
    'Animal Biology',
    'Animal Health',
    'Animal Production',
    'Anthropology',
    'Applied Ecology',
    'Applied Mathematics',
    'Arabic Language',
    'Architecture',
    'Art History',
    'Behavioural Science',
    'Biochemistry',
    'Biodiversity',
    'Bioengineering',
    'Biology',
    'Biomedical Engineering',
    'Bioresource Engineering',
    'Biotechnology',
    'Business',
    'Canadian Ethnic',
    'Canadian Studies',
    'Catholic Studies',
    'Chemical Engineering',
    'Chemistry',
    'Civil Engineering',
    'Classics',
    'Cognitive Science',
    'Communication Studies',
    'Composition',
    'Computer Engineering',
    'Computer Science',
    'Construction Engineering',
    'Criminology',
    'Dentistry',
    'Dietetics',
    'Earth',
    'Earth Sciences',
    'Earth System Science',
    'East Asian Cultural Studies',
    'East Asian Language',
    'East Asian Studies',
    'Ecology',
    'Economics',
    'Education',
    'Educational Psychology',
    'Electrical Engineering',
    'Engineering',
    'English',
    'Entrepreneurship',
    'Environment',
    'European Literature',
    'Farm Management',
    'Field Studies',
    'Film',
    'Finance',
    'Food Production',
    'Food Science',
    'Food Science & Nutritional Science',
    'Gender, Sexuality, Feminist, and Social Justice Studies',
    'General Science',
    'Geochemistry',
    'Geographic Information Systems',
    'Geography',
    'Geography: Urban Systems',
    'Geology',
    'German Language',
    'German Studies',
    'German Studies: Literature',
    'Global Food Security',
    'Health Geography',
    'Health Sciences',
    'Hispanic Studies',
    'History',
    'History and Philosophy of Science',
    'Human Nutrition',
    'Immunology',
    'Indigenous Studies',
    'Industrial Relations',
    'Information Systems',
    'International Development Studies',
    'International Management',
    'Investment Management',
    'Italian Studies',
    'Jewish Studies',
    'Kinesiology',
    'Labour-Management Relations and Human Resources',
    'Law',
    'Liberal Arts',
    'Life Sciences',
    'Linguistics',
    'MBA',
    'Management',
    'Managing for Sustainability',
    'Marketing',
    'Materials Engineering',
    'Mathematics',
    'Mechanical Engineering',
    'Mechatronics Engineering',
    'Medical Sciences',
    'Medicine',
    'Medieval Studies',
    'Meteorology',
    'Microbiology',
    'Mining Engineering',
    'Music',
    'Nanotechnology',
    'Natural History',
    'Neuroscience',
    'North American Studies',
    'Nursing',
    'Nutrition',
    'Occupational Therapy',
    'Operations Management',
    'Organizational Behaviour',
    'Persian Language',
    'Pharmacology',
    'Philosophy',
    'Physical Therapy',
    'Physics',
    'Physiology',
    'Planetary Sciences',
    'Plant Biology',
    'Plant Production',
    'Political Science',
    'Professional Agrology',
    'Psychology',
    'Quebec Studies',
    'Religion',
    'Religious Studies',
    'Russian',
    'Social Science',
    'Social Studies of Medicine',
    'Social Work',
    'Sociology',
    'Software Engineering',
    'Statistics',
    'Teacher\'s College',
    'Teaching English as a Second Language',
    'Technological Entrepreneurship',
    'Turkish Language',
    'Urdu Language',
    'Veterinary Studies',
    'Veterinary Studies',
    'Visual Arts',
    'Wildlife Biology',
    'World Islamic & Middle East Studies',
    'World Religions'
];

export const SCHOOLS_LIST = [
    'Acadia University',
    'Algoma University',
    'Algonquin College',
    'Ashton College',
    'Assumption University',
    'Athabasca University',
    'Augustana University College',
    'Bishop\'s University',
    'Bow Valley College',
    'Brandon University',
    'Brescia College',
    'British Columbia Institute of Technology',
    'British Columbia Open University',
    'Brock University',
    'Camosun College',
    'Campion College',
    'Canadian College of Business & Computers',
    'Canadian Mennonite University',
    'Capilano College',
    'Carleton University',
    'Centennial College',
    'College of New Caledonia',
    'College of the Rockies',
    'Collège Boréal',
    'Columbia College',
    'Concordia University',
    'Concordia University College of Alberta',
    'Conestoga College',
    'Dalhousie University',
    'DeGroote School of Business',
    'DeGroote School of Medicine',
    'DeVry Institute of Technology',
    'Desautels Faculty of Management',
    'Dominican College of Philosophy and Theology',
    'Douglas College',
    'Durham College',
    'Emily Carr Institute of Art + Design',
    'Fanshawe College',
    'First Nations University of Canada',
    'George Brown College',
    'Humber College',
    'Huron University College',
    'Institut Armand-Frappier, Université du Québec',
    'Institut National de la Recherche Scientifique, Université du Québec',
    'Ivey Business School',
    'King\'s College',
    'King\'s University College',
    'Kingston College',
    'Kwantleen University College',
    'Lakehead University',
    'Langara College',
    'Lansbridge University',
    'Laurentian University of Sudbury',
    'Luther College',
    'MacEwan University',
    'Malaspina University College',
    'McGill University',
    'McMaster University',
    'Memorial University of Newfoundland',
    'Mount Allison University',
    'Mount Royal College',
    'Mount Saint Vincent University',
    'Nicola Valley Institute of Technology',
    'Nipissing University',
    'North Island College',
    'Northern Alberta Institute of Technology',
    'Northern Lights College',
    'Nova Scotia Agricultural College',
    'Nova Scotia College of Art and Design',
    'Okanagan University College',
    'Ontario College of Art and Design',
    'Osgoode Law School',
    'Pacific International College',
    'Queen\'s University',
    'Quest University',
    'Redeemer College',
    'Regent College',
    'Rotman Commerce',
    'Royal Military College of Canada',
    'Royal Roads University',
    'Ryerson University',
    'Saskatchewan Indian Federated College',
    'Sauder School of Business',
    'Sauder School of Business',
    'Schulich School of Business',
    'Schulich School of Medicine & Dentistry',
    'Selkirk College',
    'Seneca College',
    'Sheridan College',
    'Simon Fraser University',
    'Smith School of Business',
    'Southern Alberta Institute of Technology',
    'St. Anne University',
    'St. Clair College',
    'St. Francis Xavier University',
    'St. Mary\'s University',
    'St. Paul University',
    'St. Thomas University',
    'Thompson Rivers University',
    'Trent University',
    'Trinity Western University',
    'Télé-université, Université du Québec',
    'University Canada West',
    'University College of Cape Breton',
    'University College of Saint-Boniface',
    'University College of the Cariboo',
    'University College of the Fraser Valley',
    'University of Alberta',
    'University of British Columbia',
    'University of Calgary',
    'University of Guelph',
    'University of King\'s College',
    'University of Lethbridge',
    'University of Manitoba',
    'University of Moncton',
    'University of Moncton, Edmundston',
    'University of Moncton, Shippagan',
    'University of New Brunswick',
    'University of New Brunswick, Saint John',
    'University of Northern British Columbia',
    'University of Ontario Institute of Technology',
    'University of Ottawa',
    'University of Prince Edward Island',
    'University of Québec',
    'University of Regina',
    'University of Saskatchewan',
    'University of St. Jerome\'s College',
    'University of St. Michael\'s College',
    'University of Sudbury',
    'University of Toronto',
    'University of Toronto, Mississauga',
    'University of Toronto, Scarborough',
    'University of Trinity College',
    'University of Victoria',
    'University of Waterloo',
    'University of Western Ontario',
    'University of Windsor',
    'University of Winnipeg',
    'Université Laval',
    'Université de Montréal',
    'Université de Sherbrooke',
    'Université du Québec en Abitibi-Témiscamingue',
    'Université du Québec en Outaouais',
    'Université du Québec à Chicoutimi',
    'Université du Québec à Montréal',
    'Université du Québec à Rimouski',
    'Université du Québec à Trois-Rivières',
    'Vancouver Community College',
    'Victoria University Toronto, University of Toronto',
    'Wilfrid Laurier University',
    'William and Catherine Booth College',
    'York University',
    'Yukon College',
    'École Polytechnique de Montréal, Université de Montréal',
    'École de technologie supérieure, Université du Québec',
    'École des Hautes Études Commerciales',
    'École nationale d\'administration publique, Université du Québec'
];
// TODO TEMP until we update ethnicities in the backend
export const ETHNICITIES = [
    'Indigenous',
    'East-Asian',
    'Black',
    'South-Asian',
    'Latino',
    'Middle Eastern',
    'Visible Minority',
    'White'
];
export const COUNTRIES = [
    'Afghanistan',
    'Åland Islands',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua & Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Ascension Island',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia & Herzegovina',
    'Botswana',
    'Brazil',
    'British Indian Ocean Territory',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Canary Islands',
    'Cape Verde',
    'Caribbean Netherlands',
    'Cayman Islands',
    'Central African Republic',
    'Ceuta & Melilla',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Congo - Brazzaville',
    'Congo - Kinshasa',
    'Cook Islands',
    'Costa Rica',
    'Côte d’Ivoire',
    'Croatia',
    'Cuba',
    'Curaçao',
    'Cyprus',
    'Czechia',
    'Denmark',
    'Diego Garcia',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Eurozone',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong SAR China',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau SAR China',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar (Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'North Korea',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestinian Territories',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn Islands',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Réunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Samoa',
    'San Marino',
    'São Tomé & Príncipe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Sint Maarten',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia & South Sandwich Islands',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'St. Barthélemy',
    'St. Helena',
    'St. Kitts & Nevis',
    'St. Lucia',
    'St. Martin',
    'St. Pierre & Miquelon',
    'St. Vincent & Grenadines',
    'Sudan',
    'Suriname',
    'Svalbard & Jan Mayen',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad & Tobago',
    'Tristan da Cunha',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks & Caicos Islands',
    'Tuvalu',
    'U.S. Outlying Islands',
    'U.S. Virgin Islands',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United Nations',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Wallis & Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe'
];
export const LANGUAGES = [
    // 'Abkhazian',// commented out Abkhazian so it doesn't show up in master list before accounting and acadia university
    'Achinese',
    'Acoli',
    'Adangme',
    'Adyghe',
    'Afar',
    'Afrihili',
    'Afrikaans',
    'Aghem',
    'Ainu',
    'Akan',
    'Akkadian',
    'Akoose',
    'Alabama',
    'Albanian',
    'Aleut',
    'Algerian Arabic',
    'American English',
    'American Sign Language',
    'Amharic',
    'Ancient Egyptian',
    'Ancient Greek',
    'Angika',
    'Ao Naga',
    'Arabic',
    'Aragonese',
    'Aramaic',
    'Araona',
    'Arapaho',
    'Arawak',
    'Armenian',
    'Aromanian',
    'Arpitan',
    'Assamese',
    'Asturian',
    'Asu',
    'Atsam',
    'Australian English',
    'Austrian German',
    'Avaric',
    'Avestan',
    'Awadhi',
    'Aymara',
    'Azerbaijani',
    'Badaga',
    'Bafia',
    'Bafut',
    'Bakhtiari',
    'Balinese',
    'Baluchi',
    'Bambara',
    'Bamun',
    'Banjar',
    'Basaa',
    'Bashkir',
    'Basque',
    'Batak Toba',
    'Bavarian',
    'Beja',
    'Belarusian',
    'Bemba',
    'Bena',
    'Bengali',
    'Betawi',
    'Bhojpuri',
    'Bikol',
    'Bini',
    'Bishnupriya',
    'Bislama',
    'Blin',
    'Blissymbols',
    'Bodo',
    'Bosnian',
    'Brahui',
    'Braj',
    'Brazilian Portuguese',
    'Breton',
    'British English',
    'Buginese',
    'Bulgarian',
    'Bulu',
    'Buriat',
    'Burmese',
    'Caddo',
    'Cajun French',
    'Canadian English',
    'Canadian French',
    'Cantonese',
    'Capiznon',
    'Carib',
    'Catalan',
    'Cayuga',
    'Cebuano',
    'Central Atlas Tamazight',
    'Central Dusun',
    'Central Yupik',
    'Chadian Arabic',
    'Chagatai',
    'Chamorro',
    'Chechen',
    'Cherokee',
    'Cheyenne',
    'Chibcha',
    'Chiga',
    'Chimborazo Highland Quichua',
    'Chinese',
    'Chinook Jargon',
    'Chipewyan',
    'Choctaw',
    'Church Slavic',
    'Chuukese',
    'Chuvash',
    'Classical Newari',
    'Classical Syriac',
    'Colognian',
    'Comorian',
    'Congo Swahili',
    'Coptic',
    'Cornish',
    'Corsican',
    'Cree',
    'Creek',
    'Crimean Turkish',
    'Croatian',
    'Czech',
    'Dakota',
    'Danish',
    'Dargwa',
    'Dazaga',
    'Delaware',
    'Dinka',
    'Divehi',
    'Dogri',
    'Dogrib',
    'Duala',
    'Dutch',
    'Dyula',
    'Dzongkha',
    'Eastern Frisian',
    'Efik',
    'Egyptian Arabic',
    'Ekajuk',
    'Elamite',
    'Embu',
    'Emilian',
    'English',
    'Erzya',
    'Esperanto',
    'Estonian',
    'European Portuguese',
    'European Spanish',
    'Ewe',
    'Ewondo',
    'Extremaduran',
    'Fang',
    'Fanti',
    'Faroese',
    'Fiji Hindi',
    'Fijian',
    'Filipino',
    'Finnish',
    'Flemish',
    'Fon',
    'Frafra',
    'French',
    'Friulian',
    'Fulah',
    'Ga',
    'Gagauz',
    'Galician',
    'Gan Chinese',
    'Ganda',
    'Gayo',
    'Gbaya',
    'Geez',
    'Georgian',
    'German',
    'Gheg Albanian',
    'Ghomala',
    'Gilaki',
    'Gilbertese',
    'Goan Konkani',
    'Gondi',
    'Gorontalo',
    'Gothic',
    'Grebo',
    'Greek',
    'Guarani',
    'Gujarati',
    'Gusii',
    'Gwichʼin',
    'Haida',
    'Haitian',
    'Hakka Chinese',
    'Hausa',
    'Hawaiian',
    'Hebrew',
    'Herero',
    'Hiligaynon',
    'Hindi',
    'Hiri Motu',
    'Hittite',
    'Hmong',
    'Hungarian',
    'Hupa',
    'Iban',
    'Ibibio',
    'Icelandic',
    'Ido',
    'Igbo',
    'Iloko',
    'Inari Sami',
    'Indonesian',
    'Ingrian',
    'Ingush',
    'Interlingua',
    'Interlingue',
    'Inuktitut',
    'Inupiaq',
    'Irish',
    'Italian',
    'Jamaican Creole English',
    'Japanese',
    'Javanese',
    'Jju',
    'Jola-Fonyi',
    'Judeo-Arabic',
    'Judeo-Persian',
    'Jutish',
    'Kabardian',
    'Kabuverdianu',
    'Kabyle',
    'Kachin',
    'Kaingang',
    'Kako',
    'Kalaallisut',
    'Kalenjin',
    'Kalmyk',
    'Kamba',
    'Kanembu',
    'Kannada',
    'Kanuri',
    'Kara-Kalpak',
    'Karachay-Balkar',
    'Karelian',
    'Kashmiri',
    'Kashubian',
    'Kawi',
    'Kazakh',
    'Kenyang',
    'Khasi',
    'Khmer',
    'Khotanese',
    'Khowar',
    'Kikuyu',
    'Kimbundu',
    'Kinaray-a',
    'Kinyarwanda',
    'Kirmanjki',
    'Klingon',
    'Kom',
    'Komi',
    'Komi-Permyak',
    'Kongo',
    'Konkani',
    'Korean',
    'Koro',
    'Kosraean',
    'Kotava',
    'Koyra Chiini',
    'Koyraboro Senni',
    'Kpelle',
    'Krio',
    'Kuanyama',
    'Kumyk',
    'Kurdish',
    'Kurukh',
    'Kutenai',
    'Kwasio',
    'Kyrgyz',
    'Kʼicheʼ',
    'Ladino',
    'Lahnda',
    'Lakota',
    'Lamba',
    'Langi',
    'Lao',
    'Latgalian',
    'Latin',
    'Latin American Spanish',
    'Latvian',
    'Laz',
    'Lezghian',
    'Ligurian',
    'Limburgish',
    'Lingala',
    'Lingua Franca Nova',
    'Literary Chinese',
    'Lithuanian',
    'Livonian',
    'Lojban',
    'Lombard',
    'Low German',
    'Lower Silesian',
    'Lower Sorbian',
    'Lozi',
    'Luba-Katanga',
    'Luba-Lulua',
    'Luiseno',
    'Lule Sami',
    'Lunda',
    'Luo',
    'Luxembourgish',
    'Luyia',
    'Maba',
    'Macedonian',
    'Machame',
    'Madurese',
    'Mafa',
    'Magahi',
    'Main-Franconian',
    'Maithili',
    'Makasar',
    'Makhuwa-Meetto',
    'Makonde',
    'Malagasy',
    'Malay',
    'Malayalam',
    'Maltese',
    'Manchu',
    'Mandarin',
    'Mandingo',
    'Manipuri',
    'Manx',
    'Maori',
    'Mapuche',
    'Marathi',
    'Mari',
    'Marshallese',
    'Marwari',
    'Masai',
    'Mazanderani',
    'Medumba',
    'Mende',
    'Mentawai',
    'Meru',
    'Metaʼ',
    'Mexican Spanish',
    'Micmac',
    'Middle Dutch',
    'Middle English',
    'Middle French',
    'Middle High German',
    'Middle Irish',
    'Min Nan Chinese',
    'Minangkabau',
    'Mingrelian',
    'Mirandese',
    'Mizo',
    'Modern Standard Arabic',
    'Mohawk',
    'Moksha',
    'Moldavian',
    'Mongo',
    'Mongolian',
    'Morisyen',
    'Moroccan Arabic',
    'Mossi',
    'Multiple Languages',
    'Mundang',
    'Muslim Tat',
    'Myene',
    'Nama',
    'Nauru',
    'Navajo',
    'Ndonga',
    'Neapolitan',
    'Nepali',
    'Newari',
    'Ngambay',
    'Ngiemboon',
    'Ngomba',
    'Nheengatu',
    'Nias',
    'Niuean',
    'No linguistic content',
    'Nogai',
    'North Ndebele',
    'Northern Frisian',
    'Northern Sami',
    'Northern Sotho',
    'Norwegian',
    'Norwegian Bokmål',
    'Norwegian Nynorsk',
    'Novial',
    'Nuer',
    'Nyamwezi',
    'Nyanja',
    'Nyankole',
    'Nyasa Tonga',
    'Nyoro',
    'Nzima',
    'NʼKo',
    'Occitan',
    'Ojibwa',
    'Old English',
    'Old French',
    'Old High German',
    'Old Irish',
    'Old Norse',
    'Old Persian',
    'Old Provençal',
    'Oriya',
    'Oromo',
    'Osage',
    'Ossetic',
    'Ottoman Turkish',
    'Pahlavi',
    'Palatine German',
    'Palauan',
    'Pali',
    'Pampanga',
    'Pangasinan',
    'Papiamento',
    'Pashto',
    'Pennsylvania German',
    'Persian',
    'Phoenician',
    'Picard',
    'Piedmontese',
    'Plautdietsch',
    'Pohnpeian',
    'Polish',
    'Pontic',
    'Portuguese',
    'Prussian',
    'Punjabi',
    'Quechua',
    'Rajasthani',
    'Rapanui',
    'Rarotongan',
    'Riffian',
    'Romagnol',
    'Romanian',
    'Romansh',
    'Romany',
    'Rombo',
    'Root',
    'Rotuman',
    'Roviana',
    'Rundi',
    'Russian',
    'Rusyn',
    'Rwa',
    'Saho',
    'Sakha',
    'Samaritan Aramaic',
    'Samburu',
    'Samoan',
    'Samogitian',
    'Sandawe',
    'Sango',
    'Sangu',
    'Sanskrit',
    'Santali',
    'Sardinian',
    'Sasak',
    'Sassarese Sardinian',
    'Saterland Frisian',
    'Saurashtra',
    'Scots',
    'Scottish Gaelic',
    'Selayar',
    'Selkup',
    'Sena',
    'Seneca',
    'Serbian',
    'Serbo-Croatian',
    'Serer',
    'Seri',
    'Shambala',
    'Shan',
    'Shona',
    'Sichuan Yi',
    'Sicilian',
    'Sidamo',
    'Siksika',
    'Silesian',
    'Simplified Chinese',
    'Sindhi',
    'Sinhala',
    'Skolt Sami',
    'Slave',
    'Slovak',
    'Slovenian',
    'Soga',
    'Sogdien',
    'Somali',
    'Soninke',
    'Sorani Kurdish',
    'South Azerbaijani',
    'South Ndebele',
    'Southern Altai',
    'Southern Sami',
    'Southern Sotho',
    'Spanish',
    'Sranan Tongo',
    'Standard Moroccan Tamazight',
    'Sukuma',
    'Sumerian',
    'Sundanese',
    'Susu',
    'Swahili',
    'Swati',
    'Swedish',
    'Swiss French',
    'Swiss German',
    'Swiss High German',
    'Syriac',
    'Tachelhit',
    'Tagalog',
    'Tahitian',
    'Taita',
    'Tajik',
    'Talysh',
    'Tamashek',
    'Tamil',
    'Taroko',
    'Tasawaq',
    'Tatar',
    'Telugu',
    'Tereno',
    'Teso',
    'Tetum',
    'Thai',
    'Tibetan',
    'Tigre',
    'Tigrinya',
    'Timne',
    'Tiv',
    'Tlingit',
    'Tok Pisin',
    'Tokelau',
    'Tongan',
    'Tornedalen Finnish',
    'Traditional Chinese',
    'Tsakhur',
    'Tsakonian',
    'Tsimshian',
    'Tsonga',
    'Tswana',
    'Tulu',
    'Tumbuka',
    'Tunisian Arabic',
    'Turkish',
    'Turkmen',
    'Turoyo',
    'Tuvalu',
    'Tuvinian',
    'Twi',
    'Tyap',
    'Udmurt',
    'Ugaritic',
    'Ukrainian',
    'Umbundu',
    'Unknown Language',
    'Upper Sorbian',
    'Urdu',
    'Uyghur',
    'Uzbek',
    'Vai',
    'Venda',
    'Venetian',
    'Veps',
    'Vietnamese',
    'Volapük',
    'Võro',
    'Votic',
    'Vunjo',
    'Walloon',
    'Walser',
    'Waray',
    'Washo',
    'Wayuu',
    'Welsh',
    'West Flemish',
    'Western Frisian',
    'Western Mari',
    'Wolaytta',
    'Wolof',
    'Wu Chinese',
    'Xhosa',
    'Xiang Chinese',
    'Yangben',
    'Yao',
    'Yapese',
    'Yemba',
    'Yiddish',
    'Yoruba',
    'Zapotec',
    'Zarma',
    'Zaza',
    'Zeelandic',
    'Zenaga',
    'Zhuang',
    'Zoroastrian Dari',
    'Zulu',
    'Zuni'
];
export const RELIGIONS = [
    'Agnostic',
    'Atheist',
    'Buddhism',
    'Christianity',
    'Hinduism',
    'Islam',
    'Judaism',
    'Sikhism'

];
export const ACTIVITIES = [
    // "3D Printing", // commented out 3d printing so it doens't show up in master list before accounting and acadia university
    'Acting',
    'Action Figure',
    'Aircraft Spotting',
    'Amateur Astronomy',
    'Amateur Radio',
    'Animal Fancy',
    'Antiquing',
    'Antiquities',
    'Art Collecting',
    'Astrology',
    'Astronomy',
    'Aviation',
    'Backpacking (Travel)',
    'Baking',
    'Base Jumping',
    'Baton Twirling',
    'Beekeeping',
    'Bird Watching',
    'Blacksmithing',
    'Board Game',
    'Board Sports',
    'Book Collecting',
    'Book Restoration',
    'Bowling',
    'Brazilian Jiu-Jitsu',
    'Breakdancing',
    'Bus Spotting',
    'Cabaret',
    'Calligraphy',
    'Camping',
    'Candle Making',
    'Canyoning',
    'Card Collecting',
    'Cheerleading',
    'Climbing',
    'Coin Collecting',
    'Color Guard (Flag Spinning)',
    'Coloring Book',
    'Comic Book Collecting',
    'Competitive Dance',
    'Computer Programming',
    'Contract Bridge',
    'Cooking',
    'Cosplaying',
    'Couponing',
    'Creative Writing',
    'Crocheting',
    'Cross-Stitch',
    'Crossword Puzzles',
    'Cryptography',
    'Cue Sports',
    'Dance',
    'Debate',
    'Deltiology',
    'Die-Cast Toy',
    'Digital Art',
    'Disc Golf',
    'Dog Sport',
    'Dowsing',
    'Drama',
    'Drawing',
    'Driving',
    'Electronics',
    'Element Collecting',
    'Embroidery',
    'Equestrianism',
    'Exhibition Drill',
    'Fantasy Sport',
    'Fashion',
    'Film Memorabilia',
    'Fishkeeping',
    'Flag Football',
    'Flower Arranging',
    'Footbag',
    'Foraging',
    'Fossil Hunting',
    'Freestyle Football',
    'Gardening',
    'Genealogy',
    'Geocaching',
    'Ghost Hunting',
    'Glassblowing',
    'Go (Game)',
    'Graffiti',
    'Gunsmithing',
    'Handball',
    'Herpetoculture',
    'Herping',
    'High-Power Rocketry',
    'Hiking',
    'Homebrewing',
    'Hooping',
    'Horseback Riding',
    'Hunting',
    'Hydroponics',
    'Inline Skating',
    'Insect Collecting',
    'Jewelry Making',
    'Jigsaw Puzzles',
    'Jogging',
    'Juggling',
    'Kart Racing',
    'Kayaking',
    'Kite',
    'Kitesurfing',
    'Knife Making',
    'Knife Throwing',
    'Knitting',
    'Kombucha',
    'Lace',
    'Lapidary Club',
    'Larping',
    'Laser Tag',
    'Leather Crafting',
    'Lego',
    'Letterboxing (Hobby)',
    'Machining',
    'Magic (Illusion)',
    'Magnet Fishing',
    'Mahjong',
    'Marbles',
    'Marching Band',
    'Martial Arts',
    'Metal Detecting',
    'Metal Detector',
    'Metalworking',
    'Meteorology',
    'Microscopy',
    'Mineral Collecting',
    'Model Aircraft',
    'Model Building',
    'Motor Sports',
    'Mountain Biking',
    'Movies',
    'Mushroom Hunting',
    'Music',
    'Mycology',
    'Nordic Skating',
    'Origami',
    'Paintball',
    'Painting',
    'Pet',
    'Philately',
    'Photography',
    'Poi (Performance Art)',
    'Poker',
    'Pottery',
    'Pressed Flower Craft',
    'Puzzle',
    'Quilling',
    'Quilting',
    'Radio-Controlled Car',
    'Rappelling',
    'Reading (Process)',
    'Record Collecting',
    'Road Cycling',
    'Robotics',
    'Rock Balancing',
    'Rock Climbing',
    'Role-Playing Game',
    'Roller Skating',
    'Rowing (Sport)',
    'Rugby Football',
    'Running',
    'Sand Art And Play',
    'Satellite Watching',
    'Scouting',
    'Scrapbooking',
    'Scuba Diving',
    'Sculling',
    'Sculpting',
    'Sea Glass',
    'Seashell',
    'Second-Language Acquisition',
    'Sewing',
    'Shooting Sport',
    'Shopping',
    'Shortwave Listening',
    'Singing',
    'Sketch (Drawing)',
    'Skimboarding',
    'Skydiving',
    'Slacklining',
    'Slot Car Racing',
    'Soapmaking',
    'Speedcubing',
    'Sport Stacking',
    'Squash (Sport)',
    'Stamp Collecting',
    'Stand-Up Comedy',
    'Stone Collecting',
    'Stone Skipping',
    'Sun Bathing',
    'Table Football',
    'Tabletop Game',
    'Tai Chi',
    'Taxidermy',
    'Television Program',
    'Tennis Polo',
    'Topiary',
    'Tour Skating',
    'Trainspotting (Hobby)',
    'Travel',
    'Traveling',
    'Ultimate (Sport)',
    'Urban Exploration',
    'Vacation',
    'Vehicle Restoration',
    'Video Game Collecting',
    'Video Gaming',
    'Videophile',
    'Vintage Cars',
    'Walking',
    'Water Polo',
    'Water Sports',
    'Web Surfing',
    'Weight Training',
    'Whale Watching',
    'Whittling',
    'Wood Carving',
    'Woodworking',
    'Worldbuilding',
    'Writing',
    'Yo-Yoing'
];
export const SPORTS = [
    'Aikido',
    'Air Sports',
    'Airsoft',
    'Alpine',
    'Alpine Skiing',
    'American',
    'Any Sport',
    'Archery',
    'Arm Wrestling',
    'Athletics',
    'Australian Rules Football',
    'Auto Racing',
    'Badminton',
    'Bandy',
    'Baseball',
    'Basketball',
    'Beach Soccer',
    'Beach Volleyball',
    'Biathlon',
    'Biathlon',
    'Billiard Sports',
    'Bobsleigh',
    'Bocce',
    'Boccia',
    'Bodyboarding',
    'Bodybuilding',
    'Boot Throwing',
    'Bowling (Canadian Five-Pin)',
    'Bowling (Ten-Pin)',
    'Bowls',
    'Boxing',
    'Broomball',
    'Canoeing',
    'Casting',
    'Chess',
    'Cricket',
    'Croquet',
    'Cross-Country',
    'Cross-Country Skiing',
    'Curling',
    'Cycling',
    'Dancesport',
    'Darts',
    'Dragon Boat Racing',
    'Elephant Polo',
    'Equestrian',
    'Fencing',
    'Field Hockey',
    'Figure Skating',
    'Fishing',
    'Fistball',
    'Floorball',
    'Flying Disc',
    'Foosball',
    'Football',
    'Football (Gaelic)',
    'Freestyle',
    'Game Fishing',
    'Goalball',
    'Golf',
    'Greyhound Racing',
    'Gymnastics',
    'Handball (Court)',
    'Handball (Team)',
    'Harness Horse Racing',
    'Horse Racing',
    'Horseshoes',
    'Hurling',
    'Ice Hockey',
    'Ice Skating',
    'Ice Sledge Hockey',
    'Inline Hockey',
    'Intercrosse',
    'Ju-Jitsu',
    'Judo',
    'Karate',
    'Kendo',
    'Kickboxing',
    'Korfball',
    'Kung Fu',
    'Lacrosse',
    'Life Saving',
    'Luge',
    'Miniature Golf',
    'Mixed Martial Arts',
    'Modern Pentathlon',
    'Motorcycle Sport',
    'Mountain Running',
    'Mountainboarding',
    'Mountaineering',
    'Muay Thai',
    'Netball',
    'Nordic Combined',
    'Nordic Skiing',
    'Orienteering',
    'Paddleball',
    'Parkour',
    'Petanque',
    'Pigeon Racing',
    'Pitch And Putt',
    'Pole Dance',
    'Polo',
    'Powerboating',
    'Powerlifting',
    'Practical Shooting',
    'Quidditch',
    'Racquetball',
    'Rafting',
    'Ringette',
    'Rink Hockey',
    'Roller Derby',
    'Roller Sports',
    'Rope Skipping',
    'Rounders',
    'Rowing',
    'Rugby Fives',
    'Rugby League',
    'Rugby Union',
    'Sailing',
    'Shooting',
    'Skateboarding',
    'Skeleton',
    'Ski Jumping',
    'Skibobbing',
    'Skiing',
    'Sled Dog Sports',
    'Snowboarding',
    'Soccer',
    'Soft Tennis',
    'Softball',
    'Speed Skating',
    'Sports Climbing',
    'Sports Fishing',
    'Squash',
    'Sumo',
    'Surfing',
    'Swimming',
    'Swimming',
    'Table Soccer',
    'Table Tennis',
    'Taekwondo',
    'Tchoukball',
    'Tennis',
    'Throwball',
    'Touch Football',
    'Track and Field',
    'Triathlon',
    'Ultimate Frisbee',
    'Underwater Sports',
    'Volleyball',
    'Water Skiing',
    'Weightlifting',
    'Wheelchair Basketball',
    'Wheelchair Curling',
    'Wheelchair Fencing',
    'Wheelchair Rugby',
    'Wheelchair Tennis',
    'Wrestling',
    'Yoga'
];
export const DISABILITIES = [
    'Autism',
    'Chronic Illness',
    'Hearing Loss and Deafness',
    'Intellectual Disability',
    'Learning Disability',
    'Memory Loss',
    'Mental Health',
    'Physical Disability',
    'Speech and Language Disorders',
    'Vision Loss and Blindness'
];

export const GRADE_LEVELS = [
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
    'Year 1 Undergrad',
    'Year 2 Undergrad',
    'Year 3 Undergrad',
    'Year 4 Undergrad',
    'Year 5+ Undergrad',
    'Masters',
    'Phd',
    'Other',
];

export const OTHER_DEMOGRAPHICS = [
    "Women",
    "Men",
    "LGBTQ",
    "International Student",
    "STEM",
    "Low Income",
    "Single Parent",
    "Orphan",
    "Army",
];

export let MASTER_LIST_EVERYTHING = MAJORS_LIST.concat(SCHOOLS_LIST).concat(MAJORS_LIST).concat(ETHNICITIES)
    .concat(DISABILITIES).concat(SPORTS).concat(ACTIVITIES).concat(RELIGIONS).concat(LANGUAGES).sort();

MASTER_LIST_EVERYTHING = [...new Set(MASTER_LIST_EVERYTHING)];
export const MASTER_LIST_EVERYTHING_UNDERSCORE = MASTER_LIST_EVERYTHING.map(item => item.toLowerCase());

export const MASTER_LIST_WITH_CATEGORY_LABEL = [];
// TODO use ALL_DEMOGRAPHICS to populate MASTER_LIST_EVERYTHING
export const ALL_DEMOGRAPHICS = {
    "eligible_schools": SCHOOLS_LIST,
    "eligible_programs": MAJORS_LIST,
    "ethnicity": ETHNICITIES,
    "sports": SPORTS,
    "religion": RELIGIONS,
    "industries": INDUSTRIES,
    "occupations": OCCUPATIONS,
    "other_demographic": OTHER_DEMOGRAPHICS,
    "activities": ACTIVITIES,
    "heritage": COUNTRIES,
    "languages": LANGUAGES,
    "disability": DISABILITIES,
    "citizenship": COUNTRIES,
}

for (const [demographic_type, demographic_list] of Object.entries(ALL_DEMOGRAPHICS)) {
    MASTER_LIST_WITH_CATEGORY_LABEL.push(...demographic_list.map(item => (
        {value: item, category: demographic_type}
    )))
}

/**
 * This list of category labels, has additional options that are only visible to atila admins
 */
 export const ALL_DEMOGRAPHICS_ADMIN = {
    ...ALL_DEMOGRAPHICS,
    // TODO, this can be moved back to all_demographic later, when we use this for scholarship and user profile filtering
    "citizenship": COUNTRIES,
    'tags': CONTACT_TAGS,
    'account_type': CONTACT_TYPES,
}

export const MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN = [];

for (const [demographic_type, demographic_list] of Object.entries(ALL_DEMOGRAPHICS_ADMIN)) {
    MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN.push(...demographic_list.map(item => (
        {value: item, category: demographic_type}
    )))
}