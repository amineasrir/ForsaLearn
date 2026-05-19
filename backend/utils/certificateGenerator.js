const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// CERTIFICATE GENERATOR

/**
 * Generate a certificate PDF
 * @param {Object} data - Certificate data
 * @param {string} data.studentName - Student's full name
 * @param {string} data.courseName - Course title
 * @param {string} data.instructorName - Instructor's name
 * @param {Date} data.completionDate - Date of completion
 * @param {string} data.certificateId - Unique certificate ID
 * @param {number} data.courseDuration - Course duration in hours
 * @returns {Promise<string>} - Path to generated PDF
 */
const generateCertificate = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        studentName,
        courseName,
        instructorName,
        completionDate,
        certificateId,
        courseDuration
      } = data;

      // Create certificates directory if it doesn't exist
      const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates', 'generated');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      // Generate unique filename
      const filename = `certificate_${certificateId}_${Date.now()}.pdf`;
      const filepath = path.join(certificatesDir, filename);

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });

      // Pipe to file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Page dimensions
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // BACKGROUND - Premium style with brand colors
      doc.rect(0, 0, pageWidth, pageHeight)
         .fill('#fafbfd');

      // Premium double border with brand navy blue
      doc.rect(35, 35, pageWidth - 70, pageHeight - 70)
         .lineWidth(4)
         .stroke('#392C7D'); // Navy Blue

      doc.rect(45, 45, pageWidth - 90, pageHeight - 90)
         .lineWidth(0.5)
         .stroke('#FF4667'); // Brand Pink

      // HEADER with ribbon effect
      
      // Decorative ribbon at top with brand pink
      drawTopRibbon(doc, pageWidth / 2, 65, 180, '#FF4667');

      // Certificate Title - Premium styling
      doc.fontSize(50)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text('CERTIFICATE', 0, 100, {
           align: 'center',
           width: pageWidth
         });

      // Subtitle in brand pink
      doc.fontSize(24)
         .fillColor('#FF4667')
         .font('Helvetica-Bold')
         .text('OF ACHIEVEMENT', 0, 165, {
           align: 'center',
           width: pageWidth
         });

      // Elegant divider line in brand pink
      doc.moveTo(pageWidth / 2 - 140, 210)
         .lineTo(pageWidth / 2 + 140, 210)
         .lineWidth(2)
         .stroke('#FF4667');

      // MAIN CONTENT

      // "This is to certify that"
      doc.fontSize(14)
         .fillColor('#555')
         .font('Helvetica')
         .text('This is to certify that', 0, 245, {
           align: 'center',
           width: pageWidth
         });

      // Student Name - Premium styling with emphasis
      doc.fontSize(40)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text(studentName.toUpperCase(), 0, 280, {
           align: 'center',
           width: pageWidth
         });

      // Elegant underline for student name in brand pink
      const nameWidth = doc.widthOfString(studentName.toUpperCase());
      const nameX = (pageWidth - nameWidth) / 2;
      doc.moveTo(nameX - 15, 330)
         .lineTo(nameX + nameWidth + 15, 330)
         .lineWidth(2)
         .stroke('#FF4667');

      // Achievement text
      doc.fontSize(15)
         .fillColor('#555')
         .font('Helvetica')
         .text('has successfully completed and demonstrated proficiency in', 0, 350, {
           align: 'center',
           width: pageWidth
         });

      // Course Name - Brand Pink highlight
      doc.fontSize(32)
         .fillColor('#FF4667')
         .font('Helvetica-Bold')
         .text(courseName, 0, 385, {
           align: 'center',
           width: pageWidth
         });

      // Course Duration info
      if (courseDuration) {
        doc.fontSize(13)
           .fillColor('#777')
           .font('Helvetica')
           .text(`(${courseDuration} hours of comprehensive training)`, 0, 425, {
             align: 'center',
             width: pageWidth
           });
      }

      // FOOTER SECTION

      const footerY = pageHeight - 140;

      // Left side - Date
      doc.fontSize(11)
         .fillColor('#777')
         .font('Helvetica')
         .text('Date Awarded:', 85, footerY);

      doc.fontSize(12)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text(formatDate(completionDate), 85, footerY + 18);

      // Right side - Instructor signature
      doc.fontSize(11)
         .fillColor('#777')
         .font('Helvetica')
         .text('Authorized by:', pageWidth - 280, footerY);

      doc.fontSize(13)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text(instructorName, pageWidth - 280, footerY + 18);

      // Signature line
      doc.moveTo(pageWidth - 280, footerY + 50)
         .lineTo(pageWidth - 120, footerY + 50)
         .lineWidth(1)
         .stroke('#333');

      // Medal seal on right
      drawMedalSeal(doc, pageWidth - 110, footerY - 15);

      // BOTTOM INFORMATION

      const bottomY = pageHeight - 75;

      // Certificate ID on left
      doc.fontSize(9)
         .fillColor('#999')
         .font('Helvetica')
         .text(`Certificate ID: ${certificateId}`, 80, bottomY);

      // Verification URL in center
      doc.fontSize(8)
         .fillColor('#999')
         .font('Helvetica')
         .text(`Verify: ${process.env.CLIENT_URL}/verify/${certificateId}`, 0, bottomY, {
           align: 'center',
           width: pageWidth
         });

      // Platform name on right
      doc.fontSize(12)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text('ForsaLearn', pageWidth - 160, bottomY);

      // DECORATIVE ELEMENTS

      // Corner decorations
      drawCornerDecoration(doc, 50, 50, 'topLeft');
      drawCornerDecoration(doc, pageWidth - 50, 50, 'topRight');
      drawCornerDecoration(doc, 50, pageHeight - 50, 'bottomLeft');
      drawCornerDecoration(doc, pageWidth - 50, pageHeight - 50, 'bottomRight');

      // Finalize PDF
      doc.end();

      // Wait for file to be written
      stream.on('finish', () => {
        const relativePath = `/uploads/certificates/generated/${filename}`;
        resolve({
          success: true,
          filepath: relativePath,
          filename
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Draw decorative ribbon at top

const drawTopRibbon = (doc, centerX, y, width, color) => {
  // Left ribbon wing
  doc.polygon(
    [centerX - width / 2, y],
    [centerX - width / 2 + 35, y + 25],
    [centerX - 10, y + 18]
  );
  doc.fill(color);

  // Right ribbon wing
  doc.polygon(
    [centerX + width / 2, y],
    [centerX + width / 2 - 35, y + 25],
    [centerX + 10, y + 18]
  );
  doc.fill(color);

  // Ribbon center bar
  doc.rect(centerX - width / 2, y, width, 18)
    .fill(color);
};

// Draw decorative medal/seal

const drawMedalSeal = (doc, x, y) => {
  const radius = 28;

  // Outer circle - Brand Navy
 

  // Middle circle accent - Brand Pink
  
  // Star symbol in center - Brand Pink
  doc.fontSize(38)
    .fillColor('#9b6d76')
    .text('★', x - 15, y - 18, { align: 'center' });
};

// Draw corner decoration

const drawCornerDecoration = (doc, x, y, position) => {
  const size = 20;
  
  doc.save();
  
  switch(position) {
    case 'topLeft':
      doc.moveTo(x, y + size)
         .lineTo(x, y)
         .lineTo(x + size, y);
      break;
    case 'topRight':
      doc.moveTo(x - size, y)
         .lineTo(x, y)
         .lineTo(x, y + size);
      break;
    case 'bottomLeft':
      doc.moveTo(x, y - size)
         .lineTo(x, y)
         .lineTo(x + size, y);
      break;
    case 'bottomRight':
      doc.moveTo(x - size, y)
         .lineTo(x, y)
         .lineTo(x, y - size);
      break;
  }
  
  doc.lineWidth(2)
     .stroke('#FF4667');
  
  doc.restore();
};

//Format date to readable string
 
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

 //* Generate unique certificate ID
 
const generateCertificateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `FORSA-${timestamp}-${randomStr}`.toUpperCase();
};

// Verify certificate exists

const verifyCertificate = async (certificateId) => {
  const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates', 'generated');
  const files = fs.readdirSync(certificatesDir);
  const certificateFile = files.find(file => file.includes(certificateId));
  
  return {
    valid: !!certificateFile,
    filepath: certificateFile ? `/uploads/certificates/generated/${certificateFile}` : null
  };
};

module.exports = {
  generateCertificate,
  generateCertificateId,
  verifyCertificate
};