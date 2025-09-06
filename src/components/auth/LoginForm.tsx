import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Smartphone, Users, Recycle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (userType: 'collector' | 'employee') => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userType, setUserType] = useState<'collector' | 'employee'>('collector');
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.length !== 12) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your registered mobile number for the OTP",
      });
    }, 2000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userType);
      toast({
        title: "Login Successful",
        description: `Welcome to EcoWaste Management System!`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-eco flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EcoWaste</h1>
          <p className="text-white/90">Smart Waste Management System</p>
        </div>

        <Card className="shadow-elevation backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Shield className="h-5 w-5 text-eco-forest-primary" />
              Secure Login
            </CardTitle>
            <CardDescription>
              {step === 'aadhaar' 
                ? 'Enter your Aadhaar number to receive OTP'
                : 'Enter the OTP sent to your mobile number'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'aadhaar' ? (
              <form onSubmit={handleAadhaarSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">I am a:</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: 'collector' | 'employee') => setUserType(value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="collector" id="collector" />
                      <Label htmlFor="collector" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        Waste Collector
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employee" id="employee" />
                      <Label htmlFor="employee" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        Govt Employee
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Aadhaar Input */}
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="Enter 12-digit Aadhaar number"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="text-center tracking-wider"
                    maxLength={12}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="eco"
                  disabled={isLoading || aadhaarNumber.length !== 12}
                >
                  {isLoading ? (
                    <>
                      <Smartphone className="mr-2 h-4 w-4 animate-pulse" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center tracking-widest text-lg"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('aadhaar')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="eco"
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                </div>
              </form>
            )}

            {/* Privacy Notice */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>🔒 Your data is secure and encrypted</p>
              <p>We use Aadhaar only for identity verification</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;