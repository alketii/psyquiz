"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FileText, BookOpen, BookMarked, Trophy, X } from "lucide-react";
import ReactInstaStories from "react-insta-stories";
import Head from "next/head";

// Define a set of complementary color schemes
const COLOR_SCHEMES = [
  {
    bg: "#e6f7ff",
    text: "#0050b3",
    gradient: "linear-gradient(135deg, #4158D0, #C850C0)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#4158D0",
    textColor: "#333333",
  }, // Blue-Pink
  {
    bg: "#f6ffed",
    text: "#389e0d",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#2a9d8f",
    textColor: "#333333",
  }, // Green-Teal
  {
    bg: "#fff2e8",
    text: "#873800",
    gradient: "linear-gradient(135deg, #fa709a, #fee140)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#e76f51",
    textColor: "#333333",
  }, // Pink-Yellow
  {
    bg: "#f9f0ff",
    text: "#531dab",
    gradient: "linear-gradient(135deg, #7F7FD5, #91EAE4)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#5e60ce",
    textColor: "#333333",
  }, // Purple-Teal
  {
    bg: "#fcffe6",
    text: "#5b8c00",
    gradient: "linear-gradient(135deg, #F6D365, #FCE38A)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#bc6c25",
    textColor: "#333333",
  }, // Yellow
  {
    bg: "#e6fffb",
    text: "#006d75",
    gradient: "linear-gradient(135deg, #0093E9, #80D0C7)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#0077b6",
    textColor: "#333333",
  }, // Blue-Teal
  {
    bg: "#fff0f6",
    text: "#c41d7f",
    gradient: "linear-gradient(135deg, #FF9A9E, #FECFEF)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#d00000",
    textColor: "#333333",
  }, // Pink
  {
    bg: "#f0f5ff",
    text: "#1d39c4",
    gradient: "linear-gradient(135deg, #5F72BD, #9B94FA)",
    titleBg: "rgba(255, 255, 255, 0.85)",
    textBg: "rgba(255, 255, 255, 0.85)",
    titleColor: "#3a0ca3",
    textColor: "#333333",
  }, // Indigo-Purple
];

export default function ClassPage() {
  const params = useParams();
  const { semesterId, classId } = params;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullStories, setShowFullStories] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const storiesContainerRef = useRef(null);
  const touchStartY = useRef(0);
  const [categoryColorMap, setCategoryColorMap] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());

    // Detect mobile and iOS
    const checkDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipad|ipod|android|mobile/.test(userAgent));
    };

    checkDevice();

    async function fetchClassData() {
      try {
        const response = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }

        const data = await response.json();
        setClassData(data);

        // Generate color map for categories
        if (data?.stories) {
          const uniqueCategories = [
            ...new Set(data.stories.map((story) => story.header.heading)),
          ];
          const categoryColors = {};

          uniqueCategories.forEach((category, index) => {
            // Cycle through color schemes
            const colorScheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
            categoryColors[category] = colorScheme;
          });

          setCategoryColorMap(categoryColors);
        }
      } catch (error) {
        console.error("Error loading class data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId && classId) {
      fetchClassData();
    }
  }, [semesterId, classId]);

  useEffect(() => {
    // Add touch event listeners when fullscreen stories are shown
    if (showFullStories && storiesContainerRef.current) {
      const container = storiesContainerRef.current;

      const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        const touchY = e.touches[0].clientY;
        const yDiff = touchY - touchStartY.current;

        // If swipe down is detected (yDiff > 100)
        if (yDiff > 100) {
          setShowFullStories(false);
        }
      };

      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [showFullStories]);

  // Handle fullscreen mode with keyboard listener for ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showFullStories) {
        setShowFullStories(false);
      }
    };

    // Block scroll when stories are open
    if (showFullStories) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showFullStories]);

  // When stories are opened, simulate immersive mode by adding classes
  useEffect(() => {
    if (showFullStories) {
      // Add class to body to prevent scrolling
      document.body.classList.add(
        "overflow-hidden",
        "fixed",
        "inset-0",
        "w-full",
        "h-full"
      );

      // For iOS Safari, use additional meta tags
      if (isMobile) {
        // Find existing viewport meta tag or create a new one
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        const originalContent = viewportMeta ? viewportMeta.content : "";

        if (!viewportMeta) {
          viewportMeta = document.createElement("meta");
          viewportMeta.name = "viewport";
          document.head.appendChild(viewportMeta);
        }

        // Set fullscreen-friendly content
        viewportMeta.content =
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";

        // Store reference to restore it later
        return () => {
          if (originalContent) {
            viewportMeta.content = originalContent;
          } else {
            try {
              document.head.removeChild(viewportMeta);
            } catch (e) {
              console.log("Error removing meta tag:", e);
            }
          }
          document.body.classList.remove(
            "overflow-hidden",
            "fixed",
            "inset-0",
            "w-full",
            "h-full"
          );
        };
      }

      return () => {
        document.body.classList.remove(
          "overflow-hidden",
          "fixed",
          "inset-0",
          "w-full",
          "h-full"
        );
      };
    }
  }, [showFullStories, isMobile]);

  // Get unique categories from stories
  const getUniqueCategories = () => {
    if (!classData?.stories) return [];
    const categories = new Set();
    classData.stories.forEach((story) => {
      categories.add(story.header.heading);
    });
    return Array.from(categories);
  };

  // Get the first story index for a category
  const getCategoryFirstIndex = (category) => {
    return (
      classData?.stories.findIndex(
        (story) => story.header.heading === category
      ) || 0
    );
  };

  // Get color scheme for a category
  const getCategoryColorScheme = (category) => {
    return categoryColorMap[category] || COLOR_SCHEMES[0];
  };

  // Transform stories with colors
  const transformedStories = classData?.stories?.map((story) => {
    const colors = getCategoryColorScheme(story.header.heading);

    return {
      content: (props) => (
        <div
          style={{
            background: colors.gradient,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header at the top */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              width: "100%",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                marginBottom: 10,
                color: "white",
                textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
                fontSize: "1.8rem",
              }}
            >
              {story.header.heading}
            </h3>
            <p
              style={{
                fontSize: "1.1em",
                color: "rgba(255,255,255,0.9)",
                opacity: 0.8,
                textShadow: "0px 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {story.header.subheading}
            </p>
          </div>

          {/* Main content centered */}
          <div
            style={{
              height: "70%",
              width: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              <h2
                style={{
                  fontWeight: "bold",
                  fontSize: "2.2em",
                  marginBottom: 20,
                  color: colors.titleColor,
                  display: "inline-block",
                  backgroundColor: colors.titleBg,
                  padding: "12px 20px",
                  borderRadius: "6px",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  width: "auto",
                  maxWidth: "100%",
                }}
              >
                {story.content.title}
              </h2>
              <p
                style={{
                  color: colors.textColor,
                  backgroundColor: colors.textBg,
                  padding: "16px 20px",
                  borderRadius: "6px",
                  display: "block",
                  width: "100%",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  fontWeight: "500",
                  lineHeight: "1.6",
                  fontSize: "1.1em",
                }}
              >
                {story.content.text}
              </p>
            </div>
          </div>
        </div>
      ),
      duration: story.duration || 5000,
    };
  });

  const handleStoryCircleClick = (index) => {
    setCurrentStoryIndex(index);
    setShowFullStories(true);
  };

  const handleCloseFullStories = () => {
    setShowFullStories(false);
  };

  const uniqueCategories = getUniqueCategories();

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Header
        showBackButton={true}
        backPath={`/semester/${semesterId}`}
        title={classData?.className || "Lënda"}
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
        ]}
      />

      {uniqueCategories.length > 0 && (
        <div className="w-full mb-8">
          <div className="flex overflow-x-auto py-4 no-scrollbar">
            <div className="flex space-x-4 px-4">
              {uniqueCategories.map((category, index) => {
                const colors = getCategoryColorScheme(category);
                const categoryIndex = getCategoryFirstIndex(category);

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleStoryCircleClick(categoryIndex)}
                  >
                    <div
                      className="w-16 h-16 rounded-full p-0.5 mb-1"
                      style={{
                        border: `2px solid white`,
                        background: colors.gradient,
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                          background: colors.gradient,
                        }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.15)",
                          }}
                        >
                          <span
                            className="text-xl font-bold"
                            style={{
                              color: "white",
                              textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
                            }}
                          >
                            {category.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-xs text-center w-16 break-words"
                      style={{ color: colors.text }}
                    >
                      {category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showFullStories && transformedStories && (
        <div
          ref={storiesContainerRef}
          className="stories-fullscreen fixed inset-0 bg-black"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            margin: 0,
            padding: 0,
            backgroundColor: "#000",
            // iOS Safari specific styling
            WebkitOverflowScrolling: "touch",
            WebkitBackfaceVisibility: "hidden",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <button
            className="absolute top-6 right-6 z-[9999] p-3 rounded-full bg-black bg-opacity-50 shadow-lg"
            onClick={handleCloseFullStories}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <X size={24} color="white" strokeWidth={2.5} />
          </button>

          <div className="w-full h-full">
            <ReactInstaStories
              stories={transformedStories}
              defaultInterval={5000}
              width="100%"
              height="100%"
              currentIndex={currentStoryIndex}
              onAllStoriesEnd={handleCloseFullStories}
              storyStyles={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                margin: 0,
                padding: 0,
              }}
            />
          </div>
        </div>
      )}

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar lëndën...</p>
        ) : classData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <a
              href={`/data/${semesterId}/${classData.classId}/original.pdf`}
              download={`${classData.classId}-${semesterId}.pdf`}
              className="block p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    Materiali origjinal
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Te gjitha slide-t e lëndës në një PDF
                  </p>
                </div>
              </div>
            </a>

            <div
              className={`block p-4 md:p-6 rounded-lg border ${
                classData.hasAlternativeMaterial
                  ? "bg-white border-gray-200 shadow-md hover:bg-gray-50 transition"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <Link
                href={
                  classData.hasAlternativeMaterial
                    ? `/semester/${semesterId}/class/${classId}/material`
                    : "#"
                }
                className={`flex items-center gap-4 ${
                  !classData.hasAlternativeMaterial && "cursor-not-allowed"
                }`}
              >
                <div className="text-3xl md:text-4xl">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    Materiali i përpunuar
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {classData.hasAlternativeMaterial
                      ? "Materiali i përpunuar në PDF"
                      : "Së shpejti..."}
                  </p>
                </div>
              </Link>
            </div>

            <div
              className={`block p-4 md:p-6 rounded-lg border ${
                classData.hasVocabulary
                  ? "bg-white border-gray-200 shadow-md hover:bg-gray-50 transition"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <Link
                href={
                  classData.hasVocabulary
                    ? `/semester/${semesterId}/class/${classId}/vocabulary`
                    : "#"
                }
                className={`flex items-center gap-4 ${
                  !classData.hasVocabulary && "cursor-not-allowed"
                }`}
              >
                <div className="text-3xl md:text-4xl">
                  <BookMarked size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">Fjalor</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {classData.hasVocabulary
                      ? "Fjalët kyçe të lëndës"
                      : "Së shpejti..."}
                  </p>
                </div>
              </Link>
            </div>

            <div
              className={`block p-4 md:p-6 rounded-lg border ${
                classData.hasQuiz
                  ? "bg-white border-gray-200 shadow-md hover:bg-gray-50 transition"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <Link
                href={
                  classData.hasQuiz
                    ? `/semester/${semesterId}/class/${classId}/quiz`
                    : "#"
                }
                className={`flex items-center gap-4 ${
                  !classData.hasQuiz && "cursor-not-allowed"
                }`}
              >
                <div className="text-3xl md:text-4xl">
                  <Trophy size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">Kuiz</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {classData.hasQuiz
                      ? "Testoni njohuritë tuaja"
                      : "Së shpejti..."}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <p>Lënda nuk u gjet.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
