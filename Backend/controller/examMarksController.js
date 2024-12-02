// controllers/examMarksController.js

import ExamMarks from "../models/examMarksModel.js";
import Question from "../models/questionModel.js";
import UsersData from "../models/UsersData.js";

/// Store exam answers with marks and percentage
export const storeExamAnswers = async (req, res) => {
  const { studentId, courseName, answers, marks } = req.body;

  try {
    // Calculate percentage
    const questions = await Question.find({ courseName }); // Assuming you have a Question model with courseName field

    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "Questions not found for the course" });
    }

    const totalMarks = questions.length;
    const percentage = ((marks / totalMarks) * 100).toFixed(2);

    // Determine pass/fail status
    const passFailStatus = percentage >= 40 ? "Pass" : "Fail";

    // Determine grade
    let grade;
    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B+";
    } else if (percentage >= 60) {
      grade = "B";
    } else if (percentage >= 50) {
      grade = "C";
    } else if (percentage >= 40) {
      grade = "D";
    } else {
      grade = "F";
    }

    // Store exam answers in MongoDB
    const examMarks = new ExamMarks({
      studentId,
      courseName,
      answers,
      marks,
      percentage,
      passFailStatus,
      grade,
    });

    await examMarks.save();

    res.status(201).json({ message: "Exam answers stored successfully" });
  } catch (error) {
    console.error("Error storing exam answers:", error);
    res.status(500).json({
      message: "Failed to store exam answers. Please try again later.",
    });
  }
};

// Get exam marks for a specific student and course
export const getExamMarks = async (req, res) => {
  const { studentId, courseName } = req.params;

  try {
    // Find exam marks in MongoDB
    const examMarks = await ExamMarks.findOne({ studentId, courseName });

    if (!examMarks) {
      return res.status(200).json({ message: "Exam marks not found" });
    }

    res.status(200).json({
      marks: examMarks.marks,
      percentage: examMarks.percentage,
      passFailStatus: examMarks.passFailStatus,
      grade: examMarks.grade,
    });
  } catch (error) {
    console.error("Error fetching exam marks:", error);
    res.status(500).json({
      message: "Failed to fetch exam marks. Please try again later.",
    });
  }
};

// Get exam marks by course Name
export const getStatusCountByCourseName = async (req, res) => {
  const { courseName } = req.params;

  try {
    // Find exam marks in MongoDB
    const examMarks = await ExamMarks.find({ courseName });
    if (!examMarks || examMarks.length === 0) {
      return res.status(200).json({ message: "Exam marks not found" });
    }

    // Calculate number of passed and failed students
    let passedCount = 0;
    let failedCount = 0;

    examMarks.forEach((mark) => {
      // Assuming 'passed' field indicates pass or fail status
      if (mark.passFailStatus === "Pass") {
        passedCount++;
      } else {
        failedCount++;
      }
    });

    // Fetch Total number of students
    const studentCount = await UsersData.countDocuments({ role: "student" });

    // Not attended exam count
    const notAttendedCount = studentCount - (passedCount + failedCount);

    res.status(200).json({
      totalStudents: studentCount,
      passedStudents: passedCount,
      failedStudents: failedCount,
      notAttendedStudents: notAttendedCount,
      // examMarks, // Optionally, you can still return the examMarks if needed
    });
  } catch (error) {
    console.error("Error fetching exam marks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch exam marks. Please try again" });
  }
};

//Get all exam marks details

export const getAllExamMarks = async (req, res) => {
  try {
    //Find all exam marks in mongoDB
    const allExamMarksDetails = await ExamMarks.find();

    if (!allExamMarksDetails || allExamMarksDetails.length === 0) {
      return res.status(200).json({ message: "No exam marks found" });
    }

    res.status(200).json(allExamMarksDetails);
  } catch (error) {
    console.error("Error fetching all exam marks details:", error);
    res.status(500).json({
      message:
        "Failed to fetch all exam marks details. Please try again later.",
    });
  }
};

// get all status counts of all courses
export const getAllExamCountStatus = async (req, res) => {
  try {
    // Find all distinct course names from ExamMarks collection
    const distinctCourses = await ExamMarks.distinct("courseName");

    if (!distinctCourses || distinctCourses.length === 0) {
      return res.status(200).json({ message: "No courses found" });
    }

    // Prepare results object to store details for each course
    const coursesDetails = [];

    // Iterate over each course and calculate details
    for (let i = 0; i < distinctCourses.length; i++) {
      const courseName = distinctCourses[i];

      // Find exam marks for current course
      const examMarks = await ExamMarks.find({ courseName });

      // Calculate number of passed and failed students
      let passedCount = 0;
      let failedCount = 0;

      examMarks.forEach((mark) => {
        // Assuming 'passed' field indicates pass or fail status
        if (mark.passFailStatus === "Pass") {
          passedCount++;
        } else {
          failedCount++;
        }
      });

      // Fetch Total number of students
      const studentCount = await UsersData.countDocuments({ role: "student" });

      // Not attended exam count
      const notAttendedCount = studentCount - (passedCount + failedCount);

      // Prepare course details object
      const courseDetails = {
        courseName,
        totalStudents: studentCount,
        passedStudents: passedCount,
        failedStudents: failedCount,
        notAttendedStudents: notAttendedCount,
        // Optionally, you can include examMarks if needed
        // examMarks,
      };

      coursesDetails.push(courseDetails);
    }

    // Send response with all courses details
    res.status(200).json({ coursesDetails });
  } catch (error) {
    console.error("Error fetching courses details:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch courses details. Please try again" });
  }
};

//Get Exam Marks by Student ID

export const getExamMarksById = async (req, res) => {
  const { studentId } = req.params;
  try {
    // Find exam marks in MongoDB
    const examMarks = await ExamMarks.find({ studentId });

    if (!examMarks || examMarks.length === 0) {
      return res.status(200).json({ message: "Exam marks not found" });
    }

    // Calculate total percentage and number of subjects
    let totalPercentage = 0;
    let hasFailedSubject = false; // Flag to track if any subject has failed
    const numberOfSubjects = examMarks.length;

    examMarks.forEach((mark) => {
      totalPercentage += mark.percentage;
      if (mark.passFailStatus === "Fail") {
        hasFailedSubject = true;
      }
    });

    // Calculate final percentage as average percentage
    const finalPercentage = totalPercentage / numberOfSubjects;

    // Determine final status
    let finalStatus = finalPercentage >= 40 ? "Pass" : "Fail";
    if (hasFailedSubject) {
      finalStatus = "Fail";
    }

    res.status(200).json({
      finalPercentage,
      finalStatus,
      examMarks, // Optionally, you can return the examMarks array as well
    });
  } catch (error) {
    console.error("Error fetching exam marks by student id:", error);
    res.status(500).json({
      message:
        "Failed to fetch exam marks by student id. Please try again later.",
    });
  }
};
