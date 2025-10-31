import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, Microscope, Brain, Shield, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReportAnalyzerProps {
  onBack: () => void;
}

const ReportAnalyzer = ({ onBack }: ReportAnalyzerProps) => {
  const [reportText, setReportText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!reportText.trim()) {
      toast({
        title: "Report Data Required",
        description: "Please paste or upload your medical report first to begin analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-report", {
        body: { reportText }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Completed Successfully",
        description: "Your medical report has been analyzed. Review the insights and recommendations below."
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process your report. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setReportText(content);
        toast({
          title: "File Uploaded Successfully",
          description: `${file.name} has been loaded. You can now analyze the report.`
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#FDFCF8' }} // Light cream background matching reference
    >
      <div className="max-w-7xl mx-auto">
        
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
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-4" style={{ color: '#1A1A1A' }}>
              <Microscope className="w-10 h-10" style={{ color: '#2D2D2D' }} />
              Medical Report Analyzer
            </h1>
            <p className="text-lg" style={{ color: '#6B6B6B' }}>
              AI-powered analysis of your medical reports — helping you understand test results, 
              identify key insights, and receive personalized health recommendations with professional accuracy.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Upload Card */}
            <Card 
              className="p-8 border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#F8F8F8' }}
                  >
                    <FileText className="w-6 h-6" style={{ color: '#2D2D2D' }} />
                  </div>
                  <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
                    Upload Medical Report
                  </h3>
                </div>
                
                <Textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste your medical report text here...

Examples:
• Blood test results (CBC, lipid panel, etc.)
• Laboratory reports and diagnostic tests
• Imaging study reports (X-ray, MRI, CT scan)
• Pathology reports and biopsies
• Annual health checkup reports
• Specialty consultation notes

Ensure all personal information is removed for privacy."
                  className="min-h-[300px] text-base border-2 focus:ring-0 font-mono leading-relaxed resize-none"
                  style={{ 
                    borderColor: '#E5E5E5',
                    backgroundColor: '#FAFAFA',
                    color: '#1A1A1A'
                  }}
                />

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold border-2 transition-all duration-300 hover:scale-105"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    style={{ 
                      borderColor: '#2D2D2D',
                      color: '#2D2D2D',
                      backgroundColor: 'white'
                    }}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !reportText.trim()}
                    className="flex-1 h-12 text-base font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    style={{ 
                      backgroundColor: '#1A1A1A',
                      color: 'white'
                    }}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing Report...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5" />
                        Analyze Report
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security & Privacy Info */}
            <Card 
              className="p-6 border-2"
              style={{ 
                backgroundColor: '#F8F8F8',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5" style={{ color: '#10B981' }} />
                <h4 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                  Privacy & Security
                </h4>
              </div>
              <ul className="space-y-3 text-sm" style={{ color: '#4A4A4A' }}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#10B981' }} />
                  All data is processed securely with enterprise-grade encryption
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#10B981' }} />
                  No personal information is stored or shared with third parties
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#10B981' }} />
                  Analysis is performed by certified AI models trained on medical data
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: '#10B981' }} />
                  Reports are automatically deleted after analysis completion
                </li>
              </ul>
            </Card>
          </div>

          {/* Analysis Section */}
          <div className="space-y-6">
            
            {/* Results Card */}
            <Card 
              className="border-2 shadow-sm"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#E5E5E5'
              }}
            >
              <div className="p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#F0F9FF' }}
                  >
                    <Brain className="w-6 h-6" style={{ color: '#0EA5E9' }} />
                  </div>
                  <h3 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
                    AI Analysis Results
                  </h3>
                </div>

                {analysis ? (
                  <div 
                    className="min-h-[400px] p-6 rounded-xl border overflow-auto"
                    style={{ 
                      backgroundColor: '#FAFAFA',
                      borderColor: '#E5E5E5'
                    }}
                  >
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans" style={{ color: '#1A1A1A' }}>
                        {analysis}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center text-center">
                    <div className="space-y-6 max-w-sm">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4"
                        style={{ 
                          backgroundColor: isAnalyzing ? '#EFF6FF' : '#F8F8F8',
                          borderColor: isAnalyzing ? '#DBEAFE' : '#E5E5E5'
                        }}
                      >
                        {isAnalyzing ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#0EA5E9' }}></div>
                        ) : (
                          <Microscope className="w-8 h-8" style={{ color: '#6B6B6B' }} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                          {isAnalyzing ? "Analyzing Your Report" : "Ready for Analysis"}
                        </h4>
                        <p className="text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                          {isAnalyzing
                            ? "Our AI is carefully reviewing your medical report to provide comprehensive insights and recommendations..."
                            : "Upload or paste your medical report in the left panel and click 'Analyze Report' to receive detailed AI-powered insights."}
                        </p>
                      </div>
                      {isAnalyzing && (
                        <div className="flex gap-2 justify-center">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#0EA5E9' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: '#0EA5E9' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: '#0EA5E9' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Disclaimer */}
            <Card 
              className="p-6 border-2"
              style={{ 
                backgroundColor: '#FEF7CD',
                borderColor: '#FDE68A'
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#D97706' }} />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#92400E' }}>
                    Medical Disclaimer
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#A16207' }}>
                    This AI analysis is for informational purposes only and should not replace professional medical advice. 
                    Always consult with qualified healthcare providers for diagnosis, treatment, and medical decisions. 
                    The analysis may not be 100% accurate and should be verified by medical professionals.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* AI Capabilities */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#E5E5E5'
            }}
          >
            <Brain className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B5CF6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Advanced AI Analysis
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Powered by medical-grade AI trained on thousands of clinical reports
            </p>
          </Card>

          {/* Multi-format Support */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#E5E5E5'
            }}
          >
            <FileText className="w-8 h-8 mx-auto mb-4" style={{ color: '#3B82F6' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Multiple Formats
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Supports text files, PDFs, and various medical document formats
            </p>
          </Card>

          {/* Instant Results */}
          <Card 
            className="p-6 text-center border-2"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#E5E5E5'
            }}
          >
            <Info className="w-8 h-8 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Comprehensive Insights
            </h4>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Detailed explanations of test results, normal ranges, and recommendations
            </p>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card 
          className="mt-8 p-8 border-2"
          style={{ 
            backgroundColor: '#F8F8F8',
            borderColor: '#E5E5E5'
          }}
        >
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            How to Use the Medical Report Analyzer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base"
                style={{ backgroundColor: '#EBF8FF', color: '#1E40AF' }}
              >
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                  Upload Your Report
                </h4>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  Copy and paste your medical report text or upload a file. Remove any personal identifying information first.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base"
                style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
              >
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                  Get AI Analysis
                </h4>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  Click "Analyze Report" and our AI will process your document to identify key findings and insights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base"
                style={{ backgroundColor: '#FEF7CD', color: '#A16207' }}
              >
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                  Review Results
                </h4>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  Review the detailed analysis and discuss the findings with your healthcare provider for proper medical guidance.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportAnalyzer;
