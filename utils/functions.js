// const { isWithinInterval, subHours } = require('date-fns');
const ExifReader = require('exifreader');
const fs = require('fs')

const extractFileMetadata = async (file) => {
    const metadata = {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      createdAt: new Date() 
    };

    try {
      // Extract EXIF data for images
      if (file.mimetype.startsWith('image/')) {
        const buffer = fs.readFileSync(file.path);
        const tags = ExifReader.load(buffer);

        // Try to get original creation date from EXIF
        if (tags.DateTimeOriginal) {
          metadata.createdAt = new Date(tags.DateTimeOriginal.description);
        }
      }

      return metadata;
    } catch (error) {
      console.warn('Metadata extraction failed', error);
      return metadata;
    }
  }

//   // Check if file was created during the event time
//   const isFileCreatedDuringEvent = (fileCreatedAt, event) => {
//     const createdTime = new Date(fileCreatedAt);
//     const eventStart = new Date(event.startTime);
//     const eventEnd = new Date(event.endTime);
    
//     return isWithinInterval(createdTime, {
//         start: subHours(eventStart, 1), // 1-hour buffer
//         end: eventEnd
//     });
// } 

  const validateEventTimes = (startDate, endDate, startTime, endTime) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTimeObj = new Date(`${startDate}T${startTime}`);
    const endTimeObj = new Date(`${endDate}T${endTime}`);
  
    const validations = {
      isValid: true,
      errors: []
    };
  
    // Check if end date is not before start date
    if (end < start) {
      validations.isValid = false;
      validations.errors.push('End date cannot be before start date');
    }
  
    // Check if end time is not before start time on the same day
    if (startDate === endDate && endTimeObj < startTimeObj) {
      validations.isValid = false;
      validations.errors.push('End time cannot be before start time on the same day');
    }
  
    return validations;
  };

  module.exports = {
    extractFileMetadata,
    validateEventTimes,
  }