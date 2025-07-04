

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Brain, BarChart3 } from "lucide-react"

export default function PersonalityTest() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the form data passed from the registration page
  const formData = location.state?.formData;
  
  const [language, setLanguage] = useState("en")
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Redirect back to registration if formData is missing
    if (!formData) {
        alert("Registration data not found. Please complete the registration form first.");
        navigate('/');
        return;
    }

    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        const fileName = language === "en" ? "Question_Eng.json" : "Questions_Hin.json"
        const response = await fetch(`./data/${fileName}`)
        if (!response.ok) throw new Error(`Failed to load questions: ${response.status}`)
        const questionsData = await response.json()
        if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
          throw new Error("Invalid questions data format")
        }
        setQuestions(questionsData)
        setCurrentQuestion(0)
        setAnswers({})
        setVisitedQuestions(new Set([0]))
      } catch (err) {
        setError(`Failed to load questions. Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [language, formData, navigate])

  const answeredQuestions = Object.keys(answers).length
  const progress = questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0

  const handleAnswerChange = (questionId, selectedType) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedType,
    }))
  }

  const calculateResults = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    Object.values(answers).forEach((type) => {
      if (type in scores) scores[type]++
    })
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1;
    const percentages = {
      D: Math.round((scores.D / total) * 100),
      I: Math.round((scores.I / total) * 100),
      S: Math.round((scores.S / total) * 100),
      C: Math.round((scores.C / total) * 100),
    }
    const dominant = Object.entries(percentages).reduce((a, b) => (percentages[a[0]] > percentages[b[0]] ? a : b))[0]
    return { scores, percentages, dominant, total: answeredQuestions }
  }

  const handleSubmit = async () => {
    if (answeredQuestions < questions.length) {
      alert(language === "en" ? `Please answer all questions.` : `कृपया सभी प्रश्नों के उत्तर दें।`)
      return
    }

    setIsSubmitting(true);
    const testResults = calculateResults();
    
    // Combine form data and test results into a single payload
    const submissionPayload = {
        ...formData,
        ...testResults
    };
    
    console.log("Submitting to backend:", submissionPayload);

    try {
      // Send the combined data to your backend API
      const response = await fetch('http://localhost:5000/api/registrations/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle server-side errors (e.g., duplicate HRMS ID)
        throw new Error(result.error || 'An unknown server error occurred.');
      }

      console.log('Submission successful:', result);
      // Navigate to a success/results page on success
      navigate('/success');

    } catch (error) {
      console.error("Error submitting results:", error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const newCurrent = currentQuestion + 1;
      setCurrentQuestion(newCurrent);
      setVisitedQuestions((prev) => new Set([...prev, newCurrent]));
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }

  const goToQuestion = (index) => {
    if (visitedQuestions.has(index)) setCurrentQuestion(index);
  }

  // Render loading/error/empty states
  if (!formData) return null; // Avoid rendering anything while redirecting
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading questions...</p></div>
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><p className="text-red-600">{error}</p></div>
  if (!questions.length) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>No questions available.</p></div>

  const isCurrentQuestionAnswered = !!answers[questions[currentQuestion]?.id];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute top-0 right-0">
          <Button variant="outline" onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}>
            {language === "en" ? "हिंदी में" : "In English"}
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4"><Brain className="h-10 w-10 text-gray-700" /><h1 className="text-4xl font-bold text-gray-900">{language === "en" ? "DISC Personality Test" : "DISC व्यक्तित्व परीक्षण"}</h1></div>
          <p className="text-xl text-gray-600">{language === "en" ? "Discover your workplace personality style" : "अपने कार्यस्थल की व्यक्तित्व शैली को जानें"}</p>
          <Badge variant="outline" className="mt-2 border-gray-400 text-gray-700">{answeredQuestions} {language === "en" ? "of" : "/"} {questions.length} {language === "en" ? "questions completed" : "प्रश्न पूरे हुए"}</Badge>
        </div>
        <div className="mb-8"><Progress value={progress} className="h-2" /></div>
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="bg-gray-900 text-white"><CardTitle className="text-xl">{language === "en" ? "Question" : "प्रश्न"} {currentQuestion + 1} {language === "en" ? "of" : "/"} {questions.length}</CardTitle></CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">{questions[currentQuestion].question}</h2>
              <RadioGroup value={answers[questions[currentQuestion].id] || ""} onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value)} className="space-y-4">
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.label} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.type} id={`q${questions[currentQuestion].id}-${option.label}`} className="mt-1" />
                    <Label htmlFor={`q${questions[currentQuestion].id}-${option.label}`} className="flex-1 cursor-pointer text-gray-700 leading-relaxed"><span className="font-semibold text-gray-900">{option.label}.</span> {option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline" className="flex items-center gap-2 bg-transparent"><ChevronLeft className="h-4 w-4" />{language === "en" ? "Previous" : "पिछला"}</Button>
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={handleSubmit} disabled={isSubmitting || answeredQuestions < questions.length} className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2">{isSubmitting ? (language === "en" ? "Submitting..." : "जमा हो रहा है...") : (language === "en" ? "Submit Test" : "टेस्ट जमा करें")}<BarChart3 className="h-4 w-4" /></Button>
              ) : (
                <Button onClick={nextQuestion} disabled={!isCurrentQuestionAnswered} className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">{language === "en" ? "Next" : "अगला"}<ChevronRight className="h-4 w-4" /></Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6 border border-gray-200">
          <CardHeader><CardTitle className="text-lg text-gray-800">{language === "en" ? "Question Overview" : "प्रश्नों का अवलोकन"}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1">
              {questions.map((_, index) => {
                const isVisited = visitedQuestions.has(index)
                const isAnswered = answers[questions[index].id]
                const isCurrent = index === currentQuestion
                let bgColor = "bg-gray-200 text-gray-600"
                if (isCurrent) bgColor = "bg-gray-900 text-white"
                else if (isAnswered) bgColor = "bg-green-600 text-white" // Simplified logic: show green if answered
                else if (isVisited && !isAnswered) bgColor = "bg-red-600 text-white"
                return (<button key={index} onClick={() => goToQuestion(index)} disabled={!isVisited} className={`w-8 h-8 rounded text-xs font-medium transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${bgColor}`}>{index + 1}</button>)
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-900 rounded"></div><span>{language === "en" ? "Current" : "वर्तमान"}</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded"></div><span>{language === "en" ? "Answered" : "उत्तर दिया"}</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div><span>{language === "en" ? "Unanswered" : "कोई उत्तर नहीं"}</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded"></div><span>{language === "en" ? "Not Visited" : "नहीं देखा गया"}</span></div>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}