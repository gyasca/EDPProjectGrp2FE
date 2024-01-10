// src/components/CreateReviewForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateReview = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      rating: '',
      subject: '',
      comment: '',
    },
    validationSchema: Yup.object({
      rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
      subject: Yup.string().required('Subject is required'),
      comment: Yup.string().required('Comment is required'),
    }),
    onSubmit: values => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="1"
          max="5"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.rating}
        />
        {formik.touched.rating && formik.errors.rating ? (
          <div>{formik.errors.rating}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.subject}
        />
        {formik.touched.subject && formik.errors.subject ? (
          <div>{formik.errors.subject}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          name="comment"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.comment}
        />
        {formik.touched.comment && formik.errors.comment ? (
          <div>{formik.errors.comment}</div>
        ) : null}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateReview;
