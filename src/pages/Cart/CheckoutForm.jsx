import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom';

import {
    CardContent, CardActions
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import PaymentIcon from '@mui/icons-material/Payment';

function CheckoutForm({ orderId }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();


    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: location.protocol + '//' + location.host + "/cart/checkout/success",
            },
            redirect: "if_required",
            metadata: {
                OrderId: orderId,
            }
        }).then((result) => {
            if (result.error) {
                setMessage(result.error.message);
                setLoading(false);
            } else {
                if (result.paymentIntent.status === "succeeded" || result.paymentIntent.status === "processing") {
                    navigate("/cart/checkout/success");
                } else {
                    navigate("/cart/checkout/error");
                }
            }
        });
    }

    const paymentElementOptions = {
        layout: "tabs",
    }

    return (
        <>
            <form id="payment-form" onSubmit={handleSubmit}>
                <CardContent>
                    <PaymentElement options={paymentElementOptions} />
                </CardContent>
                <CardActions>
                    <LoadingButton startIcon={<PaymentIcon />} variant='contained' id='submit' type="submit" loadingPosition="start" loading={loading} color="primary" sx={{ width: "100%" }}>Pay</LoadingButton>
                </CardActions>
            </form>
            {message && <div>{message}</div>}
        </>
    );
}

export default CheckoutForm;
