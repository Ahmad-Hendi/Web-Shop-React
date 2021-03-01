import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core'

import { commerce } from '../../../lib/commerce'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';



const steps = ['Shipping address', 'Payment details']

const Checkout = ({ cart }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type:'cart' });



                setCheckoutToken(token);
            } catch (error) {

            }
        }

        generateToken();
    }, [cart]);


    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);

        nextStep();
    }

    const Confirmation = () => (
        <div>
            Confirmation
        </div>
    )

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep}/>

    return (
        <>
          <div className={classes.toolbar}/>  
          <main className={classes.layout}>
              <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper} >
                        {steps.map((step)  => (
                            <Step Key={step} >
                                <StepLabel >{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />} 
                    { /* if we are in the last step show another new component */ }
              </Paper>
          </main>
        </>
    )
}


export default Checkout
