import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Train, AlertTriangle, FileDown, BarChart3, LogOut, BookOpen } from "lucide-react";
import axios from "axios";
import DISCChart from "../components/DiscChart"; // Make sure this path is correct

// --- START: Data and Logic from DISC PDF ---

// Helper function to get the descriptive level for a score from the PDF
const getScoreLevel = (score) => {
  if (score >= 48) return "Extreme HIGH";
  if (score >= 40) return "Strong";
  if (score > 30) return "High"; // Custom addition for scores between 31-39
  if (score >= 29 && score <= 31) return "Midline";
  if (score >= 20) return "Strong (Low)";
  if (score >= 12) return "Extreme LOW";
  return "Very Low";
};

// Descriptions for each DISC trait from Page 2 of the PDF
const discTraitDescriptions = {
  D: {
    title: "Dominant",
    measures: "How a person solves problems and responds to challenges",
    higherScore:
      "The more active and aggressive in trying to overcome problems and obstacles; person will anger more quickly",
    lowerScore: "The greater the tendency to gather data prior to making a decision; person will be slower to anger",
  },
  I: {
    title: "Influencing",
    measures: "How a person attempts to influence or persuade others",
    higherScore:
      "The more verbal and persuasive in trying to influence toward his/her way of thinking; person will be more joyful and optimistic",
    lowerScore: "The more person will use data and facts; person will be more pessimistic",
  },
  S: {
    title: "Steadiness",
    measures: "The pace at which a person undertakes activities and responsibilities",
    higherScore:
      "The more person prefers to start, complete one project at a time, also more resistant to change; person will be less emotional, more difficult to read",
    lowerScore: "The more person will want faster pace and change; person will be more emotional and expressive",
  },
  C: {
    title: "Compliant",
    measures: "How a person responds to rules and regulations set by others",
    higherScore: "The more person will comply to rules set by others; person will be motivated more out of fear",
    lowerScore: "The more person will challenge rules and seek independence; person will be more fearless",
  },
};

// Personality patterns from Pages 3 & 4 of the PDF, with corrected syntax.
const personalityPatternsData = {
    "D_I_EQUAL": {
        sequence: "D=I",
        pattern: "PERSUADER: Influencer/Implementer/Inspires",
        subtraits: "Self-motivation, Independence, Enthusiasm, Self-confidence",
        description:
          "High energy, optimistic, aggressive, confident; goal-minded, harnesses people to accomplish goals; can be impatient, having little time for details; loses interest once challenge is gone; goal is control of environment; fears losing, failing, loss of prestige.",
    },
    IS: {
        sequence: "IS; SI",
        pattern: "RELATER: Advisor/Merciful/Counselor",
        subtraits: "Friendliness, Self-confidence, Patience, Persistence",
        description:
          "Warm, sympathetic, understanding; good listener, stable, dependable; won't force ideas on others; criticism of his/her work a personal affront; can overuse the indirect approach; goal is maintaining friendships; fears social rejection.",
    },
    SCI: {
        sequence: "SCI; SIC",
        pattern: "SUPPORTER: Advocate/Peacemaker/Agent",
        subtraits: "Friendliness, Patience, Co-operativeness",
        description:
          "Can be very detail-oriented; moderate, thorough, dependable; steady, sociable, independent, individualistic; tends to support underdog; goal is acceptance from others; fears dissension, conflict.",
    },
    IC: {
        sequence: "IC; CI",
        pattern: "PROMOTER/ANALYZER: Assessor/Teacher/Appraiser",
        subtraits: "Friendliness, Enthusiasm, Co-operativeness, Sensitivity",
        description:
          "Outgoing, at home with strangers, develops friends easily; promotes projects of others and his/her own; seeks freedom from control; goal is approval, popularity; fears loss of social recognition.",
    },
    DS: {
        sequence: "DS; DSC; SD",
        pattern: "CONDUCTOR/COORDINATOR: Attainer/Achiever/Perseveres",
        subtraits: "Efficiency, Independence, Thoughtfulness, Persistence, Accuracy",
        description:
          "Objective, analytical, determined, task-oriented; independent, questioning, practical; may appear blunt and non-demonstrative; goal is personal accomplishment (sometimes at expense of the group); fears those with different or inferior work standards.",
    },
    DI: {
        sequence: "DI",
        pattern: "PERSUADER: Concluder/Doer/Gets results",
        subtraits: "Self-motivation, Independence, Enthusiasm, Self-confidence",
        description:
          "Forceful, direct, individualistic; can be impatient, competitive; good leadership abilities; high standards, critical when standards not met; goal is dominance and independence; fears slowness or being seen as too jovial.",
    },
    I: {
        sequence: "I",
        pattern: "PROMOTER: Convincer/Persuader/Promoter",
        subtraits: "Friendliness, Enthusiasm, Self-confidence",
        description:
          "Enthusiastic, optimistic, articulate in communication; can become careless, inconsistent and disorganized, but tries to look good and please others; goal is social approval and prestige; fears loss of social approval, conflict.",
    },
    DC: {
        sequence: "DC; DCS; CD",
        pattern: "IMPLEMENTOR/CONDUCTOR: Designer/Administrator/Creator",
        subtraits: "Efficiency, Self-motivation, Accuracy, Sensitivity, Thoughtfulness",
        description:
          "Sensitive to problems, creative in finding solutions; high in foresight, often quite intelligent; can overuse bluntness and criticism; bored with routine, prefers working alone, doesn't trust easily; goal is dominance, discovering unique solutions; fears not being influential.",
    },
    D: {
        sequence: "D",
        pattern: "CONDUCTOR: Establisher/Visionary/Developer",
        subtraits: "Efficiency, Self-motivation, Independence",
        description:
          "High ego strength, high standards; approaches issues alone rather than drawing others into the process; can be manipulative, controlling; has vision of “big picture”; very direct, forceful; goal is new challenges, opportunities; fears loss of control, lack of challenge.",
    },
    SDC: {
        sequence: "SDC; SCD",
        pattern: "COORDINATOR/SUPPORTER: Inquirer/Investigator/Consistent",
        subtraits: "Efficiency, Thoughtfulness, Accuracy",
        description:
          "Patient, controlled, enjoys digging for clues and facts; easy-going and amiable; consistent, loyal, accommodating; slow to take initiative, doesn't adapt quickly to change; holds grudges, internalizes conflict; goal is maintaining clear systems; fears change, disorganization.",
    },
    C: {
        sequence: "C",
        pattern: "ANALYZER: Logical Thinker/Analytical/Objective",
        subtraits: "Co-operativeness, Accuracy, Sensitivity",
        description:
          "Practical, proper, discrete, accurate; self-evaluating, critical of self and others; enjoys detail and logic; makes decisions slowly from logic rather than emotion; can over-analyze, be hurt easily; goal is to develop control, correctness; fears criticism, ridicule.",
    },
    CIS: {
        sequence: "CIS; CSI; ISC; ICS",
        pattern: "COORDINATOR/ANALYZER: Practitioner/Realist/Steadfast",
        subtraits: "Friendliness, Patience, Co-operativeness",
        description:
          "Results-oriented, verbally fluent, loyal; friendly, enthusiastic, informal, talkative; may worry too much about what others think; can intellectualize and become restless and impatient; goal is to accomplish results through others; fears rejection, loss of security.",
    },
    CS: {
        sequence: "CS; SC",
        pattern: "COORDINATOR: Precisionist/Traditionalist/Perfectionist",
        subtraits: "Patience, Thoughtfulness, Co-operativeness, Accuracy",
        description:
          "Orderly, systematic, precise, attentive to detail; tactful, highly diplomatic, extremely conscientious; can become bogged down in details, dislikes sudden changes; prefer protected, secure environment; goal is security; fears antagonism.",
    },
    ID: {
        sequence: "ID",
        pattern: "PERSUADER: Prompter/Communicator/Persuader",
        subtraits: "Self-motivation, Independence, Enthusiasm, Self-confidence",
        description:
          "Outgoing, high interest in people, trusting; can gain respect and admiration from varied types of individuals; can be impulsive, overly enthusiastic, inattentive to the “little things”; prefers variety; goal is authority and prestige; fears rejection, being taken advantage of.",
    },
    S: {
        sequence: "S",
        pattern: "SUPPORTER: Technician/Specialist/Steady",
        subtraits: "Patience, Thoughtfulness, Persistence",
        description:
          "Patient, loyal, consistent, helpful to friends; steady, calculating, reserved; not bored by routine; needs clear guidelines and rules; avoids confrontation, internalizes feelings; goal is maintaining status quo and an environment with few changes; fears loss of security, unplanned change.",
    },
    STRESS: {
        sequence: "All scores around 30",
        pattern: "Transition/Stress pattern",
        subtraits: "N/A",
        description:
          "Lack of goal clarity; insufficient action planning, confusion, uncertainty, anxiety about expectations; behavior alternates between furious activity to slow, methodical action; can be brought on by periods of change—new job, new home, bad health, etc. Person will make quick decisions and then try to gain approval from others.",
    },
};

// Function to find the personality pattern based on scores
const determinePersonalityPattern = (scores) => {
    const { D, I, S, C } = scores;
    const scoreMap = [
        { letter: "D", score: D },
        { letter: "I", score: I },
        { letter: "S", score: S },
        { letter: "C", score: C },
    ];

    const highScores = scoreMap.filter((item) => item.score > 30).sort((a, b) => b.score - a.score);

    if (
        highScores.length >= 2 &&
        highScores[0].score === highScores[1].score &&
        ((highScores[0].letter === "D" && highScores[1].letter === "I") ||
         (highScores[0].letter === "I" && highScores[1].letter === "D"))
    ) {
        return personalityPatternsData["D_I_EQUAL"];
    }

    let sequence = "";
    if (highScores.length > 0) {
        sequence = highScores.map((item) => item.letter).join("");
    } else {
        const allScores = scoreMap.map((s) => s.score);
        const isStress = allScores.every((s) => s >= 28 && s <= 32);
        if (isStress) return personalityPatternsData.STRESS;
        
        const highestOverall = [...scoreMap].sort((a, b) => b.score - a.score)[0];
        sequence = highestOverall.letter;
    }

    const findPattern = (seq) => {
        for (const key in personalityPatternsData) {
            const pattern = personalityPatternsData[key];
            const aliases = pattern.sequence.split(";").map((s) => s.trim());
            if (aliases.includes(seq)) return pattern;
        }
        return null;
    };

    let foundPattern = findPattern(sequence);
    if (!foundPattern && sequence.length > 2) {
        foundPattern = findPattern(sequence.substring(0, 2));
    }
    if (!foundPattern && sequence.length > 1) {
        foundPattern = findPattern(sequence.substring(0, 1));
    }

    return (
        foundPattern || {
            pattern: "Unique Combination",
            sequence: sequence,
            subtraits: "N/A",
            description: `A specific pre-defined pattern for "${sequence}" was not found. Refer to the individual trait descriptions above to understand the combination of these dominant characteristics.`,
        }
    );
};

// A simple bar chart component for displaying a single score
const DiscScoreBar = ({ score, label, colorClass }) => {
    const level = getScoreLevel(score);
    const levelColors = {
      "Extreme HIGH": "bg-red-500 text-white",
      "Strong": "bg-orange-500 text-white",
      "High": "bg-yellow-400 text-gray-800",
      "Midline": "bg-green-500 text-white",
      "Strong (Low)": "bg-blue-400 text-white",
      "Extreme LOW": "bg-indigo-500 text-white",
      "Very Low": "bg-gray-400 text-white",
    };
  
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold">{label}</h4>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelColors[level]}`}>{level}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl w-10 text-center">{score}</span>
          <div className="w-full bg-gray-200 rounded-full h-3.5">
            <div
              className={`${colorClass} h-3.5 rounded-full`}
              style={{ width: `${(score / 55) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
};

// The main component that renders the detailed report
const DetailedDiscReport = ({ scores }) => {
  const patternInfo = determinePersonalityPattern(scores);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Your scores and their corresponding intensity levels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiscScoreBar score={scores.D} label="D - Dominance" colorClass="bg-chart-1" />
          <DiscScoreBar score={scores.I} label="I - Influence" colorClass="bg-chart-2" />
          <DiscScoreBar score={scores.S} label="S - Steadiness" colorClass="bg-chart-3" />
          <DiscScoreBar score={scores.C} label="C - Compliance" colorClass="bg-chart-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Traits</CardTitle>
          <CardDescription>What each DISC factor means based on your scores.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(discTraitDescriptions).map(([key, value], index) => {
            const score = scores[key];
            const isHigh = score > 30;
            return (
              <div key={key}>
                <h3 className="font-bold text-lg text-gray-800">
                  {value.title} ({key})
                </h3>
                <p className="text-sm text-gray-500 italic mb-2">{value.measures}</p>
                <p className="text-sm">
                  <span className={`font-semibold ${isHigh ? "text-blue-600" : "text-gray-600"}`}>
                    {isHigh ? "A higher score suggests:" : "A lower score suggests:"}
                  </span>{" "}
                  {isHigh ? value.higherScore : value.lowerScore}
                </p>
                {index < 3 && <Separator className="my-4" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deduced Personality Pattern</CardTitle>
          <CardDescription className="text-base font-semibold text-blue-700">{patternInfo.pattern}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-md mb-1">Sequence</h4>
            <p className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded">{patternInfo.sequence}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-md mb-1">Associated Subtraits</h4>
            <p className="text-sm text-gray-700">{patternInfo.subtraits}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-md mb-1">Pattern Description</h4>
            <p className="text-sm leading-relaxed text-gray-700">{patternInfo.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- END: Data and Logic from DISC PDF ---

export default function Component() {
  const [hrmsId, setHrmsId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const fetchReport = async () => {
    if (!hrmsId.trim()) {
      setError("Please enter HRMS ID");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/report/${hrmsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      if (err.response && err.response.status === 404) {
        setError("No report found for this HRMS ID.");
      } else {
        setError("Failed to fetch report. Please check HRMS ID and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError("");
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setExportError("Authentication token not found.");
      setExporting(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/export-excel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute("download", `registrations_export_${today}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting data:", err);
      setExportError("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center relative">
            <Button variant="outline" onClick={handleLogout} className="absolute top-4 right-4">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Train className="w-8 h-8 text-blue-600" />
              <CardTitle className="text-2xl">DISC Personality Report</CardTitle>
            </div>
            <CardDescription>Behavioral analysis based on the DISC model.</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  DISC Profile Visualization
                </CardTitle>
                <CardDescription>Visual representation of personality traits scores.</CardDescription>
              </CardHeader>
              <CardContent>
                <DISCChart
                  dScore={data.disc_d_score}
                  iScore={data.disc_i_score}
                  sScore={data.disc_s_score}
                  cScore={data.disc_c_score}
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Detailed DISC Personality Report
                </CardTitle>
                <CardDescription>
                  This analysis provides a deep look into behavioral patterns based on your scores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DetailedDiscReport
                  scores={{
                    D: data.disc_d_score,
                    I: data.disc_i_score,
                    S: data.disc_s_score,
                    C: data.disc_c_score,
                  }}
                />
              </CardContent>
            </Card>

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
  );
}