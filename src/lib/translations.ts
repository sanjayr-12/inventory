import { Language } from '@/src/types';

export interface Translations {
  // Navigation
  home: string;
  stockIn: string;
  vendorOrders: string;
  salesPOS: string;
  whatsInShop: string;
  lowStockAlerts: string;
  insights: string;
  resetData: string;
  
  // Header & Brand
  tagline: string;
  liveStock: string;
  inShopNow: string;
  todaysSales: string;
  trucksInTransit: string;
  emptyItems: string;
  
  // Home Register
  storeRegister: string;
  searchPlaceholder: string;
  whatToDoToday: string;
  quickActions: string;
  todaysSnapshot: string;
  totalClothes: string;
  pieces: string;
  acrossVarieties: string;
  piecesSoldToday: string;
  itemsRunningLow: string;
  completelyEmpty: string;
  moneyInSlowStock: string;
  sittingOnShelves: string;
  openAction: string;
  
  // Quick Actions Card Titles & Descriptions
  orderFromWeaversTitle: string;
  orderFromWeaversDesc: string;
  addNewStockTitle: string;
  addNewStockDesc: string;
  billCustomerTitle: string;
  billCustomerDesc: string;
  checkStockTitle: string;
  checkStockDesc: string;
  
  // Stock In
  inwardStockEntry: string;
  inwardStockSub: string;
  restockExisting: string;
  addNewVariety: string;
  whichItemArrived: string;
  howManyReceived: string;
  buyingCost: string;
  sellingMRP: string;
  whichWeaverSent: string;
  whereToKeep: string;
  saveToStock: string;
  recentDeliveries: string;
  
  // Sales / POS
  counterSaleTitle: string;
  counterSaleSub: string;
  currentBill: string;
  noItemsInBill: string;
  tapItemsLeft: string;
  paymentMethod: string;
  totalBill: string;
  completeSale: string;
  clearCart: string;
  soldOut: string;
  addToBill: string;
  
  // Inventory
  liveStockTitle: string;
  liveStockSub: string;
  searchInventory: string;
  itemName: string;
  category: string;
  whereKept: string;
  availableStock: string;
  price: string;
  correctCount: string;
  
  // Low Stock
  reorderAlertsTitle: string;
  reorderAlertsSub: string;
  completelySoldOut: string;
  runningLow: string;
  orderFromWeaverLiveTrack: string;
  quickRestock: string;
  
  // Vendor Orders & Tracking
  vendorOrdersTitle: string;
  vendorOrdersSub: string;
  orderFromWeaversTab: string;
  orderHistoryTab: string;
  selectWeaverHub: string;
  availableMillCatalog: string;
  purchaseOrderPO: string;
  placeOrderAndTrack: string;
  ordersAndReturnsHistory: string;
  liveTrackGPSMap: string;
  copyTrackingLink: string;
  acceptDeliveryAndStockIn: string;
  reportDefectiveItems: string;
  returnCompleted: string;
  returnInTransit: string;
  stockedInShop: string;
  vehicleAtGate: string;
  enRouteHighway: string;
  
  // Analytics
  stockInsightsTitle: string;
  stockInsightsSub: string;
  moneyStuckSlowStock: string;
  totalInventoryValuation: string;
  fastSellingChampions: string;
  topFastMoving: string;
  slowMovingStock: string;
  moneyInvestedCategory: string;
  
  // Theme & Language
  language: string;
  lightMode: string;
  darkMode: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home & Actions',
    stockIn: 'Stock In',
    vendorOrders: 'Vendor Orders & Tracking',
    salesPOS: 'Quick Sale (POS)',
    whatsInShop: "What's In Shop?",
    lowStockAlerts: 'Low Stock Alerts',
    insights: 'Dead Stock & Insights',
    resetData: 'Reset Data',

    // Header & Brand
    tagline: 'Simple Real-Time Inventory & Counter POS System',
    liveStock: 'Live Stock',
    inShopNow: 'In Shop:',
    todaysSales: "Today's Sales:",
    trucksInTransit: 'Trucks In Transit',
    emptyItems: 'empty',

    // Home Register
    storeRegister: 'Laxmi Textiles Store Register',
    searchPlaceholder: 'Type any saree, shirt, dhoti, color, or rack name to find stock immediately...',
    whatToDoToday: 'What would you like to check or do today?',
    quickActions: 'Quick Actions',
    todaysSnapshot: "Today's Store Snapshot",
    totalClothes: 'Total Available Clothes',
    pieces: 'pieces',
    acrossVarieties: 'Across',
    piecesSoldToday: 'pieces sold today',
    itemsRunningLow: 'Items Running Low',
    completelyEmpty: 'completely empty',
    moneyInSlowStock: 'Money in Slow Items',
    sittingOnShelves: 'items sitting on shelves',
    openAction: 'Open',

    // Quick Actions
    orderFromWeaversTitle: 'Order from Weavers',
    orderFromWeaversDesc: 'Order materials & live track trucks',
    addNewStockTitle: 'Add New Stock',
    addNewStockDesc: 'When fresh goods arrive from weavers',
    billCustomerTitle: 'Bill a Customer',
    billCustomerDesc: 'Fast sale & automatic stock deduction',
    checkStockTitle: 'Check Shop Stock',
    checkStockDesc: 'See what is on shelves right now',

    // Stock In
    inwardStockEntry: '➕ Add New Stock (Inward Entry)',
    inwardStockSub: 'Log clothes arriving from weavers so your shelf counts are 100% up to date.',
    restockExisting: 'Restock Existing Item',
    addNewVariety: '+ Add New Variety',
    whichItemArrived: '1. Which item arrived from weaver?',
    howManyReceived: '2. How many pieces received?',
    buyingCost: '3. Buying Price per piece (Cost) *',
    sellingMRP: 'Selling Price (Retail MRP)',
    whichWeaverSent: '4. Which Weaver / Mill sent this? *',
    whereToKeep: 'Where will you keep it? (Shelf) *',
    saveToStock: 'Save to Shop Stock',
    recentDeliveries: 'Recent Deliveries Received',

    // Sales / POS
    counterSaleTitle: '🛒 Counter Sale & Billing',
    counterSaleSub: 'Tap items to add to bill. Stock automatically reduces immediately upon sale.',
    currentBill: 'Current Customer Bill',
    noItemsInBill: 'No items in current bill',
    tapItemsLeft: 'Tap any item on the left to add to bill',
    paymentMethod: 'Payment Method',
    totalBill: 'Total Bill:',
    completeSale: 'Complete Sale',
    clearCart: 'Clear Cart',
    soldOut: 'Sold Out',
    addToBill: 'Add to Bill',

    // Inventory
    liveStockTitle: "📦 What's In My Shop? (Live Stock)",
    liveStockSub: 'Instantly see how many pieces of each saree or shirt are left and where they are kept.',
    searchInventory: 'Search by saree name, color, shelf location (e.g. Rack A-2)...',
    itemName: 'Item Name',
    category: 'Category',
    whereKept: 'Where Kept (Shelf)',
    availableStock: 'Available Stock',
    price: 'Price',
    correctCount: 'Correct Count',

    // Low Stock
    reorderAlertsTitle: '⚠️ Items to Reorder & Stock Alerts',
    reorderAlertsSub: 'Spot clothes that are running out and place direct purchase orders with master weavers.',
    completelySoldOut: 'Completely Sold Out (0 pieces left)',
    runningLow: 'Running Low (≤ 5 pieces left)',
    orderFromWeaverLiveTrack: 'Order from Weaver (Live Track)',
    quickRestock: 'Quick Restock',

    // Vendor Orders & Tracking
    vendorOrdersTitle: '🚚 Vendor Procurement & Live Order History',
    vendorOrdersSub: 'Place orders with master weavers across Tamil Nadu, track moving trucks, and return defective items easily.',
    orderFromWeaversTab: 'Order from Weavers',
    orderHistoryTab: 'Orders & Returns History',
    selectWeaverHub: 'Select Weaver / Mill Location',
    availableMillCatalog: 'Available Mill Catalog',
    purchaseOrderPO: 'Purchase Order (PO)',
    placeOrderAndTrack: 'Place Order & Start Live Tracking',
    ordersAndReturnsHistory: 'Orders & Returns History',
    liveTrackGPSMap: 'Live Track GPS Map',
    copyTrackingLink: 'Copy Link',
    acceptDeliveryAndStockIn: 'Accept Delivery & Stock In',
    reportDefectiveItems: 'Report Defective Items & Return',
    returnCompleted: 'Return Completed',
    returnInTransit: 'Return in Transit',
    stockedInShop: 'Stocked in Shop',
    vehicleAtGate: 'Vehicle at Gate (Ready to Stock)',
    enRouteHighway: 'En Route on Highway',

    // Analytics
    stockInsightsTitle: '📊 Stock Insights & Money Tied in Clothes',
    stockInsightsSub: 'See which clothes sell fast vs which ones are trapping your money on upper shelves.',
    moneyStuckSlowStock: 'Money Stuck in Slow Stock',
    totalInventoryValuation: 'Total Shop Inventory Value',
    fastSellingChampions: 'Fast-Selling Champions',
    topFastMoving: 'Top Fast-Moving Clothes',
    slowMovingStock: 'Slow-Moving Stock',
    moneyInvestedCategory: 'Money Invested in Each Category',

    // Theme & Language
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
  },

  ta: {
    // Navigation
    home: 'முகப்பு & செயல்கள்',
    stockIn: 'சரக்கு வரவு (Stock In)',
    vendorOrders: 'ஆர்டர்கள் & கண்காணிப்பு 🚚',
    salesPOS: 'விற்பனை & பில் (POS)',
    whatsInShop: 'கடையில் உள்ளவை',
    lowStockAlerts: 'குறைந்த இருப்பு எச்சரிக்கை',
    insights: 'முடங்கிய சரக்கு விவரம்',
    resetData: 'தரவு மீட்டமை',

    // Header & Brand
    tagline: 'எளிய நேரடி ஜவுளி இருப்பு & கவுண்டர் பில்லிங் முறை',
    liveStock: 'நேரடி இருப்பு',
    inShopNow: 'கடையில்:',
    todaysSales: 'இன்றைய விற்பனை:',
    trucksInTransit: 'வாகனம் வழியில் உள்ளது',
    emptyItems: 'தீர்ந்துவிட்டது',

    // Home Register
    storeRegister: 'லட்சுமி டெக்ஸ்டைல்ஸ் கடை பதிவேடு',
    searchPlaceholder: 'புடவை, சட்டை, வேட்டி, வண்ணம் அல்லது ரேக் பெயரை தட்டச்சு செய்யவும்...',
    whatToDoToday: 'இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?',
    quickActions: 'விரைவுச் செயல்கள்',
    todaysSnapshot: 'இன்றைய கடை நிலவரம்',
    totalClothes: 'மொத்த துணிகள் இருப்பு',
    pieces: 'எண்ணிக்கை',
    acrossVarieties: 'வகைகளில்',
    piecesSoldToday: 'இன்று விற்ற துணிகள்',
    itemsRunningLow: 'தீரும் நிலையில் உள்ளவை',
    completelyEmpty: 'முற்றிலும் தீர்ந்துவிட்டது',
    moneyInSlowStock: 'விற்பனையாகாத சரக்கில் முடங்கிய பணம்',
    sittingOnShelves: 'பொருட்கள் அலமாரியில் உள்ளன',
    openAction: 'திறக்கவும்',

    // Quick Actions
    orderFromWeaversTitle: 'நெசவாளரிடம் ஆர்டர்',
    orderFromWeaversDesc: 'துணிகளை ஆர்டர் செய்து வாகனத்தை கவனிக்கவும்',
    addNewStockTitle: 'புதிய சரக்கு வரவு',
    addNewStockDesc: 'நெசவாலையிலிருந்து புதிய துணிகள் வரும்போது',
    billCustomerTitle: 'வாடிக்கையாளர் பில் போடு',
    billCustomerDesc: 'விரைவான விற்பனை & உடனடி இருப்பு குறைப்பு',
    checkStockTitle: 'கடை இருப்பை சரிபார்',
    checkStockDesc: 'அலமாரிகளில் என்ன உள்ளது என பார்க்கவும்',

    // Stock In
    inwardStockEntry: '➕ புதிய சரக்கு வரவு பதிவு (Stock In)',
    inwardStockSub: 'நெசவாலையிலிருந்து வந்த துணிகளை பதிவு செய்து இருப்பை புதுப்பிக்கவும்.',
    restockExisting: 'உள்ள சரக்கில் சேர்க்கவும்',
    addNewVariety: '+ புதிய ரகத்தை சேர்க்கவும்',
    whichItemArrived: '1. எந்த துணி ரகம் வந்தது?',
    howManyReceived: '2. எத்தனை துணிகள் வந்தது?',
    buyingCost: '3. வாங்கிய விலை (ஒரு துணிக்கு) *',
    sellingMRP: 'விற்பனை விலை (MRP)',
    whichWeaverSent: '4. எந்த நெசவாளர் / ஆலை அனுப்பியது? *',
    whereToKeep: 'எந்த அலமாரியில் வைக்கப்படும்? (Rack) *',
    saveToStock: 'கடை இருப்பில் சேர்க்கவும்',
    recentDeliveries: 'சமீபத்தில் வந்த சரக்குகள்',

    // Sales / POS
    counterSaleTitle: '🛒 கவுண்டர் விற்பனை & பில்லிங்',
    counterSaleSub: 'பொருட்களை தொட்டு பில்லில் சேர்க்கவும். விற்றவுடன் தானாக இருப்பு குறையும்.',
    currentBill: 'வாடிக்கையாளர் பில்',
    noItemsInBill: 'பில்லில் பொருட்கள் இல்லை',
    tapItemsLeft: 'இடதுபுறம் உள்ள துணிகளை தொட்டு பில்லில் சேர்க்கவும்',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    totalBill: 'மொத்த பில் தொகை:',
    completeSale: 'விற்பனையை முடிக்கவும்',
    clearCart: 'பில்லை அழிக்கவும்',
    soldOut: 'தீர்ந்துவிட்டது',
    addToBill: 'பில்லில் சேர்',

    // Inventory
    liveStockTitle: '📦 கடையில் உள்ளவை (நேரடி இருப்பு)',
    liveStockSub: 'ஒவ்வொரு புடவை, சட்டை எவ்வளவு உள்ளது, எங்கு உள்ளது என்பதை உடனடியாக பாருங்கள்.',
    searchInventory: 'புடவை பெயர், நிறம், அலமாரி பெயர் (எ.கா: Rack A-2) தேடவும்...',
    itemName: 'பொருள் பெயர்',
    category: 'வகை',
    whereKept: 'இருக்கும் இடம் (Rack)',
    availableStock: 'உள்ள இருப்பு',
    price: 'விலை',
    correctCount: 'எண்ணிக்கை திருத்து',

    // Low Stock
    reorderAlertsTitle: '⚠️ மறுஆர்டர் எச்சரிக்கைகள்',
    reorderAlertsSub: 'தீர்ந்துபோகும் துணிகளை கண்டறிந்து உடனே நெசவாளரிடம் ஆர்டர் செய்யவும்.',
    completelySoldOut: 'முழுவதும் தீர்ந்துவிட்டது (0 இருப்பு)',
    runningLow: 'குறைவான இருப்பு (≤ 5 துணிகள்)',
    orderFromWeaverLiveTrack: 'நெசவாளரிடம் ஆர்டர் (நேரலை)',
    quickRestock: 'உடனடி வரவு',

    // Vendor Orders & Tracking
    vendorOrdersTitle: '🚚 நெசவாளர் கொள்முதல் & நேரடி கண்காணிப்பு',
    vendorOrdersSub: 'தமிழ்நாடு நெசவாளர்களிடம் துணிகளை ஆர்டர் செய்து, லாரி வரும் வழியை நேரலையில் கவனியுங்கள்.',
    orderFromWeaversTab: 'நெசவாளரிடம் ஆர்டர்',
    orderHistoryTab: 'ஆர்டர்கள் & திரும்பியவை வரலாறு',
    selectWeaverHub: 'நெசவாளர் / ஆலையை தேர்ந்தெடுக்கவும்',
    availableMillCatalog: 'ஆலையில் உள்ள துணிகள்',
    purchaseOrderPO: 'கொள்முதல் ஆணை (PO)',
    placeOrderAndTrack: 'ஆர்டர் செய்து நேரலையில் கவனிக்கவும்',
    ordersAndReturnsHistory: 'ஆர்டர்கள் & திருப்பியவை வரலாறு',
    liveTrackGPSMap: 'நேரடி மேப் வரைபடம்',
    copyTrackingLink: 'இணைப்பை நகலெடு',
    acceptDeliveryAndStockIn: 'சரக்கை ஏற்று கடையில் சேர்க்கவும்',
    reportDefectiveItems: 'பழுதுபட்ட துணிகளை திருப்பி அனுப்பு',
    returnCompleted: 'திரும்பி சேர்ந்தது',
    returnInTransit: 'திரும்பி செல்லும் வழியில்',
    stockedInShop: 'கடையில் சேர்க்கப்பட்டது',
    vehicleAtGate: 'வாகனம் வாசலில் உள்ளது',
    enRouteHighway: 'நெடுஞ்சாலையில் வருகிறது',

    // Analytics
    stockInsightsTitle: '📊 சரக்கு பகுப்பாய்வு & முடங்கிய பணம்',
    stockInsightsSub: 'வேகமாக விற்கும் துணிகள் மற்றும் அலமாரியில் முடங்கியுள்ள பணத்தை அறியுங்கள்.',
    moneyStuckSlowStock: 'விற்பனையாகாமல் முடங்கிய தொகை',
    totalInventoryValuation: 'கடையின் மொத்த சரக்கு மதிப்பு',
    fastSellingChampions: 'அதிகம் விற்கும் துணிகள்',
    topFastMoving: 'வேகமாக விற்கும் ரகங்கள்',
    slowMovingStock: 'மெதுவாக விற்கும் சரக்கு',
    moneyInvestedCategory: 'ஒவ்வொரு வகையிலும் முதலீடு',

    // Theme & Language
    language: 'மொழி',
    lightMode: 'பகல் முறை (Light)',
    darkMode: 'இரவு முறை (Dark)',
  },

  hi: {
    // Navigation
    home: 'होम और एक्शन',
    stockIn: 'स्टॉक आवक (Stock In)',
    vendorOrders: 'ऑर्डर और लाइव ट्रैकिंग 🚚',
    salesPOS: 'काउंटर बिक्री (POS)',
    whatsInShop: 'दुकान में स्टॉक',
    lowStockAlerts: 'कम स्टॉक अलर्ट',
    insights: 'अटका स्टॉक और विश्लेषण',
    resetData: 'डेटा रीसेट',

    // Header & Brand
    tagline: 'सरल रियल-टाइम इन्वेंटरी और काउंटर बिलिंग सिस्टम',
    liveStock: 'लाइव स्टॉक',
    inShopNow: 'दुकान में:',
    todaysSales: 'आज की बिक्री:',
    trucksInTransit: 'ट्रक रास्ते में है',
    emptyItems: 'खाली',

    // Home Register
    storeRegister: 'लक्ष्मी टेक्सटाइल्स दुकान रजिस्टर',
    searchPlaceholder: 'साड़ी, शर्ट, धोती, रंग या रैक का नाम लिखकर तुरंत स्टॉक देखें...',
    whatToDoToday: 'आज आप क्या देखना या करना चाहते हैं?',
    quickActions: 'त्वरित कार्य',
    todaysSnapshot: 'आज की दुकान स्थिति',
    totalClothes: 'कुल उपलब्ध कपड़े',
    pieces: 'पीस',
    acrossVarieties: 'वैरायटी में',
    piecesSoldToday: 'आज बिके कपड़े',
    itemsRunningLow: 'कम होने वाले कपड़े',
    completelyEmpty: 'पूरी तरह खत्म',
    moneyInSlowStock: 'अटके हुए स्टॉक में फंसा पैसा',
    sittingOnShelves: 'आइटम अलमारी में रखे हैं',
    openAction: 'खोलें',

    // Quick Actions
    orderFromWeaversTitle: 'बुनकरों से ऑर्डर करें',
    orderFromWeaversDesc: 'सामग्री ऑर्डर करें और ट्रक को ट्रैक करें',
    addNewStockTitle: 'नया स्टॉक जोड़ें',
    addNewStockDesc: 'जब बुनकरों से नया माल आए',
    billCustomerTitle: 'ग्राहक बिल बनाएं',
    billCustomerDesc: 'तेज बिक्री और अपने आप स्टॉक कम होना',
    checkStockTitle: 'दुकान स्टॉक देखें',
    checkStockDesc: 'अलमारियों में क्या रखा है तुरंत देखें',

    // Stock In
    inwardStockEntry: '➕ नया स्टॉक जोड़ें (Inward Entry)',
    inwardStockSub: 'बुनकरों से आने वाले कपड़ों को दर्ज करें ताकि स्टॉक हमेशा अपडेट रहे।',
    restockExisting: 'मौजूदा आइटम में जोड़ें',
    addNewVariety: '+ नई वैरायटी जोड़ें',
    whichItemArrived: '1. कौन सा कपड़ा आया?',
    howManyReceived: '2. कितने पीस प्राप्त हुए?',
    buyingCost: '3. खरीद मूल्य (प्रति पीस) *',
    sellingMRP: 'बिक्री मूल्य (MRP)',
    whichWeaverSent: '4. किस बुनकर / मिल ने भेजा? *',
    whereToKeep: 'किस रैक/अलमारी में रखेंगे? *',
    saveToStock: 'दुकान स्टॉक में सहेजें',
    recentDeliveries: 'हाल ही में आया माल',

    // Sales / POS
    counterSaleTitle: '🛒 काउंटर बिक्री और बिलिंग',
    counterSaleSub: 'कपड़ों पर टैप करके बिल में जोड़ें। बिक्री होते ही स्टॉक कम हो जाएगा।',
    currentBill: 'ग्राहक बिल',
    noItemsInBill: 'बिल में कोई आइटम नहीं है',
    tapItemsLeft: 'बाईं ओर कपड़ों पर टैप करके बिल में जोड़ें',
    paymentMethod: 'भुगतान का तरीका',
    totalBill: 'कुल बिल राशि:',
    completeSale: 'बिक्री पूरी करें',
    clearCart: 'बिल खाली करें',
    soldOut: 'बिक गया',
    addToBill: 'बिल में जोड़ें',

    // Inventory
    liveStockTitle: '📦 दुकान में स्टॉक (लाइव सूची)',
    liveStockSub: 'तुरंत देखें कि कौन सी साड़ी या शर्ट कितनी बची है और कहां रखी है।',
    searchInventory: 'साड़ी का नाम, रंग, रैक स्थान (जैसे Rack A-2) खोजें...',
    itemName: 'कपड़े का नाम',
    category: 'श्रेणी',
    whereKept: 'रखने का स्थान (रैक)',
    availableStock: 'उपलब्ध स्टॉक',
    price: 'मूल्य',
    correctCount: 'गिनती सही करें',

    // Low Stock
    reorderAlertsTitle: '⚠️ रीऑर्डर और स्टॉक अलर्ट',
    reorderAlertsSub: 'खत्म होने वाले कपड़े देखें और तुरंत बुनकरों को नया ऑर्डर भेजें।',
    completelySoldOut: 'पूरी तरह खत्म (0 पीस)',
    runningLow: 'कम स्टॉक (≤ 5 पीस बचे)',
    orderFromWeaverLiveTrack: 'बुनकर से ऑर्डर (लाइव ट्रैक)',
    quickRestock: 'तुरंत स्टॉक जोड़ें',

    // Vendor Orders & Tracking
    vendorOrdersTitle: '🚚 बुनकर खरीद और लाइव डिलीवरी ट्रैकिंग',
    vendorOrdersSub: 'तमिलनाडु के बुनकरों से सीधे ऑर्डर करें और डिलीवरी ट्रक को लाइव मैप पर देखें।',
    orderFromWeaversTab: 'बुनकरों से ऑर्डर करें',
    orderHistoryTab: 'ऑर्डर और रिटर्न इतिहास',
    selectWeaverHub: 'बुनकर / मिल चुनें',
    availableMillCatalog: 'मिल में उपलब्ध कपड़ा कैटलॉग',
    purchaseOrderPO: 'खरीद आदेश (PO)',
    placeOrderAndTrack: 'ऑर्डर दें और लाइव ट्रैक करें',
    ordersAndReturnsHistory: 'ऑर्डर और रिटर्न इतिहास',
    liveTrackGPSMap: 'लाइव जीपीएस मैप',
    copyTrackingLink: 'लिंक कॉपी करें',
    acceptDeliveryAndStockIn: 'डिलीवरी स्वीकारें और स्टॉक में जोड़ें',
    reportDefectiveItems: 'खराब कपड़े वापस भेजें',
    returnCompleted: 'वापसी पूरी हुई',
    returnInTransit: 'वापसी रास्ते में है',
    stockedInShop: 'दुकान में जुड़ गया',
    vehicleAtGate: 'ट्रक गेट पर पहुंच गया',
    enRouteHighway: 'हाईवे पर आ रहा है',

    // Analytics
    stockInsightsTitle: '📊 स्टॉक विश्लेषण और फंसा हुआ पैसा',
    stockInsightsSub: 'देखें कौन से कपड़े तेजी से बिकते हैं और कौन से कपड़े आपका पैसा रोके हुए हैं।',
    moneyStuckSlowStock: 'धीमे कपड़ों में फंसा पैसा',
    totalInventoryValuation: 'दुकान का कुल स्टॉक मूल्य',
    fastSellingChampions: 'सबसे ज्यादा बिकने वाले कपड़े',
    topFastMoving: 'तेजी से बिकने वाले कपड़े',
    slowMovingStock: 'धीमी गति का स्टॉक',
    moneyInvestedCategory: 'प्रत्येक श्रेणी में निवेश',

    // Theme & Language
    language: 'भाषा',
    lightMode: 'दिन का मोड (Light)',
    darkMode: 'रात का मोड (Dark)',
  },
};
