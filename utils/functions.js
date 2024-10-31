const moment = require('moment');
const ExifReader = require('exifreader');

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
        const buffer = require('fs').readFileSync(file.path);
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

  // Check if file was created during the event time
  const isFileCreatedDuringEvent = (fileCreatedAt, event) => {
    const createdMoment = moment(fileCreatedAt);
    const eventStartMoment = moment(event.startTime);
    const eventEndMoment = moment(event.endTime);

    // Allow a small buffer (e.g., 1 hour before event start)
    const bufferBefore = eventStartMoment.clone().subtract(1, 'hours');

    return createdMoment.isBetween(bufferBefore, eventEndMoment);
  }

  module.exports = {
    isFileCreatedDuringEvent,
    extractFileMetadata
  }