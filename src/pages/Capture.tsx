import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Trash2,
  Recycle
} from 'lucide-react';

const Capture = () => {
  const [step, setStep] = useState<'pickup' | 'disposal' | 'verify'>('pickup');
  const [pickupImage, setPickupImage] = useState<string | null>(null);
  const [disposalImage, setDisposalImage] = useState<string | null>(null);
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });

  const userType = localStorage.getItem('userType') as 'collector' | 'employee';

  const simulateImageCapture = (type: 'pickup' | 'disposal') => {
    // Simulate image capture
    const mockImage = `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f3f4f6"/>
        <text x="100" y="75" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">
          ${type === 'pickup' ? 'Waste Pickup' : 'Waste Disposal'} Image
        </text>
      </svg>
    `)}`;
    
    if (type === 'pickup') {
      setPickupImage(mockImage);
      setStep('disposal');
    } else {
      setDisposalImage(mockImage);
      setStep('verify');
    }
  };

  const getCurrentLocation = () => {
    // Simulate GPS capture
    setLocation({
      lat: 12.9716 + (Math.random() - 0.5) * 0.01,
      lng: 77.5946 + (Math.random() - 0.5) * 0.01
    });
  };

  const submitReport = () => {
    // Simulate submission
    alert('Waste collection report submitted successfully!');
    setStep('pickup');
    setPickupImage(null);
    setDisposalImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole={userType} />
      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-eco rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Waste Collection Capture</h1>
            <p className="text-white/90">Document your waste collection process step by step</p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${step === 'pickup' ? 'text-eco-forest-primary' : pickupImage ? 'text-eco-success' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === 'pickup' ? 'border-eco-forest-primary bg-eco-forest-primary/10' : 
                    pickupImage ? 'border-eco-success bg-eco-success text-white' : 'border-muted-foreground'
                  }`}>
                    {pickupImage ? <CheckCircle className="h-4 w-4" /> : '1'}
                  </div>
                  <span className="font-medium">Waste Pickup</span>
                </div>
                
                <div className={`h-0.5 flex-1 mx-4 ${pickupImage ? 'bg-eco-success' : 'bg-muted'}`} />
                
                <div className={`flex items-center gap-2 ${step === 'disposal' ? 'text-eco-forest-primary' : step === 'verify' ? 'text-eco-success' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === 'disposal' ? 'border-eco-forest-primary bg-eco-forest-primary/10' : 
                    step === 'verify' ? 'border-eco-success bg-eco-success text-white' : 'border-muted-foreground'
                  }`}>
                    {disposalImage ? <CheckCircle className="h-4 w-4" /> : '2'}
                  </div>
                  <span className="font-medium">Waste Disposal</span>
                </div>
                
                <div className={`h-0.5 flex-1 mx-4 ${disposalImage ? 'bg-eco-success' : 'bg-muted'}`} />
                
                <div className={`flex items-center gap-2 ${step === 'verify' ? 'text-eco-forest-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === 'verify' ? 'border-eco-forest-primary bg-eco-forest-primary/10' : 'border-muted-foreground'
                  }`}>
                    3
                  </div>
                  <span className="font-medium">Verify & Submit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Step Content */}
          {step === 'pickup' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-eco-forest-primary" />
                  Step 1: Capture Waste Pickup Location
                </CardTitle>
                <CardDescription>
                  Take a photo of the waste at its original location before collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Button 
                      onClick={() => simulateImageCapture('pickup')}
                      className="w-full h-32" 
                      variant="outline"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-eco-forest-primary" />
                        <p className="font-medium">Capture Pickup Image</p>
                        <p className="text-sm text-muted-foreground">Tap to take photo</p>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={getCurrentLocation}
                      variant="eco" 
                      className="w-full"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Current Location
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Location Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Lat: {location.lat.toFixed(6)}<br />
                        Lng: {location.lng.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className="bg-eco-forest-primary/5 border border-eco-forest-primary/20 rounded-lg p-4">
                      <h4 className="font-medium text-eco-forest-primary mb-2">📸 Capture Tips</h4>
                      <ul className="text-sm space-y-1 text-eco-forest-primary/80">
                        <li>• Ensure waste is clearly visible</li>
                        <li>• Include surrounding area for context</li>
                        <li>• Good lighting for better recognition</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'disposal' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-eco-ocean" />
                  Step 2: Capture Waste Disposal Location
                </CardTitle>
                <CardDescription>
                  Take a photo of the waste at the designated disposal location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {pickupImage && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">✅ Pickup Image Captured</h4>
                        <img src={pickupImage} alt="Pickup" className="w-full h-24 object-cover rounded" />
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => simulateImageCapture('disposal')}
                      className="w-full h-32" 
                      variant="outline"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-eco-ocean" />
                        <p className="font-medium">Capture Disposal Image</p>
                        <p className="text-sm text-muted-foreground">Tap to take photo</p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-eco-ocean/5 border border-eco-ocean/20 rounded-lg p-4">
                      <h4 className="font-medium text-eco-ocean mb-2">🎯 Accuracy Check</h4>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-eco-success" />
                        <span className="text-sm">Within 1m of designated dustbin</span>
                      </div>
                    </div>
                    
                    <div className="bg-eco-ocean/5 border border-eco-ocean/20 rounded-lg p-4">
                      <h4 className="font-medium text-eco-ocean mb-2">🗑️ Disposal Tips</h4>
                      <ul className="text-sm space-y-1 text-eco-ocean/80">
                        <li>• Ensure waste is properly disposed</li>
                        <li>• Include dustbin in the frame</li>
                        <li>• Verify location accuracy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'verify' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-eco-success" />
                  Step 3: Verify & Submit Report
                </CardTitle>
                <CardDescription>
                  Review your captured data and submit for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Captured Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {pickupImage && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Pickup</p>
                            <img src={pickupImage} alt="Pickup" className="w-full h-20 object-cover rounded" />
                          </div>
                        )}
                        {disposalImage && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Disposal</p>
                            <img src={disposalImage} alt="Disposal" className="w-full h-20 object-cover rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-eco-success/5 border border-eco-success/20 rounded-lg p-4">
                      <h4 className="font-medium text-eco-success mb-2">🤖 AI Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Waste Type:</span>
                          <Badge variant="default">Mixed Plastic</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Weight:</span>
                          <Badge variant="secondary">8.5 kg</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Points Earned:</span>
                          <Badge variant="default">+42 pts</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Location Verification</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-eco-success" />
                          <span>GPS coordinates verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-eco-success" />
                          <span>Disposal location confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-eco-success" />
                          <span>Distance accuracy: 0.8m</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={submitReport}
                      variant="success" 
                      className="w-full h-12"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Capture;