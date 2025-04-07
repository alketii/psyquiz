import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const semester = searchParams.get("semester");
  const classId = searchParams.get("class");

  try {
    // Construct the file path relative to the project root
    const basePath = path.resolve(process.cwd(), "data");
    const semesterPath = path.join(basePath, `sem-${semester}`);
    const classPath = path.join(semesterPath, classId);
    const filePath = path.join(classPath, "original.pdf");

    console.log("Current working directory:", process.cwd());
    console.log("Base path:", basePath);
    console.log("Semester path:", semesterPath);
    console.log("Class path:", classPath);
    console.log("Final file path:", filePath);

    // Check if directories exist
    if (!fs.existsSync(basePath)) {
      console.log("Base directory not found at:", basePath);
      return new NextResponse("Base directory not found", { status: 404 });
    }

    if (!fs.existsSync(semesterPath)) {
      console.log("Semester directory not found at:", semesterPath);
      return new NextResponse("Semester directory not found", { status: 404 });
    }

    if (!fs.existsSync(classPath)) {
      console.log("Class directory not found at:", classPath);
      return new NextResponse("Class directory not found", { status: 404 });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log("File not found at:", filePath);
      return new NextResponse("File not found", { status: 404 });
    }

    // Read the file
    const fileContent = fs.readFileSync(filePath);

    // Set headers for PDF download
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="original.pdf"`);

    return new NextResponse(fileContent, {
      headers,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return new NextResponse("Error downloading file", { status: 500 });
  }
}
