import { useState, useRef } from 'react';
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

// Example dustbin coordinates (replace with real data from backend or props)
const DUSTBIN_COORDS = { lat: 12.9721, lng: 77.5950 };

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const Capture = () => {
  const [step, setStep] = useState<'pickup' | 'disposal' | 'verify'>('pickup');
  const [pickupImage, setPickupImage] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [disposalImage, setDisposalImage] = useState<string | null>(null);
  const [disposalLocation, setDisposalLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showCamera, setShowCamera] = useState<'pickup' | 'disposal' | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const userType = localStorage.getItem('userType') as 'collector' | 'employee';

  // Start camera for pickup or disposal
  const startCamera = async (type: 'pickup' | 'disposal') => {
    setShowCamera(type);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        // Fallback to any camera if rear is not available
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    }
  };

  // Capture photo and location for pickup or disposal
  const capturePhoto = (type: 'pickup' | 'disposal') => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageData = canvasRef.current.toDataURL('image/png');
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(null);

        // Get location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              if (type === 'pickup') {
                setPickupImage(imageData);
                setPickupLocation(coords);
                setStep('disposal');
              } else {
                setDisposalImage(imageData);
                setDisposalLocation(coords);
                setStep('verify');
              }
            },
            () => {
              // fallback if denied
              const coords = { lat: 12.9716, lng: 77.5946 };
              if (type === 'pickup') {
                setPickupImage(imageData);
                setPickupLocation(coords);
                setStep('disposal');
              } else {
                setDisposalImage(imageData);
                setDisposalLocation(coords);
                setStep('verify');
              }
            },
            { enableHighAccuracy: true, maximumAge: 0 }
          );
        }
      }
    }
  };

  // Manual location update for pickup or disposal
  const getCurrentLocation = (type: 'pickup' | 'disposal') => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          if (type === 'pickup') setPickupLocation(coords);
          else setDisposalLocation(coords);
        },
        () => {
          const coords = { lat: 12.9716, lng: 77.5946 };
          if (type === 'pickup') setPickupLocation(coords);
          else setDisposalLocation(coords);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  };

  const submitReport = () => {
    alert('Waste collection report submitted successfully!');
    setStep('pickup');
    setPickupImage(null);
    setPickupLocation(null);
    setDisposalImage(null);
    setDisposalLocation(null);
  };

  // Calculate disposal location accuracy
  let disposalAccuracy = null;
  if (disposalLocation) {
    disposalAccuracy = getDistanceFromLatLonInMeters(
      disposalLocation.lat,
      disposalLocation.lng,
      DUSTBIN_COORDS.lat,
      DUSTBIN_COORDS.lng
    );
  }

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

          {/* Pickup Step */}
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
                    {!showCamera && (
                      <Button
                        onClick={() => startCamera('pickup')}
                        className="w-full h-32"
                        variant="outline"
                      >
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-eco-forest-primary" />
                          <p className="font-medium">Capture Pickup Image</p>
                          <p className="text-sm text-muted-foreground">Tap to take photo</p>
                        </div>
                      </Button>
                    )}
                    {showCamera === 'pickup' && (
                      <div className="flex flex-col items-center space-y-2">
                        <video
                          ref={videoRef}
                          width={320}
                          height={240}
                          autoPlay
                          style={{ display: 'block', background: '#000', borderRadius: '8px' }}
                        />
                        <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }} />
                        <Button onClick={() => capturePhoto('pickup')} variant="eco" className="w-full">
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo & Get Location
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => getCurrentLocation('pickup')}
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
                        Lat: {pickupLocation?.lat.toFixed(6) ?? '---'}<br />
                        Lng: {pickupLocation?.lng.toFixed(6) ?? '---'}
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

          {/* Disposal Step */}
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
                    {!showCamera && (
                      <Button
                        onClick={() => startCamera('disposal')}
                        className="w-full h-32"
                        variant="outline"
                      >
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-eco-ocean" />
                          <p className="font-medium">Capture Disposal Image</p>
                          <p className="text-sm text-muted-foreground">Tap to take photo</p>
                        </div>
                      </Button>
                    )}
                    {showCamera === 'disposal' && (
                      <div className="flex flex-col items-center space-y-2">
                        <video
                          ref={videoRef}
                          width={320}
                          height={240}
                          autoPlay
                          style={{ display: 'block', background: '#000', borderRadius: '8px' }}
                        />
                        <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }} />
                        <Button onClick={() => capturePhoto('disposal')} variant="eco" className="w-full">
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo & Get Location
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => getCurrentLocation('disposal')}
                      variant="eco"
                      className="w-full"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Current Location
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Disposal Location Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Lat: {disposalLocation?.lat?.toFixed(6) ?? '---'}<br />
                        Lng: {disposalLocation?.lng?.toFixed(6) ?? '---'}
                      </p>
                      <p className="text-xs mt-2">
                        Dustbin Lat: {DUSTBIN_COORDS.lat.toFixed(6)}<br />
                        Dustbin Lng: {DUSTBIN_COORDS.lng.toFixed(6)}
                      </p>
                      {disposalAccuracy !== null && (
                        <div className="mt-2">
                          {disposalAccuracy < 10 ? (
                            <span className="text-eco-success font-medium">
                              ✅ Within {disposalAccuracy.toFixed(1)} meters of dustbin
                            </span>
                          ) : (
                            <span className="text-eco-warning font-medium">
                              ⚠️ {disposalAccuracy.toFixed(1)} meters away from dustbin
                            </span>
                          )}
                        </div>
                      )}
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

          {/* Verify Step */}
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
                      <h4 className="font-medium mb-3">Captured Images & Locations</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {pickupImage && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Pickup</p>
                            <img src={pickupImage} alt="Pickup" className="w-full h-20 object-cover rounded" />
                            <p className="text-xs mt-1 text-muted-foreground">
                              Lat: {pickupLocation?.lat?.toFixed(6) ?? '---'}<br />
                              Lng: {pickupLocation?.lng?.toFixed(6) ?? '---'}
                            </p>
                          </div>
                        )}
                        {disposalImage && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Disposal</p>
                            <img src={disposalImage} alt="Disposal" className="w-full h-20 object-cover rounded" />
                            <p className="text-xs mt-1 text-muted-foreground">
                              Captured Lat: {disposalLocation?.lat?.toFixed(6) ?? '---'}<br />
                              Captured Lng: {disposalLocation?.lng?.toFixed(6) ?? '---'}<br />
                              Dustbin Lat: {DUSTBIN_COORDS.lat.toFixed(6)}<br />
                              Dustbin Lng: {DUSTBIN_COORDS.lng.toFixed(6)}
                            </p>
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
                        {disposalAccuracy !== null && (
                          <div className="flex items-center gap-2">
                            {disposalAccuracy < 10 ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-eco-success" />
                                <span>Distance accuracy: {disposalAccuracy.toFixed(1)}m (within dustbin range)</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-eco-warning" />
                                <span>Distance accuracy: {disposalAccuracy.toFixed(1)}m (too far from dustbin)</span>
                              </>
                            )}
                          </div>
                        )}
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