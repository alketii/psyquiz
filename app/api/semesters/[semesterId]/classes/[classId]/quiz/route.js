import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { semesterId, classId } = params;

  try {
    // Validate IDs
    if (!semesterId || !classId) {
      return NextResponse.json(
        { error: "Invalid semester or class ID" },
        { status: 400 }
      );
    }

    // Construct paths
    const semesterPath = path.join(process.cwd(), "data", semesterId);
    const classPath = path.join(semesterPath, classId);
    const quizPath = path.join(classPath, "quiz.json");

    // Check if quiz file exists
    try {
      await fs.access(quizPath);
    } catch (error) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Read the quiz content
    const content = await fs.readFile(quizPath, "utf-8");
    const questions = JSON.parse(content);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
