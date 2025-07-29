// src/components/PersonalityTest.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Brain, BarChart3 } from "lucide-react";

export default function PersonalityTest() {
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state?.formData;
  const [language, setLanguage] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formData) {
      alert("Registration data not found. Please complete the registration form first.");
      navigate('/');
      return;
    }

    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const fileName = language === "en" ? "Question_Eng.json" : "Questions_Hin.json";
        const response = await fetch(`./data/${fileName}`);
        if (!response.ok) throw new Error(`Failed to load questions: ${response.status}`);
        const questionsData = await response.json();
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
          throw new Error("Invalid questions data format");
        }
        setQuestions(questionsData);
        setCurrentQuestion(0);
        setAnswers({});
        setVisitedQuestions(new Set([0]));
      } catch (err) {
        setError(`Failed to load questions. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [language, formData, navigate]);

  const handleRankSelection = (questionId, optionIndex, selectedRank) => {
    const currentAnswers = answers[questionId] || [null, null, null, null];
    const updatedAnswers = currentAnswers.map((rank, i) =>
      rank === selectedRank ? null : rank
    );
    updatedAnswers[optionIndex] = selectedRank;
    setAnswers((prev) => ({ ...prev, [questionId]: updatedAnswers }));
  };

  const calculateResults = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    questions.forEach((q) => {
      const rowRanks = answers[q.id];
      if (!rowRanks) return;
      q.words.forEach((opt, idx) => {
        scores[opt.type] += 5 - rowRanks[idx];
      });
    });
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {
      D: Math.round((scores.D / total) * 100),
      I: Math.round((scores.I / total) * 100),
      S: Math.round((scores.S / total) * 100),
      C: Math.round((scores.C / total) * 100),
    };
    const dominant = Object.entries(percentages).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    return { scores, percentages, dominant, total };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert(language === "en" ? `Please answer all questions.` : `कृपया सभी प्रश्नों के उत्तर दें।`);
      return;
    }

    setIsSubmitting(true);
    const testResults = calculateResults();
    const submissionPayload = {
      ...formData,
      ...testResults,
    };

    try {
      const response = await fetch('http://localhost:5000/api/registrations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server error.');

      navigate('/success');
    } catch (error) {
      alert(`Error: ${error.message}`);
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
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const goToQuestion = (index) => {
    if (visitedQuestions.has(index)) setCurrentQuestion(index);
  };

  const isCurrentQuestionAnswered = answers[questions[currentQuestion]?.id]?.every(r => r !== null);

  if (!formData) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading questions...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!questions.length) return <div>No questions available.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-gray-700" />
            <h1 className="text-4xl font-bold text-gray-900">
              {language === "en" ? "DISC Personality Test" : "DISC व्यक्तित्व परीक्षण"}
            </h1>
          </div>

          <Button
            variant="outline"
            onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
            className="mb-4"
          >
            {language === "en" ? "Switch to Hindi" : "अंग्रेज़ी में बदलें"}
          </Button>

          <p className="text-xl text-gray-600">
            {language === "en" ? "Rank each word from 1 (least) to 4 (most like you)" : "प्रत्येक शब्द को 1 से 4 तक रैंक करें"}
          </p>
          <Badge variant="outline" className="mt-2 border-gray-400 text-gray-700">
            {visitedQuestions.size} / {questions.length} {language === "en" ? "rows visited" : "पंक्तियाँ देखी गईं"}
          </Badge>
        </div>
        <Progress value={(visitedQuestions.size / questions.length) * 100} className="h-2 mb-6" />

        <Card className="shadow-xl border">
          <CardHeader className="bg-gray-900 text-white">
            <CardTitle>
              {language === "en" ? "Row" : "पंक्ति"} {currentQuestion + 1} / {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {questions[currentQuestion].words.map((option, idx) => (
              <div key={idx} className="p-4 border rounded-md">
                <p className="font-semibold mb-2">{option.text}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((rank) => (
                    <button
                      key={rank}
                      onClick={() => handleRankSelection(questions[currentQuestion].id, idx, rank)}
                      className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 ${
                        answers[questions[currentQuestion].id]?.[idx] === rank
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t">
              <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-1" /> {language === "en" ? "Previous" : "पिछला"}
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={handleSubmit} disabled={!isCurrentQuestionAnswered || isSubmitting}>
                  {isSubmitting ? "Submitting..." : language === "en" ? "Submit Test" : "टेस्ट जमा करें"} <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={nextQuestion} disabled={!isCurrentQuestionAnswered}>
                  {language === "en" ? "Next" : "अगला"} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
