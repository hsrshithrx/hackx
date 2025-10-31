import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Activity, Apple, ArrowLeft, Languages, BookOpen, Zap, Shield, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HealthArticlesProps {
  onBack: () => void;
}

interface ArticleContent {
  title: string;
  description: string;
  tips: string[];
}

interface Articles {
  [key: string]: ArticleContent[];
}

const articles: Articles = {
  en: [
    {
      title: "Heart Health & Cardiovascular Wellness",
      description: "Learn evidence-based strategies for maintaining optimal heart health through proper diet, exercise, and lifestyle modifications for long-term cardiovascular wellness and disease prevention.",
      tips: ["Exercise 150 minutes weekly at moderate intensity", "Consume omega-3 rich foods and limit sodium intake", "Manage stress through mindfulness and adequate sleep"]
    },
    {
      title: "Mental Health & Emotional Well-being",
      description: "Discover comprehensive approaches to maintaining good mental health, building emotional resilience, and creating sustainable wellness habits for psychological balance and life satisfaction.",
      tips: ["Practice daily mindfulness and meditation techniques", "Maintain 7-9 hours of quality sleep nightly", "Build strong social connections and support networks"]
    },
    {
      title: "Physical Fitness & Active Living",
      description: "Essential guidance for incorporating regular physical activity into your lifestyle, building strength, improving flexibility, and maintaining mobility for lifelong health and vitality.",
      tips: ["Aim for 10,000+ steps daily with varied activities", "Include strength training 2-3 times per week", "Stay properly hydrated with 8-10 glasses of water daily"]
    },
    {
      title: "Nutrition Science & Healthy Eating",
      description: "Evidence-based nutritional guidance for creating a balanced diet that supports optimal health, sustained energy levels, and disease prevention through whole food nutrition.",
      tips: ["Eat 5-7 servings of colorful fruits and vegetables daily", "Choose whole grains over processed alternatives", "Limit ultra-processed foods and added sugars significantly"]
    }
  ],
  hi: [
    {
      title: "हृदय स्वास्थ्य और कार्डियोवास्कुलर कल्याण",
      description: "दीर्घकालिक हृदय स्वास्थ्य और रोग की रोकथाम के लिए उचित आहार, व्यायाम और जीवनशैली में बदलाव के माध्यम से इष्टतम हृदय स्वास्थ्य बनाए रखने की सिद्ध रणनीतियां सीखें।",
      tips: ["मध्यम तीव्रता पर साप्ताहिक 150 मिनट व्यायाम करें", "ओमेगा-3 युक्त खाद्य पदार्थों का सेवन करें और नमक का सेवन सीमित करें", "माइंडफुलनेस और पर्याप्त नींद के माध्यम से तनाव का प्रबंधन करें"]
    },
    {
      title: "मानसिक स्वास्थ्य और भावनात्मक कल्याण",
      description: "अच्छे मानसिक स्वास्थ्य को बनाए रखने, भावनात्मक लचीलापन बनाने और मनोवैज्ञानिक संतुलन और जीवन संतुष्टि के लिए स्थायी कल्याण आदतें बनाने के व्यापक तरीके खोजें।",
      tips: ["दैनिक माइंडफुलनेस और ध्यान तकनीकों का अभ्यास करें", "रात में 7-9 घंटे की गुणवत्तापूर्ण नींद बनाए रखें", "मजबूत सामाजिक संबंध और समर्थन नेटवर्क बनाएं"]
    },
    {
      title: "शारीरिक फिटनेस और सक्रिय जीवन",
      description: "आपकी जीवनशैली में नियमित शारीरिक गतिविधि को शामिल करने, शक्ति निर्माण, लचीलेपन में सुधार और आजीवन स्वास्थ्य के लिए गतिशीलता बनाए रखने के लिए आवश्यक मार्गदर्शन।",
      tips: ["विविध गतिविधियों के साथ दैनिक 10,000+ कदम का लक्ष्य रखें", "सप्ताह में 2-3 बार शक्ति प्रशिक्षण शामिल करें", "दैनिक 8-10 गिलास पानी के साथ उचित हाइड्रेशन बनाए रखें"]
    },
    {
      title: "पोषण विज्ञान और स्वस्थ भोजन",
      description: "संपूर्ण खाद्य पोषण के माध्यम से इष्टतम स्वास्थ्य, निरंतर ऊर्जा स्तर और रोग की रोकथाम का समर्थन करने वाले संतुलित आहार बनाने के लिए साक्ष्य-आधारित पोषण मार्गदर्शन।",
      tips: ["रोजाना 5-7 सर्विंग रंगबिरंगे फल और सब्जियां खाएं", "प्रसंस्कृत विकल्पों पर साबुत अनाज चुनें", "अत्यधिक प्रसंस्कृत खाद्य पदार्थ और अतिरिक्त चीनी को काफी सीमित करें"]
    }
  ],
  ta: [
    {
      title: "இதய ஆரோக்கியம் மற்றும் இருதய நலவாழ்வு",
      description: "நீண்டகால இருதய நலவாழ்வு மற்றும் நோய் தடுப்பிற்கு சரியான உணவு, உடற்பயிற்சி மற்றும் வாழ்க்கை முறை மாற்றங்கள் மூலம் உகந்த இதய ஆரோக்கியத்தை பராமரிப்பதற்கான சான்று அடிப்படையிலான உத்திகளை கற்றுக்கொள்ளுங்கள்।",
      tips: ["மிதமான தீவிரத்தில் வாரத்திற்கு 150 நிமிடங்கள் உடற்பயிற்சி செய்யுங்கள்", "ஒமேகா-3 நிறைந்த உணவுகளை உட்கொண்டு உப்பு உட்கொள்ளலைக் கட்டுப்படுத்துங்கள்", "கவனத்தூண்டுதல் மற்றும் போதுமான தூக்கத்தின் மூலம் மன அழுத்தத்தை நிர்வகிக்கவும்"]
    },
    {
      title: "மன ஆரோக்கியம் மற்றும் உணர்ச்சி நல்வாழ்வு",
      description: "நல்ல மன ஆரோக்கியத்தை பராமரித்தல், உணர்ச்சி ரீதியான நெகிழ்வுத்தன்மையை வளர்த்தல் மற்றும் உளவியல் சமநிலை மற்றும் வாழ்க்கை திருப்திக்கான நிலையான நல்வாழ்வு பழக்கங்களை உருவாக்குதல் ஆகியவற்றிற்கான விரிவான அணுகுமுறைகளை கண்டறியுங்கள்।",
      tips: ["தினசரி கவனத்தூண்டுதல் மற்றும் தியான நுட்பங்களை பயிற்சி செய்யுங்கள்", "இரவில் 7-9 மணிநேர தரமான தூக்கத்தை பராமரிக்கவும்", "வலுவான சமூக தொடர்புகள் மற்றும் ஆதரவு நெட்வொர்க்குகளை உருவாக்குங்கள்"]
    },
    {
      title: "உடல் தகுதி மற்றும் செயலில் வாழ்தல்",
      description: "உங்கள் வாழ்க்கை முறையில் வழக்கமான உடல் செயல்பாடுகளை இணைப்பது, வலிமையை வளர்ப்பது, நெகிழ்வுத்தன்மையை மேம்படுத்துவது மற்றும் வாழ்நாள் முழுவதும் ஆரோக்கியம் மற்றும் உயிர்ச்சக்திக்கான இயக்கத்தை பராமரிப்பதற்கான அத்தியாவசிய வழிகாட்டுதல்.",
      tips: ["பல்வேறு செயல்பாடுகளுடன் தினசரி 10,000+ படிகளை இலக்காகக் கொள்ளுங்கள்", "வாரத்திற்கு 2-3 முறை வலிமை பயிற்சியை சேர்த்துக்கொள்ளுங்கள்", "தினசரி 8-10 கிளாஸ் தண்ணீருடன் சரியான நீரேற்றத்தை பராமரிக்கவும்"]
    },
    {
      title: "ஊட்டச்சத்து அறிவியல் மற்றும் ஆரோக்கியமான உணவு",
      description: "முழு உணவு ஊட்டச்சத்து மூலம் உகந்த ஆரோக்கியம், நிலையான ஆற்றல் நிலைகள் மற்றும் நோய் தடுப்பை ஆதரிக்கும் சமச்சீர் உணவை உருவாக்குவதற்கான சான்று அடிப்படையிலான ஊட்டச்சத்து வழிகாட்டுதல்.",
      tips: ["தினசரி 5-7 பரிமாணங்கள் வண்ணமயமான பழங்கள் மற்றும் காய்கறிகளை உண்ணுங்கள்", "பதப்படுத்தப்பட்ட மாற்றுகளை விட முழு தானியங்களை தேர்வு செய்யுங்கள்", "அதிகமாக பதப்படுத்தப்பட்ட உணவுகள் மற்றும் சேர்க்கப்பட்ட சர்க்கரைகளை கணிசமாக கட்டுப்படுத்துங்கள்"]
    }
  ],
  te: [
    {
      title: "గుండె ఆరోగ్యం మరియు కార్డియోవాస్కులర్ వెల్నెస్",
      description: "దీర్ఘకాలిక గుండె ఆరోగ్యం మరియు వ్యాధి నివారణ కోసం సరైన ఆహారం, వ్యాయామం మరియు జీవనశైలి మార్పుల ద్వారా సరైన గుండె ఆరోగ్యాన్ని నిర్వహించడానికి సాక్ష్య-ఆధారిత వ్యూహాలను నేర్చుకోండి.",
      tips: ["మధ్యస్థ తీవ్రతలో వారానికి 150 నిమిషాలు వ్యాయామం చేయండి", "ఒమేగా-3 అధికంగా ఉన్న ఆహారాలను తీసుకోండి మరియు సోడియం తీసుకోవడం పరిమితం చేయండి", "మైండ్‌ఫుల్‌నెస్ మరియు తగినంత నిద్ర ద్వారా ఒత్తిడిని నిర్వహించండి"]
    },
    {
      title: "మానసిక ఆరోగ్యం మరియు భావోద్వేగ సంక్షేమం",
      description: "మంచి మానసిక ఆరోగ్యాన్ని నిర్వహించడం, భావోద్వేగ స్థితిస్థాపకతను పెంపొందించడం మరియు మానసిక సమతుల్యత మరియు జీవిత సంతృప్తి కోసం స్థిరమైన సంక్షేమ అలవాట్లను సృష్టించడం కోసం సమగ్ర విధానాలను కనుగొనండి.",
      tips: ["రోజువారీ మైండ్‌ఫుల్‌నెస్ మరియు ధ్యాన పద్ధతులను అభ్యసించండి", "రాత్రికి 7-9 గంటల నాణ్యమైన నిద్రను నిర్వహించండి", "బలమైన సామాజిక సంబంధాలు మరియు మద్దతు నెట్‌వర్క్‌లను నిర్మించండి"]
    },
    {
      title: "శారీరక దృఢత్వం మరియు చురుకైన జీవనం",
      description: "మీ జీవనశైలిలో క్రమం తప్పకుండా శారీరిక కార్యకలాపాలను చేర్చడం, బలాన్ని పెంపొందించడం, వశ్యతను మెరుగుపరచడం మరియు జీవితాంతం ఆరోగ్యం మరియు శక్తి కోసం చలనశీలతను నిర్వహించడం కోసం అవసరమైన మార్గదర్శకత్వం.",
      tips: ["వైవిధ్యమైన కార్యకలాపాలతో రోజూ 10,000+ అడుగులను లక్ష్యంగా చేసుకోండి", "వారానికి 2-3 సార్లు బలం శిక్షణను చేర్చండి", "రోజూ 8-10 గ్లాసుల నీటితో సరైన హైడ్రేషన్ ను నిర్వహించండి"]
    },
    {
      title: "పోషకాహార విజ్ఞానం మరియు ఆరోగ్యకర ఆహారం",
      description: "మొత్తం ఆహార పోషకాహారం ద్వారా సరైన ఆరోగ్యం, స్థిరమైన శక్తి స్థాయిలు మరియు వ్యాధి నివారణకు మద్దతు ఇచ్చే సమతుల్య ఆహారాన్ని సృష్టించడానికి సాక్ష్య-ఆధారిత పోషకాహార మార్గదర్శకత్వం.",
      tips: ["రోజూ 5-7 సర్వింగుల రంగురంగుల పండ్లు మరియు కూరగాయలను తినండి", "ప్రాసెస్ చేయబడిన ప్రత్యామ్నాయాలపై మొత్తం ధాన్యాలను ఎంచుకోండి", "అధిక ప్రాసెస్ చేయబడిన ఆహారాలు మరియు జోడించిన చక్కెరలను గణనీయంగా పరిమితం చేయండి"]
    }
  ],
  bn: [
    {
      title: "হৃদয় স্বাস্থ্য ও কার্ডিওভাস্কুলার সুস্থতা",
      description: "দীর্ঘমেয়াদী হৃদয় সুস্থতা এবং রোগ প্রতিরোধের জন্য সঠিক খাদ্য, ব্যায়াম এবং জীবনযাত্রার পরিবর্তনের মাধ্যমে সর্বোত্তম হৃদয় স্বাস্থ্য বজায় রাখার প্রমাণ-ভিত্তিক কৌশল শিখুন।",
      tips: ["মাঝারি তীব্রতায় সাপ্তাহিক ১৫০ মিনিট ব্যায়াম করুন", "ওমেগা-৩ সমৃদ্ধ খাবার গ্রহণ করুন এবং সোডিয়াম গ্রহণ সীমিত করুন", "মাইন্ডফুলনেস এবং পর্যাপ্ত ঘুমের মাধ্যমে চাপ নিয়ন্ত্রণ করুন"]
    },
    {
      title: "মানসিক স্বাস্থ্য ও আবেগজনিত সুস্থতা",
      description: "ভাল মানসিক স্বাস্থ্য বজায় রাখা, আবেগজনিত স্থিতিস্থাপকতা তৈরি করা এবং মনস্তাত্ত্বিক ভারসাম্য ও জীবন সন্তুষ্টির জন্য টেকসই সুস্থতার অভ্যাস তৈরি করার বিস্তৃত পদ্ধতি আবিষ্কার করুন।",
      tips: ["দৈনিক মাইন্ডফুলনেস এবং ধ্যান কৌশল অনুশীলন করুন", "রাতে ৭-৯ ঘন্টা মানসম্পন্ন ঘুম বজায় রাখুন", "শক্তিশালী সামাজিক সংযোগ এবং সহায়তা নেটওয়ার্ক তৈরি করুন"]
    },
    {
      title: "শারীরিক সুস্থতা ও সক্রিয় জীবনযাপন",
      description: "আপনার জীবনযাত্রায় নিয়মিত শারীরিক কার্যকলাপ অন্তর্ভুক্ত করা, শক্তি তৈরি করা, নমনীয়তা উন্নত করা এবং আজীবন স্বাস্থ্য ও প্রাণশক্তির জন্য গতিশীলতা বজায় রাখার জন্য প্রয়োজনীয় দিকনির্দেশনা।",
      tips: ["বিভিন্ন কার্যকলাপের সাথে দৈনিক ১০,০০০+ পদক্ষেপের লক্ষ্য রাখুন", "সপ্তাহে ২-৩ বার শক্তি প্রশিক্ষণ অন্তর্ভুক্ত করুন", "দৈনিক ৮-১০ গ্লাস পানির সাথে যথাযথ হাইড্রেশন বজায় রাখুন"]
    },
    {
      title: "পুষ্টি বিজ্ঞান ও স্বাস্থ্যকর খাদ্য",
      description: "সম্পূর্ণ খাদ্য পুষ্টির মাধ্যমে সর্বোত্তম স্বাস্থ্য, টেকসই শক্তির মাত্রা এবং রোগ প্রতিরোধ সহায়তাকারী সুষম খাদ্য তৈরির জন্য প্রমাণ-ভিত্তিক পুষ্টি নির্দেশনা।",
      tips: ["দৈনিক ৫-৭ সার্ভিং রঙিন ফল ও সবজি খান", "প্রক্রিয়াজাত বিকল্পের চেয়ে পূর্ণ শস্য বেছে নিন", "অতি-প্রক্রিয়াজাত খাবার এবং যোগ করা চিনি উল্লেখযোগ্যভাবে সীমিত করুন"]
    }
  ],
  mr: [
    {
      title: "हृदय आरोग्य आणि कार्डिओव्हास्क्युलर निरोगीपणा",
      description: "दीर्घकालीन हृदय निरोगीपणा आणि रोग प्रतिबंधासाठी योग्य आहार, व्यायाम आणि जीवनशैलीतील बदलांद्वारे चांगले हृदय आरोग्य राखण्यासाठी पुराव्यावर आधारित धोरणे शिका.",
      tips: ["मध्यम तीव्रतेने साप्ताहिक १५० मिनिटे व्यायाम करा", "ओमेगा-३ युक्त पदार्थांचे सेवन करा आणि सोडियमचे सेवन मर्यादित करा", "माइंडफुलनेस आणि पुरेशी झोप द्वारे तणाव व्यवस्थापित करा"]
    },
    {
      title: "मानसिक आरोग्य आणि भावनिक कल्याण",
      description: "चांगले मानसिक आरोग्य राखणे, भावनिक लवचिकता निर्माण करणे आणि मानसिक संतुलन व जीवन समाधानासाठी टिकाऊ निरोगीपणाच्या सवयी तयार करण्यासाठी सर्वसमावेशक पध्दती शोधा.",
      tips: ["दैनंदिन माइंडफुलनेस आणि ध्यान तंत्राचा सराव करा", "रात्री ७-९ तास दर्जेदार झोप घ्या", "मजबूत सामाजिक संपर्क आणि सहाय्य नेटवर्क तयार करा"]
    },
    {
      title: "शारीरिक तंदुरुस्ती आणि सक्रिय जीवन",
      description: "तुमच्या जीवनशैलीत नियमित शारीरिक हालचाली समाविष्ट करणे, शक्ती निर्माण करणे, लवचिकता सुधारणे आणि आयुष्यभर आरोग्य व चैतन्यासाठी गतिशीलता राखण्यासाठी आवश्यक मार्गदर्शन.",
      tips: ["विविध क्रियाकलापांसह दररोज १०,०००+ पावले चालण्याचे लक्ष्य ठेवा", "आठवड्यातून २-३ वेळा शक्ती प्रशिक्षण समाविष्ट करा", "दररोज ८-१० ग्लास पाण्यासह योग्य हायड्रेशन राखा"]
    },
    {
      title: "पोषण विज्ञान आणि निरोगी आहार",
      description: "संपूर्ण अन्न पोषणाद्वारे चांगले आरोग्य, शाश्वत ऊर्जा पातळी आणि रोग प्रतिबंधास समर्थन देणारा संतुलित आहार तयार करण्यासाठी पुराव्यावर आधारित पोषण मार्गदर्शन.",
      tips: ["दररोज ५-७ सर्व्हिंग रंगीबेरंगी फळे आणि भाज्या खा", "प्रक्रिया केलेल्या पर्यायांपेक्षा संपूर्ण धान्ये निवडा", "अति-प्रक्रिया केलेले पदार्थ आणि जोडलेली साखर लक्षणीयरीत्या मर्यादित करा"]
    }
  ],
  gu: [
    {
      title: "હૃદય આરોગ્ય અને કાર્ડિયોવાસ્ક્યુલર સ્વસ્થતા",
      description: "દીર્ઘકાલીન હૃદય સ્વસ્થતા અને રોગ નિવારણ માટે યોગ્ય આહાર, કસરત અને જીવનશૈલીના ફેરફારો દ્વારા શ્રેષ્ઠ હૃદય આરોગ્ય જાળવવા માટે પુરાવા-આધારિત વ્યૂહરચનાઓ શીખો.",
      tips: ["મધ્યમ તીવ્રતામાં સાપ્તાહિક ૧૫૦ મિનિટ કસરત કરો", "ઓમેગા-૩ સમૃદ્ધ ખોરાક લો અને સોડિયમનું સેવન મર્યાદિત કરો", "માઈન્ડફુલનેસ અને પૂરતી ઊંઘ દ્વારા તણાવનું સંચાલન કરો"]
    },
    {
      title: "માનસિક આરોગ્ય અને ભાવનાત્મક સ્વસ્થતા",
      description: "સારા માનસિક આરોગ્યની જાળવણી, ભાવનાત્મક સ્થિતિસ્થાપકતાનું નિર્માણ અને મનોવૈજ્ઞાનિક સંતુલન અને જીવન સંતૃપ્તિ માટે ટકાઉ સ્વસ્થતાની આદતો બનાવવા માટે વ્યાપક અભિગમો શોધો.",
      tips: ["દૈનિક માઈન્ડફુલનેસ અને ધ્યાન તકનીકોની પ્રેક્ટિસ કરો", "રાત્રે ૭-૯ કલાકની ગુણવત્તાપૂર્ણ ઊંઘ રાખો", "મજબૂત સામાજિક જોડાણો અને સહાય નેટવર્ક બનાવો"]
    },
    {
      title: "શારીરિક તંદુરસ્તી અને સક્રિય જીવન",
      description: "તમારી જીવનશૈલીમાં નિયમિત શારીરિક પ્રવૃત્તિઓનો સમાવેશ કરવો, શક્તિનું નિર્માણ કરવું, લવચીકતા સુધારવી અને આજીવન આરોગ્ય અને ઉત્સાહ માટે ગતિશીલતા જાળવવા માટે જરૂરી માર્ગદર્શન.",
      tips: ["વિવિધ પ્રવૃત્તિઓ સાથે દરરોજ ૧૦,૦૦૦+ પગલાંનું લક્ષ્ય રાખો", "સપ્તાહમાં ૨-૩ વખત શક્તિ તાલીમનો સમાવેશ કરો", "દરરોજ ૮-૧૦ ગ્લાસ પાણી સાથે યોગ્ય હાઈડ્રેશન જાળવો"]
    },
    {
      title: "પોષણ વિજ્ઞાન અને તંદુરસ્ત આહાર",
      description: "સંપૂર્ણ ખોરાક પોષણ દ્વારા શ્રેષ્ઠ આરોગ્ય, ટકાઉ ઊર્જા સ્તરો અને રોગ નિવારણને સમર્થન આપતા સંતુલિત આહાર બનાવવા માટે પુરાવા-આધારિત પોષણ માર્ગદર્શન.",
      tips: ["દરરોજ ૫-૭ સર્વિંગ રંગબેરંગી ફળો અને શાકભાજી ખાઓ", "પ્રોસેસ્ડ વિકલ્પોની જગ્યાએ આખા અનાજ પસંદ કરો", "અતિ-પ્રોસેસ્ડ ખોરાક અને ઉમેરાયેલી ખાંડને નોંધપાત્ર રીતે મર્યાદિત કરો"]
    }
  ],
  kn: [
    {
      title: "ಹೃದಯ ಆರೋಗ್ಯ ಮತ್ತು ಕಾರ್ಡಿಯೋವಾಸ್ಕುಲರ್ ಕಲ್ಯಾಣ",
      description: "ದೀರ್ಘಕಾಲೀನ ಹೃದಯ ಕಲ್ಯಾಣ ಮತ್ತು ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆಗೆ ಸರಿಯಾದ ಆಹಾರ, ವ್ಯಾಯಾಮ ಮತ್ತು ಜೀವನಶೈಲಿ ಬದಲಾವಣೆಗಳ ಮೂಲಕ ಅತ್ಯುತ್ತಮ ಹೃದಯ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಪುರಾವೆ-ಆಧಾರಿತ ತಂತ್ರಗಳನ್ನು ಕಲಿಯಿರಿ.",
      tips: ["ಮಧ್ಯಮ ತೀವ್ರತೆಯಲ್ಲಿ ಸಾಪ್ತಾಹಿಕ ೧೫೦ ನಿಮಿಷಗಳ ವ್ಯಾಯಾಮ ಮಾಡಿ", "ಒಮೇಗಾ-೩ ಸಮೃದ್ಧ ಆಹಾರವನ್ನು ಸೇವಿಸಿ ಮತ್ತು ಸೋಡಿಯಂ ಸೇವನೆಯನ್ನು ಸೀಮಿತಗೊಳಿಸಿ", "ಮೈಂಡ್‌ಫುಲ್‌ನೆಸ್ ಮತ್ತು ಸಾಕಷ್ಟು ನಿದ್ರೆಯ ಮೂಲಕ ಒತ್ತಡವನ್ನು ನಿರ್ವಹಿಸಿ"]
    },
    {
      title: "ಮಾನಸಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಕಲ್ಯಾಣ",
      description: "ಉತ್ತಮ ಮಾನಸಿಕ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು, ಭಾವನಾತ್ಮಕ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವವನ್ನು ನಿರ್ಮಿಸಲು ಮತ್ತು ಮಾನಸಿಕ ಸಮತೋಲನ ಮತ್ತು ಜೀವನ ತೃಪ್ತಿಗೆ ಸುಸ್ಥಿರ ಕಲ್ಯಾಣ ಅಭ್ಯಾಸಗಳನ್ನು ಸೃಷ್ಟಿಸಲು ವ್ಯಾಪಕ ವಿಧಾನಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.",
      tips: ["ದೈನಂದಿನ ಮೈಂಡ್‌ಫುಲ್‌ನೆಸ್ ಮತ್ತು ಧ್ಯಾನ ತಂತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ", "ರಾತ್ರಿಯಲ್ಲಿ ೭-೯ ಗಂಟೆಗಳ ಗುಣಮಟ್ಟದ ನಿದ್ರೆಯನ್ನು ನಿರ್ವಹಿಸಿ", "ಬಲವಾದ ಸಾಮಾಜಿಕ ಸಂಪರ್ಕಗಳು ಮತ್ತು ಬೆಂಬಲ ನೆಟ್‌ವರ್ಕ್‌ಗಳನ್ನು ನಿರ್ಮಿಸಿ"]
    },
    {
      title: "ಶಾರೀರಿಕ ಸ್ವಸ್ಥತೆ ಮತ್ತು ಸಕ್ರಿಯ ಜೀವನ",
      description: "ನಿಮ್ಮ ಜೀವನಶೈಲಿಯಲ್ಲಿ ನಿಯಮಿತ ಶಾರೀರಿಕ ಚಟುವಟಿಕೆಗಳನ್ನು ಸೇರಿಸುವುದು, ಶಕ್ತಿಯನ್ನು ನಿರ್ಮಿಸುವುದು, ನಮ್ಯತೆಯನ್ನು ಸುಧಾರಿಸುವುದು ಮತ್ತು ಜೀವನಪರ್ಯಂತ ಆರೋಗ್ಯ ಮತ್ತು ಚೈತನ್ಯಕ್ಕಾಗಿ ಚಲನಶೀಲತೆಯನ್ನು ನಿರ್ವಹಿಸುವುದಕ್ಕೆ ಅಗತ್ಯವಾದ ಮಾರ್ಗದರ್ಶನ.",
      tips: ["ವಿವಿಧ ಚಟುವಟಿಕೆಗಳೊಂದಿಗೆ ದಿನಕ್ಕೆ ೧೦,೦೦೦+ ಹೆಜ್ಜೆಗಳ ಗುರಿಯನ್ನು ಇರಿಸಿಕೊಳ್ಳಿ", "ವಾರಕ್ಕೆ ೨-೩ ಬಾರಿ ಶಕ್ತಿ ತರಬೇತಿಯನ್ನು ಸೇರಿಸಿ", "ದಿನಕ್ಕೆ ೮-೧೦ ಲೋಟ ನೀರಿನೊಂದಿಗೆ ಸರಿಯಾದ ಹೈಡ್ರೇಶನ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ"]
    },
    {
      title: "ಪೋಷಣೆ ವಿಜ್ಞಾನ ಮತ್ತು ಆರೋಗ್ಯಕರ ಆಹಾರ",
      description: "ಸಂಪೂರ್ಣ ಆಹಾರ ಪೋಷಣೆಯ ಮೂಲಕ ಅತ್ಯುತ್ತಮ ಆರೋಗ್ಯ, ಸುಸ್ಥಿರ ಶಕ್ತಿಯ ಮಟ್ಟಗಳು ಮತ್ತು ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವ ಸಮತೋಲಿತ ಆಹಾರವನ್ನು ರಚಿಸಲು ಪುರಾವೆ-ಆಧಾರಿತ ಪೋಷಣೆ ಮಾರ್ಗದರ್ಶನ.",
      tips: ["ದಿನಕ್ಕೆ ೫-೭ ಸರ್ವಿಂಗ್‌ಗಳ ವರ್ಣರಂಜಿತ ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳನ್ನು ತಿನ್ನಿರಿ", "ಸಂಸ್ಕರಿಸಿದ ಪರ್ಯಾಯಗಳ ಮೇಲೆ ಸಂಪೂರ್ಣ ಧಾನ್ಯಗಳನ್ನು ಆರಿಸಿ", "ಅತಿ-ಸಂಸ್ಕರಿಸಿದ ಆಹಾರಗಳು ಮತ್ತು ಸೇರಿಸಿದ ಸಕ್ಕರೆಗಳನ್ನು ಗಮನಾರ್ಹವಾಗಿ ಸೀಮಿತಗೊಳಿಸಿ"]
    }
  ],
  ml: [
    {
      title: "ഹൃദയാരോഗ്യവും കാർഡിയോവാസ്ക്യുലർ ക്ഷേമവും",
      description: "ദീർഘകാലിക ഹൃദയ ക്ഷേമവും രോഗ പ്രതിരോധവുമായി ശരിയായ ഭക്ഷണം, വ്യായാമം, ജീവിതശൈലി മാറ്റങ്ങൾ എന്നിവയിലൂടെ അനുയോജ്യമായ ഹൃദയാരോഗ്യം നിലനിർത്തുന്നതിനുള്ള തെളിവ് അടിസ്ഥാനമാക്കിയ തന്ത്രങ്ങൾ പഠിക്കുക.",
      tips: ["മിതമായ തീവ്രതയിൽ ആഴ്ചയിൽ ൧൫൦ മിനിറ്റ് വ്യായാമം ചെയ്യുക", "ഒമേഗ-൩ സമൃദ്ധമായ ഭക്ഷണം കഴിക്കുകയും സോഡിയം കഴിക്കുന്നത് പരിമിതപ്പെടുത്തുകയും ചെയ്യുക", "മൈൻഡ്ഫുൾനെസ്സും മതിയായ ഉറക്കവും വഴി സമ്മർദം കൈകാര്യം ചെയ്യുക"]
    },
    {
      title: "മാനസികാരോഗ്യവും വൈകാരിക ക്ഷേമവും",
      description: "നല്ല മാനസികാരോഗ്യം നിലനിർത്തൽ, വൈകാരിക സ്ഥിതിസ്ഥാപകത നിർമാണം, മാനസിക സന്തുലനത്തിനും ജീവിത സംതൃപ്തിക്കുമായി സുസ്ഥിര ക്ഷേമ ശീലങ്ങൾ സൃഷ്ടിക്കൽ എന്നിവയ്ക്കുള്ള സമഗ്ര സമീപനങ്ങൾ കണ്ടെത്തുക.",
      tips: ["ദൈനംദിന മൈൻഡ്ഫുൾനെസ്സും ധ്യാന സാങ്കേതികതകളും പരിശീലിക്കുക", "രാത്രിയിൽ ൭-൯ മണിക്കൂർ ഗുണനിലവാരമുള്ള ഉറക്കം നിലനിർത്തുക", "ശക്തമായ സാമൂഹിക ബന്ധങ്ങളും പിന്തുണ നെറ്റ്‌വർക്കുകളും നിർമിക്കുക"]
    },
    {
      title: "ശാരീരിക ആരോഗ്യവും സജീവ ജീവിതവും",
      description: "നിങ്ങളുടെ ജീവിതശൈലിയിൽ നിയമിത ശാരീരിക പ്രവർത്തനങ്ങൾ ഉൾപ്പെടുത്തൽ, ശക്തി നിർമാണം, വഴക്കം മെച്ചപ്പെടുത്തൽ, ആജീവനാന്ത ആരോഗ്യത്തിനും ഊർജത്തിനുമായി ചലനശീലത നിലനിർത്തൽ എന്നിവയ്ക്കുള്ള അത്യാവശ്യ മാർഗനിർദേശം.",
      tips: ["വൈവിധ്യമാർന്ന പ്രവർത്തനങ്ങളോടെ ദിവസേന ൧൦,൦൦൦+ ചുവടുകളുടെ ലക്ഷ്യം വയ്ക്കുക", "ആഴ്ചയിൽ ൨-൩ തവണ ശക്തി പരിശീലനം ഉൾപ്പെടുത്തുക", "ദിവസേന ൮-൧൦ ഗ്ലാസ് വെള്ളത്തോടെ ശരിയായ ജലാംശം നിലനിർത്തുക"]
    },
    {
      title: "പോഷകാഹാര ശാസ്ത്രവും ആരോഗ്യകര ഭക്ഷണവും",
      description: "സമ്പൂർണ ഭക്ഷണ പോഷകാഹാരത്തിലൂടെ അനുയോജ്യമായ ആരോഗ്യം, സുസ്ഥിര ഊർജ നിലവാരം, രോഗ പ്രതിരോധം എന്നിവയെ പിന്തുണയ്ക്കുന്ന സമതുലിത ഭക്ഷണക്രമം സൃഷ്ടിക്കുന്നതിനുള്ള തെളിവ് അടിസ്ഥാനമാക്കിയ പോഷകാഹാര മാർഗനിർദേശം.",
      tips: ["ദിവസേന ൫-൭ സെർവിംഗ് വർണാഭമായ പഴങ്ങളും പച്ചക്കറികളും കഴിക്കുക", "സംസ്കരിച്ച ബദലുകളുടെ മേൽ മുഴുവൻ ധാന്യങ്ങൾ തിരഞ്ഞെടുക്കുക", "അധിക സംസ്കരിച്ച ഭക്ഷണങ്ങളും കൂട്ടിച്ചേർത്ത പഞ്ചസാരയും ഗണ്യമായി പരിമിതപ്പെടുത്തുക"]
    }
  ]
};

const articleIcons = [Heart, Brain, Activity, Apple];
const articleColors = [
  { icon: "#E53E3E", bg: "#FED7D7", border: "#FBB6CE" }, // Red for Heart
  { icon: "#805AD5", bg: "#E9D8FD", border: "#D6BCFA" }, // Purple for Brain  
  { icon: "#38A169", bg: "#C6F6D5", border: "#9AE6B4" }, // Green for Activity
  { icon: "#D69E2E", bg: "#FAF089", border: "#F6E05E" }  // Yellow for Nutrition
];

const languageNames = {
  en: "English",
  hi: "Hindi (हिंदी)", 
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  bn: "Bengali (বাংলা)",
  mr: "Marathi (मराठी)",
  gu: "Gujarati (ગુજરાતી)", 
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)"
};

const pageLabels = {
  en: {
    title: "Health & Wellness Articles",
    subtitle: "Evidence-based expert guidance for optimal health and wellness — helping you understand wellness principles, implement healthy habits, and maintain long-term health with professional insights."
  },
  hi: {
    title: "स्वास्थ्य और कल्याण लेख", 
    subtitle: "इष्टतम स्वास्थ्य और कल्याण के लिए साक्ष्य-आधारित विशेषज्ञ मार्गदर्शन — आपको कल्याण सिद्धांतों को समझने, स्वस्थ आदतों को लागू करने में मदद करना।"
  },
  ta: {
    title: "ஆரோக்கியம் மற்றும் நலவாழ்வு கட்டுரைகள்",
    subtitle: "உகந்த ஆரோக்கியம் மற்றும் நலவாழ்விற்கான சான்று அடிப்படையிலான நிபுணர் வழிகாட்டுதல் — நலவாழ்வு கொள்கைகளைப் புரிந்துகொள்ள உதவுதல்।"
  },
  te: {
    title: "ఆరోగ్యం మరియు శ్రేయస్సు వ్యాసాలు",
    subtitle: "సరైన ఆరోగ్యం మరియు సంక్షేమం కోసం సాక్ష్య-ఆధారిత నిపుణుల మార్గదర్శకత్వం — సంక్షేమ సూత్రాలను అర్థం చేసుకోవడంలో మీకు సహాయపడుతుంది।"
  },
  bn: {
    title: "স্বাস্থ্য ও সুস্থতা নিবন্ধ",
    subtitle: "সর্বোত্তম স্বাস্থ্য ও সুস্থতার জন্য প্রমাণ-ভিত্তিক বিশেষজ্ঞ নির্দেশনা — সুস্থতার নীতি বুঝতে ও স্বাস্থ্যকর অভ্যাস গড়তে সহায়তা।"
  },
  mr: {
    title: "आरोग्य आणि कल्याण लेख",
    subtitle: "चांगल्या आरोग्य आणि कल्याणासाठी पुराव्यावर आधारित तज्ज्ञ मार्गदर्शन — कल्याणाची तत्त्वे समजून घेण्यास आणि निरोगी सवयी लावण्यास मदत।"
  },
  gu: {
    title: "આરોગ્ય અને સ્વસ્થતા લેખો",
    subtitle: "શ્રેષ્ઠ આરોગ્ય અને સ્વસ્થતા માટે પુરાવા-આધારિત નિષ્ણાત માર્ગદર્શન — સ્વસ્થતાના સિદ્ધાંતો સમજવામાં અને તંદુરસ્ત આદતો અપનાવવામાં મદદ।"
  },
  kn: {
    title: "ಆರೋಗ್ಯ ಮತ್ತು ಕಲ್ಯಾಣ ಲೇಖನಗಳು",
    subtitle: "ಅತ್ಯುತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಕಲ್ಯಾಣಕ್ಕೆ ಪುರಾವೆ-ಆಧಾರಿತ ತಜ್ಞ ಮಾರ್ಗದರ್ಶನ — ಕಲ್ಯಾಣ ತತ್ವಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಆರೋಗ್ಯಕರ ಅಭ್ಯಾಸಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ।"
  },
  ml: {
    title: "ആരോഗ്യ & ക്ഷേമ ലേഖനങ്ങൾ",
    subtitle: "അനുയോജ്യമായ ആരോഗ്യത്തിനും ക്ഷേമത്തിനുമുള്ള തെളിവ് അടിസ്ഥാനമാക്കിയ വിദഗ്ധ മാർഗനിർദേശം — ക്ഷേമ തത്വങ്ങൾ മനസ്സിലാക്കാനും ആരോഗ്യകര ശീലങ്ങൾ നടപ്പാക്കാനും സഹായം।"
  }
};

const HealthArticles = ({ onBack }: HealthArticlesProps) => {
  const [language, setLanguage] = useState<string>("en");

  const currentArticles = articles[language] || articles.en;
  const currentLabels = pageLabels[language as keyof typeof pageLabels] || pageLabels.en;

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#FDFCF8' }} // Light cream background matching reference
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="rounded-full border-2 hover:scale-105 transition-all duration-200"
              style={{ 
                borderColor: '#2D2D2D',
                color: '#2D2D2D',
                backgroundColor: 'white'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-4" style={{ color: '#1A1A1A' }}>
                <BookOpen className="w-10 h-10" style={{ color: '#2D2D2D' }} />
                {currentLabels.title}
              </h1>
              <p className="text-lg leading-relaxed max-w-4xl" style={{ color: '#6B6B6B' }}>
                {currentLabels.subtitle}
              </p>
            </div>
          </div>

          {/* Language Selector - FIXED */}
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5" style={{ color: '#6B6B6B' }} />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger 
                className="w-[200px] border-2 [&>span]:text-gray-900 text-gray-900"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: 'white',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue 
                  placeholder="Select language"
                  className="text-gray-900 placeholder:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent 
                style={{ backgroundColor: 'white' }}
                className="bg-white"
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <SelectItem key={code} value={code} className="text-gray-900">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentArticles.map((article, index) => {
            const Icon = articleIcons[index];
            const colors = articleColors[index];
            
            return (
              <Card 
                key={index} 
                className="p-8 border-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#E5E5E5'
                }}
              >
                <div className="flex items-start gap-6">
                  
                  {/* Icon Section */}
                  <div 
                    className="flex-shrink-0 p-4 rounded-2xl border-2"
                    style={{ 
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }}
                  >
                    <Icon className="w-10 h-10" style={{ color: colors.icon }} />
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold mb-4 leading-tight" style={{ color: '#1A1A1A' }}>
                      {article.title}
                    </h3>
                    <p className="text-base leading-relaxed mb-6" style={{ color: '#4A4A4A' }}>
                      {article.description}
                    </p>
                    
                    {/* Tips Section */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
                        Key Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {article.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-3">
                            <div 
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: colors.icon }}
                            />
                            <span className="text-sm leading-relaxed" style={{ color: '#2D2D2D' }}>
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Read More Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                    💡 Evidence-based guidance
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: '#9B9B9B' }}>
                      Learn more
                    </span>
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Zap className="w-3 h-3" style={{ color: colors.icon }} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Trust Indicator */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: '#F8F8F8',
              borderColor: '#E5E5E5'
            }}
          >
            <Shield className="w-8 h-8 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Evidence-Based Content
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              All articles reviewed by certified healthcare professionals
            </p>
          </Card>

          {/* Multilingual Support */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: '#F8F8F8',
              borderColor: '#E5E5E5'
            }}
          >
            <Languages className="w-8 h-8 mx-auto mb-4" style={{ color: '#3B82F6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Multilingual Access
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Available in 9 Indian languages for better understanding
            </p>
          </Card>

          {/* Regular Updates */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: '#F8F8F8',
              borderColor: '#E5E5E5'
            }}
          >
            <Users className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B5CF6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Expert Contributors
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Content created by medical professionals and wellness experts
            </p>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: '#9B9B9B' }}>
            💡 <strong>Disclaimer:</strong> These articles provide general health information and should not replace professional medical advice. 
            Always consult with qualified healthcare providers for personalized medical guidance and treatment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthArticles;
