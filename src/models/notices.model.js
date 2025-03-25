const noticeSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    sem: {
      type: Number,
      required: false, // Making this optional if notice is for all semesters
      min: 1,
      max: 8
    },
    branch: {
      type: String,
      required: false, // Making this optional if notice is for all branches
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER', 'ALL']
    },
    targetType: {
      type: String,
      required: true,
      enum: ['ALL', 'BRANCH', 'SEMESTER', 'SPECIFIC']
    },
    year: {
      type: Number,
      required: true,
      default: function() {
        return new Date().getFullYear();
      }
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    isImportant: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1); // Default expiry: 1 month
        return date;
      }
    }
  }, {
    timestamps: true
  });
export const Notice = mongoose.model('Notice', noticeSchema);