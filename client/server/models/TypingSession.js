const mongoose = require('mongoose');

const TypingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    duration: {
      type: Number,
      enum: [15, 30],
      required: true
    },
    wpm: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    totalErrors: {
      type: Number,
      required: true
    },
    errorWords: {
      type: [String],
      default: []
    },
    typingDurations: {
      type: [Number],
      default: []
    },
    textType: {
      type: String,
      enum: ['words', 'numbers', 'punctuation', 'mixed'],
      default: 'words'
    },
    rawText: {
      type: String,
      required: true
    },
    typedText: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Method to get psychological insights
TypingSessionSchema.methods.getPsychologicalInsights = function() {
  // Calculate impulsivity score (higher WPM with lower accuracy = more impulsive)
  const impulsivityScore = this.wpm / (this.accuracy / 100);
  
  // Calculate cognitive load (more errors on longer words indicates struggle with complexity)
  const errorRatio = this.totalErrors / this.typedText.length;
  
  // Calculate resilience (how speed changes after errors)
  let resilience = 'average';
  if (this.typingDurations && this.typingDurations.length > 0) {
    // Complex calculation could go here in a real implementation
    // This would analyze speed changes after errors
    resilience = this.wpm > 50 ? 'high' : 'low';
  }
  
  return {
    impulsivity: impulsivityScore > 1 ? 'high' : 'low',
    cognitiveLoad: errorRatio > 0.1 ? 'struggles with complexity' : 'handles complexity well',
    resilience: resilience,
    pressureResponse: this.duration === 15 && this.accuracy < 90 ? 'affected by time pressure' : 'handles pressure well'
  };
};

module.exports = mongoose.model('TypingSession', TypingSessionSchema); 