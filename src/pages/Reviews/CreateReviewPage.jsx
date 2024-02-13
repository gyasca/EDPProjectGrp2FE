// src/pages/CreateReviewPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CreateReview from './CreateReview';

const CreateReviewPage = () => {
  return (
    <div>
      <h1>Create Review</h1>

      {/* Link back to the Reviews page */}
      <Link to="/reviews">Back to Reviews</Link>

      {/* Form for Creating a Review */}
      <CreateReview onSubmit={values => console.log('Submitting review:', values)} />
    </div>
  );
};

export default CreateReviewPage;
