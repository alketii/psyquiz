"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const params = useParams();
  const { semesterId, classId } = params;

  const [quiz, setQuiz] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [questionOrder, setQuestionOrder] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const questionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const answerVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const nextButtonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const resultsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

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
    if (!answerSubmitted) {
      setSelectedAnswer(answerIndex);
      setAnswerSubmitted(true);

      // Show correct answer after 1.5 seconds
      setTimeout(() => {
        setShowCorrectAnswer(true);
        if (answerIndex === correctAnswerIndices[currentQuestion]) {
          setScore(score + 1);
        }

        // Show next button after another 1 second
        setTimeout(() => {
          setShowNextButton(true);
        }, 1000);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setShowCorrectAnswer(false);
      setShowNextButton(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    const { shuffledQuiz, correctIndices, questionOrder } = shuffleQuiz(
      quiz.map((q, i) => ({
        ...q,
        answers: q.answers,
      }))
    );
    setQuiz(shuffledQuiz);
    setCorrectAnswerIndices(correctIndices);
    setQuestionOrder(questionOrder);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowCorrectAnswer(false);
    setShowNextButton(false);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Header
        showBackButton={true}
        backPath={`/semester/${semesterId}/class/${classId}`}
        title="Kuiz"
        breadcrumbs={[
          { href: "/", label: "Kryefaqja" },
          {
            href: `/semester/${semesterId}`,
            label: classData?.semester.name || "Semestri",
          },
          {
            href: `/semester/${semesterId}/class/${classId}`,
            label: classData?.className || "Lënda",
          },
          {
            href: `/semester/${semesterId}/class/${classId}/quiz`,
            label: "Kuiz",
          },
        ]}
      />

      <main className="flex-grow">
        {loading ? (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            Duke ngarkuar kuizin...
          </motion.p>
        ) : quiz && !showResults ? (
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={questionVariants}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="mb-4">
                <span className="text-gray-600">
                  Pyetja {currentQuestion + 1} nga {quiz.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-4">
                {quiz[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {quiz[currentQuestion].answers.map((answer, index) => {
                  const isCorrect =
                    showCorrectAnswer &&
                    index === correctAnswerIndices[currentQuestion];
                  const isSelected = selectedAnswer === index;
                  const isWrong = showCorrectAnswer && isSelected && !isCorrect;

                  let backgroundColor = "white";
                  let borderColor = "rgb(229 231 235)";

                  if (showCorrectAnswer) {
                    if (isCorrect) {
                      backgroundColor = "rgb(220 252 231)";
                      borderColor = "rgb(34 197 94)";
                    } else if (isWrong) {
                      backgroundColor = "rgb(254 226 226)";
                      borderColor = "rgb(239 68 68)";
                    }
                  } else if (isSelected) {
                    backgroundColor = "rgb(254 249 195)";
                    borderColor = "rgb(234 179 8)";
                  }

                  return (
                    <motion.button
                      key={index}
                      initial="hidden"
                      animate="visible"
                      variants={answerVariants}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerSelect(index)}
                      style={{
                        backgroundColor,
                        borderColor,
                        animation: isCorrect
                          ? "blink 0.5s ease-in-out 2"
                          : "none",
                      }}
                      className="w-full text-left p-3 rounded-lg border transition-all duration-300"
                      disabled={answerSubmitted}
                    >
                      {answer}
                    </motion.button>
                  );
                })}
              </div>
              {showNextButton && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={nextButtonVariants}
                  className="mt-4"
                >
                  <motion.button
                    onClick={handleNextQuestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    {currentQuestion < quiz.length - 1
                      ? "Pyetja tjetër"
                      : "Shiko rezultatet"}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        ) : showResults ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={resultsVariants}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Rezultatet</h2>
            <p className="text-xl mb-4">
              Pikët tuaja: {score} nga {quiz.length}
            </p>
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Rifillo Kuizin
            </motion.button>
          </motion.div>
        ) : (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            Kuizi nuk është i disponueshëm.
          </motion.p>
        )}
      </main>

      <Footer />
    </div>
  );
}
