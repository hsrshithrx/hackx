import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentBookingProps {
  onBack: () => void;
}

const AppointmentBooking = ({ onBack }: AppointmentBookingProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    reason: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Appointment Booked Successfully!",
      description: `Your consultation has been scheduled for ${formData.date} at ${formData.time}. Confirmation details sent to ${formData.email}.`
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      reason: ""
    });

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#FDFCF8' }} // Light cream background like the reference
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
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
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
              Book Your Consultation
            </h1>
            <p className="text-lg" style={{ color: '#6B6B6B' }}>
              Schedule an appointment with our healthcare professionals — helping you track wellness, 
              plan balanced care, and stay on top of your health journey with ease and precision.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <Card 
              className="p-8 border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#F8F8F8' }}
                    >
                      <Users className="w-5 h-5" style={{ color: '#2D2D2D' }} />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: '#1A1A1A' }}>
                      Personal Information
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="h-12 text-base border-2 focus:ring-0"
                      style={{ 
                        borderColor: '#E5E5E5',
                        backgroundColor: '#FAFAFA',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="h-12 text-base border-2 focus:ring-0"
                        style={{ 
                          borderColor: '#E5E5E5',
                          backgroundColor: '#FAFAFA',
                          color: '#1A1A1A'
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 000-0000"
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

                {/* Appointment Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#F8F8F8' }}
                    >
                      <CalendarIcon className="w-5 h-5" style={{ color: '#2D2D2D' }} />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: '#1A1A1A' }}>
                      Appointment Details
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                        Preferred Date *
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="h-12 text-base border-2 focus:ring-0"
                        style={{ 
                          borderColor: '#E5E5E5',
                          backgroundColor: '#FAFAFA',
                          color: '#1A1A1A'
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                        Preferred Time *
                      </Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="h-12 text-base border-2 focus:ring-0"
                        style={{ 
                          borderColor: '#E5E5E5',
                          backgroundColor: '#FAFAFA',
                          color: '#1A1A1A'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                      Reason for Visit *
                    </Label>
                    <Input
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of your health concern or consultation type"
                      className="h-12 text-base border-2 focus:ring-0"
                      style={{ 
                        borderColor: '#E5E5E5',
                        backgroundColor: '#FAFAFA',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: '#1A1A1A',
                      color: 'white'
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Booking Your Appointment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5" />
                        Book Appointment
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            
            {/* What to Expect Card */}
            <Card 
              className="p-6 border-2"
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5" style={{ color: '#2D2D2D' }} />
                <h4 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                  What to Expect
                </h4>
              </div>
              <ul className="space-y-3 text-sm" style={{ color: '#4A4A4A' }}>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#2D2D2D' }}></div>
                  Confirmation email within 15 minutes
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#2D2D2D' }}></div>
                  24-hour reminder before appointment
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#2D2D2D' }}></div>
                  Easy rescheduling up to 2 hours prior
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#2D2D2D' }}></div>
                  Virtual consultations available
                </li>
              </ul>
            </Card>

            {/* Healthcare Professional Card */}
            <Card 
              className="p-6 border-2"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5" style={{ color: '#2D2D2D' }} />
                <h4 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                  Professional Care
                </h4>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                Our certified healthcare professionals are committed to providing 
                personalized care tailored to your specific health needs and wellness goals.
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6B6B6B' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                  Licensed & Certified
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card 
              className="p-6 border-2"
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#E5E5E5'
              }}
            >
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                Need Help?
              </h4>
              <p className="text-sm mb-3" style={{ color: '#4A4A4A' }}>
                For urgent matters or assistance with booking:
              </p>
              <div className="text-sm space-y-1" style={{ color: '#2D2D2D' }}>
                <div className="font-medium">📞 (555) 123-4567</div>
                <div className="font-medium">📧 support@veeva.com</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
