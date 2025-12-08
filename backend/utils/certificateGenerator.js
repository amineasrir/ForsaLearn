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

      // BACKGROUND & BORDER
      
      // Background gradient effect (using rectangles)
      doc.rect(0, 0, pageWidth, pageHeight)
         .fill('#f8f9fa');

      // Decorative border
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
         .lineWidth(3)
         .stroke('#392C7D');

      doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
         .lineWidth(1)
         .stroke('#FF4667');

      // HEADER
      
      // Logo/Icon (using text emoji)
      doc.fontSize(60)
         .fillColor('#392C7D')
         .text('🎓', 0, 80, {
           align: 'center',
           width: pageWidth
         });

      // Certificate Title
      doc.fontSize(45)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text('CERTIFICATE', 0, 160, {
           align: 'center',
           width: pageWidth
         });

      doc.fontSize(25)
         .fillColor('#666')
         .font('Helvetica')
         .text('OF COMPLETION', 0, 215, {
           align: 'center',
           width: pageWidth
         });

      // Decorative line
      doc.moveTo(pageWidth / 2 - 100, 260)
         .lineTo(pageWidth / 2 + 100, 260)
         .lineWidth(2)
         .stroke('#FF4667');

      // MAIN CONTENT

      // "This is to certify that"
      doc.fontSize(16)
         .fillColor('#666')
         .font('Helvetica')
         .text('This is to certify that', 0, 290, {
           align: 'center',
           width: pageWidth
         });

      // Student Name (highlighted)
      doc.fontSize(36)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text(studentName, 0, 330, {
           align: 'center',
           width: pageWidth
         });

      // Decorative underline for name
      const nameWidth = doc.widthOfString(studentName);
      const nameX = (pageWidth - nameWidth) / 2;
      doc.moveTo(nameX, 375)
         .lineTo(nameX + nameWidth, 375)
         .lineWidth(1)
         .stroke('#FF4667');

      // "has successfully completed"
      doc.fontSize(16)
         .fillColor('#666')
         .font('Helvetica')
         .text('has successfully completed the course', 0, 395, {
           align: 'center',
           width: pageWidth
         });

      // Course Name
      doc.fontSize(28)
         .fillColor('#FF4667')
         .font('Helvetica-Bold')
         .text(courseName, 0, 430, {
           align: 'center',
           width: pageWidth
         });

      // Course Duration
      if (courseDuration) {
        doc.fontSize(14)
           .fillColor('#666')
           .font('Helvetica')
           .text(`Duration: ${courseDuration} hours`, 0, 470, {
             align: 'center',
             width: pageWidth
           });
      }

      // FOOTER

      const footerY = pageHeight - 120;

      // Date
      doc.fontSize(12)
         .fillColor('#666')
         .font('Helvetica')
         .text(`Date: ${formatDate(completionDate)}`, 100, footerY);

      // Instructor signature section
      doc.fontSize(12)
         .fillColor('#666')
         .font('Helvetica')
         .text('Instructor', pageWidth - 250, footerY);

      doc.fontSize(16)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text(instructorName, pageWidth - 250, footerY + 20);

      // Signature line
      doc.moveTo(pageWidth - 250, footerY + 45)
         .lineTo(pageWidth - 100, footerY + 45)
         .lineWidth(1)
         .stroke('#333');

      // Certificate ID (bottom)
      doc.fontSize(10)
         .fillColor('#999')
         .font('Helvetica')
         .text(`Certificate ID: ${certificateId}`, 0, pageHeight - 60, {
           align: 'center',
           width: pageWidth
         });

      // Platform name
      doc.fontSize(12)
         .fillColor('#392C7D')
         .font('Helvetica-Bold')
         .text('ForsaLearn', 0, pageHeight - 40, {
           align: 'center',
           width: pageWidth
         });

      // Verification URL
      doc.fontSize(9)
         .fillColor('#999')
         .font('Helvetica')
         .text(`Verify at: ${process.env.CLIENT_URL}/verify/${certificateId}`, 0, pageHeight - 25, {
           align: 'center',
           width: pageWidth
         });

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


// Draw decorative corner element

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