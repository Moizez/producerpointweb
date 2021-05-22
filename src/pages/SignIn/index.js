import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

import {
    Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link,
    Grid, Typography, Container, makeStyles, CircularProgress,
    Snackbar, SnackbarContent, InputAdornment, IconButton
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import EmailIcon from '@material-ui/icons/Email'

import api from '../../services/api'

import logo from '../../assets/images/logo.png'
import { AuthContext } from '../../contexts/AuthContext'

import ForgotPasswordModal from '../../components/Modals/ForgotPasswordModal'
import RecoveryModal from '../../components/Modals/RecoveryModal'

const SignIn = () => {

    const classes = useStyles()
    const { mail, time, token } = useParams()

    const { signIn, loadingAuth } = useContext(AuthContext)
    const [forgotPassword, setForgotPassword] = useState(false)
    const [recovery, setRecovery] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [snack, setSnack] = useState(false)
    const [snackColor, setSnackColor] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleOpenForgotPassword = () => setForgotPassword(true)
    const handleCloseForgotPassword = () => setForgotPassword(false)
    const handleOpenRecovery = () => setRecovery(true)
    const handleCloseRecovery = () => setRecovery(false)
    const handleOpenSnack = () => setSnack(true)
    const handleCloseSnack = () => setSnack(false)

    useEffect(() => {
        if (mail && time && token) {
            validateLink()
        }
    }, [])

    const sendEmail = async (email) => {
        setLoading(true)
        const response = await api.sendEmailRecovery(email)
        if (response?.status === 200) {
            setSnackColor('#070')
            setSnackMessage('Verifique seu e-mail e siga as instruções para recuperar sua senha.')
            handleOpenSnack()
            handleCloseForgotPassword()
            setLoading(false)
        } else {
            setSnackColor('#da1e37')
            setSnackMessage('E-mail não localizado!')
            handleOpenSnack()
            setLoading(false)
        }

    }

    const validateLink = async () => {
        const response = await api.validateLink(mail, time, token)
        if (response?.status === 200) {
            handleOpenRecovery()
        } else {
            setSnackColor('#da1e37')
            setSnackMessage('Link inválido ou expirado!')
            handleOpenSnack()
        }
    }

    const changePassword = async (password) => {
        setLoading(true)
        const response = await api.setNewPassword(mail, time, token, password)
        if (response?.status === 200) {
            setSnackColor('#070')
            setSnackMessage('Senha alterada com sucesso!')
            handleOpenSnack()
            handleCloseRecovery()
            setLoading(false)
        } else {
            setSnackColor('#da1e37')
            setSnackMessage('Link de redefinição de senha inválido ou expirado!')
            handleOpenSnack()
            setLoading(false)
            handleCloseRecovery()
        }
    }

    const initialFormState = {
        email: '',
        password: ''
    }

    const validationSchema = yup.object().shape({
        email: yup.string().email('Entre com seu e-mail').required('O e-mail é obrigatório!'),
        password: yup.string('Entre com sua senha').required('A senha é obrigatória!'),
    })

    const formik = useFormik({
        initialValues: initialFormState,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await signIn(values.email.trim(), values.password.trim())
        }
    })

    const changeMessage = (msg) => {
        setSnackMessage(msg)
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img className={classes.logo} src={logo} alt='' />
                <Typography component="h1" variant="h5">
                    Producer Point
                </Typography>
                <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-mail"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton color='default'>
                                        <EmailIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        id="password"
                        name="password"
                        label="Senha"
                        variant='outlined'
                        fullWidth
                        required
                        type={show ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="current-password"
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        color='default'
                                        onClick={() => setShow(!show)}
                                    >
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Lembrar senha"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >{loadingAuth ? (
                        <CircularProgress color='inherit' size={24} />
                    ) : (
                        <span>Entrar</span>
                    )
                        }
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link onClick={handleOpenForgotPassword} href="#" variant="body2">
                                Esqueceu sua senha?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Quem somos?"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {forgotPassword &&
                <ForgotPasswordModal
                    handleClose={handleCloseForgotPassword}
                    openSnack={handleOpenSnack}
                    open={forgotPassword}
                    title='Recuperar sua senha?'
                    label='Digite seu e-mail cadastrado'
                    labelButton='Enviar'
                    changeMessage={changeMessage}
                    sendEmail={sendEmail}
                    loading={loading}
                />
            }
            {recovery &&
                <RecoveryModal
                    handleClose={handleCloseRecovery}
                    openSnack={handleOpenSnack}
                    open={recovery}
                    title='Crie uma nova senha'
                    changeMessage={changeMessage}
                    changePassword={changePassword}
                    loading={loading}
                />
            }
            {snack &&
                <Snackbar
                    open={snack}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000}
                    onClose={handleCloseSnack}
                >
                    <SnackbarContent
                        style={{ backgroundColor: snackColor ? snackColor : '#070' }}
                        message={
                            <span>
                                {snackMessage}
                            </span>
                        }
                    />
                </Snackbar>
            }
        </Container>
    );
}

export default SignIn

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#070',

        '&:hover': {
            background: '#005200'
        },
    },
    logo: {
        width: 160
    }
}));