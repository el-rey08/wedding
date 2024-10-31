const Event = require('../models/eventModel');
const {extractFileMetadata} = require("./functions")

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

      // Check if event is currently active
      const now = new Date();
      if (now < event.startTime || now > event.endTime) {
        return res.status(400).json({ 
          message: 'File upload is only allowed during the event time',
          eventStart: event.startTime,
          eventEnd: event.endTime
        });
      }

      const uploadedFiles = [];

    for (const file of uploads) {
      // Extract file metadata
      const fileMetadata = await extractFileMetadata(file);

      // Validate file creation time
      if (!isFileCreatedDuringEvent(fileMetadata.createdAt, event)) {
        return res.status(400).json({
          message: 'File must be created during the event time',
          fileCreatedAt: fileMetadata.createdAt,
          eventStart: event.startTime,
          eventEnd: event.endTime,
        });
      }

      // Upload file to Cloudinary
      const result = await Cloudinary.uploader.upload(file.path);
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