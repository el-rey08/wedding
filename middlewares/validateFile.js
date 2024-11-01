const Event = require('../models/eventModel');
const {extractFileMetadata} = require("../utils/functions")
const cloudinary = require("../config/cloudinary")

  const validateFileUpload = async(req, res, next)=>{
    try {
      const { eventAccessToken } = req.params;
      const files = req.files;
      const uploads = Array.isArray(files) ? files : [files];

      // Find the event by access token
      const event = await Event.findOne({ accessToken: eventAccessToken });
      if (!event) {
        return res.status(404).json({ message: 'Invalid event access' });
      }

       // Get current date and time
    const now = new Date();
    
    // Function to combine date and time
    const combineDateAndTime = (dateField, timeField) => {
      const date = new Date(dateField);
      const time = new Date(timeField);
      
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      );
    };

    // Combine start date with start time and end date with end time
    const eventStart = combineDateAndTime(event.startDate, event.startTime);
    const eventEnd = combineDateAndTime(event.endDate, event.endTime);

    // Check if today is within the event dates
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    
    const eventStartDay = new Date(
      event.startDate.getFullYear(),
      event.startDate.getMonth(),
      event.startDate.getDate()
    );
    
    const eventEndDay = new Date(
      event.endDate.getFullYear(),
      event.endDate.getMonth(),
      event.endDate.getDate()
    );

    // Check if current date is within event dates
    if (today < eventStartDay || today > eventEndDay) {
      return res.status(400).json({
        message: 'File upload is only allowed during event dates',
        eventStartDate: event.startDate.toISOString().split('T')[0],
        eventEndDate: event.endDate.toISOString().split('T')[0],
        currentDate: today.toISOString().split('T')[0]
      });
    }

    // Check if current time is within event hours
    if (now < eventStart || now > eventEnd) {
      return res.status(400).json({
        message: 'File upload is only allowed during event hours',
        eventStart: event.startTime.toLocaleTimeString(),
        eventEnd: event.endTime.toLocaleTimeString(),
        currentTime: now.toLocaleTimeString()
      });
    }

    const uploadedFiles = [];

    for (const file of uploads) {
      // Extract file metadata
      const fileMetadata = await extractFileMetadata(file);

      // Validate file creation time by combining event date and time
      const isValidCreationTime = (
        fileMetadata.createdAt >= eventStart && 
        fileMetadata.createdAt <= eventEnd
      );

      if (!isValidCreationTime) {
        return res.status(400).json({
          message: 'File must be created during the event time',
          fileCreatedAt: fileMetadata.createdAt,
          eventStart: eventStart,
          eventEnd: eventEnd,
        });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path);
      uploadedFiles.push({
        url: result.secure_url,
        cloudId: result.public_id,
      });
    }

    // Attach validated event and uploaded files to request
    req.validatedEvent = event;
    req.uploadedFiles = uploadedFiles;


      next();
    } catch (error) {
      console.error('File validation failed', error);
      res.status(500).json({ 
        message: 'File validation failed', 
        error: error.message 
      });
    }
  }

module.exports =  validateFileUpload;