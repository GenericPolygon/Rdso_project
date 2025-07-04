

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Train, AlertTriangle, CheckCircle, XCircle, FileDown, BarChart3, LogOut } from "lucide-react"
import axios from "axios"
import DISCChart from "../components/DiscChart"

const personalityTypes = {
  "S/C": {
    title: "Reliable Analyst",
    suitability: "most",
    description:
      "Calm, patient, highly disciplined. Excellent for routine handling, protocol-following, and long shifts.",
  },
  C: {
    title: "Compliant",
    suitability: "most",
    description: "Naturally detail-oriented, accurate, rule-following – critical for rail safety.",
  },
  "C/S": {
    title: "Loyal Perfectionist",
    suitability: "most",
    description: "Balanced between rule-following and steady performance. Best for long-term responsibility.",
  },
  "C/D": {
    title: "The Enforcer",
    suitability: "most",
    description:
      "Analytical with decision-making under pressure. Ideal for complex train operations or supervisory loco pilots.",
  },
  S: {
    title: "Steady",
    suitability: "most",
    description:
      "Peaceful and reliable. Excellent under normal and repetitive conditions. May need training for emergency response.",
  },
  "D/C": {
    title: "Architect",
    suitability: "most",
    description: "Strong decision-maker with high accuracy. Good for leadership roles or handling breakdowns.",
  },
  "S/D": {
    title: "Determined Helper",
    suitability: "most",
    description: "Calm with task-focus. Reliable under pressure. Might struggle with fast adaptability unless trained.",
  },
  "C/I": {
    title: "Creative Analyst",
    suitability: "conditional",
    description:
      "Rule-following and expressive. Can be trained, but may overthink. Needs stricter protocol conditioning.",
  },
  "S/I": {
    title: "Compassionate Influencer",
    suitability: "conditional",
    description: "Friendly and steady. May be too people-focused or slow in emergencies. Needs more alertness drills.",
  },
  D: {
    title: "Dominant",
    suitability: "conditional",
    description: "Decisive but might bypass rules. Suitable only if strong discipline is instilled.",
  },
  "D/S": {
    title: "Driver Supporter",
    suitability: "conditional",
    description: "Confident and steady. Good balance, but needs focus on protocol reinforcement.",
  },
  "I/S": {
    title: "Harmonizer",
    suitability: "conditional",
    description: "Warm but possibly too trusting or distracted. Needs strict SOP training.",
  },
  I: {
    title: "Influencer",
    suitability: "least",
    description: "Too social and distracted. May not focus well under routine or strict rule-driven tasks.",
  },
  "I/D": {
    title: "Persuasive Leader",
    suitability: "least",
    description: "Bold and talkative. May challenge authority or overlook safety details.",
  },
  "D/I": {
    title: "Initiator",
    suitability: "least",
    description: "Action-oriented and assertive, but may ignore safety steps. Not ideal for rule-bound tasks.",
  },
  "I/C": {
    title: "Expressive Analyst",
    suitability: "least",
    description: "Conflict between creativity and rule-following. Can get mentally overloaded.",
  },
}

export default function Component() {
  const [hrmsId, setHrmsId] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState("")

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    navigate("/")
  }

  const fetchReport = async () => {
    if (!hrmsId.trim()) {
      setError("Please enter HRMS ID")
      return
    }

    const token = localStorage.getItem("adminToken")
    if (!token) {
      setError("No token found. Please log in again.")
      return
    }

    setLoading(true)
    setError("")
    setData(null)

    try {
      const response = await axios.get(`http://localhost:5000/api/report/${hrmsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setData(response.data)
    } catch (err) {
      console.error("Error fetching report:", err)
      if (err.response && err.response.status === 404) {
        setError("No report found for this HRMS ID.")
      } else {
        setError("Failed to fetch report. Please check HRMS ID and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError("")
    const token = localStorage.getItem("adminToken")
    if (!token) {
      setExportError("Authentication token not found.")
      setExporting(false)
      return
    }

    try {
      const response = await axios.get("http://localhost:5000/api/export-excel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      const today = new Date().toISOString().slice(0, 10)
      link.setAttribute("download", `registrations_export_${today}.xlsx`)
      document.body.appendChild(link)
      link.click()

      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error exporting data:", err)
      setExportError("Failed to export data. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  const getPersonalityInfo = (dominant) => {
    return (
      personalityTypes[dominant] || {
        title: "Unknown Type",
        suitability: "conditional",
        description: "Personality type not recognized in current analysis framework.",
      }
    )
  }

  const getSuitabilityBadge = (suitability) => {
    switch (suitability) {
      case "most":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Most Suitable
          </Badge>
        )
      case "conditional":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Conditionally Suitable
          </Badge>
        )
      case "least":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Least Suitable
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTraitAssessment = (trait, percentage) => {
    const assessments = {
      D: {
        high: "Strong leadership and decision-making under pressure",
        moderate: "Balanced assertiveness - ideal for emergency situations",
        low: "May need confidence building for critical decisions",
      },
      I: {
        high: "May be too social/distracted for focused operations",
        moderate: "Good communication skills without distraction",
        low: "Excellent focus on tasks - ideal for Loco Pilot role",
      },
      S: {
        high: "Excellent patience and consistency for long shifts",
        moderate: "Good stability with some adaptability",
        low: "May struggle with routine operations and patience",
      },
      C: {
        high: "Exceptional rule-following and safety compliance",
        moderate: "Good attention to procedures and protocols",
        low: "Needs strict training on safety protocols",
      },
    }

    const level = percentage >= 70 ? "high" : percentage >= 40 ? "moderate" : "low"
    return assessments[trait]?.[level] || "Assessment not available"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center relative">
            <Button variant="outline" onClick={handleLogout} className="absolute top-4 right-4">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Train className="w-8 h-8 text-blue-600" />
              <CardTitle className="text-2xl">DISC Analysis Report for Loco Pilots</CardTitle>
            </div>
            <CardDescription>Behavioral fitness evaluation for railway operations personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter HRMS ID"
                value={hrmsId}
                onChange={(e) => setHrmsId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchReport()}
              />
              <Button onClick={fetchReport} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Report"}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {data && (
          <>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal & Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">HRMS ID</p>
                    <p className="font-medium">{data.hrmsId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Father's Name</p>
                    <p className="font-medium">{data.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{new Date(data.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Joining</p>
                    <p className="font-medium">{new Date(data.doj).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium">{data.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{data.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="font-medium">{data.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Technical Qualification</p>
                    <p className="font-medium">{data.technical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Zone</p>
                    <p className="font-medium">{data.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Division</p>
                    <p className="font-medium">{data.division}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DISC Visualization Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  DISC Profile Visualization
                </CardTitle>
                <CardDescription>Visual representation of personality traits and their percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <DISCChart  
                  dScore={data.disc_d_score}
                  iScore={data.disc_i_score}
                  sScore={data.disc_s_score}
                  cScore={data.disc_c_score}
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-1"></div>
                    <span>Dominance: {data.disc_d_score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-2"></div>
                    <span>Influence: {data.disc_i_score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-3"></div>
                    <span>Steadiness: {data.disc_s_score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-4"></div>
                    <span>Compliance: {data.disc_c_score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DISC Assessment Scores */}
            <Card>
              <CardHeader>
                <CardTitle>DISC Assessment Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
                  <div className="lg:col-span-1 md:col-span-3 col-span-2">
                    <p className="text-sm text-gray-600">Dominant Type</p>
                    <p className="font-bold text-lg">{data.disc_dominant}</p>
                  </div>
                  <div className="lg:col-span-4 md:col-span-3 col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                      <div>
                        <p className="text-sm text-gray-600">D Score</p>
                        <p className="font-medium">{data.disc_d_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">I Score</p>
                        <p className="font-medium">{data.disc_i_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">S Score</p>
                        <p className="font-medium">{data.disc_s_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">C Score</p>
                        <p className="font-medium">{data.disc_c_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">D Percentage</p>
                        <p className="font-medium">{data.disc_d_percentage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">I Percentage</p>
                        <p className="font-medium">{data.disc_i_percentage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">S Percentage</p>
                        <p className="font-medium">{data.disc_s_percentage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">C Percentage</p>
                        <p className="font-medium">{data.disc_c_percentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personality Type Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Personality Type Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Dominant Type</p>
                    <p className="text-xl font-bold">{data.disc_dominant}</p>
                    <p className="text-lg text-gray-700">{getPersonalityInfo(data.disc_dominant).title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Suitability for Loco Pilot Role</p>
                    {getSuitabilityBadge(getPersonalityInfo(data.disc_dominant).suitability)}
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Analysis</p>
                    <p className="text-sm leading-relaxed">{getPersonalityInfo(data.disc_dominant).description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Trait Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Trait Analysis for Loco Pilot Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Dominance (D)</h4>
                        <span className="text-lg font-bold">{data.disc_d_percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{getTraitAssessment("D", data.disc_d_percentage)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Influence (I)</h4>
                        <span className="text-lg font-bold">{data.disc_i_percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{getTraitAssessment("I", data.disc_i_percentage)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Steadiness (S)</h4>
                        <span className="text-lg font-bold">{data.disc_s_percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{getTraitAssessment("S", data.disc_s_percentage)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Compliance (C)</h4>
                        <span className="text-lg font-bold">{data.disc_c_percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{getTraitAssessment("C", data.disc_c_percentage)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPersonalityInfo(data.disc_dominant).suitability === "most" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Highly Recommended:</strong> This personality profile is well-suited for Loco Pilot
                        responsibilities. The candidate demonstrates strong alignment with safety protocols, operational
                        consistency, and stress management requirements.
                      </AlertDescription>
                    </Alert>
                  )}

                  {getPersonalityInfo(data.disc_dominant).suitability === "conditional" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Conditional Recommendation:</strong> This candidate can be suitable with additional
                        training and monitoring. Focus on strengthening protocol adherence, stress management, and
                        safety consciousness through targeted development programs.
                      </AlertDescription>
                    </Alert>
                  )}

                  {getPersonalityInfo(data.disc_dominant).suitability === "least" && (
                    <Alert>
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Not Recommended:</strong> This personality profile presents significant challenges for
                        Loco Pilot role requirements. Consider alternative positions that better match the candidate's
                        behavioral strengths.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Ideal DISC Profile for Loco Pilots:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Dominance (D)</p>
                        <p className="text-gray-600">Moderate (40-60%)</p>
                      </div>
                      <div>
                        <p className="font-medium">Influence (I)</p>
                        <p className="text-gray-600">Low-Moderate (20-50%)</p>
                      </div>
                      <div>
                        <p className="font-medium">Steadiness (S)</p>
                        <p className="text-gray-600">High (60-80%)</p>
                      </div>
                      <div>
                        <p className="font-medium">Compliance (C)</p>
                        <p className="text-gray-600">High (70-90%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Questions Answered</p>
                    <p className="font-medium">{data.total_answered}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assessment Date</p>
                    <p className="font-medium">{new Date(data.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Report Generated</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Download all registration records from the database as an Excel file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export All Data to Excel
                </>
              )}
            </Button>
            {exportError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{exportError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}