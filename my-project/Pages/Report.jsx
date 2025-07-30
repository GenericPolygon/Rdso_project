

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, Train, AlertTriangle, BarChart3, LogOut, BookOpen, 
  Target, CheckCircle, XCircle, Users, User, Check, AlertCircle as AlertCircleIcon, 
  PlusCircle, GitCompareArrows, Download, FileDown
} from "lucide-react";
import axios from "axios";
import DISCChart from "../components/DiscChart"; // Make sure this path is correct

// Dependencies: jspdf, html2canvas, recharts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- START: Data and Logic ---

const getScoreLevel = (score) => {
  if (score >= 48) return "Extreme HIGH";
  if (score >= 40) return "Strong";
  if (score > 30) return "High";
  if (score >= 29 && score <= 31) return "Midline";
  if (score >= 20) return "Strong (Low)";
  if (score >= 12) return "Extreme LOW";
  return "Very Low";
};  

const discTraitDescriptions = {
    D: { title: "Dominant", measures: "How a person solves problems and responds to challenges", generalCharacteristics: ["Direct", "Decisive", "High ego strength", "Problem-solver", "Risk-taker", "Self-starter", "Innovative", "Challenges status quo"], possibleWeaknesses: ["Oversteps authority", "Argumentative", "Dislikes routine", "Attempts too much at once", "Opinionated", "Poor listener"] },
    I: { title: "Influencing", measures: "How a person attempts to influence or persuade others", generalCharacteristics: ["Enthusiastic", "Trusting", "Optimistic", "Encouraging", "Persuasive", "Talkative", "Impulsive", "Emotional", "Sense of humor", "Peacemaker"], possibleWeaknesses: ["Inattentive to detail", "More concerned with popularity than results", "Oversuses gestures", "Listens when convenient", "Undisciplined"] },
    S: { title: "Steadiness", measures: "The pace at which a person undertakes activities and responsibilities", generalCharacteristics: ["Good listener", "Possessive", "Steady", "Predictable", "Understanding", "Friendly", "Reliable", "Dependable", "Patient", "Empathetic"], possibleWeaknesses: ["Resists change", "Adapts slowly to change", "Holds a grudge", "Oversensitive", "Critical", "Difficulty prioritizing", "Stingy", "Stubborn"] },
    C: { title: "Compliant", measures: "How a person responds to rules and regulations set by others", generalCharacteristics: ["Accurate", "Analytical", "Careful", "Conscientious", "Fact-finder", "Precise", "High standards", "Systematic", "Even-tempered", "Realistic"], possibleWeaknesses: ["Bogged down in details", "Won't verbalize feelings", "Gives in, won't argue", "Bound by procedures", "Needs clear boundaries", "Moody", "Negative"] }
};

const personalityPatternsData = {
    "D_I_EQUAL": { sequence: "D=I", pattern: "PERSUADER: Influencer/Implementer/Inspires", subtraits: "SelfMotivation, Independence, Enthusiasm, SelfConfidence" }, IS: { sequence: "IS; SI", pattern: "RELATER: Advisor/Merciful/Counselor", subtraits: "Friendliness, SelfConfidence, Patience, Persistence" }, SCI: { sequence: "SCI; SIC", pattern: "SUPPORTER: Advocate/Peacemaker/Agent", subtraits: "Friendliness, Patience, CoOperativeness" }, IC: { sequence: "IC; CI", pattern: "PROMOTER/ANALYZER: Assessor/Teacher/Appraiser", subtraits: "Friendliness, Enthusiasm, CoOperativeness, Sensitivity" }, DS: { sequence: "DS; DSC; SD", pattern: "CONDUCTOR/COORDINATOR: Attainer/Achiever/Perseveres", subtraits: "Efficiency, Independence, Thoughtfulness, Persistence, Accuracy" }, DI: { sequence: "DI", pattern: "PERSUADER: Concluder/Doer/Gets results", subtraits: "SelfMotivation, Independence, Enthusiasm, SelfConfidence" }, I: { sequence: "I", pattern: "PROMOTER: Convincer/Persuader/Promoter", subtraits: "Friendliness, Enthusiasm, SelfConfidence" }, DC: { sequence: "DC; DCS; CD", pattern: "IMPLEMENTOR/CONDUCTOR: Designer/Administrator/Creator", subtraits: "Efficiency, SelfMotivation, Accuracy, Sensitivity, Thoughtfulness" }, D: { sequence: "D", pattern: "CONDUCTOR: Establisher/Visionary/Developer", subtraits: "Efficiency, SelfMotivation, Independence" }, SDC: { sequence: "SDC; SCD", pattern: "COORDINATOR/SUPPORTER: Inquirer/Investigator/Consistent", subtraits: "Efficiency, Thoughtfulness, Accuracy" }, C: { sequence: "C", pattern: "ANALYZER: Logical Thinker/Analytical/Objective", subtraits: "CoOperativeness, Accuracy, Sensitivity" }, CIS: { sequence: "CIS; CSI; ISC; ICS", pattern: "COORDINATOR/ANALYZER: Practitioner/Realist/Steadfast", subtraits: "Friendliness, Patience, CoOperativeness" }, CS: { sequence: "CS; SC", pattern: "COORDINATOR: Precisionist/Traditionalist/Perfectionist", subtraits: "Patience, Thoughtfulness, CoOperativeness, Accuracy" }, ID: { sequence: "ID", pattern: "PERSUADER: Prompter/Communicator/Persuader", subtraits: "SelfMotivation, Independence, Enthusiasm, SelfConfidence" }, S: { sequence: "S", pattern: "SUPPORTER: Technician/Specialist/Steady", subtraits: "Patience, Thoughtfulness, Persistence" }, STRESS: { sequence: "All scores around 30", pattern: "Transition/Stress pattern", subtraits: "N/A" },
};

const subtraitDescriptions = {
    Accuracy: { title: "Accuracy", description: "Individuals for whom getting things just right is the main goal. They check and recheck their work, avoid risks, and communicate cautiously." }, CoOperativeness: { title: "Co-operativeness", description: "People who prefer team environments, rely on rules and procedures, and seek practical support from others to maintain positive relationships." }, Efficiency: { title: "Efficiency", description: "Motivated by results, direct and assertive, but not interested in personal matters. Willing to compromise detail to achieve goals." }, Enthusiasm: { title: "Enthusiasm", description: "Animated and expressive, outgoing and energetic. Varies in assertiveness depending on Dominance levels." }, Friendliness: { title: "Friendliness", description: "Social, warm, and open. Strong communicators but easily distracted and struggle in confrontational situations." }, Independence: { title: "Independence", description: "Self-reliant individuals who dislike rules and prefer following their own ideas. Often entrepreneurial and competitive." }, Patience: { title: "Patience", description: "Calm and slow-paced. Comfortable with repetitive work, optimistic about others, and conflict-averse." }, Persistence: { title: "Persistence", description: "Tenacious and loyal, resistant to change, and work best with long-term focus on single tasks." }, SelfConfidence: { title: "Self-confidence", description: "Socially confident and comfortable in almost any social setting. May act impulsively but are unafraid to initiate contact." }, SelfMotivation: { title: "Self-motivation", description: "Highly action-oriented, urgent, and goal-driven. Thrive under pressure and embrace personal responsibility." }, Sensitivity: { title: "Sensitivity", description: "Highly observant and aware of subtle changes. Easily distracted due to a low boredom threshold." }, Thoughtfulness: { title: "Thoughtfulness", description: "Careful planners who avoid impulsive decisions. Reliable and consistent, though challenged by deadlines." }
};

const determinePersonalityPattern = (scores) => {
    const { D, I, S, C } = scores;
    const scoreMap = [{ letter: "D", score: D }, { letter: "I", score: I }, { letter: "S", score: S }, { letter: "C", score: C }];
    const highScores = scoreMap.filter((item) => item.score > 30).sort((a, b) => b.score - a.score);
    if (highScores.length >= 2 && highScores[0].score === highScores[1].score && ((highScores[0].letter === "D" && highScores[1].letter === "I") || (highScores[0].letter === "I" && highScores[1].letter === "D"))) return personalityPatternsData["D_I_EQUAL"];
    let sequence = "";
    if (highScores.length > 0) sequence = highScores.map((item) => item.letter).join("");
    else {
        if (scoreMap.map(s => s.score).every((s) => s >= 28 && s <= 32)) return personalityPatternsData.STRESS;
        sequence = [...scoreMap].sort((a, b) => b.score - a.score)[0].letter;
    }
    const findPattern = (seq) => {
        for (const key in personalityPatternsData) {
            const pattern = personalityPatternsData[key];
            if (pattern.sequence.split(";").map((s) => s.trim()).includes(seq)) return pattern;
        } return null;
    };
    let foundPattern = findPattern(sequence);
    if (!foundPattern && sequence.length > 2) foundPattern = findPattern(sequence.substring(0, 2));
    if (!foundPattern && sequence.length > 1) foundPattern = findPattern(sequence.substring(0, 1));
    return foundPattern || { pattern: "Unique Combination", sequence: sequence, subtraits: "N/A" };
};

// --- MERGED & REFINED COMPARISON COMPONENT ---
const HighSpeedDriverComparison = ({ scores }) => {
  const [showComparison, setShowComparison] = useState(false);
  const idealRanges = {
    D: { min: 18, max: 30, name: "Dominance" }, I: { min: 18, max: 30, name: "Influence" }, S: { min: 32, max: 48, name: "Steadiness" }, C: { min: 36, max: 48, name: "Conscientiousness" },
  };
  const radarData = [
    { trait: "D", "Your Score": scores.D, "Ideal Minimum": idealRanges.D.min }, { trait: "I", "Your Score": scores.I, "Ideal Minimum": idealRanges.I.min }, { trait: "S", "Your Score": scores.S, "Ideal Minimum": idealRanges.S.min }, { trait: "C", "Your Score": scores.C, "Ideal Minimum": idealRanges.C.min },
  ];
  const getFitAssessment = (score, range) => {
    if (score >= range.min && score <= range.max) return { text: "Ideal Fit", className: "text-green-600 bg-green-100", Icon: CheckCircle };
    if (score < range.min) return { text: "Below Ideal Range", className: "text-yellow-600 bg-yellow-100", Icon: XCircle };
    return { text: "Above Ideal Range", className: "text-red-600 bg-red-100", Icon: XCircle };
  };
  const idealProfileData = {
    pattern: "CS / SC", dominantTraits: ["C", "S"], characteristics: ["Accurate", "Dependable", "Methodical", "Patient", "Systematic", "Supportive", "Analytical", "Detail-oriented", "Rule-following", "Organized", "High standards", "Quality-focused", "Calm under pressure", "Consistent", "Good with routines"]
  };
  const userPatternInfo = determinePersonalityPattern(scores);
  const userPrimarySequence = userPatternInfo.sequence.split(';')[0].trim().replace('=', '');
  const userDominantTraits = userPrimarySequence.length > 0 && !userPrimarySequence.includes("All scores") ? userPrimarySequence.split('') : [];
  const userCharacteristics = [...new Set(userDominantTraits.flatMap(trait => discTraitDescriptions[trait]?.generalCharacteristics || []))];
  const matchingTraits = userCharacteristics.filter(trait => idealProfileData.characteristics.includes(trait));
  const missingTraits = idealProfileData.characteristics.filter(trait => !userCharacteristics.includes(trait));
  const additionalTraits = userCharacteristics.filter(trait => !idealProfileData.characteristics.includes(trait));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div><CardTitle>Role-Fit Analysis: High-Speed Driver</CardTitle><CardDescription>Compare this profile against the ideal traits for the role.</CardDescription></div>
          <Button onClick={() => setShowComparison(!showComparison)}><GitCompareArrows className="mr-2 h-4 w-4" />{showComparison ? "Hide Comparison" : "Show Comparison"}</Button>
        </div>
      </CardHeader>
      {showComparison && (
        <CardContent className="space-y-6 pt-6">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" />Score Comparison</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div><h4 className="font-semibold text-center mb-2">Comparison Radar Chart</h4><ResponsiveContainer width="100%" height={300}><RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}><PolarGrid /><PolarAngleAxis dataKey="trait" /><PolarRadiusAxis angle={30} domain={[0, 55]} /><Tooltip /><Legend /><Radar name="Ideal Minimum" dataKey="Ideal Minimum" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} /><Radar name="Your Score" dataKey="Your Score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} /></RadarChart></ResponsiveContainer></div>
              <div><h4 className="font-semibold mb-2">Detailed Breakdown</h4><div className="space-y-3">{Object.keys(idealRanges).map(key => {const score = scores[key]; const range = idealRanges[key]; const assessment = getFitAssessment(score, range); return (<div key={key} className="p-3 border rounded-lg bg-gray-50/50"><div className="flex justify-between items-center font-semibold"><span>{range.name} ({key})</span><span>Your Score: {score}</span></div><div className="text-sm text-gray-500 mt-1">Ideal Range: {range.min} - {range.max}</div><div className={`mt-2 text-sm font-medium inline-flex items-center gap-2 px-2 py-1 rounded-md ${assessment.className}`}><assessment.Icon className="h-4 w-4" />{assessment.text}</div></div>);})}</div></div>
            </div>
          </div>
          <Separator />
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Trait-Fit Analysis</h3>
            <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-4 rounded-md">
              <div className="space-y-4"><h4 className="font-bold flex items-center gap-2"><Users className="text-blue-600"/>Ideal Profile</h4><div><p className="font-semibold text-sm">Ideal Pattern</p><p className="font-mono text-blue-700">{idealProfileData.pattern}</p></div><div><p className="font-semibold text-sm">Key Characteristics</p><div className="flex flex-wrap gap-2">{idealProfileData.characteristics.map(c => <span key={c} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md border border-blue-200">{c}</span>)}</div></div></div>
              <div className="space-y-4"><h4 className="font-bold flex items-center gap-2"><User className="text-green-600"/>Your Profile</h4><div><p className="font-semibold text-sm">Determined Pattern</p><p className="font-mono text-green-700">{userPatternInfo.pattern}</p></div><div><p className="font-semibold text-sm">Your Characteristics</p><div className="flex flex-wrap gap-2">{userCharacteristics.length > 0 ? userCharacteristics.map(c => <span key={c} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md border border-green-200">{c}</span>) : <p className="text-sm text-gray-500">No characteristics from dominant traits.</p>}</div></div></div>
            </div>
            <div className="mt-4 space-y-3">
              <div><h4 className="font-semibold flex items-center gap-2 mb-2"><Check className="text-green-500"/>Matching Traits</h4>{matchingTraits.length > 0 ? <div className="flex flex-wrap gap-2">{matchingTraits.map(t => <span key={t} className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-md">{t}</span>)}</div> : <p className="text-sm text-gray-500">No direct matches found.</p>}</div>
              <div><h4 className="font-semibold flex items-center gap-2 mb-2"><AlertCircleIcon className="text-yellow-500"/>Areas for Development</h4>{missingTraits.length > 0 ? <div className="flex flex-wrap gap-2">{missingTraits.map(t => <span key={t} className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">{t}</span>)}</div> : <p className="text-sm text-gray-500">All ideal traits are present.</p>}</div>
              <div><h4 className="font-semibold flex items-center gap-2 mb-2"><PlusCircle className="text-indigo-500"/>Your Additional Traits</h4>{additionalTraits.length > 0 ? <div className="flex flex-wrap gap-2">{additionalTraits.map(t => <span key={t} className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">{t}</span>)}</div> : <p className="text-sm text-gray-500">No additional traits from your dominant profile.</p>}</div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// --- Standard Detailed Report Component ---
const DetailedDiscReport = ({ scores }) => {
  const patternInfo = determinePersonalityPattern(scores);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Score Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3"><span className="font-bold text-xl w-10 text-center">{scores.D}</span><div className="w-full bg-gray-200 rounded-full h-3.5"><div className="bg-chart-1 h-3.5 rounded-full" style={{ width: `${(scores.D / 55) * 100}%` }}></div></div><span className="w-28 text-right">{getScoreLevel(scores.D)}</span></div>
          <div className="flex items-center gap-3"><span className="font-bold text-xl w-10 text-center">{scores.I}</span><div className="w-full bg-gray-200 rounded-full h-3.5"><div className="bg-chart-2 h-3.5 rounded-full" style={{ width: `${(scores.I / 55) * 100}%` }}></div></div><span className="w-28 text-right">{getScoreLevel(scores.I)}</span></div>
          <div className="flex items-center gap-3"><span className="font-bold text-xl w-10 text-center">{scores.S}</span><div className="w-full bg-gray-200 rounded-full h-3.5"><div className="bg-chart-3 h-3.5 rounded-full" style={{ width: `${(scores.S / 55) * 100}%` }}></div></div><span className="w-28 text-right">{getScoreLevel(scores.S)}</span></div>
          <div className="flex items-center gap-3"><span className="font-bold text-xl w-10 text-center">{scores.C}</span><div className="w-full bg-gray-200 rounded-full h-3.5"><div className="bg-chart-4 h-3.5 rounded-full" style={{ width: `${(scores.C / 55) * 100}%` }}></div></div><span className="w-28 text-right">{getScoreLevel(scores.C)}</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Deduced Personality Pattern</CardTitle><CardDescription className="text-base font-semibold text-blue-700">{patternInfo.pattern}</CardDescription></CardHeader>
        <CardContent className="space-y-6"><div><h4 className="font-semibold text-md mb-1">Sequence</h4><p className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded">{patternInfo.sequence}</p></div>
          {patternInfo.subtraits && patternInfo.subtraits !== "N/A" && <Separator />}
          {patternInfo.subtraits && patternInfo.subtraits !== "N/A" && (<div><h4 className="font-semibold text-md mb-2">Associated Subtraits</h4><ul className="space-y-4">{(patternInfo.subtraits).split(",").map((s) => s.trim()).filter(Boolean).map((traitKey) => {const trait = subtraitDescriptions[traitKey]; return (<li key={traitKey} className="bg-gray-50 p-3 rounded shadow-sm"><p className="text-md font-semibold text-gray-800 mb-1">{trait?.title || traitKey}</p><p className="text-sm text-gray-600 leading-relaxed">{trait?.description || "No description available."}</p></li>);})}</ul></div>)}
        </CardContent>
      </Card>
      <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg">
        <div className="mb-8 text-center"><h1 className="text-3xl font-bold text-gray-800 mb-2">DISC Trait Definitions</h1></div>
        <div className="space-y-8">{Object.entries(discTraitDescriptions).map(([key, trait]) => (<div key={key} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"><div className="mb-4"><h2 className="text-2xl font-bold text-gray-800">{trait.title} <span className="text-lg font-medium text-gray-500">({key})</span></h2><p className="text-gray-600 italic mt-1">{trait.measures}</p></div><div className="grid md:grid-cols-2 gap-6"><div><h4 className="font-semibold text-gray-700 mb-2">General Characteristics</h4><div className="flex flex-wrap gap-2">{trait.generalCharacteristics.map((char, idx) => <span key={idx} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded border border-green-200">{char}</span>)}</div></div><div><h4 className="font-semibold text-gray-700 mb-2">Possible Weaknesses</h4><div className="flex flex-wrap gap-2">{trait.possibleWeaknesses.map((w, idx) => <span key={idx} className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded border border-orange-200">{w}</span>)}</div></div></div></div>))}</div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Component() {
  const [hrmsId, setHrmsId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Excel Export states
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  // PDF Export states and refs
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isDownloadingComparison, setIsDownloadingComparison] = useState(false);
  const personalInfoRef = useRef();
  const visualizationRef = useRef();
  const detailedBreakdownRef = useRef();
  const comparisonRef = useRef();

  const handleLogout = () => { localStorage.removeItem("adminToken"); navigate("/"); };

  const fetchReport = async () => {
    if (!hrmsId.trim()) { setError("Please enter HRMS ID"); return; }
    const token = localStorage.getItem("adminToken");
    if (!token) { setError("No token found. Please log in again."); return; }
    setLoading(true); setError(""); setData(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/report/${hrmsId}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(response.data);
    } catch (err) { setError(err.response?.status === 404 ? "No report found for this HRMS ID." : "Failed to fetch report. Please check HRMS ID and try again."); } 
    finally { setLoading(false); }
  };

  // RESTORED: EXCEL EXPORT HANDLER
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
        headers: { Authorization: `Bearer ${token}` },
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
  
  // ADVANCED PDF GENERATION FUNCTION
  const generatePdf = async (elementRefs, filename, setLoadingState) => {
    setLoadingState(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let yOffset = margin;

    for (const ref of elementRefs) {
      if (!ref.current) continue;
      const element = ref.current;
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * (pdfWidth - margin * 2)) / canvas.width;
      
      if (yOffset + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yOffset = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yOffset, pdfWidth - margin * 2, imgHeight);
      yOffset += imgHeight + margin;
    }
    
    pdf.save(filename);
    setLoadingState(false);
  };
  
  const handleDownloadStandardReport = () => {
    const refs = [personalInfoRef, visualizationRef, detailedBreakdownRef];
    const filename = `DISC_Report_${data.hrmsId}.pdf`;
    generatePdf(refs, filename, setIsDownloadingReport);
  };
  
  const handleDownloadComparisonReport = () => {
    const refs = [personalInfoRef, comparisonRef];
    const filename = `DISC_Comparison_${data.hrmsId}.pdf`;
    generatePdf(refs, filename, setIsDownloadingComparison);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center relative">
            <div className="absolute top-4 right-4 flex flex-col md:flex-row gap-2">
              {data && (
                <>
                  <Button variant="outline" onClick={handleDownloadStandardReport} disabled={isDownloadingReport}>
                    {isDownloadingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Report PDF
                  </Button>
                  <Button variant="outline" onClick={handleDownloadComparisonReport} disabled={isDownloadingComparison}>
                    {isDownloadingComparison ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Compare PDF
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2"><Train className="w-8 h-8 text-blue-600" /><CardTitle className="text-2xl">DISC Personality Report</CardTitle></div>
            <CardDescription>Behavioral analysis based on the DISC model.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input placeholder="Enter HRMS ID" value={hrmsId} onChange={(e) => setHrmsId(e.target.value)} onKeyPress={(e) => e.key === "Enter" && fetchReport()} />
              <Button onClick={fetchReport} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Report"}</Button>
            </div>
            {error && <Alert variant="destructive" className="mt-4 max-w-md mx-auto"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
        </Card>

        {data && (
          <div className="space-y-6">
            <div ref={personalInfoRef}>
              <Card><CardHeader><CardTitle>Personal & Professional Information</CardTitle></CardHeader><CardContent><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6"><div><p className="text-sm text-gray-600">Name</p><p className="font-medium">{data.name}</p></div><div><p className="text-sm text-gray-600">HRMS ID</p><p className="font-medium">{data.hrmsId}</p></div><div><p className="text-sm text-gray-600">Father's Name</p><p className="font-medium">{data.fatherName}</p></div><div><p className="text-sm text-gray-600">Date of Birth</p><p className="font-medium">{new Date(data.dob).toLocaleDateString()}</p></div><div><p className="text-sm text-gray-600">Date of Joining</p><p className="font-medium">{new Date(data.doj).toLocaleDateString()}</p></div><div><p className="text-sm text-gray-600">Zone</p><p className="font-medium">{data.zone}</p></div><div><p className="text-sm text-gray-600">Division</p><p className="font-medium">{data.division}</p></div></div></CardContent></Card>
            </div>
            <div ref={visualizationRef}>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />DISC Profile Visualization</CardTitle></CardHeader><CardContent><DISCChart dScore={data.disc_d_score} iScore={data.disc_i_score} sScore={data.disc_s_score} cScore={data.disc_c_score} /></CardContent></Card>
            </div>
            <div ref={comparisonRef}>
              <HighSpeedDriverComparison scores={{ D: data.disc_d_score, I: data.disc_i_score, S: data.disc_s_score, C: data.disc_c_score }} />
            </div>
            <div ref={detailedBreakdownRef}>
              <Card className="bg-slate-50 border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-blue-600" />Detailed Personality Breakdown</CardTitle></CardHeader><CardContent><DetailedDiscReport scores={{ D: data.disc_d_score, I: data.disc_i_score, S: data.disc_s_score, C: data.disc_c_score }} /></CardContent></Card>
            </div>
            
            {/* RESTORED: EXCEL EXPORT CARD */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                    <CardDescription>Download all registration records from the database as an Excel file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExport} disabled={exporting}>
                        {exporting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting...</>
                        ) : (
                            <><FileDown className="mr-2 h-4 w-4" />Export All Data to Excel</>
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
        )}
      </div>
    </div>
  );
}