"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Train, User, Calendar, Phone, Mail, GraduationCap, MapPin, BadgeIcon as IdCard } from "lucide-react"
import { useNavigate } from "react-router-dom"


const educationLevels = ["10th", "12th", "Graduate", "Post-Graduate"]

const technicalDegrees = ["B.Tech", "B.E", "BCA", "B.Sc (CS)", "M.Tech", "M.E", "MCA", "M.Sc (CS)", "ITI"]

const zones = {
  "Southern Railway": ["Chennai", "Madurai", "Palakkad", "Salem", "Thiruvananthapuram", "Tiruchirappalli"],
  "Central Railway": ["Bhusawal", "Mumbai CR", "Nagpur", "Pune", "Solapur"],
  "Western Railway": ["Ahmedabad", "Bhavnagar", "Mumbai WR", "Rajkot", "Ratlam", "Vadodara"],
  "Eastern Railway": ["Asansol", "Howrah", "Malda", "Sealdah"],
  "Northern Railway": ["Ambala", "Delhi", "Firozpur", "Lucknow", "Moradabad", "Jammu"],
  "North Eastern Railway": ["Izzatnagar", "Lucknow", "Varanasi"],
  "South Eastern Railway": ["Adra", "Chakradharpur", "Kharagpur", "Ranchi"],
  "Northeast Frontier Railway": ["Alipurduar", "Katihar", "Lumding", "Rangiya", "Tinsukia"],
  "South Central Railway": ["Secunderabad", "Hyderabad", "Nanded"],
  "South Coast Railway": ["Visakhapatnam", "Vijayawada", "Guntur", "Guntakal"],
  "Konkan Railway": [],
  "East Central Railway": ["Danapur", "Dhanbad", "Mughalsarai", "Samastipur", "Sonpur"],
  "South East Central Railway": ["Bilaspur", "Nagpur", "Raipur"],
  "North Western Railway": ["Ajmer", "Bikaner", "Jaipur", "Jodhpur"],
  "East Coast Railway": ["Khurda Road", "Sambalpur", "Rayagada"],
  "North Central Railway": ["Agra", "Jhansi", "Prayagraj"],
  "South Western Railway": ["Bengaluru", "Hubballi", "Mysuru"],
  "West Central Railway": ["Bhopal", "Jabalpur", "Kota"],
}

export default function RailwayRegistrationForm() {
  
  const navigate= useNavigate();
  
  const [form, setForm] = useState({
    hrmsId: "",
    name: "",
    fatherName: "",
    dob: "",
    doj: "",
    mobile: "",
    email: "",
    education: "",
    technical: "",
    zone: "",
    division: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateHrmsId = (value) => {
    const alphabetOnly = /^[A-Za-z]+$/
    if (!value) return "HRMS ID is required"
    if (value.length !== 6) return "HRMS ID must be exactly 6 characters"
    if (!alphabetOnly.test(value)) return "HRMS ID must contain only alphabets"
    return ""
  }

  const validateMobile = (value) => {
    const mobilePattern = /^[0-9]{10}$/
    if (!value) return "Mobile number is required"
    if (!mobilePattern.test(value)) return "Mobile number must be 10 digits"
    return ""
  }

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "zone" ? { division: "" } : {}),
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Real-time validation for HRMS ID
    if (name === "hrmsId") {
      const error = validateHrmsId(value)
      setErrors((prev) => ({ ...prev, hrmsId: error }))
    }

    // Real-time validation for mobile
    if (name === "mobile") {
      const error = validateMobile(value)
      setErrors((prev) => ({ ...prev, mobile: error }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};

    if (!form.hrmsId) newErrors.hrmsId = "HRMS ID is required";
    else {
      const hrmsError = validateHrmsId(form.hrmsId);
      if (hrmsError) newErrors.hrmsId = hrmsError;
    }

    if (!form.name) newErrors.name = "Full name is required";
    if (!form.fatherName) newErrors.fatherName = "Father's name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.doj) newErrors.doj = "Date of joining is required";

    if (!form.mobile) newErrors.mobile = "Mobile number is required";
    else {
      const mobileError = validateMobile(form.mobile);
      if (mobileError) newErrors.mobile = mobileError;
    }

    if (!form.education) newErrors.education = "Education level is required";
    if (!form.technical) newErrors.technical = "Technical degree is required";
    if (!form.zone) newErrors.zone = "Railway zone is required";
    if (zones[form.zone]?.length > 0 && !form.division) {
      newErrors.division = "Division is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form data validated, navigating to test with state:", form);
      // Pass the form data to the /test route using navigation state.
      navigate("/test", { state: { formData: form } });
    }

    setIsSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Train className="h-10 w-10 text-gray-700" />
            <h1 className="text-4xl font-bold text-gray-900">Indian Railway</h1>
          </div>
          <p className="text-xl text-gray-600">Candidate Registration Portal</p>
          <Badge variant="outline" className="mt-2 border-gray-400 text-gray-700">
            Official Registration Form
          </Badge>
        </div>

        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="bg-gray-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Registration Details
            </CardTitle>
            <CardDescription className="text-gray-300">
              Please fill in all required information accurately
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* HRMS ID - Featured Field */}
              <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex items-center gap-2 mb-3">
                  <IdCard className="h-5 w-5 text-gray-700" />
                  <Label htmlFor="hrmsId" className="text-lg font-semibold text-gray-800">
                    HRMS ID *
                  </Label>
                </div>
                <Input
                  id="hrmsId"
                  name="hrmsId"
                  value={form.hrmsId}
                  onChange={(e) => handleChange("hrmsId", e.target.value.toUpperCase())}
                  placeholder="Enter 6-letter HRMS ID (e.g., ABCDEF)"
                  className="text-lg font-mono tracking-wider border-gray-300 focus:border-gray-500"
                  maxLength={6}
                />
                {errors.hrmsId && (
                  <Alert className="mt-2 border-gray-400 bg-gray-50">
                    <AlertDescription className="text-gray-700">{errors.hrmsId}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-gray-600 mt-2">Must be exactly 6 alphabetic characters</p>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g., Rajesh Kumar"
                      className={errors.name ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      value={form.fatherName}
                      onChange={(e) => handleChange("fatherName", e.target.value)}
                      placeholder="e.g., Suresh Kumar"
                      className={errors.fatherName ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                    />
                    {errors.fatherName && <p className="text-sm text-red-600">{errors.fatherName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth *
                    </Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      className={errors.dob ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                    />
                    {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doj" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Joining *
                    </Label>
                    <Input
                      id="doj"
                      name="doj"
                      type="date"
                      value={form.doj}
                      onChange={(e) => handleChange("doj", e.target.value)}
                      className={errors.doj ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                    />
                    {errors.doj && <p className="text-sm text-red-600">{errors.doj}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      placeholder="e.g., 9876543210"
                      maxLength={10}
                      className={errors.mobile ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                    />
                    {errors.mobile && <p className="text-sm text-red-600">{errors.mobile}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="e.g., rajesh@example.com"
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Educational Qualifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level *</Label>
                    <Select value={form.education} onValueChange={(value) => handleChange("education", value)}>
                      <SelectTrigger
                        className={errors.education ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                      >
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.education && <p className="text-sm text-red-600">{errors.education}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technical">Technical Degree *</Label>
                    <Select value={form.technical} onValueChange={(value) => handleChange("technical", value)}>
                      <SelectTrigger
                        className={errors.technical ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                      >
                        <SelectValue placeholder="Select Technical Degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicalDegrees.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.technical && <p className="text-sm text-red-600">{errors.technical}</p>}
                  </div>
                </div>
              </div>

              {/* Railway Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Railway Zone & Division
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="zone">Railway Zone *</Label>
                    <Select value={form.zone} onValueChange={(value) => handleChange("zone", value)}>
                      <SelectTrigger
                        className={errors.zone ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                      >
                        <SelectValue placeholder="Select Railway Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(zones).map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.zone && <p className="text-sm text-red-600">{errors.zone}</p>}
                  </div>

                  {zones[form.zone]?.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="division">Division *</Label>
                      <Select value={form.division} onValueChange={(value) => handleChange("division", value)}>
                        <SelectTrigger
                          className={errors.division ? "border-red-500" : "border-gray-300 focus:border-gray-500"}
                        >
                          <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones[form.zone].map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.division && <p className="text-sm text-red-600">{errors.division}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 text-lg rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? "Validating..." : "Proceed to Personality Test"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}