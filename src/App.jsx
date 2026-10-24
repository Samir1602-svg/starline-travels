import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, Car, Calendar, MapPin, 
  ShieldCheck, Star, Users, CheckCircle, Clock, 
  ChevronRight, ArrowRight, X, UserPlus, Database, 
  Sparkles, Navigation, Lock, Settings, Edit3, Compass,
  Luggage, Fuel, Award, Languages, Crosshair, HeartHandshake,
  ArrowUpDown, BadgePercent, Camera, Info, CloudSnow, Sun, AlertTriangle, FileText, Image as ImageIcon, Map
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// BRAND LOGO LINKED TO /logo/brandlogo.jpeg
const StarLineLogo = ({ className = "w-12 h-12" }) => (
  <img 
    src="/logo/brandlogo.jpeg" 
    alt="Star Line Travels Logo" 
    className={`${className} object-contain rounded-full`}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "/logo/brandlogo.png";
    }}
  />
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [tourCategoryFilter, setTourCategoryFilter] = useState('all');
  const [itineraryLang, setItineraryLang] = useState('hinglish');
  
  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Rates State
  const [rates, setRates] = useState({
    sedan: 12,
    suv: 15,
    crysta: 19,
    tempo: 26,
    driverAllowance: 500,
    oneWaySurchargeRatio: 1.65
  });

  const [modalVehicle, setModalVehicle] = useState('suv');

  // Booking Form State
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [tripType, setTripType] = useState('round-trip');
  const [date, setDate] = useState('');
  const [carType, setCarType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Unified Location Hubs
  const allLocations = [
    { label: 'Delhi NCR (Burari Main Hub / Outer Ring Rd)', type: 'pickup', km: 0 },
    { label: 'Delhi IGI Airport (Terminal 3 Chauffeur Lane)', type: 'pickup', km: 25 },
    { label: 'Delhi IGI Airport (Terminal 1 Domestic)', type: 'pickup', km: 22 },
    { label: 'New Delhi Railway Station (NDLS Ajmeri Gate)', type: 'pickup', km: 15 },
    { label: 'Old Delhi Railway Station (Chandni Chowk)', type: 'pickup', km: 12 },
    { label: 'Kashmere Gate ISBT Chauffeur Pick Area', type: 'pickup', km: 10 },
    { label: 'Anand Vihar ISBT / Kaushambi Border', type: 'pickup', km: 20 },
    { label: 'Rohini (Sector 18 / Rithala Metro Hub)', type: 'pickup', km: 10 },
    { label: 'South Delhi (Saket / Hauz Khas / Nehru Place)', type: 'pickup', km: 28 },
    { label: 'Gurgaon (Cyber City / IFFCO Chowk)', type: 'pickup', km: 45 },
    { label: 'Noida (Sector 18 / Sector 62)', type: 'pickup', km: 35 },
    { label: 'Ghaziabad (Mohan Nagar / Vaishali)', type: 'pickup', km: 25 },
    { label: 'Khatu Shyam Ji (Toran Dwar VIP Parking, Sikar)', km: 310, cat: 'dharmik' },
    { label: 'Salasar Balaji Mandir (Shri Balaji Dham)', km: 340, cat: 'dharmik' },
    { label: 'Mathura & Vrindavan (Prem Mandir / Bankey Bihari)', km: 180, cat: 'dharmik' },
    { label: 'Govardhan Parikrama (Dan Ghati Mandir Parking)', km: 210, cat: 'dharmik' },
    { label: 'Haridwar (Har Ki Pauri Alaknanda Ghat Parking)', km: 230, cat: 'dharmik' },
    { label: 'Rishikesh (Triveni Ghat / Shivpuri Base)', km: 260, cat: 'dharmik' },
    { label: 'Char Dham Yatra (Kedarnath, Badrinath, Gangotri, Yamunotri)', km: 1650, cat: 'dharmik' },
    { label: 'Do Dham Yatra (Kedarnath & Badrinath Special)', km: 1150, cat: 'dharmik' },
    { label: 'Vaishno Devi Katra (Banganga Gate Base, J&K)', km: 640, cat: 'dharmik' },
    { label: 'Ayodhya Dham (Shri Ram Janmabhoomi Teerth)', km: 680, cat: 'dharmik' },
    { label: 'Amritsar (Golden Temple Heritage Walk Drop)', km: 460, cat: 'dharmik' },
    { label: 'Neemrana Fort Palace (Expressway Heritage Gate)', km: 130, cat: 'budget' },
    { label: 'Agra (Taj Mahal Shilpgram East Gate Parking)', km: 230, cat: 'budget' },
    { label: 'Lansdowne (Gandhi Chowk Hill Base, Uttarakhand)', km: 260, cat: 'budget' },
    { label: 'Nainital (Tallital Bus Stand / Lower Mall Road)', km: 320, cat: 'holiday' },
    { label: 'Nainital (Mallital Rickshaw Stand / Upper Town)', km: 325, cat: 'holiday' },
    { label: 'Jim Corbett National Park (Ramnagar Safari Hub)', km: 250, cat: 'holiday' },
    { label: 'Mussoorie (Library Chowk / Picture Palace Drop)', km: 290, cat: 'holiday' },
    { label: 'Manali (Private Volvo Bus Stand / Mall Road)', km: 540, cat: 'holiday' },
    { label: 'Shimla (Town Lift / Circular Cart Road Chauffeur Point)', km: 360, cat: 'holiday' },
    { label: 'Dharamshala & McLeodganj (Dalai Lama Temple)', km: 490, cat: 'holiday' },
    { label: 'Jaipur (Sindhi Camp / Amer Fort Parking)', km: 270, cat: 'holiday' },
    { label: 'Udaipur (City Palace / Lake Pichola Stand)', km: 660, cat: 'holiday' },
    { label: 'Pushkar & Ajmer Sharif Dargah', km: 410, cat: 'holiday' }
  ];

  // Helper check: Is location inside Delhi NCR?
  const isDelhiNCR = (locStr) => {
    if (!locStr) return true; // Default assumption for Delhi NCR starting point
    const found = allLocations.find(l => l.label === locStr);
    if (found) return found.type === 'pickup';
    return locStr.includes('Delhi') || locStr.includes('GPS Pin') || locStr.includes('Noida') || locStr.includes('Gurgaon') || locStr.includes('Ghaziabad');
  };

  const isPickupInDelhi = isDelhiNCR(pickup);

  // Filter Drop options dynamically based on Pickup location
  const filteredDropLocations = allLocations.filter(loc => {
    if (!pickup) return true;
    if (isPickupInDelhi) {
      return loc.type !== 'pickup'; // If pickup is Delhi NCR, destination must be Outstation
    } else {
      return loc.type === 'pickup'; // If pickup is Outstation, destination must be Delhi NCR
    }
  });

  const handleSwapLocations = () => {
    const tempPickup = pickup;
    const tempDrop = drop;
    setPickup(tempDrop);
    setDrop(tempPickup);
  };

  const [selectedTour, setSelectedTour] = useState(null);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sharma Family', phone: '9811234567', pickup: 'Burari Delhi', drop: 'Char Dham Yatra', car: 'Ertiga SUV', fare: 32500, type: 'Round-Trip' },
    { id: 2, name: 'John Miller (Tourist)', phone: '9871098765', pickup: 'IGI Airport T3', drop: 'Agra Taj Mahal & Jaipur', car: 'Innova Crysta', fare: 14500, type: 'Round-Trip' }
  ]);
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Mukesh Sharma', phone: '9910099887', car: 'Maruti Ertiga 2024', base: 'Burari, Delhi', status: 'Verified' },
    { id: 2, name: 'Sukhvinder Singh', phone: '9810112233', car: 'Innova Crysta 2023', base: 'Rohini, Delhi', status: 'Approved' }
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/leads`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setLeads(data); })
      .catch(err => console.log("Error loading leads:", err));

    fetch(`${API_BASE}/api/drivers`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setDrivers(data); })
      .catch(err => console.log("Error loading drivers:", err));

    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && Object.keys(data).length > 0) {
          setRates({
            sedan: data.sedan ?? 12,
            suv: data.suv ?? 15,
            crysta: data.crysta ?? 19,
            tempo: data.tempo ?? 26,
            driverAllowance: data.driver_allowance ?? 500,
            oneWaySurchargeRatio: data.oneway_ratio ?? 1.65
          });
        }
      })
      .catch(err => console.log("Error loading rates:", err));
  }, []);

  const handleRateUpdate = async (updatedRates) => {
    setRates(updatedRates);
    try {
      await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sedan: updatedRates.sedan,
          suv: updatedRates.suv,
          crysta: updatedRates.crysta,
          tempo: updatedRates.tempo,
          driver_allowance: updatedRates.driverAllowance,
          oneway_ratio: updatedRates.oneWaySurchargeRatio
        })
      });
    } catch (err) {
      console.error("Rates save failed:", err);
    }
  };
  
  const [driverForm, setDriverForm] = useState({
    driver_name: '',
    phone: '',
    car_model: 'Maruti Ertiga',
    car_year: 2024,
    commercial_number: '',
    base_location: 'Burari / North Delhi',
    preferred_routes: 'All Routes'
  });

  // OUR FLEET - CONNECTED TO /cabs FOLDER
  const fleetData = [
    {
      id: 'sedan',
      name: 'Sedan (Maruti Dzire / Hyundai Aura)',
      modelDesc: 'Commercial Sedan with high fuel mileage & luggage boot',
      rate: rates.sedan,
      seats: '4 Passengers + 1 Driver',
      luggage: '2 Big Suitcases + 2 Handbags',
      ac: 'Dual Climate Control AC',
      idealFor: 'Couples, small families, airport transit & budget highway drives',
      img: '/cabs/sedan.png',
      tag: 'Best Economy Fare'
    },
    {
      id: 'suv',
      name: 'SUV (Maruti Suzuki Ertiga)',
      modelDesc: 'Spacious 6-7 Seater with Roof Carrier for extra luggage',
      rate: rates.suv,
      seats: '6 Passengers + 1 Driver',
      luggage: 'Heavy Duty Roof Carrier + Boot Space',
      ac: 'Independent Roof AC Blower Vents for All 3 Rows',
      idealFor: 'Family Tirth Yatra & Hill tours with maximum comfort',
      img: '/cabs/ertiga.png',
      tag: 'Family Favorite'
    },
    {
      id: 'crysta',
      name: 'Toyota Innova Crysta VIP',
      modelDesc: 'Premium 7-Seater Captain Seat Luxury Configuration',
      rate: rates.crysta,
      seats: '7 Luxury Captain Seats',
      luggage: 'Large Trunk Capacity + Mountain Carrier',
      ac: 'Multi-Zone Digital Climate Control',
      idealFor: 'Elderly family members & foreign delegations requiring supreme shock absorption',
      img: '/cabs/innova.png',
      tag: 'Executive Luxury'
    },
    {
      id: 'tempo',
      name: 'Force Urbania / Luxury Tempo Traveller',
      modelDesc: '12 / 16 / 20 Seater Pushback Recliner Coach',
      rate: rates.tempo,
      seats: '12-20 Passengers + Crew',
      luggage: 'Dedicated Rear Luggage Deck',
      ac: 'Individual Passenger Air Vents & Audio-Video Setup',
      idealFor: 'Entire extended family joint pilgrimage tours & group vacations',
      img: '/cabs/tempo.png',
      tag: 'Joint Family & Sangha'
    }
  ];

  // 15 ROAD TRIPS - CONNECTED TO /tours FOLDER AND SIGHTSEEING AS TEXT ONLY
  const [toursList, setToursList] = useState([
    {
      id: 'chardham',
      category: 'dharmik',
      badge: 'Maha Pavitra Yatra',
      title: 'Complete Uttarakhand Char Dham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath)',
      duration: '9 Nights / 10 Days',
      km: 1650,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: May to June (Spring Opening) & Sept to Oct (Autumn Clear Skies). Snow and road closures in deep winter (Nov-April). Avoid July-August peak monsoon landslides.',
      mainImg: '/tours/chardham.png',
      spots: [
        'Yamunotri Dham Temple & Surya Kund Holy Hot Spring',
        'Gangotri Dham Shrine on Holy Bhagirathi River',
        'Kedarnath Temple & Himalayan Snow Glaciers',
        'Badrinath Badri Vishal Mandir & Tapt Kund',
        'Mana Village - First Village of India & Saraswati River Origin'
      ],
      howToEnjoy: 'Char Dham represents the ultimate spiritual cleansing in Sanatan Dharma. Start early each morning to beat high mountain traffic. At Yamunotri, cook raw rice tied in cloth inside the natural boiling water of Surya Kund as sacred Prasad. At Kedarnath, attend the evening Shiva Aarti amidst the cold mountain winds; the energy when temple bells echo against the snow peaks is unforgettable. In Badrinath, take a purifying dip in Tapt Kund hot springs before morning Darshan. Visit Mana to sip tea at India\'s last tea stall and see the mystical Saraswati river emerging from rock caves. Our chauffeurs take care of all vehicle permits, mountain green taxes, and assist senior family members with registered pony/palki allocations at Sonprayag and Janki Chatti.',
      en: {
        overview: 'The supreme spiritual journey of Hinduism across the Garhwal Himalayas. Doorstep Delhi NCR pickup with verified, patient mountain chauffeurs trained for safe high-altitude driving.',
        timeline: [
          { time: 'Day 1-2', heading: 'Delhi to Barkot & Holy Yamunotri Pilgrimage', desc: 'Doorstep departure via Mussoorie bypass. Arrival at Barkot base. Next morning ascent from Janki Chatti to Yamunotri Dham for sacred darshan and hot sulphur spring bath.' },
          { time: 'Day 3-4', heading: 'Barkot to Uttarkashi & Sacred Gangotri Temple', desc: 'Drive alongside scenic Bhagirathi gorge. Visit historic Kashi Vishwanath temple in Uttarkashi, proceeding to Gangotri Dham for holy Ganga Snan and Puja.' },
          { time: 'Day 5-7', heading: 'Guptkashi, Sonprayag & Shri Kedarnath Ji Excursion', desc: 'Chauffeur assists with Sonprayag parking and Gaurikund transfer. Holy helicopter/trek to Kedarnath Ji for sunset Aarti, overnight divine stay, and safe morning descent.' },
          { time: 'Day 8-9', heading: 'Joshimath, Badrinath Temple & Mana Frontier Exploration', desc: 'Scenic ascent past Chopta/Mandal to Badrinath Dham. Attend evening Maha Aarti at temple. Visit sacred Vyas Gufa and Saraswati River Origin in Mana Village.' },
          { time: 'Day 10', heading: 'Devprayag Holy Confluence & Safe Return to Delhi', desc: 'Passing the holy confluence of Alaknanda & Bhagirathi at Devprayag. Evening descent into Delhi NCR with comfortable doorstep drop.' }
        ],
        suggestion: 'Elderly Pilgrimage Care: We provide dedicated driver assistance at high-traffic base camps (Janki Chatti & Sonprayag) to coordinate ponies, doli, and battery vehicles for senior citizens.'
      },
      hi: {
        overview: 'Hindu dharam ki sarvochha tirth yatra. Charo Dhamo (Yamunotri, Gangotri, Kedarnath, Badrinath) ke divya darshan ke liye verified hill drivers aur oxygen safety kit ke sath safe parivarik yatra.',
        timeline: [
          { time: 'Day 1-2', heading: 'Delhi se Barkot & Yamunotri Ji Pavitra Snan', desc: 'Subah Delhi doorstep pickup. Mussoorie bypass se Barkot arrival. Agle din Janki Chatti se palki ya paidal Yamunotri Dham darshan aur Surya Kund snan.' },
          { time: 'Day 3-4', heading: 'Barkot se Uttarkashi & Gangotri Dham Pujan', desc: 'Bhagirathi nadi ke kinare picturesque pahadi safar. Uttarkashi Vishwanath mandir darshan ke baad pavitra Gangotri Dham me Ganga pujan.' },
          { time: 'Day 5-7', heading: 'Guptkashi, Sonprayag & Baba Kedar Darshan', desc: 'Sonprayag tak cab drop karegi. Baba Kedar ke darshan trek ya helicopter dwara, shaam ki Maha Aarti aur aashirwad prapti.' },
          { time: 'Day 8-9', heading: 'Badrinath Dham, Tapt Kund & Mana Gaon', desc: 'Joshimath hote hue Badrinath Dham. Tapt Kund snan, darshan aur Bharat ke pehle gao Mana me Vyas Gufa visit.' },
          { time: 'Day 10', heading: 'Devprayag Sangam Darshan & Delhi Wapsi', desc: 'Alaknanda-Bhagirathi pavitra sangam par rukte hue shaam tak Delhi doorstep drop.' }
        ],
        suggestion: 'Parivar ke liye Sujhav: Char Dham yatra me buzurgo ke aaram ke mutabiq drive hoti hai. Car me mountain sickness kit aur warm blankets hamesha ready milte hain.'
      }
    },
    {
      id: 'dodham',
      category: 'dharmik',
      badge: 'Kedar-Badri Special',
      title: 'Do Dham Yatra (Kedarnath & Badrinath Express Pilgrimage)',
      duration: '5 Nights / 6 Days',
      km: 1150,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: May to June & September to November (Crisp mountain air, clear views, zero landslide delays).',
      mainImg: '/tours/dodham.png',
      spots: [
        'Shri Kedarnath Ji Temple & Himalayan Glaciers',
        'Badrinath Badri Vishal Temple & Tapt Kund Hot Spring',
        'Guptkashi Ancient Kashi Vishwanath Temple',
        'Joshimath Shankaracharya Math & Narsingh Mandir',
        'Devprayag Divine Alaknanda & Bhagirathi Confluence'
      ],
      howToEnjoy: 'Focused spiritual expedition covering Lord Shiva at Kedarnath and Lord Vishnu at Badrinath without extended 10-day leave. Start early to reach Guptkashi base. Sonprayag transfer to trek or fly by helicopter to Kedarnath Ji. Spend the night near the temple for early morning darshan, and cross Chopta meadows toward Badrinath.',
      en: {
        overview: 'Focused spiritual expedition covering Lord Shiva at Kedarnath and Lord Vishnu at Badrinath without extended 10-day leave.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi NCR to Guptkashi / Sitapur Base', desc: 'Early morning start via Meerut Expressway. Overnight stay at Guptkashi.' },
          { time: 'Day 2-3', heading: 'Kedarnath Darshan & Sacred Mountain Descent', desc: 'Sonprayag transfer. Trek or helicopter to Kedarnath, evening Aarti, and safe descent.' },
          { time: 'Day 4', heading: 'Guptkashi to Badrinath via Chopta Route', desc: 'Ascent past lush meadows of Chopta. Evening arrival at Badrinath and temple Darshan.' },
          { time: 'Day 5-6', heading: 'Mana Village & Delhi NCR Return', desc: 'Morning visit to Mana village, followed by smooth highway descent to your home.' }
        ],
        suggestion: 'Chauffeur Tip: Pre-book helicopter tickets or registered pony tokens at Phata/Sonprayag for elderly family convenience.'
      },
      hi: {
        overview: 'Baba Kedar aur Badri Vishal ke divya darshan kam dino me. Parivar ke buzurgo ke sath bina kisi tension ke door-to-door cab suvidha.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi se Guptkashi Highway Drive', desc: 'Subah start. Rishikesh aur Srinagar Garhwal hote hue Guptkashi base camp par aaram.' },
          { time: 'Day 2-3', heading: 'Shri Kedarnath Ji Pavitra Darshan', desc: 'Sonprayag drop, trek ya heli dwara Baba Kedar darshan aur shaam ki divine Aarti.' },
          { time: 'Day 4', heading: 'Guptkashi se Badrinath Dham', desc: 'Chopta ke sundar pahado se hote hue Badrinath. Tapt Kund snan aur Badri Vishal darshan.' },
          { time: 'Day 5-6', heading: 'Mana Gaon Darshan & Delhi Wapsi', desc: 'Vyas Gufa visit aur shaam tak Delhi doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Buzurgo ke liye Sonprayag par battery car aur registered doli suvidha timely arrange hoti hai.'
      }
    },
    {
      id: 'manali',
      category: 'holiday',
      badge: 'Snow & Adventure',
      title: 'Delhi to Manali, Solang Valley & Atal Tunnel Expedition',
      duration: '3 Nights / 4 Days',
      km: 1100,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: Dec to Feb for live snowfall, frozen waterfalls & snowboarding at Solang; April to June for lush green mountain escapes, paragliding & Beas river rafting.',
      mainImg: '/tours/manali.png',
      spots: [
        'Solang Valley Snow Sports Hub & Skiing Arena',
        'Atal Tunnel North Portal & Sissu Glacial Waterfall',
        'Hadimba Devi Ancient Pine Forest Sanctuary',
        'Old Manali Artistic Cafes & Beas Riverside',
        'Kullu White-Water River Rafting Launchpad'
      ],
      howToEnjoy: 'Manali is a playground for nature lovers and thrill seekers. On your first evening, relax with authentic trout fish and wood-fired pizzas in the artistic cafes of Old Manali alongside the gushing Manalsu river. The next morning, head through the 9.02 km marvel of Atal Tunnel into Lahaul Valley. As soon as you emerge at the North Portal, the landscape transforms into massive snow-clad Tibetan-style mountains. Visit Sissu to photograph the frozen glacial waterfall and take a thrilling snow-scooter ride. On your way back, stop at Kullu for a thrilling 14-km Grade-III white water rafting expedition across the Beas. Our chauffeurs hold verified mountain driving badges and carry anti-skid tire snow chains for zero winter hassle.',
      en: {
        overview: 'North India\'s most celebrated mountain road journey via the Kiratpur-Manali four-lane expressway. Highlights include snow adventures at Atal Tunnel and river rafting in Kullu.',
        timeline: [
          { time: 'Day 1', heading: 'Overnight Expressway Drive from Delhi NCR to Manali', desc: 'Evening doorstep pickup. Smooth cruising over the 4-lane expressway with verified sanitized dining breaks.' },
          { time: 'Day 2', heading: 'Arrival, Hadimba Temple & Mall Road Cafes', desc: 'Morning hotel check-in. Visit ancient Hadimba Devi pine sanctuary, sulphur springs, and evening stroll on Mall Road.' },
          { time: 'Day 3', heading: 'Solang Valley Skiing & Atal Tunnel into Lahaul', desc: 'Full-day excursion to Solang Valley snow park and through the Atal Tunnel into Sissu for frozen waterfalls and snow peaks.' },
          { time: 'Day 4', heading: 'Kullu River Rafting & Scenic Return to Delhi', desc: 'Morning river rafting in Kullu valley, local authentic shawl shopping, and safe return drive to Delhi NCR doorstep.' }
        ],
        suggestion: 'Snow Driving Advisory: During peak winter (Dec-Feb), mountain roads can be icy. Our vehicles carry snow tire chains and drivers are hill-certified.'
      },
      hi: {
        overview: 'Kiratpur expressway se Manali ka thrilling pahadi safar. Atal Tunnel, Solang Valley barf ke sports aur Kullu river rafting ka complete package.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi NCR se Manali (Overnight Highway Drive)', desc: 'Sham ko doorstep pickup. Kiratpur expressway se smooth pahadi chadhai aur swadisht khana stops.' },
          { time: 'Day 2', heading: 'Manali Arrival, Hadimba Temple & Mall Road', desc: 'Subah hotel check-in aur rest. Hadimba Devi Temple, Vashisht Kund aur shaam ko Mall Road par cafe hopping.' },
          { time: 'Day 3', heading: 'Solang Valley Snow Sports & Atal Tunnel Crossing', desc: 'Solang Valley me skiing aur snow fun. Atal Tunnel paar karke Sissu Lahaul Valley me waterfalls dekhna.' },
          { time: 'Day 4', heading: 'Kullu River Rafting & Wapsi Delhi', desc: 'Subah Kullu me white-water river rafting aur shaam ko Delhi doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: December se February ke dauran Atal Tunnel par heavy snow hoti hai. Hamare drivers snow-chain certified hote hain.'
      }
    },
    {
      id: 'shimla',
      category: 'holiday',
      badge: 'Queen of Hills',
      title: 'Delhi to Shimla & Kufri Colonial Hill Retreat',
      duration: '2 Nights / 3 Days',
      km: 720,
      bestCar: 'Sedan / Maruti Ertiga SUV',
      season: 'Best Season: Dec to Feb for winter snowfall at Kufri; April to June for pleasant 20°C summer escape.',
      mainImg: '/tours/shimla.png',
      spots: [
        'The Ridge & Neo-Gothic Christ Church Shimla',
        'Kufri Snow Viewpoint & Alpine Horse Trails',
        'Jakhoo Hill 108-foot Lord Hanuman Statue & Cable Car',
        'Mall Road Heritage Bakeries & Wooden Toy Markets',
        'Viceregal Lodge (British Colonial Rashtrapati Niwas)'
      ],
      howToEnjoy: 'Drive smoothly through the Himalayan Expressway. Spend your afternoon strolling through The Ridge and taking classic photos in front of the neo-gothic Christ Church. Sip hot chocolate at heritage bakeries on Mall Road. The next morning, drive 16 km up to Kufri for horseback trails and panoramic Himalayan snow viewpoints. Take the Jakhoo Ropeway up to the highest peak for panoramic views and visit the 108-foot Hanuman statue. Tour the historic Viceregal Lodge to marvel at British architectural history before a relaxed drive back down to Delhi.',
      en: {
        overview: 'Crisp pine breezes, colonial heritage, and snowy peaks. Comfortable doorstep cab service directly to Shimla town lift.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi to Shimla via Himalayan Expressway', desc: 'Doorstep pickup, scenic hill drive past Timber Trail, evening hotel check-in and Ridge walk.' },
          { time: 'Day 2', heading: 'Kufri Snow Adventure & Jakhoo Hill Temple', desc: 'Excursion to Kufri alpine viewpoint, cable car to Jakhoo Hanuman temple and evening cafe dining.' },
          { time: 'Day 3', heading: 'Viceregal Lodge & Scenic Return to Delhi', desc: 'Visit historic British colonial lodge and enjoy relaxed highway cruise back to Delhi NCR.' }
        ],
        suggestion: 'Chauffeur Tip: Shimla town has pedestrian-only zones. Our chauffeurs assist you with drop points right by the town lift.'
      },
      hi: {
        overview: 'Thandi pahadi hawa, British daur ki colonial building aur Kufri ki barf. Parivar ke sath relaxing hill road trip.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi se Shimla Himalayan Expressway', desc: 'Subah pickup. Timber trail cross karte hue shaam tak Shimla hotel check-in aur Mall Road walk.' },
          { time: 'Day 2', heading: 'Kufri Snow Excursion & Jakhoo Temple', desc: 'Kufri barf view point, ropeway se Jakhoo mandir darshan aur shaam ko the Ridge par walk.' },
          { time: 'Day 3', heading: 'Viceregal Lodge & Delhi Wapsi', desc: 'Aitihasik Viceregal Lodge visit aur shaam tak Delhi safe doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Driver aapko Mall Road lift ke nazdeek drop karega taaki paidal kam chalna pade.'
      }
    },
    {
      id: 'nainital',
      category: 'holiday',
      badge: 'Lake District Hills',
      title: 'Delhi to Nainital (Tallital/Mallital) & Corbett Getaway',
      duration: '2 Nights / 3 Days',
      km: 660,
      bestCar: 'Sedan / Maruti Ertiga SUV',
      season: 'Best Season: March to June (Cool lake breezes) & Dec to Jan (Winter chill & quiet snow views).',
      mainImg: '/tours/nainnital.png',
      spots: [
        'Naini Lake & Yacht Boating (Tallital Stand)',
        'Maa Naina Devi Shaktipeeth & Tibetan Bazaar',
        'Snow View Himalayan Overlook via Aerial Ropeway',
        'Bhimtal Island Lake & Pine Forest Shoreline',
        'Jim Corbett National Park Safari Hub & Corbett Waterfalls'
      ],
      howToEnjoy: 'Leave Delhi early via the Moradabad bypass. Arrive at Tallital in the afternoon and take a quiet paddle boat ride across the eye-shaped Naini lake while surrounded by misty mountain ridges. Seek blessings at the historic Naina Devi Temple and shop for Tibetan silver jewelry and colorful handcrafted candles in the local market. The next morning, take the cable car ropeway up to Snow View Point for a panoramic spectacle of the Trishul and Nanda Devi peaks. Spend your afternoon driving to Bhimtal for lakeside dining. Our drivers coordinate with your hotel on Mall Road to ensure your luggage is transferred smoothly despite local evening vehicle restrictions.',
      en: {
        overview: 'Direct doorstep drop to Tallital bus stand or Mallital upper hotel. Complete tour of Naini lake, Bhimtal, Naukuchiatal, and Jim Corbett wilderness.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi NCR to Nainital (Tallital Lake Arrival)', desc: 'Early morning start via Moradabad bypass. Scenic ascent through Kathgodam. Drop at Tallital / Mallital hotel. Evening peaceful boating on Naini Lake.' },
          { time: 'Day 2', heading: 'Lake Tour (Bhimtal, Naukuchiatal) & Snow View', desc: 'Morning scenic tour of Bhimtal island, pine forests, and cable car ropeway to Snow View Himalayan overlook.' },
          { time: 'Day 3', heading: 'Corbett Falls Excursion & Return to Delhi NCR', desc: 'Leisurely checkout, visit Corbett Waterfalls on the descent, and return to Delhi by 9:00 PM.' }
        ],
        suggestion: 'Local Drop Advisory: Nainital Mall Road restricts vehicles from 6 PM to 9 PM. We coordinate with your hotel in advance for luggage transfer from Tallital.'
      },
      hi: {
        overview: 'Naini jheel, thandi pahadi hawa aur boating. Tallital aur Mallital ke door-to-door drop ke sath Bhimtal aur Jim Corbett ka shandar pahadi vacation.',
        timeline: [
          { time: 'Day 1', heading: 'Moradabad Bypass se Nainital (Tallital Drop)', desc: 'Subah early pickup. Kathgodam pahad chadhkar dopahar tak Nainital hotel check-in. Shaam ko Naini Lake me boating.' },
          { time: 'Day 2', heading: 'Bhimtal, Sattal & Snow View Ropeway', desc: 'Subah Bhimtal lake tour. Dopahar me ropeway se Snow View Point par Himalaya ki barfeeli chotiyon ka nazara.' },
          { time: 'Day 3', heading: 'Corbett Falls & Delhi Wapsi', desc: 'Subah checkout, raaste me Corbett Falls visit aur shaam tak Delhi doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Shaam 6 se 9 baje Mall Road par commercial gaadiyan band hoti hain. Hamare drivers Tallital stand par timely drop coordinate karte hain.'
      }
    },
    {
      id: 'jaipur',
      category: 'holiday',
      badge: 'Royal Heritage Gateway',
      title: 'Delhi to Jaipur Pink City Forts & Palaces Heritage Tour',
      duration: '2 Days / 1 Night',
      km: 540,
      bestCar: 'Sedan (Dzire) / Ertiga SUV',
      season: 'Best Season: October to March (Delightful sunny days and cool regal evenings). Avoid extreme desert heat in May-June.',
      mainImg: '/tours/jaipur.png',
      spots: [
        'Amer Fort & Sheesh Mahal (Hilltop Jeep Ride)',
        'Hawa Mahal 953-Casement Wind Palace',
        'Jal Mahal Architectural Floating Palace Stop',
        'City Palace Museum & Jantar Mantar Equinoctial Sundial',
        'Chokhi Dhani Traditional Rajasthani Cultural Village'
      ],
      howToEnjoy: 'Cruising on the new Delhi-Mumbai Expressway cuts travel time down to just 3.5 hours. Start with a morning Jeep climb into the majestic Amer Fort to witness the Sheesh Mahal (mirror palace). At lunchtime, head to the walled city for authentic Pyaaz Kachori and Dal Baati Churma at LMB in Johari Bazaar. Don\'t miss sunset tea at the rooftop cafes facing the honeycomb facade of Hawa Mahal. In the evening, visit Chokhi Dhani for Rajasthani folk dances, puppet shows, and a feast served with pure ghee on leaf platters. Our driver stays with you throughout your city exploration so you never have to haggle with local rickshaws.',
      en: {
        overview: 'Experience Rajasthan\'s Pink City via the high-speed Delhi-Mumbai Expressway. Reach Jaipur in under 3.5 hours for fort exploration and authentic royal cuisine.',
        timeline: [
          { time: 'Day 1', heading: 'Expressway Cruise, Amer Fort & Chokhi Dhani', desc: '6:00 AM prompt pickup. Arrive in Jaipur by 9:30 AM via expressway. Guided visit to Amer Fort (Jeep ascent), photo stop at Jal Mahal, and evening ethnic dinner at Chokhi Dhani.' },
          { time: 'Day 2', heading: 'City Palace, Hawa Mahal, Johari Bazaar & Return', desc: 'Morning exploration of City Palace and iconic Hawa Mahal architecture. Shopping for blue pottery and sweets at Johari Bazaar. 5:00 PM departure for Delhi with arrival by 9:00 PM.' }
        ],
        suggestion: 'Chauffeur Tip: We guide you through the dedicated bypass lanes to avoid Old City traffic jams during busy wedding seasons.'
      },
      hi: {
        overview: 'Naye Delhi-Mumbai Expressway se Jaipur ab sirf 3.5 ghante ki doori par hai. Weekend royal road trip jisme Amer Fort, royal palaces aur traditional Rajasthani food ka anand lein.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi se Amer Fort, Jal Mahal & Chokhi Dhani', desc: 'Subah 6:00 AM pickup. Fast expressway se 10 AM tak Jaipur entry. Amer Fort (jeep ride), Jal Mahal aur shaam ko Chokhi Dhani traditional culture aur dinner.' },
          { time: 'Day 2', heading: 'City Palace, Hawa Mahal, Johari Bazaar & Return', desc: 'Subah City Palace aur Hawa Mahal visit. Johari Bazaar me authentic handicraft aur sweets shopping. Shaam 5:00 PM Delhi ke liye departure, raat 9:00 PM tak doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Highway par car Fastag enabled hoti hai taaki toll par koi line na lagani pade. Same cab pure tour me aapke sath rehti hai.'
      }
    },
    {
      id: 'agra',
      category: 'budget',
      badge: 'World Wonder Day Tour',
      title: 'Delhi to Agra Taj Mahal, Red Fort & Mathura Pilgrimage',
      duration: '1 Full Day Express (14 Hours)',
      km: 460,
      bestCar: 'Sedan (Dzire) / Innova Crysta',
      season: 'Best Season: October to March (Comfortable walking weather for marble monuments). Taj Mahal is CLOSED on Fridays!',
      mainImg: '/tours/agra.png',
      spots: [
        'The Taj Mahal (East Gate Shilpgram Battery Cart Access)',
        'Agra Fort Red Sandstone Mughal Citadel',
        'Mathura Shri Krishna Janmabhoomi Temple',
        'Vrindavan Prem Mandir Laser Musical Fountain Show',
        'Authentic Panchhi Petha Historical Market'
      ],
      howToEnjoy: 'Depart Delhi at 5:30 AM via the 6-lane Yamuna Expressway to arrive right as the morning light illuminates the ivory marble of the Taj Mahal. Enter through the East Gate (Shilpgram) where electric battery carts take you straight to the gate. Spend 2 hours admiring the intricate pietra dura marble inlays. Next, explore the grand courtyards of Agra Fort where Emperor Shah Jahan spent his final years gazing at the Taj. Taste authentic Mughlai lunch, pack world-famous Agra Angoori Petha, and on the return drive, stop at Vrindavan by 6:30 PM to experience the breathtaking colorful musical fountain lights at Prem Mandir. Arrive back home in Delhi by 10:30 PM without spending on overnight hotels.',
      en: {
        overview: 'High-speed day excursion via the Yamuna Expressway. Explore the Wonder of the World Taj Mahal, majestic Agra Fort, and visit Mathura-Vrindavan spiritual temples on your return.',
        timeline: [
          { time: 'Morning', heading: 'Yamuna Expressway & Taj Mahal Tour', desc: '5:30 AM departure from Delhi NCR. Glide over the Yamuna Expressway to arrive by 8:45 AM. Extensive tour of the Taj Mahal and Agra Fort.' },
          { time: 'Evening', heading: 'Mathura Vrindavan Temple Darshan & Return', desc: 'Authentic Agra Petha shopping. Return transit with an evening stopover at Vrindavan for the divine Prem Mandir musical fountain light show. Arrive in Delhi by 10:30 PM.' }
        ],
        suggestion: 'Day Trip Tip: Fridays Taj Mahal is closed. Our sedans and Crysta SUVs provide jerk-free high-speed cruising with Fastag pre-loaded.'
      },
      hi: {
        overview: 'Yamuna Expressway se super-fast same-day tour. Taj Mahal ka majestic view aur wapsi me Mathura-Vrindavan me Bankey Bihari aur Prem Mandir darshan.',
        timeline: [
          { time: 'Subah', heading: 'Taj Mahal & Agra Fort Sightseeing', desc: 'Subah 5:30 AM pickup. Smooth expressway se 3 ghante me Agra entry. Taj Mahal aur Red Fort ka historic tour.' },
          { time: 'Shaam', heading: 'Agra Petha Market & Vrindavan Prem Mandir', desc: 'Famous Panchhi Petha tasting. Wapsi me Vrindavan Prem Mandir light show aur Bankey Bihari darshan. Raat 10:30 PM tak safe doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Friday ko Taj Mahal band rehta hai! Same-day long drive ke liye Innova ya Sedan bilkul jerk-free rehti hai.'
      }
    },
    {
      id: 'khatu-salasar',
      category: 'dharmik',
      badge: 'Most Popular Tirth',
      title: 'Delhi to Khatu Shyam Ji & Salasar Balaji Yatra',
      duration: '2 Days / 1 Night (Or Same Day)',
      km: 680,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: October to March (Pleasant weather). Ekadashi festivals and Phalguna Mela feature grand celebrations.',
      mainImg: '/tours/khatu.png',
      spots: [
        'Khatu Shyam Ji Toran Dwar & Main Darshan Gate',
        'Shyam Kund Pavitra Snan Water Body',
        'Salasar Balaji Temple Complex (Savamani Prasad)',
        'Anjani Mata Mandir Salasar',
        'Kotputli Traditional Highway Highway Halts'
      ],
      howToEnjoy: 'Khatu Shyam Ji in Rajasthan is regarded as the \'Haare Ka Sahara\'. Start before dawn (5 AM) from Delhi NCR to reach Toran Dwar before midday. Take a holy dip at Shyam Kund, offer your Nishan (flag), and immerse yourself in the energetic chant of "Haare Ka Sahara, Baba Shyam Hamara". In the evening, sample Rajasthani churma and kachoris near the temple bazaar. The following morning, drive 1.5 hours to Salasar Balaji to seek Lord Hanuman\'s blessings, offer Savamani Prasad, and tie a holy coconut for wish fulfillment. Our drivers drop families directly at the designated VIP vehicle drop-points to ensure minimum walking for senior citizens.',
      en: {
        overview: 'Direct doorstep pilgrimage for Shyam Baba and Hanuman Ji blessings. Smooth four-lane highway with dedicated senior citizen parking access near Toran Dwar.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi NCR to Khatu Shyam Ji (Toran Dwar Darshan)', desc: 'Early 5:00 AM doorstep pickup. Highway breakfast at Kotputli. Arrival at Khatu Dham by 11:30 AM. Shyam Kund dip, hotel rest, and evening Aarti at Toran Dwar.' },
          { time: 'Day 2', heading: 'Mangla Aarti, Salasar Balaji Dham & Return', desc: 'Morning Mangla Aarti at Khatu. 1.5 hr drive to Salasar Balaji for Savamani prasad and darshan. Afternoon satvik meal and smooth return to Delhi by 10:00 PM.' }
        ],
        suggestion: 'Elderly Tip: We arrange parking as close as possible to Toran Dwar to minimize walking for senior citizens.'
      },
      hi: {
        overview: 'Shyam Baba aur Salasar Balaji ka pavitra family dharmik yatra package. Pure raste 4-lane highway aur buzurgo ke aaram ke mutabiq smooth driving.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi se Khatu Dham (Toran Dwar VIP Darshan)', desc: 'Subah 5:00 AM doorstep pickup. Highway par hygienic nashta aur dopahar tak Khatu entry. Shyam Kund snan aur shaam ko Baba Shyam ke darshan.' },
          { time: 'Day 2', heading: 'Khatu Mangla Aarti, Salasar Balaji & Wapsi', desc: 'Subah Khatu Aarti ke baad Salasar Balaji Mandir prasthan. Balaji darshan, Savamani prasad aur shaam tak Delhi ke liye safe highway drive.' }
        ],
        suggestion: 'Parivar ke liye Sujhav: Ekadashi aur weekends par bheed hoti hai. Driver gaadi ko Toran Dwar ke nazdeek parking me le jata hai taaki chalna kam pade.'
      }
    },
    {
      id: 'rishikesh',
      category: 'dharmik',
      badge: 'Spiritual Adventure',
      title: 'Delhi to Haridwar, Rishikesh & Neelkanth Mahadev Yatra',
      duration: '2 Days / 1 Night',
      km: 560,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: September to April (Delightful weather, clear Ganga waters & perfect for rafting). Ganga Aarti runs 365 days a year.',
      mainImg: '/tours/rishikesh.png',
      spots: [
        'Har Ki Pauri Maha Ganga Aarti (Alaknanda Ghat Parking)',
        'Triveni Ghat Evening Sandhya Aarti Rishikesh',
        'Neelkanth Mahadev Mountain Forest Shrine',
        'Ram Jhula, Janki Jhula & Beatles Ashram',
        'Shivpuri White-Water River Rapids Point'
      ],
      howToEnjoy: 'Travel via the Delhi-Meerut Expressway to reach Haridwar in just 3.5 hours. Take a sacred dip in the holy Ganga at Har Ki Pauri and witness the world-famous evening Ganga Aarti with thousands of floating leaf diyas. Proceed to Rishikesh for riverside organic dining near Lakshman Jhula. The following morning, embark on an adventurous 16-km white-water rafting trip from Shivpuri, then ascend the hill road to Neelkanth Mahadev temple nestled between dense forests. Our drivers know bypass parking routes so you never miss sunset Aarti ceremonies.',
      en: {
        overview: 'Experience the holy dip at Har Ki Pauri, evening Ganga Aarti, and thrill of white-water rafting in Rishikesh with certified chauffeurs.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi to Haridwar Ganga Ghats & Rishikesh Aarti', desc: 'Morning start via expressway. Holy dip at Har Ki Pauri, proceed to Rishikesh for Triveni Ghat Aarti.' },
          { time: 'Day 2', heading: 'Neelkanth Mahadev & Shivpuri River Rafting', desc: 'Morning drive to mountain shrine Neelkanth Mahadev, exciting river rafting run and return to Delhi.' }
        ],
        suggestion: 'Aarti Advisory: Parking fills up fast before 5 PM at Haridwar. Our chauffeurs drop you at the Alaknanda ghat crossing to save 45 minutes of walking.'
      },
      hi: {
        overview: 'Har Ki Pauri par pavitra Ganga snan, shaam ki divya Aarti aur Shivpuri me white-water rafting ka shanti bhara safar.',
        timeline: [
          { time: 'Day 1', heading: 'Expressway se Haridwar & Har Ki Pauri Snan', desc: 'Subah early pickup. Har Ki Pauri snan aur shaam ko divine Ganga Aarti darshan.' },
          { time: 'Day 2', heading: 'Neelkanth Mahadev & Shivpuri Rafting', desc: 'Subah Neelkanth Mahadev darshan, 16km river rafting aur shaam tak Delhi doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Driver aapko ghat ke paas parking me drop karega taaki Aarti timely attend ho sake.'
      }
    },
    {
      id: 'amritsar',
      category: 'dharmik',
      badge: 'Golden Temple & Patriotic Border',
      title: 'Delhi to Amritsar Golden Temple & Wagah Border Express',
      duration: '2 Days / 1 Night',
      km: 920,
      bestCar: 'Maruti Ertiga / Innova Crysta',
      season: 'Best Season: October to March (Crisp Punjabi winter, pleasant walking at temple complex).',
      mainImg: '/tours/amritsar.png',
      spots: [
        'Harmandir Sahib (The Golden Temple & Amrit Sarovar)',
        'Wagah Border Beating Retreat Patriotic Ceremony',
        'Jallianwala Bagh Historic Memorial',
        'Guru Ka Langar 24x7 Community Kitchen',
        'Heritage Street Authentic Amritsari Kulcha Hubs'
      ],
      howToEnjoy: 'Travel over the Grand Trunk Road with stops at authentic Punjabi dhabas in Murthal. Arrive at Amritsar and visit the Golden Temple illuminated in golden hues against the sacred Amrit Sarovar at night. Partake in Guru Ka Langar, the world\'s largest free community kitchen. The following day, pay respects at Jallianwala Bagh and savor authentic crisp Amritsari Kulchas drenched in butter. By 3 PM, drive to the Wagah Border to witness the high-voltage patriotic Beating Retreat ceremony. Our chauffeurs ensure on-time arrival for stadium seating at the border.',
      en: {
        overview: 'Witness the serene spiritual divinity of the Golden Temple and feel the patriotic goosebumps at the India-Pakistan Wagah Border ceremony.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi to Amritsar & Night Palki Sahib Ceremony', desc: 'Early morning start via GT Road. Evening arrival, visit Golden Temple for night illumination and Langar.' },
          { time: 'Day 2', heading: 'Jallianwala Bagh, Wagah Border & Return Cruise', desc: 'Visit historic memorial, proceed to Wagah border for Beating Retreat ceremony, and evening return.' }
        ],
        suggestion: 'Border Advisory: Wagah stadium gates close by 4:00 PM. Our driver departs from Amritsar city strictly by 2:30 PM to secure prime front-row seats.'
      },
      hi: {
        overview: 'Golden Temple ki divyata aur Wagah Border par desh-bhakti ka josh. Punjabi dhabon par swadisht khane ke sath comfortable tour.',
        timeline: [
          { time: 'Day 1', heading: 'GT Road se Amritsar & Raat ki Golden Temple Roshni', desc: 'Subah start. Sham tak Amritsar hotel check-in aur raat me Harmandir Sahib darshan aur Langar.' },
          { time: 'Day 2', heading: 'Jallianwala Bagh, Wagah Border & Wapsi', desc: 'Jallianwala Bagh darshan, Wagah border parade ceremony aur safe return drive.' }
        ],
        suggestion: 'Star Line Sujhav: Wagah border par seat paane ke liye driver time par rawana karta hai.'
      }
    },
    {
      id: 'ayodhya',
      category: 'dharmik',
      badge: 'Shri Ram Janmabhoomi Special',
      title: 'Delhi to Ayodhya Dham Shri Ram Mandir Darshan',
      duration: '3 Days / 2 Nights',
      km: 1360,
      bestCar: 'Toyota Innova Crysta / Ertiga SUV',
      season: 'Best Season: October to March (Pleasant weather for temple darshan and Saryu river walks).',
      mainImg: '/tours/ayodhya.png',
      spots: [
        'Shri Ram Janmabhoomi Grand Temple Complex',
        'Hanuman Garhi Fort Temple (First Darshan)',
        'Saryu River Ghats & Evening Maha Aarti',
        'Kanak Bhawan Ornate Golden Shrines',
        'Ram Ki Paidi Modern Illuminated Waterfront'
      ],
      howToEnjoy: 'Travel effortlessly over the Yamuna and Agra-Lucknow Expressways into Ayodhya Dham. Begin your pilgrimage by seeking blessings at Hanuman Garhi, as tradition dictates that Lord Hanuman must be visited before Lord Ram. Proceed into the monumental pink sandstone complex of Shri Ram Janmabhoomi for divine Darshan of Ram Lalla. In the evening, witness the grand Saryu Aarti at Ram Ki Paidi as illuminated earthen lamps light up the sacred river. Visit Kanak Bhawan, gifted to Mata Sita, to admire the ornate golden deities. Our chauffeurs assist families with drop points near verified electric cart zones for comfortable temple visits.',
      en: {
        overview: 'Experience the historic grandeur of Shri Ram Janmabhoomi temple, Hanuman Garhi, and the divine sunset Saryu Aarti with doorstep comfort.',
        timeline: [
          { time: 'Day 1', heading: 'Delhi to Ayodhya via Expressways', desc: 'Doorstep morning start via Agra-Lucknow Expressway. Evening arrival and peaceful stroll at Saryu river.' },
          { time: 'Day 2', heading: 'Shri Ram Janmabhoomi & Hanuman Garhi Darshan', desc: 'Full-day divine darshan at the new Ram Mandir, Hanuman Garhi, Kanak Bhawan, and evening Saryu Aarti.' },
          { time: 'Day 3', heading: 'Morning Puja & Return Drive to Delhi NCR', desc: 'Morning holy bath at Saryu, souvenir shopping, and smooth return drive back to Delhi.' }
        ],
        suggestion: 'Elderly Assistance: Battery carts operate between parking zones and Ram Mandir. Our driver drops your family at the nearest authorized gate.'
      },
      hi: {
        overview: 'Shri Ram Janmabhoomi Ram Lalla ke darshan, Hanuman Garhi aur pavitra Saryu Aarti ka ananddayak tirth package.',
        timeline: [
          { time: 'Day 1', heading: 'Agra-Lucknow Expressway se Ayodhya Arrival', desc: 'Subah pickup. High-speed expressway se shaam tak Ayodhya hotel arrival aur aaram.' },
          { time: 'Day 2', heading: 'Ram Mandir, Hanuman Garhi & Saryu Aarti', desc: 'Ram Lalla ke divya darshan, Hanuman Garhi aur shaam ko Saryu river par Maha Aarti.' },
          { time: 'Day 3', heading: 'Saryu Snan & Delhi Wapsi', desc: 'Subah puja ke baad safe highway cruise back to Delhi doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Ram Mandir ke paas authorized battery rickshaw drop point tak cab drop karegi.'
      }
    },
    {
      id: 'budget-neemrana',
      category: 'budget',
      badge: 'Budget Super-Saver',
      title: 'Delhi to Neemrana Fort Palace (Same-Day Royal Escape)',
      duration: 'Same-Day (12 Hours)',
      km: 260,
      bestCar: 'Sedan (Dzire) / Ertiga',
      season: 'Best Season: Throughout the year; exceptionally pleasant from September to April.',
      mainImg: '/tours/neemrana.png',
      spots: [
        'Neemrana Fort 15th Century Palace Terraces',
        'Ancient Neemrana 9-Storey Stepwell (Baori)',
        'Aerial Flying Fox Zipline Adventure',
        'Japanese Industrial Zone Authentic Highway Dhabas',
        'Delhi-Jaipur Expressway High-Speed NH48'
      ],
      howToEnjoy: 'Smooth 2.5-hour highway drive via NH48. Arrive at the 15th-century heritage palace for lunch and aerial zip-lining. Visit the ancient 9-storey stepwell (Baori) and return back to Delhi NCR doorstep by 8:30 PM.',
      en: {
        overview: 'The most cost-effective royal highway getaway from Delhi NCR with single-tank fuel efficiency.',
        timeline: [
          { time: 'Morning', heading: 'Delhi NCR to Neemrana Fort Cruise', desc: '8:00 AM relaxed pickup. Arrive at the 15th-century palace for lunch and zip-lining.' },
          { time: 'Evening', heading: 'Stepwell Exploration & Return', desc: 'Visit ancient Neemrana Baori, enjoy highway tea, and return to Delhi by 8:30 PM.' }
        ],
        suggestion: 'Saver Tip: Perfect single-day family outing with zero hotel overnight charges.'
      },
      hi: {
        overview: 'Delhi NCR se sabse pocket-friendly royal road trip kam petrol kharch aur behtareen highway drive ke sath.',
        timeline: [
          { time: 'Subah', heading: 'Delhi se Neemrana Fort Palace', desc: 'Subah 8 AM pickup. 2.5 ghante me Neemrana entry aur palace tour.' },
          { time: 'Shaam', heading: 'Neemrana Baori & Safe Wapsi', desc: 'Aitihasik baori visit aur raat 8:30 PM tak Delhi safe doorstep drop.' }
        ],
        suggestion: 'Star Line Sujhav: Same day tour me bina kisi hotel booking ke pocket friendly trip complete hoti hai.'
      }
    }
  ]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setPickup(`GPS Pin (${lat}, ${lng}) - Exact Doorstep`);
      },
      () => {
        setIsLocating(false);
        alert("Please enable location permissions in browser to detect your doorstep.");
      }
    );
  };

  const getCalculatedFare = () => {
    if (!drop || !carType) return null;

    const selectedDest = allLocations.find(d => d.label === drop);
    const selectedOrigin = allLocations.find(o => o.label === pickup);
    const oneWayDistance = selectedDest ? (selectedDest.km || 400) : (selectedOrigin ? (selectedOrigin.km || 400) : 400);

    let rate = rates.sedan;
    if (carType.includes('Ertiga')) rate = rates.suv;
    else if (carType.includes('Crysta')) rate = rates.crysta;
    else if (carType.includes('Tempo')) rate = rates.tempo;

    if (tripType === 'round-trip') {
      const totalKm = oneWayDistance * 2;
      const days = oneWayDistance > 400 ? 3 : 2;
      const total = (totalKm * rate) + (days * rates.driverAllowance);
      return { 
        dist: totalKm, 
        total: Math.round(total), 
        rate, 
        breakdown: `${totalKm} km (Both ways) + ₹${days * rates.driverAllowance} Driver Allowance`,
        directionType: isPickupInDelhi ? 'Delhi NCR to Outstation Tour' : 'Outstation to Delhi NCR Return Tour'
      };
    } else {
      const billableKm = Math.round(oneWayDistance * rates.oneWaySurchargeRatio);
      const total = (billableKm * rate) + rates.driverAllowance;
      return { 
        dist: oneWayDistance, 
        total: Math.round(total), 
        rate, 
        breakdown: `One-Way Drop (${oneWayDistance} km) + Verified Return Surcharge included`,
        directionType: isPickupInDelhi ? 'Delhi NCR to Outstation Drop' : 'Outstation to Delhi NCR Doorstep Drop'
      };
    }
  };

  const currentFare = getCalculatedFare();

  const getModalFare = () => {
    if (!selectedTour) return 0;
    let rate = rates[modalVehicle];
    return Math.round((selectedTour.km * rate) + (rates.driverAllowance * 2));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter Traveler Full Name!");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp Mobile Number!");
      return;
    }
    if (!pickup) {
      alert("Please select a Pickup Location!");
      return;
    }
    if (!drop) {
      alert("Please select a Destination Landmark!");
      return;
    }
    if (!carType) {
      alert("Please select a Vehicle Type!");
      return;
    }

    const newLead = {
      name: customerName,
      phone: customerPhone,
      pickup: pickup,
      drop: drop,
      car: carType,
      fare: currentFare ? currentFare.total : 0,
      type: tripType === 'round-trip' ? 'Round-Trip' : 'One-Way Drop',
      date: date || 'Flexible'
    };

    try {
      await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch (err) {
      console.error("Database save failed:", err);
    }

    setLeads([newLead, ...leads]);

    const msg = `*STAR LINE TRAVELS BOOKING INQUIRY* 🚗%0A%0AHello Team, I would like to reserve a cab:%0A• *Traveler Name:* ${encodeURIComponent(customerName)}%0A• *Contact Phone:* ${customerPhone}%0A• *Journey Route:* ${currentFare?.directionType || 'Custom Route'}%0A• *Journey Type:* ${tripType === 'round-trip' ? 'Round-Trip' : 'One-Way Drop'}%0A• *Pickup:* ${encodeURIComponent(pickup)}%0A• *Destination Landmark:* ${encodeURIComponent(drop)}%0A• *Journey Date:* ${date || 'Earliest Available'}%0A• *Vehicle Selected:* ${encodeURIComponent(carType)}%0A• *Calculated Fare:* ₹${currentFare ? currentFare.total : 'TBD'}%0A%0APlease confirm chauffeur allocation.`;
    window.open(`https://wa.me/918882191825?text=${msg}`, '_blank');
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    if (!driverForm.phone || !driverForm.driver_name) {
      alert("Please complete the required details!");
      return;
    }

    try {
      await fetch(`${API_BASE}/api/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverForm)
      });
    } catch (err) {
      console.error("Database driver save failed:", err);
    }

    setDrivers([{
      id: drivers.length + 1,
      name: driverForm.driver_name,
      phone: driverForm.phone,
      car: `${driverForm.car_model} (${driverForm.car_year})`,
      base: driverForm.base_location,
      status: 'Partner Under Review'
    }, ...drivers]);

    alert("✅ Cab registration submitted successfully! Star Line Travels fleet operations team will contact you for commercial document verification.");
    setDriverForm({ driver_name: '', phone: '', car_model: 'Maruti Ertiga', car_year: 2024, commercial_number: '', base_location: '', preferred_routes: '' });
    setCurrentPage('home');
  };

  const filteredTours = tourCategoryFilter === 'all' 
    ? toursList 
    : toursList.filter(t => t.category === tourCategoryFilter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans relative">
      
      {/* 1. ENTERPRISE HEADER WITH MOBILE RESPONSIVE MENU */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          
          <div 
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow bg-white flex items-center justify-center p-0.5 group-hover:scale-105 transition">
              <StarLineLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm md:text-xl text-slate-900 tracking-tight">STAR LINE TRAVELS</span>
                <span className="hidden sm:flex bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200 items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Google Verified
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] text-slate-500 font-semibold">Burari, Delhi NCR</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-2 rounded-xl transition ${currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('fleet')}
              className={`px-3.5 py-2 rounded-xl transition ${currentPage === 'fleet' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Our Fleet
            </button>
            <button 
              onClick={() => setCurrentPage('tours')}
              className={`px-3.5 py-2 rounded-xl transition ${currentPage === 'tours' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Tours & Dharmik Yatra
            </button>
            <button 
              onClick={() => setCurrentPage('policy')}
              className={`px-3.5 py-2 rounded-xl transition ${currentPage === 'policy' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Fare Terms & Policies
            </button>
            <button 
              onClick={() => setCurrentPage('attach')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${currentPage === 'attach' ? 'bg-amber-100 text-amber-950 font-black' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'}`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" /> Attach Your Cab
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a 
              href="tel:+918882191825"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
            >
              <Phone className="w-4 h-4 fill-white" /> +91 88821 91825
            </a>

            <button 
              onClick={() => setCurrentPage('admin')}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              title="Operator Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-2 text-xs font-bold text-slate-700 shadow-lg">
            <button 
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition ${currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentPage('fleet'); setMobileMenuOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition ${currentPage === 'fleet' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Our Fleet
            </button>
            <button 
              onClick={() => { setCurrentPage('tours'); setMobileMenuOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition ${currentPage === 'tours' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Tours & Dharmik Yatra
            </button>
            <button 
              onClick={() => { setCurrentPage('policy'); setMobileMenuOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition ${currentPage === 'policy' ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-100'}`}
            >
              Fare Terms & Policies
            </button>
            <button 
              onClick={() => { setCurrentPage('attach'); setMobileMenuOpen(false); }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 ${currentPage === 'attach' ? 'bg-amber-100 text-amber-950 font-black' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'}`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" /> Attach Your Cab
            </button>
          </nav>
        )}
      </header>

      {/* 2. DYNAMIC PAGE ROUTING CONTAINER */}
      <main className="flex-1">

        {/* ===================== A. HOME PAGE ===================== */}
        {currentPage === 'home' && (
          <div>
            <section className="relative bg-gradient-to-br from-slate-950 via-[#071e3d] to-slate-900 text-white py-14 px-4 overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Hero Left Content */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-semibold text-blue-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Certified Chauffeur Fleet for Outstation & Tours
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                    Your Trusted Partner for Outstation Cabs & <span className="text-amber-400">Holiday Tours</span>
                  </h1>
                  
                  <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
                    Clean brand-new Dzire and Aura sedans, spacious Ertiga and Innova Crysta SUVs, and executive Tempo Travellers. Certified hill-route drivers with 100% transparent pricing and zero hidden charges.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mb-1" />
                      <div className="font-bold text-xs text-white">Doorstep Pickup</div>
                      <div className="text-[10px] text-slate-400">Delhi NCR 24/7</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mb-1" />
                      <div className="font-bold text-xs text-white">Hill Route Pros</div>
                      <div className="text-[10px] text-slate-400">Manali, Shimla, UK Hills</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm">
                      <HeartHandshake className="w-4 h-4 text-amber-400 mb-1" />
                      <div className="font-bold text-xs text-white">Dharmik Tirth Care</div>
                      <div className="text-[10px] text-slate-400">Elderly & Family Friendly</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Available Categories at Base Rates:</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200">Sedan Dzire (₹{rates.sedan}/km)</span>
                      <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200">Ertiga SUV (₹{rates.suv}/km)</span>
                      <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200">Innova Crysta (₹{rates.crysta}/km)</span>
                      <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-slate-200">Tempo Coach (₹{rates.tempo}/km)</span>
                    </div>
                  </div>
                </div>

                {/* ADVANCED LIVE FARE CALCULATOR */}
                <div className="lg:col-span-5 bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">Book Your Ride</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Select Landmark & Calculate Fare</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                      Live Estimate
                    </span>
                  </div>

                  {/* ONE-WAY VS ROUND-TRIP TOGGLE */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mt-4">
                    <button 
                      type="button"
                      onClick={() => setTripType('round-trip')}
                      className={`py-2 text-xs font-black rounded-xl transition ${tripType === 'round-trip' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Round-Trip Journey
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTripType('one-way')}
                      className={`py-2 text-xs font-black rounded-xl transition ${tripType === 'one-way' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      One-Way Drop
                    </button>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-3 pt-3">
                    {/* PICKUP POINT WITH LIVE GPS */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Pickup Point (Doorstep) *</label>
                        <button 
                          type="button" 
                          onClick={handleDetectLocation}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md"
                        >
                          <Crosshair className="w-3 h-3" /> {isLocating ? "Locating..." : "Use Live GPS"}
                        </button>
                      </div>
                      <select 
                        value={pickup} 
                        onChange={e => {
                          setPickup(e.target.value);
                          // Auto reset drop if it equals newly selected pickup
                          if (drop === e.target.value) setDrop('');
                        }}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">-- Select Pickup Point / Area --</option>
                        <optgroup label="📍 Delhi NCR Pickup Hubs">
                          {allLocations.filter(l => l.type === 'pickup').map((opt, i) => (
                            <option key={`p-delhi-${i}`} value={opt.label}>{opt.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🚩 Dharmik Tirth / Outstation Hubs">
                          {allLocations.filter(l => l.type !== 'pickup').map((opt, i) => (
                            <option key={`p-out-${i}`} value={opt.label}>
                              {opt.cat === 'dharmik' ? '🚩 ' : opt.cat === 'budget' ? '⚡ ' : '🏔️ '} {opt.label} ({opt.km} km)
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* SWAP BUTTON */}
                    <div className="flex justify-center -my-1.5">
                      <button 
                        type="button" 
                        onClick={handleSwapLocations}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full border border-slate-200 shadow-sm transition flex items-center gap-1 text-[10px] font-bold px-2.5"
                        title="Swap Pickup and Drop Locations"
                      >
                        <ArrowUpDown className="w-3 h-3" /> Swap Direction
                      </button>
                    </div>

                    {/* DESTINATION LANDMARK WITH DYNAMIC CATEGORIZATION */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Destination Landmark *</label>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {isPickupInDelhi ? "Delhi NCR ➔ Outstation" : "Outstation ➔ Delhi NCR"}
                        </span>
                      </div>
                      <select 
                        value={drop} 
                        onChange={e => setDrop(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">-- Select Destination Landmark --</option>

                        {/* If Pickup is Delhi NCR -> Show categorized Outstation destinations */}
                        {isPickupInDelhi ? (
                          <>
                            {filteredDropLocations.some(l => l.cat === 'dharmik') && (
                              <optgroup label="🚩 Dharmik Tirth Yatra">
                                {filteredDropLocations.filter(l => l.cat === 'dharmik').map((opt, i) => (
                                  <option key={`d-dharmik-${i}`} value={opt.label}>
                                    🚩 {opt.label} ({opt.km} km)
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {filteredDropLocations.some(l => l.cat === 'holiday') && (
                              <optgroup label="🏔️ Mountain & Heritage Holidays">
                                {filteredDropLocations.filter(l => l.cat === 'holiday').map((opt, i) => (
                                  <option key={`d-holiday-${i}`} value={opt.label}>
                                    🏔️ {opt.label} ({opt.km} km)
                                  </option>
                                ))}
                              </optgroup>
                            )}

                            {filteredDropLocations.some(l => l.cat === 'budget') && (
                              <optgroup label="⚡ Budget-Friendly Escapes">
                                {filteredDropLocations.filter(l => l.cat === 'budget').map((opt, i) => (
                                  <option key={`d-budget-${i}`} value={opt.label}>
                                    ⚡ {opt.label} ({opt.km} km)
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </>
                        ) : (
                          /* If Pickup is Outstation -> Show Delhi NCR doorstep drop points */
                          <optgroup label="📍 Delhi NCR Doorstep Drop Locations">
                            {filteredDropLocations.map((opt, i) => (
                              <option key={`d-ncr-${i}`} value={opt.label}>
                                📍 {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Travel Date</label>
                        <input 
                          type="date" 
                          value={date} 
                          onChange={e => setDate(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Select Vehicle *</label>
                        <select 
                          value={carType} 
                          onChange={e => setCarType(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50"
                          required
                        >
                          <option value="">-- Select Cab --</option>
                          <option>Sedan (Dzire / Aura) - ₹{rates.sedan}/km</option>
                          <option>SUV (Maruti Ertiga) - ₹{rates.suv}/km</option>
                          <option>Toyota Innova Crysta - ₹{rates.crysta}/km</option>
                          <option>Force Urbania / Tempo - ₹{rates.tempo}/km</option>
                        </select>
                      </div>
                    </div>

                    {/* MANDATORY TRAVELER DETAILS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Traveler Full Name *</label>
                        <input 
                          type="text" 
                          value={customerName} 
                          onChange={e => setCustomerName(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
                          placeholder="e.g. Ramesh Sharma"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">WhatsApp Number *</label>
                        <input 
                          type="tel" 
                          value={customerPhone} 
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                          placeholder="10-digit number"
                          required
                        />
                      </div>
                    </div>

                    {/* LIVE FARE CARD WITH DIRECTION TYPE BADGE */}
                    {currentFare ? (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md uppercase">
                              {currentFare.directionType}
                            </span>
                            <span className="text-[11px] text-slate-400">({currentFare.dist} km)</span>
                          </div>
                          <div className="text-xl font-black text-amber-400 mt-0.5">₹{currentFare.total.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[220px]">{currentFare.breakdown}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-white/10 text-white font-bold px-2.5 py-1 rounded-lg border border-white/20">
                            ₹{currentFare.rate}/km
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900 text-center font-bold">
                        Select Destination Landmark & Vehicle above to see exact live fare calculation.
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition text-xs md:text-sm"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" /> Reserve & Confirm on WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* ITINERARIES SHOWCASE SECTION ON HOMEPAGE */}
            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                  <span className="text-xs font-extrabold uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Handcrafted Road Expeditions
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 mt-2">Popular Tours & Pilgrimage Packages</h2>
                  <p className="text-xs text-slate-500 mt-1">Carefully planned itineraries for families, pilgrims, and road adventurers.</p>
                </div>
                <button 
                  onClick={() => setCurrentPage('tours')}
                  className="mt-3 md:mt-0 text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
                >
                  See More Packages ({toursList.length}) <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {toursList.slice(0, 3).map((tour) => (
                  <div 
                    key={tour.id}
                    onClick={() => { setSelectedTour(tour); }}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-52 overflow-hidden bg-slate-900">
                        <img src={tour.mainImg} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                        <span className={`absolute top-3 left-3 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg ${tour.category === 'dharmik' ? 'bg-amber-600' : 'bg-slate-900/90'}`}>
                          {tour.badge}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold text-slate-900 text-base">{tour.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tour.en.overview}</p>
                        <div className="mt-3 text-xs font-bold text-blue-600">{tour.km} km Journey • {tour.duration}</div>
                      </div>
                    </div>
                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-slate-900">Starts ₹{Math.round((tour.km * rates.sedan) + (rates.driverAllowance * 2)).toLocaleString()}</span>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                        View Plan <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Reliable Outstation Service
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 mt-2">WHY CHOOSE STAR LINE TRAVELS</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                    <HeartHandshake className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <h4 className="font-black text-slate-900 text-sm">Dedicated Dharmik Tirth Care</h4>
                    <p className="text-xs text-slate-500 mt-1">Specialized support for senior citizens, temple parking assistance, and pure satvik dining halts.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                    <BadgePercent className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-black text-slate-900 text-sm">Budget-Optimized Packages</h4>
                    <p className="text-xs text-slate-500 mt-1">Smart day-trip routes designed to deliver maximum travel value with zero dead mileage losses.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                    <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-black text-slate-900 text-sm">Certified Mountain Drivers</h4>
                    <p className="text-xs text-slate-500 mt-1">Drivers with 4+ years hill-driving certification across Manali, Shimla and Uttarakhand terrain.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                    <Clock className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                    <h4 className="font-black text-slate-900 text-sm">24x7 Doorstep Pickup</h4>
                    <p className="text-xs text-slate-500 mt-1">Punctual flight and railway station drops across Delhi, Noida, Gurgaon, and Ghaziabad.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================== B. OUR FLEET PAGE (LOCAL PHOTOS) ===================== */}
        {currentPage === 'fleet' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Commercial Fleet Portfolio
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Well-Maintained Chauffeur Cabs</h2>
              <p className="text-sm text-slate-500 mt-1">
                Every vehicle in the Star Line Travels fleet is commercially certified with valid tourist permits, active Fastag, dual climate control AC, and vetted professional drivers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fleetData.map(c => (
                <div key={c.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between">
                  <div>
                    <div className="relative h-60 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      <img 
                        src={c.img} 
                        alt={c.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-xl">
                        {c.tag}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-xl text-slate-900">{c.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{c.modelDesc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-700">₹{c.rate}<span className="text-xs font-bold text-slate-500"> / km</span></div>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">All-Inclusive Base</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-600">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div><strong className="block text-slate-900">Capacity</strong> {c.seats}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Luggage className="w-4 h-4 text-amber-600" />
                        <div><strong className="block text-slate-900">Luggage</strong> {c.luggage}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-emerald-600" />
                        <div><strong className="block text-slate-900">Comfort Features</strong> {c.ac}</div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/918882191825?text=Hello%20Star%20Line%20Travels,%20I%20would%20like%20to%20inquire%20about%20reserving%20the%20${encodeURIComponent(c.name)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 w-full text-center bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition text-xs shadow-sm"
                  >
                    Reserve {c.name} on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== C. TOURS & DHARMIK YATRA PAGE ===================== */}
        {currentPage === 'tours' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Spiritual, Budget & Scenic Expeditions
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Holiday Road Trips & Dharmik Yatra</h2>
              <p className="text-sm text-slate-500 mt-1">
                Family friendly, senior citizen friendly, and budget optimized cab itineraries with verified polite chauffeurs.
              </p>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button 
                  onClick={() => setTourCategoryFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${tourCategoryFilter === 'all' ? 'bg-slate-900 text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  All Journeys ({toursList.length})
                </button>
                <button 
                  onClick={() => setTourCategoryFilter('budget')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${tourCategoryFilter === 'budget' ? 'bg-emerald-600 text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  ⚡ Budget-Friendly Escapes ({toursList.filter(t => t.category === 'budget').length})
                </button>
                <button 
                  onClick={() => setTourCategoryFilter('dharmik')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${tourCategoryFilter === 'dharmik' ? 'bg-amber-600 text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  🚩 Dharmik Tirth Yatra ({toursList.filter(t => t.category === 'dharmik').length})
                </button>
                <button 
                  onClick={() => setTourCategoryFilter('holiday')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${tourCategoryFilter === 'holiday' ? 'bg-blue-600 text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
                >
                  🏔️ Mountain & Heritage Holidays ({toursList.filter(t => t.category === 'holiday').length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => (
                <div 
                  key={tour.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      <img 
                        src={tour.mainImg} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1590483253503-4f9e0a0589a1?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-xl shadow ${tour.category === 'budget' ? 'bg-emerald-600' : tour.category === 'dharmik' ? 'bg-amber-600' : 'bg-slate-900/90'}`}>
                        {tour.badge}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tour.duration}</div>
                      <h3 className="font-black text-lg text-slate-900 mt-1">{tour.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{tour.en.overview}</p>
                      
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between items-center">
                        <span><strong>Total Distance:</strong> {tour.km} km</span>
                        <span className="font-bold text-amber-700">{tour.bestCar}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => setSelectedTour(tour)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md shadow-blue-600/20"
                    >
                      View Detailed Plan & Season Advisory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== D. FARE TERMS, TOLLS & POLICIES ===================== */}
        {currentPage === 'policy' && (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                100% Transparent Terms
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Fare Norms, Tolls & Cancellation Policy</h2>
              <p className="text-sm text-slate-500 mt-1">
                Zero surprise charges. Everything governed by standard commercial tourist travel regulations across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">Tolls, State Border Taxes & Parking</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• <strong>Standard Quoting:</strong> Our base quotes cover the vehicle, clean AC running, and driver allowance (DA). National Highway Toll Taxes (Fastag), State Passenger Entry Taxes (e.g., UP, Rajasthan, Haryana, Himachal), and Monument Parking fees are paid as per actual electronic receipts.</p>
                  <p>• <strong>All-Inclusive Package Option:</strong> If requested in advance on WhatsApp, we can provide a fixed all-inclusive package including all expected tolls and state border taxes.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">Trip Delays & Extended Schedule</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• <strong>Customer-Requested Extensions:</strong> If you wish to extend your holiday or temple stay by extra days, the chauffeur is retained at a standard rate of <strong>₹500 / day (Driver Allowance)</strong> plus normal per-kilometer running.</p>
                  <p>• <strong>Night Driving Allowance:</strong> Trips requiring active travel between 10:00 PM and 6:00 AM incur a standard night chauffeur allowance of ₹300 per night for driver vigilance.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">Advance Token & Cancellation Refunds</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• <strong>Advance Token:</strong> Outstation bookings require an advance booking token (approx 20%) to lock vehicle allocation and ensure driver reporting.</p>
                  <p>• <strong>Cancellation Before 24 Hours:</strong> 100% full token refund or adjustable to any future journey within 6 months.</p>
                  <p>• <strong>Late Cancellation (Under 12 Hours):</strong> The nominal token compensates the driver who turned down other commercial rides to report at your location.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">Force Majeure & Mountain Safety Boundaries</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• <strong>Passenger Safety Paramount:</strong> In the event of unforeseen natural roadblocks, landslides, heavy snowfall, cloudbursts, or government transit bans, our chauffeurs will prioritize passenger safety and park at the nearest safe civil zone.</p>
                  <p>• <strong>Company Boundary:</strong> Star Line Travels is not liable for missed flights or hotel non-refunds caused strictly by unexpected natural highway closures or police roadblocks.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== E. ATTACH YOUR CAB PAGE ===================== */}
        {currentPage === 'attach' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-black uppercase text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  Fleet Partnership Program
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Attach Your Commercial Cab</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Own a commercial yellow-plate Dzire, Ertiga, Innova Crysta, or Tempo Traveller? Partner with Star Line Travels for verified outstation round-trip bookings with advance client payments.
                </p>
              </div>

              <form onSubmit={handleDriverSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Driver / Vehicle Owner Full Name</label>
                    <input 
                      type="text" 
                      value={driverForm.driver_name}
                      onChange={e => setDriverForm({...driverForm, driver_name: e.target.value})}
                      className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                      placeholder="e.g. Ramesh Kumar"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                    <input 
                      type="tel" 
                      value={driverForm.phone}
                      onChange={e => setDriverForm({...driverForm, phone: e.target.value})}
                      className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                      placeholder="+91 98100 00000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Model</label>
                    <select 
                      value={driverForm.car_model}
                      onChange={e => setDriverForm({...driverForm, car_model: e.target.value})}
                      className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                    >
                      <option>Maruti Dzire / Hyundai Aura (Petrol / CNG)</option>
                      <option>Maruti Ertiga (Petrol / CNG)</option>
                      <option>Toyota Innova Crysta (Petrol / CNG)</option>
                      <option>Force Urbania / Tempo Traveller</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Year of Registration</label>
                    <input 
                      type="number" 
                      value={driverForm.car_year}
                      onChange={e => setDriverForm({...driverForm, car_year: e.target.value})}
                      className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Commercial Plate No.</label>
                    <input 
                      type="text" 
                      value={driverForm.commercial_number}
                      onChange={e => setDriverForm({...driverForm, commercial_number: e.target.value})}
                      className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                      placeholder="DL 1Z B 1234"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Location / Daily Parking Area</label>
                  <input 
                    type="text" 
                    value={driverForm.base_location}
                    onChange={e => setDriverForm({...driverForm, base_location: e.target.value})}
                    className="w-full p-3 border rounded-xl outline-none bg-slate-50 font-semibold"
                    placeholder="e.g. Burari, Mukundpur, Rohini, South Delhi, Noida, Gurgaon"
                    required
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-700" /> Star Line Travels Fleet Standards:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    • 100% Direct On-Trip Payments: Advance token is collected by our booking desk; the remaining trip fare is paid directly to you by the traveler.<br/>
                    • Valid commercial driver badge and All India Tourist Permit (AITP) are strictly mandatory.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition text-sm shadow-xl"
                >
                  Submit Vehicle for Verification
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================== F. OPERATOR PORTAL ===================== */}
        {currentPage === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="font-black text-2xl text-slate-900">Operator Login</h3>
                <p className="text-xs text-slate-500 mt-1">Authorized Star Line Travels Fleet Management Only</p>
                
                <div className="mt-6 space-y-3">
                  <input 
                    type="password" 
                    value={adminPin}
                    onChange={e => setAdminPin(e.target.value)}
                    placeholder="Enter Secret Operator Password"
                    className="w-full p-3 border rounded-xl text-center font-bold tracking-widest text-lg outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button 
                    onClick={() => {
                      if (adminPin === 'Ninja@007860') setIsAdminLoggedIn(true);
                      else alert("Incorrect Password. Please re-enter.");
                    }}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-xs"
                  >
                    Unlock Operator Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Star Line Travels Internal Operations</span>
                    <h2 className="text-2xl font-black mt-1">Live Fleet Rate & Custom Content Suite</h2>
                  </div>
                  <button 
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 font-bold"
                  >
                    Exit Operator Mode
                  </button>
                </div>

                {/* RATE CONTROLLER */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-base text-slate-900">Live Website Rate & Surcharge Settings</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Modify per-kilometer rates, driver allowance (DA), and one-way dry run recovery multipliers dynamically.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-600 block">Sedan (₹/km)</label>
                      <input 
                        type="number" 
                        value={rates.sedan}
                        onChange={e => handleRateUpdate({...rates, sedan: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-blue-700 text-base bg-white"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-600 block">Ertiga (₹/km)</label>
                      <input 
                        type="number" 
                        value={rates.suv}
                        onChange={e => handleRateUpdate({...rates, suv: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-blue-700 text-base bg-white"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-600 block">Crysta (₹/km)</label>
                      <input 
                        type="number" 
                        value={rates.crysta}
                        onChange={e => handleRateUpdate({...rates, crysta: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-blue-700 text-base bg-white"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-600 block">Tempo (₹/km)</label>
                      <input 
                        type="number" 
                        value={rates.tempo}
                        onChange={e => handleRateUpdate({...rates, tempo: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-blue-700 text-base bg-white"
                      />
                    </div>
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <label className="text-[11px] font-bold text-amber-900 block">Driver DA (₹/day)</label>
                      <input 
                        type="number" 
                        value={rates.driverAllowance}
                        onChange={e => handleRateUpdate({...rates, driverAllowance: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-amber-700 text-base bg-white"
                      />
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <label className="text-[11px] font-bold text-emerald-900 block">1-Way Factor</label>
                      <input 
                        type="number" 
                        step="0.05" 
                        value={rates.oneWaySurchargeRatio}
                        onChange={e => handleRateUpdate({...rates, oneWaySurchargeRatio: Number(e.target.value)})}
                        className="w-full mt-1.5 p-2 border rounded-xl font-black text-emerald-700 text-base bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RECENT LEADS */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-black text-base text-slate-900 mb-3">Customer Booking Inquiries ({leads.length})</h3>
                  <div className="space-y-3">
                    {leads.map((l) => (
                      <div key={l.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                        <div>
                          <div className="font-black text-slate-900 text-sm">{l.name} • <span className="text-blue-600">{l.phone}</span> ({l.type})</div>
                          <div className="text-slate-500 mt-0.5">{l.pickup} ➔ {l.drop} ({l.car})</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-emerald-700 text-base">₹{l.fare?.toLocaleString()}</span>
                          <a 
                            href={`https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.name)},%20this%20is%20Star%20Line%20Travels.%20Your%20quotation%20for%20the%20${encodeURIComponent(l.drop)}%20journey%20is%20ready.`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl transition"
                          >
                            Follow-up on WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATTACHED DRIVERS */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-black text-base text-slate-900 mb-3">Attached Fleet Partners ({drivers.length})</h3>
                  <div className="space-y-3">
                    {drivers.map((d) => (
                      <div key={d.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-black text-slate-900 text-sm">{d.name} • {d.phone}</div>
                          <div className="text-slate-600 mt-0.5">{d.car} • Stationed at: {d.base}</div>
                        </div>
                        <a 
                          href={`tel:${d.phone}`}
                          className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-800"
                        >
                          Dispatch Driver
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. EXECUTIVE DETAILED ITINERARY MODAL (SINGLE FRONT PHOTO + SIGHTSEEING AS CLEAN TEXT ONLY) */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedTour(null)} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* FRONT COVER PHOTO */}
            <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
              <img 
                src={selectedTour.mainImg} 
                alt={selectedTour.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1590483253503-4f9e0a0589a1?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-5">
                <div>
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider">{selectedTour.duration}</span>
                  <h3 className="font-black text-2xl text-white mt-1">{selectedTour.title}</h3>
                </div>
              </div>
            </div>

            {/* BEST SEASON & WEATHER ADVISORY STRIP */}
            <div className="mb-5 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950 font-medium">
              <Sun className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{selectedTour.season}</span>
            </div>

            {/* 5 SIGHTSEEING SPOTS LISTED AS CLEAN TEXT (NO RANDOM IMAGES) */}
            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 mb-3">
                <Map className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Top Sightseeing Locations Covered in this Tour:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedTour.spots.map((spot, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 font-bold text-slate-800 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                    <span>{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTIVE HOW TO ENJOY PARAGRAPH */}
            <div className="mb-6 bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-black text-blue-900 uppercase text-[11px] tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-blue-600" /> How to Enjoy & Experience This Destination:
              </h4>
              <p>{selectedTour.howToEnjoy}</p>
            </div>

            {/* DUAL-LANGUAGE SWITCHER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Language Mode</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setItineraryLang('english')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${itineraryLang === 'english' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setItineraryLang('hinglish')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${itineraryLang === 'hinglish' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Hinglish
                </button>
              </div>
            </div>

            {/* ONE-CLICK VEHICLE SELECTOR BUTTONS */}
            <div className="my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider block mb-2">
                Select Vehicle for this Tour (Click to Calculate):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={() => setModalVehicle('sedan')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${modalVehicle === 'sedan' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}`}
                >
                  Sedan (Dzire)
                  <span className="block text-[10px] font-normal opacity-90">₹{rates.sedan}/km</span>
                </button>
                <button 
                  onClick={() => setModalVehicle('suv')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${modalVehicle === 'suv' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}`}
                >
                  Ertiga SUV
                  <span className="block text-[10px] font-normal opacity-90">₹{rates.suv}/km</span>
                </button>
                <button 
                  onClick={() => setModalVehicle('crysta')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${modalVehicle === 'crysta' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}`}
                >
                  Innova Crysta
                  <span className="block text-[10px] font-normal opacity-90">₹{rates.crysta}/km</span>
                </button>
                <button 
                  onClick={() => setModalVehicle('tempo')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${modalVehicle === 'tempo' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}`}
                >
                  Tempo Coach
                  <span className="block text-[10px] font-normal opacity-90">₹{rates.tempo}/km</span>
                </button>
              </div>
            </div>

            {/* ITINERARY OVERVIEW */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              {itineraryLang === 'english' ? selectedTour.en.overview : selectedTour.hi.overview}
            </p>

            {/* TIMELINE */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase text-slate-900 tracking-wider">Day-by-Day Journey Schedule</h4>
              {(itineraryLang === 'english' ? selectedTour.en.timeline : selectedTour.hi.timeline).map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="font-black text-xs text-blue-700 mb-0.5">{item.time}: {item.heading}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* OPERATOR ADVISORY / SUGGESTION */}
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
              <div className="font-black flex items-center gap-1.5 text-amber-900 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" /> Star Line Travels Advisory & Suggestions:
              </div>
              {itineraryLang === 'english' ? selectedTour.en.suggestion : selectedTour.hi.suggestion}
            </div>

            {/* FOOTER BAR WITH DYNAMIC CALCULATED FARE */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated {modalVehicle.toUpperCase()} Package ({selectedTour.km} km)</span>
                <div className="text-xl font-black text-slate-900">₹{getModalFare().toLocaleString()}</div>
                <span className="text-[10px] text-slate-500 font-medium">Includes Driver Allowance (DA)</span>
              </div>
              <a 
                href={`https://wa.me/918882191825?text=Hello%20Star%20Line%20Travels,%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(selectedTour.title)}%20package%20with%20${encodeURIComponent(modalVehicle.toUpperCase())}%20at%20₹${getModalFare()}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-600/20 text-center"
              >
                Reserve Selected Tour on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. ENTERPRISE FOOTER WITH UPDATED BRAND LOGO */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-amber-400">
                <StarLineLogo className="w-full h-full" />
              </div>
              <span className="font-black text-white text-base tracking-wider">STAR LINE TRAVELS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Google Business verified travel operator in Burari, Delhi. Providing premier taxi services for outstation long drives, airport transfers, and family holiday tours across North India.
            </p>
          </div>
          <div>
            <span className="font-bold text-white text-sm">Operating Office</span>
            <p className="mt-2 text-slate-400">Near Street 34, Oscar Public School Rd, Block 8A, Ajit Vihar, Burari, Delhi 110084</p>
            <p className="mt-2 text-white font-bold">Dispatch Hotline: +91 88821 91825</p>
          </div>
          <div>
            <span className="font-bold text-white text-sm">Transparency & Policies</span>
            <p className="mt-2 text-slate-400">Read our clear commercial terms regarding State Tax receipts, Tolls, Night Chauffeur allowances, and 100% fair cancellation norms.</p>
            <button 
              onClick={() => setCurrentPage('policy')}
              className="mt-3 text-blue-400 hover:text-blue-300 font-bold block"
            >
              View Fare Policies →
            </button>
          </div>
          <div>
            <span className="font-bold text-white text-sm">Fleet Partnership</span>
            <p className="mt-2 text-slate-400">Own a commercial yellow-plate cab? Attach your vehicle with Star Line Travels to receive regular outstation long rides with advance token payments.</p>
            <button 
              onClick={() => setCurrentPage('attach')} 
              className="mt-3 text-amber-400 hover:text-amber-300 font-bold block"
            >
              Attach Vehicle Today →
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px]">
          <span>© 2026 Star Line Travels. All Rights Reserved.</span>
          <span>Google Business Profile Verified Partner</span>
        </div>
      </footer>

      {/* 5. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/918882191825?text=Hello%20Star%20Line%20Travels,%20I%20would%20like%20to%20inquire%20about%20cab%20reservation."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition duration-300 hover:scale-110 border-2 border-white cursor-pointer"
        title="Chat on WhatsApp with Star Line Travels"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40"></span>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.861.916 2.791.916 3.182 0 5.768-2.587 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.965 5.765c0 5.518-4.482 10-10 10-1.741 0-3.376-.448-4.802-1.231l-5.194 1.36 1.385-5.059c-.901-1.488-1.424-3.235-1.424-5.07 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
        </svg>
      </a>

      {/* 6. MOBILE QUICK CALL BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-2.5 flex gap-2 shadow-2xl">
        <a 
          href="tel:+918882191825"
          className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs"
        >
          <Phone className="w-4 h-4 fill-white" /> Direct Call
        </a>
        <a 
          href="https://wa.me/918882191825?text=Hello%20Star%20Line%20Travels,%20I%20would%20like%20to%20inquire%20about%20cab%20reservation."
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs"
        >
          <MessageSquare className="w-4 h-4 fill-white" /> WhatsApp
        </a>
      </div>

    </div>
  );
}
