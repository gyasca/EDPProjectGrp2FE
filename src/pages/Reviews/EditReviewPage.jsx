import React from 'react';
import { Link } from 'react-router-dom';
import EditReview from './EditReview';

const EditReviewPage = () => {
    return (
        <div>
            <h1>Edit Review</h1>

            {/* Link back to the Reviews page */}
            <Link to="/reviews">Back to Reviews</Link>

            {/* Form for Editing a Review */}
            <EditReview onSubmit={values => console.log('Submitting review:', values)} />
        </div>
    );
};

export default EditReviewPage;
