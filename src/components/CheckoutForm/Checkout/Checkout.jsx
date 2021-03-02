import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';



const steps = ['Shipping address', 'Payment details']

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type:'cart' });



                setCheckoutToken(token);
            } catch (error) {
                history.pushState('/');
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

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5"> Thank you for your purchase, {order.customer.firstname} {order.customer.lastname} </Typography> 
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order red: {order.customer_reference} </Typography>
           </div>
           <br />
           <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
        </>
    ) : isFinished ? (
        <>
        <div>
            <Typography variant="h5"> Thank you for your purchase, {order.customer.firstname} {order.customer.lastname} </Typography> 
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order red: {order.customer_reference} </Typography>
       </div>
       <br />
       <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
    </>

    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )

    if (error) {
        <>
            <Typography variant="h5">Error: {error} </Typography>
            <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
            <br />
        </>
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm shippingData={shippingData} nextStep={nextStep} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>

    return (
        <>
        <CssBaseline />
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
