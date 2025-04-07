"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import { useSpring, animated } from "@react-spring/web";

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

  // Create all springs at the top level
  const loadingSpring = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });
  const answerSprings = useSpring({
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { tension: 300, friction: 20 },
  });
  const questionSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });
  const nextButtonSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });
  const resultsSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 300, friction: 20 },
  });
  const errorSpring = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

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
          <animated.p style={loadingSpring} className="text-center">
            Duke ngarkuar kuizin...
          </animated.p>
        ) : quiz && !showResults ? (
          <div className="max-w-2xl mx-auto">
            <animated.div
              style={questionSpring}
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
                    <animated.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      style={{
                        ...answerSprings,
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
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
                    </animated.button>
                  );
                })}
              </div>
              {showNextButton && (
                <animated.div style={nextButtonSpring} className="mt-4">
                  <animated.button
                    onClick={handleNextQuestion}
                    style={{
                      transform: "scale(1)",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    {currentQuestion < quiz.length - 1
                      ? "Pyetja tjetër"
                      : "Shiko rezultatet"}
                  </animated.button>
                </animated.div>
              )}
            </animated.div>
          </div>
        ) : showResults ? (
          <animated.div style={resultsSpring} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">Rezultatet</h2>
              <p className="text-xl mb-4">
                Pikët tuaja: {score} nga {quiz.length}
              </p>
              <animated.button
                onClick={handleRestart}
                style={{
                  transform: "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Rifillo kuizin
              </animated.button>
            </div>
          </animated.div>
        ) : (
          <animated.p style={errorSpring}>
            Kuizi nuk është i disponueshëm.
          </animated.p>
        )}
      </main>

      <Footer />
    </div>
  );
}
