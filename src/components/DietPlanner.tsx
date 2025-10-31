import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChefHat, Calculator, Target, Utensils, Languages, TrendingUp, Activity, Users, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DietPlannerProps {
  onBack: () => void;
}

interface UserProfile {
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  goal: string;
  dietaryRestrictions: string;
  allergies: string;
  cuisine: string;
}

interface DietPlan {
  bmr: number;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  plan: string;
  tips: string[];
}

const DietPlanner = ({ onBack }: DietPlannerProps) => {
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
    dietaryRestrictions: "",
    allergies: "",
    cuisine: ""
  });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    if (gender === "male") {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  const calculateTotalCalories = (bmr: number, activityLevel: string, goal: string): number => {
    const activityMultipliers: Record<string, number> = {
      "sedentary": 1.2,
      "lightly_active": 1.375,
      "moderately_active": 1.55,
      "very_active": 1.725,
      "extremely_active": 1.9
    };

    let totalCalories = bmr * (activityMultipliers[activityLevel] || 1.2);

    switch (goal) {
      case "lose_weight":
        totalCalories -= 500;
        break;
      case "gain_weight":
        totalCalories += 500;
        break;
    }

    return Math.round(totalCalories);
  };

  const generateDietPlan = async () => {
    if (!profile.age || !profile.weight || !profile.height || !profile.gender) {
      toast({
        title: "Information Required",
        description: "Please complete all required fields to generate your personalized diet plan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const weight = parseFloat(profile.weight);
      const height = parseFloat(profile.height);
      const age = parseInt(profile.age);

      const bmr = calculateBMR(weight, height, age, profile.gender);
      const totalCalories = calculateTotalCalories(bmr, profile.activityLevel, profile.goal);

      const dietPrompt = `Create a personalized 7-day diet plan for a health-conscious individual:

HEALTH PROFILE:
- Demographics: ${age} years old, ${profile.gender}
- Physical Stats: ${weight}kg, ${height}cm
- Metabolic Rate: ${bmr} calories (BMR), Target: ${totalCalories} calories/day
- Activity Level: ${profile.activityLevel}, Health Goal: ${profile.goal}
- Dietary Preferences: ${profile.dietaryRestrictions || "No specific restrictions"}
- Food Allergies: ${profile.allergies || "None specified"}
- Cuisine Preference: ${profile.cuisine || "Mixed international"}

Please provide a comprehensive nutrition plan including:
1. Complete 7-day meal schedule (breakfast, lunch, dinner, 2 snacks)
2. Balanced macronutrients: 25% protein, 50% carbohydrates, 25% healthy fats
3. Detailed portion sizes and calorie breakdown per meal
4. 5 evidence-based nutrition tips for optimal health
5. Meal preparation suggestions for busy schedules
6. Respond in ${language === 'en' ? 'English' : 'the selected language'}

Focus on whole foods, balanced nutrition, and sustainable eating habits.`;

      const { data, error } = await supabase.functions.invoke("health-chat", {
        body: { message: dietPrompt, language }
      });

      if (error) throw error;

      const proteinCalories = Math.round(totalCalories * 0.25);
      const carbCalories = Math.round(totalCalories * 0.50);
      const fatCalories = Math.round(totalCalories * 0.25);

      const generatedPlan: DietPlan = {
        bmr,
        totalCalories,
        macros: {
          protein: Math.round(proteinCalories / 4),
          carbs: Math.round(carbCalories / 4),
          fats: Math.round(fatCalories / 9)
        },
        plan: data.response,
        tips: [
          "Hydrate consistently with 8-10 glasses of water throughout the day",
          "Maintain regular eating intervals to optimize metabolism and energy levels",
          "Include diverse colorful vegetables and fruits for essential micronutrients",
          "Practice mindful portion control using the balanced plate method",
          "Combine proper nutrition with regular physical activity for optimal results"
        ]
      };

      setDietPlan(generatedPlan);
      setStep(3);

    } catch (error) {
      console.error("Diet plan generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to create your diet plan. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#F8F8F8' }}
          >
            <Users className="w-6 h-6" style={{ color: '#2D2D2D' }} />
          </div>
          <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
            Personal Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="age" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Age (years) *
            </Label>
            <Input
              id="age"
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({...profile, age: e.target.value})}
              placeholder="Enter your age"
              className="h-12 text-base border-2 focus:ring-0"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Gender *
            </Label>
            <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
              <SelectTrigger 
                className="h-12 border-2 [&>span]:text-gray-900 text-gray-900"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: '#FAFAFA',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue 
                  placeholder="Select gender"
                  className="text-gray-900 placeholder:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent 
                style={{ backgroundColor: 'white' }}
                className="bg-white"
              >
                <SelectItem value="male" className="text-gray-900">Male</SelectItem>
                <SelectItem value="female" className="text-gray-900">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weight" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Weight (kg) *
            </Label>
            <Input
              id="weight"
              type="number"
              value={profile.weight}
              onChange={(e) => setProfile({...profile, weight: e.target.value})}
              placeholder="Your current weight"
              className="h-12 text-base border-2 focus:ring-0"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Height (cm) *
            </Label>
            <Input
              id="height"
              type="number"
              value={profile.height}
              onChange={(e) => setProfile({...profile, height: e.target.value})}
              placeholder="Your height in centimeters"
              className="h-12 text-base border-2 focus:ring-0"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Lifestyle & Goals */}
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#F8F8F8' }}
          >
            <Target className="w-6 h-6" style={{ color: '#2D2D2D' }} />
          </div>
          <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
            Lifestyle & Health Goals
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="activity" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Activity Level *
            </Label>
            <Select value={profile.activityLevel} onValueChange={(value) => setProfile({...profile, activityLevel: value})}>
              <SelectTrigger 
                className="h-12 border-2 [&>span]:text-gray-900 text-gray-900"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: '#FAFAFA',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue 
                  placeholder="Select your activity level"
                  className="text-gray-900 placeholder:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent 
                style={{ backgroundColor: 'white' }}
                className="bg-white"
              >
                <SelectItem value="sedentary" className="text-gray-900">
                  Sedentary (Desk job, minimal exercise)
                </SelectItem>
                <SelectItem value="lightly_active" className="text-gray-900">
                  Light Activity (1-3 days exercise/week)
                </SelectItem>
                <SelectItem value="moderately_active" className="text-gray-900">
                  Moderate Activity (3-5 days exercise/week)
                </SelectItem>
                <SelectItem value="very_active" className="text-gray-900">
                  Very Active (6-7 days exercise/week)
                </SelectItem>
                <SelectItem value="extremely_active" className="text-gray-900">
                  Extremely Active (Intense daily training)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="goal" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Primary Health Goal *
            </Label>
            <Select value={profile.goal} onValueChange={(value) => setProfile({...profile, goal: value})}>
              <SelectTrigger 
                className="h-12 border-2 [&>span]:text-gray-900 text-gray-900"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: '#FAFAFA',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue 
                  placeholder="Select your primary goal"
                  className="text-gray-900 placeholder:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent 
                style={{ backgroundColor: 'white' }}
                className="bg-white"
              >
                <SelectItem value="lose_weight" className="text-gray-900">
                  Lose Weight & Improve Health
                </SelectItem>
                <SelectItem value="maintain" className="text-gray-900">
                  Maintain Current Weight
                </SelectItem>
                <SelectItem value="gain_weight" className="text-gray-900">
                  Gain Weight & Build Muscle
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setStep(2)} 
        className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
        style={{ 
          backgroundColor: '#1A1A1A',
          color: 'white'
        }}
      >
        Next: Dietary Preferences →
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Dietary Preferences */}
      <div>
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#F8F8F8' }}
          >
            <Utensils className="w-6 h-6" style={{ color: '#2D2D2D' }} />
          </div>
          <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
            Dietary Preferences & Requirements
          </h3>
        </div>
        
        <div className="space-y-6 mt-6">
          <div>
            <Label htmlFor="cuisine" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Preferred Cuisine Style
            </Label>
            <Select value={profile.cuisine} onValueChange={(value) => setProfile({...profile, cuisine: value})}>
              <SelectTrigger 
                className="h-12 border-2 [&>span]:text-gray-900 text-gray-900"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: '#FAFAFA',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue 
                  placeholder="Select your preferred cuisine"
                  className="text-gray-900 placeholder:text-gray-500"
                />
              </SelectTrigger>
              <SelectContent 
                style={{ backgroundColor: 'white' }}
                className="bg-white"
              >
                <SelectItem value="indian" className="text-gray-900">Indian Cuisine</SelectItem>
                <SelectItem value="mediterranean" className="text-gray-900">Mediterranean</SelectItem>
                <SelectItem value="asian" className="text-gray-900">Asian Cuisine</SelectItem>
                <SelectItem value="western" className="text-gray-900">Western/American</SelectItem>
                <SelectItem value="mixed" className="text-gray-900">Mixed International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="restrictions" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Dietary Restrictions or Preferences
            </Label>
            <Textarea
              id="restrictions"
              value={profile.dietaryRestrictions}
              onChange={(e) => setProfile({...profile, dietaryRestrictions: e.target.value})}
              placeholder="e.g., Vegetarian, Vegan, Keto, Low-carb, Paleo, Intermittent fasting, etc."
              rows={4}
              className="text-base border-2 focus:ring-0 resize-none"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
            />
          </div>

          <div>
            <Label htmlFor="allergies" className="text-base font-medium mb-2 block" style={{ color: '#2D2D2D' }}>
              Food Allergies & Intolerances
            </Label>
            <Textarea
              id="allergies"
              value={profile.allergies}
              onChange={(e) => setProfile({...profile, allergies: e.target.value})}
              placeholder="e.g., Tree nuts, Dairy products, Gluten, Shellfish, Soy, Eggs, etc."
              rows={4}
              className="text-base border-2 focus:ring-0 resize-none"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)} 
          className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105"
          style={{ 
            borderColor: '#2D2D2D',
            color: '#2D2D2D',
            backgroundColor: 'white'
          }}
        >
          ← Back
        </Button>
        <Button 
          onClick={generateDietPlan} 
          disabled={isLoading} 
          className="flex-1 h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          style={{ 
            backgroundColor: '#1A1A1A',
            color: 'white'
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Your Plan...
            </div>
          ) : (
            "Generate My Diet Plan"
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (!dietPlan) return null;

    const getBMICategory = (bmi: number) => {
      if (bmi < 18.5) return { category: "Underweight", color: "#3B82F6" };
      if (bmi < 25) return { category: "Normal", color: "#10B981" };
      if (bmi < 30) return { category: "Overweight", color: "#F59E0B" };
      return { category: "Obese", color: "#EF4444" };
    };

    const bmi = parseFloat(profile.weight) / Math.pow(parseFloat(profile.height)/100, 2);
    const bmiInfo = getBMICategory(bmi);

    return (
      <div className="space-y-8">
        {/* Health Metrics */}
        <div>
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Your Health Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card 
              className="p-6 text-center border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="mb-3">
                <Scale className="w-8 h-8 mx-auto" style={{ color: '#6B6B6B' }} />
              </div>
              <h4 className="font-semibold text-sm mb-2" style={{ color: '#6B6B6B' }}>BMR</h4>
              <p className="text-3xl font-bold mb-1" style={{ color: '#1A1A1A' }}>{dietPlan.bmr}</p>
              <p className="text-sm" style={{ color: '#9B9B9B' }}>calories/day</p>
            </Card>
            
            <Card 
              className="p-6 text-center border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="mb-3">
                <Target className="w-8 h-8 mx-auto" style={{ color: '#10B981' }} />
              </div>
              <h4 className="font-semibold text-sm mb-2" style={{ color: '#6B6B6B' }}>Daily Target</h4>
              <p className="text-3xl font-bold mb-1" style={{ color: '#10B981' }}>{dietPlan.totalCalories}</p>
              <p className="text-sm" style={{ color: '#9B9B9B' }}>calories/day</p>
            </Card>
            
            <Card 
              className="p-6 text-center border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="mb-3">
                <TrendingUp className="w-8 h-8 mx-auto" style={{ color: bmiInfo.color }} />
              </div>
              <h4 className="font-semibold text-sm mb-2" style={{ color: '#6B6B6B' }}>BMI</h4>
              <p className="text-3xl font-bold mb-1" style={{ color: bmiInfo.color }}>{bmi.toFixed(1)}</p>
              <p className="text-sm" style={{ color: '#9B9B9B' }}>{bmiInfo.category}</p>
            </Card>
            
            <Card 
              className="p-6 text-center border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="mb-3">
                <Activity className="w-8 h-8 mx-auto" style={{ color: '#8B5CF6' }} />
              </div>
              <h4 className="font-semibold text-sm mb-2" style={{ color: '#6B6B6B' }}>Activity</h4>
              <p className="text-lg font-bold mb-1" style={{ color: '#1A1A1A' }}>
                {profile.activityLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-sm" style={{ color: '#9B9B9B' }}>level</p>
            </Card>
          </div>
        </div>

        {/* Macronutrients */}
        <Card 
          className="p-8 border-2 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: '#E5E5E5'
          }}
        >
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Daily Macronutrient Targets
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-4"
                style={{ backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }}
              >
                <span className="font-bold text-xl" style={{ color: '#3B82F6' }}>{dietPlan.macros.protein}g</span>
              </div>
              <p className="font-semibold text-lg mb-1" style={{ color: '#1A1A1A' }}>Protein</p>
              <p className="text-base" style={{ color: '#6B6B6B' }}>25% of calories</p>
            </div>
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-4"
                style={{ backgroundColor: '#F0FDF4', borderColor: '#10B981' }}
              >
                <span className="font-bold text-xl" style={{ color: '#10B981' }}>{dietPlan.macros.carbs}g</span>
              </div>
              <p className="font-semibold text-lg mb-1" style={{ color: '#1A1A1A' }}>Carbohydrates</p>
              <p className="text-base" style={{ color: '#6B6B6B' }}>50% of calories</p>
            </div>
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-4"
                style={{ backgroundColor: '#FFF7ED', borderColor: '#F59E0B' }}
              >
                <span className="font-bold text-xl" style={{ color: '#F59E0B' }}>{dietPlan.macros.fats}g</span>
              </div>
              <p className="font-semibold text-lg mb-1" style={{ color: '#1A1A1A' }}>Healthy Fats</p>
              <p className="text-base" style={{ color: '#6B6B6B' }}>25% of calories</p>
            </div>
          </div>
        </Card>

        {/* Diet Plan */}
        <Card 
          className="p-8 border-2 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: '#E5E5E5'
          }}
        >
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Your Personalized 7-Day Diet Plan
          </h3>
          <div 
            className="p-6 rounded-xl border overflow-auto max-h-96"
            style={{ 
              backgroundColor: '#FAFAFA',
              borderColor: '#E5E5E5'
            }}
          >
            <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans" style={{ color: '#1A1A1A' }}>
              {dietPlan.plan}
            </pre>
          </div>
        </Card>

        {/* Nutrition Tips */}
        <Card 
          className="p-8 border-2 shadow-sm"
          style={{ 
            backgroundColor: '#F8F8F8',
            borderColor: '#E5E5E5'
          }}
        >
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Evidence-Based Nutrition Tips
          </h3>
          <ul className="space-y-4">
            {dietPlan.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-4">
                <div 
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: '#1A1A1A' }}
                />
                <span className="text-base leading-relaxed" style={{ color: '#2D2D2D' }}>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setStep(1)} 
            className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: '#2D2D2D',
              color: '#2D2D2D',
              backgroundColor: 'white'
            }}
          >
            Create New Plan
          </Button>
          <Button 
            onClick={() => window.print()} 
            className="flex-1 h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: '#1A1A1A',
              color: 'white'
            }}
          >
            Save & Print Plan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#FDFCF8' }}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
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
                <ChefHat className="w-10 h-10" style={{ color: '#2D2D2D' }} />
                Personalized Diet Planner
              </h1>
              <p className="text-lg" style={{ color: '#6B6B6B' }}>
                Create a custom nutrition plan based on your health profile — helping you track wellness, 
                plan balanced diets, and stay on top of your fitness journey with precision.
              </p>
            </div>
          </div>

          {/* Language Selector */}
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
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'white' }}>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                <SelectItem value="ml">Malayalam (മലയാളം)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-300 ${
                step >= 1 ? 'shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: step >= 1 ? '#1A1A1A' : 'white',
                color: step >= 1 ? 'white' : '#9B9B9B',
                borderColor: step >= 1 ? '#1A1A1A' : '#E5E5E5'
              }}
            >
              1
            </div>
            <div 
              className="h-1 w-20 rounded transition-all duration-300"
              style={{ backgroundColor: step >= 2 ? '#1A1A1A' : '#E5E5E5' }}
            />
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-300 ${
                step >= 2 ? 'shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: step >= 2 ? '#1A1A1A' : 'white',
                color: step >= 2 ? 'white' : '#9B9B9B',
                borderColor: step >= 2 ? '#1A1A1A' : '#E5E5E5'
              }}
            >
              2
            </div>
            <div 
              className="h-1 w-20 rounded transition-all duration-300"
              style={{ backgroundColor: step >= 3 ? '#1A1A1A' : '#E5E5E5' }}
            />
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-300 ${
                step >= 3 ? 'shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: step >= 3 ? '#1A1A1A' : 'white',
                color: step >= 3 ? 'white' : '#9B9B9B',
                borderColor: step >= 3 ? '#1A1A1A' : '#E5E5E5'
              }}
            >
              3
            </div>
          </div>
        </div>

        {/* Content */}
        <Card 
          className="p-8 border-2 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: '#E5E5E5'
          }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </Card>
      </div>
    </div>
  );
};

export default DietPlanner;
