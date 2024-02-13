// src/pages/CreateReviewPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CreateReview from './CreateReview';
import { useParams } from 'react-router-dom'

const CreateReviewPage = () => {
  const { id } = useParams();
  const eventId = parseInt(id, 10) || 0; // Convert id to an integer
  return (
    <div>
      <h1>Create Review</h1>

      {/* Link back to the Reviews page */}
      {/* <Link to="/reviews">Back to Reviews</Link> */}

      {/* Form for Creating a Review */}
      <CreateReview onSubmit={values => console.log('Submitting review:', values)} eventId={eventId} />
    </div>
  );
};

export default CreateReviewPage;
