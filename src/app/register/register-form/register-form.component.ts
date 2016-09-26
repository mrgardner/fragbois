import {Component, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder, Validator,
} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";

declare var firebase: any;

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  private registerForm:FormGroup;
  private months:Array<string>;
  private days:Array<number>;
  private years:Array<number>;
  private countries:Array<string>;
  private cities:Array<string>;
  private users:Array<Object>;
  private userVerify: boolean;
  private userAvailable: boolean;
  private emailAvailable: boolean;
  private emailVerify: boolean;
  public genders = [
    { value: 'Female', display: 'Female' },
    { value: 'Male', display: 'Male' },
    { value: 'Other', display: 'Other' }
  ];


  constructor(private formBuilder:FormBuilder, private userService: UserService, private router: Router) {
    this.users = [];
    this.userVerify = false;
    this.emailVerify = false;
    this.userAvailable = null;
    this.emailAvailable = null;
    this.userService.verifyUsername("")
    this.userService.verifyEmail("")
    this.registerForm = formBuilder.group({
      'username': ['',[
        Validators.required,
        // Validators.pattern("^[a-zA-Z0-9]+$")
      ]],
      'firstName': ['',[
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      'lastName': ['',[
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      'email': ['',[
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      'password': ['', [
        Validators.required
      ]],
      'confirmPassword': ['', [
        Validators.required
      ]],
      'month': ['', [
        Validators.required
      ]],
      'day': ['', [
        Validators.required
      ]],
      'year': ['', [
        Validators.required
      ]],
      'gender': ['', [
        Validators.required
      ]],
      'country': ['', [
        Validators.required
      ]],
      'city': ['', [
        Validators.required
      ]]
    }, {validator: this.matchingPasswords('password', 'confirmPassword')});

    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    this.years = [2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,
                1997,1997,1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,1983,1982,1981,1980,
                1979,1978,1977,1976,1975,1974,1973,1972,1971,1970,1969,1968,1967,1966,1965,1964,1963,1962,1961,1960,
                1959,1958,1957,1956,1955,1954,1953,1952,1951,1950,1949,1948,1947,1946,1946,1945,1944,1943,1942,1941,1940,
                1939,1938,1937,1936,1935,1934,1933,1932,1931,1930,1929,1928,1927,1926,1925,1924,1923,1922,1921,1920,
                1919,1918,1917,1916,1915,1914,1913,1912,1911,1910,1909,1908,1907,1906,1905,1904,1903,1902,1901,1900];
    this.countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Australia',
                'Austria', 'Azerbaijan', 'Bahamas','Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
                'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma (Myanmar)',
                'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
                'Congo', 'Congo, Democratic Republic', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
                'Dominican Republic', 'Ecuador', 'East Timor', 'Egypt', 'El Salvador', 'England', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
                'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
                'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
                'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
                'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
                'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
                'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'The Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Northern Ireland',
                'Pakistan', 'Palau', 'Palestinian State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'The Philippines', 'Poland', 'Portugal', 'Qatar',
                'Romania', 'Russia', 'Rwanda', 'St Kitts & Nevis', 'St. Lucia', 'St. Vincent & The Grenadines', 'Samoa', 'San Marino', 'São Tomé & Príncipe', 'Saudi Arabia',
                'Scotland', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain',
                'Sir Lanka', 'Sudan', 'South Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
                'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United States', 'Uruguay',
                'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Western Sahara', 'Wales', 'Yemen', 'Zaire', 'Zambia', 'Zimbabwe'];
  }



  ngOnInit() {
  }

  verifyUser(username:string) {
    let user = this.userService.verifyUsername(username);
    if(user) {
      this.userVerify = true;
      this.userAvailable = true
    }
    else {
      this.userVerify = false;
      this.userAvailable = false;
    }
  }

  verifyEmail(email:string) {
    let user = this.userService.verifyEmail(email);
    if(user) {
      this.emailVerify = true;
      this.emailAvailable = true
    }
    else {
      this.emailVerify = false;
      this.emailAvailable = false;
    }
  }

  onSignup() {
    this.userService.signupUser(this.registerForm.value);
    this.router.navigate(['login']);
  }

  onMonthChange(monthName) {
    switch (monthName) {
      case "January":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "February":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
        break;
      case "March":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "April":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "May":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "June":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "July":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "August":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "September":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "October":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "November":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "December":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
    }
  }

  onCountryChange(countryName) {
    switch (countryName) {
      case'Afghanistan':
        this.cities = ['Kebaul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Kunduz', 'Taloqan', 'Jalalbad', 'Puli Khumri', 'Charikar',
                      'Sheberghan', 'Ghazni', 'Sar-e Pol', 'Khost', 'Chaghcharan', 'Mihtarlam', 'Farah', 'Puli Alam', 'Samangan', 'Lashkar Gah'];
        break;
      case 'Albania':
        this.cities = ['Tiranë', 'Durrës', 'Vlorë', 'Elbasan', 'Shkodër', 'Kamëz', 'Fier', 'Korçë', 'Berat', 'Lushnjë', 'Pogradec', '	Kavajë',
                      'Gjirokastër', 'Fushë-Krujë', 'Sarandë', 'Laç', 'Kukës', 'Sukth', 'Patos', 'Lezhë', 'Mamurras', 'Peshkopi',
                      'Kuçovë', 'Krujë', 'Vorë', 'Burrel', 'Rrëshen', 'Milot', 'Divjakë', ' Gramsh', 'Bulqizë', 'Vau i Dejës', 'Shëngjin',
                      'Klos', 'Ballsh', 'Shijak', 'Ura Vajgurore', 'Rrogozhinë', 'Librazhd', 'Cërrik', 'Manëz', 'Peqin', 'Bilisht', '	Krumë',
                      'Përmet', 'Prrenjas', 'Delvinë', 'Orikum', 'Bajram Curri', 'Roskovec', 'Rubik', 'Tepelenë', 'Poliçan', 'Maliq', '	Çorovodë',
                      'Ersekë', 'Koplik', 'Pukë', 'Himarë', 'Këlcyrë', 'Memaliaj', 'Fushë-Arrëz', 'Bajzë', 'Krrabë', 'Selenicë', 'Konispol', 'Libohovë',
                      'Reps', 'Fierzë', 'Krastë', 'Leskovik', 'Finiq', 'Ulëz', 'Kurbnesh'];
        break;
      case 'Algeria':
        this.cities = ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'El Qued',
                      'Skikda', 'Tiaret', 'Béjaïa', 'Tlemcen', 'Ouargla', 'Béchar', 'Mostaganem', 'Bordj Bou Arréridj', 'Chlef', 'Souk Ahras', 'Médéa',
                      'El Eulma', 'Touggourt', 'Ghardaïa', 'Saïda', 'Laghouat', "M'Sila", 'Jijel', 'Relizane', 'Guelma', 'Aïn Béïda', 'Khenchela',
                      'Bousaada', 'Mascara', 'Tindouf', 'Tizi Ouzou'];
        break;
      case 'Andorra':
        this.cities = ['Canillo', 'Encamp', 'Ordino', 'La Massana', 'Andorra la Vella', 'Sant Julià de Lòria', 'Escaldes-Engordany'];
        break;
      case'Angola':
        this.cities = ['Ambriz', 'Andulo', 'Bailundo','Baía Farta', 'Benguela', 'Bibala', 'Bimbe', 'Biula', 'Bungo', 'Cabamba', 'Cabinda',
                      'Caboledo', 'Cacolo', 'Caconda', 'Caculama', 'Cacuso', 'Cafunfo', 'Cahama', 'Caiengue', 'Caimbambo', 'Calandala', 'Calenga',
                      'Calonda', 'Calucinga', 'Calulo', 'Caluquembe', 'Camabatela', 'Camacupa', 'Camanongue', 'Camaxilo', 'Cambambe', 'Cambongue',
                      'Cambundi', 'Camissombo','Cangandala', 'Cangumbe', 'Capelongo', 'Capenda Camulemba', 'Capulo', 'Cassanguide', 'Cassongue', 'Catabola',
                      'Catacanha', 'Catchiungo', 'Catumbela', 'Caungula', 'Caxita', 'Caxito', 'Cazaje', 'Cazombo', 'Caála', 'Cela', 'Chiange', 'Chibanda',
                      'Chibemba', 'Chibia', 'Chicala', 'Chingufo', 'Chipindo', 'Chissamba', 'Chitado', 'Chitembo', 'Coemba', 'Colui', 'Conda', 'Coutada',
                      'Cuangar', 'Cuango-Luzamba', 'Cuasa', 'Cubal', 'Cuchi', 'Cuilo', 'Cuima', 'Cuima', 'Cuimba', 'Cuito Cuanavale', 'Cuvelai', 'Dala',
                      'Damba', 'Didimbo', 'Dombe Grande', 'Dondo', 'Dongo', 'Dundo', 'Ekunha', 'Folgares', 'Funda', 'Gabela', 'Galo', 'Ganda', 'Golungo Alto',
                      'Guri', 'Huambo', 'Humpata', 'Jamba', 'Kuito', 'Leúa', 'Lobito', 'Lombe', 'Longa', 'Longonjo','Luacano', 'Luanda', 'Luau', 'Lubango', 'Lucala',
                      'Lucapa', 'Lucusse', 'Luena', 'Luiana', 'Luimbale', 'Luma Cassao', "Lumbala N'guimbo", 'Lumeje', 'Luremo', 'Luxilo', 'Lândana', 'Malanje',
                      'Malembo', 'Maludi', 'Marimba', 'Marimbanguengo', 'Massango', 'Matala', 'Mavinga', 'Mbanza-Congo', 'Menongue', 'Muchinda', 'Mucinda',
                      'Muconda', 'Mucumbo', 'Mucusso', 'Mucussueje', 'Muginga', 'Mulondo', 'Mungo', 'Munhango', 'Mussende', 'Musserra', 'Mussuco', "N'dalatando",
                      "N'zteo", 'Namacunde', 'Namibe', 'Negage', 'Nharea', 'Nóqui', 'Nzagi (Andrada)', 'Ondjiva', 'Pinheiro', 'Porto Amboim', 'Quela', 'Quibala',
                      'Quibaxe', 'Quicombo', 'Quilengues', 'Quimavongo', 'Quimbango', 'Quimbele', 'Quipungo', 'Quirima', 'Sacomar', 'Samunona', 'Saurimo',
                      'Savungo', 'Songo', 'Soyo', 'Sumbe', 'Tchindjenje', 'Tchipelongo', 'Techamutete', 'Tentativa', 'Tommbua', 'Uku', 'Ukuma', 'Uíge',
                      'Viana', 'Waku Kungo', 'Xangongo', 'Xá-Muteba'];
        break;
      case 'Antigua & Barbuda':
        this.cities = ['All Saints', 'Bolans', 'Carlisle', 'Clare Hall', 'Cedar Grove', 'Codrington', 'Dickenson Bay', 'English Harbour', 'Falmouth',
                      'Freetown', 'Jennings', 'Liberta', 'Old Road', 'Parham', 'Pigotts', "Potter's Village", "St. John's", 'Swetes', 'Willikies'];
        break;
      case 'Argentina':
        this.cities = ['Buenos Aires', 'Córdoba', 'Rosario','Mendoza', 'La Plata', 'Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia',
                      'Neuquén', 'Santiago del Estero', 'Corrientes', 'Avellaneda', 'Bahía Blanca', 'San Salvador de Jujuy', 'Quilmes', 'Lanús',
                      'Comodoro Rivadavia', 'Concordia'];
        break;
      case 'Armenia':
        this.cities = ['Yerevan', 'Gyumri', 'Vanadzor', 'Vagharshapat', 'Abovyan', 'Kapan', 'Hrazdan', 'Armavir', 'Artashat', 'Ijevan', 'Gavar', 'Goris',
                      'Charentsavan', 'Ararat', 'Masis', 'Artik', 'Sevan', 'Ashtarak', 'Dilijan', 'Sisian', 'Alaverdi', 'Stepanavan', 'Martuni',
                      'Spitak', 'Vardenis', 'Yeghvard', 'Vedi', 'Byureghavan', 'Nor Hachen', 'Metsamor', 'Berd', ' Yeghegnadzor', 'Tashir', 'Kajaran',
                      'Aparan', 'Vayk', 'Chambarak', 'Maralik', 'Noyemberyan', 'Talin', 'Jermuk', 'Meghri', 'Agarak', 'Ayrum', 'Akhtala', 'Tumanyan',
                      'Tsaghkadzor', 'Shamlugh', 'Dastakert'];
        break;
      case 'Australia':
        this.cities = ['Sydney', 'Albury', 'Armidale', 'Bathurst', 'Blue Mountains', 'Broken Hill', 'Campbelltown', 'Cessnock', 'Dubbo', 'Goulburn', 'Grafton',
                      'Lithgow', 'Liverpool', 'Newcastle', 'Orange', 'Parramatta', 'Penrith', 'Queanbeyan', 'Tamworth', 'Wagga Wagga', 'Wollongong'];
        break;
      case 'Austria':
        // TODO Austria
        break;
      case 'Azerbaijan':
        this.cities = ['Agdam', 'Agdash', 'Agjabadi', 'Agstafa', 'Agsu', 'Astara', 'Babek', 'Baku', 'Balakən', 'Barda', 'Beylagan', 'Bilasuvar',
                      'Dashkasan', 'Davachi', 'Fuzuli', 'Gadabay', 'Ganja', 'Goranboy', 'Goychay', 'Goygol', 'Hajigabul', 'Imishli', 'Ismailli',
                      'Jabrayil', 'Julfa', 'Kalbajar', 'Karabakh', 'Khachmaz', 'Khojavend', 'Khyrdalan', 'Kurdamir', 'Lankaran'];
        break;
      case 'Bahamas':
        this.cities = ['Nassau', 'Freeport', 'West End', 'Coopers Town', 'March Harbour', 'Freetown', ' high Rock', 'Andros Town', 'Spanish Wells',
                      'Clarence Town', 'Dunmore Town', 'Rock Sound', "Arthur's Town", 'Cockburn Town', 'George Town', 'Alice Town', 'Sweeting Cay',
                      'Matthew Town', 'Snug Corner', 'Great Harbour Cay', 'Nicholls Town', 'Colonel Hill', 'Pirates Well', 'Port Nelson', 'Duncan Town',
                      'Albert Town'];
        break;
      case 'Bahrain':
        this.cities = ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', "A'ali", 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah', 'Adilya',
                      'Sanabis', 'Tubli', 'Al Seef', 'Sar', 'Mahooz', 'Al Dur', 'Hoora', 'Gudaibiya'];
        break;
      case 'Bangladesh':
        this.cities = ['Bogra', 'Mymensingh', 'Jessore', 'Dinajpur', 'Nawabganj', 'Brahmanbaria', 'Tangail', 'Feni', 'Sirajganj', 'Pabna', 'Jamalpur',
                      'Faridpur', "Cox's Bazar", 'Noakhali', 'Kushtia'];
        break;
      case 'Barbados':
        this.cities = ['Saint Lucy', 'Saint Peter', 'Saint Andrews', 'Saint James', 'Saint Thomas', 'Saint Joseph', 'Saint Michael', 'Saint George',
                      'Saint John', 'Saint Philip', 'Christ Church'];
        break;
      case 'Belarus':
        break;
      case 'Belgium':
        break;
      case 'Belize':
        break;
      case 'Benin':
        break;
      case 'Bhutan':
        break;
      case 'Bolivia':
        break;
      case 'Bosnia & Herzegovina':
        break;
      case 'Botswana':
        break;
      case 'Brazil':
        break;
      case 'Brunei Darussalam':
        break;
      case 'Bulgaria':
        break;
      case 'Burkina Faso':
        break;
      case 'Burma (Myanmar)':
        break;
      case 'Burundi':
        break;
      case 'Cambodia':
        break;
      case 'Cameroon':
        break;
      case 'Canada':
        break;
      case 'Cape Verde':
        break;
      case 'Central African Republic':
        break;
      case 'Chad':
        break;
      case 'Chile':
        break;
      case 'China':
        break;
      case 'Colombia':
        break;
      case 'Comoros':
        break;
      case 'Congo':
        break;
      case 'Congo, Democratic Republic':
        break;
      case 'Costa Rica':
        break;
      case "Côte d'Ivoire":
        break;
      case 'Croatia':
        break;
      case 'Cyprus':
        break;
      case 'Czech Republic':
        break;
      case 'Denmark':
        break;
      case 'Djibouti':
        break;
      case 'Dominica':
        break;
      case 'Dominican Republic':
        break;
      case 'Ecuador':
        break;
      case 'East Timor':
        break;
      case 'Egypt':
        break;
      case 'El Salvador':
        break;
      case 'England':
        break;
      case 'Equatorial Guinea':
        break;
      case 'Eritrea':
        break;
      case 'Estonia':
        break;
      case 'Ethiopia':
        break;
      case 'Fiji':
        break;
      case 'Finland':
        break;
      case 'France':
        break;
      case 'Gabon':
        break;
      case 'Gambia':
        break;
      case 'Georgia':
        break;
      case 'Germany':
        break;
      case 'Ghana':
        break;
      case 'Greece':
        break;
      case 'Grenada':
        break;
      case 'Guatemala':
        break;
      case 'Guinea':
        break;
      case 'Guinea-Bissau':
        break;
      case 'Guyana':
        break;
      case 'Haiti':
        break;
      case 'Honduras':
        break;
      case 'Hungary':
        break;
      case 'Iceland':
        break;
      case 'India':
        break;
      case 'Indonesia':
        break;
      case 'Iran':
        break;
      case 'Iraq':
        break;
      case 'Ireland':
        break;
      case 'Israel':
        break;
      case 'Italy':
        break;
      case 'Jamaica':
        break;
      case 'Japan':
        break;
      case 'Jordan':
        break;
      case 'Kazakhstan':
        break;
      case 'Kenya':
        break;
      case 'Kiribati':
        break;
      case 'North Korea':
        break;
      case 'South Korea':
        break;
      case 'Kosovo':
        break;
      case 'Kuwait':
        break;
      case 'Kyrgyzstan':
        break;
      case 'Laos':
        break;
      case 'Latvia':
        break;
      case 'Lebanon':
        break;
      case 'Lesotho':
        break;
      case 'Liberia':
        break;
      case 'Libya':
        break;
      case 'Liechtenstein':
        break;
      case 'Lithuania':
        break;
      case 'Luxembourg':
        break;
      case 'Macedonia':
        break;
      case 'Madagascar':
        break;
      case 'Malawi':
        break;
      case 'Malaysia':
        break;
      case 'Maldives':
        break;
      case 'Mali':
        break;
      case 'Malta':
        break;
      case 'Marshall Islands':
        break;
      case 'Mauritania':
        break;
      case 'Mauritius':
        break;
      case 'Mexico':
        break;
      case 'Micronesia':
        break;
      case 'Moldova':
        break;
      case 'Monaco':
        break;
      case 'Mongolia':
        break;
      case 'Montenegro':
        break;
      case 'Morocco':
        break;
      case 'Mozambique':
        break;
      case 'Myanmar':
        break;
      case 'Namibia':
        break;
      case 'Nauru':
        break;
      case 'Nepal':
        break;
      case 'The Netherlands':
        break;
      case 'New Zealand':
        break;
      case 'Nicaragua':
        break;
      case 'Niger':
        break;
      case 'Nigeria':
        break;
      case 'Norway':
        break;
      case 'Northern Ireland':
        break;
      case 'Pakistan':
        break;
      case 'Palau':
        break;
      case 'Palestinian State':
        break;
      case 'Panama':
        break;
      case 'Papua New Guinea':
        break;
      case 'Paraguay':
        break;
      case 'Peru':
        break;
      case 'The Philippines':
        break;
      case 'Poland':
        break;
      case 'Portugal':
        break;
      case 'Qatar':
        break;
      case 'Romania':
        break;
      case 'Russia':
        break;
      case 'Rwanda':
        break;
      case 'St Kitts & Nevis':
        break;
      case 'St. Lucia':
        break;
      case 'St. Vincent & The Grenadines':
        break;
      case 'Samoa':
        break;
      case 'San Marino':
        break;
      case 'São Tomé & Príncipe':
        break;
      case 'Saudi Arabia':
        break;
      case 'Scotland':
        break;
      case 'Senegal':
        break;
      case 'Serbia':
        break;
      case 'Seychelles':
        break;
      case 'Sierra Leone':
        break;
      case 'Singapore':
        break;
      case 'Slovakia':
        break;
      case 'Slovenia':
        break;
      case 'Solomon Islands':
        break;
      case 'Somalia':
        break;
      case 'South Africa':
        break;
      case 'Spain':
        break;
      case 'Sir Lanka':
        break;
      case 'Sudan':
        break;
      case 'South Sudan':
        break;
      case 'Suriname':
        break;
      case 'Swaziland':
        break;
      case 'Sweden':
        break;
      case 'Switzerland':
        break;
      case 'Syria':
        break;
      case 'Taiwan':
        break;
      case 'Tajikistan':
        break;
      case 'Tanzania':
        break;
      case 'Thailand':
        break;
      case 'Togo':
        break;
      case 'Tonga':
        break;
      case 'Trinidad & Tobago':
        break;
      case 'Tunisia':
        break;
      case 'Turkey':
        break;
      case 'Turkmenistan':
        break;
      case 'Tuvalu':
        break;
      case 'Uganda':
        break;
      case 'Ukraine':
        break;
      case 'United Arab Emirates':
        break;
      case 'United States':
        break;
      case 'Uruguay':
        break;
      case 'Uzbekistan':
        break;
      case 'Vanuatu':
        break;
      case 'Vatican City':
        break;
      case 'Venezuela':
        break;
      case 'Vietnam':
        break;
      case 'Western Sahara':
        break;
      case 'Wales':
        break;
      case 'Yemen':
        break;
      case 'Zaire':
        break;
      case 'Zambia':
        break;
      case 'Zimbabwe':
        break;
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
}
