const questionPaperSchema = new Schema({
    subject: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return v >= 2000 && v <= new Date().getFullYear();
        },
        message: props => `${props.value} is not a valid year!`
      }
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER']
    },
    sem: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    fileUrl: {
      type: String,
      required: true,
      validate: {
        validator: url => /^https?:\/\/.+/.test(url),
        message: 'Invalid file URL'
      }
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    }
  }, {
    timestamps: true
  });

export const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);