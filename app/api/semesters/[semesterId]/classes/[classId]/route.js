import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { semesterId, classId } = params;

  try {
    // Read the classes.json file
    const dataPath = path.join(process.cwd(), "data", "classes.json");
    const content = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(content);

    // Check if semester exists
    if (!data.semesters[semesterId]) {
      return NextResponse.json(
        { error: "Semester not found" },
        { status: 404 }
      );
    }

    // Find the class in the semester
    const classItem = data.semesters[semesterId].classes.find(
      (c) => c.id === classId
    );

    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Check what files are available in the class directory
    const semesterPath = path.join(process.cwd(), "data", semesterId);
    const classPath = path.join(semesterPath, classId);
    const files = await fs.readdir(classPath);

    return NextResponse.json({
      semester: {
        id: semesterId,
        name: data.semesters[semesterId].name,
      },
      classId: classItem.id,
      className: classItem.title,
      professor: classItem.professor,
      description: classItem.description,
      credits: classItem.credits,
      hasMainMaterial: files.includes("main.md"),
      hasVocabulary: files.includes("vocabulary.md"),
      hasQuiz: files.includes("quiz.json"),
    });
  } catch (error) {
    console.error("Error fetching class details:", error);
    return NextResponse.json(
      { error: "Failed to load class details" },
      { status: 500 }
    );
  }
}
