const Certificate = require('../models/Certificate');
const { generateCertificate, generateCertificateId } = require('./certificateGenerator');
const { sendCourseCompletionEmail } = require('./emailService');

const issueCertificateForCompletion = async ({
  course,
  student,
  enrollment,
  reqMeta = {}
}) => {
  if (!course || !student || !enrollment) {
    throw new Error('Course, student, and enrollment are required to issue a certificate');
  }

  if (Number(enrollment.progress || 0) < 100) {
    return {
      issued: false,
      reason: 'Course not completed yet',
      certificate: null
    };
  }

  if (!course.certificateEnabled) {
    return {
      issued: false,
      reason: 'Certificates are disabled for this course',
      certificate: null
    };
  }

  const existingCertificate = await Certificate.findOne({
    student: student._id,
    course: course._id
  });

  if (existingCertificate) {
    if (!enrollment.certificateIssued || enrollment.certificateUrl !== existingCertificate.pdfUrl) {
      enrollment.certificateIssued = true;
      enrollment.certificateUrl = existingCertificate.pdfUrl;
    }

    if (!enrollment.completedAt) {
      enrollment.completedAt = existingCertificate.completionDate || new Date();
    }

    return {
      issued: false,
      reason: 'Certificate already exists',
      certificate: existingCertificate
    };
  }

  const certificateId = generateCertificateId();
  const instructorName = course.formateur?.fullName || course.instructorName || 'Instructor';
  const completionDate = enrollment.completedAt || new Date();

  const pdfResult = await generateCertificate({
    studentName: student.fullName,
    courseName: course.title,
    instructorName,
    completionDate,
    certificateId,
    courseDuration: Math.max(1, Math.round(Number(course.totalDuration || 0) / 60))
  });

  if (!pdfResult?.success) {
    throw new Error('Error generating certificate PDF');
  }

  const certificate = await Certificate.create({
    certificateId,
    student: student._id,
    course: course._id,
    instructor: course.formateur?._id || course.formateur,
    pdfUrl: pdfResult.filepath,
    filename: pdfResult.filename,
    completionDate,
    finalScore: Number(enrollment.progress || 100),
    metadata: {
      generatedBy: 'system',
      ipAddress: reqMeta.ipAddress,
      userAgent: reqMeta.userAgent
    }
  });

  enrollment.certificateIssued = true;
  enrollment.certificateUrl = pdfResult.filepath;

  await sendCourseCompletionEmail(student, course);

  return {
    issued: true,
    reason: null,
    certificate
  };
};

module.exports = {
  issueCertificateForCompletion
};
