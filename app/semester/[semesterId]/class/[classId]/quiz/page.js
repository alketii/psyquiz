"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { semesterId, classId } = params;

  const [quiz, setQuiz] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [questionOrder, setQuestionOrder] = useState([]);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        // Fetch class details first
        const classResponse = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}`
        );

        if (!classResponse.ok) {
          throw new Error("Failed to fetch class data");
        }

        const classData = await classResponse.json();
        setClassData(classData);

        // Then fetch the quiz content
        const quizResponse = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}/quiz`
        );

        if (!quizResponse.ok) {
          throw new Error("Failed to fetch quiz");
        }

        const quizData = await quizResponse.json();
        // Shuffle questions and answers
        const { shuffledQuiz, correctIndices, questionOrder } = shuffleQuiz(
          quizData.questions
        );
        setQuiz(shuffledQuiz);
        setCorrectAnswerIndices(correctIndices);
        setQuestionOrder(questionOrder);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId && classId) {
      fetchQuiz();
    }
  }, [semesterId, classId]);

  const shuffleQuiz = (questions) => {
    // Create an array of indices to shuffle
    const indices = Array.from({ length: questions.length }, (_, i) => i);

    // Shuffle the indices to create a random question order
    const shuffledIndices = indices.sort(() => Math.random() - 0.5);

    // Create the shuffled questions array
    const shuffledQuestions = shuffledIndices.map((index) => questions[index]);

    // Shuffle answers for each question and track correct answer indices
    const correctIndices = [];
    const processedQuestions = shuffledQuestions.map((question) => {
      const answers = [...question.answers];
      const correctAnswer = answers[0]; // Store the correct answer

      // Shuffle all answers
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

      // Find the new index of the correct answer
      const correctIndex = shuffledAnswers.indexOf(correctAnswer);
      correctIndices.push(correctIndex);

      return {
        ...question,
        answers: shuffledAnswers,
      };
    });

    return {
      shuffledQuiz: processedQuestions,
      correctIndices,
      questionOrder: shuffledIndices,
    };
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswerSubmitted(true);

    // Check if the selected answer is wrong
    const isCorrect = answerIndex === correctAnswerIndices[currentQuestion];

    if (!isCorrect) {
      // Show correct answer after 1.5 seconds
      setTimeout(() => {
        setShowCorrectAnswer(true);
      }, 1500);
    } else {
      // If correct answer is selected, show it immediately
      setShowCorrectAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    // Check if answer is correct
    const isCorrect = selectedAnswer === correctAnswerIndices[currentQuestion];

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setShowCorrectAnswer(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    // Re-shuffle questions and answers
    const { shuffledQuiz, correctIndices, questionOrder } = shuffleQuiz(quiz);
    setQuiz(shuffledQuiz);
    setCorrectAnswerIndices(correctIndices);
    setQuestionOrder(questionOrder);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowCorrectAnswer(false);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() =>
              router.push(`/semester/${semesterId}/class/${classId}`)
            }
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Kthehu
          </button>

          <h1 className="text-3xl font-bold">Klasa</h1>
        </div>

        {classData && (
          <div>
            <p className="text-lg text-gray-600">{classData.semester.name}</p>
            <h2 className="text-2xl font-semibold">{classData.className}</h2>
            <h3 className="text-xl font-medium mt-2">Kuizi</h3>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar kuizin...</p>
        ) : quiz && !showResults ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <p className="text-gray-600">
                Pyetja {currentQuestion + 1} nga {quiz.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                {quiz[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quiz[currentQuestion].answers.map((answer, index) => {
                  const isCorrectAnswer =
                    index === correctAnswerIndices[currentQuestion];
                  const isSelected = selectedAnswer === index;
                  const showFeedback = answerSubmitted;

                  let buttonClass =
                    "w-full p-4 text-left rounded-lg border transition ";

                  if (showFeedback) {
                    if (isCorrectAnswer && (showCorrectAnswer || isSelected)) {
                      buttonClass += "border-green-500 bg-green-50";
                    } else if (isSelected && !isCorrectAnswer) {
                      buttonClass += "border-red-500 bg-red-50";
                    } else if (isCorrectAnswer && showCorrectAnswer) {
                      buttonClass += "border-green-500 bg-green-50";
                    } else {
                      buttonClass += "border-gray-200";
                    }
                  } else {
                    buttonClass += isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={buttonClass}
                      disabled={answerSubmitted}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!showCorrectAnswer}
                className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                  !showCorrectAnswer
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {currentQuestion < quiz.length - 1
                  ? "Pyetja Tjetër"
                  : "Përfundo Kuizin"}
              </button>
            </div>
          </div>
        ) : showResults ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">
                Rezultatet e Kuizit
              </h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                {score} / {quiz.length}
              </p>
              <p className="text-gray-600 mb-6">
                {Math.round((score / quiz.length) * 100)}% të sakta
              </p>
              <button
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                Provo Përsëri
              </button>
            </div>
          </div>
        ) : (
          <p>Kuizi nuk është i disponueshëm.</p>
        )}
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} A.R.</p>
      </footer>
    </div>
  );
}
