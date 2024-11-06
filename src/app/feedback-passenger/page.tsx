"use client";

import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState('initial'); 
  const [busNumber, setBusNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleBusNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBusNumber(event.target.value);
  };

  const handleRatingChange = (index: number) => {
    setRating(index);
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(event.target.value);
  };

  const handleSendFeedback = () => {
    setCurrentStep('feedback');
  };

  const handleSubmitFeedback = () => {
    setCurrentStep('phoneInput');
  };

  const handlePhoneInputSubmit = () => {
    setCurrentStep('verification');
  };

  const handleVerificationSubmit = () => {
    setCurrentStep('thankYou');
  };

  return (
    <section className="h-screen w-full flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #e0f7fa, #d1c4e9)' }}>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {currentStep === 'initial' && (
          <div style={styles.container}>
            <div className="w-full flex justify-center items-center mb-4">
              <img
                src="/logo.png"
                alt="TransitTrack Logo"
                className="w-4/5 object-contain"
                style={styles.logo}
              />
            </div>
            <button onClick={handleSendFeedback} style={styles.submitButton}>
              Send Feedback
            </button>
          </div>
        )}

        {currentStep === 'feedback' && (
          <div style={styles.container}>
            <h2 style={styles.title}>Give feedback</h2>

            <div style={styles.dropdown}>
              <label>Select Bus Number </label>
              <select value={busNumber} onChange={handleBusNumberChange} style={styles.input}>
                <option value="">Select Bus Number</option>
                <option value="1">Bus 1</option>
                <option value="2">Bus 2</option>
                <option value="3">Bus 3</option>
              </select>
            </div>

            <div style={styles.ratingSection}>
              <label>How was your experience?</label>
              <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <span
                    key={index}
                    style={{
                      cursor: 'pointer',
                      fontSize: '30px', 
                      color: rating >= index ? '#FFD700' : '#CCCCCC',
                    }}
                    onClick={() => handleRatingChange(index)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.commentsSection}>
              <textarea
                value={comments}
                onChange={handleCommentsChange}
                placeholder="Your comments..."
                style={styles.textarea}
              />
            </div>

            <button onClick={handleSubmitFeedback} style={styles.submitButton}>
              Submit Feedback (Via Phone Number)
            </button>
          </div>
        )}

        {currentStep === 'phoneInput' && (
          <div style={styles.container}>
            <button onClick={() => setCurrentStep('feedback')} style={styles.backButton}>←</button>
            <h2 style={styles.title}>Phone Number</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              style={styles.input}
            />
            <button onClick={handlePhoneInputSubmit} style={styles.submitButton}>
              Next
            </button>
          </div>
        )}

        {currentStep === 'verification' && (
          <div style={styles.container}>
            <button onClick={() => setCurrentStep('phoneInput')} style={styles.backButton}>←</button>
            <h2 style={styles.title}>Enter Verification Code</h2>
            <p>Your verification code is sent by SMS to: {phoneNumber}</p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter Code"
              style={styles.input}
            />
            <button onClick={handleVerificationSubmit} style={styles.submitButton}>
              Confirm
            </button>
          </div>
        )}

        {currentStep === 'thankYou' && (

          <div style={styles.thankYouContainer}>
            <h2 style={styles.thankYouTitle}>Thank you for your feedback!</h2>
            <p>We appreciate your input and will use it to improve our services.</p>
            <button onClick={() => setCurrentStep('initial')} style={styles.submitButton}>
              Ok
            </button>
            <a onClick={() => setCurrentStep('feedback')} style={styles.feedbackLink}>
              send feedback again
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    height: 'auto',
    padding: '40px',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  logo: {
    maxWidth: '150%',
    height: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  ratingSection: {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  commentsSection: {
    marginBottom: '10px',
    textAlign: 'left',
    width: '100%',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #cccccc',
  },
  submitButton: {
    padding: '12px',
    width: '100%',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #cccccc', 
  },
  thankYouContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    padding: '50px', 
    background: '#ffffff', 
    borderRadius: '12px', 
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  thankYouTitle: {
    fontSize: '28px', 
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  feedbackLink: {
    marginTop: '15px',
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

<<<<<<< HEAD
export default FeedbackForm;
=======
export default FeedbackForm;
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
