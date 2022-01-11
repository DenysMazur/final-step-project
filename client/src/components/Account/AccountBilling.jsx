import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format'
import Select from 'react-select'
import { Button, Typography, Grid, TextField } from '@mui/material'
import { Formik, Form, useFormik } from 'formik'
import { useTheme } from '@mui/styles'
import * as Yup from 'yup'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { userLogin, userRegister } from '../../store/auth/actions'
import { authPersonalUpdate } from '../../api/auth'
import { getCustomer } from '../../api/customer'

const FORM_VALIDATION = Yup.object().shape({
  country: Yup.string().required('Country is required.'),
  city: Yup.string().required('City is required.'),
  address: Yup.string().required('Address is required.'),
  postal: Yup.string().min(5, 'Zip code must be 5 characters').required('Zip code is required.')
})

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      format="+38 (###) ###-####"
      allowEmptyFormatting
      mask="_"
    />
  )
})
const NumberFormatIndexCustom = React.forwardRef(function NumberFormatIndexCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      format="#####"
      allowEmptyFormatting
      mask="-"
    />
  )
})
const cities = [
  {
    value: 'Kyiv'
  },
  {
    value: 'Kharkiv'
  },
  {
    value: 'Lviv'
  },
  {
    value: 'Dnipro'
  }
]

const SelectCustom = React.forwardRef(function SelectCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <Select
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      options={cities}
    />
  )
})

export const AccountBilling = () => {
  const theme = useTheme()
  const formik = useFormik({
    initialValues: {
      country: 'Ukraine',
      city: 'Kyiv',
      address: '',
      postal: ''
    },
    validationSchema: FORM_VALIDATION,
    onSubmit: values => {
      const { country, city, address, postal } = values
      const newDataUser = {
        country,
        city,
        address,
        postal
      }
      authPersonalUpdate(newDataUser)
    }
  })
  useEffect(() => {
    async function fetchData() {
      const { postal, address, city, country } = await getCustomer()
      if (postal) {
        formik.setFieldValue('postal', postal)
      }
      if (address) {
        formik.setFieldValue('address', address)
      }
      if (city) {
        formik.setFieldValue('city', city)
      }
      if (country) {
        formik.setFieldValue('country', country)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // / eslint-disable-next-line react-hooks/exhaustive-deps
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: 'flex',
          columnGap: '60px',
          rowGap: '15px',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'text.primary',
              marginBottom: '15px'
            }}
          >
            Billing Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                type="country"
                id="country"
                name="country"
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                required
                disabled
                size="small"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.country) && formik.touched.country}
                helperText={formik.touched.country && formik.errors.country}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiFormLabel-asterisk': {
                    color: theme.palette.error.main
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City / Town"
                type="city"
                id="city"
                name="city"
                InputLabelProps={{
                  shrink: true
                }}
                select
                fullWidth
                required
                size="small"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.city) && formik.touched.city}
                helperText={formik.touched.city && formik.errors.city}
                InputProps={{
                  inputComponent: SelectCustom
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiFormLabel-asterisk': {
                    color: theme.palette.error.main
                  }
                }}
              >
                {cities.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street address"
                type="address"
                id="address"
                name="address"
                placeholder="Vasilkivska, 56a"
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                required
                size="small"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.address) && formik.touched.address}
                helperText={formik.touched.address && formik.errors.address}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiFormLabel-asterisk': {
                    color: theme.palette.error.main
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Zip"
                type="postal"
                id="postal"
                name="postal"
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                required
                size="small"
                value={formik.values.postal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.postal) && formik.touched.postal}
                helperText={formik.touched.postal && formik.errors.postal}
                InputProps={{
                  inputComponent: NumberFormatIndexCustom
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiFormLabel-asterisk': {
                    color: theme.palette.error.main
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ display: 'block', textTransform: 'capitalize' }}
              >
                Save Change
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  )
}
